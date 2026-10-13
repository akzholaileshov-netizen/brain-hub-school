const STATS = [
  { value: "2 400+", label: "Түлек" },
  { value: "68%", label: "Грант алғандар" },
  { value: "7.6", label: "Орташа IELTS" },
];

export function StatsSection() {
  return (
    <section id="results" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-[var(--teal-deep)]" />
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(#f2c14e_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Жетістіктер
          </h2>
          <p className="mt-3 text-base text-white/75 sm:text-lg">
            Brain Hub түлектерінің нақты нәтижелері — сандармен.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--amber)] sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-white/80 sm:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
