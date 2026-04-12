export const LEVEL_HIGHLIGHT_COLORS: Record<string, string> = {
  A1: "rgba(16, 185, 129, 0.2)", // emerald
  A2: "rgba(20, 184, 166, 0.2)", // teal
  B1: "rgba(59, 130, 246, 0.2)", // blue
  B2: "rgba(99, 102, 241, 0.2)", // indigo
  C1: "rgba(249, 115, 22, 0.2)", // orange
  C2: "rgba(239, 68, 68, 0.2)", // red
};

export function getLevelHighlightColor(level: string): string {
  return LEVEL_HIGHLIGHT_COLORS[level] ?? "rgba(156, 163, 175, 0.2)"; // gray fallback
}
