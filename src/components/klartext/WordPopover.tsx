"use client";

import { useEffect, useRef } from "react";
import type { Token } from "@/lib/types";
import { POS_LABELS_DE } from "@/lib/syntax-colors";

interface WordPopoverProps {
  token: Token;
  onClose: () => void;
}

const MORPHOLOGY_LABELS: Record<string, string> = {
  case: "Kasus",
  number: "Numerus",
  gender: "Genus",
  tense: "Tempus",
  mood: "Modus",
  person: "Person",
};

export function WordPopover({ token, onClose }: WordPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const morphEntries = Object.entries(token.morphology).filter(
    ([, v]) => v !== null
  );

  return (
    <div
      ref={ref}
      className="absolute z-50 mt-2 w-56 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 p-4 animate-in fade-in zoom-in-95"
    >
      <div className="mb-2">
        <p className="text-lg font-serif font-semibold">{token.text}</p>
        {token.lemma !== token.text.toLowerCase() && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Lemma: {token.lemma}
          </p>
        )}
      </div>
      <span className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
        {POS_LABELS_DE[token.pos] ?? token.pos}
      </span>
      {morphEntries.length > 0 && (
        <table className="w-full text-sm">
          <tbody>
            {morphEntries.map(([key, value]) => (
              <tr key={key} className="border-t border-gray-100 dark:border-gray-700">
                <td className="py-1 pr-2 text-gray-500 dark:text-gray-400">
                  {MORPHOLOGY_LABELS[key] ?? key}
                </td>
                <td className="py-1 font-medium">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
