"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export function StatsSection() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const stats = [
    { value: "2 400+", label: t("stats.grads"), bar: 88 },
    { value: "68%", label: t("stats.grants"), bar: 68 },
    { value: "7.6", label: t("stats.ielts"), bar: 76 },
  ];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="results" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
              {t("stats.title")}
            </h2>
            <p className="mt-3 text-base text-[var(--foreground-soft)] sm:text-lg">
              {t("stats.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        <div ref={ref} className="mt-14 grid gap-4 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delayMs={i * 90}>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-6 py-8">
                <p className="font-display text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-[var(--foreground-soft)] sm:text-base">
                  {stat.label}
                </p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--foreground)]/10">
                  <div
                    className={`bh-bar-fill h-full rounded-full bg-[var(--primary)] ${on ? "is-on" : ""}`}
                    style={{ width: `${stat.bar}%` }}
                  />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
