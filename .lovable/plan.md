## Goal
Bring the site to WCAG 2.1 AA (with a few 2.2 wins where they don't add friction), without regressing usability for sighted/mouse users. The existing code already does a lot right (semantic landmarks, aria-labels on icon buttons, tab roles on mobile nav, `<html lang="en">`, shadcn primitives). The plan below closes the remaining gaps I identified by reading the code.

## Findings (grouped by severity)

### Critical
1. **No skip-to-content link.** Keyboard users have to tab through the entire header on every page.
2. **Comparison table is not screen-reader friendly.** `<table>` has no `<caption>`, `<th scope=…>` is missing on both column and row headers, and the criterion-label tooltip uses `<span className="cursor-help">` — not keyboard-focusable, so SR/keyboard users never see the hint.
3. **Architecture diagram SVG is inserted via `dangerouslySetInnerHTML` with no accessible name.** Screen readers either read raw SVG text or skip it entirely.
4. **`min-h-screen` everywhere.** On iOS Safari with the URL bar this clips primary actions; WCAG 2.1 reflow + target-size implications. Switch to `min-h-dvh`.

### Warning
5. **`--muted-foreground: 220 9% 46%`** on `--background: 0 0% 100%` is ~4.6:1 — just over AA for normal text but FAILS AA for the `text-[10px]`–`text-[11px]` muted captions used in InputsPanel, ComparisonMatrix, CostEstimate, and footer. Bump lightness down to ~38% so all sizes pass.
6. **Recommendation card has no live-region announcement** when inputs change — sighted users see the new pick update instantly, SR users hear nothing.
7. **Heading hierarchy on `/app`**: `<h1 className="sr-only">` then `<h2>` "Side-by-side comparison" and `<h2>` "Project inputs" (good), but the Recommendation aside jumps straight to `<h3>` (top arch name) with no `<h2>` above it. Promote it.
8. **NotFound** uses non-token `bg-muted` body with default `text-muted-foreground` — fine — but `min-h-screen` and no main landmark.

### Info (best-practice)
9. **Example-scenario `<Link>` cards on Landing** rely on default link focus ring; add explicit `focus-visible` ring to match Buttons.
10. **Mermaid diagrams** initialize once; we should respect `prefers-reduced-motion` for our own transitions (chip color transitions, mobile-tab drop-shadow). Add a global CSS guard.
11. **Tooltip-only content on cost-band sources popover trigger** uses a small icon button — already has `aria-label`, fine.
12. **Decorative icons** inside Buttons are already correctly hidden via `aria-hidden`/wrapped text — spot-check the SiteFooter logo and FAQ accordion (Radix handles).

## Implementation

### 1. Skip-to-content link
Add a visually-hidden-until-focused anchor at the very top of `App.tsx` (inside `BrowserRouter`, above `<Routes>`) that jumps to `#main-content`. Add `id="main-content"` to the `<main>` element in `Landing.tsx`, `Index.tsx`, `Methodology.tsx`, and wrap `NotFound.tsx` in a `<main id="main-content">`.

### 2. Comparison table semantics (`src/components/ComparisonMatrix.tsx`)
- Add `<caption className="sr-only">Architecture scores by criterion (1 = poor, 5 = excellent).</caption>`.
- Add `scope="col"` to the architecture `<th>` cells.
- Convert the first `<td>` of each row (criterion label) to `<th scope="row">`.
- Replace `<span className="cursor-help">` with a `<button type="button">` so the Radix tooltip trigger is keyboard-focusable; keep the visual treatment via styling (no underline, dotted underline on focus/hover). Bind it as the `TooltipTrigger asChild` child.
- Keep existing `aria-label` on `ScoreDot` (already announces "N out of 5").

### 3. Architecture diagram (`src/components/ArchitectureDiagram.tsx`)
- Wrap the SVG container with `role="img"` and a dynamic `aria-label` (e.g. `Architecture diagram for ${arch.name}: ${arch.tagline}`).
- Keep the visible `<h3>` heading; the role+label gives SR users a sensible single utterance instead of raw SVG node text.

### 4. `min-h-screen` → `min-h-dvh`
Replace in `Landing.tsx`, `Index.tsx`, `Methodology.tsx`, `NotFound.tsx`, and the `App.tsx` Suspense fallback. Keeps desktop identical; fixes iOS Safari and Android Chrome viewport clipping.

### 5. Muted-foreground contrast (`src/index.css`)
- Light: `--muted-foreground: 220 9% 46%` → `220 9% 38%` (≈ 6.5:1 on white — passes AA for all sizes and AAA for normal text).
- Dark: leave `215 20% 65%` (already ≈ 7:1 on the dark background — passes AAA).
- No other token changes; the visual feel stays the same — slightly more legible captions.

### 6. Live region for recommendation (`src/components/RecommendationCard.tsx`)
Add an `aria-live="polite"` `<div className="sr-only">` that announces `Recommended: ${top.arch.name} — score ${Math.round(top.score)} of 100. ${top.arch.tagline}` whenever the top pick changes. Throttle by keying off `top.arch.id + top.score`.

### 7. Heading promotion (`src/components/RecommendationCard.tsx`)
- Top card: keep small "Recommended" eyebrow; promote `<h3>` (arch name) to `<h2>`.
- Runner-ups: promote inner `<h4>` to `<h3>` to stay sequential.

### 8. NotFound (`src/pages/NotFound.tsx`)
- Wrap content in `<main id="main-content">`.
- `min-h-screen` → `min-h-dvh`.
- Keep `bg-muted` (token, fine).

### 9. Example-scenario card focus rings (`src/pages/Landing.tsx`)
Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background` to the preset `<Link>` cards.

### 10. Reduced-motion guard (`src/index.css`)
Add at the bottom:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 11. Smooth-scroll override in mobile tab nav (`src/pages/Index.tsx`)
The mobile tab click does `window.scrollTo({ top: 0, behavior: "smooth" })`. Respect `prefers-reduced-motion` by reading `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and using `"auto"` when true.

## Out of scope
- Full color-system redesign.
- Localization beyond `lang="en"`.
- Dark-mode visual polish (already AA there).
- Adding tests for a11y (could be a follow-up with `@axe-core/react` in dev mode).

## Verification
After implementation I'll:
- Re-screenshot landing + `/app` + `/methodology` to confirm visual parity.
- Tab through the page from a fresh load and confirm skip link, focus rings, and tooltip-on-focus all work.
- Spot-check contrast for `text-muted-foreground` against `bg-background` and `bg-card` with the new value.

## Open question
None — proceeding will not change content or layout, only semantics, focus behavior, and one token value.
