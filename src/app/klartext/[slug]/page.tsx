"use client";

import { use, useMemo } from "react";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/fixtures";
import { ArticleToolbar } from "@/components/klartext/ArticleToolbar";
import { SentenceBlock } from "@/components/klartext/SentenceBlock";
import { VocabList } from "@/components/klartext/VocabList";
import { QuizSection } from "@/components/klartext/QuizSection";
import { useArticlePreferences } from "@/hooks/useArticlePreferences";
import { extractTopicsFromArticle } from "@/components/klartext/FilterPanel";

export default function KlartextPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  const prefs = useArticlePreferences();

  const availableTopics = useMemo(
    () => extractTopicsFromArticle(article.paragraphs),
    [article.paragraphs]
  );

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 leading-tight">{article.title}</h1>

      <ArticleToolbar
        showSyntax={prefs.showSyntax}
        showGrammar={prefs.showGrammar}
        showClauses={prefs.showClauses}
        filterExpanded={prefs.filterExpanded}
        selectedLevels={prefs.selectedLevels}
        selectedTopics={prefs.selectedTopics}
        availableTopics={availableTopics}
        onToggleSyntax={() => prefs.setShowSyntax(!prefs.showSyntax)}
        onToggleGrammar={() => prefs.setShowGrammar(!prefs.showGrammar)}
        onToggleClauses={() => prefs.setShowClauses(!prefs.showClauses)}
        onToggleFilter={() => prefs.setFilterExpanded(!prefs.filterExpanded)}
        onToggleLevel={prefs.toggleLevel}
        onToggleTopic={prefs.toggleTopic}
      />

      <article className="space-y-6">
        {article.paragraphs.map((paragraph, pi) => (
          <div key={pi}>
            {paragraph.sentences.map((sentence, si) => (
              <SentenceBlock
                key={si}
                sentence={sentence}
                showSyntax={prefs.showSyntax}
                showGrammar={prefs.showGrammar}
                showClauses={prefs.showClauses}
                selectedLevels={prefs.selectedLevels}
                selectedTopics={prefs.selectedTopics}
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
