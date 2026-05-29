## Goals

1. Bring **Cost & scaling** higher up in the recommendation column so it's visible without scrolling.
2. Add an at-a-glance **cost comparison across all enabled options** so users can quickly see how the top pick stacks up against alternatives on price.

## Changes

### 1. `src/pages/Index.tsx` — reorder the right column

Move `<CostEstimate>` above `<RecommendationCard>` in the right `<aside>`:

```text
Before                      After
─────────────────           ─────────────────
RecommendationCard          CostEstimate   ← moved up
CostEstimate                RecommendationCard
disclaimer text             disclaimer text
```

This puts the most-asked question ("what will it cost me?") at the top of the column, with the full recommendation reasoning below it.

### 2. `src/components/CostEstimate.tsx` — add "Compare across options"

Extend the existing card with a new section below the per-stage band grid:

- New prop: `enabled: ArchId[]` (list of architectures currently selected for comparison) and `topId?: ArchId` to highlight the top pick.
- Renders a compact list, one row per enabled arch, sorted ascending by cost midpoint at the current stage:
  - Arch short name (left)
  - Cost band string (right, mono)
  - Mini horizontal bar showing relative cost vs. the most expensive in the set
  - Top pick gets a small "Top" badge and a primary-tinted bar
- Section header: "Compare at {Stage} scale"
- Parses the existing string bands (e.g. `"$80–250"`, `"$1.5k"`, `"$0"`) into a numeric midpoint with a small helper inside the component. No changes to the underlying data model.

### 3. `src/pages/Index.tsx` — pass the new props

`<CostEstimate archId={topId} inputs={inputs} enabled={enabled} topId={topId} />`

## Technical notes

- The comparison list uses the *same* cost band strings already in `architectures.ts` — no new data to maintain.
- Midpoint parsing handles `$0`, `$80–250`, `$1.5k`, `$300–1.5k`, `$2k+`. Unparseable rows fall back to sort-last and render the raw band string with no bar.
- All styling uses existing semantic tokens (`bg-muted`, `bg-primary/20`, `border-border`, `text-muted-foreground`).
- No business-logic or scoring changes.

## Files touched

- `src/components/CostEstimate.tsx` — new comparison section + 2 new props.
- `src/pages/Index.tsx` — reorder right column, pass `enabled`/`topId` to CostEstimate.
