"use client";

import { useState, useRef } from "react";
import type { Token, NounPhrase, VerbPhrase } from "@/lib/types";
import { getSyntaxGroup, SYNTAX_GROUP_COLORS } from "@/lib/syntax-colors";
import { CASE_COLORS } from "@/lib/case-colors";
import { WordPopover } from "./WordPopover";

interface TokenWordProps {
  token: Token;
  showSyntax: boolean;
  highlightColor?: string;
  nounPhrase?: NounPhrase;
  phraseTokens?: Token[];
  verbPhrase?: VerbPhrase;
  verbPhraseTokens?: Token[];
}

export function TokenWord({
  token,
  showSyntax,
  highlightColor,
  nounPhrase,
  phraseTokens,
  verbPhrase,
  verbPhraseTokens,
}: TokenWordProps) {
  const [open, setOpen] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  if (token.pos === "PUNCT") {
    return <span>{token.text}</span>;
  }

  // Use case color for nouns, syntactic role color for others
  const caseColor = nounPhrase?.case ? CASE_COLORS[nounPhrase.case] : undefined;
  const syntaxGroup = getSyntaxGroup(token.syntactic_role);
  const syntaxColor = SYNTAX_GROUP_COLORS[syntaxGroup];
  const underlineColor = caseColor || syntaxColor;

  const handleTap = () => setOpen(!open);

  return (
    <span className="relative inline" ref={spanRef}>
      <button
        type="button"
        onClick={handleTap}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleTap();
        }}
        className="cursor-pointer transition-all duration-200 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 active:bg-gray-200/70 dark:active:bg-gray-700/70 rounded-sm px-1 -mx-1 py-1 -my-1 sm:px-0.5 sm:-mx-0.5 sm:py-0 sm:-my-0 sm:pb-1 touch-manipulation font-inherit text-inherit"
        style={highlightColor ? { backgroundColor: highlightColor } : undefined}
      >
        {token.text}
        {showSyntax && (
          <span
            className="absolute -bottom-1 left-0 right-0 h-[2.5px] rounded-full transition-colors duration-200 pointer-events-none"
            style={{ backgroundColor: underlineColor }}
          />
        )}
      </button>
      {open && (
        <WordPopover
          token={token}
          nounPhrase={nounPhrase}
          phraseTokens={phraseTokens}
          verbPhrase={verbPhrase}
          verbPhraseTokens={verbPhraseTokens}
          onClose={() => setOpen(false)}
        />
      )}
    </span>
  );
}
