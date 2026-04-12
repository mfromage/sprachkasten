const CASES = [
  { key: "Nom", label: "Nominativ", color: "var(--color-nom, #22c55e)" },
  { key: "Acc", label: "Akkusativ", color: "var(--color-acc, #f97316)" },
  { key: "Dat", label: "Dativ", color: "var(--color-dat, #3b82f6)" },
  { key: "Gen", label: "Genitiv", color: "var(--color-gen, #a855f7)" },
];

export function SyntaxLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400 animate-in fade-in slide-in-from-top-1 duration-300">
      {CASES.map((c) => (
        <div key={c.key} className="flex items-center gap-1.5">
          <span
            className="inline-block w-4 h-1 rounded-full"
            style={{ backgroundColor: c.color }}
          />
          <span>{c.label}</span>
        </div>
      ))}
    </div>
  );
}
