## Goal

Move the **Inputs / Pick / Compare** section nav from the bottom fixed bar (mobile-only) to a prominent pill bar near the top of `/app`, so users immediately see they can switch between sections.

## Changes — `src/pages/Index.tsx`

1. **Add a new pill-style tab bar** below the hero band (right after line 160), mobile-only:
   - Container: `md:hidden`, centered, sticky just under the header (`sticky top-[~64px] z-30`) so it stays visible as users scroll within a section.
   - Inner element matches the SiteHeader pill style: `grid grid-cols-3 gap-1 rounded-full border border-border/60 bg-card/60 p-1 shadow-sm backdrop-blur`.
   - Each pill: icon + label (`Inputs / Pick / Compare`), `whitespace-nowrap`, full-width inside its grid cell. Active pill = `bg-foreground text-background`; inactive = muted with hover state.
   - Preserves the existing `role="tablist"` / `aria-selected` / `aria-controls` / arrow-key navigation and the scroll-to-top behavior on tab change.

2. **Remove the fixed bottom nav** (lines 240–305) and its bottom-padding compensation (`pb-24 md:pb-6` on main/full-matrix sections becomes plain `pb-6`, plus drop the `env(safe-area-inset-bottom)` padding since it lived on the bottom bar).

3. **Reuse the existing `mobileTab` state and handlers** — no behavior change, just relocation + restyle. The tab IDs (`inputs / recommendation / comparison`) and corresponding `panel-*` / `tab-*` IDs stay the same so a11y wiring keeps working.

## Visual reference

Same pill treatment already used in `SiteHeader` for Home / Methodology / Comparator, so the section nav reads as a natural sibling of the site nav.

## Out of scope

- Desktop layout (≥ md): unchanged — all three panels are visible simultaneously in the grid, so no nav needed.
- Hero copy, content of each panel, full-matrix section.
