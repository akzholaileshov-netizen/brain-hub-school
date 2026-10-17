import type { TrackId } from "@/lib/quiz-data";
import { TRACKS } from "@/lib/quiz-data";
import { resolveLessonVideoUrl } from "@/lib/lesson-videos";
import {
  isSupabaseConfigured,
  SUPABASE_SETUP_MESSAGE,
} from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type StudentRow = {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  track: TrackId;
  gpa: number;
  ielts_enrolled: boolean;
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
    /** Playable URL, or null when no verified video is available yet */
    videoUrl: string | null;
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

export function isValidTrack(track: string): track is TrackId {
  return TRACKS.some((t) => t.id === track);
}

async function requireSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error(SUPABASE_SETUP_MESSAGE);
  }
  return createClient();
}

export async function ensureStudentLearningRows(studentId: string) {
  const supabase = await requireSupabase();
  await supabase.rpc("ensure_student_learning_rows", {
    p_student: studentId,
  });
}

export async function getDashboardSubjects(
  student: StudentRow,
): Promise<SubjectCard[]> {
  const supabase = await requireSupabase();
  await ensureStudentLearningRows(student.id);
  const trackId = student.track === "vip-ielts" ? "vip-ielts" : student.track;

  const { data: subjects, error } = await supabase
    .from("subjects")
    .select("id, name, slug, sort_order")
    .eq("track_id", trackId)
    .order("sort_order");

  if (error || !subjects?.length) return [];

  const subjectIds = subjects.map((s) => s.id as number);

  const [{ data: progress }, { data: videos }, { data: watched }] =
    await Promise.all([
      supabase
        .from("subject_progress")
        .select("subject_id, percent")
        .eq("student_id", student.id)
        .in("subject_id", subjectIds),
      supabase
        .from("videos")
        .select("id, subject_id")
        .in("subject_id", subjectIds),
      supabase
        .from("video_progress")
        .select("video_id, watched")
        .eq("student_id", student.id)
        .eq("watched", true),
    ]);

  const percentMap = new Map(
    (progress ?? []).map((p) => [p.subject_id as number, Number(p.percent)]),
  );
  const videoIdsBySubject = new Map<number, number[]>();
  for (const v of videos ?? []) {
    const sid = v.subject_id as number;
    const list = videoIdsBySubject.get(sid) ?? [];
    list.push(v.id as number);
    videoIdsBySubject.set(sid, list);
  }
  const watchedSet = new Set(
    (watched ?? []).map((w) => w.video_id as number),
  );

  return subjects.map((s) => {
    const id = s.id as number;
    const vids = videoIdsBySubject.get(id) ?? [];
    const watchedCount = vids.filter((vid) => watchedSet.has(vid)).length;
    return {
      id,
      name: s.name as string,
      slug: s.slug as string,
      percent: percentMap.get(id) ?? 0,
      videoCount: vids.length,
      watchedCount,
    };
  });
}

export async function getSubjectDetail(
  student: StudentRow,
  slug: string,
  scope: "track" | "ielts-service" = "track",
): Promise<SubjectDetail | null> {
  const supabase = await requireSupabase();
  const trackId =
    scope === "ielts-service"
      ? "ielts-service"
      : student.track === "vip-ielts"
        ? "vip-ielts"
        : student.track;

  const { data: subject } = await supabase
    .from("subjects")
    .select("id, name, slug, track_id")
    .eq("slug", slug)
    .eq("track_id", trackId)
    .maybeSingle();

  if (!subject) return null;

  const subjectId = subject.id as number;

  const videosWithUrl = await supabase
    .from("videos")
    .select("id, title, duration_sec, video_url, sort_order")
    .eq("subject_id", subjectId)
    .order("sort_order");

  // If video_url column is not migrated yet, retry without it and use lesson-videos.ts.
  const videosQuery =
    videosWithUrl.error && /video_url/i.test(videosWithUrl.error.message)
      ? await supabase
          .from("videos")
          .select("id, title, duration_sec, sort_order")
          .eq("subject_id", subjectId)
          .order("sort_order")
      : videosWithUrl;

  const [
    { data: percentRow },
    { data: assessments },
    { data: videoProgress },
    { data: attempts },
  ] = await Promise.all([
    supabase
      .from("subject_progress")
      .select("percent")
      .eq("student_id", student.id)
      .eq("subject_id", subjectId)
      .maybeSingle(),
    supabase
      .from("assessments")
      .select("id, type, title, sort_order")
      .eq("subject_id", subjectId)
      .order("sort_order"),
    supabase
      .from("video_progress")
      .select("video_id, watched")
      .eq("student_id", student.id),
    supabase
      .from("assessment_attempts")
      .select("assessment_id, percent")
      .eq("student_id", student.id),
  ]);

  const videos = videosQuery.data;

  const watchedMap = new Map(
    (videoProgress ?? []).map((vp) => [
      vp.video_id as number,
      Boolean(vp.watched),
    ]),
  );

  const bestByAssessment = new Map<number, number>();
  for (const attempt of attempts ?? []) {
    const aid = attempt.assessment_id as number;
    const pct = Number(attempt.percent);
    const prev = bestByAssessment.get(aid);
    if (prev == null || pct > prev) bestByAssessment.set(aid, pct);
  }

  const assessmentIds = (assessments ?? []).map((a) => a.id as number);
  const { data: publicQuestions } = assessmentIds.length
    ? await supabase
        .from("assessment_questions_public")
        .select("id, assessment_id, prompt, options_json, sort_order")
        .in("assessment_id", assessmentIds)
        .order("sort_order")
    : { data: [] as Array<Record<string, unknown>> };

  const questionsByAssessment = new Map<
    number,
    Array<{ id: number; prompt: string; options: string[] }>
  >();
  for (const q of publicQuestions ?? []) {
    const aid = q.assessment_id as number;
    const list = questionsByAssessment.get(aid) ?? [];
    const options = Array.isArray(q.options_json)
      ? (q.options_json as string[])
      : (JSON.parse(String(q.options_json)) as string[]);
    list.push({
      id: q.id as number,
      prompt: q.prompt as string,
      options,
    });
    questionsByAssessment.set(aid, list);
  }

  return {
    id: subjectId,
    name: subject.name as string,
    slug: subject.slug as string,
    trackId: subject.track_id as SubjectDetail["trackId"],
    percent: Number(percentRow?.percent ?? 0),
    videos: (videos ?? []).map((row) => {
      const v = row as {
        id: number;
        title: string;
        duration_sec: number;
        video_url?: string | null;
      };
      const title = v.title;
      const raw = v.video_url ?? null;
      return {
        id: Number(v.id),
        title,
        durationSec: Number(v.duration_sec),
        videoUrl: resolveLessonVideoUrl(subject.slug as string, title, raw),
        watched: Boolean(watchedMap.get(Number(v.id))),
      };
    }),
    assessments: (assessments ?? []).map((a) => {
      const id = a.id as number;
      const questions = questionsByAssessment.get(id) ?? [];
      const bestPercent = bestByAssessment.get(id) ?? null;
      return {
        id,
        type: a.type as "homework" | "test",
        title: a.title as string,
        questionCount: questions.length,
        bestPercent,
        completed: bestPercent != null && bestPercent >= 60,
        questions,
      };
    }),
  };
}

export async function markVideoWatched(videoId: number) {
  const supabase = await requireSupabase();
  const { data, error } = await supabase.rpc("mark_video_watched", {
    p_video_id: videoId,
  });
  if (error) {
    if (error.message.toLowerCase().includes("not found")) {
      return { error: "Бейне табылмады." as const };
    }
    return { error: "Бейне прогресін сақтау мүмкін болмады." as const };
  }
  const result = data as Record<string, unknown>;
  return {
    ok: true as const,
    subjectPercent: Number(result.subjectPercent ?? 0),
    overall: Number(result.overall ?? 0),
    gpa: Number(result.gpa ?? 2),
  };
}

export async function submitAssessment(
  assessmentId: number,
  answers: Record<string, number>,
) {
  const supabase = await requireSupabase();
  const { data, error } = await supabase.rpc("submit_assessment", {
    p_assessment_id: assessmentId,
    p_answers: answers,
  });
  if (error) {
    if (error.message.toLowerCase().includes("not found")) {
      return { error: "Тапсырма табылмады." as const };
    }
    return { error: "Тестті сақтау мүмкін болмады." as const };
  }
  const result = data as Record<string, unknown>;
  return {
    ok: true as const,
    score: Number(result.score ?? 0),
    total: Number(result.total ?? 0),
    percent: Number(result.percent ?? 0),
    subjectPercent: Number(result.subjectPercent ?? 0),
    overall: Number(result.overall ?? 0),
    gpa: Number(result.gpa ?? 2),
  };
}

export async function setIeltsEnrollment(enrolled: boolean) {
  const supabase = await requireSupabase();
  const { data, error } = await supabase.rpc("set_ielts_enrollment", {
    p_enrolled: enrolled,
  });
  if (error) {
    throw new Error(error.message);
  }
  return data as Record<string, unknown>;
}

export async function createMentorBooking(
  slotAt: string,
  platform: "zoom" | "meet",
  note?: string,
) {
  const supabase = await requireSupabase();
  const { data, error } = await supabase.rpc("create_mentor_booking", {
    p_slot_at: slotAt,
    p_platform: platform,
    p_note: note ?? null,
  });
  if (error) {
    if (error.message.toLowerCase().includes("not enrolled")) {
      return { error: "Алдымен VIP IELTS сервисіне жазылыңыз." as const };
    }
    return { error: "Брондау сақталмады." as const };
  }
  const result = data as { id: number };
  return { ok: true as const, id: Number(result.id) };
}

export async function listMentorBookings(studentId: string) {
  const supabase = await requireSupabase();
  const { data, error } = await supabase
    .from("mentor_bookings")
    .select("id, slot_at, platform, note, status, created_at")
    .eq("student_id", studentId)
    .order("slot_at", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: Number(row.id),
    slotAt: row.slot_at as string,
    platform: row.platform as string,
    note: (row.note as string | null) ?? null,
    status: row.status as string,
    createdAt: row.created_at as string,
  }));
}

export async function submitIeltsMock(answers: Record<string, number>) {
  const supabase = await requireSupabase();
  const { data, error } = await supabase.rpc("submit_ielts_mock", {
    p_answers: answers,
  });
  if (error) {
    if (error.message.toLowerCase().includes("not enrolled")) {
      return { error: "Алдымен VIP IELTS сервисіне жазылыңыз." as const };
    }
    return { error: "Mock-тест сақталмады." as const };
  }
  const result = data as Record<string, unknown>;
  return {
    ok: true as const,
    id: Number(result.id),
    score: Number(result.score ?? 0),
    total: Number(result.total ?? 0),
    percent: Number(result.percent ?? 0),
    band: Number(result.band ?? 5),
  };
}

export async function saveIeltsMockAttempt(input: {
  studentId: string;
  score: number;
  total: number;
  percent: number;
  band: number;
  answers: Record<string, string | number | null>;
  sectionScores: unknown;
  durationSec: number | null;
  review: unknown;
}): Promise<{ ok: true; id: number } | { ok: false; warning: string }> {
  const supabase = await requireSupabase();

  // Prefer extended RPC (migration). Falls back to legacy columns / RPC.
  const extended = await supabase.rpc("save_ielts_mock_attempt", {
    p_score: input.score,
    p_total: input.total,
    p_percent: input.percent,
    p_band: input.band,
    p_answers: input.answers,
    p_section_scores: input.sectionScores,
    p_duration_sec: input.durationSec,
    p_review: input.review,
  });

  if (!extended.error && extended.data) {
    const result = extended.data as Record<string, unknown>;
    return { ok: true, id: Number(result.id) };
  }

  // Direct insert may work if RLS allows; otherwise user must run migration RPC.
  const legacyInsert = await supabase
    .from("ielts_mock_attempts")
    .insert({
      student_id: input.studentId,
      score: input.score,
      total: input.total,
      percent: input.percent,
      band: input.band,
      answers_json: input.answers,
    })
    .select("id")
    .maybeSingle();

  if (!legacyInsert.error && legacyInsert.data) {
    return { ok: true, id: Number(legacyInsert.data.id) };
  }

  // Do NOT fall back to legacy submit_ielts_mock — it scores against old meta
  // questions and would write incorrect history rows.
  return {
    ok: false,
    warning:
      "Нәтиже есептелді, бірақ тарихқа сақтау үшін Supabase SQL Editor-де brain-hub-ielts-migration.sql файлын орындаңыз.",
  };
}

export async function listIeltsMocks(studentId: string) {
  const supabase = await requireSupabase();
  const full = await supabase
    .from("ielts_mock_attempts")
    .select(
      "id, score, total, percent, band, created_at, section_scores, duration_sec",
    )
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  const { data, error } =
    full.error && /section_scores|duration_sec/i.test(full.error.message)
      ? await supabase
          .from("ielts_mock_attempts")
          .select("id, score, total, percent, band, created_at")
          .eq("student_id", studentId)
          .order("created_at", { ascending: false })
      : full;

  if (error || !data) return [];

  return data.map((row) => {
    const r = row as Record<string, unknown>;
    const sectionScores = Array.isArray(r.section_scores)
      ? (r.section_scores as Array<{
          section: "grammar" | "vocabulary" | "reading" | "writing";
          correct: number;
          total: number;
          percent: number;
        }>)
      : null;
    return {
      id: Number(r.id),
      score: Number(r.score),
      total: Number(r.total),
      percent: Number(r.percent),
      band: Number(r.band),
      createdAt: r.created_at as string,
      sectionScores,
      durationSec:
        r.duration_sec == null ? null : Number(r.duration_sec as number),
    };
  });
}

export async function getIeltsModuleCards(
  student: StudentRow,
): Promise<SubjectCard[]> {
  const supabase = await requireSupabase();
  const trackId = student.track === "vip-ielts" ? "vip-ielts" : "ielts-service";

  const { data: subjects, error } = await supabase
    .from("subjects")
    .select("id, name, slug, sort_order")
    .eq("track_id", trackId)
    .order("sort_order");

  if (error || !subjects?.length) return [];

  const subjectIds = subjects.map((s) => s.id as number);
  const [{ data: progress }, { data: videos }, { data: watched }] =
    await Promise.all([
      supabase
        .from("subject_progress")
        .select("subject_id, percent")
        .eq("student_id", student.id)
        .in("subject_id", subjectIds),
      supabase
        .from("videos")
        .select("id, subject_id")
        .in("subject_id", subjectIds),
      supabase
        .from("video_progress")
        .select("video_id, watched")
        .eq("student_id", student.id)
        .eq("watched", true),
    ]);

  const percentMap = new Map(
    (progress ?? []).map((p) => [p.subject_id as number, Number(p.percent)]),
  );
  const videoIdsBySubject = new Map<number, number[]>();
  for (const v of videos ?? []) {
    const sid = v.subject_id as number;
    const list = videoIdsBySubject.get(sid) ?? [];
    list.push(v.id as number);
    videoIdsBySubject.set(sid, list);
  }
  const watchedSet = new Set(
    (watched ?? []).map((w) => w.video_id as number),
  );

  return subjects.map((s) => {
    const id = s.id as number;
    const vids = videoIdsBySubject.get(id) ?? [];
    return {
      id,
      name: s.name as string,
      slug: s.slug as string,
      percent: percentMap.get(id) ?? 0,
      videoCount: vids.length,
      watchedCount: vids.filter((vid) => watchedSet.has(vid)).length,
    };
  });
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

export async function getPublicIeltsMockQuestions() {
  const supabase = await requireSupabase();
  const { data, error } = await supabase
    .from("ielts_mock_questions_public")
    .select("id, prompt, options_json, sort_order")
    .order("sort_order");

  if (error || !data) return [];

  return data.map((q, index) => {
    const options = Array.isArray(q.options_json)
      ? (q.options_json as string[])
      : (JSON.parse(String(q.options_json)) as string[]);
    return {
      index,
      id: q.id as number,
      prompt: q.prompt as string,
      options,
    };
  });
}
