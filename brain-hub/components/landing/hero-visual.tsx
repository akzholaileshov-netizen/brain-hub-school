"use client";

import {
  useMemo,
  useRef,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { useI18n } from "@/components/i18n-provider";
import { getTracks } from "@/lib/i18n/localize";

/** Hero art: recognisable 2D study scene + self-animating CSS 3D track cube. */
export function HeroVisual() {
  const { locale, t } = useI18n();
  const tracks = useMemo(() => getTracks(locale), [locale]);
  const sceneRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const faces = useMemo(() => {
    const names = tracks.map((tr) => tr.name);
    // Six cube faces — cycle tracks if fewer than 6.
    return Array.from({ length: 6 }, (_, i) => names[i % names.length] ?? "");
  }, [tracks]);

  function setTilt(rx: number, ry: number) {
    const el = sceneRef.current;
    if (!el) return;
    el.style.setProperty("--cube-rx", `${rx.toFixed(2)}deg`);
    el.style.setProperty("--cube-ry", `${ry.toFixed(2)}deg`);
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    sceneRef.current?.classList.add("is-dragging");
    last.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const el = sceneRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (dragging.current) {
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      const curX = Number.parseFloat(el.style.getPropertyValue("--cube-rx") || "-18");
      const curY = Number.parseFloat(el.style.getPropertyValue("--cube-ry") || "28");
      setTilt(
        Math.max(-35, Math.min(35, curX - dy * 0.35)),
        curY + dx * 0.4,
      );
      return;
    }

    // Desktop hover tilt (bonus)
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt(-18 - py * 12, 28 + px * 18);
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    dragging.current = false;
    sceneRef.current?.classList.remove("is-dragging");
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }

  function onPointerLeave() {
    if (dragging.current) return;
    setTilt(-18, 28);
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5 lg:mx-0 lg:justify-self-end">
      {/* —— 2D illustration —— */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-soft sm:p-5">
        <StudySceneSvg label={t("anim.heroVisualAlt")} />
        <p className="mt-3 text-sm leading-snug text-[var(--foreground-soft)]">
          {t("anim.heroVisualCaption")}
        </p>
      </div>

      {/* —— 3D track cube (auto-rotates; visible without interaction) —— */}
      <div
        ref={sceneRef}
        className="bh-cube-scene relative mx-auto touch-none select-none"
        style={
          {
            "--cube-rx": "-18deg",
            "--cube-ry": "28deg",
          } as CSSProperties
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerLeave}
        role="img"
        aria-label={t("anim.heroCubeAlt")}
      >
        <div className="bh-cube-stage" aria-hidden>
          <div className="bh-cube">
            {faces.map((name, i) => (
              <div key={i} className={`bh-cube-face bh-cube-face-${i}`}>
                <span className="bh-cube-face-label">{name}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="bh-cube-caption">{t("anim.heroCubeCaption")}</p>
      </div>
    </div>
  );
}

function StudySceneSvg({ label }: { label: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      className="h-auto w-full"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id="bhDeskSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.14" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="bhLaptopScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {/* soft room backdrop */}
      <rect
        x="8"
        y="8"
        width="384"
        height="244"
        rx="22"
        fill="url(#bhDeskSky)"
      />
      {/* floor / desk — kept below the IELTS badge (badge bottom ~ y 176) */}
      <rect
        x="8"
        y="188"
        width="384"
        height="64"
        rx="0"
        fill="var(--muted)"
        opacity="0.65"
      />
      <ellipse
        cx="200"
        cy="208"
        rx="155"
        ry="14"
        fill="var(--border)"
        opacity="0.55"
      />

      {/* stack of books */}
      <g transform="translate(38 142)">
        <rect y="0" width="58" height="14" rx="2" fill="var(--primary)" opacity="0.7" />
        <rect y="-14" width="58" height="14" rx="2" fill="var(--primary)" opacity="0.45" />
        <rect
          y="-28"
          width="58"
          height="14"
          rx="2"
          fill="var(--foreground)"
          opacity="0.28"
        />
        <line x1="8" y1="-21" x2="50" y2="-21" stroke="var(--card)" strokeWidth="1.5" />
        <line x1="8" y1="-7" x2="50" y2="-7" stroke="var(--card)" strokeWidth="1.5" />
      </g>

      {/* laptop — kept left so it never meets the IELTS badge */}
      <g transform="translate(110 100)">
        <rect
          x="14"
          y="8"
          width="128"
          height="84"
          rx="8"
          fill="url(#bhLaptopScreen)"
        />
        <circle cx="30" cy="22" r="3" fill="var(--primary-foreground)" opacity="0.55" />
        <circle cx="40" cy="22" r="3" fill="var(--primary-foreground)" opacity="0.4" />
        <circle cx="50" cy="22" r="3" fill="var(--primary-foreground)" opacity="0.28" />
        <polyline
          points="30,70 48,56 66,60 86,40 106,46 124,28"
          fill="none"
          stroke="var(--primary-foreground)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />
        <circle cx="124" cy="28" r="4" fill="var(--primary-foreground)" />
        <rect
          x="6"
          y="92"
          width="144"
          height="10"
          rx="3"
          fill="var(--foreground)"
          opacity="0.22"
        />
        <rect
          x="60"
          y="102"
          width="36"
          height="4"
          rx="2"
          fill="var(--foreground)"
          opacity="0.18"
        />
      </g>

      {/* student at desk */}
      <g transform="translate(155 54)">
        <circle cx="36" cy="26" r="20" fill="var(--foreground)" opacity="0.82" />
        <path
          d="M4 86c6-32 20-46 32-46s26 14 32 46"
          fill="var(--primary)"
          opacity="0.82"
        />
        <path
          d="M12 72c-10 10-16 22-18 34"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="11"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M60 72c14 8 28 18 40 26"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="11"
          strokeLinecap="round"
          opacity="0.75"
        />
      </g>

      {/* graduation cap */}
      <g transform="translate(268 28)">
        <polygon
          points="36,18 72,32 36,46 0,32"
          fill="var(--foreground)"
          opacity="0.82"
        />
        <rect x="28" y="32" width="16" height="14" fill="var(--primary)" opacity="0.7" />
        <line
          x1="72"
          y1="32"
          x2="72"
          y2="52"
          stroke="var(--primary)"
          strokeWidth="2"
        />
        <circle cx="72" cy="54" r="3" fill="var(--primary)" />
      </g>

      {/* plant — far left, clear of badge */}
      <g transform="translate(48 108)">
        <rect x="10" y="28" width="16" height="14" rx="3" fill="var(--border)" />
        <path
          d="M18 28c-8-14-2-22 0-26 2 4 8 12 0 26z"
          fill="var(--success)"
          opacity="0.75"
        />
        <path
          d="M18 28c8-12 4-20 0-24-2 6-6 14 0 24z"
          fill="var(--success)"
          opacity="0.55"
        />
      </g>

      {/* IELTS badge — clear right margin, opaque, drawn last */}
      <g transform="translate(298 118)">
        <rect
          width="90"
          height="40"
          rx="12"
          fill="var(--primary)"
          stroke="var(--card)"
          strokeWidth="2"
        />
        <text
          x="45"
          y="25"
          textAnchor="middle"
          fill="var(--primary-foreground)"
          style={{
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "var(--font-display)",
          }}
        >
          IELTS 7.5
        </text>
      </g>
    </svg>
  );
}
