import { NextResponse } from "next/server";
import {
  isValidTrack,
  mapAuthError,
  validateEmail,
  validatePassword,
} from "@/lib/auth";
import {
  isSupabaseConfigured,
  SUPABASE_SETUP_MESSAGE,
} from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type Body = {
  fullName?: string;
  email?: string;
  password?: string;
  track?: string;
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: SUPABASE_SETUP_MESSAGE }, { status: 503 });
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

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        track,
      },
    },
  });

  if (error) {
    const status =
      error.message.toLowerCase().includes("already") ||
      error.message.toLowerCase().includes("exists")
        ? 409
        : 400;
    return NextResponse.json({ error: mapAuthError(error.message) }, { status });
  }

  if (data.user && !data.session) {
    return NextResponse.json({
      ok: true,
      needsEmailConfirmation: true,
      message:
        "Тіркелу сәтті. Почтаңызға растау хаты жіберілді. Хатты ашып, сілтемені басыңыз — содан кейін кіріңіз.",
    });
  }

  return NextResponse.json({
    ok: true,
    redirect: "/dashboard",
  });
}
