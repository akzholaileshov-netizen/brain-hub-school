import { TRACKS, type TrackId } from "@/lib/quiz-data";
import {
  isSupabaseConfigured,
  SUPABASE_SETUP_MESSAGE,
} from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { StudentRow } from "@/lib/db";

export { SUPABASE_SETUP_MESSAGE };

export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Құпия сөз кемінде 8 таңбадан тұруы керек.";
  }
  if (
    !/[A-Za-zА-Яа-яӘәІіҢңҒғҮүҰұҚқӨөҺһ]/.test(password) ||
    !/\d/.test(password)
  ) {
    return "Құпия сөзде әріп пен сан болуы керек.";
  }
  return null;
}

export function validateEmail(email: string): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Почта форматы дұрыс емес.";
  }
  return null;
}

export function isValidTrack(track: string): track is TrackId {
  return TRACKS.some((t) => t.id === track);
}

export function mapAuthError(message: string | undefined): string {
  const m = (message ?? "").toLowerCase();
  if (
    m.includes("already registered") ||
    m.includes("already been registered") ||
    m.includes("user already exists") ||
    m.includes("email address is already")
  ) {
    return "Бұл почтамен аккаунт бар. Кіріңіз немесе басқа почта қолданыңыз.";
  }
  if (
    m.includes("invalid login credentials") ||
    m.includes("invalid credentials") ||
    m.includes("invalid email or password")
  ) {
    return "Почта немесе құпия сөз қате.";
  }
  if (
    m.includes("password") &&
    (m.includes("weak") ||
      m.includes("at least") ||
      m.includes("too short") ||
      m.includes("least 6"))
  ) {
    return "Құпия сөз тым әлсіз. Кемінде 8 таңба, әріп пен сан қолданыңыз.";
  }
  if (
    m.includes("email address") &&
    (m.includes("invalid") || m.includes("is invalid"))
  ) {
    return "Почта форматы қабылданбады. Басқа почта қолданып көріңіз (мысалы, qa.step6.1@…).";
  }
  if (
    m.includes("rate limit") ||
    m.includes("over_email_send_rate_limit") ||
    m.includes("email rate limit")
  ) {
    return "Почта жіберу шегіне жетті. Authentication → Email → Confirm email өшіріңіз немесе бірнеше минуттан кейін қайталап көріңіз.";
  }
  if (m.includes("email not confirmed") || m.includes("not confirmed")) {
    return "Почтаңызды растаңыз. Inbox-тағы хатты ашып, сілтемені басыңыз.";
  }
  if (m.includes("signup is disabled")) {
    return "Тіркелу уақытша өшірілген. Әкімшіге хабарласыңыз.";
  }
  return message?.trim() || "Қате пайда болды. Қайта көріңіз.";
}

export async function readSessionStudent(): Promise<StudentRow | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, student_code, full_name, email, track, gpa, ielts_enrolled, created_at",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id as string,
    student_id: data.student_code as string,
    full_name: data.full_name as string,
    email: data.email as string,
    track: data.track as TrackId,
    gpa: Number(data.gpa),
    ielts_enrolled: Boolean(data.ielts_enrolled),
    created_at: data.created_at as string,
  };
}
