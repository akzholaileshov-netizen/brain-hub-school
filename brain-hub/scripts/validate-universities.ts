/**
 * Validate university catalog + scoring invariants.
 * Run: npx tsx scripts/validate-universities.ts
 */

import { CAREER_QUESTIONS, PROFESSIONS, scoreCareerQuiz } from "../lib/career-quiz";
import {
  DEFAULT_ACADEMIC_PROFILE,
  UNIVERSITIES,
  UNIVERSITY_REGIONS,
  recommendUniversities,
  type StudentAcademicProfile,
  type UniversityRegion,
} from "../lib/universities";
import type { TrackId } from "../lib/quiz-data";
import { TRACKS } from "../lib/quiz-data";

const TRACK_IDS = new Set(TRACKS.map((t) => t.id));
const PROF_IDS = new Set(PROFESSIONS.map((p) => p.id));

function fail(msg: string): never {
  console.error("FAIL:", msg);
  process.exit(1);
}

for (const region of UNIVERSITY_REGIONS) {
  const n = UNIVERSITIES.filter((u) => u.kind === region).length;
  if (n !== 5) fail(`${region} universities ${n} !== 5`);
}

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
  if (!u.photoUrl.startsWith("https://")) fail(`${u.id}: photoUrl must be https`);
  if (!u.photoUrl.includes("wikimedia.org")) {
    fail(`${u.id}: photoUrl should be Wikimedia Commons`);
  }
  if (!u.photoFile.trim()) fail(`${u.id}: empty photoFile`);
}

// Cover every track at least once across the full catalog
const hit = new Set<TrackId>();
for (const u of UNIVERSITIES) {
  for (const t of u.tracks) hit.add(t);
}
for (const t of TRACK_IDS) {
  if (!hit.has(t as TrackId)) fail(`catalog missing track coverage: ${t}`);
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

const vectors: Array<{
  label: string;
  track: TrackId;
  profile: StudentAcademicProfile;
}> = [
  {
    label: "info high+ielts",
    track: "info-mat",
    profile: { gpa: 3.9, hasIelts: true, ieltsBand: 7.5 },
  },
  {
    label: "bio mid no-ielts",
    track: "bio-him",
    profile: { gpa: 3.2, hasIelts: false, ieltsBand: null },
  },
  {
    label: "fiz low no-ielts",
    track: "fiz-mat",
    profile: { gpa: 2.6, hasIelts: false, ieltsBand: null },
  },
  {
    label: "geo default skip",
    track: "geo-mat",
    profile: DEFAULT_ACADEMIC_PROFILE,
  },
  {
    label: "law mid ielts",
    track: "law",
    profile: { gpa: 3.4, hasIelts: true, ieltsBand: 6.0 },
  },
  {
    label: "vip high",
    track: "vip-ielts",
    profile: { gpa: 3.7, hasIelts: true, ieltsBand: 8.0 },
  },
];

for (const v of vectors) {
  const quiz = scoreCareerQuiz(syntheticAnswers(v.track));
  const rec = recommendUniversities(quiz, v.profile);
  for (const region of UNIVERSITY_REGIONS) {
    const list = rec[region];
    if (list.length !== 5) fail(`${v.label}: ${region} ${list.length} !== 5`);
    const regionIds = list.map((x) => x.university.id);
    if (new Set(regionIds).size !== 5) {
      fail(`${v.label}: duplicate ${region} ids`);
    }
  }
  const again = recommendUniversities(quiz, v.profile);
  for (const region of UNIVERSITY_REGIONS) {
    for (let i = 0; i < 5; i++) {
      if (again[region][i].university.id !== rec[region][i].university.id) {
        fail(`${v.label}: unstable ${region} ranking`);
      }
    }
  }
}

console.log("OK: 5×5 regional catalog + scoring invariants");
console.log(
  "regions:",
  UNIVERSITY_REGIONS.map(
    (r: UniversityRegion) =>
      `${r}=${UNIVERSITIES.filter((u) => u.kind === r).length}`,
  ).join(" "),
);
