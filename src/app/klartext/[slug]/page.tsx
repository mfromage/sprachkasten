"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/fixtures";
import { ArticleToolbar } from "@/components/klartext/ArticleToolbar";
import { SentenceBlock } from "@/components/klartext/SentenceBlock";
import { VocabList } from "@/components/klartext/VocabList";
import { QuizSection } from "@/components/klartext/QuizSection";

export default function KlartextPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  const [showSyntax, setShowSyntax] = useState(false);
  const [showGrammar, setShowGrammar] = useState(false);

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 leading-tight">
        {article.title}
      </h1>

      <ArticleToolbar
        showSyntax={showSyntax}
        showGrammar={showGrammar}
        onToggleSyntax={() => setShowSyntax(!showSyntax)}
        onToggleGrammar={() => setShowGrammar(!showGrammar)}
      />

      <article className="space-y-6">
        {article.paragraphs.map((paragraph, pi) => (
          <div key={pi}>
            {paragraph.sentences.map((sentence, si) => (
              <SentenceBlock
                key={si}
                sentence={sentence}
                showSyntax={showSyntax}
                showGrammar={showGrammar}
              />
            ))}
          </div>
        ))}
      </article>

      <VocabList vocabulary={article.vocabulary} />

      <QuizSection quiz={article.quiz} />
    </main>
  );
}
