"use client";

import { Button } from "@/components/ui/button";
import { PRICING_META, PRICING_PLANS } from "@/lib/pricing";

type PricingSectionProps = {
  onRegister?: () => void;
};

export function PricingSection({ onRegister }: PricingSectionProps) {
  return (
    <section id="pricing" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {PRICING_META.titleKk}
          </h2>
          <p className="mt-3 text-base text-[var(--foreground-soft)] sm:text-lg">
            {PRICING_META.subtitleKk}
          </p>
        </div>

        <p className="mt-6 max-w-2xl rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--foreground-soft)]">
          {PRICING_META.disclaimerKk}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {PRICING_PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`flex flex-col rounded-xl border bg-[var(--card)] p-6 shadow-soft ${
                plan.highlight
                  ? "border-[var(--primary)]/50"
                  : "border-[var(--border)]"
              }`}
            >
              {plan.highlight && (
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">
                  Ұсынылатын
                </p>
              )}
              <h3 className="mt-1 font-display text-xl font-semibold text-[var(--foreground)]">
                {plan.nameKk}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-soft)]">
                {plan.blurbKk}
              </p>
              <p className="mt-5 font-display text-2xl font-semibold text-[var(--foreground)]">
                {plan.priceLabel}
              </p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                {PRICING_META.perMonthHintKk}
              </p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-[var(--foreground-soft)]">
                {plan.featuresKk.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <Button
                type="button"
                className="mt-6 w-full sm:w-auto"
                onClick={onRegister}
              >
                {PRICING_META.ctaKk}
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
