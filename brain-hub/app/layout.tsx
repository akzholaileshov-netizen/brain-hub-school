import type { Metadata } from "next";
import { SupabaseSetupBanner } from "@/components/supabase-setup-banner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brain Hub — IELTS 7.5+ және грантқа дайындық",
  description:
    "Brain Hub: интерактивті сабақтар, жеке ментор және бейіндік бағыттар арқылы IELTS пен грантқа дайындық.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://brainhub.kz",
  ),
  openGraph: {
    title: "Brain Hub — IELTS 7.5+ және грантқа дайындық",
    description:
      "Қазақ тіліндегі онлайн дайындық: бейіндік пәндер, прогресс және VIP IELTS.",
    locale: "kk_KZ",
    type: "website",
    siteName: "Brain Hub",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="kk" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Cyrillic-capable display/body fonts (Turbopack next/font issue avoided) */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Unbounded:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <SupabaseSetupBanner />
        {children}
      </body>
    </html>
  );
}
