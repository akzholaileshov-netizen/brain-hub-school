import { Button } from "@/components/ui/button";

type HeroProps = {
  onRegister: () => void;
};

export function Hero({ onRegister }: HeroProps) {
  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        {/* Decorative full-bleed scene; brand text lives in the content column */}
        <img
          src="/hero-study.svg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-[70%_40%] motion-safe:animate-hero-drift"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(247,250,249,0.96)_0%,rgba(247,250,249,0.88)_38%,rgba(247,250,249,0.35)_62%,rgba(232,239,236,0.2)_100%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#0f4c4a_0.8px,transparent_0.8px)] [background-size:18px_18px]" />
      </div>

      <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="max-w-xl motion-safe:animate-rise">
          <p className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--teal-deep)] sm:text-5xl md:text-6xl">
            Brain Hub
          </p>
          <h1 className="mt-5 max-w-lg font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl md:text-[2.75rem]">
            IELTS 7.5+ және грантқа нақты жол
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
            Жеке ментор, интерактивті сабақтар және өлшенетін прогресс — бір
            платформада.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" variant="accent" asChild>
              <a href="#quiz">Бағытты анықтау</a>
            </Button>
            <Button size="lg" variant="secondary" onClick={onRegister}>
              Тегін консультация
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
