export function ClauseLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 animate-in fade-in slide-in-from-top-1 duration-300">
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-4 h-3 border-l-2 border-r-2 border-gray-400 dark:border-gray-500 rounded-sm" />
        <span>Hauptsatz</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-4 h-3 border-l-2 border-r-2 border-blue-400 dark:border-blue-500 rounded-sm" />
        <span>Nebensatz (Konnektor)</span>
      </div>
    </div>
  );
}
