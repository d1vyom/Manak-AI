// src/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import { ShieldCheck, ExternalLink, Shield } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { t } from "@/lib/utils/i18n";

export function Footer() {
  const { language } = useAppStore();

  return (
    <footer className="border-t border-navy-700/10 bg-white dark:bg-navy-950 dark:border-navy-900 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-muted-foreground">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy-800 text-saffron-400 dark:bg-navy-700">
              <Shield className="h-4 w-4" />
            </div>
            <span>
              <strong>Manak AI</strong> — Built for <strong>Smart India Hackathon 2026</strong> (Problem Statement SIH26107).
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
            <Link
              href="https://www.bis.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-navy-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>BIS Official Portal</span>
              <ExternalLink className="h-3 w-3 text-saffron-500" />
            </Link>
            <span>•</span>
            <Link
              href="https://services.bis.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-navy-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>e-BIS Services (Manakonline)</span>
              <ExternalLink className="h-3 w-3 text-saffron-500" />
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t border-border/50 pt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
          <p>{t("officialDisclaimer", language)}</p>
        </div>
      </div>
    </footer>
  );
}
