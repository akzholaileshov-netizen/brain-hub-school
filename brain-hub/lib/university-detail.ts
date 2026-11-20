/**
 * Detail + chart metrics for a recommended university.
 * Uses only fields already in `lib/universities.ts` + the student's academic profile.
 * No external rankings or invented scores beyond fit vs catalog thresholds.
 */

import type { CareerQuizResult } from "@/lib/career-quiz";
import type { Locale } from "@/lib/i18n/types";
import { getProfession, getTrack } from "@/lib/i18n/localize";
import type {
  StudentAcademicProfile,
  University,
  UniversityMatch,
} from "@/lib/universities";

export type UniChartMetrics = {
  matchPercent: number;
  /** 0–100: how student GPA compares to catalog minGpa (100 = meets or exceeds). */
  gpaFitPercent: number;
  /** 0–100: IELTS fit vs catalog; 100 if not required or band meets min. */
  ieltsFitPercent: number;
  /** 0–100: share of uni tracks that overlap the quiz track / top professions. */
  trackFitPercent: number;
  studentGpa: number;
  minGpa: number;
  studentIelts: number | null;
  minIelts: number;
  ieltsRequired: boolean;
};

export type UniProgramLabel = {
  id: string;
  label: string;
};

export function buildProgramLabels(
  locale: Locale,
  uni: University,
): UniProgramLabel[] {
  // Programs = catalog tracks already linked to this university (not invented rankings).
  return uni.tracks.map((id) => ({
    id,
    label: getTrack(locale, id).name,
  }));
}

export function buildRelatedMajorLabels(
  locale: Locale,
  uni: University,
): UniProgramLabel[] {
  return uni.professions
    .map((id) => {
      const p = getProfession(locale, id);
      return p ? { id, label: p.nameKk } : null;
    })
    .filter((x): x is UniProgramLabel => Boolean(x));
}

function clampPct(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function computeUniChartMetrics(
  match: UniversityMatch,
  profile: StudentAcademicProfile,
  quiz: CareerQuizResult,
): UniChartMetrics {
  const uni = match.university;
  const gpaGap = profile.gpa - uni.minGpa;
  const gpaFitPercent =
    gpaGap >= 0
      ? 100
      : clampPct(100 + gpaGap * 80); // soft drop below threshold

  let ieltsFitPercent = 100;
  if (uni.ieltsRequired) {
    if (!profile.hasIelts || profile.ieltsBand == null) {
      ieltsFitPercent = 25; // no certificate yet — catalog still recommends with prep note
    } else if (profile.ieltsBand >= uni.minIelts) {
      ieltsFitPercent = 100;
    } else {
      ieltsFitPercent = clampPct(
        100 - (uni.minIelts - profile.ieltsBand) * 35,
      );
    }
  }

  const quizTrack = quiz.track.id;
  const trackHit = uni.tracks.includes(quizTrack) ? 1 : 0;
  const topProfOnUni = quiz.topProfessions.filter((p) =>
    uni.professions.includes(p.profession.id),
  ).length;
  const trackFitPercent = clampPct(
    trackHit * 55 +
      (topProfOnUni / Math.max(quiz.topProfessions.length, 1)) * 45,
  );

  return {
    matchPercent: match.matchPercent,
    gpaFitPercent,
    ieltsFitPercent,
    trackFitPercent,
    studentGpa: profile.gpa,
    minGpa: uni.minGpa,
    studentIelts: profile.hasIelts ? profile.ieltsBand : null,
    minIelts: uni.minIelts,
    ieltsRequired: uni.ieltsRequired,
  };
}
