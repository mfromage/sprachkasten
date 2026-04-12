"use client";

import { useState, useCallback } from "react";
import type { Sentence, GrammarTheme } from "@/lib/types";
import { TokenWord } from "./TokenWord";
import { GrammarCard } from "./GrammarCard";
import { getLevelHighlightColor } from "@/lib/highlight-colors";
import { getCaseColor } from "@/lib/case-colors";
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

  // Group tokens by noun_phrase for continuous underlines
  const groupTokensByPhrase = (tokens: typeof sentence.tokens) => {
    const groups: { tokens: typeof sentence.tokens; nounPhrase?: typeof sentence.noun_phrases[0] }[] = [];
    let currentGroup: typeof sentence.tokens = [];
    let currentNP: typeof sentence.noun_phrases[0] | undefined;

    tokens.forEach((token) => {
      const np = getNounPhraseForToken(token.id);
      if (np && np === currentNP) {
        currentGroup.push(token);
      } else {
        if (currentGroup.length > 0) {
          groups.push({ tokens: currentGroup, nounPhrase: currentNP });
        }
        currentGroup = [token];
        currentNP = np;
      }
    });
    if (currentGroup.length > 0) {
      groups.push({ tokens: currentGroup, nounPhrase: currentNP });
    }
    return groups;
  };

  // Render tokens grouped by phrase
  const renderTokens = () => {
    const groups = groupTokensByPhrase(sentence.tokens);

    return groups.map((group, gi) => {
      const firstToken = group.tokens[0];
      const needsSpace = gi > 0 && firstToken.pos !== "PUNCT";

      if (group.tokens.length === 1) {
        // Single token - render normally
        const token = group.tokens[0];
        return (
          <span key={token.id}>
            {needsSpace && " "}
            <TokenWord
              token={token}
              showSyntax={showSyntax}
              highlightColor={activeHighlight?.tokenIds.has(token.id) ? activeHighlight.color : undefined}
              nounPhrase={group.nounPhrase}
            />
          </span>
        );
      }

      // Multi-token phrase - wrap with continuous underline
      return (
        <span key={`phrase-${gi}`} className="relative inline">
          {needsSpace && " "}
          <span className="relative inline-block">
            {group.tokens.map((token, i) => (
              <span key={token.id}>
                {i > 0 && token.pos !== "PUNCT" && " "}
                <TokenWord
                  token={token}
                  showSyntax={false}
                  highlightColor={activeHighlight?.tokenIds.has(token.id) ? activeHighlight.color : undefined}
                  nounPhrase={group.nounPhrase}
                  phraseTokens={group.tokens}
                />
              </span>
            ))}
            {showSyntax && group.nounPhrase && (
              <span
                className="absolute -bottom-1 left-0 right-0 h-[2.5px] rounded-full"
                style={{ backgroundColor: getCaseColor(group.nounPhrase.case) }}
              />
            )}
          </span>
        </span>
      );
    });
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
