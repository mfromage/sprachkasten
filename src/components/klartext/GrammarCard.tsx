"use client";

import { useCallback } from "react";
import type { GrammarTheme } from "@/lib/types";

interface GrammarCardProps {
  theme: GrammarTheme;
  onHighlight?: (tokenIds: number[], level: string) => void;
  onClearHighlight?: () => void;
}

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  A2: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  B1: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  B2: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  C1: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  C2: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function GrammarCard({ theme, onHighlight, onClearHighlight }: GrammarCardProps) {
  const levelClass =
    LEVEL_COLORS[theme.level] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

  const handleMouseEnter = useCallback(() => {
    // Desktop: highlight on hover
    if (window.matchMedia("(hover: hover)").matches && onHighlight) {
      onHighlight(theme.token_ids, theme.level);
    }
  }, [onHighlight, theme.token_ids, theme.level]);

  const handleMouseLeave = useCallback(() => {
    if (window.matchMedia("(hover: hover)").matches && onClearHighlight) {
      onClearHighlight();
    }
  }, [onClearHighlight]);

  const handleClick = useCallback(() => {
    // Mobile: toggle on tap
    if (!window.matchMedia("(hover: hover)").matches && onHighlight) {
      onHighlight(theme.token_ids, theme.level);
    }
  }, [onHighlight, theme.token_ids, theme.level]);

  return (
    <div
      className="rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 p-3 text-sm transition-all duration-300 animate-in slide-in-from-top-2 fade-in cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="font-medium text-gray-900 dark:text-gray-100">{theme.theme}</span>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${levelClass}`}
        >
          {theme.level}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 italic">{theme.evidence}</p>
    </div>
  );
}
