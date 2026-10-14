import { NextResponse } from "next/server";
import {
  createSessionToken,
  hashPassword,
  setSessionCookie,
  validateEmail,
  validatePassword,
} from "@/lib/auth";
import {
  createStudent,
  generateStudentCode,
  getStudentByEmail,
  getStudentById,
  isValidTrack,
  seedStudentProgress,
} from "@/lib/db";

type Body = {
  fullName?: string;
  email?: string;
  password?: string;
  track?: string;
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

  const fullName = body.fullName?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const track = body.track ?? "";

  if (fullName.length < 2) {
    return NextResponse.json(
      { error: "Аты-жөніңізді енгізіңіз." },
      { status: 400 },
    );
  }

  const emailError = validateEmail(email);
  if (emailError) {
    return NextResponse.json({ error: emailError }, { status: 400 });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 });
  }

  if (!isValidTrack(track)) {
    return NextResponse.json(
      { error: "Дайындық бағытын таңдаңыз." },
      { status: 400 },
    );
  }

  if (await getStudentByEmail(email)) {
    return NextResponse.json(
      {
        error:
          "Бұл почтамен аккаунт бар. Кіріңіз немесе басқа почта қолданыңыз.",
      },
      { status: 409 },
    );
  }

  const studentCode = await generateStudentCode();
  const passwordHash = await hashPassword(password);
  const ieltsEnrolled = track === "vip-ielts" ? 1 : 0;

  const studentPk = await createStudent({
    studentId: studentCode,
    fullName,
    email,
    passwordHash,
    track,
    ieltsEnrolled,
  });
  await seedStudentProgress(studentPk, track);

  const student = await getStudentById(studentPk);
  if (!student) {
    return NextResponse.json(
      { error: "Тіркелу сәтсіз аяқталды." },
      { status: 500 },
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
