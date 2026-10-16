import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { readSessionStudent } from "@/lib/auth";
import { getDashboardSubjects, getOverallProgress } from "@/lib/db";
import { TRACKS } from "@/lib/quiz-data";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const instant = false;

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) redirect("/");

  const student = await readSessionStudent();
  if (!student) redirect("/");

  const track = TRACKS.find((t) => t.id === student.track);
  const subjects = await getDashboardSubjects(student);
  const progressPct = await getOverallProgress(student);
  const isVip = student.track === "vip-ielts";

  return (
    <DashboardShell>
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          Студент профилі
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
          {student.full_name}
        </h1>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--foreground-soft)]">
          <p>
            <span className="text-[var(--muted-foreground)]">ID:</span>{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {student.student_id}
            </span>
          </p>
          <p>
            <span className="text-[var(--muted-foreground)]">Бағыт:</span>{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {track?.name ?? student.track}
            </span>
          </p>
          <p>
            <span className="text-[var(--muted-foreground)]">Почта:</span>{" "}
            {student.email}
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-sm text-[var(--muted-foreground)]">Жалпы прогресс</p>
          <p className="mt-2 font-display text-3xl font-semibold text-[var(--foreground)]">
            {progressPct}%
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className="h-full rounded-full bg-[var(--primary)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-[var(--foreground-soft)]">
            Бейне + үй жұмысы + тест нәтижелерінен есептеледі.
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-sm text-[var(--muted-foreground)]">GPA</p>
          <p className="mt-2 font-display text-3xl font-semibold text-[var(--foreground)]">
            {Number(student.gpa).toFixed(2)}{" "}
            <span className="text-lg text-[var(--muted-foreground)]">/ 4.0</span>
          </p>
          <p className="mt-3 text-sm text-[var(--foreground-soft)]">
            Прогресс өзгерген сайын GPA жаңарады.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[var(--foreground)]">
              {isVip ? "IELTS модульдері" : "Пәндер"}
            </h2>
            <p className="mt-2 text-sm text-[var(--foreground-soft)]">
              {isVip
                ? "VIP IELTS бағытының негізгі мазмұны."
                : `${track?.name} бағыты бойынша пәндер.`}
            </p>
          </div>
          <a
            href="/dashboard/ielts"
            className="text-sm font-semibold text-[var(--primary)] hover:underline"
          >
            VIP IELTS сервисі →
          </a>
        </div>

        {subjects.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-sm text-[var(--muted-foreground)]">
            Пәндер жүктелуде немесе әзірге жоқ.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <a
                key={subject.id}
                href={`/dashboard/subjects/${subject.slug}`}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-transform hover:-translate-y-0.5"
              >
                <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                  {subject.name}
                </h3>
                <p className="mt-2 text-sm text-[var(--foreground-soft)]">
                  {subject.watchedCount}/{subject.videoCount} бейне қаралды
                </p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
                  <div
                    className="h-full rounded-full bg-[var(--primary)]"
                    style={{ width: `${subject.percent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs font-semibold text-[var(--primary)]">
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
