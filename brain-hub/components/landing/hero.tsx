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
        {/* eslint-disable-next-line @next/next/no-img-element -- local SVG full-bleed background */}
        <img
          src="/hero-study.svg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-[70%_40%] motion-safe:animate-hero-drift"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(248,250,252,0.94)_0%,rgba(248,250,252,0.78)_34%,rgba(248,250,252,0.22)_58%,rgba(248,250,252,0.05)_100%)] dark:bg-[linear-gradient(105deg,rgba(15,23,42,0.92)_0%,rgba(15,23,42,0.78)_34%,rgba(15,23,42,0.35)_58%,rgba(15,23,42,0.12)_100%)]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(#2563eb_0.8px,transparent_0.8px)] [background-size:18px_18px]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[55%] bg-[radial-gradient(ellipse_at_70%_40%,rgba(99,102,241,0.2),transparent_55%)] sm:block" />
      </div>

      <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="max-w-xl motion-safe:animate-rise">
          <p className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl">
            Brain Hub
          </p>
          <h1 className="mt-5 max-w-lg font-display text-3xl font-bold leading-tight tracking-tight text-[var(--foreground)] sm:text-4xl md:text-[2.75rem]">
            IELTS 7.5+ және грантқа нақты жол
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--foreground-soft)] sm:text-lg">
            Жеке ментор, интерактивті сабақтар және өлшенетін прогресс — бір
            платформада.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
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
