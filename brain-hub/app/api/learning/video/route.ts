import { NextResponse } from "next/server";
import { readSessionStudent } from "@/lib/auth";
import { markVideoWatched } from "@/lib/db";

export async function POST(request: Request) {
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

  const result = markVideoWatched(student.id, body.videoId);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  return NextResponse.json(result);
}
