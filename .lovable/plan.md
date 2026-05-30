## Goal

In the "Side-by-side comparison" controls, always make it obvious which selection state is active (All, None, or Top 4) and visually mark which platforms are the Top 4.

## Changes — `src/components/ComparisonMatrix.tsx`

### 1. Define and reuse the Top 4 list
- Add a module-level `const TOP_4_IDS: ArchId[] = ["lovable-cloud", "lovable-supabase", "lovable-vercel", "lovable-aws"]` so it isn't duplicated.
- Derive three state booleans next to the existing `allSelected` / `noneSelected`:
  - `top4Selected` = enabled set equals `TOP_4_IDS` exactly (same length, same members).

### 2. Make the three preset buttons reflect active state
Currently "Compare all", "Popular 4", "Clear" look identical until disabled. Update so the matching button is visibly the active state:
- Rename "Popular 4" → **"Top 4"** to match user vocabulary.
- The button whose state matches the current selection gets `variant="default"` (filled primary) plus a small `Check` icon; the other two stay `variant="outline"` / `ghost`.
- All three remain clickable (don't disable the active one) so the state is clear without dead-feeling controls — except "Clear" stays disabled when nothing is selected (preserves current behavior).
- Add a short live-region label just under the buttons: when `allSelected` show "All 10 selected", when `top4Selected` show "Top 4 selected", when `noneSelected` show "None selected", otherwise show "Custom selection (X of 10)". This replaces / augments the existing "X of 10 selected — tap any platform…" line so the mode is named, not just counted.

### 3. Mark the Top 4 in the picker
- In the per-platform chip loop, compute `isTop4 = TOP_4_IDS.includes(a.id)`.
- When `isTop4` and not active: add a subtle ring + a tiny "★" or "Top 4" micro-badge inside the chip (e.g. an 8px star glyph before the name, `text-amber-500`).
- When `isTop4` and active: keep filled primary styling but still show the star so the designation survives selection.
- Add a one-line legend under the category list: `★ = Top 4 picks (most-asked combinations).`

### 4. Mark the Top 4 in the matrix header
- In the matrix region (lines ~217+, not fully shown), when a column's arch id is in `TOP_4_IDS`, prepend the same ★ glyph to the column header so the designation is consistent between picker and matrix. No layout changes.

## Out of scope
- No data model changes, no new presets, no routing/state changes outside this component.
- Copy in the "Heads up" strip is unchanged.