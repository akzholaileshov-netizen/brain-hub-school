"use client";

const SETUP_MESSAGE =
  "Supabase бапталмаған. NEXT_PUBLIC_SUPABASE_URL және NEXT_PUBLIC_SUPABASE_ANON_KEY орта айнымалыларын .env файлына қойыңыз. README қараңыз.";

export function SupabaseSetupBanner() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
  if (configured) return null;

  return (
    <div className="relative z-50 border-b border-amber-300/60 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950">
      <strong className="font-semibold">Баптау қажет:</strong> {SETUP_MESSAGE}
    </div>
  );
}
