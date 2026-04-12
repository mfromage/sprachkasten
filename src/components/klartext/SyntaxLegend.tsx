const CASES = [
  { key: "Nom", label: "Nominativ", color: "var(--color-nom, #22c55e)" },
  { key: "Acc", label: "Akkusativ", color: "var(--color-acc, #f97316)" },
  { key: "Dat", label: "Dativ", color: "var(--color-dat, #3b82f6)" },
  { key: "Gen", label: "Genitiv", color: "var(--color-gen, #a855f7)" },
];

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
    </div>
  );
}
