import { CASE_COLORS, CASE_LABELS } from "@/lib/case-colors";

const SYNTAX_ROLES = [
  { key: "verb", label: "Verb", color: "var(--color-predicate, #6b7280)" },
  { key: "prep", label: "Präposition", color: "var(--color-modifier, #6b7280)" },
];

const CASES = Object.entries(CASE_COLORS).map(([key, color]) => ({
  key,
  label: CASE_LABELS[key] ?? key,
  color,
}));

export function SyntaxLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 animate-in fade-in slide-in-from-top-1 duration-300">
      {CASES.map((c) => (
        <div key={c.key} className="relative pb-1">
          <span>{c.label}</span>
          <span
            className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full"
            style={{ backgroundColor: c.color }}
          />
        </div>
      ))}
      <span className="text-gray-300 dark:text-gray-600">|</span>
      {SYNTAX_ROLES.map((r) => (
        <div key={r.key} className="relative pb-1">
          <span>{r.label}</span>
          <span
            className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full"
            style={{ backgroundColor: r.color }}
          />
        </div>
      ))}
    </div>
  );
}
