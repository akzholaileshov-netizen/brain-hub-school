import { NextResponse } from "next/server";
import { readSessionStudent } from "@/lib/auth";
import { submitAssessment } from "@/lib/db";

export async function POST(request: Request) {
  const student = await readSessionStudent();
  if (!student) {
    return NextResponse.json(
      { error: "Алдымен жүйеге кіріңіз." },
      { status: 401 },
    );
  }

  let body: { assessmentId?: number; answers?: Record<string, number> };
  try {
    body = (await request.json()) as {
      assessmentId?: number;
      answers?: Record<string, number>;
    };
  } catch {
    return NextResponse.json({ error: "Сұрау дұрыс емес." }, { status: 400 });
  }

  if (!body.assessmentId || !body.answers) {
    return NextResponse.json(
      { error: "Жауаптар толық емес." },
      { status: 400 },
    );
  }

  const result = submitAssessment(student.id, body.assessmentId, body.answers);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  return NextResponse.json(result);
}
