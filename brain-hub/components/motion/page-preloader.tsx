"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { BrainHubMark } from "@/components/brand/brain-hub-mark";

export function PagePreloader() {
  const { t } = useI18n();
  const [done, setDone] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const showMs = reduced ? 120 : 700;
    const hideMs = reduced ? 160 : 420;
    const a = window.setTimeout(() => setDone(true), showMs);
    const b = window.setTimeout(() => setHide(true), showMs + hideMs);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  if (hide) return null;

  return (
    <div
      className={`fixed inset-0 z-[80] flex flex-col items-center justify-center gap-4 bg-[var(--background)] ${
        done ? "pointer-events-none animate-[preloader-fade_420ms_ease_forwards]" : ""
      }`}
      aria-busy={!done}
      aria-live="polite"
    >
      <BrainHubMark className="h-12 w-12 motion-safe:animate-float" />
      <p className="font-display text-sm font-semibold tracking-wide text-[var(--foreground)]">
        Brain Hub
      </p>
      <div className="bh-spinner" aria-hidden />
      <span className="sr-only">{t("anim.loading")}</span>
    </div>
  );
}
