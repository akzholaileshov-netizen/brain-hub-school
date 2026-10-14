export const SUPABASE_SETUP_MESSAGE =
  "Supabase бапталмаған. NEXT_PUBLIC_SUPABASE_URL және NEXT_PUBLIC_SUPABASE_ANON_KEY орта айнымалыларын .env файлына қойыңыз. README қараңыз.";

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  return { url, anonKey };
}

export function isSupabaseConfigured() {
  const { url, anonKey } = getSupabaseEnv();
  return Boolean(url && anonKey);
}

/** Placeholder values so clients can be constructed during `next build` without crashing. */
export function getSupabaseEnvOrPlaceholder() {
  const { url, anonKey } = getSupabaseEnv();
  return {
    url: url || "http://127.0.0.1:54321",
    anonKey: anonKey || "public-anon-key",
    configured: Boolean(url && anonKey),
  };
}
