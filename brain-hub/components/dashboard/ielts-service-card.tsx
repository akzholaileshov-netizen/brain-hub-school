"use client";

import { Button } from "@/components/ui/button";

type Props = {
  enrolled: boolean;
  prominent: boolean;
};

/** Compact teaser kept for optional reuse; main UX is /dashboard/ielts */
export function IeltsServiceCard({ enrolled, prominent }: Props) {
  return (
    <section
      className={`rounded-2xl border p-6 ${
        prominent
          ? "border-[var(--accent)]/40 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_12%,var(--card)),var(--card)_55%)]"
          : "border-[var(--border)] bg-[var(--card)]"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
        VIP IELTS
      </p>
      <h2 className="mt-2 font-display text-xl font-semibold text-[var(--foreground)]">
        Ағылшын тілі сервисі
      </h2>
      <p className="mt-2 text-sm text-[var(--foreground-soft)]">
        Күйі: {enrolled || prominent ? "Белсенді" : "Өшірулі"}
      </p>
      <Button asChild className="mt-4">
        <a href="/dashboard/ielts">Сервиске өту</a>
      </Button>
    </section>
  );
}
