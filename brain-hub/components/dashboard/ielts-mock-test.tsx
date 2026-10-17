"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  IELTS_MOCK_DURATION_SEC,
  IELTS_MOCK_SECTION_META,
  type MockReviewItem,
  type MockSectionId,
  type PublicMockQuestion,
  type SectionScore,
} from "@/lib/ielts-mock-data";

type Passage = { id: string; title: string; text: string };

type MockHistory = {
  id: number;
  score: number;
  total: number;
  percent: number;
  band: number;
  createdAt: string;
  sectionScores?: SectionScore[] | null;
  durationSec?: number | null;
};

type Props = {
  questions: PublicMockQuestion[];
  passages: Passage[];
  history: MockHistory[];
};

type Phase = "intro" | "test" | "review" | "result";

const SECTIONS: MockSectionId[] = [
  "grammar",
  "vocabulary",
  "reading",
  "writing",
];

export function IeltsMockTest({
  questions,
  passages,
  history: initialHistory,
}: Props) {
  const router = useRouter();
  const [history, setHistory] = useState(initialHistory);
  const [phase, setPhase] = useState<Phase>("intro");
  const [section, setSection] = useState<MockSectionId>("grammar");
  const [secondsLeft, setSecondsLeft] = useState(IELTS_MOCK_DURATION_SEC);
  const [answers, setAnswers] = useState<
    Record<string, string | number | null>
  >({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    score: number;
    total: number;
    percent: number;
    band: number;
    sectionScores: SectionScore[];
    review: MockReviewItem[];
    saveWarning?: string;
  } | null>(null);
  const autoSubmitted = useRef(false);

  const passageMap = useMemo(() => {
    const m = new Map<string, Passage>();
    for (const p of passages) m.set(p.id, p);
    return m;
  }, [passages]);

  const sectionQuestions = useMemo(
    () => questions.filter((q) => q.section === section),
    [questions, section],
  );

  const answeredCount = useMemo(() => {
    return questions.filter((q) => {
      if (q.type === "writing") {
        const v = answers[q.id];
        return typeof v === "string" && v.trim().length > 0;
      }
      const v = answers[q.id];
      return v !== null && v !== undefined && v !== "";
    }).length;
  }, [answers, questions]);

  useEffect(() => {
    if (phase !== "test" && phase !== "review") return;
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase, secondsLeft]);

  useEffect(() => {
    if (phase !== "test" && phase !== "review") return;
    if (secondsLeft > 0 || autoSubmitted.current) return;
    autoSubmitted.current = true;
    void submit(true);
    // submit closes over latest answers via state at call time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, phase]);

  const timerLabel = useMemo(() => {
    const m = Math.floor(Math.max(0, secondsLeft) / 60);
    const s = Math.max(0, secondsLeft) % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }, [secondsLeft]);

  function startTest() {
    autoSubmitted.current = false;
    setPhase("test");
    setSection("grammar");
    setSecondsLeft(IELTS_MOCK_DURATION_SEC);
    setAnswers({});
    setResult(null);
    setError(null);
  }

  function setAnswer(id: string, value: string | number | null) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function submit(auto = false) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const durationSec = IELTS_MOCK_DURATION_SEC - Math.max(0, secondsLeft);
      const res = await fetch("/api/ielts/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, durationSec, autoSubmit: auto }),
      });
      const data = (await res.json()) as {
        error?: string;
        score?: number;
        total?: number;
        percent?: number;
        band?: number;
        sectionScores?: SectionScore[];
        review?: MockReviewItem[];
        history?: MockHistory[];
        saved?: boolean;
        saveWarning?: string;
      };
      if (!res.ok) {
        setError(data.error || "Тестті жіберу мүмкін болмады.");
        return;
      }
      setResult({
        score: data.score ?? 0,
        total: data.total ?? 0,
        percent: data.percent ?? 0,
        band: data.band ?? 0,
        sectionScores: data.sectionScores ?? [],
        review: data.review ?? [],
        saveWarning: data.saveWarning,
      });
      if (data.history) setHistory(data.history);
      setPhase("result");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
            IELTS форматындағы mock-тест
          </h2>
          <p className="mt-1 max-w-xl text-sm text-[var(--foreground-soft)]">
            Грамматика, сөздік, оқу (+ жазу тапсырмасы). Сұрақтар ағылшын тілінде;
            нұсқаулық пен нәтиже — қазақша. Шамамен {questions.filter((q) => q.type !== "writing").length}{" "}
            бағаланатын сұрақ · {Math.round(IELTS_MOCK_DURATION_SEC / 60)} минут.
          </p>
        </div>
        {(phase === "test" || phase === "review") && (
          <p
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              secondsLeft < 120
                ? "bg-[var(--destructive)]/15 text-[var(--destructive)]"
                : "bg-[var(--muted)] text-[var(--foreground)]"
            }`}
          >
            Қалған уақыт: {timerLabel}
          </p>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-3 py-2 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {phase === "intro" && (
        <div className="mt-5 space-y-4">
          <ul className="list-inside list-disc space-y-1 text-sm text-[var(--foreground-soft)]">
            <li>Бөлімдер бойынша өтіңіз; жауаптарды кейін өзгертуге болады.</li>
            <li>Уақыт біткенде тест автоматты жіберіледі.</li>
            <li>
              Band бағасы — шамамен есептелген көрсеткіш, ресми IELTS нәтижесі емес.
            </li>
            <li>Writing бөлімі сақталады, бірақ автоматты балл қойылмайды.</li>
          </ul>
          <Button type="button" onClick={startTest}>
            Тестті бастау
          </Button>
        </div>
      )}

      {(phase === "test" || phase === "review") && (
        <div className="mt-5 space-y-5">
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map((id) => {
              const meta = IELTS_MOCK_SECTION_META[id];
              const count = questions.filter((q) => q.section === id).length;
              const done = questions.filter((q) => {
                if (q.section !== id) return false;
                const v = answers[q.id];
                if (q.type === "writing")
                  return typeof v === "string" && v.trim().length > 0;
                return v !== null && v !== undefined && v !== "";
              }).length;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSection(id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                    section === id
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "bg-[var(--muted)] text-[var(--foreground-soft)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {meta.titleKk} ({done}/{count})
                </button>
              );
            })}
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className="h-full rounded-full bg-[var(--primary)] transition-all"
              style={{
                width: `${Math.round((answeredCount / Math.max(1, questions.length)) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            Жауап берілді: {answeredCount} / {questions.length}
          </p>

          {phase === "test" && (
            <div className="space-y-6">
              {sectionQuestions.map((q, i) => {
                const passage = q.passageId
                  ? passageMap.get(q.passageId)
                  : null;
                const showPassage =
                  passage &&
                  (i === 0 ||
                    sectionQuestions[i - 1]?.passageId !== q.passageId);
                return (
                  <div key={q.id} className="space-y-3">
                    {showPassage && passage && (
                      <article className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-4 text-sm leading-relaxed text-[var(--foreground)]">
                        <h3 className="font-display text-base font-semibold">
                          {passage.title}
                        </h3>
                        <p className="mt-3 whitespace-pre-wrap">{passage.text}</p>
                      </article>
                    )}
                    <fieldset className="space-y-2">
                      <legend className="text-sm font-medium text-[var(--foreground)]">
                        <span className="text-[var(--muted-foreground)]">
                          {q.id.toUpperCase()}.
                        </span>{" "}
                        {q.text}
                      </legend>
                      {(q.type === "mcq" || q.type === "tfng") &&
                        q.options?.map((option, optionIndex) => (
                          <label
                            key={option}
                            className="flex cursor-pointer gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--muted)]/50"
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={answers[q.id] === optionIndex}
                              onChange={() => setAnswer(q.id, optionIndex)}
                            />
                            {option}
                          </label>
                        ))}
                      {q.type === "short" && (
                        <input
                          className="flex h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm"
                          value={
                            typeof answers[q.id] === "string"
                              ? (answers[q.id] as string)
                              : ""
                          }
                          onChange={(e) => setAnswer(q.id, e.target.value)}
                          placeholder="Type your answer in English"
                        />
                      )}
                      {q.type === "writing" && (
                        <textarea
                          className="min-h-40 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
                          value={
                            typeof answers[q.id] === "string"
                              ? (answers[q.id] as string)
                              : ""
                          }
                          onChange={(e) => setAnswer(q.id, e.target.value)}
                          placeholder="Write your essay in English (not auto-scored)"
                        />
                      )}
                    </fieldset>
                  </div>
                );
              })}
            </div>
          )}

          {phase === "review" && (
            <div className="space-y-3">
              <p className="text-sm text-[var(--foreground-soft)]">
                Жібермес бұрын жауаптарыңызды тексеріңіз. Бос сұрақтар қызылмен
                белгіленген.
              </p>
              <ul className="space-y-2">
                {questions.map((q) => {
                  const v = answers[q.id];
                  const filled =
                    q.type === "writing"
                      ? typeof v === "string" && v.trim().length > 0
                      : v !== null && v !== undefined && v !== "";
                  return (
                    <li
                      key={q.id}
                      className={`rounded-lg px-3 py-2 text-sm ${
                        filled
                          ? "bg-[var(--muted)]/60"
                          : "border border-[var(--destructive)]/40 bg-[var(--destructive)]/10"
                      }`}
                    >
                      <button
                        type="button"
                        className="text-left font-medium text-[var(--foreground)]"
                        onClick={() => {
                          setSection(q.section);
                          setPhase("test");
                        }}
                      >
                        {q.id} · {IELTS_MOCK_SECTION_META[q.section].titleEn} —{" "}
                        {filled ? "толтырылған" : "бос"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {phase === "test" && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setPhase("review")}
              >
                Қарау экраны
              </Button>
            )}
            {phase === "review" && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setPhase("test")}
              >
                Сұрақтарға оралу
              </Button>
            )}
            <Button type="button" disabled={busy} onClick={() => submit(false)}>
              {busy ? "Жіберілуде…" : "Тестті жіберу"}
            </Button>
          </div>
        </div>
      )}

      {phase === "result" && result && (
        <div className="mt-5 space-y-5">
          <div className="rounded-xl border border-[var(--primary)]/25 bg-[var(--muted)]/50 p-4">
            <p className="font-display text-xl font-semibold text-[var(--foreground)]">
              Нәтиже: {result.score}/{result.total} ({result.percent}%) · Band{" "}
              {result.band.toFixed(1)}
            </p>
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              Ескерту: бұл шамамен есептелген IELTS band (0–9, 0.5 қадам). Ресми
              емтихан нәтижесін алмастырмайды.
            </p>
            {result.saveWarning && (
              <p className="mt-2 text-xs text-[var(--destructive)]">
                {result.saveWarning}
              </p>
            )}
            <ul className="mt-3 grid gap-2 sm:grid-cols-3">
              {result.sectionScores.map((s) => (
                <li
                  key={s.section}
                  className="rounded-lg bg-[var(--card)] px-3 py-2 text-sm"
                >
                  <p className="font-medium">
                    {IELTS_MOCK_SECTION_META[s.section].titleKk}
                  </p>
                  <p className="text-[var(--muted-foreground)]">
                    {s.correct}/{s.total} · {s.percent}%
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-base font-semibold">
              Жауаптарды қайта қарау
            </h3>
            {result.review.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-[var(--border)] p-3 text-sm"
              >
                <p className="font-medium text-[var(--foreground)]">
                  {item.id}. {item.text}
                </p>
                {item.type !== "writing" && (
                  <p className="mt-1 text-xs">
                    Сіздің жауабыңыз:{" "}
                    <span className="font-semibold">
                      {formatUserAnswer(item)}
                    </span>{" "}
                    ·{" "}
                    <span
                      className={
                        item.correct
                          ? "text-[var(--primary)]"
                          : "text-[var(--destructive)]"
                      }
                    >
                      {item.correct ? "Дұрыс" : "Қате / бос"}
                    </span>
                  </p>
                )}
                {item.type === "writing" && (
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    Жазба сақталды (автоматты балл жоқ).
                  </p>
                )}
                <p className="mt-2 text-[var(--foreground-soft)]">
                  {item.explanationKk}
                </p>
              </article>
            ))}
          </div>

          <Button type="button" variant="secondary" onClick={startTest}>
            Қайта тапсыру
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
                Band {item.band.toFixed(1)} · {item.score}/{item.total} (
                {item.percent}%) ·{" "}
                {new Date(item.createdAt).toLocaleString("kk-KZ")}
                {item.durationSec != null
                  ? ` · ${Math.round(item.durationSec / 60)} мин`
                  : ""}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function formatUserAnswer(item: MockReviewItem): string {
  if (item.userAnswer == null || item.userAnswer === "") return "—";
  if (
    (item.type === "mcq" || item.type === "tfng") &&
    typeof item.userAnswer === "number" &&
    item.options
  ) {
    return item.options[item.userAnswer] ?? String(item.userAnswer);
  }
  return String(item.userAnswer);
}
