// src/components/layout/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, BookOpen, CheckSquare, MessageSquare, Globe, Menu, X, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { t } from "@/lib/utils/i18n";

export function Header() {
  const pathname = usePathname();
  const { language, setLanguage } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "hi" : "en";
    setLanguage(nextLang);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("language-change", { detail: nextLang }));
    }
  };

  const navItems = [
    {
      href: "/chat",
      label: t("navChat", language),
      desc: language === "hi" ? "एआई अनुपालन सहायक" : "AI Compliance Assistant",
      icon: MessageSquare,
    },
    {
      href: "/explore",
      label: t("navStandards", language),
      desc: language === "hi" ? "भारतीय मानक खोजें" : "Browse Indian Standards",
      icon: BookOpen,
    },
    {
      href: "/compliance",
      label: t("navAudit", language),
      desc: language === "hi" ? "ISI मार्क गैप एनालिसिस" : "ISI Mark Gap Analysis",
      icon: CheckSquare,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full max-w-full border-b border-navy-700/20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-navy-950/90 dark:border-navy-800">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-3.5 sm:px-6">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-navy-800 text-white shadow-md transition-transform group-hover:scale-105 dark:bg-navy-700">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-saffron-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-navy-900 dark:text-white">
                {language === "hi" ? "मानक" : "MANAK"}
                <span className="text-saffron-500 font-extrabold ml-0.5">
                  {language === "hi" ? " AI" : "AI"}
                </span>
              </span>
              <span className="inline-flex items-center rounded-full bg-saffron-100 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-saffron-800 dark:bg-saffron-900/40 dark:text-saffron-300">
                SIH 2026
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground hidden xs:inline">
              {t("brandSubtitle", language)}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
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

        {/* Mobile Actions: Language Toggle + Hamburger Button (Visible only on mobile) */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 rounded-lg border border-navy-200 bg-white px-2 py-1.5 text-xs font-bold text-navy-800 shadow-xs hover:bg-slate-50 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-200"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="h-3.5 w-3.5 text-saffron-500" />
            <span>{language === "en" ? "हिन्दी" : "EN"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 bg-white text-navy-900 shadow-xs hover:bg-navy-50 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-saffron-500" />
            ) : (
              <Menu className="h-5 w-5 text-navy-900 dark:text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-xs md:hidden animate-in fade-in duration-150"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Menu Panel */}
          <div className="relative z-50 border-b border-navy-200 bg-white p-4 shadow-xl dark:border-navy-800 dark:bg-navy-950 md:hidden animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl p-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-navy-800 text-white shadow-sm dark:bg-navy-700"
                        : "bg-slate-50/80 text-navy-900 hover:bg-navy-50 hover:text-navy-900 dark:bg-navy-900/60 dark:text-navy-100 dark:hover:bg-navy-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          isActive
                            ? "bg-white/15 text-saffron-400"
                            : "bg-white text-saffron-500 shadow-xs dark:bg-navy-800"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold">{item.label}</span>
                        <span
                          className={`text-[11px] ${
                            isActive ? "text-navy-200" : "text-muted-foreground"
                          }`}
                        >
                          {item.desc}
                        </span>
                      </div>
                    </div>
                    <ArrowRight
                      className={`h-4 w-4 ${
                        isActive ? "text-saffron-400" : "text-muted-foreground/60"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

