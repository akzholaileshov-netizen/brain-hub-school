"use client";

import { X } from "lucide-react";
import { FormatSection } from "@/components/landing/format-section";
import { QuizSection } from "@/components/landing/quiz-section";
import { StatsSection } from "@/components/landing/stats-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { TracksSection } from "@/components/landing/tracks-section";
import type { TrackId } from "@/lib/quiz-data";

export type ContentPanelId =
  | "format"
  | "quiz"
  | "tracks"
  | "results"
  | "reviews";

const TITLES: Record<ContentPanelId, string> = {
  format: "Оқыту форматы",
  quiz: "Қабілет пен қызығушылық тесті",
  tracks: "Дайындық бағыттары",
  results: "Жетістіктер",
  reviews: "Түлектер пікірі",
};

type ContentPanelProps = {
  panel: ContentPanelId | null;
  onClose: () => void;
  onRecommend?: (trackId: TrackId | null) => void;
  onRegisterWithTrack?: (trackId: TrackId) => void;
};

export function ContentPanel({
  panel,
  onClose,
  onRecommend,
  onRegisterWithTrack,
}: ContentPanelProps) {
  if (!panel) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[var(--background)]"
      role="dialog"
      aria-modal="true"
      aria-label={TITLES[panel]}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-4 py-3.5 sm:px-6">
        <p className="font-display text-base font-semibold text-[var(--foreground)] sm:text-lg">
          {TITLES[panel]}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[var(--foreground)] hover:bg-[var(--muted)]"
          aria-label="Жабу"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="[&_section]:scroll-mt-0 [&_section]:border-0 [&_section]:bg-transparent [&_section]:py-10 sm:[&_section]:py-14">
          {panel === "format" && <FormatSection />}
          {panel === "quiz" && (
            <QuizSection
              onRecommend={onRecommend}
              onRegisterWithTrack={onRegisterWithTrack}
            />
          )}
          {panel === "tracks" && <TracksSection />}
          {panel === "results" && <StatsSection />}
          {panel === "reviews" && <TestimonialsSection />}
        </div>
      </div>
    </div>
  );
}
