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
import { TRACKS, type TrackId } from "@/lib/quiz-data";

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

  function switchMode(next: Mode) {
    resetFormState();
    if (next === "register") setTrackOverride(null);
    onModeChange(next);
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
      const data = (await res.json()) as { error?: string; redirect?: string };
      if (!res.ok) {
        setError(data.error || "Қате пайда болды. Қайта көріңіз.");
        setLoading(false);
        return;
      }
      setLoading(false);
      onOpenChange(false);
      router.push(data.redirect || "/dashboard");
      router.refresh();
    } catch {
      setError("Желі қатесі. Қайта көріңіз.");
      setLoading(false);
    }
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
              ? "Brain Hub аккаунтыңызға кіріңіз."
              : "Жаңа аккаунт ашып, жеке кабинетке өтіңіз."}
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
            onClick={() => switchMode("login")}
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
            onClick={() => switchMode("register")}
          >
            Тіркелу
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Аты-жөні</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Айгерім Нұрланқызы"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="track">Дайындық бағыты</Label>
                <Select
                  id="track"
                  name="track"
                  value={track}
                  onChange={(e) => setTrackOverride(e.target.value as TrackId)}
                  required
                >
                  {TRACKS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                      {recommendedTrack === item.id ? " (тест ұсынысы)" : ""}
                    </option>
                  ))}
                </Select>
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Почта</Label>
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
              placeholder="Кемінде 8 таңба, әріп пен сан"
              minLength={mode === "register" ? 8 : 1}
              required
            />
          </div>

          {error && (
            <div className="rounded-lg border border-[var(--coral)]/30 bg-[var(--coral)]/8 px-3 py-2 text-sm text-[var(--coral-deep)]">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading
              ? "Күте тұрыңыз…"
              : mode === "login"
                ? "Кіру"
                : "Тіркелу"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
