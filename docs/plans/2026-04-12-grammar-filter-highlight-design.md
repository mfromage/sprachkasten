# Grammar Filter & Highlight System Design

Date: 2026-04-12

## Overview

Enhance the Klartext article reader with level/topic filtering, grammar highlighting, noun phrase explanations, and clause structure visualization.

## Features

### 1. Filter System

**Filter Panel**
Collapsible panel in toolbar with:
- Level checkboxes: A1, A2, B1, B2, C1, C2 (styled with level colors)
- Topic checkboxes: Dynamically populated from article content (Akkusativ, Dativ, Adjektivdeklination, etc.)

**Filter Logic**
- Checking a level = selecting all grammar topics at that level
- Individual topics can be toggled independently
- Result: Show grammar cards matching (selected levels) OR (selected topics)
- No filters = show all grammar

**Persistence**
All preferences saved to localStorage (`sprachkasten:preferences`):
```ts
{
  levels: string[],
  topics: string[],
  showSyntax: boolean,
  showGrammar: boolean,
  showClauses: boolean,
  filterExpanded: boolean
}
```

### 2. Grammar Highlighting

**Interaction**
- Desktop: Hover over GrammarCard to highlight associated words
- Mobile: Tap GrammarCard to toggle highlight (detected via `@media (hover: none)`)

**Visual Style**
Background color matching grammar level:
```css
.highlight-A1 { background: rgba(16, 185, 129, 0.2); }  /* emerald */
.highlight-A2 { background: rgba(20, 184, 166, 0.2); }  /* teal */
.highlight-B1 { background: rgba(59, 130, 246, 0.2); }  /* blue */
.highlight-B2 { background: rgba(99, 102, 241, 0.2); }  /* indigo */
.highlight-C1 { background: rgba(249, 115, 22, 0.2); }  /* orange */
.highlight-C2 { background: rgba(239, 68, 68, 0.2); }   /* red */
```

Subtle rounded corners; coexists with syntax capsule underlines.

**State Flow**
1. GrammarCard triggers `onHighlight(tokenIds)` / `onClearHighlight()`
2. SentenceBlock tracks `highlightedTokenIds: Set<number>`
3. TokenWord checks membership, applies highlight class

### 3. Word Popover Enhancement

For nouns with `noun_phrase` data, show additional section:

```
┌─────────────────────────────────┐
│ Regierung  (die, f.)            │
│ government                      │
├─────────────────────────────────┤
│ Dativ, Singular                 │
│ Governed by preposition "mit"   │
├─────────────────────────────────┤
│ N-Deklination                   │  ← if notes[] present
└─────────────────────────────────┘
```

**Data Lookup**
Find `noun_phrase` where `token_ids.includes(token.id)`, display `case`, `case_reason`, `notes`.

### 4. Clause Structure Visualization

**Toggle**
New "Satzstruktur" pill in toolbar.

**Display (when active)**
Labeled brackets around clauses:
```
[Hauptsatz: Die Regierung erklärte,] [Nebensatz (dass): sie den Plan unterstützt.]
```

**Styling**
- Brackets: Subtle `border-l-2` / `border-r-2` with rounded caps
- Labels: `text-xs text-gray-500` above opening bracket
- Nebensatz label includes connector: `Nebensatz (weil)`
- Nested clauses: Progressively darker brackets

**Legend**
When active, show: `Hauptsatz | Nebensatz (connector)`

## Type Updates

```ts
interface NounPhrase {
  text: string;
  token_ids: number[];
  head_token_id: number;
  case: string;
  case_reason: string;
  gender: string;
  number: string;
  notes: string[];
}

interface Clause {
  type: "main" | "subordinate";
  token_ids: number[];
  connector: string | null;
  verb: string;
}

interface Sentence {
  sentence: string;
  tokens: Token[];
  units: Unit[];
  noun_phrases: NounPhrase[];  // NEW
  clauses: Clause[];           // NEW
  grammar_themes: GrammarTheme[];
}
```

## Toolbar Layout

```
┌──────────────────────────────────────────────────────────┐
│ [Satzglieder] [Grammatik] [Satzstruktur]    [Filter ▼]  │
├──────────────────────────────────────────────────────────┤
│ Niveau:  ☑ A1  ☑ A2  ☐ B1  ☐ B2  ☐ C1  ☐ C2            │
│ Themen:  ☐ Akkusativ  ☐ Dativ  ☐ Adjektivdeklination    │
└──────────────────────────────────────────────────────────┘
│ (Legend: Syntax / Clause - conditional)                  │
└──────────────────────────────────────────────────────────┘
```

## Component Changes

| File | Changes |
|------|---------|
| `types.ts` | Add `NounPhrase`, `Clause`; update `Sentence` |
| `ArticleToolbar.tsx` | Add Satzstruktur toggle, Filter button, collapsible panel |
| `SentenceBlock.tsx` | Track `highlightedTokenIds`; wrap tokens in clause brackets |
| `TokenWord.tsx` | Accept `isHighlighted`, apply level-colored background |
| `GrammarCard.tsx` | Add hover/tap handlers; respect filter visibility |
| `WordPopover.tsx` | Add case_reason section with notes |

## New Files

| File | Purpose |
|------|---------|
| `hooks/useArticlePreferences.ts` | localStorage-backed state |
| `FilterPanel.tsx` | Level/topic checkboxes |
| `ClauseLegend.tsx` | Hauptsatz/Nebensatz legend |
| `lib/highlight-colors.ts` | Level → background color map |

## Data Flow

```
KlartextPage
 └─ useArticlePreferences()
 └─ ArticleToolbar
 │   └─ FilterPanel
 │   └─ SyntaxLegend / ClauseLegend
 └─ SentenceBlock[]
     └─ ClauseBracket[] (when showClauses)
     └─ TokenWord[] (highlight state)
     └─ GrammarCard[] (filtered, triggers highlights)
```

## Default State (First Visit)

- All toggles: off
- No level/topic filters: show all grammar
- Filter panel: collapsed
