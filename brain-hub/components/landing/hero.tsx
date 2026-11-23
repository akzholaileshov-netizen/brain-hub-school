"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import { HeroVisual } from "@/components/landing/hero-visual";
import { BrainHubMark } from "@/components/brand/brain-hub-mark";

type HeroProps = {
  onRegister: () => void;
  onOpenQuiz: () => void;
};

export function Hero({ onRegister, onOpenQuiz }: HeroProps) {
  const { t } = useI18n();
  return (
    <section
      id="top"
      className="relative isolate border-b border-[var(--border)] bg-[var(--background)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 sm:gap-12 sm:px-6 sm:pb-20 sm:pt-18 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pt-20">
        <div className="max-w-2xl motion-safe:animate-rise">
          <div className="mb-5 flex items-center gap-3">
            <BrainHubMark className="h-10 w-10" />
            <p className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl">
              {t("hero.brand")}
            </p>
          </div>
          <h1 className="max-w-xl font-display text-3xl font-semibold leading-[1.15] tracking-tight text-[var(--foreground)] sm:text-4xl md:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--foreground-soft)] sm:text-lg">
            {t("hero.subtitle")}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" type="button" onClick={onOpenQuiz}>
              {t("hero.ctaQuiz")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              type="button"
              onClick={onRegister}
            >
              {t("hero.ctaConsult")}
            </Button>
          </div>
        </div>
        <div className="motion-safe:animate-rise" style={{ animationDelay: "120ms" }}>
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
