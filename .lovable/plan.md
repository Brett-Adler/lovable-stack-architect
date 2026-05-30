# Logo redesign — Stacked heart

Replace the purple pyramid mark with a new SVG mark that reads as a heart silhouette built from three stacked architecture slabs. Borrows Lovable's pink → orange → blue gradient and rounded-heart geometry, while staying clearly distinct (heart is *constructed from stack layers*, not a flat heart-arrow). Wordmark and subtitle ("Community template · not affiliated with Lovable") stay unchanged.

## Mark concept

```text
     ░░░░     ░░░░       <- two rounded lobes (top slab, split = "edge / client")
   ████████████████      <- middle slab (api / functions)
  ██████████████████     <- bottom slab (database) — widest, tapers to a soft point
        ▼                <- bottom of heart formed by the slab taper
```

- Three horizontal rounded slabs, decreasing-then-tapering, arranged so the silhouette reads as a heart.
- Slabs are filled with the Lovable-style gradient: `#FF4D8D` (pink) → `#FF7A45` (orange) → `#4D7CFF` (blue), diagonal.
- Subtle inner highlight (white @ 12%) on the top slab for dimension.
- Tiny spark dot above the top notch — preserves the "architect / apex" cue from today's mark.
- Rounded-square container kept (matches current chrome), but background becomes soft off-white `#FFF7F4` with a 1px `#FFD9CB` ring — lets the gradient mark pop and signals "not the Lovable purple tile."

## Files to change

1. `src/assets/logo-mark.svg` — rewrite as the new stacked-heart mark (square, 512×512 viewBox, gradient defs).
2. `public/logo-mark.svg` — mirror the same SVG (used by favicon / OG references).
3. `public/logo.svg` — rewrite the horizontal lockup: new mark on the left, existing "Lovable Stack Architect" wordmark on the right, unchanged type.
4. `public/og-image.svg` — swap embedded mark to the new one (keep layout/copy).
5. `index.html` — no code change needed if it already references `/logo-mark.svg`; verify only.

No component code changes. Disclaimer subtitle stays as-is per your pick.

## Out of scope

- No favicon `.ico` regeneration (SVG favicon already covers modern browsers).
- No header layout changes, no chip, no wordmark restyle.
- No raster `brett-adler.png` or other asset touched.
