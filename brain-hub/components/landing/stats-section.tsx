const STATS = [
  { value: "2 400+", label: "Түлек" },
  { value: "68%", label: "Грант алғандар" },
  { value: "7.6", label: "Орташа IELTS" },
];

export function StatsSection() {
  return (
    <section id="results" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Жетістіктер
          </h2>
          <p className="mt-3 text-base text-[var(--foreground-soft)] sm:text-lg">
            Brain Hub түлектерінің нақты нәтижелері — сандармен.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-6 py-8"
            >
              <p className="font-display text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--foreground-soft)] sm:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
