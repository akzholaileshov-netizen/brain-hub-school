"use client";

import { useI18n } from "@/components/i18n-provider";
import { getTracks } from "@/lib/i18n/localize";

export function TracksSection() {
  const { locale, t } = useI18n();
  const tracks = getTracks(locale);

  return (
    <section id="tracks" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {t("tracks.title")}
          </h2>
          <p className="mt-3 text-base text-[var(--foreground-soft)] sm:text-lg">
            {t("tracks.subtitle")}
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => (
            <article
              key={track.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-soft transition-colors hover:border-[var(--primary)]/35"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">
                {track.short}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold text-[var(--foreground)]">
                {track.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--foreground-soft)]">
                {track.description}
              </p>
              <p className="mt-4 text-xs font-medium text-[var(--muted-foreground)]">
                {track.focus}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
