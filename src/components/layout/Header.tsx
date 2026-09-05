// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, BookOpen, CheckSquare, MessageSquare, Globe } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { t } from "@/lib/utils/i18n";

export function Header() {
  const pathname = usePathname();
  const { language, setLanguage } = useAppStore();

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "hi" : "en";
    setLanguage(nextLang);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("language-change", { detail: nextLang }));
    }
  };

  const navItems = [
    { href: "/chat", label: t("navChat", language), icon: MessageSquare },
    { href: "/explore", label: t("navStandards", language), icon: BookOpen },
    { href: "/compliance", label: t("navAudit", language), icon: CheckSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy-700/20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-navy-950/90 dark:border-navy-800">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-800 text-white shadow-md transition-transform group-hover:scale-105 dark:bg-navy-700">
            <Shield className="h-6 w-6 text-saffron-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-navy-900 dark:text-white">
                {language === "hi" ? "मानक" : "MANAK"}
                <span className="text-saffron-500 font-extrabold ml-0.5">
                  {language === "hi" ? " AI" : "AI"}
                </span>
              </span>
              <span className="inline-flex items-center rounded-full bg-saffron-100 px-2 py-0.5 text-[10px] font-bold text-saffron-800 dark:bg-saffron-900/40 dark:text-saffron-300">
                SIH 2026
              </span>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
              {t("brandSubtitle", language)}
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-navy-800 text-white dark:bg-navy-700 dark:text-white shadow-sm"
                    : "text-navy-900 hover:bg-navy-50 hover:text-navy-900 dark:text-navy-100 dark:hover:bg-navy-900/60"
                }`}
              >
                <Icon className="h-4 w-4 text-saffron-500" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="h-5 w-[1px] bg-border mx-1" />

          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-2.5 py-1.5 text-xs font-bold text-navy-800 shadow-sm hover:bg-slate-50 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-200 dark:hover:bg-navy-800 transition-all hover:scale-105"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="h-3.5 w-3.5 text-saffron-500" />
            <span>{language === "en" ? "हिन्दी" : "English"}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
