"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/landing/auth-modal";
import {
  ContentPanel,
  type ContentPanelId,
} from "@/components/landing/content-panel";
import { ContactFooter } from "@/components/landing/contact-footer";
import { Header, type NavTarget } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import type { TrackId } from "@/lib/quiz-data";

type AuthMode = "login" | "register";

export function LandingPage() {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [recommendedTrack, setRecommendedTrack] = useState<TrackId | null>(
    null,
  );
  const [authenticated, setAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [panel, setPanel] = useState<ContentPanelId | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data: { authenticated?: boolean }) => {
        if (active) setAuthenticated(Boolean(data.authenticated));
      })
      .catch(() => {
        if (active) setAuthenticated(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!panel) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [panel]);

  const handleRecommend = useCallback((trackId: TrackId | null) => {
    setRecommendedTrack(trackId);
  }, []);

  function openAuth(mode: AuthMode) {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  function handleNavigate(target: NavTarget) {
    if (target.kind === "contact") {
      setPanel(null);
      requestAnimationFrame(() => {
        document.getElementById("contact")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
      return;
    }
    setPanel(target.id);
  }

  return (
    <div className="relative flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header
        authenticated={authenticated}
        onLogin={() => openAuth("login")}
        onRegister={() => openAuth("register")}
        onNavigate={handleNavigate}
        menuOpen={menuOpen}
        onMenuOpenChange={setMenuOpen}
      />
      <main className="flex-1">
        <Hero
          onOpenQuiz={() => setPanel("quiz")}
          onRegister={() =>
            authenticated ? router.push("/dashboard") : openAuth("register")
          }
        />
      </main>
      <ContactFooter onNavigate={handleNavigate} />
      <ContentPanel
        panel={panel}
        onClose={() => setPanel(null)}
        onRecommend={handleRecommend}
        onRegister={() =>
          authenticated ? router.push("/dashboard") : openAuth("register")
        }
        onRegisterWithTrack={(trackId) => {
          setRecommendedTrack(trackId);
          if (authenticated) {
            router.push("/dashboard");
            return;
          }
          openAuth("register");
        }}
      />
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
