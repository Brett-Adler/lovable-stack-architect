## Problem

The middle column's "Side-by-side comparison" title + description and the "Heads up" note float as loose text against the page background, while the Inputs (left) and Recommendation (right) columns are clean rounded cards. The asymmetry makes the panel feel heavier and harder to scan.

## Direction (locked from your picks)

- Lovable style — reuse existing tokens (`bg-card`, `border-border`, `rounded-2xl`, `shadow-card`, `text-foreground`, `text-muted-foreground`). No new colors or fonts.
- Dashboard layout — one outer card frames the whole column. A header strip sits at the top with the title on the left and the toolbar (`Compare all` / `Popular 4` / `Clear`) on the right. Below it, two panels with consistent rhythm: option picker, then the matrix.

## Changes

### `src/pages/Index.tsx`
- Remove the loose `<div>` with the `<h2>` + description above `<ComparisonMatrix>`.
- Pass the title/description down by letting `ComparisonMatrix` own the header (cleaner — keeps toolbar + title together).

### `src/components/ComparisonMatrix.tsx`
Restructure into one outer `rounded-2xl border bg-card shadow-card` container with three stacked regions divided by `border-b border-border`:

```text
┌─ Comparison card ─────────────────────────────┐
│ Header strip                                  │
│  Side-by-side comparison      [all][pop][clr] │
│  Scores reflect how each…                     │
├───────────────────────────────────────────────┤
│ Heads up: Lovable Cloud and external Supabase │  (compact inline note, muted bg)
├───────────────────────────────────────────────┤
│ Choose options to compare                     │
│  [category chip groups…]                      │
├───────────────────────────────────────────────┤
│ Matrix table                                  │
│  …                                            │
│  Legend                                       │
└───────────────────────────────────────────────┘
```

Specific moves:
- Header strip: `px-4 sm:px-5 py-4` with `flex items-start justify-between gap-3`. Title `text-base sm:text-lg font-semibold`, description `text-xs sm:text-sm text-muted-foreground`. Toolbar buttons (Compare all / Popular 4 / Clear) move from the picker region up here so the picker stops competing with its own title.
- Heads-up: collapse to a single-line `px-4 sm:px-5 py-2.5 text-xs bg-muted/30 border-y border-border` strip — no rounded box of its own, since it now lives inside the card.
- Picker region: drop the inner card chrome (no second border, no second shadow). Keep the category subgroups but use the lighter `bg-muted/15` so they read as content, not nested cards. `px-4 sm:px-5 py-4`.
- Matrix region: drop the outer `rounded-2xl border shadow-card` wrapper — it's now part of the parent card. Keep the horizontal scroll container and legend footer; legend gets `border-t` only.
- Empty-state ("Select at least one option…") becomes an inner `px-4 sm:px-5 py-10 text-center` region inside the same card, not a separate dashed card.

### Result

The comparison column reads as one tile with the same silhouette as Inputs and Recommendation. The header, controls, context note, picker, and matrix share one frame with consistent horizontal padding and divider rhythm.

No data, scoring, or business logic changes.
