## Goal

Make the brands the tool covers visually recognizable, add the Lovable mark to that group, and tighten the "fan project, not affiliated" framing so it's clear without being heavy-handed.

## 1. Real brand marks on the "Platforms covered" cards

Use `react-icons/si` (Simple Icons) — official brand SVGs, tree-shaken, no network/CDN.

Add a `brand` map in `src/pages/Landing.tsx` keyed by architecture id:

```ts
import { SiSupabase, SiVercel, SiNetlify, SiAmazon, SiGooglecloud,
         SiHeroku, SiRender, SiFlydotio } from "react-icons/si";
import { VscAzure } from "react-icons/vsc"; // Azure mark
import logoMark from "/logo-mark.svg";

const BRAND: Record<ArchId, { Icon?: IconType; src?: string; color: string }> = {
  "lovable-cloud":    { src: logoMark,            color: "#FF4D8D" }, // Lovable
  "lovable-supabase": { Icon: SiSupabase,         color: "#3ECF8E" },
  "lovable-vercel":   { Icon: SiVercel,           color: "#000000" },
  "lovable-netlify":  { Icon: SiNetlify,          color: "#00C7B7" },
  "lovable-aws":      { Icon: SiAmazon,           color: "#FF9900" },
  "lovable-gcp":      { Icon: SiGooglecloud,      color: "#4285F4" },
  "lovable-azure":    { Icon: VscAzure,           color: "#0078D4" },
  "lovable-heroku":   { Icon: SiHeroku,           color: "#430098" },
  "lovable-render":   { Icon: SiRender,           color: "#46E3B7" },
  "lovable-fly":      { Icon: SiFlydotio,         color: "#7B3FE4" },
};
```

Card redesign — single rounded card, brand mark top-centered in a soft tinted tile, name + tagline below:

```tsx
<div className="rounded-2xl border border-border bg-card p-5 text-center shadow-card hover:-translate-y-0.5 hover:shadow-elegant">
  <div
    className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl"
    style={{ backgroundColor: `${BRAND[a.id].color}14`, color: BRAND[a.id].color }}
  >
    {BRAND[a.id].src
      ? <img src={BRAND[a.id].src} alt="" className="h-7 w-7" />
      : <Icon className="h-6 w-6" />}
  </div>
  <div className="text-sm font-semibold">{a.short}</div>
  <div className="mt-1 text-xs text-muted-foreground">{a.tagline}</div>
</div>
```

Notes:
- Brand colors live in a per-card inline style (one-off, brand-true) — this is the documented exception to "no raw colors in components" since semantic tokens cannot represent third-party brand identity.
- `react-icons` is already a common, lightweight dep (only the imported icons ship). Will add via `bun add react-icons`.
- Add a small attribution line under the grid: *"Logos are trademarks of their respective owners. Shown for identification only — this site is not affiliated with any of them."*

## 2. Lovable mark elsewhere it already makes sense

Light touches only — no logo soup:

- **Hero**: tiny "Built with [Lovable logo] Lovable" chip under the existing italic byline, linking to `lovable.dev`. Uses the same `logo-mark.svg`.
- **Footer**: replace the plain text "Lovable" mentions with the mark + wordmark inline (`logo-mark.svg` + "Lovable") where it currently says "Big fan of Lovable".
- **No** logos on the Methodology page or comparator — keep those neutral.

## 3. Sharpen the "fan project" voice

Without overstating: one stronger sentence in the hero and a refresh of the founder note.

- **Hero italic line** (currently: *"An independent project by @brettadler on lovable.dev — not affiliated with Lovable."*) →
  *"A fan project by [@brettadler] on lovable.dev. Not a Lovable product, not affiliated with any platform listed below — just a Lovable nerd who kept getting asked which backend to pick and finally built the answer."*

- **"About the builder" block** (line ~522): expand the one-liner to:
  *"Independent builder and Lovable superfan. Built this because friends kept asking which backend to use with Lovable and I didn't know enough to answer well. Figured other Lovable fans might want the same shortcut. Open to joining the Lovable team — say hi."*

- Keep existing FAQ answer and footer disclaimer as-is (they already cover the legal beat).

## Out of scope

- No changes to the comparator/matrix page, methodology page, or scoring logic.
- No new pages or data fields on `ARCHITECTURES`.
- Not adding logos to every mention of every brand across the app — only the "Platforms covered" grid + Lovable in hero/footer.

## Technical bits

- New dep: `react-icons` (~no runtime cost beyond imported icons).
- Files touched: `src/pages/Landing.tsx` (platforms grid, hero copy, builder block), `src/components/SiteFooter.tsx` (inline Lovable mark).
- The `logo-mark.svg` already exists in `public/`.
