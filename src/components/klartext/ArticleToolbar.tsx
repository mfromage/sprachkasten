"use client";

import { SyntaxLegend } from "./SyntaxLegend";

interface ArticleToolbarProps {
  showSyntax: boolean;
  showGrammar: boolean;
  onToggleSyntax: () => void;
  onToggleGrammar: () => void;
}

export function ArticleToolbar({
  showSyntax,
  showGrammar,
  onToggleSyntax,
  onToggleGrammar,
}: ArticleToolbarProps) {
  return (
    <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm py-3 mb-6 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-2">
        <TogglePill active={showSyntax} onClick={onToggleSyntax} label="Satzglieder" />
        <TogglePill active={showGrammar} onClick={onToggleGrammar} label="Grammatik" />
      </div>
      {showSyntax && <SyntaxLegend />}
    </div>
  );
}

function TogglePill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
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
