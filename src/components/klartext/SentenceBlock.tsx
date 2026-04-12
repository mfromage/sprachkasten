"use client";

import { useState, useCallback } from "react";
import type { Sentence, GrammarTheme } from "@/lib/types";
import { TokenWord } from "./TokenWord";
import { GrammarCard } from "./GrammarCard";
import { getLevelHighlightColor } from "@/lib/highlight-colors";
import { themePassesFilter } from "./FilterPanel";

interface SentenceBlockProps {
  sentence: Sentence;
  showSyntax: boolean;
  showGrammar: boolean;
  showClauses: boolean;
  selectedLevels: string[];
  selectedTopics: string[];
}

interface HighlightState {
  tokenIds: Set<number>;
  color: string;
}

export function SentenceBlock({
  sentence,
  showSyntax,
  showGrammar,
  showClauses,
  selectedLevels,
  selectedTopics,
}: SentenceBlockProps) {
  const [highlight, setHighlight] = useState<HighlightState | null>(null);
  const [pinnedHighlight, setPinnedHighlight] = useState<HighlightState | null>(null);

  const handleHighlight = useCallback((tokenIds: number[], level: string) => {
    const newHighlight = { tokenIds: new Set(tokenIds), color: getLevelHighlightColor(level) };
    // On mobile (no hover), toggle pinned highlight
    if (!window.matchMedia("(hover: hover)").matches) {
      setPinnedHighlight((prev) => {
        if (prev && [...prev.tokenIds].every((id) => tokenIds.includes(id))) {
          return null; // Same card tapped, clear
        }
        return newHighlight;
      });
    } else {
      setHighlight(newHighlight);
    }
  }, []);

  const handleClearHighlight = useCallback(() => {
    setHighlight(null);
  }, []);

  // Use pinned highlight on mobile, hover highlight on desktop
  const activeHighlight = pinnedHighlight ?? highlight;

  // Filter grammar themes
  const visibleThemes = sentence.grammar_themes.filter((theme) =>
    themePassesFilter(theme, selectedLevels, selectedTopics)
  );

  // Find noun phrase for each token
  const getNounPhraseForToken = (tokenId: number) => {
    return sentence.noun_phrases?.find((np) => np.token_ids.includes(tokenId));
  };

  // Render tokens with clause brackets if showClauses is on
  const renderTokens = () => {
    if (showClauses && sentence.clauses && sentence.clauses.length > 0) {
      return sentence.clauses.map((clause, ci) => {
        const clauseTokens = sentence.tokens.filter((t) => clause.token_ids.includes(t.id));
        const label = clause.type === "main"
          ? "Hauptsatz"
          : `Nebensatz${clause.connector ? ` (${clause.connector})` : ""}`;
        const borderColor = clause.type === "main"
          ? "border-gray-400 dark:border-gray-500"
          : "border-blue-400 dark:border-blue-500";

        return (
          <span key={ci} className="relative inline">
            <span className={`text-[10px] text-gray-500 dark:text-gray-400 absolute -top-4 left-0`}>
              {label}
            </span>
            <span className={`border-l-2 border-r-2 ${borderColor} rounded-sm px-1 mx-0.5`}>
              {clauseTokens.map((token, i) => (
                <span key={token.id}>
                  {i > 0 && token.pos !== "PUNCT" && " "}
                  <TokenWord
                    token={token}
                    showSyntax={showSyntax}
                    highlightColor={activeHighlight?.tokenIds.has(token.id) ? activeHighlight.color : undefined}
                    nounPhrase={getNounPhraseForToken(token.id)}
                  />
                </span>
              ))}
            </span>
            {ci < sentence.clauses.length - 1 && " "}
          </span>
        );
      });
    }

    return sentence.tokens.map((token, i) => (
      <span key={token.id}>
        {i > 0 && token.pos !== "PUNCT" && " "}
        <TokenWord
          token={token}
          showSyntax={showSyntax}
          highlightColor={activeHighlight?.tokenIds.has(token.id) ? activeHighlight.color : undefined}
          nounPhrase={getNounPhraseForToken(token.id)}
        />
      </span>
    ));
  };

  return (
    <div
      className={showGrammar ? "pb-5 mb-5 border-b border-gray-200 dark:border-gray-800" : "mb-1"}
    >
      <div className={`text-xl leading-[2] ${showSyntax ? "[word-spacing:4px]" : ""} ${showClauses ? "pt-5" : ""}`}>
        {renderTokens()}
      </div>
      {showGrammar && visibleThemes.length > 0 && (
        <div className="mt-3 space-y-2">
          {visibleThemes.map((theme, i) => (
            <GrammarCard
              key={`${theme.theme_id}-${i}`}
              theme={theme}
              onHighlight={handleHighlight}
              onClearHighlight={handleClearHighlight}
            />
          ))}
        </div>
      )}
    </div>
  );
}
