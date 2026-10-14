import { NextResponse } from "next/server";
import { readSessionStudent } from "@/lib/auth";

export async function GET() {
  const student = await readSessionStudent();
  if (!student) {
    return NextResponse.json({ authenticated: false });
  }
  return NextResponse.json({
    authenticated: true,
    student: {
      studentId: student.student_id,
      fullName: student.full_name,
      email: student.email,
      track: student.track,
      gpa: student.gpa,
    },
  });
}
