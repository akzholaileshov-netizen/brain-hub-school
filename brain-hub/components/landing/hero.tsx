import { Button } from "@/components/ui/button";

type HeroProps = {
  onRegister: () => void;
};

export function Hero({ onRegister }: HeroProps) {
  return (
    <section
      id="top"
      className="relative isolate border-b border-[var(--border)] bg-[var(--background)]"
    >
      <div className="mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-center px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8">
        <div className="max-w-2xl motion-safe:animate-rise">
          <p className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl">
            Brain Hub
          </p>
          <h1 className="mt-6 max-w-xl font-display text-3xl font-semibold leading-[1.15] tracking-tight text-[var(--foreground)] sm:text-4xl md:text-5xl">
            IELTS 7.5+ және грантқа нақты жол
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--foreground-soft)] sm:text-lg">
            Жеке ментор, интерактивті сабақтар және өлшенетін прогресс — бір
            платформада.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <a href="#quiz">Бағытты анықтау</a>
            </Button>
            <Button size="lg" variant="outline" onClick={onRegister}>
              Тегін консультация
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
