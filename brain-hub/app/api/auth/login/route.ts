import { NextResponse } from "next/server";
import {
  createSessionToken,
  setSessionCookie,
  validateEmail,
  verifyPassword,
} from "@/lib/auth";
import { getStudentByEmail } from "@/lib/db";

type Body = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { error: "Сұрау дұрыс емес." },
      { status: 400 },
    );
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  const emailError = validateEmail(email);
  if (emailError) {
    return NextResponse.json({ error: emailError }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json(
      { error: "Құпия сөзді енгізіңіз." },
      { status: 400 },
    );
  }

  const student = getStudentByEmail(email);
  if (!student) {
    return NextResponse.json(
      { error: "Почта немесе құпия сөз қате." },
      { status: 401 },
    );
  }

  const ok = await verifyPassword(password, student.password_hash);
  if (!ok) {
    return NextResponse.json(
      { error: "Почта немесе құпия сөз қате." },
      { status: 401 },
    );
  }

  const token = await createSessionToken(student);
  await setSessionCookie(token);

  return NextResponse.json({
    ok: true,
    redirect: "/dashboard",
    studentId: student.student_id,
  });
}
