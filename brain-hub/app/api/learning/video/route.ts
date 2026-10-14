import { NextResponse } from "next/server";
import { readSessionStudent } from "@/lib/auth";
import { markVideoWatched } from "@/lib/db";
import {
  isSupabaseConfigured,
  SUPABASE_SETUP_MESSAGE,
} from "@/lib/supabase/env";

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

  let body: { videoId?: number };
  try {
    body = (await request.json()) as { videoId?: number };
  } catch {
    return NextResponse.json({ error: "Сұрау дұрыс емес." }, { status: 400 });
  }

  if (!body.videoId) {
    return NextResponse.json(
      { error: "Бейне идентификаторы қажет." },
      { status: 400 },
    );
  }

  const result = await markVideoWatched(body.videoId);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  return NextResponse.json(result);
}
