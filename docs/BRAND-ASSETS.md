# Brand assets

Everything in `public/` that carries the Stack Architect identity is generated
from a single source of truth: `scripts/brand-source.mjs`. To change the mark,
the palette, or the wordmark treatment, edit that file and re-run the
generator — never hand-edit the rasters.

## Regenerate

```bash
node scripts/build-brand-assets.mjs
```

Requires the `sharp` and `png-to-ico` devDependencies (already in
`package.json`). Output goes to `public/` and overwrites every file in the
table below.

## The mark — "Stratum"

Three solid horizontal slabs, stacked center, top slab nudged right to imply
"the chosen one". Bold and poster-like, designed to read at favicon size as a
distinctive silhouette and at billboard size as a confident piece of
geometry.

### Palette

| Token | Hex | Use |
|---|---|---|
| Slab 1 (bottom) | `#4D7CFF` | Bottom slab, "foundation" |
| Slab 2 (middle) | `#FF7A45` | Middle slab |
| Slab 3 (top) | `#FF3D7F` | Top slab; also the **accent** color used for `theme_color`, tile color, focused states |
| Ink | `#0B0B1F` | Type, mono mark on light backgrounds |
| Cream | `#FFF7F4` | Default light background, mono mark on dark backgrounds |

The mark is a single shape in three colors. There is no gradient — each slab
is a flat fill. This is intentional: it keeps the mark legible at every size,
prints cleanly, and stays recognizable in mono.

### Clear space

Keep at least the height of one slab (`~92px` at 512px artboard) of empty
space on all four sides of the mark. Do not place type or graphics inside
the implied bounding box.

### Mono usage

When color cannot be reproduced, use `logo-mark-mono.svg` (single ink color).
For dark backgrounds, recolor the mono mark to `#FFF7F4`. Never use a single
slab color as a mono mark — the silhouette only reads correctly with all
three slabs equal in value.

### Don't

- Don't recolor individual slabs outside this palette.
- Don't outline, stroke, or add drop shadows.
- Don't rotate or reflow the slab stack.
- Don't place the mark on a busy photographic background — give it a solid
  surface (cream, ink, or accent).

## File reference

All paths are under `public/`. The source canvas for the mark is 512×512.

### Logo system (SVG, scalable)

| File | Use |
|---|---|
| `logo-mark.svg` | Just the mark, full color. Default favicon SVG. |
| `logo-mark-mono.svg` | Just the mark, single-ink. For mono contexts. |
| `logo.svg` | Horizontal lockup (mark + "Stack Architect") on light backgrounds. |
| `logo-dark.svg` | Horizontal lockup on dark backgrounds. |
| `logo-stacked.svg` | Vertical lockup (mark over wordmark + "FOR LOVABLE") for square placements. |
| `logo-mono-light.svg` | Horizontal lockup, single-ink, for light backgrounds. |
| `logo-mono-dark.svg` | Horizontal lockup, single-cream, for dark backgrounds. |

### Favicons

| File | Size | Use |
|---|---|---|
| `favicon.ico` | 16/32/48 multi-res | Default browser tab favicon. |
| `favicon-16.png` … `favicon-512.png` | as named | Modern browsers via `<link rel="icon">`. |

### Apple

| File | Size | Use |
|---|---|---|
| `apple-touch-icon.png` | 180×180 | iOS home-screen icon. Opaque cream background. |

### Android / PWA

| File | Size | Use |
|---|---|---|
| `android-chrome-192.png` | 192×192 | Android Chrome `any` purpose icon. |
| `android-chrome-512.png` | 512×512 | Same, higher density. |
| `maskable-512.png` | 512×512 | Adaptive icon. Includes 10% safe-zone padding. |
| `site.webmanifest` | — | PWA manifest. `theme_color: #FF3D7F`, `background_color: #FFF7F4`. |

### Microsoft tiles

| File | Size | Use |
|---|---|---|
| `mstile-150.png` | 150×150 | Windows Start menu small tile. Accent background. |
| `mstile-310.png` | 310×310 | Windows Start menu large tile. |
| `browserconfig.xml` | — | TileColor `#FF3D7F`. |

### Social / OG

All 1.2× device pixel ratio, opaque cream background, mark on the left,
gradient kicker bar above the headline.

| File | Size | Use |
|---|---|---|
| `og-image.png` | 1200×630 | Default Open Graph (Slack, Facebook, generic). |
| `og-image-square.png` | 1200×1200 | Instagram, square LinkedIn placements. |
| `twitter-card.png` | 1200×675 | Twitter/X `summary_large_image` (16:9). |
| `linkedin-share.png` | 1200×627 | Explicit LinkedIn link share. |
| `facebook-share.png` | 1200×630 | Explicit Facebook link share. |

### Email

| File | Size | Use |
|---|---|---|
| `email-header.png` | 600×200 | Opaque cream PNG safe for Gmail/Outlook. No SVG — most email clients won't render SVG. |

### Splash / startup

| File | Size | Use |
|---|---|---|
| `splash-light.png` | 2048×2732 | Light-theme PWA splash. |
| `splash-dark.png` | 2048×2732 | Dark-theme PWA splash. |

Only one light/dark pair is shipped. If you need the full per-device iOS
matrix (iPhone X, 11, 12, iPad Pro variants), add the sizes to
`build-brand-assets.mjs` — each device-specific splash is a one-line
`sharp().resize(W,H)` call.

## Where these are referenced

- `index.html` — favicons, apple touch, manifest, OG, Twitter, theme-color.
- `public/site.webmanifest` — PWA icons (`favicon-192`, `favicon-512`,
  `android-chrome-*`, `maskable-512`).
- `public/browserconfig.xml` — Microsoft tiles.
- `src/components/SiteHeader.tsx` — uses `/logo-mark.svg` next to the
  wordmark.

The `lovable-brand.svg` file in `public/` is the **Lovable platform** heart
mark used in "Built with Lovable" badges and the Lovable Cloud platform row.
It is unrelated to Stack Architect's own identity and is not regenerated by
this script.
