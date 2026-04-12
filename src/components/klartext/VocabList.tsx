import type { VocabEntry } from "@/lib/types";

interface VocabListProps {
  vocabulary: VocabEntry[];
}

export function VocabList({ vocabulary }: VocabListProps) {
  if (vocabulary.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Wortschatz</h2>
      <div className="space-y-3">
        {vocabulary.map((entry, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-lg font-semibold">{entry.word}</span>
              {entry.article && (
                <span className="text-sm text-gray-400 dark:text-gray-500">{entry.article}</span>
              )}
              <span className="text-sm text-indigo-600 dark:text-indigo-400">
                {entry.translation}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed">
              {entry.example}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
