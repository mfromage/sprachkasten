export const CASE_COLORS: Record<string, string> = {
  Nom: "var(--color-nom, #22c55e)",
  Acc: "var(--color-acc, #f97316)",
  Dat: "var(--color-dat, #3b82f6)",
  Gen: "var(--color-gen, #a855f7)",
};

export const CASE_LABELS: Record<string, string> = {
  Nom: "Nominativ",
  Acc: "Akkusativ",
  Dat: "Dativ",
  Gen: "Genitiv",
};

export function getCaseColor(caseKey: string): string {
  return CASE_COLORS[caseKey] ?? "#9ca3af";
}
