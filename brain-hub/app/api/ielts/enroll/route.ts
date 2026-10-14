import { NextResponse } from "next/server";
import { readSessionStudent } from "@/lib/auth";
import { setIeltsEnrollment } from "@/lib/db";
import {
  isSupabaseConfigured,
  SUPABASE_SETUP_MESSAGE,
} from "@/lib/supabase/env";

type Body = {
  enrolled?: boolean;
};

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
  await setIeltsEnrollment(enrolled);

  return NextResponse.json({ ok: true, enrolled });
}
