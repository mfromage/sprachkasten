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
      <div className="space-y-4">
        {quiz.map((q, i) => (
          <QuizCard key={i} index={i} question={q} />
        ))}
      </div>
    </section>
  );
}

function QuizCard({ index, question }: { index: number; question: QuizQuestion }) {
  const [selected, setSelected] = useState<number | null>(null);

  const answered = selected !== null;
  const isCorrect = selected === question.correct;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <p className="font-medium mb-4">
        <span className="text-indigo-600 dark:text-indigo-400 mr-2">{index + 1}.</span>
        {question.question}
      </p>
      <div className="space-y-2">
        {question.options.map((option, oi) => {
          const isThis = selected === oi;
          const isAnswer = question.correct === oi;

          let className =
            "w-full text-left rounded-lg px-4 py-3 text-sm transition-all duration-200 border ";

          if (!answered) {
            className +=
              "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 cursor-pointer";
          } else if (isAnswer) {
            className +=
              "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300";
          } else if (isThis && !isCorrect) {
            className +=
              "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300";
          } else {
            className +=
              "border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600";
          }

          return (
            <button
              key={oi}
              onClick={() => !answered && setSelected(oi)}
              disabled={answered}
              className={className}
            >
              <span className="font-medium mr-2 text-gray-400 dark:text-gray-500">
                {String.fromCharCode(65 + oi)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>
      {answered && (
        <p className={`mt-3 text-sm font-medium animate-in fade-in ${isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
          {isCorrect ? "Richtig!" : "Leider falsch."}
        </p>
      )}
    </div>
  );
}
