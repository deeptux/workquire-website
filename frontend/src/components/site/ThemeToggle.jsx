import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

/**
 * Sliding light/dark theme toggle.
 * Visual: small pill switch with sun + moon icons, knob slides between them.
 */
export const ThemeToggle = ({ className = "" }) => {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={`relative inline-flex items-center w-[58px] h-[30px] rounded-full transition-colors duration-300
        border border-[rgba(0,40,90,0.18)] dark:border-white/15
        bg-[#dceaff] dark:bg-white/10
        hover:brightness-105 ${className}`}
      data-testid="theme-toggle"
      data-theme-state={theme}
    >
      {/* Track icons */}
      <Sun
        size={12}
        className="absolute left-[8px] top-1/2 -translate-y-1/2 text-amber-500 dark:text-white/40 transition-colors"
        aria-hidden="true"
      />
      <Moon
        size={12}
        className="absolute right-[8px] top-1/2 -translate-y-1/2 text-[#1e40af]/50 dark:text-amber-300 transition-colors"
        aria-hidden="true"
      />

      {/* Knob */}
      <span
        className={`absolute top-1/2 -translate-y-1/2 w-[24px] h-[24px] rounded-full shadow-md transition-transform duration-300 ease-out
          bg-white dark:bg-amber-400
          ${isDark ? "translate-x-[30px]" : "translate-x-[3px]"}`}
        style={{
          boxShadow: isDark
            ? "0 0 0 1px rgba(245,158,11,0.4), 0 4px 14px rgba(245,158,11,0.45)"
            : "0 0 0 1px rgba(0,40,90,0.12), 0 2px 8px rgba(11,37,69,0.18)",
        }}
      >
        <span className="absolute inset-0 inline-flex items-center justify-center">
          {isDark ? (
            <Moon size={12} className="text-navy-900" />
          ) : (
            <Sun size={12} className="text-amber-500" />
          )}
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
