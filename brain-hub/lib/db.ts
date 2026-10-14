import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { CURRICULUM } from "@/lib/curriculum";
import type { TrackId } from "@/lib/quiz-data";
import { TRACKS } from "@/lib/quiz-data";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "brain-hub.db");

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

export type SubjectWithLessons = {
  id: number;
  name: string;
  lessons: Array<{
    id: number;
    title: string;
    status: "not_started" | "in_progress" | "completed";
  }>;
};

declare global {
  // eslint-disable-next-line no-var
  var __brainHubDb: Database.Database | undefined;
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

    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      track_id TEXT NOT NULL,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS lesson_progress (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'not_started',
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (student_id, lesson_id)
    );
  `);

  const subjectCount = db
    .prepare("SELECT COUNT(*) AS c FROM subjects")
    .get() as { c: number };

  if (subjectCount.c === 0) {
    const insertSubject = db.prepare(
      "INSERT INTO subjects (track_id, name, sort_order) VALUES (?, ?, ?)",
    );
    const insertLesson = db.prepare(
      "INSERT INTO lessons (subject_id, title, sort_order) VALUES (?, ?, ?)",
    );

    const seed = db.transaction(() => {
      for (const track of TRACKS) {
        const subjects = CURRICULUM[track.id];
        subjects.forEach((subject, sIndex) => {
          const result = insertSubject.run(track.id, subject.name, sIndex);
          const subjectId = Number(result.lastInsertRowid);
          subject.lessons.forEach((lesson, lIndex) => {
            insertLesson.run(subjectId, lesson.title, lIndex);
          });
        });
      }
    });
    seed();
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

export function seedStudentProgress(
  db: Database.Database,
  studentPk: number,
  track: TrackId,
): number {
  const lessons = db
    .prepare(
      `SELECT l.id
       FROM lessons l
       JOIN subjects s ON s.id = l.subject_id
       WHERE s.track_id = ?
       ORDER BY s.sort_order, l.sort_order`,
    )
    .all(track) as Array<{ id: number }>;

  const insert = db.prepare(
    `INSERT INTO lesson_progress (student_id, lesson_id, status)
     VALUES (?, ?, ?)`,
  );

  let completed = 0;
  let inProgress = 0;

  lessons.forEach((lesson, index) => {
    let status: "not_started" | "in_progress" | "completed" = "not_started";
    if (index < Math.max(1, Math.floor(lessons.length * 0.35))) {
      status = "completed";
      completed += 1;
    } else if (index === Math.floor(lessons.length * 0.35)) {
      status = "in_progress";
      inProgress += 1;
    }
    insert.run(studentPk, lesson.id, status);
  });

  const total = Math.max(lessons.length, 1);
  const raw = (completed + inProgress * 0.5) / total;
  const gpa = Math.round((2.8 + raw * 1.2) * 100) / 100;
  return Math.min(4, Math.max(2.5, gpa));
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

export function getTrackSubjectsWithProgress(
  studentPk: number,
  track: TrackId,
): SubjectWithLessons[] {
  const db = getDb();
  const subjects = db
    .prepare(
      `SELECT id, name FROM subjects
       WHERE track_id = ?
       ORDER BY sort_order`,
    )
    .all(track) as Array<{ id: number; name: string }>;

  const lessonStmt = db.prepare(
    `SELECT l.id, l.title,
            COALESCE(p.status, 'not_started') AS status
     FROM lessons l
     LEFT JOIN lesson_progress p
       ON p.lesson_id = l.id AND p.student_id = ?
     WHERE l.subject_id = ?
     ORDER BY l.sort_order`,
  );

  return subjects.map((subject) => ({
    id: subject.id,
    name: subject.name,
    lessons: lessonStmt.all(studentPk, subject.id) as SubjectWithLessons["lessons"],
  }));
}

export function setIeltsEnrollment(studentPk: number, enrolled: boolean) {
  getDb()
    .prepare("UPDATE students SET ielts_enrolled = ? WHERE id = ?")
    .run(enrolled ? 1 : 0, studentPk);
}
