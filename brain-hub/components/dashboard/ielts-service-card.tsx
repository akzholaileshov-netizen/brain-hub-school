"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IELTS_SERVICE_LESSONS } from "@/lib/curriculum";

type Props = {
  enrolled: boolean;
  prominent: boolean;
};

export function IeltsServiceCard({ enrolled, prominent }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(enrolled);

  async function toggle() {
    setLoading(true);
    try {
      const next = !current;
      const res = await fetch("/api/ielts/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrolled: next }),
      });
      if (res.ok) {
        setCurrent(next);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className={`rounded-2xl border p-6 sm:p-8 ${
        prominent
          ? "border-[var(--coral)]/35 bg-[linear-gradient(135deg,#fff7f4,#ffffff_55%)]"
          : "border-[var(--teal-deep)]/10 bg-[var(--surface)]"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--coral)]">
        Қосымша сервис
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--teal-deep)]">
        VIP IELTS / Ағылшын тілі
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">
        {prominent
          ? "Сіз VIP IELTS бағытындасыз — ағылшын сервисі негізгі модуліңізбен бірге қолжетімді."
          : "Негізгі бағытыңызға қоса IELTS дайындығын қосыңыз: жазу тексеруі, speaking mock және диагностика."}
      </p>

      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {IELTS_SERVICE_LESSONS.map((item) => (
          <li
            key={item}
            className="rounded-lg bg-white/80 px-3 py-2 text-sm text-[var(--ink-soft)]"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant={current ? "secondary" : "accent"}
          onClick={toggle}
          disabled={loading}
        >
          {loading
            ? "Сақталуда…"
            : current
              ? "Сервистен бас тарту"
              : "Сервиске жазылу"}
        </Button>
        <p className="text-sm font-medium text-[var(--teal-mid)]">
          Күйі: {current ? "Белсенді" : "Өшірулі"}
        </p>
      </div>
    </section>
  );
}
