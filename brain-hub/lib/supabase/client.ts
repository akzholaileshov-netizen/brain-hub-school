import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnvOrPlaceholder } from "@/lib/supabase/env";

export function createClient() {
  const { url, anonKey } = getSupabaseEnvOrPlaceholder();
  return createBrowserClient(url, anonKey);
}
