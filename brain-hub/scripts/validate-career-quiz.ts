import {
  CAREER_QUESTIONS,
  PROFESSIONS,
  scoreCareerQuiz,
  type CareerQuizOption,
} from "../lib/career-quiz";
import { TRACKS, type TrackId } from "../lib/quiz-data";

const errors: string[] = [];
function fail(msg: string) {
  errors.push(msg);
}

if (CAREER_QUESTIONS.length !== 30) {
  fail(`expected 30 questions, got ${CAREER_QUESTIONS.length}`);
}
if (PROFESSIONS.length < 25) {
  fail(`expected ≥25 professions, got ${PROFESSIONS.length}`);
}

const profIds = new Set(PROFESSIONS.map((p) => p.id));
if (profIds.size !== PROFESSIONS.length) fail("duplicate profession ids");

const tracksSeen = new Set<string>();
for (const p of PROFESSIONS) {
  if (!p.nameKk.trim()) fail(`${p.id}: empty name`);
  if (!p.whyTemplate.trim()) fail(`${p.id}: empty whyTemplate`);
  if (!TRACKS.some((t) => t.id === p.trackId)) fail(`${p.id}: bad track`);
  tracksSeen.add(p.trackId);
}
for (const t of TRACKS) {
  if (!tracksSeen.has(t.id)) fail(`no profession for track ${t.id}`);
}

const qIds = new Set<string>();
const trackHits = new Set<string>();

for (const q of CAREER_QUESTIONS) {
  if (qIds.has(q.id)) fail(`duplicate question ${q.id}`);
  qIds.add(q.id);
  if (!q.question.trim()) fail(`${q.id}: empty question`);
  if (q.options.length !== 4) fail(`${q.id}: need 4 options`);
  const labels = new Set(q.options.map((o) => o.label));
  if (labels.size !== 4) fail(`${q.id}: duplicate option labels`);

  for (const opt of q.options) {
    const trackEntries = Object.entries(opt.trackScores);
    const profEntries = Object.entries(opt.professionScores);
    if (!trackEntries.length) fail(`${q.id}/${opt.label}: no trackScores`);
    if (!profEntries.length) fail(`${q.id}/${opt.label}: no professionScores`);
    for (const [tid, w] of trackEntries) {
      if (!TRACKS.some((t) => t.id === tid)) fail(`${q.id}: bad track ${tid}`);
      if (typeof w !== "number" || w <= 0) fail(`${q.id}: bad track weight`);
      trackHits.add(tid);
    }
    for (const [pid, w] of profEntries) {
      if (!profIds.has(pid)) fail(`${q.id}: unknown profession ${pid}`);
      if (typeof w !== "number" || w <= 0) fail(`${q.id}: bad profession weight`);
    }
  }
}

for (const t of TRACKS) {
  if (!trackHits.has(t.id)) fail(`track ${t.id} never appears in options`);
}

function pickAll(index: number): CareerQuizOption[] {
  return CAREER_QUESTIONS.map((q) => q.options[index]);
}

function pickByTrack(preferred: TrackId): CareerQuizOption[] {
  return CAREER_QUESTIONS.map((q) => {
    let best = q.options[0];
    let bestW = best.trackScores[preferred] ?? 0;
    for (const o of q.options) {
      const w = o.trackScores[preferred] ?? 0;
      if (w > bestW) {
        best = o;
        bestW = w;
      }
    }
    return best;
  });
}

const vectors: Array<{ name: string; answers: CareerQuizOption[] }> = [
  { name: "all-opt0", answers: pickAll(0) },
  { name: "all-opt1", answers: pickAll(1) },
  { name: "all-opt2", answers: pickAll(2) },
  { name: "all-opt3", answers: pickAll(3) },
  ...TRACKS.map((t) => ({
    name: `prefer-${t.id}`,
    answers: pickByTrack(t.id),
  })),
];

for (const v of vectors) {
  const result = scoreCareerQuiz(v.answers);
  if (result.topProfessions.length !== 5) {
    fail(`${v.name}: top length ${result.topProfessions.length}`);
  }
  const ids = result.topProfessions.map((p) => p.profession.id);
  if (new Set(ids).size !== 5) fail(`${v.name}: non-unique top5 ${ids}`);
  const again = scoreCareerQuiz(v.answers).topProfessions.map(
    (p) => p.profession.id,
  );
  if (again.join() !== ids.join()) fail(`${v.name}: unstable ranking`);
}

console.log("career quiz validation");
console.log("questions", CAREER_QUESTIONS.length);
console.log("professions", PROFESSIONS.length);
console.log("tracks hit", [...trackHits].sort().join(", "));
console.log("synthetic vectors", vectors.length);

if (errors.length) {
  console.error("FAILED:");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}
console.log("OK");
