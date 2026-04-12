export type SyntaxGroup =
  | "subject"
  | "predicate"
  | "object"
  | "modifier"
  | "connector"
  | "other";

const ROLE_TO_GROUP: Record<string, SyntaxGroup> = {
  subject: "subject",
  expletive: "subject",
  predicate: "predicate",
  separable_prefix: "predicate",
  accusative_object: "object",
  dative_object: "object",
  prepositional_object: "object",
  clausal_object: "object",
  modifier: "modifier",
  postnominal_modifier: "modifier",
  genitive_attribute: "modifier",
  apposition: "modifier",
  comparative: "modifier",
  relative_clause: "modifier",
  coordinating_conjunction: "connector",
  complementizer: "connector",
  conjunct: "connector",
  coordinated: "connector",
  punctuation: "other",
  noun_kernel: "other",
  proper_noun_component: "other",
  negation: "other",
  morphological_particle: "other",
  sbp: "other",
  pg: "other",
  repeated_element: "other",
};

export function getSyntaxGroup(role: string): SyntaxGroup {
  return ROLE_TO_GROUP[role] ?? "other";
}

export const SYNTAX_GROUP_COLORS: Record<SyntaxGroup, string> = {
  subject: "var(--color-subject)",
  predicate: "var(--color-predicate)",
  object: "var(--color-object)",
  modifier: "var(--color-modifier)",
  connector: "var(--color-connector)",
  other: "var(--color-other)",
};

export const SYNTAX_GROUP_LABELS: Record<SyntaxGroup, string> = {
  subject: "Subjekt",
  predicate: "Prädikat",
  object: "Objekt",
  modifier: "Angabe",
  connector: "Konnektor",
  other: "Sonstige",
};

export const POS_LABELS_DE: Record<string, string> = {
  NOUN: "Nomen",
  VERB: "Verb",
  ADJ: "Adjektiv",
  ADV: "Adverb",
  ADP: "Präposition",
  DET: "Artikel",
  PRON: "Pronomen",
  AUX: "Hilfsverb",
  CCONJ: "Konjunktion",
  SCONJ: "Subjunktion",
  PART: "Partikel",
  NUM: "Numerale",
  PROPN: "Eigenname",
  PUNCT: "Satzzeichen",
};
