"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { translate } from "@/lib/i18n/messages";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
  type Locale,
} from "@/lib/i18n/types";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function applyHtmlLang(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale === "ru" ? "ru" : "kk";
}

function readStoredLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE;
}

function getSnapshot(): Locale {
  return readStoredLocale();
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setLocale = useCallback((next: Locale) => {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    applyHtmlLang(next);
    emit();
  }, []);

  // Keep html lang in sync when snapshot changes (including first client read)
  if (typeof document !== "undefined") {
    applyHtmlLang(locale);
  }

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <div
      className={`inline-flex items-center rounded-md border border-[var(--border)] p-0.5 ${className}`}
      role="group"
      aria-label={t("lang.switch")}
    >
      <button
        type="button"
        className={`rounded px-2 py-1 text-xs font-semibold transition-colors ${
          locale === "kk"
            ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
            : "text-[var(--foreground-soft)] hover:text-[var(--foreground)]"
        }`}
        onClick={() => setLocale("kk")}
        aria-pressed={locale === "kk"}
      >
        {t("lang.kk")}
      </button>
      <button
        type="button"
        className={`rounded px-2 py-1 text-xs font-semibold transition-colors ${
          locale === "ru"
            ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
            : "text-[var(--foreground-soft)] hover:text-[var(--foreground)]"
        }`}
        onClick={() => setLocale("ru")}
        aria-pressed={locale === "ru"}
      >
        {t("lang.ru")}
      </button>
    </div>
  );
}
