"use client";

import { useState, useRef } from "react";
import type { Token, NounPhrase } from "@/lib/types";
import { WordPopover } from "./WordPopover";

const CASE_COLORS: Record<string, string> = {
  Nom: "var(--color-nom, #22c55e)", // green
  Acc: "var(--color-acc, #f97316)", // orange
  Dat: "var(--color-dat, #3b82f6)", // blue
  Gen: "var(--color-gen, #a855f7)", // purple
};

interface TokenWordProps {
  token: Token;
  showSyntax: boolean;
  highlightColor?: string;
  nounPhrase?: NounPhrase;
}

export function TokenWord({ token, showSyntax, highlightColor, nounPhrase }: TokenWordProps) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  if (token.pos === "PUNCT") {
    return <span>{token.text}</span>;
  }

  // Use nounPhrase case for coloring when showSyntax is on
  const caseColor = nounPhrase?.case ? CASE_COLORS[nounPhrase.case] : undefined;

  // Get first translation
  const translation = token.translations?.[0]?.translations?.[0];

  return (
    <span className="relative inline" ref={spanRef}>
      <span
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="cursor-pointer transition-all duration-200 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 rounded-sm px-0.5 -mx-0.5 pb-1"
        style={highlightColor ? { backgroundColor: highlightColor } : undefined}
      >
        {token.text}
        {showSyntax && caseColor && (
          <span
            className="absolute -bottom-1 left-0 right-0 h-[2.5px] rounded-full transition-colors duration-200"
            style={{ backgroundColor: caseColor }}
          />
        )}
      </span>

      {/* Hover tooltip with translation, case_reason, notes */}
      {hover && !open && (translation || nounPhrase) && (
        <span className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          {translation && <span className="font-medium">{translation}</span>}
          {translation && nounPhrase && " · "}
          {nounPhrase && (
            <span className="text-gray-300 dark:text-gray-600">
              {nounPhrase.case_reason}
              {nounPhrase.notes?.length > 0 && ` · ${nounPhrase.notes.join(", ")}`}
            </span>
          )}
        </span>
      )}

      {open && <WordPopover token={token} nounPhrase={nounPhrase} onClose={() => setOpen(false)} />}
    </span>
  );
}
