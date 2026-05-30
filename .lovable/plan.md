# Add platform brand logos across the app

The `BRAND` map in `src/lib/branding.ts` already maps every `ArchId` to a react-icons component (Supabase, Vercel, Netlify, AWS, GCP/Google, Azure, Heroku, Render, Fly.io) plus an SVG for Lovable Cloud. Only `Methodology.LeaderChip` uses it today. The plan is to surface those marks everywhere a platform is named, at consistent sizes.

## Step 1 — Single reusable `BrandMark` component

Create `src/components/BrandMark.tsx`:
- Props: `archId`, `size?: "sm" | "md" | "lg"` (12px / 16px / 20px), `colored?: boolean` (default true), `className?`.
- Renders the `BRAND[archId].Icon` (or `<img src>` for Lovable Cloud) with `style={{ color }}` when colored, and a 1px-square fallback if missing.
- Always `aria-hidden` — the platform name accompanies it everywhere.

Refactor `Methodology.LeaderChip` to use it (drop the inline branching).

## Step 2 — ComparisonMatrix (`src/components/ComparisonMatrix.tsx`)

- **Picker chips** (line ~213): prepend `<BrandMark size="sm" archId={a.id} />` before the `{a.short}` label. Keep the `Star` for Top-4 marker — but move it to the right of the label (or replace its current slot with the brand mark, and keep the Top-4 ring + star tooltip cue). Concretely: brand mark first, then check/plus, then label, and the gold ring + tooltip keep the Top-4 affordance. Drop the inline Star inside the chip to avoid clutter.
- **Matrix column headers** (line ~296): add a `<BrandMark size="md" />` above the name row so each column is visually anchored by its logo. Keep the existing Star next to the name for Top-4.
- **Legend line** "= Top 4 picks": unchanged (Star is generic, not a brand).

## Step 3 — RecommendationCard (`src/components/RecommendationCard.tsx`)

- Top pick header (line ~63): render `<BrandMark size="lg" archId={top.arch.id} />` next to the `{top.arch.name}` h2.
- Runner-up cards (line ~141): render `<BrandMark size="md" archId={r.arch.id} />` next to the runner name.

## Step 4 — CostEstimate (`src/components/CostEstimate.tsx`)

- Card header: add a small brand mark next to the current "Cost & scaling" / stage label so the user knows which platform the headline price belongs to (the component is rendered for `topId`).
- "Compare at X scale" rows (line ~146): replace the plain text `{r.short}` with `<BrandMark size="sm" />` + `{r.short}` so each bar is identifiable at a glance.

## Step 5 — Methodology cost-band sources table

Locate the sources table on `/methodology` (the one shown in the screenshot — "Cost-band sources") and prepend a `<BrandMark size="sm" />` to each architecture cell so the logo accompanies "Lovable Cloud", "Self-host on Vercel", etc.

## Sizes / visual rules

- `sm` = 12px (inside chips, table rows)
- `md` = 16px (matrix column heads, runner-ups, methodology rows)
- `lg` = 20px (top pick h2, cost headline)
- Always colored with the brand color from `BRAND[id].color`; Lovable Cloud uses its SVG so color is intrinsic.
- No new dependencies — `react-icons` and `BRAND` already exist.

## Out of scope

- No data, scoring, or layout changes.
- No new logos beyond what `BRAND` already provides.
- No changes to `SiteHeader` / footer / landing hero.
