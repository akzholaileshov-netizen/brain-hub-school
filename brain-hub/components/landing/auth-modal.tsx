"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Select } from "@/components/ui/select";
import { useI18n } from "@/components/i18n-provider";
import { getTracks } from "@/lib/i18n/localize";
import { type TrackId } from "@/lib/quiz-data";

type Mode = "login" | "register";

type AuthModalProps = {
  open: boolean;
  mode: Mode;
  onOpenChange: (open: boolean) => void;
  onModeChange: (mode: Mode) => void;
  recommendedTrack?: TrackId | null;
};

export function AuthModal({
  open,
  mode,
  onOpenChange,
  onModeChange,
  recommendedTrack = null,
}: AuthModalProps) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const tracks = getTracks(locale);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [trackOverride, setTrackOverride] = useState<TrackId | null>(null);
  const track = trackOverride ?? recommendedTrack ?? "info-mat";

  function resetFormState() {
    setError(null);
    setLoading(false);
  }

  function handleOpenChange(next: boolean) {
    if (next) {
      resetFormState();
      setTrackOverride(null);
    } else {
      resetFormState();
      setTrackOverride(null);
    }
    onOpenChange(next);
  }

  function switchMode(next: Mode, preserveMessage?: string | null) {
    resetFormState();
    if (next === "register") setTrackOverride(null);
    onModeChange(next);
    if (preserveMessage) setError(preserveMessage);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload =
      mode === "login"
        ? {
            email: String(form.get("email") ?? ""),
            password: String(form.get("password") ?? ""),
          }
        : {
            fullName: String(form.get("fullName") ?? ""),
            email: String(form.get("email") ?? ""),
            password: String(form.get("password") ?? ""),
            track,
          };

    try {
      const res = await fetch(
        mode === "login" ? "/api/auth/login" : "/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await res.json()) as {
        error?: string;
        redirect?: string;
        needsEmailConfirmation?: boolean;
        message?: string;
      };
      if (!res.ok) {
        setError(
          data.error ||
            (locale === "ru"
              ? "Произошла ошибка. Попробуйте снова."
              : "Қате пайда болды. Қайта көріңіз."),
        );
        setLoading(false);
        return;
      }
      if (data.needsEmailConfirmation) {
        setLoading(false);
        switchMode(
          "login",
          data.message ||
            (locale === "ru"
              ? "Регистрация успешна. Подтвердите почту, затем войдите."
              : "Тіркелу сәтті. Почтаңызды растап, содан кейін кіріңіз."),
        );
        return;
      }
      setLoading(false);
      onOpenChange(false);
      router.push(data.redirect || "/dashboard");
      router.refresh();
    } catch {
      setError(
        locale === "ru"
          ? "Ошибка сети. Попробуйте снова."
          : "Желі қатесі. Қайта көріңіз.",
      );
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "login" ? t("auth.loginTitle") : t("auth.registerTitle")}
          </DialogTitle>
          <DialogDescription>
            {mode === "login" ? t("auth.loginDesc") : t("auth.registerDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 rounded-lg bg-[var(--muted)] p-1">
          <button
            type="button"
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
              mode === "login"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                : "text-[var(--muted-foreground)]"
            }`}
            onClick={() => switchMode("login")}
          >
            {t("nav.login")}
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
              mode === "register"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                : "text-[var(--muted-foreground)]"
            }`}
            onClick={() => switchMode("register")}
          >
            {t("nav.register")}
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">{t("auth.fullName")}</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder={
                    locale === "ru" ? "Айгерим Нурлановна" : "Айгерім Нұрланқызы"
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="track">{t("auth.track")}</Label>
                <Select
                  id="track"
                  name="track"
                  value={track}
                  onChange={(e) => setTrackOverride(e.target.value as TrackId)}
                  required
                >
                  {tracks.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                      {recommendedTrack === item.id ? t("auth.quizSuggest") : ""}
                    </option>
                  ))}
                </Select>
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="student@email.kz"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t("auth.passwordHint")}
              minLength={mode === "register" ? 8 : 1}
              required
            />
          </div>

          {error && (
            <div className="rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-3 py-2 text-sm text-[var(--destructive)]">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading
              ? locale === "ru"
                ? "Подождите…"
                : "Күте тұрыңыз…"
              : mode === "login"
                ? t("auth.submitLogin")
                : t("auth.submitRegister")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
