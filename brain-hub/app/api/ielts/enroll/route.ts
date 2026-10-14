import { NextResponse } from "next/server";
import { readSessionStudent } from "@/lib/auth";
import { setIeltsEnrollment } from "@/lib/db";

type Body = {
  enrolled?: boolean;
};

export async function POST(request: Request) {
  const student = await readSessionStudent();
  if (!student) {
    return NextResponse.json(
      { error: "Алдымен жүйеге кіріңіз." },
      { status: 401 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { error: "Сұрау дұрыс емес." },
      { status: 400 },
    );
  }

  const enrolled = Boolean(body.enrolled);
  await setIeltsEnrollment(student.id, enrolled);

  return NextResponse.json({ ok: true, enrolled });
}
