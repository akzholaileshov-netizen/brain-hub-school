"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";

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
      <div className="mx-auto flex min-h-[72svh] max-w-6xl flex-col justify-center px-4 pb-16 pt-16 sm:min-h-[78svh] sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
        <div className="max-w-2xl motion-safe:animate-rise">
          <p className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl">
            {t("hero.brand")}
          </p>
          <h1 className="mt-6 max-w-xl font-display text-3xl font-semibold leading-[1.15] tracking-tight text-[var(--foreground)] sm:text-4xl md:text-5xl">
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
      </div>
    </section>
  );
}
