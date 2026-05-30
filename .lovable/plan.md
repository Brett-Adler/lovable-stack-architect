## What's wrong today

The file `public/logo-mark.svg` is actually the **Stack Architect's own logo** (the gradient heart-with-stacked-bars mark). But it's being rendered next to the word "Lovable" in several "Built with Lovable" placements, which both (a) misrepresents Lovable's real brand and (b) reads as if the app might be a Lovable product.

Current "Built with Lovable" uses of the wrong mark:

1. `src/components/SiteFooter.tsx` line 40 — "open to joining the [mark] Lovable team"
2. `src/pages/Landing.tsx` line 161 — hero "Built with [mark] Lovable" chip
3. `src/pages/Landing.tsx` line 578 — about-me card "Lovable portfolio" link
4. `src/pages/Methodology.tsx` line 223 — top-of-page "Built with [mark] Lovable" chip
5. `src/lib/branding.ts` line 8 — `lovable-cloud` architecture brand entry (this represents Lovable Cloud itself, not our app)

Meanwhile the Stack Architect mark should keep its current home:
- `SiteHeader` logo
- favicons / `og-image` / manifest
- App-identity contexts (NotFound page, ReportExport header, etc.)

## Plan

### 1. Add a real Lovable brand mark asset

Create `public/lovable-brand.svg` — the official Lovable heart logo (clean pink/red heart, no stacked-bars). Single-color heart on transparent background so it adapts to light/dark surfaces.

```text
public/
  logo-mark.svg        ← unchanged. Stack Architect's own mark.
  lovable-brand.svg    ← NEW. Official Lovable heart, used only for
                         "Built with Lovable" and Lovable Cloud brand.
```

### 2. Swap the five "Built with Lovable" / Lovable-brand spots

Replace `src="/logo-mark.svg"` with `src="/lovable-brand.svg"` in exactly these five places — nothing else changes (sizes, alt text, surrounding copy all stay):

- `src/components/SiteFooter.tsx` (footer disclaimer)
- `src/pages/Landing.tsx` line 161 (hero "Built with Lovable" chip)
- `src/pages/Landing.tsx` line 578 (about-me "Lovable portfolio" link)
- `src/pages/Methodology.tsx` line 223 ("Built with Lovable" chip)
- `src/lib/branding.ts` `lovable-cloud.src` (this entry represents Lovable Cloud's brand in the comparator/diagram/scoring UI)

Add `alt="Lovable"` (instead of the current empty alt) on the four chip placements so the brand is announced correctly — the word "Lovable" is already in the visible text alongside, so the alt won't double-read awkwardly for sighted users but does name the mark for assistive tech.

### 3. Leave the app's own identity alone

No changes to:
- `SiteHeader` logo (`/logo-mark.svg` stays — this is the app's identity)
- Favicons, manifest, OG image
- `NotFound`, `ReportExport`, `ComparisonMatrix` Stack Architect mark usages

### Out of scope

- No new "Built with Lovable" placements added.
- No copy changes ("Built with Lovable", "Lovable team", "Lovable portfolio", etc. stay verbatim).
- No layout / sizing changes to the chips themselves.
- No changes to other architecture brand entries in `branding.ts`.

## One question before I build

Asset source for the Lovable heart — pick one:

- **A.** I generate a clean inline SVG heart in Lovable's pink (≈ `#FF4D8D` → `#FF7A45` gradient already in your tokens) and ship it as `public/lovable-brand.svg`. Fast, no external dependency, close-enough to Lovable's brand without copying their exact file.
- **B.** You drop the official `lovable-brand.svg` (downloaded from lovable.dev's brand assets) into `public/` yourself, and I just wire the five swaps.

If you don't reply, I'll go with **A**.
