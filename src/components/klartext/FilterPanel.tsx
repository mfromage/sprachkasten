"use client";

import type { GrammarTheme } from "@/lib/types";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700",
  A2: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-300 dark:border-teal-700",
  B1: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-700",
  B2: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700",
  C1: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-300 dark:border-orange-700",
  C2: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-700",
};

interface FilterPanelProps {
  expanded: boolean;
  selectedLevels: string[];
  selectedTopics: string[];
  availableTopics: { id: string; name: string; level: string }[];
  onToggleLevel: (level: string) => void;
  onToggleTopic: (topic: string) => void;
}

export function FilterPanel({
  expanded,
  selectedLevels,
  selectedTopics,
  availableTopics,
  onToggleLevel,
  onToggleTopic,
}: FilterPanelProps) {
  if (!expanded) return null;

  // Dedupe topics by id
  const uniqueTopics = availableTopics.reduce(
    (acc, t) => {
      if (!acc.find((x) => x.id === t.id)) acc.push(t);
      return acc;
    },
    [] as { id: string; name: string; level: string }[]
  );

  return (
    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 fade-in duration-200">
      <div className="mb-3">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Niveau
        </span>
        <div className="flex flex-wrap gap-2 mt-1.5">
          {LEVELS.map((level) => {
            const isSelected = selectedLevels.includes(level);
            const colorClass = LEVEL_COLORS[level] ?? "";
            return (
              <button
                key={level}
                onClick={() => onToggleLevel(level)}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-150 ${
                  isSelected
                    ? colorClass
                    : "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>

      {uniqueTopics.length > 0 && (
        <div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Themen
          </span>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {uniqueTopics.map((topic) => {
              const isSelected = selectedTopics.includes(topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => onToggleTopic(topic.id)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all duration-150 ${
                    isSelected
                      ? "bg-gray-200 text-gray-800 border-gray-400 dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
                      : "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {topic.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to extract unique topics from article grammar themes
export function extractTopicsFromArticle(
  paragraphs: { sentences: { grammar_themes: GrammarTheme[] }[] }[]
): { id: string; name: string; level: string }[] {
  const topicMap = new Map<string, { id: string; name: string; level: string }>();

  for (const para of paragraphs) {
    for (const sent of para.sentences) {
      for (const theme of sent.grammar_themes) {
        if (!topicMap.has(theme.theme_id)) {
          topicMap.set(theme.theme_id, {
            id: theme.theme_id,
            name: theme.theme,
            level: theme.level,
          });
        }
      }
    }
  }

  return Array.from(topicMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

// Helper to check if a grammar theme passes the filter
export function themePassesFilter(
  theme: GrammarTheme,
  selectedLevels: string[],
  selectedTopics: string[]
): boolean {
  // No filters = show all
  if (selectedLevels.length === 0 && selectedTopics.length === 0) {
    return true;
  }
  // Match level OR topic
  return selectedLevels.includes(theme.level) || selectedTopics.includes(theme.theme_id);
}
