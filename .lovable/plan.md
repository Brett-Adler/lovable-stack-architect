## Goal

Add lightweight placeholder "screenshot frames" to **Landing** and **Methodology** so the page composition reads correctly today, while clearly signaling — to both you and future-me — exactly which `/app` screenshots to capture once the tool design is locked.

No real images are added. Everything is rendered with divs so it stays in-sync with the design system and never ships a broken/missing asset.

## New component

### `src/components/ScreenshotPlaceholder.tsx`

A reusable browser-chrome frame, semantic-token styled, with:

- macOS-style title bar (3 dots + faux URL pill like `stack-architect.app/app?preset=…`).
- Dashed inner canvas (`border-dashed border-border bg-muted/30`) tagged with a small "Placeholder" badge (top-right) so it's obvious this is not real UI.
- A **low-fi sketch** of the target screen built from plain divs — no real data, just shapes that suggest layout (header bar, sidebar, cards, mini-grid rows).
- A **caption block** below the frame: variant title + a "What to capture" hint (1 sentence) + suggested viewport size.

Props:

```ts
type Variant =
  | "recommendation"   // 3-col app: inputs | cost+recommendation | diagram
  | "matrix"           // full-width comparison matrix
  | "inputs-panel"     // close-up of the project-inputs panel
  | "report-export"    // summary modal / PDF preview
  | "diagram";         // architecture diagram close-up

interface Props {
  variant: Variant;
  caption?: string;        // override default caption
  hint?: string;           // override default "what to capture" hint
  aspect?: "video" | "wide" | "square"; // default per variant
  url?: string;            // faux URL in the title bar
}
```

Each variant ships with sensible defaults (caption, hint, aspect, url) so callers usually only pass `variant`.

### Sketch styles per variant (all div-only)

- **recommendation** — 16:10. Three columns: thin left rail (8 stacked pill rows), wide middle (big card + smaller card with 4-cell mini grid), right (rounded diagram blob with 3 nodes + lines).
- **matrix** — 16:9. Header row of 6 narrow pills, then 12 rows × 6 cells with one column shaded as "top pick".
- **inputs-panel** — 4:3. Sidebar style: 6 grouped sections, each with label bar + chip row + slider track.
- **report-export** — 3:4 (portrait, modal-ish). Top header band, big numeric stat, bullet rows, footer button row.
- **diagram** — 16:9. Two-tier node graph (3 top nodes, 2 bottom nodes, dashed connectors).

## Page integrations

### `src/pages/Landing.tsx`

Two placements, both within existing rhythm (`mx-auto max-w-6xl ... py-12 sm:py-16`):

1. **Right after the hero `</section>` (line ~135), before the bento grid** — `variant="recommendation"`, slightly negative top margin so it overlaps the hero glow:
   - Caption: "The tool, at a glance"
   - Hint: "Wide-shot of `/app` with the 3-column layout: inputs left, recommendation + cost middle, architecture diagram right."

2. **New "See every option side-by-side" section after the Platforms section (after line ~292), before the "Use as a template" CTA** — `variant="matrix"`:
   - Caption: "Full comparison matrix"
   - Hint: "Scroll `/app` to the full-width matrix, hide chrome, capture at 1600 wide so all 10 columns are visible."

### `src/pages/Methodology.tsx`

Two placements anchored to existing numbered sections:

1. **Inside Section 2 (the rubric / criteria area)** — `variant="matrix"`:
   - Caption: "How the rubric renders in the app"
   - Hint: "Capture the matrix with the Lovable Cloud column highlighted; rubric tooltip open on one cell."

2. **Inside the section that explains how user inputs reweight criteria** (Section 3-ish, scoring formula) — `variant="inputs-panel"`:
   - Caption: "The inputs that move the score"
   - Hint: "Close-up of the inputs panel with sliders + chip groups visible; one preset loaded."

## Screenshot capture suggestions (for later, not built now)

Documented in the plan + echoed inline as `hint` props on each placeholder, so the list lives in the UI too:

1. **`/app` overview** — viewport 1440×900, default preset, all 3 columns visible.
2. **Full comparison matrix** — 1600×900, scrolled to matrix section, top-pick column highlighted.
3. **Inputs panel close-up** — 700×900 crop, one preset loaded, sliders mid-range.
4. **Recommendation card** — 800×600 crop on the top-pick card with rationale bullets visible.
5. **Cost & scaling** — 800×600 crop with the per-stage grid + the new compare-bars visible.
6. **Architecture diagram** — 900×600 crop of the diagram.
7. **Summary modal / PDF preview** — modal open, captured at 1440×900.

These are listed once in the plan; the page-level `hint` props serve as the in-code reminders.

## Files touched

- **new** `src/components/ScreenshotPlaceholder.tsx`
- **edit** `src/pages/Landing.tsx` — import + 2 placements
- **edit** `src/pages/Methodology.tsx` — import + 2 placements

No data, scoring, or routing changes.
