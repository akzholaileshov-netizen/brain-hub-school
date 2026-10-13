import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brain Hub — IELTS 7.5+ және грантқа дайындық",
  description:
    "Brain Hub: интерактивті сабақтар, жеке ментор және бейіндік бағыттар арқылы IELTS пен грантқа дайындық.",
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
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Unbounded:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
