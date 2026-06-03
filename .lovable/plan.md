## Goal
Replace the "Take the tour" button + dismissible tour card with a small `?` help icon on each step header. Clicking the icon opens a short popover with the relevant tour copy.

## Changes

### Remove
- `src/components/SetupTour.tsx` — delete file.
- In `src/pages/Index.tsx`:
  - Remove the `SetupTourPanel`, `SetupTourToggle`, `useSetupTour` import.
  - Remove the `const tour = useSetupTour();` line.
  - Remove the `<div className="flex justify-end">…</div>` toggle row and the conditional `<SetupTourPanel />` block from the Setup tab.
  - Collapse the Setup panel back to its original single-grid layout (drop the temporary `space-y-*` wrapper + inner grid div added in the previous turn).

### Add — `?` help affordance on step headers
- Extend `StepShell` in `src/pages/Index.tsx` with an optional `help?: string` prop. When provided, render a small circular icon button to the **right of the title** (same row as the numbered badge + title) using a `HelpCircle` icon from `lucide-react`. The button opens a shadcn `Popover` (`@/components/ui/popover`, already in the project) anchored to the icon, containing the help text.
  - Icon button: `h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent`, `aria-label={`Help: ${title}`}`. Sits at the end of the title row via `ml-auto`.
  - Popover content: `max-w-xs text-sm`, with a small bold title echoing the step name and a one/two-sentence body.

### Help copy (carried over from the previous tour card)
- **Step 1 — "Tell us about your project"**: "Stage, team, budget, compliance, and workloads. Each answer reweights the scoring."
- **Step 2 — "Choose what to compare"**: "Toggle which platforms are weighed. Hidden ones drop out of the matrix and recommendation."
- **Step 3 — "Your recommendation"** (Recommendation tab): "Your top pick based on inputs and platforms you're comparing, plus cost & scaling and the architecture diagram. Updates live."
- **Full comparison matrix** heading (not a StepShell — separate `<header>` block lower on the page): add the same `?` icon + Popover inline next to the heading. Copy: "Supporting evidence — every option scored on the same criteria, with your top pick highlighted."

### A11y
- Each icon button is a real `<button>` with `aria-label`.
- Popover handles focus + Esc dismissal automatically via Radix.

## Out of scope
- No copy changes to existing step titles/subtitles.
- No changes to header, footer, hero, recommendation card internals, or other pages.
- No localStorage persistence (popovers are transient).