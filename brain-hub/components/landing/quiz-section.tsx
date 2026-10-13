"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  QUIZ_QUESTIONS,
  TRACKS,
  type QuizOption,
  recommendTrack,
  scoreQuiz,
} from "@/lib/quiz-data";

export function QuizSection() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Array<QuizOption | null>>(
    () => Array(QUIZ_QUESTIONS.length).fill(null),
  );
  const [finished, setFinished] = useState(false);

  const progress = ((step + (finished ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100;
  const current = QUIZ_QUESTIONS[step];

  const recommendation = useMemo(() => {
    if (!finished) return null;
    return recommendTrack(scoreQuiz(answers));
  }, [answers, finished]);

  function selectOption(option: QuizOption) {
    const next = [...answers];
    next[step] = option;
    setAnswers(next);

    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setFinished(true);
    }
  }

  function reset() {
    setStep(0);
    setAnswers(Array(QUIZ_QUESTIONS.length).fill(null));
    setFinished(false);
  }

  return (
    <section id="quiz" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_0%,var(--mist)_35%,transparent_100%)]" />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--teal-deep)] sm:text-4xl">
            Бағытты анықтау тесті
          </h2>
          <p className="mt-3 text-base text-[var(--ink-soft)] sm:text-lg">
            Қызығушылық пен қабілетіңіз бойынша 12 сұраққа жауап беріңіз — сізге
            бір дайындық бағытын ұсынамыз.
          </p>
        </div>

        <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-[var(--teal-deep)]/10">
          <div
            className="h-full rounded-full bg-[var(--coral)] transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-[var(--teal-deep)]/10 bg-[var(--surface)] p-5 shadow-sm sm:p-8">
          {!finished && current ? (
            <div key={current.id} className="motion-safe:animate-fade-swap">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--teal-mid)]">
                Сұрақ {step + 1} / {QUIZ_QUESTIONS.length}
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--ink)] sm:text-2xl">
                {current.question}
              </h3>
              <div className="mt-6 grid gap-3">
                {current.options.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => selectOption(option)}
                    className="rounded-xl border border-[var(--teal-deep)]/12 bg-white px-4 py-3.5 text-left text-sm text-[var(--ink)] transition-all hover:border-[var(--teal-mid)] hover:bg-[var(--mist)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:text-base"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button
                  type="button"
                  className="mt-5 text-sm font-medium text-[var(--teal-mid)] hover:underline"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                >
                  Алдыңғы сұрақ
                </button>
              )}
            </div>
          ) : recommendation ? (
            <div className="motion-safe:animate-rise">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--coral)]">
                Нәтиже
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--teal-deep)] sm:text-3xl">
                Сізге ұсынылатын бағыт: {recommendation.name}
              </h3>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                {recommendation.short} · {recommendation.focus}
              </p>
              <p className="mt-4 text-base leading-relaxed text-[var(--ink-soft)]">
                {recommendation.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="accent">
                  <a href="#tracks">Бағыттарды қарау</a>
                </Button>
                <Button variant="outline" onClick={reset}>
                  Тестті қайталау
                </Button>
              </div>
              <ul className="mt-8 grid gap-2 sm:grid-cols-2">
                {TRACKS.map((track) => (
                  <li
                    key={track.id}
                    className={`rounded-lg px-3 py-2 text-sm ${
                      track.id === recommendation.id
                        ? "bg-[var(--mist)] font-semibold text-[var(--teal-deep)]"
                        : "text-[var(--ink-muted)]"
                    }`}
                  >
                    {track.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
