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

export interface Sentence {
  sentence: string;
  tokens: Token[];
  units: Unit[];
  grammar_themes: GrammarTheme[];
}

export interface Paragraph {
  text: string;
  sentences: Sentence[];
}

export interface Article {
  slug: string;
  title: string;
  paragraphs: Paragraph[];
}
