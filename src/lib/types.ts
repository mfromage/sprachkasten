export interface TokenTranslation {
  pos: string;
  gender: string;
  translations: string[];
}

export interface ConjugationPersons {
  ich: string;
  du: string;
  er: string;
  wir: string;
  ihr: string;
  sie: string;
}

export interface Conjugation {
  praesens?: ConjugationPersons;
  praeteritum?: ConjugationPersons;
  perfekt?: ConjugationPersons;
}

export interface Token {
  id: number;
  text: string;
  lemma: string;
  pos: string;
  syntactic_role: string;
  morphology: {
    case: string | null;
    number: string | null;
    gender: string | null;
    tense: string | null;
    mood: string | null;
    person: string | null;
  };
  translations?: TokenTranslation[];
  conjugation?: Conjugation | null;
}

export interface Unit {
  type: string;
  token_ids: number[];
  surface: string;
  lemma: string;
}

export interface GrammarTheme {
  theme_id: string;
  theme: string;
  level: string;
  token_ids: number[];
  evidence: string;
}

export interface NounPhrase {
  text: string;
  token_ids: number[];
  head_token_id: number;
  case: string;
  case_reason: string;
  gender: string | null;
  number: string | null;
  notes: string[];
}

export interface Clause {
  type: "main" | "subordinate";
  token_ids: number[];
  connector: string | null;
  verb: string;
}

export interface VerbPhrase {
  text: string;
  token_ids: number[];
  lemma: string;
  conjugation?: Conjugation | null;
}

export interface Sentence {
  sentence: string;
  tokens: Token[];
  units: Unit[];
  noun_phrases: NounPhrase[];
  clauses: Clause[];
  grammar_themes: GrammarTheme[];
}

export interface Paragraph {
  text: string;
  sentences: Sentence[];
}

export interface VocabEntry {
  word: string;
  article: string | null;
  translation: string;
  example: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface Article {
  slug: string;
  title: string;
  paragraphs: Paragraph[];
  vocabulary: VocabEntry[];
  quiz: QuizQuestion[];
}
