import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Manak AI — AI-Powered BIS Standards & Compliance Intelligence",
  description:
    "Intelligent assistant for Bureau of Indian Standards (BIS) compliance, clause-level citations, mandatory/voluntary QCO determination, and certification pathways for Indian manufacturers and consumers.",
  keywords: [
    "BIS",
    "Bureau of Indian Standards",
    "ISI Mark",
    "QCO",
    "Indian Standards",
    "Compliance",
    "SIH 2026",
    "Manak AI",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.className} flex min-h-full flex-col bg-slate-50/50 text-slate-900 antialiased`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
