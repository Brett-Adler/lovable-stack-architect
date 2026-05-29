# Improve landing page card readability

## Problem

On `/` (Landing), the page uses a soft `bg-gradient-subtle` background, and cards use the `bg-card` token, which in this theme renders very close to the page background. The result is the low-contrast "barely visible cards" you flagged in the screenshot — borders are doing all the work, and the body copy sits on a tinted surface.

## Goal

Give every card on the landing page a near-white (not harsh pure-white) surface so cards visually pop off the gradient and body text easily exceeds WCAG 2.1 AA contrast (≥4.5:1 for body, ≥3:1 for large text and UI).

## Approach

Introduce a dedicated "elevated surface" design token rather than hardcoding `bg-white` in components — this keeps the design-system rules intact and lets us tune light/dark globally.

### 1. New token in `src/index.css`

Add to `:root`:
- `--surface-elevated: 0 0% 100%;` (pure white in light mode — paired with `--foreground` at near-black, this is ~20:1 contrast, well above AA)
- Optionally `--surface-elevated: 220 20% 99%;` if you prefer a faintly cool off-white. Either passes AA easily.

Add to `.dark`:
- `--surface-elevated: 222 18% 11%;` (slightly lifted vs page bg so cards still read as elevated in dark mode)

### 2. Expose in `tailwind.config.ts`

Register `surface-elevated` under `theme.extend.colors` so `bg-surface-elevated` works as a Tailwind class.

### 3. Swap card surfaces in `src/pages/Landing.tsx`

Replace `bg-card` → `bg-surface-elevated` on the landing-only card surfaces:
- Feature cards (Side-by-side / Live recommendation / Share & export) — line ~103
- "What's Lovable Cloud?" panel — line ~118
- Preset scenario cards — line ~151 (also update the `hover:bg-card/80` to `hover:bg-surface-elevated`)
- "How it works" step cards — line ~176
- "Platforms covered" tiles — line ~195
- "Remix on Lovable" inner panel — line ~206 (the inner `bg-card`)
- File-reference chips inside that panel — line ~232 (swap `bg-background/50` to `bg-surface-elevated`)

Also bump border opacity on the feature cards from `border-border/60` to `border-border` so the edge stays defined against white.

### 4. Scope

- Only `src/pages/Landing.tsx`, `src/index.css`, and `tailwind.config.ts`.
- The shadcn `Card` primitive and other pages (Index, Methodology) are untouched — they keep using `bg-card`.
- No copy, layout, spacing, or component-structure changes.

## Verification

- Open `/` in the preview and confirm all six card groups read as crisp white panels on the soft gradient.
- Spot-check contrast: `--foreground` (near-black) on white = ~20:1, `--muted-foreground` (already darkened to 38% L earlier) on white ≈ 7:1 — both clear AA and AAA for body text.
- Re-check dark mode looks right; cards should sit slightly above the page background, not blend in.
