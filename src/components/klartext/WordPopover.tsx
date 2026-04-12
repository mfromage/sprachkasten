"use client";

import { useEffect, useRef } from "react";
import type { Token, NounPhrase, VerbPhrase, Conjugation } from "@/lib/types";
import { POS_LABELS_DE } from "@/lib/syntax-colors";

interface WordPopoverProps {
  token: Token;
  nounPhrase?: NounPhrase;
  phraseTokens?: Token[];
  verbPhrase?: VerbPhrase;
  verbPhraseTokens?: Token[];
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

const TENSE_LABELS: Record<string, string> = {
  praesens: "Präsens",
  praeteritum: "Präteritum",
  perfekt: "Perfekt",
};

function ConjugationTable({ conjugation }: { conjugation: Conjugation }) {
  const tenses = Object.entries(conjugation).filter(([, forms]) => forms !== undefined) as [
    string,
    { ich: string; du: string; er: string; wir: string; ihr: string; sie: string },
  ][];

  if (tenses.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
        Konjugation
      </p>
      <div className="space-y-3">
        {tenses.map(([tense, forms]) => (
          <div key={tense}>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              {TENSE_LABELS[tense] ?? tense}
            </p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs">
              <span className="text-gray-500 dark:text-gray-400">ich {forms.ich}</span>
              <span className="text-gray-500 dark:text-gray-400">wir {forms.wir}</span>
              <span className="text-gray-500 dark:text-gray-400">du {forms.du}</span>
              <span className="text-gray-500 dark:text-gray-400">ihr {forms.ihr}</span>
              <span className="text-gray-500 dark:text-gray-400">er {forms.er}</span>
              <span className="text-gray-500 dark:text-gray-400">sie {forms.sie}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Map token POS to translation pos codes
const POS_TO_TRANS: Record<string, string> = {
  VERB: "v",
  NOUN: "n",
  ADJ: "adj",
  ADV: "adv",
  ADP: "prep",
  PROPN: "n",
};

const TRANS_POS_LABELS: Record<string, string> = {
  v: "Verb",
  n: "Nomen",
  adj: "Adjektiv",
  adv: "Adverb",
  prep: "Präposition",
};

// Get first matching translation for preview
function getTranslation(token: Token): string | null {
  if (!token.translations || token.translations.length === 0) return null;
  const matchPos = POS_TO_TRANS[token.pos];
  const match = matchPos
    ? token.translations.find((t) => t.pos === matchPos)
    : token.translations[0];
  const entry = match || token.translations[0];
  if (!entry || entry.translations.length === 0) return null;
  return entry.translations.slice(0, 2).join(", ");
}

// Translation section showing all translations grouped by POS match
function TranslationSection({ token }: { token: Token }) {
  if (!token.translations || token.translations.length === 0) return null;

  const matchPos = POS_TO_TRANS[token.pos];
  const matching = matchPos ? token.translations.filter((t) => t.pos === matchPos) : [];
  const others = token.translations.filter((t) => t.pos !== matchPos);

  return (
    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
        Übersetzungen
      </p>
      {matching.length > 0 && (
        <div className="mb-2">
          {matching.map((entry, i) => (
            <p key={i} className="text-sm text-gray-700 dark:text-gray-300">
              {entry.translations.join(", ")}
            </p>
          ))}
        </div>
      )}
      {others.length > 0 && (
        <div className="space-y-1">
          {others.map((entry, i) => (
            <p key={i} className="text-xs text-gray-500 dark:text-gray-400">
              <span className="text-gray-400 dark:text-gray-500">
                ({TRANS_POS_LABELS[entry.pos] ?? entry.pos})
              </span>{" "}
              {entry.translations.slice(0, 3).join(", ")}
            </p>
          ))}
        </div>
      )}
    </div>
  );
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
      {showLemma && <p className="text-xs text-gray-500 dark:text-gray-400">← {token.lemma}</p>}
      {translation && (
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">{translation}</p>
      )}
    </div>
  );
}

export function WordPopover({
  token,
  nounPhrase,
  phraseTokens,
  verbPhrase,
  verbPhraseTokens,
  onClose,
}: WordPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isGrouped = phraseTokens && phraseTokens.length > 1;
  const isVerbGrouped = verbPhraseTokens && verbPhraseTokens.length > 1;

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
        className="fixed left-4 right-4 sm:absolute sm:left-auto sm:right-auto z-50 mt-2 sm:w-80 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 p-4 animate-in fade-in zoom-in-95"
      >
        {/* Phrase info */}
        <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {nounPhrase.text}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
            {CASE_SHORT[nounPhrase.case] ?? nounPhrase.case}
          </span>
          {nounPhrase.number && (
            <span className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
              {NUMBER_DE[nounPhrase.number] ?? nounPhrase.number}
            </span>
          )}
          {nounPhrase.gender && (
            <span className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
              {GENDER_SHORT[nounPhrase.gender] ?? nounPhrase.gender}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{nounPhrase.case_reason}</p>
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

  // For separable verbs: show verb phrase info first, then parts
  if (isVerbGrouped && verbPhrase) {
    // Find the main verb token (has conjugation)
    const mainVerb = verbPhraseTokens.find((t) => t.conjugation);
    const translation = mainVerb ? getTranslation(mainVerb) : null;

    return (
      <div
        ref={ref}
        className="fixed left-4 right-4 sm:absolute sm:left-auto sm:right-auto z-50 mt-2 sm:w-80 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 p-4 animate-in fade-in zoom-in-95"
      >
        {/* Verb phrase info */}
        <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {verbPhrase.text}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Grundform:{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">{verbPhrase.lemma}</span>
        </p>
        {translation && (
          <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">{translation}</p>
        )}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span className="inline-block rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            Trennbares Verb
          </span>
        </div>

        {verbPhrase.conjugation && <ConjugationTable conjugation={verbPhrase.conjugation} />}

        {/* Member words */}
        <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Teile</p>
          {verbPhraseTokens.map((t) => (
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

  return (
    <div
      ref={ref}
      className="fixed left-4 right-4 sm:absolute sm:left-auto sm:right-auto z-50 mt-2 sm:w-72 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 p-4 animate-in fade-in zoom-in-95"
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

      {token.conjugation && <ConjugationTable conjugation={token.conjugation} />}

      <TranslationSection token={token} />

      {nounPhrase && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1.5">
            {nounPhrase.text}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
              {CASE_SHORT[nounPhrase.case] ?? nounPhrase.case}
            </span>
            {nounPhrase.number && (
              <span className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                {NUMBER_DE[nounPhrase.number] ?? nounPhrase.number}
              </span>
            )}
            {nounPhrase.gender && (
              <span className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                {GENDER_SHORT[nounPhrase.gender] ?? nounPhrase.gender}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{nounPhrase.case_reason}</p>
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
