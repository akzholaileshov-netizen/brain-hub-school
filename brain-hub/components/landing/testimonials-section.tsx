"use client";

import { useI18n } from "@/components/i18n-provider";
import { REVIEWS_I18N } from "@/lib/i18n/messages";

export function TestimonialsSection() {
  const { locale, t } = useI18n();
  const reviews = REVIEWS_I18N[locale];

  return (
    <section id="reviews" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {t("reviews.title")}
          </h2>
          <p className="mt-3 text-base text-[var(--foreground-soft)] sm:text-lg">
            {t("reviews.subtitle")}
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <blockquote
              key={review.name}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-soft"
            >
              <p className="text-sm leading-relaxed text-[var(--foreground-soft)] sm:text-base">
                “{review.quote}”
              </p>
              <footer className="mt-6 border-t border-[var(--border)] pt-4">
                <p className="font-display text-base font-semibold text-[var(--foreground)]">
                  {review.name}
                </p>
                <p className="mt-1 text-sm text-[var(--primary)]">
                  {review.result}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
