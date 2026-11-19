"use client";

import { BookOpenCheck, LineChart, UserRound } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

export function FormatSection() {
  const { t } = useI18n();
  const items = [
    {
      icon: BookOpenCheck,
      title: t("format.item1.title"),
      text: t("format.item1.text"),
    },
    {
      icon: UserRound,
      title: t("format.item2.title"),
      text: t("format.item2.text"),
    },
    {
      icon: LineChart,
      title: t("format.item3.title"),
      text: t("format.item3.text"),
    },
  ];

  return (
    <section id="format" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {t("format.title")}
          </h2>
          <p className="mt-3 text-base text-[var(--foreground-soft)] sm:text-lg">
            {t("format.subtitle")}
          </p>
        </div>

        <div className="mt-14 grid gap-8 border-t border-[var(--border)] pt-14 md:grid-cols-3 md:gap-10">
          {items.map((item, index) => (
            <div
              key={item.title}
              className="motion-safe:animate-rise"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)] text-[var(--primary)]">
                <item.icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-display text-xl font-semibold text-[var(--foreground)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-soft)] sm:text-base">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
