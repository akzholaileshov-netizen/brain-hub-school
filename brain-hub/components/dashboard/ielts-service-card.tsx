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
          ? "border-[var(--coral)]/35 bg-[linear-gradient(135deg,#fff7f4,#ffffff_55%)]"
          : "border-[var(--teal-deep)]/10 bg-[var(--surface)]"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--coral)]">
        VIP IELTS
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--teal-deep)]">
        Ағылшын тілі сервисі
      </h2>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">
        Күйі: {enrolled || prominent ? "Белсенді" : "Өшірулі"}
      </p>
      <Button asChild className="mt-4" variant="accent">
        <a href="/dashboard/ielts">Сервиске өту</a>
      </Button>
    </section>
  );
}
