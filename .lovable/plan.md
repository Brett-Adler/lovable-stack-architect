## Goal

Restructure `/app` so it visibly reads as a 3-step process:

1. **Step 1 — Tell us about your project** (Inputs)
2. **Step 2 — Choose what to compare** (Platform picker + compare-controls)
3. **Step 3 — Your recommendation** (Pick card + Cost & Scaling + diagram)

Today these all exist, but they're scattered: the platform picker sits above the columns in its own band, the inputs/compare/recommendation columns sit in a 3-col grid with no step framing, and the "Pick what to compare" card lives further down inside the comparison panel. Nothing signals "these are sequential steps."

## What I'll change in `/app`

### A. Replace the 3-column grid with 3 stacked step sections (desktop + mobile)

Each step gets a consistent shell:

```text
┌─ STEP 1 ─────────────────────────────────────────────────────┐
│  ① Tell us about your project                                │
│  Short subhead explaining why we're asking                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ InputsPanel (full width, 2-col internal on desktop)    │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

┌─ STEP 2 ─────────────────────────────────────────────────────┐
│  ② Choose what to compare                                    │
│  Subhead: which platforms to weigh against each other        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ PlatformsConsidered (Considering N of 11 + chips)      │  │
│  │ Compliance-exclusion warning (kept here)               │  │
│  │ "Pick what to compare" controls from ComparisonMatrix  │  │
│  │   (Compare all / Top 4 / Clear + heads-up note)        │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

┌─ STEP 3 ─────────────────────────────────────────────────────┐
│  ③ Your recommendation                                       │
│  Subhead: based on your inputs and selected platforms        │
│  ┌──────────────────────────────┐  ┌────────────────────┐    │
│  │ RecommendationCard           │  │ CostEstimate       │    │
│  │ (top pick + runners + reason)│  │ ($ band, stages,   │    │
│  └──────────────────────────────┘  │  mini bar chart)   │    │
│  ┌────────────────────────────────────────────────────┐ ▼    │
│  │ ArchitectureDiagram (top pick)                     │      │
│  └────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────┘

Below: Full comparison matrix (kept, framed as supporting evidence — not a step)
```

Each step shell uses:
- A small numbered chip (`①` / `②` / `③`) next to a step title.
- A one-line subhead.
- Soft divider between steps so they read as a vertical flow.

On mobile we keep the existing 3-tab pill nav, but relabel and reorder it to mirror the steps:
- `1. Inputs` → `2. Compare` → `3. Pick`

(Today it's `Inputs / Pick / Compare` — the order changes to match the steps. Per earlier discussion the desktop already shows the recommendation prominently in step 3, so burying it isn't an issue here.)

### B. Move the "Pick what to compare" controls into Step 2

Currently `ComparisonMatrix view="controls"` (the Compare all / Top 4 / Clear card + heads-up text) lives in the comparison panel of the 3-col grid. Move that block into Step 2's shell, right under `PlatformsConsidered`. They're the same job ("choose what to compare"), and consolidating eliminates the duplicate platform-picker UX.

The full matrix (`view="matrix"`) stays where it is below all three steps as a reference table — it's evidence, not a step.

### C. Tighten the hero

The hero band currently eats a full screen before any tool shows. Keep one tight line + sub-copy, drop the "Stack comparator" chip (the nav already shows "Comparator"). This keeps the 3 steps visible higher on the page.

### D. Small copy + structure cleanups

- Replace the bare "Considering 4 of 11 platforms" header inside the picker with the step framing (the chip + title above). The picker itself keeps its chips and Top picks / All / Clear / Show N / Reset controls.
- Step 3 keeps the existing fine-print disclaimer ("All options shown assume Lovable handles…") under the diagram.
- The compliance-exclusion warning stays inside Step 2 (next to the picker) where it's actionable.

### E. PDF export

After the on-screen changes land, update `ReportExport.tsx` so the exported PDF mirrors the same 3-step narrative:
1. **Project inputs** — summary of stage, team, budget, workloads, compliance.
2. **Platforms considered** — list of compared platforms + any compliance exclusions.
3. **Recommendation** — top pick, rationale, cost band, runners-up, diagram, then full matrix as appendix.

Section headers in the PDF get the same `① / ② / ③` chips for visual consistency with the web app.

## Out of scope

- No scoring/data changes.
- No changes to `/methodology` or `/` (Landing).
- No restructuring of inputs themselves (stage, team, budget, etc.) — just the page-level framing.
- I'll leave the architecture diagram inside Step 3 (not its own step).

## Files to touch

- `src/pages/Index.tsx` — main restructure into 3 step sections; relabel/reorder mobile tabs; tighten hero.
- `src/components/PlatformsConsidered.tsx` — minor: remove the redundant "Considering N of 11" header label if the step shell already says it (or keep, TBD during build).
- `src/components/ComparisonMatrix.tsx` — no logic change; just the consumer moves the `view="controls"` instance into Step 2.
- `src/components/ReportExport.tsx` — re-section the PDF into the same 3 steps.

## Technical notes

- Step shell is a small local component (or inline wrapper) with: `<section aria-labelledby>` + numbered chip + h2 + p + slot. No new dependencies.
- Mobile tabs continue to map 1:1 to the three step sections via the existing `panel-*` ids; just rename `Pick` → step 3 and reorder.
- The full matrix below the steps keeps its own `<section>` and heading ("Full comparison matrix") so it's clearly supplemental.
