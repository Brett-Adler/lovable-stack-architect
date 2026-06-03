## Goal
Add a short, manually-triggered guided tour panel to the Setup tab on the Stack Comparator (`/app`) that briefly explains the four key areas.

## UX

- **Trigger**: A small `"Take the tour"` ghost button (with a `Compass` or `HelpCircle` icon) placed inline in the Setup tab header area — sits just above Step 1 / Step 2, right-aligned on desktop, full-width on mobile. Never auto-opens.
- **Format**: Single dismissible panel (not coachmarks). Appears at the top of the Setup tab's main grid when toggled on, above Step 1 and Step 2.
- **Content**: Compact card with a short intro line and 4 numbered bullets:
  1. **Step 1 — Project inputs**: Stage, team, budget, compliance, and workloads. Each answer reweights the scoring.
  2. **Step 2 — Platforms to compare**: Toggle which platforms are weighed. Hidden ones drop out of the matrix and recommendation.
  3. **Full comparison matrix**: Scroll below for the supporting evidence — every platform scored on the same criteria, with your top pick highlighted.
  4. **Recommendation tab**: Switch to the "3. Recommendation" tab (top pill) for the final pick, cost & scaling, and architecture.
- **Dismiss**: An `X` close button in the top-right of the panel. Closing hides it until the user clicks "Take the tour" again. Preference persisted to `localStorage` so it stays closed across reloads (but never auto-opens — closed by default).
- **A11y**: Panel is a `<section aria-label="Setup tour">`; close button has `aria-label="Close tour"`; trigger button toggles `aria-expanded` and `aria-controls` pointing at the panel id.

## Implementation

- **New file**: `src/components/SetupTour.tsx`
  - Exports `SetupTourPanel` (the dismissible card) and `SetupTourToggle` (the button).
  - Shared open/close state lifted via a tiny custom hook `useSetupTour()` inside the same file: reads/writes `localStorage` key `stack-architect:setup-tour-open` (boolean, default `false`).
  - Panel styling: rounded `border border-border bg-card/60` card matching existing aesthetics, with numbered circular badges reusing the same `bg-foreground text-background` pattern from `StepShell` so it visually echoes the steps. No new design tokens.
- **Edit `src/pages/Index.tsx`** (Setup tab only):
  - Import the new component and hook.
  - Place `SetupTourToggle` just above the `panel-setup` grid (small row, right-aligned on `sm+`).
  - Render `SetupTourPanel` at the top of `panel-setup` (spanning both columns via `lg:col-span-2`) only when open.
  - No other changes — Recommendation tab, hero, header, and matrix sections are untouched.

## Out of scope

- No coachmark/spotlight library, no overlays, no Recommendation-tab tour.
- No copy changes to existing steps.
- No analytics events (can be added later if you want).