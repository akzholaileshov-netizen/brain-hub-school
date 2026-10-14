import { NextResponse } from "next/server";
import { mapAuthError, validateEmail } from "@/lib/auth";
import {
  isSupabaseConfigured,
  SUPABASE_SETUP_MESSAGE,
} from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type Body = {
  email?: string;
  password?: string;
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

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json(
      { error: mapAuthError(error.message) },
      { status: 401 },
    );
  }

  if (!data.session) {
    return NextResponse.json(
      {
        error:
          "Почтаңызды растаңыз. Inbox-тағы хатты ашып, сілтемені басыңыз — содан кейін қайта кіріңіз.",
      },
      { status: 401 },
    );
  }

  return NextResponse.json({
    ok: true,
    redirect: "/dashboard",
  });
}
