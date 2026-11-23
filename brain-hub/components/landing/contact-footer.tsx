"use client";

import { useState, type FormEvent } from "react";
import { MessageCircle, Music2, Send } from "lucide-react";
import type { NavTarget } from "@/components/landing/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { useI18n } from "@/components/i18n-provider";

type ContactFooterProps = {
  onNavigate?: (target: NavTarget) => void;
};

export function ContactFooter({ onNavigate }: ContactFooterProps) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    setInvalid(!ok);
    if (!ok) return;
    setSent(true);
  }

  return (
    <footer
      id="contact"
      className="scroll-mt-24 border-t border-[var(--border)] bg-[var(--background)]"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <ScrollReveal>
          <div className="mb-12 max-w-xl">
            <h2 className="font-display text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
              {t("anim.contactTitle")}
            </h2>
            <p className="mt-2 text-sm text-[var(--foreground-soft)]">
              {t("anim.contactHint")}
            </p>
            <form
              onSubmit={onSubmit}
              className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
              noValidate
            >
              <div className="min-w-0 flex-1 space-y-2">
                <Label htmlFor="contact-email">{t("auth.email")}</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setInvalid(false);
                    setSent(false);
                  }}
                  aria-invalid={invalid || undefined}
                  placeholder="student@email.kz"
                  className={invalid ? "bh-field-invalid" : undefined}
                />
                {invalid && (
                  <p className="motion-safe:animate-rise text-xs text-[var(--destructive)]">
                    {t("anim.emailInvalid")}
                  </p>
                )}
                {sent && (
                  <p className="motion-safe:animate-rise text-xs text-[var(--success)]">
                    {t("anim.emailThanks")}
                  </p>
                )}
              </div>
              <Button type="submit">{t("anim.contactSubmit")}</Button>
            </form>
          </div>
        </ScrollReveal>

        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-semibold text-[var(--foreground)]">
              Brain Hub
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--foreground-soft)]">
              {t("footer.blurb")}
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href="https://www.instagram.com/brainhub.kz/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--foreground-soft)] transition-colors hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="https://t.me/brainhub_kz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--foreground-soft)] transition-colors hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href="https://www.tiktok.com/@brainhub.kz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--foreground-soft)] transition-colors hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
              >
                <Music2 className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              {t("footer.contact")}
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
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              {t("footer.nav")}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-[var(--foreground-soft)]">
              <li>
                <button
                  type="button"
                  className="hover:text-[var(--foreground)]"
                  onClick={() =>
                    onNavigate?.({ kind: "panel", id: "format" })
                  }
                >
                  {t("footer.format")}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-[var(--foreground)]"
                  onClick={() => onNavigate?.({ kind: "panel", id: "quiz" })}
                >
                  {t("footer.quiz")}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-[var(--foreground)]"
                  onClick={() =>
                    onNavigate?.({ kind: "panel", id: "tracks" })
                  }
                >
                  {t("footer.tracks")}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-[var(--foreground)]"
                  onClick={() =>
                    onNavigate?.({ kind: "panel", id: "results" })
                  }
                >
                  {t("footer.results")}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-[var(--foreground)]"
                  onClick={() =>
                    onNavigate?.({ kind: "panel", id: "reviews" })
                  }
                >
                  {t("footer.reviews")}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-[var(--foreground)]"
                  onClick={() =>
                    onNavigate?.({ kind: "panel", id: "pricing" })
                  }
                >
                  {t("footer.pricing")}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-[var(--foreground)]"
                  onClick={() => onNavigate?.({ kind: "contact" })}
                >
                  {t("footer.contact")}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted-foreground)]">
          {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
