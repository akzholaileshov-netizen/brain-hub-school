"use client";

import { useRef, type PointerEvent } from "react";
import { useI18n } from "@/components/i18n-provider";

/** 2D SVG study illustration + CSS 3D tilt card for the hero. */
export function HeroVisual() {
  const { t } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tilt-x", `${(-py * 10).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${(px * 12).toFixed(2)}deg`);
  }

  function onLeave() {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <div className="bh-tilt relative mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
      <div
        ref={cardRef}
        className="bh-tilt-inner relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-soft"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
          {t("anim.heroVisualLabel")}
        </p>
        {/* 2D illustration (inline SVG) */}
        <svg
          viewBox="0 0 360 220"
          className="mt-4 w-full text-[var(--primary)]"
          role="img"
          aria-label={t("anim.heroVisualAlt")}
        >
          <defs>
            <linearGradient id="bhHeroGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <rect
            x="8"
            y="18"
            width="344"
            height="184"
            rx="20"
            fill="url(#bhHeroGrad)"
          />
          <rect
            x="36"
            y="48"
            width="150"
            height="96"
            rx="12"
            fill="currentColor"
            opacity="0.14"
          />
          <circle cx="111" cy="88" r="28" fill="currentColor" opacity="0.35" />
          <path
            d="M70 130c12-18 32-28 52-28s40 10 52 28"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            opacity="0.45"
          />
          <rect
            x="208"
            y="56"
            width="116"
            height="14"
            rx="7"
            fill="currentColor"
            opacity="0.35"
          />
          <rect
            x="208"
            y="82"
            width="96"
            height="10"
            rx="5"
            fill="currentColor"
            opacity="0.22"
          />
          <rect
            x="208"
            y="104"
            width="108"
            height="10"
            rx="5"
            fill="currentColor"
            opacity="0.18"
          />
          <rect
            x="208"
            y="136"
            width="72"
            height="28"
            rx="10"
            fill="currentColor"
            opacity="0.55"
          />
          {/* small floating badge — 3D depth cue */}
          <g transform="translate(268 28)" opacity="0.9">
            <rect width="56" height="28" rx="10" fill="currentColor" />
            <text
              x="28"
              y="18"
              textAnchor="middle"
              fill="var(--primary-foreground)"
              style={{ fontSize: 11, fontWeight: 700 }}
            >
              7.5+
            </text>
          </g>
        </svg>
        <p className="mt-3 text-sm text-[var(--foreground-soft)]">
          {t("anim.heroVisualHint")}
        </p>
      </div>
    </div>
  );
}
