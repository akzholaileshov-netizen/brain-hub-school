"use client";

import { useI18n } from "@/components/i18n-provider";

export function StatsSection() {
  const { t } = useI18n();
  const stats = [
    { value: "2 400+", label: t("stats.grads") },
    { value: "68%", label: t("stats.grants") },
    { value: "7.6", label: t("stats.ielts") },
  ];

  return (
    <section id="results" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {t("stats.title")}
          </h2>
          <p className="mt-3 text-base text-[var(--foreground-soft)] sm:text-lg">
            {t("stats.subtitle")}
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-6 py-8"
            >
              <p className="font-display text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--foreground-soft)] sm:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
