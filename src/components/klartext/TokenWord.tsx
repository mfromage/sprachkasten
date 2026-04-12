"use client";

import { useState, useRef } from "react";
import type { Token, NounPhrase } from "@/lib/types";
import { getSyntaxGroup, SYNTAX_GROUP_COLORS } from "@/lib/syntax-colors";
import { CASE_COLORS } from "@/lib/case-colors";
import { WordPopover } from "./WordPopover";

interface TokenWordProps {
  token: Token;
  showSyntax: boolean;
  highlightColor?: string;
  nounPhrase?: NounPhrase;
  phraseTokens?: Token[];
}

export function TokenWord({ token, showSyntax, highlightColor, nounPhrase, phraseTokens }: TokenWordProps) {
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

  return (
    <span className="relative inline" ref={spanRef}>
      <span
        onClick={() => setOpen(!open)}
        className="cursor-pointer transition-all duration-200 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 rounded-sm px-0.5 -mx-0.5 pb-1"
        style={highlightColor ? { backgroundColor: highlightColor } : undefined}
      >
        {token.text}
        {showSyntax && (
          <span
            className="absolute -bottom-1 left-0 right-0 h-[2.5px] rounded-full transition-colors duration-200"
            style={{ backgroundColor: underlineColor }}
          />
        )}
      </span>
      {open && <WordPopover token={token} nounPhrase={nounPhrase} phraseTokens={phraseTokens} onClose={() => setOpen(false)} />}
    </span>
  );
}
