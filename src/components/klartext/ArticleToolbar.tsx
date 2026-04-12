"use client";

import { SyntaxLegend } from "./SyntaxLegend";
import { FilterPanel } from "./FilterPanel";

interface ArticleToolbarProps {
  showSyntax: boolean;
  showGrammar: boolean;
  filterExpanded: boolean;
  selectedLevels: string[];
  selectedTopics: string[];
  availableTopics: { id: string; name: string; level: string }[];
  onToggleSyntax: () => void;
  onToggleGrammar: () => void;
  onToggleFilter: () => void;
  onToggleLevel: (level: string) => void;
  onToggleTopic: (topic: string) => void;
}

export function ArticleToolbar({
  showSyntax,
  showGrammar,
  filterExpanded,
  selectedLevels,
  selectedTopics,
  availableTopics,
  onToggleSyntax,
  onToggleGrammar,
  onToggleFilter,
  onToggleLevel,
  onToggleTopic,
}: ArticleToolbarProps) {
  return (
    <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm py-3 mb-6 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-2">
        <TogglePill active={showSyntax} onClick={onToggleSyntax} label="Satzglieder" />
        <TogglePill active={showGrammar} onClick={onToggleGrammar} label="Grammatik" />
        <div className="flex-1" />
        <button
          onClick={onToggleFilter}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
            filterExpanded || selectedLevels.length > 0 || selectedTopics.length > 0
              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filter
          {(selectedLevels.length > 0 || selectedTopics.length > 0) && (
            <span className="ml-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {selectedLevels.length + selectedTopics.length}
            </span>
          )}
        </button>
      </div>
      {showSyntax && <SyntaxLegend />}
      <FilterPanel
        expanded={filterExpanded}
        selectedLevels={selectedLevels}
        selectedTopics={selectedTopics}
        availableTopics={availableTopics}
        onToggleLevel={onToggleLevel}
        onToggleTopic={onToggleTopic}
      />
    </div>
  );
}

function TogglePill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      }`}
    >
      {label}
    </button>
  );
}
