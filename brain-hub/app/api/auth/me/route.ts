import { NextResponse } from "next/server";
import { readSessionStudent } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ authenticated: false, configured: false });
  }

  const student = await readSessionStudent();
  if (!student) {
    return NextResponse.json({ authenticated: false, configured: true });
  }
  return NextResponse.json({
    authenticated: true,
    configured: true,
    student: {
      studentId: student.student_id,
      fullName: student.full_name,
      email: student.email,
      track: student.track,
      gpa: student.gpa,
    },
  });
}
