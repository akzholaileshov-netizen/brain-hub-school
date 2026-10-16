import { BookOpenCheck, LineChart, UserRound } from "lucide-react";

const ITEMS = [
  {
    icon: BookOpenCheck,
    title: "Интерактивті сабақтар",
    text: "Тірі талқылау, практикалық тапсырмалар және нақты емтихан форматындағы жаттығулар.",
  },
  {
    icon: UserRound,
    title: "Жеке ментор",
    text: "Әр оқушыға жеке трек, апталық кері байланыс және мақсатқа бейімделген жоспар.",
  },
  {
    icon: LineChart,
    title: "GPA мен прогресс",
    text: "Үлгерімді бақылау, әлсіз тақырыптарды анықтау және апта сайынғы өсу картасы.",
  },
];

export function FormatSection() {
  return (
    <section id="format" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Оқыту форматы
          </h2>
          <p className="mt-3 text-base text-[var(--foreground-soft)] sm:text-lg">
            Нәтижеге бағытталған үш тірек — сабақ, менторлық және өлшенетін
            прогресс.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {ITEMS.map((item, index) => (
            <div
              key={item.title}
              className="motion-safe:animate-rise"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--primary)]">
                <item.icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-display text-xl font-semibold text-[var(--foreground)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-soft)] sm:text-base">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
