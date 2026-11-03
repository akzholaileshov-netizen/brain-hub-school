/**
 * Validate university catalog + scoring invariants.
 * Run: npx tsx scripts/validate-universities.ts
 */

import { CAREER_QUESTIONS, PROFESSIONS, scoreCareerQuiz } from "../lib/career-quiz";
import {
  DEFAULT_ACADEMIC_PROFILE,
  UNIVERSITIES,
  recommendUniversities,
  type StudentAcademicProfile,
} from "../lib/universities";
import type { TrackId } from "../lib/quiz-data";
import { TRACKS } from "../lib/quiz-data";

const TRACK_IDS = new Set(TRACKS.map((t) => t.id));
const PROF_IDS = new Set(PROFESSIONS.map((p) => p.id));

function fail(msg: string): never {
  console.error("FAIL:", msg);
  process.exit(1);
}

const world = UNIVERSITIES.filter((u) => u.kind === "world");
const kz = UNIVERSITIES.filter((u) => u.kind === "kz");

if (world.length < 25) fail(`world universities ${world.length} < 25`);
if (kz.length < 10) fail(`kz universities ${kz.length} < 10`);

const ids = new Set<string>();
for (const u of UNIVERSITIES) {
  if (ids.has(u.id)) fail(`duplicate university id ${u.id}`);
  ids.add(u.id);
  if (!u.nameKk.trim()) fail(`${u.id}: empty nameKk`);
  if (!u.country.trim() || !u.city.trim()) fail(`${u.id}: missing country/city`);
  if (u.tracks.length === 0) fail(`${u.id}: no tracks`);
  for (const t of u.tracks) {
    if (!TRACK_IDS.has(t)) fail(`${u.id}: unknown track ${t}`);
  }
  for (const p of u.professions) {
    if (!PROF_IDS.has(p)) fail(`${u.id}: unknown profession ${p}`);
  }
  if (u.minGpa < 0 || u.minGpa > 4) fail(`${u.id}: minGpa out of range`);
  if (u.minIelts < 0 || u.minIelts > 9) fail(`${u.id}: minIelts out of range`);
  if (!u.notesKk.trim()) fail(`${u.id}: empty notesKk`);
}

// Cover every track at least once in world and kz
for (const kind of ["world", "kz"] as const) {
  const hit = new Set<TrackId>();
  for (const u of UNIVERSITIES.filter((x) => x.kind === kind)) {
    for (const t of u.tracks) hit.add(t);
  }
  for (const t of TRACK_IDS) {
    if (!hit.has(t as TrackId)) fail(`${kind} missing track coverage: ${t}`);
  }
}

function syntheticAnswers(prefer: TrackId) {
  return CAREER_QUESTIONS.map((q) => {
    let best = q.options[0];
    let bestScore = -1;
    for (const opt of q.options) {
      const s = opt.trackScores[prefer] ?? 0;
      if (s > bestScore) {
        bestScore = s;
        best = opt;
      }
    }
    return best;
  });
}

const vectors: Array<{ label: string; track: TrackId; profile: StudentAcademicProfile }> = [
  { label: "info high+ielts", track: "info-mat", profile: { gpa: 3.9, hasIelts: true, ieltsBand: 7.5 } },
  { label: "bio mid no-ielts", track: "bio-him", profile: { gpa: 3.2, hasIelts: false, ieltsBand: null } },
  { label: "fiz low no-ielts", track: "fiz-mat", profile: { gpa: 2.6, hasIelts: false, ieltsBand: null } },
  { label: "geo default skip", track: "geo-mat", profile: DEFAULT_ACADEMIC_PROFILE },
  { label: "law mid ielts", track: "law", profile: { gpa: 3.4, hasIelts: true, ieltsBand: 6.0 } },
  { label: "vip high", track: "vip-ielts", profile: { gpa: 3.7, hasIelts: true, ieltsBand: 8.0 } },
];

for (const v of vectors) {
  const quiz = scoreCareerQuiz(syntheticAnswers(v.track));
  const rec = recommendUniversities(quiz, v.profile);
  if (rec.world.length !== 10) fail(`${v.label}: world ${rec.world.length} !== 10`);
  if (rec.kz.length !== 5) fail(`${v.label}: kz ${rec.kz.length} !== 5`);
  const wIds = rec.world.map((x) => x.university.id);
  const kIds = rec.kz.map((x) => x.university.id);
  if (new Set(wIds).size !== 10) fail(`${v.label}: duplicate world ids`);
  if (new Set(kIds).size !== 5) fail(`${v.label}: duplicate kz ids`);
  // stable: re-run identical
  const again = recommendUniversities(quiz, v.profile);
  for (let i = 0; i < 10; i++) {
    if (again.world[i].university.id !== rec.world[i].university.id) {
      fail(`${v.label}: unstable world ranking`);
    }
  }
  for (let i = 0; i < 5; i++) {
    if (again.kz[i].university.id !== rec.kz[i].university.id) {
      fail(`${v.label}: unstable kz ranking`);
    }
  }
}

console.log("university validation");
console.log("world", world.length);
console.log("kz", kz.length);
console.log("total", UNIVERSITIES.length);
console.log("synthetic vectors", vectors.length);
console.log("OK");
