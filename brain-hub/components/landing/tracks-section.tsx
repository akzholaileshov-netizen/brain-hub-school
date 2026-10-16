import { TRACKS } from "@/lib/quiz-data";

export function TracksSection() {
  return (
    <section id="tracks" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Дайындық бағыттары
          </h2>
          <p className="mt-3 text-base text-[var(--foreground-soft)] sm:text-lg">
            Алты нақты трек — грант пен халықаралық оқу мақсаттарына бейімделген.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TRACKS.map((track) => (
            <article
              key={track.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                {track.short}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold text-[var(--foreground)]">
                {track.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--foreground-soft)]">
                {track.description}
              </p>
              <p className="mt-4 text-xs font-medium text-[var(--primary)]">
                {track.focus}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
