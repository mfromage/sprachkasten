# Klartext — Article Reader Tool Design

**Project:** Sprachkasten (toolbox website)
**Tool:** Klartext (German article reading assistant)
**Date:** 2026-04-12

## Overview

Klartext helps German learners read real articles with interactive linguistic analysis. Users can toggle color-coded syntactic roles (Satzglieder) and inline grammar explanations. The reading experience is editorial and focused, with playful accents in the interactive/learning layers.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Local fixture JSON for initial data
- CRUD API later with secret-based auth
- Supabase for persistence (future)

## Page Structure

Route: `/klartext/[slug]`

Single centered column (max-w-2xl / 672px), three sections:

1. **Article** — title, sticky toggle toolbar, paragraph text with interactive tokens
2. **Vocabulary** (Wortschatz) — word list with articles, translations, example sentences
3. **Quiz** — comprehension questions with expandable answer hints

## Toggle Toolbar

Two pill-shaped toggle buttons, sticky below the article title:

- **Satzglieder** — activates color-coded bottom-borders on every word by syntactic role group
- **Grammatik** — shows sentence separators and inline grammar cards below each sentence

Both can be active simultaneously. A legend strip appears when Satzglieder is on.

## Syntactic Role Color Groups

6 groups mapped from ~25 raw syntactic roles:

| Group      | Roles                                                                                                        | CSS Variable        |
| ---------- | ------------------------------------------------------------------------------------------------------------ | ------------------- |
| Subject    | subject, expletive                                                                                           | `--color-subject`   |
| Predicate  | predicate, separable_prefix                                                                                  | `--color-predicate` |
| Objects    | accusative_object, dative_object, prepositional_object, clausal_object                                       | `--color-object`    |
| Modifiers  | modifier, postnominal_modifier, genitive_attribute, apposition, comparative, relative_clause                 | `--color-modifier`  |
| Connectors | coordinating_conjunction, complementizer, conjunct, coordinated                                              | `--color-connector` |
| Other      | punctuation, noun_kernel, proper_noun_component, negation, morphological_particle, sbp, pg, repeated_element | `--color-other`     |

Colors adapt to light/dark mode via CSS variables:

- Subject: blue (#2563eb / #60a5fa)
- Predicate: red (#dc2626 / #f87171)
- Objects: green (#16a34a / #4ade80)
- Modifiers: amber (#d97706 / #fbbf24)
- Connectors: purple (#9333ea / #c084fc)
- Other: gray (#6b7280 / #9ca3af)

## Components

### TokenWord

Each word is a `<span>`:

- Default: plain text
- Satzglieder active: 3px colored bottom-border
- Hover: subtle background highlight
- Click: opens WordPopover

### WordPopover

Shows on click: lemma, POS label in German, morphology table (Kasus, Numerus, Genus), English translation placeholder. Dismisses on click-outside or Escape.

### SentenceBlock

Wraps each sentence. When Grammatik is active: bottom border separator, grammar cards appear below.

### GrammarCard

Rounded card with soft background: theme name, level badge (A1/B2 pill), evidence text. Multiple per sentence stack vertically.

### MultiTokenUnit

For units like separable verbs ("greift...an"): connecting visual link between token parts when Satzglieder is active.

### VocabList

Card list: German word + article, English translation, example sentence with target word highlighted.

### QuizSection

Question cards with "Show hint" accordion expand.

## File Structure

```
src/
  app/
    layout.tsx              # root layout, theme provider
    page.tsx                # Sprachkasten home
    klartext/
      [slug]/
        page.tsx            # article page
  components/
    klartext/
      ArticleToolbar.tsx
      SentenceBlock.tsx
      TokenWord.tsx
      WordPopover.tsx
      GrammarCard.tsx
      SyntaxLegend.tsx
      VocabList.tsx
      QuizSection.tsx
  lib/
    types.ts                # TS interfaces matching fixture JSON
    syntax-colors.ts        # role-to-group color mapping
    fixtures.ts             # loads fixture data by slug
```

## Visual Direction

- **Reading area:** editorial, serif font (Lora), 1.2rem / 1.8 line-height
- **UI chrome:** sans-serif (Inter), playful accents
- **Theme:** dark/light toggle, CSS variables, `localStorage` preference
- **Animations:** 300ms transitions, spring card reveals, scale-in popovers, accordion quiz hints
- **Level badges:** colorful pills (A1=green, B2=blue, C1=orange)
- **Spacing:** 64px between sections, 16px sentence padding when analysis active

## State Management

React `useState` in page component — two booleans (`showSyntax`, `showGrammar`) passed as props. No external state library needed.

## Data Model

Derived from fixture JSON:

- `Article` → `Paragraph[]`
- `Paragraph` → `{ text, sentences: Sentence[] }`
- `Sentence` → `{ sentence, tokens: Token[], units: Unit[], grammar_themes: GrammarTheme[] }`
- `Token` → `{ id, text, lemma, pos, syntactic_role, morphology }`
- `GrammarTheme` → `{ theme_id, theme, level, token_ids, evidence }`
- `Unit` → `{ type, token_ids, surface, lemma }`
