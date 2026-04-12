# Klartext Article Reader — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the Klartext article reader UI — a centered reading experience with toggleable syntactic color-coding and inline grammar explanations, using local fixture data.

**Architecture:** Next.js 16 App Router with a single dynamic route `/klartext/[slug]`. Article data loaded from local fixture JSON. Two toggle states (`showSyntax`, `showGrammar`) managed via `useState` in the page component, passed as props. Dark/light theme via CSS class toggle on `<html>`.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, next/font (Lora + Inter)

---

### Task 1: Scaffold Next.js Project

**Files:**

- Create: project root (via create-next-app)

**Step 1: Create Next.js app**

Run:

```bash
cd /Users/mmichael/Code/daf/sprachkasten
npx create-next-app@latest . --typescript --tailwind --eslint --app --turbopack --src-dir --import-alias "@/*" --yes
```

Note: This will scaffold into the existing directory. The `--yes` flag accepts defaults.

**Step 2: Move fixture into the project**

The fixture at `fixtures/artticle-1.json` should remain where it is — it sits outside `src/` which is fine for data files.

**Step 3: Add Lora font and configure dual fonts**

Modify `src/app/layout.tsx` to import both Inter and Lora via `next/font/google`, exposing CSS variables `--font-inter` and `--font-lora`:

```tsx
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});

export const metadata = {
  title: "Sprachkasten",
  description: "Language learning toolbox",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${lora.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors">
        {children}
      </body>
    </html>
  );
}
```

**Step 4: Configure Tailwind for dark mode and custom fonts**

Add to `src/app/globals.css` (replace default content):

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-lora), Georgia, Cambria, serif;

  --color-subject: #2563eb;
  --color-predicate: #dc2626;
  --color-object: #16a34a;
  --color-modifier: #d97706;
  --color-connector: #9333ea;
  --color-other: #6b7280;
}

.dark {
  --color-subject: #60a5fa;
  --color-predicate: #f87171;
  --color-object: #4ade80;
  --color-modifier: #fbbf24;
  --color-connector: #c084fc;
  --color-other: #9ca3af;
}
```

**Step 5: Verify it runs**

Run: `cd /Users/mmichael/Code/daf/sprachkasten && npm run dev`

Open http://localhost:3000 — should see default Next.js page with correct fonts.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind, Inter + Lora fonts, dark mode"
```

---

### Task 2: TypeScript Types and Fixture Loader

**Files:**

- Create: `src/lib/types.ts`
- Create: `src/lib/fixtures.ts`
- Create: `src/lib/syntax-colors.ts`

**Step 1: Create TypeScript types**

Create `src/lib/types.ts` matching the fixture JSON structure exactly:

```ts
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
```

**Step 2: Create syntax color mapping**

Create `src/lib/syntax-colors.ts`:

```ts
export type SyntaxGroup = "subject" | "predicate" | "object" | "modifier" | "connector" | "other";

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
```

**Step 3: Create fixture loader**

Create `src/lib/fixtures.ts`:

```ts
import type { Article } from "./types";
import article1 from "../../fixtures/artticle-1.json";

const FIXTURES: Record<string, Article> = {
  "artikel-1": {
    slug: "artikel-1",
    title: "Treffen in Washington geplant / Israel greift weiter an / Vance warnt Iran vor Spiel",
    paragraphs: article1.paragraphs,
  },
};

export function getArticle(slug: string): Article | null {
  return FIXTURES[slug] ?? null;
}

export function getArticleSlugs(): string[] {
  return Object.keys(FIXTURES);
}
```

**Step 4: Commit**

```bash
git add src/lib/types.ts src/lib/syntax-colors.ts src/lib/fixtures.ts
git commit -m "feat: add TypeScript types, syntax color mapping, and fixture loader"
```

---

### Task 3: Theme Toggle and Root Layout

**Files:**

- Create: `src/components/ThemeToggle.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Create ThemeToggle component**

Create `src/components/ThemeToggle.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored === "dark" || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      className="rounded-full p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-5"
        >
          <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM5.404 6.464a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.06 1.06l1.06 1.06Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-5"
        >
          <path
            fillRule="evenodd"
            d="M7.455 2.004a.75.75 0 0 1 .26.77 7 7 0 0 0 9.958 7.967.75.75 0 0 1 1.067.853A8.5 8.5 0 1 1 6.647 1.921a.75.75 0 0 1 .808.083Z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}
```

**Step 2: Add header with ThemeToggle to layout**

Update `src/app/layout.tsx` to include a minimal header with the Sprachkasten name and theme toggle.

**Step 3: Commit**

```bash
git add src/components/ThemeToggle.tsx src/app/layout.tsx
git commit -m "feat: add dark/light theme toggle with localStorage persistence"
```

---

### Task 4: TokenWord and WordPopover Components

**Files:**

- Create: `src/components/klartext/TokenWord.tsx`
- Create: `src/components/klartext/WordPopover.tsx`

**Step 1: Create WordPopover**

Create `src/components/klartext/WordPopover.tsx` — a positioned popover showing token details:

- Word + lemma
- POS label in German (from POS_LABELS_DE)
- Morphology table (only non-null fields)
- Dismisses on click-outside or Escape
- Scale-in animation

```tsx
"use client";

import { useEffect, useRef } from "react";
import type { Token } from "@/lib/types";
import { POS_LABELS_DE } from "@/lib/syntax-colors";

interface WordPopoverProps {
  token: Token;
  onClose: () => void;
}

const MORPHOLOGY_LABELS: Record<string, string> = {
  case: "Kasus",
  number: "Numerus",
  gender: "Genus",
  tense: "Tempus",
  mood: "Modus",
  person: "Person",
};

export function WordPopover({ token, onClose }: WordPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const morphEntries = Object.entries(token.morphology).filter(([, v]) => v !== null);

  return (
    <div
      ref={ref}
      className="absolute z-50 mt-2 w-56 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 p-4 animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="mb-2">
        <p className="text-lg font-serif font-semibold">{token.text}</p>
        {token.lemma !== token.text.toLowerCase() && (
          <p className="text-sm text-gray-500 dark:text-gray-400">Lemma: {token.lemma}</p>
        )}
      </div>
      <span className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
        {POS_LABELS_DE[token.pos] ?? token.pos}
      </span>
      {morphEntries.length > 0 && (
        <table className="w-full text-sm">
          <tbody>
            {morphEntries.map(([key, value]) => (
              <tr key={key} className="border-t border-gray-100 dark:border-gray-700">
                <td className="py-1 pr-2 text-gray-500 dark:text-gray-400">
                  {MORPHOLOGY_LABELS[key] ?? key}
                </td>
                <td className="py-1 font-medium">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

**Step 2: Create TokenWord**

Create `src/components/klartext/TokenWord.tsx`:

```tsx
"use client";

import { useState, useRef } from "react";
import type { Token } from "@/lib/types";
import { getSyntaxGroup, SYNTAX_GROUP_COLORS } from "@/lib/syntax-colors";
import { WordPopover } from "./WordPopover";

interface TokenWordProps {
  token: Token;
  showSyntax: boolean;
}

export function TokenWord({ token, showSyntax }: TokenWordProps) {
  const [open, setOpen] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  if (token.pos === "PUNCT") {
    return <span>{token.text}</span>;
  }

  const group = getSyntaxGroup(token.syntactic_role);
  const color = SYNTAX_GROUP_COLORS[group];

  return (
    <span className="relative inline" ref={spanRef}>
      <span
        onClick={() => setOpen(!open)}
        className="cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm px-0.5 -mx-0.5"
        style={
          showSyntax ? { borderBottom: `3px solid ${color}`, paddingBottom: "2px" } : undefined
        }
      >
        {token.text}
      </span>
      {open && <WordPopover token={token} onClose={() => setOpen(false)} />}
    </span>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/klartext/TokenWord.tsx src/components/klartext/WordPopover.tsx
git commit -m "feat: add TokenWord with syntax coloring and WordPopover"
```

---

### Task 5: GrammarCard and SentenceBlock Components

**Files:**

- Create: `src/components/klartext/GrammarCard.tsx`
- Create: `src/components/klartext/SentenceBlock.tsx`

**Step 1: Create GrammarCard**

Create `src/components/klartext/GrammarCard.tsx`:

```tsx
import type { GrammarTheme } from "@/lib/types";

interface GrammarCardProps {
  theme: GrammarTheme;
}

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  A2: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  B1: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  B2: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  C1: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  C2: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function GrammarCard({ theme }: GrammarCardProps) {
  const levelClass =
    LEVEL_COLORS[theme.level] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

  return (
    <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 p-3 text-sm transition-all duration-300 animate-in slide-in-from-top-2 fade-in">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-medium text-gray-900 dark:text-gray-100">{theme.theme}</span>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${levelClass}`}
        >
          {theme.level}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 italic">{theme.evidence}</p>
    </div>
  );
}
```

**Step 2: Create SentenceBlock**

Create `src/components/klartext/SentenceBlock.tsx`:

```tsx
import type { Sentence } from "@/lib/types";
import { TokenWord } from "./TokenWord";
import { GrammarCard } from "./GrammarCard";

interface SentenceBlockProps {
  sentence: Sentence;
  showSyntax: boolean;
  showGrammar: boolean;
}

export function SentenceBlock({ sentence, showSyntax, showGrammar }: SentenceBlockProps) {
  return (
    <div className={showGrammar ? "pb-4 mb-4 border-b border-gray-200 dark:border-gray-800" : ""}>
      <p className="font-serif text-lg leading-relaxed">
        {sentence.tokens.map((token, i) => (
          <span key={token.id}>
            {i > 0 && token.pos !== "PUNCT" && " "}
            <TokenWord token={token} showSyntax={showSyntax} />
          </span>
        ))}
      </p>
      {showGrammar && sentence.grammar_themes.length > 0 && (
        <div className="mt-3 space-y-2">
          {sentence.grammar_themes.map((theme) => (
            <GrammarCard key={theme.theme_id} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/klartext/GrammarCard.tsx src/components/klartext/SentenceBlock.tsx
git commit -m "feat: add SentenceBlock with inline GrammarCard"
```

---

### Task 6: ArticleToolbar and SyntaxLegend

**Files:**

- Create: `src/components/klartext/ArticleToolbar.tsx`
- Create: `src/components/klartext/SyntaxLegend.tsx`

**Step 1: Create SyntaxLegend**

Create `src/components/klartext/SyntaxLegend.tsx`:

```tsx
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
```

**Step 2: Create ArticleToolbar**

Create `src/components/klartext/ArticleToolbar.tsx`:

```tsx
"use client";

import { SyntaxLegend } from "./SyntaxLegend";

interface ArticleToolbarProps {
  showSyntax: boolean;
  showGrammar: boolean;
  onToggleSyntax: () => void;
  onToggleGrammar: () => void;
}

export function ArticleToolbar({
  showSyntax,
  showGrammar,
  onToggleSyntax,
  onToggleGrammar,
}: ArticleToolbarProps) {
  return (
    <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm py-3 mb-6 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-2">
        <TogglePill active={showSyntax} onClick={onToggleSyntax} label="Satzglieder" />
        <TogglePill active={showGrammar} onClick={onToggleGrammar} label="Grammatik" />
      </div>
      {showSyntax && <SyntaxLegend />}
    </div>
  );
}

function TogglePill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      }`}
    >
      {label}
    </button>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/klartext/ArticleToolbar.tsx src/components/klartext/SyntaxLegend.tsx
git commit -m "feat: add ArticleToolbar with toggle pills and SyntaxLegend"
```

---

### Task 7: Article Page (Klartext Reader)

**Files:**

- Create: `src/app/klartext/[slug]/page.tsx`

**Step 1: Create the article page**

Create `src/app/klartext/[slug]/page.tsx` — a client component that:

- Loads article from fixture by slug
- Manages `showSyntax` and `showGrammar` state
- Renders title, toolbar, and paragraphs with SentenceBlocks

```tsx
"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/fixtures";
import { ArticleToolbar } from "@/components/klartext/ArticleToolbar";
import { SentenceBlock } from "@/components/klartext/SentenceBlock";

export default function KlartextPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  const [showSyntax, setShowSyntax] = useState(false);
  const [showGrammar, setShowGrammar] = useState(false);

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl font-bold mb-6 leading-tight">{article.title}</h1>

      <ArticleToolbar
        showSyntax={showSyntax}
        showGrammar={showGrammar}
        onToggleSyntax={() => setShowSyntax(!showSyntax)}
        onToggleGrammar={() => setShowGrammar(!showGrammar)}
      />

      <article className="space-y-6">
        {article.paragraphs.map((paragraph, pi) => (
          <div key={pi}>
            {paragraph.sentences.map((sentence, si) => (
              <SentenceBlock
                key={si}
                sentence={sentence}
                showSyntax={showSyntax}
                showGrammar={showGrammar}
              />
            ))}
          </div>
        ))}
      </article>
    </main>
  );
}
```

**Step 2: Create home page with link**

Update `src/app/page.tsx` to show a simple Sprachkasten landing with a link to the fixture article:

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl font-bold mb-4">Sprachkasten</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">Werkzeuge zum Deutschlernen</p>

      <section>
        <h2 className="text-xl font-semibold mb-4">Klartext</h2>
        <Link
          href="/klartext/artikel-1"
          className="block rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
        >
          <h3 className="font-serif text-lg font-medium mb-1">Treffen in Washington geplant</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Israel greift weiter an / Vance warnt Iran vor Spiel
          </p>
        </Link>
      </section>
    </main>
  );
}
```

**Step 3: Verify in browser**

Run: `npm run dev`

1. Visit http://localhost:3000 — should see Sprachkasten landing
2. Click the article link — should navigate to `/klartext/artikel-1`
3. Toggle "Satzglieder" — words should get colored underlines
4. Toggle "Grammatik" — sentences should separate with grammar cards below
5. Click a word — popover should appear with linguistic details
6. Test dark/light toggle

**Step 4: Commit**

```bash
git add src/app/klartext/[slug]/page.tsx src/app/page.tsx
git commit -m "feat: add klartext article page with syntax and grammar toggles"
```

---

### Task 8: Polish and Animations

**Files:**

- Modify: `src/app/globals.css`
- Modify: various components as needed

**Step 1: Add CSS animations**

Add to `src/app/globals.css`:

```css
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in-from-top-1 {
  from {
    transform: translateY(-4px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-in-from-top-2 {
  from {
    transform: translateY(-8px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes zoom-in-95 {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-in {
  animation-duration: 200ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fade-in;
}
.slide-in-from-top-1 {
  animation-name: slide-in-from-top-1;
}
.slide-in-from-top-2 {
  animation-name: slide-in-from-top-2;
}
.zoom-in-95 {
  animation-name: zoom-in-95;
}
```

**Step 2: Visual check in browser**

Test all interactions — toggle animations, popover scale-in, grammar card slide-in. Verify both light and dark modes.

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add CSS animations for popovers, cards, and legend"
```

---

### Future Tasks (Not in this plan)

These will be planned separately once the core reader is working:

- **Vocabulary section** — needs vocab data added to fixture JSON
- **Quiz section** — needs quiz data added to fixture JSON
- **MultiTokenUnit** — visual linking for separable verbs etc.
- **CRUD API** — route handlers with secret auth
- **Supabase integration** — persistence layer
