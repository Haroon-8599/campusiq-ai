import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import { AppShell } from "@/components/layout/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampusIQ AI — Discover Your Perfect College with AI Intelligence",
  description:
    "Next-generation college discovery platform. Predict admissions, compare authentic multi-year placements, evaluate branch-wise cutoffs, and ask verified seniors.",
  keywords: [
    "College Predictor",
    "JEE Main",
    "IIT Bombay",
    "College Admissions AI",
    "Engineering Placements",
    "College Compare",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#F8FBFF] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
