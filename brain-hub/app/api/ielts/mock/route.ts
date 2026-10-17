import { NextResponse } from "next/server";
import { readSessionStudent } from "@/lib/auth";
import {
  getPublicMockQuestions,
  getPublicPassages,
  scoreIeltsMock,
} from "@/lib/ielts-mock-data";
import { listIeltsMocks, saveIeltsMockAttempt } from "@/lib/db";
import {
  isSupabaseConfigured,
  SUPABASE_SETUP_MESSAGE,
} from "@/lib/supabase/env";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: SUPABASE_SETUP_MESSAGE }, { status: 503 });
  }

  const student = await readSessionStudent();
  if (!student) {
    return NextResponse.json(
      { error: "Алдымен жүйеге кіріңіз." },
      { status: 401 },
    );
  }

  return NextResponse.json({
    questions: getPublicMockQuestions(),
    passages: getPublicPassages(),
    history: await listIeltsMocks(student.id),
  });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: SUPABASE_SETUP_MESSAGE }, { status: 503 });
  }

  const student = await readSessionStudent();
  if (!student) {
    return NextResponse.json(
      { error: "Алдымен жүйеге кіріңіз." },
      { status: 401 },
    );
  }
  if (!student.ielts_enrolled && student.track !== "vip-ielts") {
    return NextResponse.json(
      { error: "Алдымен VIP IELTS сервисіне жазылыңыз." },
      { status: 403 },
    );
  }

  let body: {
    answers?: Record<string, string | number | null>;
    durationSec?: number;
    autoSubmit?: boolean;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Сұрау дұрыс емес." }, { status: 400 });
  }
  if (!body.answers || typeof body.answers !== "object") {
    return NextResponse.json(
      { error: "Жауаптарды жіберіңіз." },
      { status: 400 },
    );
  }

  // Score only on the server — correct answers never leave this module pre-submit.
  const scored = scoreIeltsMock(body.answers);
  const durationSec =
    typeof body.durationSec === "number" && body.durationSec >= 0
      ? Math.round(body.durationSec)
      : null;

  const saved = await saveIeltsMockAttempt({
    studentId: student.id,
    score: scored.score,
    total: scored.total,
    percent: scored.percent,
    band: scored.band,
    answers: body.answers,
    sectionScores: scored.sectionScores,
    durationSec,
    review: scored.review,
  });

  return NextResponse.json({
    ok: true,
    ...scored,
    durationSec,
    saved: saved.ok,
    saveWarning: saved.ok ? undefined : saved.warning,
    history: await listIeltsMocks(student.id),
  });
}
