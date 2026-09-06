// src/components/layout/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { t } from "@/lib/utils/i18n";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme, language } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : false;
  const label = isDark ? t("themeToggleLight", language) : t("themeToggleDark", language);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={label}
      aria-label={label}
      className={`group relative flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white p-2 text-xs font-bold text-navy-800 shadow-2xs transition-all duration-200 hover:scale-105 hover:bg-slate-50 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-200 dark:hover:bg-navy-800 ${className}`}
    >
      <div className="relative flex h-4 w-4 items-center justify-center">
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="h-4 w-4 text-navy-700 transition-transform duration-300 group-hover:-rotate-12 dark:text-navy-300" />
        )}
      </div>

      {showLabel && (
        <span className="font-semibold text-xs text-navy-900 dark:text-white">
          {isDark ? (language === "hi" ? "लाइट मोड" : "Light Mode") : (language === "hi" ? "डार्क मोड" : "Dark Mode")}
        </span>
      )}
    </button>
  );
}
