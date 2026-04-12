import { z } from "zod";

// Token schema
const TokenTranslationSchema = z.object({
  pos: z.string(),
  gender: z.string(),
  translations: z.array(z.string()),
});

const MorphologySchema = z.object({
  case: z.string().nullable(),
  number: z.string().nullable(),
  gender: z.string().nullable(),
  tense: z.string().nullable(),
  mood: z.string().nullable(),
  person: z.string().nullable(),
});

const ConjugationPersonsSchema = z.object({
  ich: z.string(),
  du: z.string(),
  er: z.string(),
  wir: z.string(),
  ihr: z.string(),
  sie: z.string(),
});

const ConjugationSchema = z.object({
  praesens: ConjugationPersonsSchema.optional(),
  praeteritum: ConjugationPersonsSchema.optional(),
  perfekt: ConjugationPersonsSchema.optional(),
});

const TokenSchema = z.object({
  id: z.number(),
  text: z.string(),
  lemma: z.string(),
  pos: z.string(),
  syntactic_role: z.string(),
  morphology: MorphologySchema,
  translations: z.array(TokenTranslationSchema).optional(),
  conjugation: ConjugationSchema.nullable().optional(),
});

// Sentence structure schemas
const UnitSchema = z.object({
  type: z.string(),
  token_ids: z.array(z.number()),
  surface: z.string(),
  lemma: z.string(),
});

const GrammarThemeSchema = z.object({
  theme_id: z.string(),
  theme: z.string(),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  token_ids: z.array(z.number()),
  evidence: z.string(),
});

const NounPhraseSchema = z.object({
  text: z.string(),
  token_ids: z.array(z.number()),
  head_token_id: z.number(),
  case: z.string(),
  case_reason: z.string(),
  gender: z.string().nullable(),
  number: z.string().nullable(),
  notes: z.array(z.string()),
});

const ClauseSchema = z.object({
  type: z.enum(["main", "subordinate"]),
  token_ids: z.array(z.number()),
  connector: z.string().nullable(),
  verb: z.string(),
});

const SentenceSchema = z.object({
  sentence: z.string(),
  tokens: z.array(TokenSchema),
  units: z.array(UnitSchema),
  noun_phrases: z.array(NounPhraseSchema).optional().default([]),
  clauses: z.array(ClauseSchema).optional().default([]),
  grammar_themes: z.array(GrammarThemeSchema),
});

const ParagraphSchema = z.object({
  text: z.string(),
  sentences: z.array(SentenceSchema),
});

// Vocabulary and quiz schemas
const VocabEntrySchema = z.object({
  word: z.string(),
  article: z.string().nullable(),
  translation: z.string(),
  example: z.string(),
});

const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correct: z.number().min(0).max(3),
});

// Main article schema
export const ArticleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  title: z.string().min(1),
  source: z.string().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
    .optional(),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
  paragraphs: z.array(ParagraphSchema).min(1),
  vocabulary: z.array(VocabEntrySchema),
  quiz: z.array(QuizQuestionSchema),
});

// Index schema
export const IndexSchema = z.object({
  articles: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
      date: z.string().optional(),
    }),
  ),
});

export type ArticleContent = z.infer<typeof ArticleSchema>;
export type IndexContent = z.infer<typeof IndexSchema>;
