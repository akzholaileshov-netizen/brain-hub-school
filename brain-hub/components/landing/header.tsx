"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "#format", label: "Формат" },
  { href: "#quiz", label: "Тест" },
  { href: "#tracks", label: "Бағыттар" },
  { href: "#results", label: "Жетістіктер" },
  { href: "#reviews", label: "Пікірлер" },
  { href: "#contact", label: "Байланыс" },
];

type HeaderProps = {
  onLogin: () => void;
  onRegister: () => void;
  authenticated?: boolean;
};

export function Header({
  onLogin,
  onRegister,
  authenticated = false,
}: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--teal-deep)] sm:text-xl"
        >
          Brain Hub
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--teal-deep)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {authenticated ? (
            <Button asChild variant="accent" size="sm">
              <a href="/dashboard">Кабинет</a>
            </Button>
          ) : (
            <>
              <Button type="button" variant="ghost" size="sm" onClick={onLogin}>
                Кіру
              </Button>
              <Button
                type="button"
                variant="accent"
                size="sm"
                onClick={onRegister}
              >
                Тіркелу
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[var(--teal-deep)] lg:hidden"
          aria-label={open ? "Мәзірді жабу" : "Мәзірді ашу"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-b border-[var(--teal-deep)]/10 bg-[var(--surface)]/95 px-4 py-4 backdrop-blur-md lg:hidden">
          <nav className="flex flex-col gap-3">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[var(--ink-soft)]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex gap-2">
            {authenticated ? (
              <Button asChild variant="accent" className="flex-1">
                <a href="/dashboard" onClick={() => setOpen(false)}>
                  Кабинет
                </a>
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setOpen(false);
                    onLogin();
                  }}
                >
                  Кіру
                </Button>
                <Button
                  type="button"
                  variant="accent"
                  className="flex-1"
                  onClick={() => {
                    setOpen(false);
                    onRegister();
                  }}
                >
                  Тіркелу
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
