import { SYNTAX_GROUP_COLORS, SYNTAX_GROUP_LABELS, type SyntaxGroup } from "@/lib/syntax-colors";

const GROUPS: SyntaxGroup[] = ["subject", "predicate", "object", "modifier", "connector", "other"];

export function SyntaxLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400 animate-in fade-in slide-in-from-top-1 duration-300">
      {GROUPS.map((group) => (
        <div key={group} className="flex items-center gap-1.5">
          <span
            className="inline-block w-4 h-1 rounded-full"
            style={{ backgroundColor: SYNTAX_GROUP_COLORS[group] }}
          />
          <span>{SYNTAX_GROUP_LABELS[group]}</span>
        </div>
      ))}
    </div>
  );
}
