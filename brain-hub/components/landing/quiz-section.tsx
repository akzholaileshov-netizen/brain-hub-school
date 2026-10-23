"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CAREER_QUESTIONS,
  CAREER_QUIZ_META,
  scoreCareerQuiz,
  type CareerQuizOption,
  type CareerQuizResult,
} from "@/lib/career-quiz";
import { TRACKS, type TrackId } from "@/lib/quiz-data";

type Phase = "start" | "quiz" | "results";

type QuizSectionProps = {
  onRecommend?: (trackId: TrackId | null) => void;
  onRegisterWithTrack?: (trackId: TrackId) => void;
};

export function QuizSection({
  onRecommend,
  onRegisterWithTrack,
}: QuizSectionProps) {
  const [phase, setPhase] = useState<Phase>("start");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Array<CareerQuizOption | null>>(
    () => Array(CAREER_QUESTIONS.length).fill(null),
  );

  const current = CAREER_QUESTIONS[step];
  const selectedIndex = useMemo(() => {
    if (phase !== "quiz" || !current) return null;
    const existing = answers[step];
    if (!existing) return null;
    const idx = current.options.findIndex((o) => o.label === existing.label);
    return idx >= 0 ? idx : null;
  }, [phase, current, answers, step]);

  const progress =
    phase === "results"
      ? 100
      : phase === "start"
        ? 0
        : ((step + (answers[step] ? 1 : 0)) / CAREER_QUESTIONS.length) * 100;

  const result: CareerQuizResult | null = useMemo(() => {
    if (phase !== "results") return null;
    if (answers.some((a) => a == null)) return null;
    return scoreCareerQuiz(answers);
  }, [answers, phase]);

  useEffect(() => {
    onRecommend?.(result?.track.id ?? null);
  }, [result, onRecommend]);

  function startQuiz() {
    setPhase("quiz");
    setStep(0);
    setAnswers(Array(CAREER_QUESTIONS.length).fill(null));
    onRecommend?.(null);
  }

  function selectOption(index: number) {
    const nextAnswers = [...answers];
    nextAnswers[step] = current.options[index];
    setAnswers(nextAnswers);
  }

  function goNext() {
    if (selectedIndex == null && !answers[step]) return;
    if (step < CAREER_QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setPhase("results");
    }
  }

  function goBack() {
    if (step <= 0) return;
    setStep((s) => s - 1);
  }

  function reset() {
    setPhase("start");
    setStep(0);
    setAnswers(Array(CAREER_QUESTIONS.length).fill(null));
    onRecommend?.(null);
  }

  return (
    <section id="quiz" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_0%,var(--muted)_35%,transparent_100%)]" />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {CAREER_QUIZ_META.title}
          </h2>
          <p className="mt-3 text-base text-[var(--foreground-soft)] sm:text-lg">
            {CAREER_QUIZ_META.subtitle}
          </p>
        </div>

        {(phase === "quiz" || phase === "results") && (
          <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-[var(--foreground)]/10">
            <div
              className="h-full rounded-full bg-[var(--primary)] transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-8">
          {phase === "start" && (
            <div className="motion-safe:animate-rise space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
                30 сұрақ · {CAREER_QUIZ_META.estimatedMinutes}
              </p>
              <h3 className="font-display text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
                Дайындық бағытын және мамандықты бірге анықтаймыз
              </h3>
              <ul className="space-y-2 text-sm text-[var(--foreground-soft)]">
                <li>
                  • Қабілет, қызығушылық және жұмыс стилі туралы нақты сұрақтар
                </li>
                <li>• Нәтижеде — топ-5 сай мамандық және ұсынылған бағыт</li>
                <li>• Тіркелу кезінде ұсынылған бағыт алдын ала таңдалады</li>
              </ul>
              <Button type="button" size="lg" onClick={startQuiz}>
                Тестті бастау
              </Button>
            </div>
          )}

          {phase === "quiz" && current && (
            <div key={current.id} className="motion-safe:animate-fade-swap">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
                Сұрақ {step + 1} / {CAREER_QUESTIONS.length}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
                {current.question}
              </h3>
              <div className="mt-6 grid gap-3">
                {current.options.map((option, index) => {
                  const active = selectedIndex === index;
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => selectOption(index)}
                      className={`rounded-xl border px-4 py-3.5 text-left text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:text-base ${
                        active
                          ? "border-[var(--primary)] bg-[var(--muted)] text-[var(--foreground)]"
                          : "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--primary)] hover:bg-[var(--muted)]"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  onClick={goNext}
                  disabled={selectedIndex == null}
                >
                  {step === CAREER_QUESTIONS.length - 1
                    ? "Нәтижені көру"
                    : "Келесі"}
                </Button>
                {step > 0 && (
                  <Button type="button" variant="ghost" onClick={goBack}>
                    Алдыңғы сұрақ
                  </Button>
                )}
              </div>
            </div>
          )}

          {phase === "results" && result && (
            <div className="motion-safe:animate-rise space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                  Нәтиже
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
                  Ұсынылған бағыт: {result.track.name}
                </h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  {result.track.short} · {result.track.focus}
                </p>
                <p className="mt-4 text-base leading-relaxed text-[var(--foreground-soft)]">
                  {result.explanationKk}
                </p>
              </div>

              <div>
                <h4 className="font-display text-lg font-semibold text-[var(--foreground)]">
                  Топ-5 мамандық
                </h4>
                <ol className="mt-4 space-y-3">
                  {result.topProfessions.map((item, index) => {
                    const trackName =
                      TRACKS.find((t) => t.id === item.profession.trackId)
                        ?.name ?? item.profession.trackId;
                    return (
                      <li
                        key={item.profession.id}
                        className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-semibold text-[var(--primary)]">
                              #{index + 1}
                            </p>
                            <p className="mt-1 font-display text-base font-semibold text-[var(--foreground)] sm:text-lg">
                              {item.profession.nameKk}
                            </p>
                            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                              Бағыт: {trackName}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-[var(--foreground)]">
                            {item.matchPercent}%
                          </p>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--foreground)]/10">
                          <div
                            className="h-full rounded-full bg-[var(--primary)]"
                            style={{ width: `${item.matchPercent}%` }}
                          />
                        </div>
                        <p className="mt-2 text-sm text-[var(--foreground-soft)]">
                          {item.why}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={() => onRegisterWithTrack?.(result.track.id)}
                >
                  Осы бағытпен тіркелу
                </Button>
                <Button asChild variant="outline">
                  <a href="#tracks">Бағыттарды қарау</a>
                </Button>
                <Button type="button" variant="ghost" onClick={reset}>
                  Тестті қайталау
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
