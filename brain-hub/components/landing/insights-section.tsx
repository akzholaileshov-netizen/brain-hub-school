"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { useI18n } from "@/components/i18n-provider";

const BARS = [
  { key: "anim.chartGrant", value: 68 },
  { key: "anim.chartIelts", value: 76 },
  { key: "anim.chartRetention", value: 91 },
] as const;

const PHOTOS = [
  {
    src: "/media/campus-nu.webp",
    // Source: Wikimedia Commons — File:Nazarbayev University 2.jpg
    altKey: "anim.photoNu",
  },
  {
    src: "/media/campus-mit.webp",
    // Source: Wikimedia Commons — File:MIT from Harvard Bridge (4713031548).jpg
    altKey: "anim.photoMit",
  },
  {
    src: "/media/campus-cambridge.webp",
    // Source: Wikimedia Commons — File:Kings College Cambridge Chapel from the river.jpg
    altKey: "anim.photoCambridge",
  },
] as const;

export function InsightsSection() {
  const { t } = useI18n();
  const chartRef = useRef<HTMLDivElement>(null);
  const [barsOn, setBarsOn] = useState(false);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setBarsOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="insights"
      className="scroll-mt-24 border-b border-[var(--border)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
            {t("anim.insightsEyebrow")}
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {t("anim.insightsTitle")}
          </h2>
          <p className="mt-3 max-w-lg text-base text-[var(--foreground-soft)]">
            {t("anim.insightsSubtitle")}
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
          <ScrollReveal delayMs={80}>
            <div
              ref={chartRef}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-soft sm:p-6"
            >
              <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                {t("anim.chartTitle")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {t("anim.chartHint")}
              </p>
              <div className="mt-6 space-y-4">
                {BARS.map((bar) => (
                  <div key={bar.key}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="text-[var(--foreground)]">
                        {t(bar.key)}
                      </span>
                      <span className="font-semibold text-[var(--foreground)]">
                        {bar.value}%
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-[var(--foreground)]/10">
                      <div
                        className={`bh-bar-fill h-full rounded-full bg-[var(--primary)] ${barsOn ? "is-on" : ""}`}
                        style={{ width: `${bar.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Vector comparison diagram */}
              <svg
                viewBox="0 0 320 120"
                className="mt-8 w-full text-[var(--primary)]"
                role="img"
                aria-label={t("anim.diagramAlt")}
              >
                <text
                  x="0"
                  y="14"
                  className="fill-[var(--muted-foreground)]"
                  style={{ fontSize: 11 }}
                >
                  {t("anim.diagramLabel")}
                </text>
                <path
                  d="M20 90 C 70 90, 70 40, 120 40 S 170 90, 220 55 S 270 30, 300 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.7"
                />
                <circle cx="120" cy="40" r="5" fill="currentColor" />
                <circle cx="220" cy="55" r="5" fill="currentColor" />
                <circle cx="300" cy="30" r="5" fill="currentColor" />
                <line
                  x1="20"
                  y1="100"
                  x2="300"
                  y2="100"
                  stroke="var(--border)"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="left" delayMs={140}>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {PHOTOS.map((photo) => (
                <figure
                  key={photo.src}
                  className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--muted)]"
                >
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={photo.src}
                      alt={t(photo.altKey)}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 420px"
                      className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />
                  </div>
                </figure>
              ))}
              <p className="text-[10px] leading-snug text-[var(--muted-foreground)]">
                {t("anim.photoCredit")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
