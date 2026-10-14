import {
  IELTS_MODULES,
  SAMPLE_VIDEO_SRC,
  scoreToBand,
  subjectsForTrack,
  type SubjectSeed,
} from "@/lib/curriculum";
import {
  executeBatch,
  getAll,
  getClient,
  getRow,
  run,
} from "@/lib/db-client";
import type { TrackId } from "@/lib/quiz-data";
import { TRACKS } from "@/lib/quiz-data";

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
  var __brainHubSchemaReady: Promise<void> | undefined;
}

async function seedSubjectContent(trackId: string, subjects: SubjectSeed[]) {
  for (const [sIndex, subject] of subjects.entries()) {
    const subjectInsert = await run(
      `INSERT INTO subjects (track_id, name, slug, sort_order)
       VALUES (?, ?, ?, ?)`,
      [trackId, subject.name, subject.slug, sIndex],
    );
    const subjectId = subjectInsert.lastInsertRowid;

    for (const [vIndex, video] of subject.videos.entries()) {
      await run(
        `INSERT INTO videos (subject_id, title, duration_sec, video_url, sort_order)
         VALUES (?, ?, ?, ?, ?)`,
        [subjectId, video.title, video.durationSec, SAMPLE_VIDEO_SRC, vIndex],
      );
    }

    for (const [aIndex, assessment] of subject.assessments.entries()) {
      const aRes = await run(
        `INSERT INTO assessments (subject_id, type, title, sort_order)
         VALUES (?, ?, ?, ?)`,
        [subjectId, assessment.type, assessment.title, aIndex],
      );
      const assessmentId = aRes.lastInsertRowid;
      for (const [qIndex, question] of assessment.questions.entries()) {
        await run(
          `INSERT INTO assessment_questions
            (assessment_id, prompt, options_json, correct_index, sort_order)
           VALUES (?, ?, ?, ?, ?)`,
          [
            assessmentId,
            question.prompt,
            JSON.stringify(question.options),
            question.correctIndex,
            qIndex,
          ],
        );
      }
    }
  }
}

async function seedAllCurriculum() {
  for (const track of TRACKS) {
    await seedSubjectContent(track.id, subjectsForTrack(track.id));
  }
  await seedSubjectContent("ielts-service", IELTS_MODULES);
}

async function migrateToV3() {
  await executeBatch([
    "DROP TABLE IF EXISTS lesson_progress",
    "DROP TABLE IF EXISTS lessons",
    "DROP TABLE IF EXISTS video_progress",
    "DROP TABLE IF EXISTS assessment_attempts",
    "DROP TABLE IF EXISTS assessment_questions",
    "DROP TABLE IF EXISTS assessments",
    "DROP TABLE IF EXISTS videos",
    "DROP TABLE IF EXISTS subject_progress",
    "DROP TABLE IF EXISTS mentor_bookings",
    "DROP TABLE IF EXISTS ielts_mock_attempts",
    "DROP TABLE IF EXISTS subjects",
    `CREATE TABLE subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      track_id TEXT NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      UNIQUE(track_id, slug)
    )`,
    `CREATE TABLE videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      duration_sec INTEGER NOT NULL,
      video_url TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE TABLE assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE TABLE assessment_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
      prompt TEXT NOT NULL,
      options_json TEXT NOT NULL,
      correct_index INTEGER NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE TABLE video_progress (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      video_id INTEGER NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
      watched INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (student_id, video_id)
    )`,
    `CREATE TABLE assessment_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      percent REAL NOT NULL,
      answers_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE subject_progress (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      percent REAL NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (student_id, subject_id)
    )`,
    `CREATE TABLE mentor_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      slot_at TEXT NOT NULL,
      platform TEXT NOT NULL,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'upcoming',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE ielts_mock_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      percent REAL NOT NULL,
      band REAL NOT NULL,
      answers_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  ]);

  await seedAllCurriculum();

  const students = await getAll<{ id: number; track: TrackId }>(
    "SELECT id, track FROM students",
  );
  for (const student of students) {
    await ensureStudentLearningRows(student.id, student.track);
    await recomputeStudentProgress(student.id);
  }
}

async function ensureSchema() {
  await executeBatch([
    `CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      track TEXT NOT NULL,
      gpa REAL NOT NULL DEFAULT 0,
      ielts_enrolled INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS schema_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`,
  ]);

  const versionRow = await getRow<{ value: string }>(
    "SELECT value FROM schema_meta WHERE key = 'version'",
  );
  const version = versionRow ? Number(versionRow.value) : 0;

  if (version < SCHEMA_VERSION) {
    await migrateToV3();
    await run(
      `INSERT INTO schema_meta (key, value) VALUES ('version', ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      [String(SCHEMA_VERSION)],
    );
  }
}

export async function initDb() {
  if (!global.__brainHubSchemaReady) {
    getClient();
    global.__brainHubSchemaReady = ensureSchema();
  }
  await global.__brainHubSchemaReady;
}

export function isValidTrack(track: string): track is TrackId {
  return TRACKS.some((t) => t.id === track);
}

export async function generateStudentCode(): Promise<string> {
  await initDb();
  for (let attempt = 0; attempt < 40; attempt++) {
    const n = Math.floor(1000 + Math.random() * 9000);
    const code = `BH-2026-${n}`;
    const exists = await getRow<{ ok: number }>(
      "SELECT 1 AS ok FROM students WHERE student_id = ?",
      [code],
    );
    if (!exists) return code;
  }
  throw new Error("student_id_generation_failed");
}

export async function ensureStudentLearningRows(
  studentPk: number,
  track: TrackId,
) {
  await initDb();
  const trackKey = track === "vip-ielts" ? "vip-ielts" : track;
  const subjects = await getAll<{ id: number }>(
    "SELECT id FROM subjects WHERE track_id = ?",
    [trackKey],
  );

  for (const subject of subjects) {
    await run(
      `INSERT OR IGNORE INTO subject_progress (student_id, subject_id, percent)
       VALUES (?, ?, 0)`,
      [studentPk, subject.id],
    );
    await run(
      `INSERT OR IGNORE INTO video_progress (student_id, video_id, watched)
       SELECT ?, v.id, 0 FROM videos v WHERE v.subject_id = ?`,
      [studentPk, subject.id],
    );
  }

  if (track === "vip-ielts") {
    const ieltsSubjects = await getAll<{ id: number }>(
      "SELECT id FROM subjects WHERE track_id = 'ielts-service'",
    );
    for (const subject of ieltsSubjects) {
      await run(
        `INSERT OR IGNORE INTO subject_progress (student_id, subject_id, percent)
         VALUES (?, ?, 0)`,
        [studentPk, subject.id],
      );
      await run(
        `INSERT OR IGNORE INTO video_progress (student_id, video_id, watched)
         SELECT ?, v.id, 0 FROM videos v WHERE v.subject_id = ?`,
        [studentPk, subject.id],
      );
    }
  }
}

async function computeSubjectPercent(studentPk: number, subjectId: number) {
  const videos = await getRow<{ total: number; watched: number }>(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(CASE WHEN vp.watched = 1 THEN 1 ELSE 0 END), 0) AS watched
     FROM videos v
     LEFT JOIN video_progress vp
       ON vp.video_id = v.id AND vp.student_id = ?
     WHERE v.subject_id = ?`,
    [studentPk, subjectId],
  );

  const assessments = await getAll<{ type: string; best: number | null }>(
    `SELECT a.type,
            (
              SELECT MAX(percent) FROM assessment_attempts aa
              WHERE aa.assessment_id = a.id AND aa.student_id = ?
            ) AS best
     FROM assessments a
     WHERE a.subject_id = ?`,
    [studentPk, subjectId],
  );

  const total = Number(videos?.total ?? 0);
  const watched = Number(videos?.watched ?? 0);
  const videoPart = total > 0 ? (watched / total) * 0.4 : 0;

  const avgBest = (rows: Array<{ best: number | null }>) => {
    if (!rows.length) return 0;
    const sum = rows.reduce((acc, row) => acc + Number(row.best ?? 0), 0);
    return sum / rows.length / 100;
  };

  const homeworkPart =
    avgBest(assessments.filter((a) => a.type === "homework")) * 0.3;
  const testPart =
    avgBest(assessments.filter((a) => a.type === "test")) * 0.3;
  return Math.round((videoPart + homeworkPart + testPart) * 1000) / 10;
}

export async function recomputeStudentProgress(studentPk: number) {
  await initDb();
  const student = await getRow<{ track: TrackId; ielts_enrolled: number }>(
    "SELECT track, ielts_enrolled FROM students WHERE id = ?",
    [studentPk],
  );
  if (!student) return { overall: 0, gpa: 2 };

  const trackIds =
    student.track === "vip-ielts"
      ? ["vip-ielts"]
      : student.ielts_enrolled
        ? [student.track, "ielts-service"]
        : [student.track];

  const placeholders = trackIds.map(() => "?").join(",");
  const subjects = await getAll<{ id: number }>(
    `SELECT id FROM subjects WHERE track_id IN (${placeholders})`,
    trackIds,
  );

  let sum = 0;
  for (const subject of subjects) {
    const percent = await computeSubjectPercent(studentPk, subject.id);
    await run(
      `INSERT INTO subject_progress (student_id, subject_id, percent, updated_at)
       VALUES (?, ?, ?, datetime('now'))
       ON CONFLICT(student_id, subject_id)
       DO UPDATE SET percent = excluded.percent, updated_at = excluded.updated_at`,
      [studentPk, subject.id, percent],
    );
    sum += percent;
  }

  const overall = subjects.length ? sum / subjects.length : 0;
  const gpa = Math.round((2 + (overall / 100) * 2) * 100) / 100;
  const capped = Math.min(4, Math.max(2, gpa));
  await run("UPDATE students SET gpa = ? WHERE id = ?", [capped, studentPk]);
  return { overall: Math.round(overall), gpa: capped };
}

export async function seedStudentProgress(
  studentPk: number,
  track: TrackId,
): Promise<number> {
  await ensureStudentLearningRows(studentPk, track);
  const firstVideo = await getRow<{ id: number }>(
    `SELECT v.id FROM videos v
     JOIN subjects s ON s.id = v.subject_id
     WHERE s.track_id = ?
     ORDER BY s.sort_order, v.sort_order
     LIMIT 1`,
    [track === "vip-ielts" ? "vip-ielts" : track],
  );
  if (firstVideo) {
    await run(
      `INSERT INTO video_progress (student_id, video_id, watched)
       VALUES (?, ?, 1)
       ON CONFLICT(student_id, video_id)
       DO UPDATE SET watched = 1, updated_at = datetime('now')`,
      [studentPk, firstVideo.id],
    );
  }
  const { gpa } = await recomputeStudentProgress(studentPk);
  return gpa;
}

export async function getStudentByEmail(email: string) {
  await initDb();
  return getRow<StudentRow>("SELECT * FROM students WHERE email = ?", [
    email.toLowerCase(),
  ]);
}

export async function getStudentById(id: number) {
  await initDb();
  return getRow<StudentRow>("SELECT * FROM students WHERE id = ?", [id]);
}

export async function createStudent(input: {
  studentId: string;
  fullName: string;
  email: string;
  passwordHash: string;
  track: TrackId;
  ieltsEnrolled: number;
}) {
  await initDb();
  const result = await run(
    `INSERT INTO students
      (student_id, full_name, email, password_hash, track, gpa, ielts_enrolled)
     VALUES (?, ?, ?, ?, ?, 0, ?)`,
    [
      input.studentId,
      input.fullName,
      input.email,
      input.passwordHash,
      input.track,
      input.ieltsEnrolled,
    ],
  );
  return result.lastInsertRowid;
}

export async function getDashboardSubjects(
  student: StudentRow,
): Promise<SubjectCard[]> {
  await initDb();
  await ensureStudentLearningRows(student.id, student.track);
  const trackId = student.track === "vip-ielts" ? "vip-ielts" : student.track;

  const rows = await getAll<SubjectCard>(
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
    [student.id, student.id, trackId],
  );

  return rows.map((row) => ({
    ...row,
    id: Number(row.id),
    percent: Number(row.percent),
    videoCount: Number(row.videoCount),
    watchedCount: Number(row.watchedCount),
  }));
}

export async function getSubjectDetail(
  student: StudentRow,
  slug: string,
  scope: "track" | "ielts-service" = "track",
): Promise<SubjectDetail | null> {
  await initDb();
  const trackId =
    scope === "ielts-service"
      ? "ielts-service"
      : student.track === "vip-ielts"
        ? "vip-ielts"
        : student.track;

  const subject = await getRow<{
    id: number;
    name: string;
    slug: string;
    trackId: string;
  }>(
    `SELECT id, name, slug, track_id AS trackId FROM subjects
     WHERE slug = ? AND track_id = ?`,
    [slug, trackId],
  );
  if (!subject) return null;

  const percentRow = await getRow<{ percent: number }>(
    `SELECT percent FROM subject_progress
     WHERE student_id = ? AND subject_id = ?`,
    [student.id, subject.id],
  );

  const videos = await getAll<{
    id: number;
    title: string;
    durationSec: number;
    videoUrl: string;
    watched: number;
  }>(
    `SELECT v.id, v.title, v.duration_sec AS durationSec, v.video_url AS videoUrl,
            COALESCE(vp.watched, 0) AS watched
     FROM videos v
     LEFT JOIN video_progress vp
       ON vp.video_id = v.id AND vp.student_id = ?
     WHERE v.subject_id = ?
     ORDER BY v.sort_order`,
    [student.id, subject.id],
  );

  const assessmentsRaw = await getAll<{
    id: number;
    type: "homework" | "test";
    title: string;
    questionCount: number;
    bestPercent: number | null;
  }>(
    `SELECT a.id, a.type, a.title,
            (SELECT COUNT(*) FROM assessment_questions q WHERE q.assessment_id = a.id) AS questionCount,
            (SELECT MAX(percent) FROM assessment_attempts aa
               WHERE aa.assessment_id = a.id AND aa.student_id = ?) AS bestPercent
     FROM assessments a
     WHERE a.subject_id = ?
     ORDER BY a.sort_order`,
    [student.id, subject.id],
  );

  const assessments = [];
  for (const a of assessmentsRaw) {
    const questions = await getAll<{
      id: number;
      prompt: string;
      optionsJson: string;
    }>(
      `SELECT id, prompt, options_json AS optionsJson
       FROM assessment_questions
       WHERE assessment_id = ?
       ORDER BY sort_order`,
      [a.id],
    );
    assessments.push({
      id: Number(a.id),
      type: a.type,
      title: a.title,
      questionCount: Number(a.questionCount),
      bestPercent:
        a.bestPercent == null ? null : Number(a.bestPercent),
      completed: a.bestPercent != null && Number(a.bestPercent) >= 60,
      questions: questions.map((q) => ({
        id: Number(q.id),
        prompt: q.prompt,
        options: JSON.parse(q.optionsJson) as string[],
      })),
    });
  }

  return {
    id: Number(subject.id),
    name: subject.name,
    slug: subject.slug,
    trackId: subject.trackId as SubjectDetail["trackId"],
    percent: Number(percentRow?.percent ?? 0),
    videos: videos.map((v) => ({
      id: Number(v.id),
      title: v.title,
      durationSec: Number(v.durationSec),
      videoUrl: v.videoUrl,
      watched: Boolean(Number(v.watched)),
    })),
    assessments,
  };
}

export async function markVideoWatched(studentPk: number, videoId: number) {
  await initDb();
  const video = await getRow<{
    id: number;
    subject_id: number;
    track_id: string;
  }>(
    `SELECT v.id, v.subject_id, s.track_id
     FROM videos v JOIN subjects s ON s.id = v.subject_id
     WHERE v.id = ?`,
    [videoId],
  );
  if (!video) return { error: "Бейне табылмады." as const };

  await run(
    `INSERT INTO video_progress (student_id, video_id, watched, updated_at)
     VALUES (?, ?, 1, datetime('now'))
     ON CONFLICT(student_id, video_id)
     DO UPDATE SET watched = 1, updated_at = datetime('now')`,
    [studentPk, videoId],
  );

  const progress = await recomputeStudentProgress(studentPk);
  const subjectPercent = await computeSubjectPercent(
    studentPk,
    Number(video.subject_id),
  );
  return { ok: true as const, subjectPercent, ...progress };
}

export async function submitAssessment(
  studentPk: number,
  assessmentId: number,
  answers: Record<string, number>,
) {
  await initDb();
  const assessment = await getRow<{ id: number; subject_id: number }>(
    "SELECT id, subject_id FROM assessments WHERE id = ?",
    [assessmentId],
  );
  if (!assessment) return { error: "Тапсырма табылмады." as const };

  const questions = await getAll<{ id: number; correctIndex: number }>(
    `SELECT id, correct_index AS correctIndex
     FROM assessment_questions WHERE assessment_id = ?
     ORDER BY sort_order`,
    [assessmentId],
  );

  let score = 0;
  for (const question of questions) {
    if (answers[String(question.id)] === Number(question.correctIndex)) {
      score += 1;
    }
  }
  const total = questions.length;
  const percent = total ? Math.round((score / total) * 100) : 0;

  await run(
    `INSERT INTO assessment_attempts
      (student_id, assessment_id, score, total, percent, answers_json)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      studentPk,
      assessmentId,
      score,
      total,
      percent,
      JSON.stringify(answers),
    ],
  );

  const progress = await recomputeStudentProgress(studentPk);
  const subjectPercent = await computeSubjectPercent(
    studentPk,
    Number(assessment.subject_id),
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

export async function setIeltsEnrollment(
  studentPk: number,
  enrolled: boolean,
) {
  await initDb();
  await run("UPDATE students SET ielts_enrolled = ? WHERE id = ?", [
    enrolled ? 1 : 0,
    studentPk,
  ]);
  const student = (await getStudentById(studentPk))!;
  if (enrolled) {
    const subjects = await getAll<{ id: number }>(
      "SELECT id FROM subjects WHERE track_id = 'ielts-service'",
    );
    for (const subject of subjects) {
      await run(
        `INSERT OR IGNORE INTO subject_progress (student_id, subject_id, percent)
         VALUES (?, ?, 0)`,
        [studentPk, subject.id],
      );
      await run(
        `INSERT OR IGNORE INTO video_progress (student_id, video_id, watched)
         SELECT ?, v.id, 0 FROM videos v WHERE v.subject_id = ?`,
        [studentPk, subject.id],
      );
    }
  }
  await recomputeStudentProgress(studentPk);
  return student;
}

export async function createMentorBooking(
  studentPk: number,
  slotAt: string,
  platform: "zoom" | "meet",
  note?: string,
) {
  await initDb();
  const result = await run(
    `INSERT INTO mentor_bookings (student_id, slot_at, platform, note)
     VALUES (?, ?, ?, ?)`,
    [studentPk, slotAt, platform, note ?? null],
  );
  return result.lastInsertRowid;
}

export async function listMentorBookings(studentPk: number) {
  await initDb();
  return getAll<{
    id: number;
    slotAt: string;
    platform: string;
    note: string | null;
    status: string;
    createdAt: string;
  }>(
    `SELECT id, slot_at AS slotAt, platform, note, status, created_at AS createdAt
     FROM mentor_bookings
     WHERE student_id = ?
     ORDER BY slot_at ASC`,
    [studentPk],
  );
}

export async function submitIeltsMock(
  studentPk: number,
  answers: Record<string, number>,
  questions: Array<{ index: number; correctIndex: number }>,
) {
  await initDb();
  let score = 0;
  for (const question of questions) {
    if (answers[String(question.index)] === question.correctIndex) score += 1;
  }
  const total = questions.length;
  const percent = total ? Math.round((score / total) * 100) : 0;
  const band = scoreToBand(percent);
  const result = await run(
    `INSERT INTO ielts_mock_attempts
      (student_id, score, total, percent, band, answers_json)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [studentPk, score, total, percent, band, JSON.stringify(answers)],
  );
  return {
    id: result.lastInsertRowid,
    score,
    total,
    percent,
    band,
  };
}

export async function listIeltsMocks(studentPk: number) {
  await initDb();
  const rows = await getAll<{
    id: number;
    score: number;
    total: number;
    percent: number;
    band: number;
    createdAt: string;
  }>(
    `SELECT id, score, total, percent, band, created_at AS createdAt
     FROM ielts_mock_attempts
     WHERE student_id = ?
     ORDER BY created_at DESC`,
    [studentPk],
  );
  return rows.map((row) => ({
    ...row,
    id: Number(row.id),
    score: Number(row.score),
    total: Number(row.total),
    percent: Number(row.percent),
    band: Number(row.band),
  }));
}

export async function getIeltsModuleCards(
  student: StudentRow,
): Promise<SubjectCard[]> {
  await initDb();
  const trackId = student.track === "vip-ielts" ? "vip-ielts" : "ielts-service";
  const rows = await getAll<SubjectCard>(
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
    [student.id, student.id, trackId],
  );
  return rows.map((row) => ({
    ...row,
    id: Number(row.id),
    percent: Number(row.percent),
    videoCount: Number(row.videoCount),
    watchedCount: Number(row.watchedCount),
  }));
}

export async function getOverallProgress(student: StudentRow) {
  const subjects = await getDashboardSubjects(student);
  const ieltsExtra =
    student.track !== "vip-ielts" && student.ielts_enrolled
      ? await getIeltsModuleCards(student)
      : [];
  const all = [...subjects, ...ieltsExtra];
  if (!all.length) return 0;
  return Math.round(all.reduce((s, x) => s + x.percent, 0) / all.length);
}
