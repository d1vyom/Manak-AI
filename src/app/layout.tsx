import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

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
    <html lang="en" className="h-full scroll-smooth overflow-x-hidden" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var localTheme = localStorage.getItem('manak-theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (localTheme === 'dark' || (!localTheme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} flex min-h-full flex-col bg-slate-50/50 text-slate-900 antialiased overflow-x-hidden w-full max-w-full dark:bg-navy-950 dark:text-slate-100 transition-colors duration-200`}
      >
        <Header />
        <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

