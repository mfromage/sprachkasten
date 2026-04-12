"use client";

import { useMemo } from "react";
import type { Article } from "@/lib/types";
import { ArticleToolbar } from "./ArticleToolbar";
import { SentenceBlock } from "./SentenceBlock";
import { VocabList } from "./VocabList";
import { QuizSection } from "./QuizSection";
import { useArticlePreferences } from "@/hooks/useArticlePreferences";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { extractTopicsFromArticle } from "./FilterPanel";

interface ArticleViewProps {
  article: Article;
}

export function ArticleView({ article }: ArticleViewProps) {
  const prefs = useArticlePreferences();
  const toolbarHidden = useScrollDirection();

  const availableTopics = useMemo(
    () => extractTopicsFromArticle(article.paragraphs),
    [article.paragraphs],
  );

  return (
    <main className="max-w-2xl mx-auto px-6 py-12 overflow-x-hidden">
      <h1 className="text-3xl font-bold mb-6 leading-tight">{article.title}</h1>

      <ArticleToolbar
        hidden={toolbarHidden}
        showSyntax={prefs.showSyntax}
        showGrammar={prefs.showGrammar}
        filterExpanded={prefs.filterExpanded}
        selectedLevels={prefs.selectedLevels}
        selectedTopics={prefs.selectedTopics}
        availableTopics={availableTopics}
        onToggleSyntax={() => prefs.setShowSyntax(!prefs.showSyntax)}
        onToggleGrammar={() => prefs.setShowGrammar(!prefs.showGrammar)}
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
