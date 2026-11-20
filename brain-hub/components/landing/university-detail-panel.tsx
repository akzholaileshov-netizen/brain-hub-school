"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import type { CareerQuizResult } from "@/lib/career-quiz";
import {
  universityDisplayName,
  universityNotes,
} from "@/lib/i18n/localize";
import {
  buildProgramLabels,
  buildRelatedMajorLabels,
  computeUniChartMetrics,
} from "@/lib/university-detail";
import type {
  StudentAcademicProfile,
  UniversityMatch,
} from "@/lib/universities";

type UniversityDetailPanelProps = {
  match: UniversityMatch;
  profile: StudentAcademicProfile;
  quiz: CareerQuizResult;
  onClose: () => void;
};

type Tab = "detail" | "charts";

const COUNTRY_RU: Record<string, string> = {
  АҚШ: "США",
  Ұлыбритания: "Великобритания",
  Швейцария: "Швейцария",
  Сингапур: "Сингапур",
  Германия: "Германия",
  Канада: "Канада",
  Австралия: "Австралия",
  "Оңтүстік Корея": "Южная Корея",
  Жапония: "Япония",
  Нидерланд: "Нидерланды",
  Гонконг: "Гонконг",
  Чехия: "Чехия",
  Польша: "Польша",
  Малайзия: "Малайзия",
  Қазақстан: "Казахстан",
};

const CITY_RU: Record<string, string> = {
  Кембридж: "Кембридж",
  Стэнфорд: "Стэнфорд",
  Оксфорд: "Оксфорд",
  Цюрих: "Цюрих",
  Лондон: "Лондон",
  Сингапур: "Сингапур",
  Мюнхен: "Мюнхен",
  Торонто: "Торонто",
  Мельбурн: "Мельбурн",
  Тэджон: "Тэджон",
  Токио: "Токио",
  Лозанна: "Лозанна",
  Питтсбург: "Питтсбург",
  Беркли: "Беркли",
  Эдинбург: "Эдинбург",
  Делфт: "Делфт",
  Гейдельберг: "Гейдельберг",
  Гонконг: "Гонконг",
  Ковентри: "Ковентри",
  Амстердам: "Амстердам",
  Монреаль: "Монреаль",
  Канберра: "Канберра",
  Атланта: "Атланта",
  "Уэст-Лафайетт": "Уэст-Лафайетт",
  Прага: "Прага",
  Варшава: "Варшава",
  "Куала-Лумпур": "Куала-Лумпур",
  Астана: "Астана",
  Алматы: "Алматы",
  Қаскелең: "Каскелен",
};

export function UniversityDetailPanel({
  match,
  profile,
  quiz,
  onClose,
}: UniversityDetailPanelProps) {
  const { locale, t } = useI18n();
  const [tab, setTab] = useState<Tab>("detail");
  const uni = match.university;
  const metrics = useMemo(
    () => computeUniChartMetrics(match, profile, quiz),
    [match, profile, quiz],
  );
  const programs = useMemo(
    () => buildProgramLabels(locale, uni),
    [locale, uni],
  );
  const majors = useMemo(
    () => buildRelatedMajorLabels(locale, uni),
    [locale, uni],
  );

  const displayName = universityDisplayName(locale, uni);
  const notes = universityNotes(locale, uni);
  const country =
    locale === "ru" ? (COUNTRY_RU[uni.country] ?? uni.country) : uni.country;
  const city = locale === "ru" ? (CITY_RU[uni.city] ?? uni.city) : uni.city;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-[var(--background)]"
      role="dialog"
      aria-modal="true"
      aria-label={displayName}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3.5 sm:px-6">
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold text-[var(--foreground)] sm:text-lg">
            {displayName}
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">
            {city}, {country}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-[var(--foreground)] hover:bg-[var(--muted)]"
          aria-label={t("nav.closeShort")}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex shrink-0 gap-2 border-b border-[var(--border)] px-4 py-2 sm:px-6">
        <Button
          type="button"
          size="sm"
          variant={tab === "detail" ? "default" : "outline"}
          onClick={() => setTab("detail")}
        >
          {t("uni.tabDetail")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={tab === "charts" ? "default" : "outline"}
          onClick={() => setTab("charts")}
        >
          {t("uni.tabCharts")}
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {tab === "detail" ? (
            <>
              <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">
                  {t("uni.match")} · {match.matchPercent}%
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--foreground)]">
                  {displayName}
                </h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {city}, {country}
                  {uni.kind === "kz"
                    ? ` · ${t("uni.kindKz")}`
                    : ` · ${t("uni.kindWorld")}`}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--foreground-soft)]">
                  {notes}
                </p>
                <p className="mt-3 text-sm text-[var(--foreground-soft)]">
                  {match.whyKk}
                </p>
              </section>

              <section className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-4">
                  <p className="text-xs font-semibold text-[var(--muted-foreground)]">
                    {t("uni.typicalGpa")}
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold text-[var(--foreground)]">
                    {uni.minGpa.toFixed(2)}+
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {t("uni.yourGpa", { gpa: profile.gpa.toFixed(2) })}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-4">
                  <p className="text-xs font-semibold text-[var(--muted-foreground)]">
                    {t("uni.typicalIelts")}
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold text-[var(--foreground)]">
                    {uni.ieltsRequired
                      ? `${uni.minIelts.toFixed(1)}+`
                      : t("uni.ieltsNotRequired")}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {profile.hasIelts && profile.ieltsBand != null
                      ? t("uni.yourIelts", {
                          band: profile.ieltsBand.toFixed(1),
                        })
                      : t("uni.yourIeltsNone")}
                  </p>
                </div>
              </section>

              <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-soft">
                <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                  {t("uni.programs")}
                </h3>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {t("uni.programsHint")}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {programs.map((p) => (
                    <li
                      key={p.id}
                      className="rounded-md border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-sm text-[var(--foreground)]"
                    >
                      {p.label}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-soft">
                <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                  {t("uni.majors")}
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-[var(--foreground-soft)]">
                  {majors.map((m) => (
                    <li key={m.id}>• {m.label}</li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-[var(--muted-foreground)]">
                  {match.gpaHintKk} · {match.ieltsHintKk}
                </p>
              </section>

              <Button type="button" onClick={() => setTab("charts")}>
                {t("uni.showCharts")}
              </Button>
            </>
          ) : (
            <div id="uni-charts" className="space-y-6">
              <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-soft">
                <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                  {t("uni.barsTitle")}
                </h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {t("uni.barsHint")}
                </p>
                <div className="mt-5 space-y-4">
                  <MetricBar
                    label={t("uni.metricMatch")}
                    value={metrics.matchPercent}
                  />
                  <MetricBar
                    label={t("uni.metricGpa")}
                    value={metrics.gpaFitPercent}
                    caption={`${profile.gpa.toFixed(2)} / ${uni.minGpa.toFixed(2)}+`}
                  />
                  <MetricBar
                    label={t("uni.metricIelts")}
                    value={metrics.ieltsFitPercent}
                    caption={
                      uni.ieltsRequired
                        ? `${profile.hasIelts && profile.ieltsBand != null ? profile.ieltsBand.toFixed(1) : "—"} / ${uni.minIelts.toFixed(1)}+`
                        : t("uni.ieltsNotRequired")
                    }
                  />
                  <MetricBar
                    label={t("uni.metricTrack")}
                    value={metrics.trackFitPercent}
                  />
                </div>
              </section>

              <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-soft">
                <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                  {t("uni.radarTitle")}
                </h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {t("uni.radarHint")}
                </p>
                <div className="mt-4 flex justify-center">
                  <FitRadar
                    labels={[
                      t("uni.metricMatch"),
                      t("uni.metricGpa"),
                      t("uni.metricIelts"),
                      t("uni.metricTrack"),
                    ]}
                    values={[
                      metrics.matchPercent,
                      metrics.gpaFitPercent,
                      metrics.ieltsFitPercent,
                      metrics.trackFitPercent,
                    ]}
                  />
                </div>
              </section>

              <Button
                type="button"
                variant="outline"
                onClick={() => setTab("detail")}
              >
                {t("uni.backDetail")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricBar({
  label,
  value,
  caption,
}: {
  label: string;
  value: number;
  caption?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {value}%
          {caption ? (
            <span className="ml-2 text-xs font-normal text-[var(--muted-foreground)]">
              {caption}
            </span>
          ) : null}
        </p>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--foreground)]/10">
        <div
          className="h-full rounded-full bg-[var(--primary)] transition-all"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

function FitRadar({
  labels,
  values,
}: {
  labels: string[];
  values: number[];
}) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const r = 90;
  const n = values.length;

  function point(i: number, pct: number) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const rr = (r * Math.max(0, Math.min(100, pct))) / 100;
    return {
      x: cx + rr * Math.cos(angle),
      y: cy + rr * Math.sin(angle),
    };
  }

  const grid = [25, 50, 75, 100];
  const poly = values
    .map((v, i) => {
      const p = point(i, v);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={labels.join(", ")}
    >
      {grid.map((g) => (
        <polygon
          key={g}
          fill="none"
          stroke="var(--border)"
          strokeWidth="1"
          points={Array.from({ length: n }, (_, i) => {
            const p = point(i, g);
            return `${p.x},${p.y}`;
          }).join(" ")}
        />
      ))}
      {values.map((_, i) => {
        const p = point(i, 100);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="var(--border)"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={poly}
        fill="color-mix(in srgb, var(--primary) 28%, transparent)"
        stroke="var(--primary)"
        strokeWidth="2"
      />
      {values.map((v, i) => {
        const p = point(i, v);
        const tip = point(i, 112);
        return (
          <g key={`pt-${i}`}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="var(--primary)" />
            <text
              x={tip.x}
              y={tip.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[var(--muted-foreground)]"
              style={{ fontSize: 10 }}
            >
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
