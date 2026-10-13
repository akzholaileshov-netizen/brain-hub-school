"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "login" | "register";

type AuthModalProps = {
  open: boolean;
  mode: Mode;
  onOpenChange: (open: boolean) => void;
  onModeChange: (mode: Mode) => void;
};

export function AuthModal({
  open,
  mode,
  onOpenChange,
  onModeChange,
}: AuthModalProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  function handleOpenChange(next: boolean) {
    if (!next) setSubmitted(false);
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "login" ? "Кіру" : "Тіркелу"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Brain Hub аккаунтыңызға кіріңіз. Бұл демо — деректер сақталмайды."
              : "Жаңа аккаунт ашыңыз. Бұл демо — нақты тіркелу жоқ."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 rounded-lg bg-[var(--mist)] p-1">
          <button
            type="button"
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
              mode === "login"
                ? "bg-white text-[var(--teal-deep)] shadow-sm"
                : "text-[var(--ink-muted)]"
            }`}
            onClick={() => {
              setSubmitted(false);
              onModeChange("login");
            }}
          >
            Кіру
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
              mode === "register"
                ? "bg-white text-[var(--teal-deep)] shadow-sm"
                : "text-[var(--ink-muted)]"
            }`}
            onClick={() => {
              setSubmitted(false);
              onModeChange("register");
            }}
          >
            Тіркелу
          </button>
        </div>

        {submitted ? (
          <div className="rounded-lg border border-[var(--teal-mid)]/25 bg-[var(--mist)] p-4 text-sm text-[var(--teal-deep)]">
            Сәтті! Демо режимінде {mode === "login" ? "кіру" : "тіркелу"}{" "}
            имитацияланды. Кейінірек нақты аккаунт қосылады.
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="name">Аты-жөні</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Айгерім Нұрланқызы"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Электронды пошта</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="student@email.kz"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Құпия сөз</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              {mode === "login" ? "Кіру" : "Тіркелу"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
