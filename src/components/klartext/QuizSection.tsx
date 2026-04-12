"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/types";

interface QuizSectionProps {
  quiz: QuizQuestion[];
}

export function QuizSection({ quiz }: QuizSectionProps) {
  if (quiz.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Verständnisfragen</h2>
      <div className="space-y-3">
        {quiz.map((q, i) => (
          <QuizCard key={i} index={i} question={q} />
        ))}
      </div>
    </section>
  );
}

function QuizCard({ index, question }: { index: number; question: QuizQuestion }) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      <p className="font-medium mb-3">
        <span className="text-indigo-600 dark:text-indigo-400 mr-2">{index + 1}.</span>
        {question.question}
      </p>
      {showHint ? (
        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 animate-in fade-in slide-in-from-top-2">
          <p className="italic">{question.hint}</p>
        </div>
      ) : (
        <button
          onClick={() => setShowHint(true)}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          Hinweis anzeigen
        </button>
      )}
    </div>
  );
}
