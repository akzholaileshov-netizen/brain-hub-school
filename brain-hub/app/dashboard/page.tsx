import { redirect } from "next/navigation";
import { IeltsServiceCard } from "@/components/dashboard/ielts-service-card";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { readSessionStudent } from "@/lib/auth";
import { getTrackSubjectsWithProgress } from "@/lib/db";
import { TRACKS } from "@/lib/quiz-data";

export const instant = false;

const STATUS_LABEL = {
  not_started: "Басталмаған",
  in_progress: "Үдерісте",
  completed: "Аяқталған",
} as const;

export default async function DashboardPage() {
  const student = await readSessionStudent();
  if (!student) {
    redirect("/");
  }

  const track = TRACKS.find((t) => t.id === student.track);
  const subjects = getTrackSubjectsWithProgress(student.id, student.track);
  const allLessons = subjects.flatMap((s) => s.lessons);
  const completed = allLessons.filter((l) => l.status === "completed").length;
  const progressPct = allLessons.length
    ? Math.round((completed / allLessons.length) * 100)
    : 0;

  return (
    <div className="min-h-full bg-[var(--canvas)] text-[var(--ink)]">
      <header className="border-b border-[var(--teal-deep)]/10 bg-[var(--surface)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a
            href="/"
            className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--teal-deep)] sm:text-xl"
          >
            Brain Hub
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-[var(--ink-muted)] sm:inline">
              Жеке кабинет
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="rounded-2xl border border-[var(--teal-deep)]/10 bg-[var(--surface)] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--coral)]">
            Студент профилі
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--teal-deep)] sm:text-3xl">
            {student.full_name}
          </h1>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--ink-soft)]">
            <p>
              <span className="text-[var(--ink-muted)]">ID:</span>{" "}
              <span className="font-semibold text-[var(--ink)]">
                {student.student_id}
              </span>
            </p>
            <p>
              <span className="text-[var(--ink-muted)]">Бағыт:</span>{" "}
              <span className="font-semibold text-[var(--ink)]">
                {track?.name ?? student.track}
              </span>
            </p>
            <p>
              <span className="text-[var(--ink-muted)]">Почта:</span>{" "}
              {student.email}
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--teal-deep)]/10 bg-[var(--surface)] p-6">
            <p className="text-sm text-[var(--ink-muted)]">Прогресс</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--teal-deep)]">
              {progressPct}%
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--mist)]">
              <div
                className="h-full rounded-full bg-[var(--coral)] transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-[var(--ink-soft)]">
              {completed} / {allLessons.length} сабақ аяқталды
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--teal-deep)]/10 bg-[var(--surface)] p-6">
            <p className="text-sm text-[var(--ink-muted)]">GPA</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--teal-deep)]">
              {student.gpa.toFixed(2)}{" "}
              <span className="text-lg text-[var(--ink-muted)]">/ 4.0</span>
            </p>
            <p className="mt-3 text-sm text-[var(--ink-soft)]">
              Үлгерім дерекқордағы сабақ прогресінен есептеледі.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--teal-deep)]">
            Пәндер мен сабақтар
          </h2>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            {track?.name} бағыты бойынша модульдер.
          </p>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {subjects.map((subject) => (
              <article
                key={subject.id}
                className="rounded-2xl border border-[var(--teal-deep)]/10 bg-[var(--surface)] p-5"
              >
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--ink)]">
                  {subject.name}
                </h3>
                <ul className="mt-4 space-y-2">
                  {subject.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className="flex items-center justify-between gap-3 rounded-lg bg-[var(--mist)]/70 px-3 py-2 text-sm"
                    >
                      <span className="text-[var(--ink-soft)]">
                        {lesson.title}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          lesson.status === "completed"
                            ? "bg-[var(--teal-mid)]/15 text-[var(--teal-deep)]"
                            : lesson.status === "in_progress"
                              ? "bg-[var(--amber)]/25 text-[var(--ink)]"
                              : "bg-white text-[var(--ink-muted)]"
                        }`}
                      >
                        {STATUS_LABEL[lesson.status]}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-8">
          <IeltsServiceCard
            enrolled={Boolean(student.ielts_enrolled)}
            prominent={student.track === "vip-ielts"}
          />
        </div>
      </main>
    </div>
  );
}
