import { writeFileSync } from "fs";
import {
  IELTS_MODULES,
  subjectsForTrack,
  type SubjectSeed,
} from "../lib/curriculum";
import {
  IELTS_MOCK_PASSAGES,
  IELTS_MOCK_QUESTIONS,
} from "../lib/ielts-mock-data";
import { lookupLessonVideo } from "../lib/lesson-videos";
import { TRACKS } from "../lib/quiz-data";

function esc(s: string) {
  return String(s).replace(/'/g, "''");
}

function sqlVideoUrl(subjectSlug: string, title: string): string {
  const url = lookupLessonVideo(subjectSlug, title).videoUrl;
  if (!url) return "NULL";
  return `'${esc(url)}'`;
}

const blocks: string[] = [];

function emitSubject(trackId: string, subject: SubjectSeed, sIndex: number) {
  const stmts: string[] = [];
  stmts.push(`INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('${esc(trackId)}', '${esc(subject.name)}', '${esc(subject.slug)}', ${sIndex})
    RETURNING id INTO v_subject;`);
  for (let vIndex = 0; vIndex < subject.videos.length; vIndex++) {
    const v = subject.videos[vIndex];
    const urlSql = sqlVideoUrl(subject.slug, v.title);
    stmts.push(`INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, '${esc(v.title)}', ${v.durationSec}, ${urlSql}, ${vIndex});`);
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

const passageById = new Map(IELTS_MOCK_PASSAGES.map((p) => [p.id, p]));

for (let i = 0; i < IELTS_MOCK_QUESTIONS.length; i++) {
  const q = IELTS_MOCK_QUESTIONS[i];
  const opts =
    q.options != null
      ? `'${JSON.stringify(q.options).replace(/'/g, "''")}'::jsonb`
      : "NULL";
  const correct =
    q.correctIndex == null ? "NULL" : String(q.correctIndex);
  const accepted =
    q.acceptedAnswers != null
      ? `'${JSON.stringify(q.acceptedAnswers).replace(/'/g, "''")}'::jsonb`
      : "NULL";
  const passage = q.passageId ? passageById.get(q.passageId) : null;
  blocks.push(`INSERT INTO public.ielts_mock_questions (
  qkey, section, qtype, prompt, options_json, correct_index,
  accepted_answers, explanation_kk, passage_id, passage_title, passage_text, sort_order
) VALUES (
  '${esc(q.id)}', '${esc(q.section)}', '${esc(q.type)}', '${esc(q.text)}',
  ${opts}, ${correct}, ${accepted}, '${esc(q.explanationKk)}',
  ${q.passageId ? `'${esc(q.passageId)}'` : "NULL"},
  ${passage ? `'${esc(passage.title)}'` : "NULL"},
  ${passage ? `'${esc(passage.text)}'` : "NULL"},
  ${i}
);`);
}

const out = [
  "-- Brain Hub curriculum seed (generated from lib/curriculum.ts + lib/lesson-videos.ts + lib/ielts-mock-data.ts)",
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
