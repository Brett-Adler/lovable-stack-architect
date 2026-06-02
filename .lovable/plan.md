## Goal

Re-organize the main page from a single 1/2/3 grid (with a mobile-only pill nav) into **two top-level tabs that work at all screen sizes**:

- **Tab A — "Setup" (Steps 1 & 2):** Project Inputs + Choose what to compare. Side-by-side on wide screens, stacked on narrow.
- **Tab B — "Recommendation" (Step 3):** The top pick plus Cost & Scaling and Tech Stack. Self-splits into 2 columns when wide enough.

This makes it easier to flip between configuring and viewing the result, and lets each tab use full page width for its own split layout.

## Changes (all in `src/pages/Index.tsx`)

### 1. Replace the three-tab state with a two-tab state

```ts
type TabId = "setup" | "recommendation";
const VALID_TABS = ["setup", "recommendation"] as const;
```

Migrate the existing `?tab=` deep links: `inputs` and `comparison` → `setup`; `recommendation` stays.

### 2. Promote the pill nav from mobile-only to all breakpoints

- Remove the `md:hidden` on the `<nav>` so the tabs show on every viewport.
- Make it two pills instead of three:
  - **1–2. Setup** (icon: SlidersHorizontal)
  - **3. Recommendation** (icon: Sparkle)
- Keep the sticky behavior and arrow-key roving tabindex (updated for 2 items).

### 3. Restructure the main grid

Remove the current 3-column 2xl grid. The outer container becomes a single panel whose layout depends on the active tab.

**Setup panel (Steps 1 & 2 side-by-side):**

```text
grid: 1 col on mobile, 2 cols from lg+:
  lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)]
  xl:grid-cols-[minmax(0,500px)_minmax(0,1fr)]
```

- Left column: `<StepShell number={1}>` with `<InputsPanel />` (sticky on lg+).
- Right column: `<StepShell number={2}>` with `PlatformsConsidered`, the excluded warning, and `ComparisonMatrix view="controls"`.

**Recommendation panel (Step 3, self-splitting):**

Keep the existing inner split, simplified now that it owns the whole width:

```text
grid: 1 col on narrow, 2 cols on md+:
  md:grid-cols-[minmax(0,1fr)_360px]
  xl:grid-cols-[minmax(0,1fr)_440px]
```

- Left: `<RecommendationCard />`
- Right aside: `<CostEstimate />` + `<ArchitectureDiagram />`

### 4. StepShell tweaks

- `hidden` prop now driven by `tab !== "setup"` (steps 1 & 2) or `tab !== "recommendation"` (step 3) at all breakpoints — drop the `hidden md:!block` fallback since tabs are no longer mobile-only.
- Keep numbered badges so the "3 step plan" framing is still visible inside each tab.

### 5. Full comparison matrix (below the fold)

Currently shown only when the Comparison mobile tab is active. Update its visibility so it appears under the **Setup** tab (since the matrix supports step 2).

### 6. Hero copy

Keep the "Three steps" framing — the steps are still numbered 1, 2, 3; we're just grouping 1+2 into one screen.

## Out of scope

- No changes to `InputsPanel`, `ComparisonMatrix`, `RecommendationCard`, `CostEstimate`, or `ArchitectureDiagram` internals.
- No scoring/data changes.
