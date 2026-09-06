"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, ExternalLink, Shield } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { t } from "@/lib/utils/i18n";

export function Footer() {
  const pathname = usePathname();
  const { language } = useAppStore();

  // Hide footer on full-height chat workspace to prevent double scrollbars
  if (pathname === "/chat") {
    return null;
  }

  return (
    <footer className="border-t border-navy-700/10 bg-white dark:bg-navy-950 dark:border-navy-900 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-muted-foreground">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy-800 text-saffron-400 dark:bg-navy-700">
              <Shield className="h-4 w-4" />
            </div>
            <span>
              <strong>Manak AI</strong> — {t("footerHackathon", language)}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
            <Link
              href="https://www.bis.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-navy-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>{t("footerPortal", language)}</span>
              <ExternalLink className="h-3 w-3 text-saffron-500" />
            </Link>
            <span>•</span>
            <Link
              href="https://www.bis.gov.in/standards/?lang=en"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-navy-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>{t("footerEBis", language)}</span>
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

