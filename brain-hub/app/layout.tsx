import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";

const display = Unbounded({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Brain Hub — IELTS 7.5+ және грантқа дайындық",
  description:
    "Brain Hub: интерактивті сабақтар, жеке ментор және бейіндік бағыттар арқылы IELTS пен грантқа дайындық.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="kk"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
