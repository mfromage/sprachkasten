"use client";

import { useEffect, useRef } from "react";
import type { Token, NounPhrase } from "@/lib/types";
import { POS_LABELS_DE } from "@/lib/syntax-colors";

interface WordPopoverProps {
  token: Token;
  nounPhrase?: NounPhrase;
  phraseTokens?: Token[];
  onClose: () => void;
}

const GENDER_SHORT: Record<string, string> = {
  Masc: "m.",
  Fem: "f.",
  Neut: "n.",
};

const CASE_SHORT: Record<string, string> = {
  Nom: "Nominativ",
  Acc: "Akkusativ",
  Dat: "Dativ",
  Gen: "Genitiv",
};

const NUMBER_DE: Record<string, string> = {
  Sing: "Singular",
  Plur: "Plural",
};

// Get first translation from token
function getTranslation(token: Token): string | null {
  if (!token.translations || token.translations.length === 0) return null;
  const first = token.translations[0];
  if (first.translations.length === 0) return null;
  return first.translations.slice(0, 2).join(", ");
}

function TokenInfo({ token }: { token: Token }) {
  const gender = token.morphology.gender;
  const kasus = token.morphology.case;
  const posLabel = POS_LABELS_DE[token.pos] ?? token.pos;
  const translation = getTranslation(token);
  const showLemma = token.lemma.toLowerCase() !== token.text.toLowerCase();

  return (
    <div className="space-y-0.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-gray-800 dark:text-gray-200">{token.text}</span>
        {gender && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            ({GENDER_SHORT[gender] ?? gender})
          </span>
        )}
        <span className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400">
          {posLabel}
        </span>
        {kasus && (
          <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-xs text-blue-700 dark:text-blue-300">
            {CASE_SHORT[kasus] ?? kasus}
          </span>
        )}
      </div>
      {showLemma && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          ← {token.lemma}
        </p>
      )}
      {translation && (
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
          {translation}
        </p>
      )}
    </div>
  );
}

export function WordPopover({ token, nounPhrase, phraseTokens, onClose }: WordPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isGrouped = phraseTokens && phraseTokens.length > 1;

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

  // Adjust position to prevent overflow
  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      // If overflowing right, shift left
      if (rect.right > viewportWidth - 16) {
        const overflow = rect.right - viewportWidth + 16;
        ref.current.style.transform = `translateX(-${overflow}px)`;
      }
      // If overflowing left, shift right
      if (rect.left < 16) {
        ref.current.style.transform = `translateX(${16 - rect.left}px)`;
      }
    }
  }, []);

  // For grouped phrases: show phrase info first, then member words
  if (isGrouped && nounPhrase) {
    return (
      <div
        ref={ref}
        className="absolute z-50 mt-2 w-auto min-w-56 max-w-80 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 p-4 animate-in fade-in zoom-in-95"
      >
        {/* Phrase info */}
        <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {nounPhrase.text}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
            {CASE_SHORT[nounPhrase.case] ?? nounPhrase.case}
          </span>
          <span className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
            {NUMBER_DE[nounPhrase.number] ?? nounPhrase.number}
          </span>
          {nounPhrase.gender && (
            <span className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
              {GENDER_SHORT[nounPhrase.gender] ?? nounPhrase.gender}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {nounPhrase.case_reason}
        </p>
        {nounPhrase.notes.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {nounPhrase.notes.map((note, i) => (
              <span
                key={i}
                className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                  note.includes("N-Deklination")
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                    : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                }`}
              >
                {note}
              </span>
            ))}
          </div>
        )}

        {/* Member words */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Wörter</p>
          {phraseTokens.map((t) => (
            <TokenInfo key={t.id} token={t} />
          ))}
        </div>
      </div>
    );
  }

  // Single word popover
  const gender = token.morphology.gender;
  const kasus = token.morphology.case;
  const tense = token.morphology.tense;
  const mood = token.morphology.mood;
  const posLabel = POS_LABELS_DE[token.pos] ?? token.pos;
  const translation = getTranslation(token);

  return (
    <div
      ref={ref}
      className="absolute z-50 mt-2 w-auto min-w-48 max-w-72 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 p-4 animate-in fade-in zoom-in-95"
    >
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-lg font-sans font-semibold">{token.text}</span>
        {gender && (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            ({GENDER_SHORT[gender] ?? gender})
          </span>
        )}
      </div>

      {token.lemma.toLowerCase() !== token.text.toLowerCase() && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Grundform:{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">{token.lemma}</span>
        </p>
      )}

      {translation && (
        <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
          {translation}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-1.5 mt-1">
        <span className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
          {posLabel}
        </span>
        {kasus && (
          <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
            {CASE_SHORT[kasus] ?? kasus}
          </span>
        )}
        {tense && (
          <span className="inline-block rounded-full bg-amber-50 dark:bg-amber-900/30 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
            {tense}
          </span>
        )}
        {mood && mood !== "Ind" && (
          <span className="inline-block rounded-full bg-purple-50 dark:bg-purple-900/30 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-300">
            {mood}
          </span>
        )}
      </div>

      {nounPhrase && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1.5">
            {nounPhrase.text}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
              {CASE_SHORT[nounPhrase.case] ?? nounPhrase.case}
            </span>
            <span className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
              {NUMBER_DE[nounPhrase.number] ?? nounPhrase.number}
            </span>
            {nounPhrase.gender && (
              <span className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                {GENDER_SHORT[nounPhrase.gender] ?? nounPhrase.gender}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {nounPhrase.case_reason}
          </p>
          {nounPhrase.notes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {nounPhrase.notes.map((note, i) => (
                <span
                  key={i}
                  className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                    note.includes("N-Deklination")
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  }`}
                >
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
