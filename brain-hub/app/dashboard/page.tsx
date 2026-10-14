import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { readSessionStudent } from "@/lib/auth";
import { getDashboardSubjects, getOverallProgress } from "@/lib/db";
import { TRACKS } from "@/lib/quiz-data";

export const instant = false;

export default async function DashboardPage() {
  const student = await readSessionStudent();
  if (!student) redirect("/");

  const track = TRACKS.find((t) => t.id === student.track);
  const subjects = await getDashboardSubjects(student);
  const progressPct = await getOverallProgress(student);
  const isVip = student.track === "vip-ielts";

  return (
    <DashboardShell>
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
          <p className="text-sm text-[var(--ink-muted)]">Жалпы прогресс</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--teal-deep)]">
            {progressPct}%
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--mist)]">
            <div
              className="h-full rounded-full bg-[var(--coral)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-[var(--ink-soft)]">
            Бейне + үй жұмысы + тест нәтижелерінен есептеледі.
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--teal-deep)]/10 bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--ink-muted)]">GPA</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--teal-deep)]">
            {Number(student.gpa).toFixed(2)}{" "}
            <span className="text-lg text-[var(--ink-muted)]">/ 4.0</span>
          </p>
          <p className="mt-3 text-sm text-[var(--ink-soft)]">
            Прогресс өзгерген сайын GPA жаңарады.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--teal-deep)]">
              {isVip ? "IELTS модульдері" : "Пәндер"}
            </h2>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              {isVip
                ? "VIP IELTS бағытының негізгі мазмұны."
                : `${track?.name} бағыты бойынша пәндер.`}
            </p>
          </div>
          <a
            href="/dashboard/ielts"
            className="text-sm font-semibold text-[var(--coral)] hover:underline"
          >
            VIP IELTS сервисі →
          </a>
        </div>

        {subjects.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[var(--teal-deep)]/20 bg-[var(--surface)] p-8 text-sm text-[var(--ink-muted)]">
            Пәндер жүктелуде немесе әзірге жоқ.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <a
                key={subject.id}
                href={`/dashboard/subjects/${subject.slug}`}
                className="rounded-2xl border border-[var(--teal-deep)]/10 bg-[var(--surface)] p-5 transition-transform hover:-translate-y-0.5"
              >
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--ink)]">
                  {subject.name}
                </h3>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">
                  {subject.watchedCount}/{subject.videoCount} бейне қаралды
                </p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--mist)]">
                  <div
                    className="h-full rounded-full bg-[var(--coral)]"
                    style={{ width: `${subject.percent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs font-semibold text-[var(--teal-mid)]">
                  Прогресс: {Math.round(subject.percent)}%
                </p>
              </a>
            ))}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
