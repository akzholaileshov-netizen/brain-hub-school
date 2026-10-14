import { NextResponse } from "next/server";
import { readSessionStudent } from "@/lib/auth";
import { IELTS_MOCK_QUESTIONS } from "@/lib/curriculum";
import {
  getPublicIeltsMockQuestions,
  listIeltsMocks,
  submitIeltsMock,
} from "@/lib/db";
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

  const questions = await getPublicIeltsMockQuestions();
  return NextResponse.json({
    questions: questions.length
      ? questions.map((q) => ({
          index: q.index,
          prompt: q.prompt,
          options: q.options,
        }))
      : IELTS_MOCK_QUESTIONS.map((q, index) => ({
          index,
          prompt: q.prompt,
          options: q.options,
        })),
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

  let body: { answers?: Record<string, number> };
  try {
    body = (await request.json()) as { answers?: Record<string, number> };
  } catch {
    return NextResponse.json({ error: "Сұрау дұрыс емес." }, { status: 400 });
  }
  if (!body.answers) {
    return NextResponse.json(
      { error: "Жауаптарды жіберіңіз." },
      { status: 400 },
    );
  }

  const result = await submitIeltsMock(body.answers);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }

  return NextResponse.json({
    ...result,
    history: await listIeltsMocks(student.id),
  });
}
