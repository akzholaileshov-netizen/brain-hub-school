"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CAREER_QUESTIONS,
  CAREER_QUIZ_META,
  scoreCareerQuiz,
  type CareerQuizOption,
  type CareerQuizResult,
} from "@/lib/career-quiz";
import { TRACKS, type TrackId } from "@/lib/quiz-data";
import {
  DEFAULT_ACADEMIC_PROFILE,
  parseGpaInput,
  recommendUniversities,
  type StudentAcademicProfile,
  type UniversityMatch,
  type UniversityRecommendation,
} from "@/lib/universities";

type Phase = "start" | "quiz" | "results" | "uni-form" | "uni-results";

type QuizSectionProps = {
  onRecommend?: (trackId: TrackId | null) => void;
  onRegisterWithTrack?: (trackId: TrackId) => void;
};

const IELTS_BANDS = Array.from({ length: 19 }, (_, i) => i * 0.5);

export function QuizSection({
  onRecommend,
  onRegisterWithTrack,
}: QuizSectionProps) {
  const [phase, setPhase] = useState<Phase>("start");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Array<CareerQuizOption | null>>(
    () => Array(CAREER_QUESTIONS.length).fill(null),
  );
  const [gpaRaw, setGpaRaw] = useState("3.50");
  const [hasIelts, setHasIelts] = useState<"yes" | "no">("no");
  const [ieltsBand, setIeltsBand] = useState(6.0);
  const [gpaError, setGpaError] = useState<string | null>(null);
  const [academic, setAcademic] = useState<StudentAcademicProfile | null>(
    null,
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
    phase === "uni-results"
      ? 100
      : phase === "uni-form" || phase === "results"
        ? 100
        : phase === "start"
          ? 0
          : ((step + (answers[step] ? 1 : 0)) / CAREER_QUESTIONS.length) * 100;

  const result: CareerQuizResult | null = useMemo(() => {
    if (
      phase !== "results" &&
      phase !== "uni-form" &&
      phase !== "uni-results"
    ) {
      return null;
    }
    if (answers.some((a) => a == null)) return null;
    return scoreCareerQuiz(answers);
  }, [answers, phase]);

  const uniRec: UniversityRecommendation | null = useMemo(() => {
    if (phase !== "uni-results" || !result || !academic) return null;
    return recommendUniversities(result, academic);
  }, [phase, result, academic]);

  useEffect(() => {
    onRecommend?.(result?.track.id ?? null);
  }, [result, onRecommend]);

  function startQuiz() {
    setPhase("quiz");
    setStep(0);
    setAnswers(Array(CAREER_QUESTIONS.length).fill(null));
    setAcademic(null);
    setGpaError(null);
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
    setAcademic(null);
    setGpaRaw("3.50");
    setHasIelts("no");
    setIeltsBand(6.0);
    setGpaError(null);
    onRecommend?.(null);
  }

  function submitAcademic(profile: StudentAcademicProfile) {
    setAcademic(profile);
    setGpaError(null);
    setPhase("uni-results");
  }

  function onSubmitForm(e: FormEvent) {
    e.preventDefault();
    const gpa = parseGpaInput(gpaRaw);
    if (gpa == null) {
      setGpaError("GPA 0.00–4.00 аралығында болуы керек");
      return;
    }
    submitAcademic({
      gpa,
      hasIelts: hasIelts === "yes",
      ieltsBand: hasIelts === "yes" ? ieltsBand : null,
    });
  }

  function skipForm() {
    setGpaRaw(String(DEFAULT_ACADEMIC_PROFILE.gpa.toFixed(2)));
    setHasIelts("no");
    submitAcademic({ ...DEFAULT_ACADEMIC_PROFILE });
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

        {(phase === "quiz" ||
          phase === "results" ||
          phase === "uni-form" ||
          phase === "uni-results") && (
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
                <li>
                  • GPA мен IELTS бойынша әлемдік және Қазақстан университеттері
                </li>
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

          {(phase === "results" ||
            phase === "uni-form" ||
            phase === "uni-results") &&
            result && (
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

                {phase === "results" && (
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      onClick={() => setPhase("uni-form")}
                    >
                      Университет ұсынысын алу
                    </Button>
                    <Button
                      type="button"
                      onClick={() => onRegisterWithTrack?.(result.track.id)}
                    >
                      Осы бағытпен тіркелу
                    </Button>
                    <Button type="button" variant="ghost" onClick={reset}>
                      Тестті қайталау
                    </Button>
                  </div>
                )}

                {phase === "uni-form" && (
                  <form
                    onSubmit={onSubmitForm}
                    className="space-y-5 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4 sm:p-5"
                  >
                    <div>
                      <h4 className="font-display text-lg font-semibold text-[var(--foreground)]">
                        Академиялық профиль
                      </h4>
                      <p className="mt-1 text-sm text-[var(--foreground-soft)]">
                        GPA және IELTS бойынша сізге сай университеттерді
                        сұрыптаймыз.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quiz-gpa">GPA (0.00–4.00)</Label>
                      <Input
                        id="quiz-gpa"
                        name="gpa"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={4}
                        step={0.01}
                        required
                        value={gpaRaw}
                        onChange={(e) => {
                          setGpaRaw(e.target.value);
                          setGpaError(null);
                        }}
                        placeholder="3.50"
                      />
                      {gpaError && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {gpaError}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>IELTS сертификаты</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant={hasIelts === "yes" ? "default" : "outline"}
                          onClick={() => setHasIelts("yes")}
                        >
                          Бар
                        </Button>
                        <Button
                          type="button"
                          variant={hasIelts === "no" ? "default" : "outline"}
                          onClick={() => setHasIelts("no")}
                        >
                          Жоқ
                        </Button>
                      </div>
                    </div>

                    {hasIelts === "yes" && (
                      <div className="space-y-2">
                        <Label htmlFor="quiz-ielts">IELTS балл (0–9)</Label>
                        <select
                          id="quiz-ielts"
                          className="flex h-11 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--foreground)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                          value={ieltsBand}
                          onChange={(e) =>
                            setIeltsBand(Number(e.target.value))
                          }
                        >
                          {IELTS_BANDS.map((b) => (
                            <option key={b} value={b}>
                              {b.toFixed(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <Button type="submit">Университеттерді көрсету</Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={skipForm}
                      >
                        Өткізіп жіберу
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setPhase("results")}
                      >
                        Артқа
                      </Button>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      «Өткізіп жіберу» — GPA 3.50 және IELTS жоқ деп есептейді.
                    </p>
                  </form>
                )}

                {phase === "uni-results" && uniRec && academic && (
                  <div className="space-y-8">
                    <p className="text-sm text-[var(--foreground-soft)]">
                      Профиль: GPA {academic.gpa.toFixed(2)}
                      {academic.hasIelts && academic.ieltsBand != null
                        ? ` · IELTS ${academic.ieltsBand.toFixed(1)}`
                        : " · IELTS жоқ"}
                    </p>

                    <UniversityList
                      title="Әлемдік топ-10 университет"
                      items={uniRec.world}
                    />
                    <UniversityList
                      title="Қазақстандық топ-5 университет"
                      items={uniRec.kz}
                    />

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
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setAcademic(null);
                          setPhase("uni-form");
                        }}
                      >
                        GPA / IELTS өзгерту
                      </Button>
                      <Button type="button" variant="ghost" onClick={reset}>
                        Тестті қайталау
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </section>
  );
}

function UniversityList({
  title,
  items,
}: {
  title: string;
  items: UniversityMatch[];
}) {
  return (
    <div>
      <h4 className="font-display text-lg font-semibold text-[var(--foreground)]">
        {title}
      </h4>
      <ol className="mt-4 space-y-3">
        {items.map((item, index) => {
          const u = item.university;
          return (
            <li
              key={u.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-[var(--primary)]">
                    #{index + 1}
                  </p>
                  <p className="mt-1 font-display text-base font-semibold text-[var(--foreground)] sm:text-lg">
                    {u.nameKk}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {u.city}, {u.country}
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
                {item.whyKk}
              </p>
              <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                {item.gpaHintKk} · {item.ieltsHintKk}
              </p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Байланысты: {item.relatedProfessionKk} · {item.relatedTrackKk}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
