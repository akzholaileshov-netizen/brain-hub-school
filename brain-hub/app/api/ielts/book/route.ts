import { NextResponse } from "next/server";
import { readSessionStudent } from "@/lib/auth";
import { createMentorBooking, listMentorBookings } from "@/lib/db";
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
    bookings: await listMentorBookings(student.id),
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

  let body: { slotAt?: string; platform?: string; note?: string };
  try {
    body = (await request.json()) as {
      slotAt?: string;
      platform?: string;
      note?: string;
    };
  } catch {
    return NextResponse.json({ error: "Сұрау дұрыс емес." }, { status: 400 });
  }

  if (!body.slotAt) {
    return NextResponse.json(
      { error: "Күн мен уақытты таңдаңыз." },
      { status: 400 },
    );
  }
  if (body.platform !== "zoom" && body.platform !== "meet") {
    return NextResponse.json(
      { error: "Платформаны таңдаңыз: Zoom немесе Meet." },
      { status: 400 },
    );
  }

  const result = await createMentorBooking(
    body.slotAt,
    body.platform,
    body.note,
  );
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }

  return NextResponse.json({
    ok: true,
    id: result.id,
    bookings: await listMentorBookings(student.id),
  });
}
