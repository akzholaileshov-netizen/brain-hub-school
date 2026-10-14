import { writeFileSync } from "fs";
import {
  IELTS_MODULES,
  IELTS_MOCK_QUESTIONS,
  SAMPLE_VIDEO_SRC,
  subjectsForTrack,
  type SubjectSeed,
} from "../lib/curriculum";
import { TRACKS } from "../lib/quiz-data";

function esc(s: string) {
  return String(s).replace(/'/g, "''");
}

const blocks: string[] = [];

function emitSubject(trackId: string, subject: SubjectSeed, sIndex: number) {
  const stmts: string[] = [];
  stmts.push(`INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('${esc(trackId)}', '${esc(subject.name)}', '${esc(subject.slug)}', ${sIndex})
    RETURNING id INTO v_subject;`);
  for (let vIndex = 0; vIndex < subject.videos.length; vIndex++) {
    const v = subject.videos[vIndex];
    stmts.push(`INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, '${esc(v.title)}', ${v.durationSec}, '${esc(SAMPLE_VIDEO_SRC)}', ${vIndex});`);
  }
  for (let aIndex = 0; aIndex < subject.assessments.length; aIndex++) {
    const a = subject.assessments[aIndex];
    stmts.push(`INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, '${esc(a.type)}', '${esc(a.title)}', ${aIndex})
      RETURNING id INTO v_assessment;`);
    for (let qIndex = 0; qIndex < a.questions.length; qIndex++) {
      const q = a.questions[qIndex];
      const opts = JSON.stringify(q.options).replace(/'/g, "''");
      stmts.push(`INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '${esc(q.prompt)}', '${opts}'::jsonb, ${q.correctIndex}, ${qIndex});`);
    }
  }
  blocks.push(`DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  ${stmts.join("\n  ")}
END $$;`);
}

for (const track of TRACKS) {
  const subjects = subjectsForTrack(track.id);
  subjects.forEach((subject, sIndex) => emitSubject(track.id, subject, sIndex));
}

IELTS_MODULES.forEach((subject, sIndex) =>
  emitSubject("ielts-service", subject, sIndex),
);

for (let i = 0; i < IELTS_MOCK_QUESTIONS.length; i++) {
  const q = IELTS_MOCK_QUESTIONS[i];
  const opts = JSON.stringify(q.options).replace(/'/g, "''");
  blocks.push(`INSERT INTO public.ielts_mock_questions (prompt, options_json, correct_index, sort_order)
VALUES ('${esc(q.prompt)}', '${opts}'::jsonb, ${q.correctIndex}, ${i});`);
}

const out = [
  "-- Brain Hub curriculum seed (generated from lib/curriculum.ts)",
  "-- Safe to re-run: truncates catalog tables first.",
  "TRUNCATE public.ielts_mock_questions, public.assessment_questions, public.assessments, public.videos, public.subjects RESTART IDENTITY CASCADE;",
  "",
  ...blocks,
  "",
].join("\n");

writeFileSync("supabase/seed.sql", out);
console.log(
  "Wrote supabase/seed.sql",
  out.length,
  "bytes;",
  blocks.length,
  "statements",
);
