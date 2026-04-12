import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import type { Article } from "./types";
import type { ArticleContent, IndexContent } from "./content-schema";

const CONTENT_DIR = join(process.cwd(), "content");
const ARTICLES_DIR = join(CONTENT_DIR, "articles");

// Cache for loaded articles
const articleCache = new Map<string, ArticleContent>();

function loadArticle(slug: string): ArticleContent | null {
  // Check cache first
  if (articleCache.has(slug)) {
    return articleCache.get(slug)!;
  }

  const filePath = join(ARTICLES_DIR, `${slug}.json`);
  try {
    const content = JSON.parse(readFileSync(filePath, "utf-8")) as ArticleContent;
    articleCache.set(slug, content);
    return content;
  } catch {
    return null;
  }
}

function loadIndex(): IndexContent {
  const indexPath = join(CONTENT_DIR, "index.json");
  return JSON.parse(readFileSync(indexPath, "utf-8")) as IndexContent;
}

export function getArticle(slug: string): Article | null {
  const article = loadArticle(slug);
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
  // Read directly from filesystem - no need for index.json
  const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"));
  return files.map((f) => f.replace(".json", ""));
}

export function getArticleIndex(): IndexContent {
  return loadIndex();
}
