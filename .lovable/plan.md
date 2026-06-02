## Goal

On wide screens, make /app visually read as a 3-step plan (Inputs → Compare → Pick) laid out side-by-side. Degrade gracefully to 2 columns on mid-width screens and the existing stacked/tabbed view on narrow.

## Breakpoints

- **`2xl` (≥1536px) → 3 columns.** All three steps render side-by-side as equal-ish columns: Inputs | Compare | Pick. Numbered badges + connecting line/arrow chevrons between columns make the "1 → 2 → 3" flow explicit.
- **`lg`–`xl` (1024–1535px) → 2 columns.** Step 1 (Inputs) sits in a left sidebar; Steps 2 and 3 stack in the right column. This keeps inputs visible while users review compare/pick, and avoids cramping the matrix + recommendation card.
- **`md` (768–1023px) → stacked.** All three steps stacked full-width with the numbered StepShell headers (current desktop behavior).
- **`<md` → mobile tabs.** Unchanged — the existing sticky 1/2/3 pill nav with one panel visible at a time.

## Layout details

- Wrap the three `<StepShell>` sections in a single grid container with responsive `grid-cols`:
  - `grid-cols-1` (md), `lg:grid-cols-[320px_minmax(0,1fr)]` (2-col), `2xl:grid-cols-3` (3-col).
- In the 2-col layout, Step 1 spans the left column and Steps 2+3 stack in the right column (`lg:col-start-2` on step 2, step 3 flows under it).
- In the 3-col layout, the Step 3 "aside" (CostEstimate) currently sitting next to RecommendationCard collapses into a single column inside Step 3 — the wide CostEstimate sidebar only makes sense when Step 3 has the full page width, not a third of it.
- The ArchitectureDiagram + the full comparison matrix stay full-width below the grid (they need horizontal room and serve as supporting evidence under all three steps).
- Add a subtle horizontal "1 ─ 2 ─ 3" connector visual between the StepShell badges at `2xl` only (small `aria-hidden` divider line in the gutter), so the three-step nature reads at a glance.
- Make each StepShell column `sticky top-…` on `2xl` only if content height differs significantly — otherwise let them be natural height with `items-start`.

## Tab/scroll interactions

- The existing mobile tab state (`mobileTab`) only governs `<md`. On `md`+ all three panels are visible, so `hidden` flags must remain off above `md` (already true via `hidden md:!block`).
- The deep-link `?tab=` scroll-into-view behavior stays as-is for `md`-only stacked layout; in 2-col / 3-col layouts the panels are already on screen, so the scroll is harmless.

## Files

- `src/pages/Index.tsx` — wrap the three `StepShell`s in a responsive grid; adjust Step 3's internal grid so it stops trying to be 2-column when its parent column is narrow; add optional connector divider.
- Possibly minor tweaks to `StepShell` to support a `sticky` variant for the left sidebar in 2-col mode (only if needed).

No component logic, scoring, or data changes.
