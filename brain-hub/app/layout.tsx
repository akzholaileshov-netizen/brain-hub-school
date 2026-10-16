import type { Metadata } from "next";
import { SupabaseSetupBanner } from "@/components/supabase-setup-banner";
import { ThemeProvider } from "@/components/theme-provider";
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="kk" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('bh-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.style.colorScheme=t}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Plus Jakarta Sans + Outfit (Latin). Noto Sans: full Kazakh Cyrillic glyph fallback
            (ә ғ қ ң ө ұ ү һ і). next/font skipped — prior Turbopack instability. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider>
          <SupabaseSetupBanner />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
