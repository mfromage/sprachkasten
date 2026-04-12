import type { Article } from "./types";
import article1 from "../../fixtures/artticle-1.json";

const FIXTURES: Record<string, Article> = {
  "artikel-1": {
    slug: "artikel-1",
    title: "Treffen in Washington geplant / Israel greift weiter an / Vance warnt Iran vor Spiel",
    paragraphs: article1.paragraphs,
  },
};

export function getArticle(slug: string): Article | null {
  return FIXTURES[slug] ?? null;
}

export function getArticleSlugs(): string[] {
  return Object.keys(FIXTURES);
}
