"use client";

import { useCallback, useSyncExternalStore } from "react";

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

// In-memory cache for current preferences
let cachedPrefs: ArticlePreferences = DEFAULT_PREFERENCES;
let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function loadFromStorage(): ArticlePreferences {
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

function saveToStorage(prefs: ArticlePreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage errors
  }
}

function subscribe(callback: () => void) {
  listeners.push(callback);
  // Initialize from storage on first subscription (client-side only)
  if (listeners.length === 1) {
    cachedPrefs = loadFromStorage();
  }
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getSnapshot(): ArticlePreferences {
  return cachedPrefs;
}

function getServerSnapshot(): ArticlePreferences {
  return DEFAULT_PREFERENCES;
}

function updatePrefs(updater: (prev: ArticlePreferences) => ArticlePreferences): void {
  cachedPrefs = updater(cachedPrefs);
  saveToStorage(cachedPrefs);
  emitChange();
}

export function useArticlePreferences() {
  const prefs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setShowSyntax = useCallback((value: boolean) => {
    updatePrefs((p) => ({ ...p, showSyntax: value }));
  }, []);

  const setShowGrammar = useCallback((value: boolean) => {
    updatePrefs((p) => ({ ...p, showGrammar: value }));
  }, []);

  const setShowClauses = useCallback((value: boolean) => {
    updatePrefs((p) => ({ ...p, showClauses: value }));
  }, []);

  const setSelectedLevels = useCallback((value: string[]) => {
    updatePrefs((p) => ({ ...p, selectedLevels: value }));
  }, []);

  const setSelectedTopics = useCallback((value: string[]) => {
    updatePrefs((p) => ({ ...p, selectedTopics: value }));
  }, []);

  const setFilterExpanded = useCallback((value: boolean) => {
    updatePrefs((p) => ({ ...p, filterExpanded: value }));
  }, []);

  const toggleLevel = useCallback((level: string, topicIdsAtLevel: string[] = []) => {
    updatePrefs((p) => {
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
    updatePrefs((p) => ({
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
