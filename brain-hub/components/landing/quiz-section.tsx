"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/components/i18n-provider";
import {
  CAREER_QUESTIONS,
  scoreCareerQuiz,
  type CareerQuizOption,
  type CareerQuizResult,
} from "@/lib/career-quiz";
import {
  getQuestions,
  getQuizMeta,
  getTrack,
  localizeQuizResult,
  localizeUniversityMatch,
} from "@/lib/i18n/localize";
import type { TrackId } from "@/lib/quiz-data";
import { UniversityDetailPanel } from "@/components/landing/university-detail-panel";
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
  const { locale, t } = useI18n();
  const questions = useMemo(() => getQuestions(locale), [locale]);
  const meta = useMemo(() => getQuizMeta(locale), [locale]);
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
  const [selectedUni, setSelectedUni] = useState<UniversityMatch | null>(null);

  const current = questions[step];
  const selectedIndex = useMemo(() => {
    if (phase !== "quiz" || !current) return null;
    const existing = answers[step];
    if (!existing) return null;
    const idx = CAREER_QUESTIONS[step].options.findIndex((o) => o === existing);
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
    return localizeQuizResult(locale, scoreCareerQuiz(answers));
  }, [answers, phase, locale]);

  const uniRec: UniversityRecommendation | null = useMemo(() => {
    if (phase !== "uni-results" || !result || !academic) return null;
    const raw = recommendUniversities(result, academic);
    const mapList = (items: UniversityMatch[]) =>
      items.map((item) =>
        localizeUniversityMatch(
          locale,
          item,
          getTrack(locale, item.university.tracks[0] ?? result.track.id).name,
          item.relatedProfessionKk,
        ),
      );
    return { world: mapList(raw.world), kz: mapList(raw.kz) };
  }, [phase, result, academic, locale]);

  useEffect(() => {
    onRecommend?.(result?.track.id ?? null);
  }, [result, onRecommend]);

  function startQuiz() {
    setPhase("quiz");
    setStep(0);
    setAnswers(Array(CAREER_QUESTIONS.length).fill(null));
    setAcademic(null);
    setSelectedUni(null);
    setGpaError(null);
    onRecommend?.(null);
  }

  function selectOption(index: number) {
    const nextAnswers = [...answers];
    nextAnswers[step] = CAREER_QUESTIONS[step].options[index];
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
    setSelectedUni(null);
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
      setGpaError(t("quiz.gpaError"));
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
    <section
      id="quiz"
      className="scroll-mt-24 border-y border-[var(--border)] bg-[var(--muted)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {meta.title}
          </h2>
          <p className="mt-3 text-base text-[var(--foreground-soft)] sm:text-lg">
            {meta.subtitle}
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

        <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-soft sm:p-8">
          {phase === "start" && (
            <div className="motion-safe:animate-rise space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
                30 · {meta.estimatedMinutes}
              </p>
              <h3 className="font-display text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
                {t("quiz.startTitle")}
              </h3>
              <ul className="space-y-2 text-sm text-[var(--foreground-soft)]">
                <li>• {t("quiz.bullet1")}</li>
                <li>• {t("quiz.bullet2")}</li>
                <li>• {t("quiz.bullet3")}</li>
                <li>• {t("quiz.bullet4")}</li>
              </ul>
              <Button type="button" size="lg" onClick={startQuiz}>
                {t("quiz.start")}
              </Button>
            </div>
          )}

          {phase === "quiz" && current && (
            <div key={current.id} className="motion-safe:animate-fade-swap">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
                {t("quiz.questionOf", { n: step + 1, total: CAREER_QUESTIONS.length })}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
                {current.question}
              </h3>
              <div className="mt-6 grid gap-3">
                {current.options.map((option, index) => {
                  const active = selectedIndex === index;
                  return (
                    <button
                      key={`${current.id}-${index}`}
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
                    ? t("quiz.seeResults")
                    : t("quiz.next")}
                </Button>
                {step > 0 && (
                  <Button type="button" variant="ghost" onClick={goBack}>
                    {t("quiz.back")}
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
                    {t("quiz.result")}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
                    {t("quiz.recommendedTrack", { name: result.track.name })}
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
                    {t("quiz.top5")}
                  </h4>
                  <ol className="mt-4 space-y-3">
                    {result.topProfessions.map((item, index) => {
                      const trackName = getTrack(locale, item.profession.trackId).name;
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
                                {t("quiz.trackLabel", { name: trackName })}
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
                      {t("quiz.getUnis")}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => onRegisterWithTrack?.(result.track.id)}
                    >
                      {t("quiz.registerTrack")}
                    </Button>
                    <Button type="button" variant="ghost" onClick={reset}>
                      {t("quiz.restart")}
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
                        {t("quiz.academicTitle")}
                      </h4>
                      <p className="mt-1 text-sm text-[var(--foreground-soft)]">
                        {t("quiz.academicHint")}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quiz-gpa">{t("quiz.gpa")}</Label>
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
                      <Label>{t("quiz.ieltsCert")}</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant={hasIelts === "yes" ? "default" : "outline"}
                          onClick={() => setHasIelts("yes")}
                        >
                          {t("quiz.ieltsYes")}
                        </Button>
                        <Button
                          type="button"
                          variant={hasIelts === "no" ? "default" : "outline"}
                          onClick={() => setHasIelts("no")}
                        >
                          {t("quiz.ieltsNo")}
                        </Button>
                      </div>
                    </div>

                    {hasIelts === "yes" && (
                      <div className="space-y-2">
                        <Label htmlFor="quiz-ielts">{t("quiz.ieltsBand")}</Label>
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
                      <Button type="submit">{t("quiz.showUnis")}</Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={skipForm}
                      >
                        {t("quiz.skip")}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setPhase("results")}
                      >
                        {t("quiz.backShort")}
                      </Button>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {t("quiz.skipHint")}
                    </p>
                  </form>
                )}

                {phase === "uni-results" && uniRec && academic && (
                  <div className="space-y-8">
                    <p className="text-sm text-[var(--foreground-soft)]">
                      {t("quiz.profile", { gpa: academic.gpa.toFixed(2) })}
                      {academic.hasIelts && academic.ieltsBand != null
                        ? t("quiz.profileIelts", {
                            band: academic.ieltsBand.toFixed(1),
                          })
                        : t("quiz.profileNoIelts")}
                    </p>

                    <UniversityList
                      title={t("quiz.worldUnis")}
                      items={uniRec.world}
                      relatedLabel={(profession, track) =>
                        t("quiz.related", { profession, track })
                      }
                      openLabel={t("uni.openDetail")}
                      onSelect={setSelectedUni}
                    />
                    <UniversityList
                      title={t("quiz.kzUnis")}
                      items={uniRec.kz}
                      relatedLabel={(profession, track) =>
                        t("quiz.related", { profession, track })
                      }
                      openLabel={t("uni.openDetail")}
                      onSelect={setSelectedUni}
                    />

                    <div className="flex flex-wrap gap-3">
                      <Button
                        type="button"
                        onClick={() => onRegisterWithTrack?.(result.track.id)}
                      >
                        {t("quiz.registerTrack")}
                      </Button>
                      <Button asChild variant="outline">
                        <a href="#top">{t("quiz.viewTracks")}</a>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setAcademic(null);
                          setPhase("uni-form");
                        }}
                      >
                        {t("quiz.editAcademic")}
                      </Button>
                      <Button type="button" variant="ghost" onClick={reset}>
                        {t("quiz.restart")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>

      {selectedUni && academic && result && (
        <UniversityDetailPanel
          match={selectedUni}
          profile={academic}
          quiz={result}
          onClose={() => setSelectedUni(null)}
        />
      )}
    </section>
  );
}

function UniversityList({
  title,
  items,
  relatedLabel,
  openLabel,
  onSelect,
}: {
  title: string;
  items: UniversityMatch[];
  relatedLabel: (profession: string, track: string) => string;
  openLabel: string;
  onSelect: (item: UniversityMatch) => void;
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
            <li key={u.id}>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-4 text-left transition-colors hover:border-[var(--primary)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
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
                  {relatedLabel(item.relatedProfessionKk, item.relatedTrackKk)}
                </p>
                <p className="mt-3 text-xs font-semibold text-[var(--primary)]">
                  {openLabel} →
                </p>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
