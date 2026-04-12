"use client";

import { useState, useRef } from "react";
import type { Token, NounPhrase } from "@/lib/types";
import { getSyntaxGroup, SYNTAX_GROUP_COLORS } from "@/lib/syntax-colors";
import { WordPopover } from "./WordPopover";

interface TokenWordProps {
  token: Token;
  showSyntax: boolean;
  highlightColor?: string;
  nounPhrase?: NounPhrase;
}

export function TokenWord({ token, showSyntax, highlightColor, nounPhrase }: TokenWordProps) {
  const [open, setOpen] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  if (token.pos === "PUNCT") {
    return <span>{token.text}</span>;
  }

  const group = getSyntaxGroup(token.syntactic_role);
  const color = SYNTAX_GROUP_COLORS[group];

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
            style={{ backgroundColor: color }}
          />
        )}
      </span>
      {open && <WordPopover token={token} nounPhrase={nounPhrase} onClose={() => setOpen(false)} />}
    </span>
  );
}
