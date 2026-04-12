"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "sprachkasten:preferences";

export interface ArticlePreferences {
  showSyntax: boolean;
  showGrammar: boolean;
  showClauses: boolean;
  selectedLevels: string[];
  selectedTopics: string[];
  filterExpanded: boolean;
}

const DEFAULT_PREFERENCES: ArticlePreferences = {
  showSyntax: false,
  showGrammar: false,
  showClauses: false,
  selectedLevels: [],
  selectedTopics: [],
  filterExpanded: false,
};

function loadPreferences(): ArticlePreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_PREFERENCES;
}

function savePreferences(prefs: ArticlePreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage errors
  }
}

export function useArticlePreferences() {
  // Use lazy initialization to load from localStorage
  const [prefs, setPrefs] = useState<ArticlePreferences>(() => loadPreferences());
  const mountedRef = useRef(false);

  // Save to localStorage on change (skip initial render)
  useEffect(() => {
    if (mountedRef.current) {
      savePreferences(prefs);
    } else {
      mountedRef.current = true;
    }
  }, [prefs]);

  const setShowSyntax = useCallback((value: boolean) => {
    setPrefs((p) => ({ ...p, showSyntax: value }));
  }, []);

  const setShowGrammar = useCallback((value: boolean) => {
    setPrefs((p) => ({ ...p, showGrammar: value }));
  }, []);

  const setShowClauses = useCallback((value: boolean) => {
    setPrefs((p) => ({ ...p, showClauses: value }));
  }, []);

  const setSelectedLevels = useCallback((value: string[]) => {
    setPrefs((p) => ({ ...p, selectedLevels: value }));
  }, []);

  const setSelectedTopics = useCallback((value: string[]) => {
    setPrefs((p) => ({ ...p, selectedTopics: value }));
  }, []);

  const setFilterExpanded = useCallback((value: boolean) => {
    setPrefs((p) => ({ ...p, filterExpanded: value }));
  }, []);

  const toggleLevel = useCallback((level: string, topicIdsAtLevel: string[] = []) => {
    setPrefs((p) => {
      const isSelected = p.selectedLevels.includes(level);
      if (isSelected) {
        // Deselecting level: remove level and all its topics
        return {
          ...p,
          selectedLevels: p.selectedLevels.filter((l) => l !== level),
          selectedTopics: p.selectedTopics.filter((t) => !topicIdsAtLevel.includes(t)),
        };
      } else {
        // Selecting level: add level and all its topics
        const newTopics = [...p.selectedTopics];
        for (const topicId of topicIdsAtLevel) {
          if (!newTopics.includes(topicId)) {
            newTopics.push(topicId);
          }
        }
        return {
          ...p,
          selectedLevels: [...p.selectedLevels, level],
          selectedTopics: newTopics,
        };
      }
    });
  }, []);

  const toggleTopic = useCallback((topic: string) => {
    setPrefs((p) => ({
      ...p,
      selectedTopics: p.selectedTopics.includes(topic)
        ? p.selectedTopics.filter((t) => t !== topic)
        : [...p.selectedTopics, topic],
    }));
  }, []);

  return {
    ...prefs,
    setShowSyntax,
    setShowGrammar,
    setShowClauses,
    setSelectedLevels,
    setSelectedTopics,
    setFilterExpanded,
    toggleLevel,
    toggleTopic,
  };
}
