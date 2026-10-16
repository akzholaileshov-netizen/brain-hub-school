"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { SubjectCard } from "@/lib/db";

type Booking = {
  id: number;
  slotAt: string;
  platform: string;
  note: string | null;
  status: string;
};

type MockHistory = {
  id: number;
  score: number;
  total: number;
  percent: number;
  band: number;
  createdAt: string;
};

type MockQuestion = {
  index: number;
  prompt: string;
  options: string[];
};

type Props = {
  enrolled: boolean;
  prominent: boolean;
  modules: SubjectCard[];
  bookings: Booking[];
  mockHistory: MockHistory[];
  mockQuestions: MockQuestion[];
};

export function IeltsHub({
  enrolled,
  prominent,
  modules,
  bookings: initialBookings,
  mockHistory: initialHistory,
  mockQuestions,
}: Props) {
  const router = useRouter();
  const [currentEnrolled, setCurrentEnrolled] = useState(enrolled);
  const [bookings, setBookings] = useState(initialBookings);
  const [history, setHistory] = useState(initialHistory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [slotAt, setSlotAt] = useState("");
  const [platform, setPlatform] = useState<"zoom" | "meet">("zoom");
  const [note, setNote] = useState("");

  const [mockStarted, setMockStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10 * 60);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [lastResult, setLastResult] = useState<{
    percent: number;
    band: number;
  } | null>(null);

  useEffect(() => {
    if (!mockStarted || secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [mockStarted, secondsLeft]);

  const timerLabel = useMemo(() => {
    const m = Math.floor(Math.max(0, secondsLeft) / 60);
    const s = Math.max(0, secondsLeft) % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }, [secondsLeft]);

  async function toggleEnroll() {
    setLoading(true);
    setError(null);
    try {
      const next = !currentEnrolled;
      const res = await fetch("/api/ielts/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrolled: next }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Сервис күйін өзгерту мүмкін болмады.");
        return;
      }
      setCurrentEnrolled(next);
      setMessage(next ? "VIP IELTS сервисі қосылды." : "Сервис өшірілді.");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function bookSession(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ielts/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotAt, platform, note }),
      });
      const data = (await res.json()) as {
        error?: string;
        bookings?: Booking[];
      };
      if (!res.ok) {
        setError(data.error || "Брондау сәтсіз.");
        return;
      }
      setBookings(data.bookings ?? []);
      setMessage("Ментор сессиясы брондалды.");
      setNote("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function submitMock() {
    if (Object.keys(answers).length < mockQuestions.length) {
      setError("Mock-тестің барлық сұрағына жауап беріңіз.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ielts/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = (await res.json()) as {
        error?: string;
        percent?: number;
        band?: number;
        history?: MockHistory[];
      };
      if (!res.ok) {
        setError(data.error || "Mock-тестті жіберу мүмкін болмады.");
        return;
      }
      setLastResult({
        percent: data.percent ?? 0,
        band: data.band ?? 0,
      });
      setHistory(data.history ?? []);
      setMockStarted(false);
      setMessage("Mock-тест нәтижесі сақталды.");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <section
        className={`rounded-2xl border p-6 sm:p-8 ${
          prominent
            ? "border-[var(--accent)]/40 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_12%,var(--card)),var(--card)_55%)]"
            : "border-[var(--border)] bg-[var(--card)]"
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          {prominent ? "Негізгі бағыт" : "Қосымша сервис"}
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
          VIP IELTS / Ағылшын тілі
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--foreground-soft)]">
          Speaking, Listening, Reading, Writing модульдері, ментор сессиясы және
          mock-тест — бір жерде.
        </p>
        {!prominent && (
          <div className="mt-5">
            <Button
              type="button"
              variant={currentEnrolled ? "secondary" : "default"}
              disabled={loading}
              onClick={toggleEnroll}
            >
              {currentEnrolled ? "Сервистен бас тарту" : "Сервиске жазылу"}
            </Button>
          </div>
        )}
      </section>

      {error && (
        <div className="rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-3 py-2 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-lg border border-[var(--primary)]/25 bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)]">
          {message}
        </div>
      )}

      {!currentEnrolled && !prominent ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-sm text-[var(--foreground-soft)]">
          Модульдер, брондау және mock-тест үшін сервиске жазылыңыз.
        </div>
      ) : (
        <>
          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--foreground)]">
              IELTS модульдері
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {modules.map((mod) => (
                <a
                  key={mod.id}
                  href={`/dashboard/subjects/${mod.slug}?scope=${prominent ? "track" : "ielts"}`}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-transform hover:-translate-y-0.5"
                >
                  <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                    {mod.name}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--foreground-soft)]">
                    {mod.watchedCount}/{mod.videoCount} бейне · прогресс{" "}
                    {Math.round(mod.percent)}%
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
                    <div
                      className="h-full rounded-full bg-[var(--primary)]"
                      style={{ width: `${mod.percent}%` }}
                    />
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <form
              onSubmit={bookSession}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4"
            >
              <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
                Ментормен сессия брондау
              </h2>
              <div className="space-y-2">
                <Label htmlFor="slotAt">Күн мен уақыт</Label>
                <Input
                  id="slotAt"
                  type="datetime-local"
                  required
                  value={slotAt}
                  onChange={(e) => setSlotAt(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform">Платформа</Label>
                <Select
                  id="platform"
                  value={platform}
                  onChange={(e) =>
                    setPlatform(e.target.value as "zoom" | "meet")
                  }
                >
                  <option value="zoom">Zoom</option>
                  <option value="meet">Google Meet</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Ескертпе (міндетті емес)</Label>
                <Input
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Мысалы: Writing Task 2"
                />
              </div>
              <Button type="submit" disabled={loading}>
                Сессияны брондау
              </Button>
            </form>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
                Алдағы брондаулар
              </h2>
              {bookings.length === 0 ? (
                <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                  Әзірге брондау жоқ.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {bookings.map((b) => (
                    <li
                      key={b.id}
                      className="rounded-lg bg-[var(--muted)]/70 px-3 py-2 text-sm"
                    >
                      <p className="font-medium text-[var(--foreground)]">
                        {new Date(b.slotAt).toLocaleString("kk-KZ")} ·{" "}
                        {b.platform === "zoom" ? "Zoom" : "Meet"}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {b.status === "upcoming" ? "Күтілуде" : b.status}
                        {b.note ? ` · ${b.note}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
                  IELTS mock-тест
                </h2>
                <p className="mt-1 text-sm text-[var(--foreground-soft)]">
                  6 сұрақ · таймер 10 минут · band нәтижесі сақталады
                </p>
              </div>
              {!mockStarted ? (
                <Button
                  type="button"
                  onClick={() => {
                    setMockStarted(true);
                    setSecondsLeft(10 * 60);
                    setAnswers({});
                    setLastResult(null);
                  }}
                >
                  Mock-тесті бастау
                </Button>
              ) : (
                <p className="rounded-full bg-[var(--muted)] px-3 py-1 text-sm font-semibold text-[var(--foreground)]">
                  Қалған уақыт: {timerLabel}
                </p>
              )}
            </div>

            {lastResult && (
              <p className="mt-4 text-sm font-medium text-[var(--primary)]">
                Соңғы нәтиже: {lastResult.percent}% · Band {lastResult.band.toFixed(1)}
              </p>
            )}

            {mockStarted && (
              <div className="mt-5 space-y-4">
                {mockQuestions.map((question) => (
                  <fieldset key={question.index} className="space-y-2">
                    <legend className="text-sm font-medium">
                      {question.index + 1}. {question.prompt}
                    </legend>
                    <div className="grid gap-2">
                      {question.options.map((option, optionIndex) => (
                        <label
                          key={option}
                          className="flex gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                        >
                          <input
                            type="radio"
                            name={`mock-${question.index}`}
                            checked={
                              answers[String(question.index)] === optionIndex
                            }
                            onChange={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                [String(question.index)]: optionIndex,
                              }))
                            }
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
                <Button type="button" disabled={loading} onClick={submitMock}>
                  Mock-тесті жіберу
                </Button>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Нәтижелер тарихы
              </h3>
              {history.length === 0 ? (
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Тарих бос.
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {history.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-lg bg-[var(--muted)]/70 px-3 py-2 text-sm"
                    >
                      Band {item.band.toFixed(1)} · {item.percent}% ·{" "}
                      {new Date(item.createdAt).toLocaleString("kk-KZ")}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
