"use client";

import { useCallback, useState } from "react";
import { AuthModal } from "@/components/landing/auth-modal";
import { ContactFooter } from "@/components/landing/contact-footer";
import { FormatSection } from "@/components/landing/format-section";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { QuizSection } from "@/components/landing/quiz-section";
import { StatsSection } from "@/components/landing/stats-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { TracksSection } from "@/components/landing/tracks-section";
import type { TrackId } from "@/lib/quiz-data";

type AuthMode = "login" | "register";

export function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [recommendedTrack, setRecommendedTrack] = useState<TrackId | null>(
    null,
  );

  const handleRecommend = useCallback((trackId: TrackId | null) => {
    setRecommendedTrack(trackId);
  }, []);

  function openAuth(mode: AuthMode) {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  return (
    <div className="flex min-h-full flex-col bg-[var(--canvas)] text-[var(--ink)]">
      <Header
        onLogin={() => openAuth("login")}
        onRegister={() => openAuth("register")}
      />
      <main className="flex-1">
        <Hero onRegister={() => openAuth("register")} />
        <FormatSection />
        <QuizSection
          onRecommend={handleRecommend}
          onRegisterWithTrack={(trackId) => {
            setRecommendedTrack(trackId);
            openAuth("register");
          }}
        />
        <TracksSection />
        <StatsSection />
        <TestimonialsSection />
      </main>
      <ContactFooter />
      <AuthModal
        open={authOpen}
        mode={authMode}
        onOpenChange={setAuthOpen}
        onModeChange={setAuthMode}
        recommendedTrack={recommendedTrack}
      />
    </div>
  );
}
