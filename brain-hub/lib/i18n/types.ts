export type Locale = "kk" | "ru";

export const DEFAULT_LOCALE: Locale = "kk";
export const LOCALE_STORAGE_KEY = "bh-locale";

export function isLocale(value: unknown): value is Locale {
  return value === "kk" || value === "ru";
}
