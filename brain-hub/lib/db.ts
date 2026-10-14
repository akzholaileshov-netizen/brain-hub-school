import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import {
  IELTS_MODULES,
  SAMPLE_VIDEO_SRC,
  scoreToBand,
  subjectsForTrack,
  type SubjectSeed,
} from "@/lib/curriculum";
import type { TrackId } from "@/lib/quiz-data";
import { TRACKS } from "@/lib/quiz-data";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "brain-hub.db");
const SCHEMA_VERSION = 3;

export type StudentRow = {
  id: number;
  student_id: string;
  full_name: string;
  email: string;
  password_hash: string;
  track: TrackId;
  gpa: number;
  ielts_enrolled: number;
  created_at: string;
};

export type SubjectCard = {
  id: number;
  name: string;
  slug: string;
  percent: number;
  videoCount: number;
  watchedCount: number;
};

export type SubjectDetail = {
  id: number;
  name: string;
  slug: string;
  trackId: TrackId | "ielts-service";
  percent: number;
  videos: Array<{
    id: number;
    title: string;
    durationSec: number;
    videoUrl: string;
    watched: boolean;
  }>;
  assessments: Array<{
    id: number;
    type: "homework" | "test";
    title: string;
    questionCount: number;
    bestPercent: number | null;
    completed: boolean;
    questions: Array<{
      id: number;
      prompt: string;
      options: string[];
    }>;
  }>;
};

declare global {
  // eslint-disable-next-line no-var
  var __brainHubDb: Database.Database | undefined;
}

function seedSubjectContent(
  db: Database.Database,
  trackId: string,
  subjects: SubjectSeed[],
) {
  const insertSubject = db.prepare(
    `INSERT INTO subjects (track_id, name, slug, sort_order)
     VALUES (?, ?, ?, ?)`,
  );
  const insertVideo = db.prepare(
    `INSERT INTO videos (subject_id, title, duration_sec, video_url, sort_order)
     VALUES (?, ?, ?, ?, ?)`,
  );
  const insertAssessment = db.prepare(
    `INSERT INTO assessments (subject_id, type, title, sort_order)
     VALUES (?, ?, ?, ?)`,
  );
  const insertQuestion = db.prepare(
    `INSERT INTO assessment_questions
      (assessment_id, prompt, options_json, correct_index, sort_order)
     VALUES (?, ?, ?, ?, ?)`,
  );

  subjects.forEach((subject, sIndex) => {
    const result = insertSubject.run(
      trackId,
      subject.name,
      subject.slug,
      sIndex,
    );
    const subjectId = Number(result.lastInsertRowid);

    subject.videos.forEach((video, vIndex) => {
      insertVideo.run(
        subjectId,
        video.title,
        video.durationSec,
        SAMPLE_VIDEO_SRC,
        vIndex,
      );
    });

    subject.assessments.forEach((assessment, aIndex) => {
      const aRes = insertAssessment.run(
        subjectId,
        assessment.type,
        assessment.title,
        aIndex,
      );
      const assessmentId = Number(aRes.lastInsertRowid);
      assessment.questions.forEach((question, qIndex) => {
        insertQuestion.run(
          assessmentId,
          question.prompt,
          JSON.stringify(question.options),
          question.correctIndex,
          qIndex,
        );
      });
    });
  });
}

function seedAllCurriculum(db: Database.Database) {
  for (const track of TRACKS) {
    seedSubjectContent(db, track.id, subjectsForTrack(track.id));
  }
  // Shared IELTS add-on modules for non-VIP students (same content, separate track key)
  seedSubjectContent(db, "ielts-service", IELTS_MODULES);
}

function migrateToV3(db: Database.Database) {
  db.exec(`
    DROP TABLE IF EXISTS lesson_progress;
    DROP TABLE IF EXISTS lessons;
    DROP TABLE IF EXISTS video_progress;
    DROP TABLE IF EXISTS assessment_attempts;
    DROP TABLE IF EXISTS assessment_questions;
    DROP TABLE IF EXISTS assessments;
    DROP TABLE IF EXISTS videos;
    DROP TABLE IF EXISTS subject_progress;
    DROP TABLE IF EXISTS mentor_bookings;
    DROP TABLE IF EXISTS ielts_mock_attempts;
    DROP TABLE IF EXISTS subjects;
  `);

  db.exec(`
    CREATE TABLE subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      track_id TEXT NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      UNIQUE(track_id, slug)
    );

    CREATE TABLE videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      duration_sec INTEGER NOT NULL,
      video_url TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE assessment_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
      prompt TEXT NOT NULL,
      options_json TEXT NOT NULL,
      correct_index INTEGER NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE video_progress (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      video_id INTEGER NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
      watched INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (student_id, video_id)
    );

    CREATE TABLE assessment_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      percent REAL NOT NULL,
      answers_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE subject_progress (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      percent REAL NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (student_id, subject_id)
    );

    CREATE TABLE mentor_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      slot_at TEXT NOT NULL,
      platform TEXT NOT NULL,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'upcoming',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE ielts_mock_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      percent REAL NOT NULL,
      band REAL NOT NULL,
      answers_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  seedAllCurriculum(db);

  const students = db
    .prepare("SELECT id, track FROM students")
    .all() as Array<{ id: number; track: TrackId }>;
  for (const student of students) {
    ensureStudentLearningRows(db, student.id, student.track);
    recomputeStudentProgress(db, student.id);
  }
}

function ensureSchema(db: Database.Database) {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      track TEXT NOT NULL,
      gpa REAL NOT NULL DEFAULT 0,
      ielts_enrolled INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS schema_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  const versionRow = db
    .prepare("SELECT value FROM schema_meta WHERE key = 'version'")
    .get() as { value: string } | undefined;
  const version = versionRow ? Number(versionRow.value) : 0;

  if (version < SCHEMA_VERSION) {
    migrateToV3(db);
    db.prepare(
      `INSERT INTO schema_meta (key, value) VALUES ('version', ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    ).run(String(SCHEMA_VERSION));
  }
}

export function getDb() {
  if (!global.__brainHubDb) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const db = new Database(DB_PATH);
    ensureSchema(db);
    global.__brainHubDb = db;
  }
  return global.__brainHubDb;
}

export function isValidTrack(track: string): track is TrackId {
  return TRACKS.some((t) => t.id === track);
}

export function generateStudentCode(db: Database.Database): string {
  for (let attempt = 0; attempt < 40; attempt++) {
    const n = Math.floor(1000 + Math.random() * 9000);
    const code = `BH-2026-${n}`;
    const exists = db
      .prepare("SELECT 1 FROM students WHERE student_id = ?")
      .get(code);
    if (!exists) return code;
  }
  throw new Error("student_id_generation_failed");
}

function subjectTrackKey(studentTrack: TrackId, ieltsEnrolled: boolean) {
  if (studentTrack === "vip-ielts") return "vip-ielts";
  return studentTrack;
}

export function ensureStudentLearningRows(
  db: Database.Database,
  studentPk: number,
  track: TrackId,
) {
  const trackKey = subjectTrackKey(track, true);
  const subjects = db
    .prepare("SELECT id FROM subjects WHERE track_id = ?")
    .all(trackKey) as Array<{ id: number }>;

  const insertVideoProgress = db.prepare(
    `INSERT OR IGNORE INTO video_progress (student_id, video_id, watched)
     SELECT ?, v.id, 0 FROM videos v WHERE v.subject_id = ?`,
  );
  const insertSubjectProgress = db.prepare(
    `INSERT OR IGNORE INTO subject_progress (student_id, subject_id, percent)
     VALUES (?, ?, 0)`,
  );

  for (const subject of subjects) {
    insertSubjectProgress.run(studentPk, subject.id);
    insertVideoProgress.run(studentPk, subject.id);
  }

  // Also ensure IELTS service rows when enrolled later
  if (track === "vip-ielts") {
    const ieltsSubjects = db
      .prepare("SELECT id FROM subjects WHERE track_id = 'ielts-service'")
      .all() as Array<{ id: number }>;
    for (const subject of ieltsSubjects) {
      insertSubjectProgress.run(studentPk, subject.id);
      insertVideoProgress.run(studentPk, subject.id);
    }
  }
}

function computeSubjectPercent(
  db: Database.Database,
  studentPk: number,
  subjectId: number,
): number {
  const videos = db
    .prepare(
      `SELECT COUNT(*) AS total,
              COALESCE(SUM(CASE WHEN vp.watched = 1 THEN 1 ELSE 0 END), 0) AS watched
       FROM videos v
       LEFT JOIN video_progress vp
         ON vp.video_id = v.id AND vp.student_id = ?
       WHERE v.subject_id = ?`,
    )
    .get(studentPk, subjectId) as { total: number; watched: number };

  const assessments = db
    .prepare(
      `SELECT a.type,
              (
                SELECT MAX(percent) FROM assessment_attempts aa
                WHERE aa.assessment_id = a.id AND aa.student_id = ?
              ) AS best
       FROM assessments a
       WHERE a.subject_id = ?`,
    )
    .all(studentPk, subjectId) as Array<{
    type: string;
    best: number | null;
  }>;

  const videoPart =
    videos.total > 0 ? (videos.watched / videos.total) * 0.4 : 0;

  const avgBest = (rows: Array<{ best: number | null }>) => {
    if (!rows.length) return 0;
    const sum = rows.reduce((acc, row) => acc + (row.best ?? 0), 0);
    return sum / rows.length / 100;
  };

  const homeworkPart =
    avgBest(assessments.filter((a) => a.type === "homework")) * 0.3;
  const testPart =
    avgBest(assessments.filter((a) => a.type === "test")) * 0.3;
  return Math.round((videoPart + homeworkPart + testPart) * 1000) / 10;
}

export function recomputeStudentProgress(
  db: Database.Database,
  studentPk: number,
) {
  const student = db
    .prepare("SELECT track, ielts_enrolled FROM students WHERE id = ?")
    .get(studentPk) as { track: TrackId; ielts_enrolled: number };

  const trackIds =
    student.track === "vip-ielts"
      ? ["vip-ielts"]
      : student.ielts_enrolled
        ? [student.track, "ielts-service"]
        : [student.track];

  const subjects = db
    .prepare(
      `SELECT id FROM subjects WHERE track_id IN (${trackIds.map(() => "?").join(",")})`,
    )
    .all(...trackIds) as Array<{ id: number }>;

  const upsert = db.prepare(
    `INSERT INTO subject_progress (student_id, subject_id, percent, updated_at)
     VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(student_id, subject_id)
     DO UPDATE SET percent = excluded.percent, updated_at = excluded.updated_at`,
  );

  let sum = 0;
  for (const subject of subjects) {
    const percent = computeSubjectPercent(db, studentPk, subject.id);
    upsert.run(studentPk, subject.id, percent);
    sum += percent;
  }

  const overall = subjects.length ? sum / subjects.length : 0;
  const gpa = Math.round((2 + (overall / 100) * 2) * 100) / 100;
  db.prepare("UPDATE students SET gpa = ? WHERE id = ?").run(
    Math.min(4, Math.max(2, gpa)),
    studentPk,
  );

  return { overall: Math.round(overall), gpa };
}

export function seedStudentProgress(
  db: Database.Database,
  studentPk: number,
  track: TrackId,
): number {
  ensureStudentLearningRows(db, studentPk, track);
  // Light head-start: mark first video watched on first subject
  const firstVideo = db
    .prepare(
      `SELECT v.id FROM videos v
       JOIN subjects s ON s.id = v.subject_id
       WHERE s.track_id = ?
       ORDER BY s.sort_order, v.sort_order
       LIMIT 1`,
    )
    .get(track === "vip-ielts" ? "vip-ielts" : track) as
    | { id: number }
    | undefined;
  if (firstVideo) {
    db.prepare(
      `INSERT INTO video_progress (student_id, video_id, watched)
       VALUES (?, ?, 1)
       ON CONFLICT(student_id, video_id)
       DO UPDATE SET watched = 1, updated_at = datetime('now')`,
    ).run(studentPk, firstVideo.id);
  }
  const { gpa } = recomputeStudentProgress(db, studentPk);
  return gpa;
}

export function getStudentByEmail(email: string) {
  return getDb()
    .prepare("SELECT * FROM students WHERE email = ?")
    .get(email.toLowerCase()) as StudentRow | undefined;
}

export function getStudentById(id: number) {
  return getDb()
    .prepare("SELECT * FROM students WHERE id = ?")
    .get(id) as StudentRow | undefined;
}

export function getDashboardSubjects(student: StudentRow): SubjectCard[] {
  const db = getDb();
  ensureStudentLearningRows(db, student.id, student.track);
  const trackId =
    student.track === "vip-ielts" ? "vip-ielts" : student.track;

  const rows = db
    .prepare(
      `SELECT s.id, s.name, s.slug,
              COALESCE(sp.percent, 0) AS percent,
              (SELECT COUNT(*) FROM videos v WHERE v.subject_id = s.id) AS videoCount,
              (SELECT COUNT(*) FROM videos v
                 JOIN video_progress vp ON vp.video_id = v.id AND vp.student_id = ?
               WHERE v.subject_id = s.id AND vp.watched = 1) AS watchedCount
       FROM subjects s
       LEFT JOIN subject_progress sp
         ON sp.subject_id = s.id AND sp.student_id = ?
       WHERE s.track_id = ?
       ORDER BY s.sort_order`,
    )
    .all(student.id, student.id, trackId) as SubjectCard[];

  return rows;
}

export function getSubjectDetail(
  student: StudentRow,
  slug: string,
  scope: "track" | "ielts-service" = "track",
): SubjectDetail | null {
  const db = getDb();
  const trackId =
    scope === "ielts-service"
      ? "ielts-service"
      : student.track === "vip-ielts"
        ? "vip-ielts"
        : student.track;

  const subject = db
    .prepare(
      `SELECT id, name, slug, track_id AS trackId FROM subjects
       WHERE slug = ? AND track_id = ?`,
    )
    .get(slug, trackId) as
    | { id: number; name: string; slug: string; trackId: string }
    | undefined;
  if (!subject) return null;

  const percentRow = db
    .prepare(
      `SELECT percent FROM subject_progress
       WHERE student_id = ? AND subject_id = ?`,
    )
    .get(student.id, subject.id) as { percent: number } | undefined;

  const videos = db
    .prepare(
      `SELECT v.id, v.title, v.duration_sec AS durationSec, v.video_url AS videoUrl,
              COALESCE(vp.watched, 0) AS watched
       FROM videos v
       LEFT JOIN video_progress vp
         ON vp.video_id = v.id AND vp.student_id = ?
       WHERE v.subject_id = ?
       ORDER BY v.sort_order`,
    )
    .all(student.id, subject.id) as Array<{
    id: number;
    title: string;
    durationSec: number;
    videoUrl: string;
    watched: number;
  }>;

  const assessmentsRaw = db
    .prepare(
      `SELECT a.id, a.type, a.title,
              (SELECT COUNT(*) FROM assessment_questions q WHERE q.assessment_id = a.id) AS questionCount,
              (SELECT MAX(percent) FROM assessment_attempts aa
                 WHERE aa.assessment_id = a.id AND aa.student_id = ?) AS bestPercent
       FROM assessments a
       WHERE a.subject_id = ?
       ORDER BY a.sort_order`,
    )
    .all(student.id, subject.id) as Array<{
    id: number;
    type: "homework" | "test";
    title: string;
    questionCount: number;
    bestPercent: number | null;
  }>;

  const questionStmt = db.prepare(
    `SELECT id, prompt, options_json AS optionsJson
     FROM assessment_questions
     WHERE assessment_id = ?
     ORDER BY sort_order`,
  );

  return {
    id: subject.id,
    name: subject.name,
    slug: subject.slug,
    trackId: subject.trackId as SubjectDetail["trackId"],
    percent: percentRow?.percent ?? 0,
    videos: videos.map((v) => ({
      ...v,
      watched: Boolean(v.watched),
    })),
    assessments: assessmentsRaw.map((a) => {
      const questions = (
        questionStmt.all(a.id) as Array<{
          id: number;
          prompt: string;
          optionsJson: string;
        }>
      ).map((q) => ({
        id: q.id,
        prompt: q.prompt,
        options: JSON.parse(q.optionsJson) as string[],
      }));
      return {
        ...a,
        completed: a.bestPercent != null && a.bestPercent >= 60,
        questions,
      };
    }),
  };
}

export function markVideoWatched(studentPk: number, videoId: number) {
  const db = getDb();
  const video = db
    .prepare(
      `SELECT v.id, v.subject_id, s.track_id
       FROM videos v JOIN subjects s ON s.id = v.subject_id
       WHERE v.id = ?`,
    )
    .get(videoId) as
    | { id: number; subject_id: number; track_id: string }
    | undefined;
  if (!video) return { error: "Бейне табылмады." as const };

  db.prepare(
    `INSERT INTO video_progress (student_id, video_id, watched, updated_at)
     VALUES (?, ?, 1, datetime('now'))
     ON CONFLICT(student_id, video_id)
     DO UPDATE SET watched = 1, updated_at = datetime('now')`,
  ).run(studentPk, videoId);

  const progress = recomputeStudentProgress(db, studentPk);
  const subjectPercent = computeSubjectPercent(
    db,
    studentPk,
    video.subject_id,
  );
  return { ok: true as const, subjectPercent, ...progress };
}

export function submitAssessment(
  studentPk: number,
  assessmentId: number,
  answers: Record<string, number>,
) {
  const db = getDb();
  const assessment = db
    .prepare("SELECT id, subject_id FROM assessments WHERE id = ?")
    .get(assessmentId) as { id: number; subject_id: number } | undefined;
  if (!assessment) return { error: "Тапсырма табылмады." as const };

  const questions = db
    .prepare(
      `SELECT id, correct_index AS correctIndex
       FROM assessment_questions WHERE assessment_id = ?
       ORDER BY sort_order`,
    )
    .all(assessmentId) as Array<{ id: number; correctIndex: number }>;

  let score = 0;
  for (const question of questions) {
    if (answers[String(question.id)] === question.correctIndex) score += 1;
  }
  const total = questions.length;
  const percent = total ? Math.round((score / total) * 100) : 0;

  db.prepare(
    `INSERT INTO assessment_attempts
      (student_id, assessment_id, score, total, percent, answers_json)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(
    studentPk,
    assessmentId,
    score,
    total,
    percent,
    JSON.stringify(answers),
  );

  const progress = recomputeStudentProgress(db, studentPk);
  const subjectPercent = computeSubjectPercent(
    db,
    studentPk,
    assessment.subject_id,
  );
  return {
    ok: true as const,
    score,
    total,
    percent,
    subjectPercent,
    ...progress,
  };
}

export function setIeltsEnrollment(studentPk: number, enrolled: boolean) {
  const db = getDb();
  db.prepare("UPDATE students SET ielts_enrolled = ? WHERE id = ?").run(
    enrolled ? 1 : 0,
    studentPk,
  );
  const student = getStudentById(studentPk)!;
  if (enrolled) {
    const subjects = db
      .prepare("SELECT id FROM subjects WHERE track_id = 'ielts-service'")
      .all() as Array<{ id: number }>;
    const insertVideoProgress = db.prepare(
      `INSERT OR IGNORE INTO video_progress (student_id, video_id, watched)
       SELECT ?, v.id, 0 FROM videos v WHERE v.subject_id = ?`,
    );
    const insertSubjectProgress = db.prepare(
      `INSERT OR IGNORE INTO subject_progress (student_id, subject_id, percent)
       VALUES (?, ?, 0)`,
    );
    for (const subject of subjects) {
      insertSubjectProgress.run(studentPk, subject.id);
      insertVideoProgress.run(studentPk, subject.id);
    }
  }
  recomputeStudentProgress(db, studentPk);
  return student;
}

export function createMentorBooking(
  studentPk: number,
  slotAt: string,
  platform: "zoom" | "meet",
  note?: string,
) {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO mentor_bookings (student_id, slot_at, platform, note)
       VALUES (?, ?, ?, ?)`,
    )
    .run(studentPk, slotAt, platform, note ?? null);
  return Number(result.lastInsertRowid);
}

export function listMentorBookings(studentPk: number) {
  return getDb()
    .prepare(
      `SELECT id, slot_at AS slotAt, platform, note, status, created_at AS createdAt
       FROM mentor_bookings
       WHERE student_id = ?
       ORDER BY slot_at ASC`,
    )
    .all(studentPk) as Array<{
    id: number;
    slotAt: string;
    platform: string;
    note: string | null;
    status: string;
    createdAt: string;
  }>;
}

export function submitIeltsMock(
  studentPk: number,
  answers: Record<string, number>,
  questions: Array<{ index: number; correctIndex: number }>,
) {
  const db = getDb();
  let score = 0;
  for (const question of questions) {
    if (answers[String(question.index)] === question.correctIndex) score += 1;
  }
  const total = questions.length;
  const percent = total ? Math.round((score / total) * 100) : 0;
  const band = scoreToBand(percent);
  const result = db
    .prepare(
      `INSERT INTO ielts_mock_attempts
        (student_id, score, total, percent, band, answers_json)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(studentPk, score, total, percent, band, JSON.stringify(answers));
  return {
    id: Number(result.lastInsertRowid),
    score,
    total,
    percent,
    band,
  };
}

export function listIeltsMocks(studentPk: number) {
  return getDb()
    .prepare(
      `SELECT id, score, total, percent, band, created_at AS createdAt
       FROM ielts_mock_attempts
       WHERE student_id = ?
       ORDER BY created_at DESC`,
    )
    .all(studentPk) as Array<{
    id: number;
    score: number;
    total: number;
    percent: number;
    band: number;
    createdAt: string;
  }>;
}

export function getIeltsModuleCards(student: StudentRow): SubjectCard[] {
  const db = getDb();
  const trackId = student.track === "vip-ielts" ? "vip-ielts" : "ielts-service";
  return db
    .prepare(
      `SELECT s.id, s.name, s.slug,
              COALESCE(sp.percent, 0) AS percent,
              (SELECT COUNT(*) FROM videos v WHERE v.subject_id = s.id) AS videoCount,
              (SELECT COUNT(*) FROM videos v
                 JOIN video_progress vp ON vp.video_id = v.id AND vp.student_id = ?
               WHERE v.subject_id = s.id AND vp.watched = 1) AS watchedCount
       FROM subjects s
       LEFT JOIN subject_progress sp
         ON sp.subject_id = s.id AND sp.student_id = ?
       WHERE s.track_id = ?
       ORDER BY s.sort_order`,
    )
    .all(student.id, student.id, trackId) as SubjectCard[];
}

export function getOverallProgress(student: StudentRow) {
  const subjects = getDashboardSubjects(student);
  const ieltsExtra =
    student.track !== "vip-ielts" && student.ielts_enrolled
      ? getIeltsModuleCards(student)
      : [];
  const all = [...subjects, ...ieltsExtra];
  if (!all.length) return 0;
  return Math.round(all.reduce((s, x) => s + x.percent, 0) / all.length);
}
