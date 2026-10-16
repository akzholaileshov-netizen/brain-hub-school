"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { SubjectDetail } from "@/lib/db";

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Props = {
  subject: SubjectDetail;
};

export function SubjectLearningPanel({ subject }: Props) {
  const router = useRouter();
  const [activeVideoId, setActiveVideoId] = useState(subject.videos[0]?.id);
  const [percent, setPercent] = useState(subject.percent);
  const [videos, setVideos] = useState(subject.videos);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const activeVideo = useMemo(
    () => videos.find((v) => v.id === activeVideoId) ?? videos[0],
    [videos, activeVideoId],
  );

  async function markWatched(videoId: number) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/learning/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });
      const data = (await res.json()) as {
        error?: string;
        subjectPercent?: number;
      };
      if (!res.ok) {
        setError(data.error || "Бейнені сақтау мүмкін болмады.");
        return;
      }
      setVideos((prev) =>
        prev.map((v) => (v.id === videoId ? { ...v, watched: true } : v)),
      );
      if (typeof data.subjectPercent === "number") {
        setPercent(data.subjectPercent);
      }
      setMessage("Бейне қаралды деп белгіленді.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            Пән модулі
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            {subject.name}
          </h1>
        </div>
        <div className="rounded-xl bg-[var(--muted)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]">
          Прогресс: {Math.round(percent)}%
        </div>
      </div>

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

      <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-black">
          {activeVideo ? (
            <video
              key={activeVideo.id}
              className="aspect-video w-full"
              controls
              preload="metadata"
              src={activeVideo.videoUrl}
              onEnded={() => markWatched(activeVideo.id)}
            >
              Сіздің браузеріңіз бейнені қолдамайды.
            </video>
          ) : (
            <div className="flex aspect-video items-center justify-center text-sm text-white/80">
              Бейне сабақтар әзірге жоқ.
            </div>
          )}
          {activeVideo && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--card)] px-4 py-3">
              <div>
                <p className="font-semibold text-[var(--foreground)]">
                  {activeVideo.title}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Ұзақтығы: {formatDuration(activeVideo.durationSec)} ·{" "}
                  {activeVideo.watched ? "Қаралған" : "Қаралмаған"}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                disabled={busy || activeVideo.watched}
                onClick={() => markWatched(activeVideo.id)}
              >
                {activeVideo.watched ? "Қаралды" : "Қаралды деп белгілеу"}
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
            Бейне сабақтар
          </h2>
          <ul className="mt-3 space-y-2">
            {videos.map((video) => (
              <li key={video.id}>
                <button
                  type="button"
                  onClick={() => setActiveVideoId(video.id)}
                  className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    video.id === activeVideo?.id
                      ? "bg-[var(--muted)] text-[var(--foreground)]"
                      : "hover:bg-[var(--muted)]/70"
                  }`}
                >
                  <span className="font-medium">{video.title}</span>
                  <span className="mt-1 block text-xs text-[var(--muted-foreground)]">
                    {formatDuration(video.durationSec)} ·{" "}
                    {video.watched ? "Қаралған" : "Жаңа"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-display text-xl font-semibold text-[var(--foreground)]">
          Үй жұмысы және тесттер
        </h2>
        {subject.assessments.map((assessment) => (
          <AssessmentCard
            key={assessment.id}
            assessment={assessment}
            onDone={(subjectPercent) => {
              setPercent(subjectPercent);
              setMessage(`${assessment.title}: нәтиже сақталды.`);
              router.refresh();
            }}
            onError={setError}
          />
        ))}
      </section>
    </div>
  );
}

function AssessmentCard({
  assessment,
  onDone,
  onError,
}: {
  assessment: SubjectDetail["assessments"][number];
  onDone: (subjectPercentHint: number) => void;
  onError: (msg: string) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{
    score: number;
    total: number;
    percent: number;
  } | null>(
    assessment.bestPercent != null
      ? {
          score: 0,
          total: assessment.questionCount,
          percent: assessment.bestPercent,
        }
      : null,
  );
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (Object.keys(answers).length < assessment.questions.length) {
      onError("Барлық сұраққа жауап беріңіз.");
      return;
    }
    setLoading(true);
    onError("");
    try {
      const res = await fetch("/api/learning/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: assessment.id,
          answers,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        score?: number;
        total?: number;
        percent?: number;
        subjectPercent?: number;
      };
      if (!res.ok) {
        onError(data.error || "Тапсырманы жіберу мүмкін болмады.");
        return;
      }
      setResult({
        score: data.score ?? 0,
        total: data.total ?? 0,
        percent: data.percent ?? 0,
      });
      onDone(data.subjectPercent ?? assessment.bestPercent ?? 0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
            {assessment.type === "homework" ? "Үй жұмысы" : "Тест"}
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold text-[var(--foreground)]">
            {assessment.title}
          </h3>
        </div>
        {assessment.bestPercent != null && (
          <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
            Үздік нәтиже: {Math.round(assessment.bestPercent)}%
          </span>
        )}
      </div>

      <div className="mt-4 space-y-4">
        {assessment.questions.map((question, index) => (
          <fieldset key={question.id} className="space-y-2">
            <legend className="text-sm font-medium text-[var(--foreground)]">
              {index + 1}. {question.prompt}
            </legend>
            <div className="grid gap-2">
              {question.options.map((option, optionIndex) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-start gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--muted)]/60"
                >
                  <input
                    type="radio"
                    className="mt-1"
                    name={`q-${assessment.id}-${question.id}`}
                    checked={answers[String(question.id)] === optionIndex}
                    onChange={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [String(question.id)]: optionIndex,
                      }))
                    }
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button type="button" onClick={submit} disabled={loading}>
          {loading ? "Жіберілуде…" : "Жауаптарды жіберу"}
        </Button>
        {result && (
          <p className="text-sm font-medium text-[var(--primary)]">
            Нәтиже: {result.percent}%
            {result.score
              ? ` (${result.score}/${result.total})`
              : ""}
          </p>
        )}
      </div>
    </article>
  );
}
