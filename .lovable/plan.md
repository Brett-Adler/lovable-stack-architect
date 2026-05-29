# Align /methodology with the Landing + App visual language

## Problem

`/methodology` works, but it doesn't share the visual vocabulary used on `/` (Landing) and `/app` (Index):

- Hero is left-aligned with a plain `<h1>` — Landing uses a centered hero with a pill "chip" badge, centered headline, and centered lede.
- Section pattern is "one big numbered card containing everything". Landing uses a lighter rhythm: centered section title + subtitle, then a grid/panel of smaller white cards with `shadow-card`.
- Numbered badges use a soft `bg-primary/10` chip. Landing's "How it works" uses solid filled circles (`bg-primary text-primary-foreground`).
- Criteria render as a two-column `<dl>` of plain text — Landing-style feature grids are cards with icon tiles.
- Biases list is mostly plain bordered rows — Landing prefers white cards with shadow.
- Final CTA uses a flat gradient block — Landing uses the gradient-border + inner white-card pattern from the "Use as a template" section.

## Goal

Rewrite `src/pages/Methodology.tsx` so it reads as the same product as Landing and App. Same hero shape, same section rhythm, same card/chip/numbered-badge styling, same gradient CTA pattern. No copy changes, no data changes, no routing changes.

## Approach (single file: `src/pages/Methodology.tsx`)

### 1. Hero — match Landing

Replace the left-aligned header with Landing's centered hero pattern:

- `max-w-3xl` centered block
- Pill chip: `inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground` with a small `Sparkles`/`Info` icon and "Methodology · Last reviewed {LAST_REVIEWED}"
- `h1` `text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight`
- Centered `p.text-muted-foreground` lede
- "Back home" link styled as a small ghost link above or below — keep it but center it and keep the focus-visible ring

Bump page container to `max-w-6xl` so sections breathe like Landing.

### 2. Section rhythm — adopt Landing's pattern

Each section becomes:

```
<section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
  <div className="mb-8 text-center">
    <div className="inline-flex h-8 w-8 ... bg-primary text-primary-foreground">{n}</div>
    <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-foreground">{title}</h2>
    <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
  </div>
  {/* grid / panel content */}
</section>
```

Numbered badge moves to a solid filled circle (Landing's "How it works" style) above the title. Drop the one-giant-card-per-section wrapper.

### 3. Section 1 — "How the score is computed"

- Centered intro paragraph (the prose currently in section 1 body)
- Below it, the formula callout becomes a single centered white card: `rounded-2xl border border-border bg-card shadow-card p-6 sm:p-8` with the existing "THE FORMULA" eyebrow + body. Keep the inline `<code>` chips.

### 4. Section 2 — "Criteria"

Convert the `<dl>` into a 3-column grid of feature cards matching Landing's feature cards:

- `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`
- Each card: `rounded-2xl border border-border bg-card p-6 shadow-card`
- Inside: a small monospace index badge (e.g. `01`…`12`) in a `bg-primary/10 text-primary` tile, then `h3` label, then `p.text-sm.text-muted-foreground` hint. Mirrors the icon-tile + title + body shape of Landing's "Side-by-side scoring" cards.

### 5. Section 3 — "Cost-band sources"

Keep the table semantics (caption, `scope="col"`/`scope="row"`, links) — wrap in a single Landing-style white card panel:

- Outer: `rounded-2xl border border-border bg-card shadow-card overflow-hidden`
- Intro paragraph centered above the panel (in the section header subtitle slot)
- Inner table: drop the nested border wrapper; let the panel be the frame

### 6. Section 4 — "Known biases & caveats"

Grid of cards like Landing's "How it works":

- `grid gap-4 sm:grid-cols-2`
- Each bias = `rounded-2xl border border-border bg-card p-6 shadow-card`
- The `Lovable-authored` accent item keeps `border-warning/30 bg-warning/10` (no shadow) and the `AlertTriangle` icon, but now lives inline in the same grid so it visually anchors the set.

### 7. Section 5 — "Make it your own"

Replace the flat gradient block with Landing's gradient-border + inner white card pattern (lifted verbatim from Landing's "Use as a template" section):

```
<div className="rounded-3xl border border-primary/30 bg-gradient-primary p-[1px] shadow-elegant">
  <div className="rounded-[calc(1.5rem-1px)] bg-card p-8 sm:p-12">
    {/* eyebrow, h2, lede, file chips, primary + outline buttons */}
  </div>
</div>
```

- Eyebrow: "For builders" in uppercase primary
- Buttons: primary "Remix on Lovable" (ExternalLink) + outline "Open the tool" linking to `/app` — matches Landing's pair
- File chips: `src/data/architectures.ts`, `src/lib/scoring.ts` in `rounded-xl border border-border bg-muted/40 p-3 font-mono text-xs text-primary` (Landing's TEMPLATE_BULLETS card style, simplified)

### 8. Misc

- Wrap the whole page in `<div className="min-h-dvh bg-gradient-subtle">` (already there) — unchanged.
- Keep `SiteHeader`, `SiteFooter`, `SeoHead`, `main#main-content`, the "skip to main content" target, and all existing aria/scope/sr-only/focus-visible attributes.
- Keep `LAST_REVIEWED`, `LOVABLE_REMIX_URL`, `CRITERIA`, `ARCHITECTURES`, and the `BIASES` array exactly as they are.

## Scope

- Only `src/pages/Methodology.tsx` is touched.
- No new components, no token changes, no copy edits, no data edits.
- Accessibility posture is preserved (headings still h1 → h2 → h3, table semantics intact, focus rings intact, reduced-motion still respected via existing global CSS).

## Verification

- Open `/methodology` in the preview and confirm the hero, section headers, cards, table panel, and CTA visually mirror `/`.
- Tab through to confirm focus rings still appear on the back link, source links, and CTA buttons.
- Confirm the bias accent card still uses warning colors and the icon.
