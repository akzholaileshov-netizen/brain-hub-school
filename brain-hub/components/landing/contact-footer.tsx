import { MessageCircle, Play, Send } from "lucide-react";

export function ContactFooter() {
  return (
    <footer id="contact" className="relative scroll-mt-24 border-t border-[var(--teal-deep)]/10 bg-[var(--mist)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--teal-deep)]">
              Brain Hub
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--ink-soft)]">
              Қазақстандық оқушыларға IELTS, грант және бейіндік пәндер бойынша
              нәтижелі дайындық.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--teal-deep)] transition-colors hover:text-[var(--coral)]"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--teal-deep)] transition-colors hover:text-[var(--coral)]"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--teal-deep)] transition-colors hover:text-[var(--coral)]"
              >
                <Play className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.12em] text-[var(--teal-deep)]">
              Байланыс
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-[var(--ink-soft)]">
              <li>
                <a
                  href="mailto:support@brainhub.kz"
                  className="hover:text-[var(--teal-deep)]"
                >
                  support@brainhub.kz
                </a>
              </li>
              <li>
                <a href="tel:+77001234567" className="hover:text-[var(--teal-deep)]">
                  +7 (700) 123-45-67
                </a>
              </li>
              <li>
                <a href="tel:+77271234567" className="hover:text-[var(--teal-deep)]">
                  +7 (727) 123-45-67
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.12em] text-[var(--teal-deep)]">
              Навигация
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-[var(--ink-soft)]">
              <li>
                <a href="#format" className="hover:text-[var(--teal-deep)]">
                  Оқыту форматы
                </a>
              </li>
              <li>
                <a href="#quiz" className="hover:text-[var(--teal-deep)]">
                  Бағыт тесті
                </a>
              </li>
              <li>
                <a href="#tracks" className="hover:text-[var(--teal-deep)]">
                  Дайындық бағыттары
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-[var(--teal-deep)]">
                  Түлектер пікірі
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[var(--teal-deep)]/10 pt-6 text-xs text-[var(--ink-muted)]">
          © 2026 Brain Hub. Барлық құқықтар қорғалған.
        </div>
      </div>
    </footer>
  );
}
