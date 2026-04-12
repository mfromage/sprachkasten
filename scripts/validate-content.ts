#!/usr/bin/env npx tsx
/**
 * Validates all content files against their schemas.
 * Run: npx tsx scripts/validate-content.ts
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { ArticleSchema, IndexSchema } from "../src/lib/content-schema";

const CONTENT_DIR = join(process.cwd(), "content");
const ARTICLES_DIR = join(CONTENT_DIR, "articles");

let hasErrors = false;

function validateFile(
  path: string,
  schema: typeof ArticleSchema | typeof IndexSchema,
  label: string,
) {
  console.log(`Validating ${label}...`);

  try {
    const content = JSON.parse(readFileSync(path, "utf-8"));
    const result = schema.safeParse(content);

    if (!result.success) {
      console.error(`  ERROR in ${label}:`);
      result.error.issues.forEach((issue) => {
        console.error(`    - ${issue.path.join(".")}: ${issue.message}`);
      });
      hasErrors = true;
    } else {
      console.log(`  OK`);
    }
  } catch (e) {
    console.error(`  ERROR reading ${label}: ${e instanceof Error ? e.message : e}`);
    hasErrors = true;
  }
}

// Validate index
const indexPath = join(CONTENT_DIR, "index.json");
if (existsSync(indexPath)) {
  validateFile(indexPath, IndexSchema, "content/index.json");
} else {
  console.error("ERROR: content/index.json not found");
  hasErrors = true;
}

// Validate all articles
if (existsSync(ARTICLES_DIR)) {
  const articleFiles = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"));

  if (articleFiles.length === 0) {
    console.warn("WARNING: No article files found in content/articles/");
  }

  for (const file of articleFiles) {
    validateFile(join(ARTICLES_DIR, file), ArticleSchema, `content/articles/${file}`);
  }
} else {
  console.error("ERROR: content/articles/ directory not found");
  hasErrors = true;
}

// Cross-validate: check index references existing articles
if (existsSync(indexPath) && existsSync(ARTICLES_DIR)) {
  console.log("\nCross-validating index references...");
  const index = JSON.parse(readFileSync(indexPath, "utf-8"));
  const articleFiles = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"));
  const articleSlugs = new Set(articleFiles.map((f) => f.replace(".json", "")));

  for (const entry of index.articles || []) {
    if (!articleSlugs.has(entry.slug)) {
      console.error(
        `  ERROR: Index references "${entry.slug}" but content/articles/${entry.slug}.json not found`,
      );
      hasErrors = true;
    }
  }

  // Check for orphaned articles
  for (const slug of articleSlugs) {
    const inIndex = (index.articles || []).some((a: { slug: string }) => a.slug === slug);
    if (!inIndex) {
      console.warn(`  WARNING: content/articles/${slug}.json exists but not in index`);
    }
  }

  console.log("  Done");
}

console.log("");
if (hasErrors) {
  console.error("Content validation FAILED");
  process.exit(1);
} else {
  console.log("Content validation PASSED");
}
