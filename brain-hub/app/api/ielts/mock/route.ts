import { NextResponse } from "next/server";
import { readSessionStudent } from "@/lib/auth";
import { IELTS_MOCK_QUESTIONS } from "@/lib/curriculum";
import { listIeltsMocks, submitIeltsMock } from "@/lib/db";

export async function GET() {
  const student = await readSessionStudent();
  if (!student) {
    return NextResponse.json(
      { error: "Алдымен жүйеге кіріңіз." },
      { status: 401 },
    );
  }
  return NextResponse.json({
    questions: IELTS_MOCK_QUESTIONS.map((q, index) => ({
      index,
      prompt: q.prompt,
      options: q.options,
    })),
    history: await listIeltsMocks(student.id),
  });
}

export async function POST(request: Request) {
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

  const result = await submitIeltsMock(
    student.id,
    body.answers,
    IELTS_MOCK_QUESTIONS.map((q, index) => ({
      index,
      correctIndex: q.correctIndex,
    })),
  );

  return NextResponse.json({
    ok: true,
    ...result,
    history: await listIeltsMocks(student.id),
  });
}
