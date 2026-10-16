import { MessageCircle, Music2, Send } from "lucide-react";

export function ContactFooter() {
  return (
    <footer
      id="contact"
      className="relative scroll-mt-24 border-t border-[var(--border)] bg-[var(--muted)]"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-semibold text-[var(--foreground)]">
              Brain Hub
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--foreground-soft)]">
              Қазақстандық оқушыларға IELTS, грант және бейіндік пәндер бойынша
              нәтижелі дайындық.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="https://www.instagram.com/brainhub.kz/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--card)] text-[var(--foreground)] transition-colors hover:text-[var(--primary)]"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="https://t.me/brainhub_kz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--card)] text-[var(--foreground)] transition-colors hover:text-[var(--primary)]"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href="https://www.tiktok.com/@brainhub.kz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--card)] text-[var(--foreground)] transition-colors hover:text-[var(--primary)]"
              >
                <Music2 className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-[var(--foreground)]">
              Байланыс
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-[var(--foreground-soft)]">
              <li>
                <a
                  href="mailto:support@brainhub.kz"
                  className="hover:text-[var(--foreground)]"
                >
                  support@brainhub.kz
                </a>
              </li>
              <li>
                <a
                  href="tel:+77001234567"
                  className="hover:text-[var(--foreground)]"
                >
                  +7 (700) 123-45-67
                </a>
              </li>
              <li>
                <a
                  href="tel:+77271234567"
                  className="hover:text-[var(--foreground)]"
                >
                  +7 (727) 123-45-67
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-[var(--foreground)]">
              Навигация
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-[var(--foreground-soft)]">
              <li>
                <a href="#format" className="hover:text-[var(--foreground)]">
                  Оқыту форматы
                </a>
              </li>
              <li>
                <a href="#quiz" className="hover:text-[var(--foreground)]">
                  Бағыт тесті
                </a>
              </li>
              <li>
                <a href="#tracks" className="hover:text-[var(--foreground)]">
                  Дайындық бағыттары
                </a>
              </li>
              <li>
                <a href="#results" className="hover:text-[var(--foreground)]">
                  Жетістіктер
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-[var(--foreground)]">
                  Түлектер пікірі
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[var(--foreground)]">
                  Байланыс
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted-foreground)]">
          © 2026 Brain Hub. Барлық құқықтар қорғалған.
        </div>
      </div>
    </footer>
  );
}
