"use client";

import { useI18n } from "@/components/i18n-provider";
import { getTracks } from "@/lib/i18n/localize";

/** Animated interactive banner of preparation tracks. */
export function TrackMarquee() {
  const { locale, t } = useI18n();
  const tracks = getTracks(locale);
  const items = [...tracks, ...tracks];

  return (
    <section
      aria-label={t("anim.marqueeLabel")}
      className="bh-marquee border-y border-[var(--border)] bg-[var(--muted)]/60 py-3"
    >
      <div className="overflow-hidden">
        <div className="bh-marquee-track gap-3 px-3">
          {items.map((track, i) => (
            <span
              key={`${track.id}-${i}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-sm transition-colors hover:border-[var(--primary)]/50 hover:text-[var(--primary)]"
            >
              <span
                className="h-2 w-2 rounded-full bg-[var(--primary)]"
                aria-hidden
              />
              {track.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
