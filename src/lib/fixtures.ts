import type { Article } from "./types";
import type { ArticleContent, IndexContent } from "./content-schema";

// Import content files
import indexData from "../../content/index.json";
import artikel1 from "../../content/articles/artikel-1.json";

// Map slug to imported article data
const ARTICLES: Record<string, ArticleContent> = {
  "artikel-1": artikel1 as ArticleContent,
};

export function getArticle(slug: string): Article | null {
  const article = ARTICLES[slug];
  if (!article) return null;

  return {
    slug: article.slug,
    title: article.title,
    paragraphs: article.paragraphs,
    vocabulary: article.vocabulary,
    quiz: article.quiz,
  };
}

export function getArticleSlugs(): string[] {
  return (indexData as IndexContent).articles.map((a) => a.slug);
}

export function getArticleIndex(): IndexContent {
  return indexData as IndexContent;
}
