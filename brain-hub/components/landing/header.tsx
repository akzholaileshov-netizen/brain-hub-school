"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageToggle, useI18n } from "@/components/i18n-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrainHubMark } from "@/components/brand/brain-hub-mark";
import type { ContentPanelId } from "@/components/landing/content-panel";

export type NavTarget =
  | { kind: "panel"; id: ContentPanelId }
  | { kind: "contact" };

type HeaderProps = {
  onLogin: () => void;
  onRegister: () => void;
  authenticated?: boolean;
  onNavigate: (target: NavTarget) => void;
  menuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
};

export function Header({
  onLogin,
  onRegister,
  authenticated = false,
  onNavigate,
  menuOpen: menuOpenControlled,
  onMenuOpenChange,
}: HeaderProps) {
  const { t } = useI18n();
  const [menuOpenInternal, setMenuOpenInternal] = useState(false);
  const menuOpen = menuOpenControlled ?? menuOpenInternal;

  const nav: Array<{ id: string; label: string; target: NavTarget }> = [
    { id: "format", label: t("nav.format"), target: { kind: "panel", id: "format" } },
    { id: "quiz", label: t("nav.quiz"), target: { kind: "panel", id: "quiz" } },
    { id: "tracks", label: t("nav.tracks"), target: { kind: "panel", id: "tracks" } },
    { id: "results", label: t("nav.results"), target: { kind: "panel", id: "results" } },
    { id: "reviews", label: t("nav.reviews"), target: { kind: "panel", id: "reviews" } },
    { id: "pricing", label: t("nav.pricing"), target: { kind: "panel", id: "pricing" } },
    { id: "contact", label: t("nav.contact"), target: { kind: "contact" } },
  ];

  function setMenuOpen(open: boolean) {
    if (onMenuOpenChange) onMenuOpenChange(open);
    else setMenuOpenInternal(open);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => {
      if (onMenuOpenChange) onMenuOpenChange(false);
      else setMenuOpenInternal(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen, onMenuOpenChange]);

  function handleNav(target: NavTarget) {
    setMenuOpen(false);
    onNavigate(target);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <a
            href="#top"
            className="inline-flex items-center gap-2 font-display text-lg font-bold tracking-tight text-[var(--foreground)] transition-opacity hover:opacity-80 sm:text-xl"
          >
            <BrainHubMark className="h-7 w-7" />
            Brain Hub
          </a>

          <div className="flex items-center gap-2">
            <LanguageToggle className="hidden sm:inline-flex" />
            <ThemeToggle />
            {authenticated ? (
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <a href="/dashboard">{t("nav.cabinet")}</a>
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex"
                  onClick={onLogin}
                >
                  {t("nav.login")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="hidden sm:inline-flex"
                  onClick={onRegister}
                >
                  {t("nav.register")}
                </Button>
              </>
            )}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
              aria-label={menuOpen ? t("nav.close") : t("nav.open")}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-[var(--foreground)]/30 backdrop-blur-[1px]"
            aria-label={t("nav.close")}
            onClick={() => setMenuOpen(false)}
          />
          <aside
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-[var(--border)] bg-[var(--background)] shadow-soft"
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.menu")}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <p className="font-display text-base font-semibold text-[var(--foreground)]">
                {t("nav.menu")}
              </p>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--foreground)] hover:bg-[var(--muted)]"
                aria-label={t("nav.closeShort")}
                onClick={() => setMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-[var(--border)] px-5 py-3 sm:hidden">
              <LanguageToggle />
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
              {nav.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="rounded-lg px-3 py-3 text-left text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
                  onClick={() => handleNav(item.target)}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="border-t border-[var(--border)] p-4">
              {authenticated ? (
                <Button asChild className="w-full">
                  <a href="/dashboard" onClick={() => setMenuOpen(false)}>
                    {t("nav.cabinet")}
                  </a>
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setMenuOpen(false);
                      onLogin();
                    }}
                  >
                    {t("nav.login")}
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={() => {
                      setMenuOpen(false);
                      onRegister();
                    }}
                  >
                    {t("nav.register")}
                  </Button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
