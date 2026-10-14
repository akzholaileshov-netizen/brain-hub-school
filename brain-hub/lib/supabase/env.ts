export const SUPABASE_SETUP_MESSAGE =
  "Supabase бапталмаған. NEXT_PUBLIC_SUPABASE_URL және NEXT_PUBLIC_SUPABASE_ANON_KEY орта айнымалыларын .env файлына қойыңыз. README қараңыз.";

/** Normalize project URL: trim, strip quotes, trailing slashes, accidental API paths. */
export function normalizeSupabaseUrl(raw: string): string {
  let url = raw.trim().replace(/^['"]|['"]$/g, "");
  // Common mis-copy from dashboard / docs
  url = url.replace(/\/+$/, "");
  url = url.replace(/\/rest\/v1$/i, "");
  url = url.replace(/\/auth\/v1$/i, "");
  url = url.replace(/\/+$/, "");
  return url;
}

export function getSupabaseEnv() {
  const url = normalizeSupabaseUrl(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  );
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
