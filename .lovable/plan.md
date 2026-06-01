## What I found

Good news: the **active logo system already matches** the Stratum mark in your screenshots (pink/orange/blue slabs, top slab nudged right). The source of truth lives in `scripts/brand-source.mjs` and is rendered into every favicon, OG image, splash, tile, and lockup in `public/` by `scripts/build-brand-assets.mjs`.

The only mismatch is one **orphaned old file**:

- `src/assets/logo-mark.svg` — the *previous* heart-shaped mark with gradient bands. **Not imported anywhere** (verified via grep). It's a leftover from an earlier iteration.

All live references already point at the new mark:
- `index.html` → `/logo-mark.svg` (the new Stratum SVG in `public/`)
- `src/components/SiteHeader.tsx` → `/logo-mark.svg`
- All PWA/social/tile rasters in `public/` were regenerated earlier from `brand-source.mjs`

## Plan

1. **Delete** `src/assets/logo-mark.svg` (the orphan old heart mark).
2. **Re-run the brand asset generator** to guarantee every raster in `public/` is freshly rendered from the current `brand-source.mjs` (favicons, apple-touch, android-chrome, maskable, mstile, og-image, og-image-square, twitter-card, linkedin-share, facebook-share, email-header, splash-light, splash-dark, favicon.ico).
   ```bash
   node scripts/build-brand-assets.mjs
   ```
3. **Spot-check** a few outputs (favicon-512, og-image, apple-touch-icon, maskable-512) to confirm they show the three-slab Stratum mark.
4. **Verify** no other file references the old heart mark, the previous wordmark, or the `lovable-brand.svg` heart (which is the *Lovable platform* mark used in "Built with Lovable" badges — that one stays, it's not ours).
5. Report which files changed and confirm the manifest/`browserconfig.xml`/`index.html` theme colors still match (`#FF3D7F`).

## Technical notes

- `public/lovable-brand.svg` is the **Lovable platform heart**, used by the BrandMark component for the `lovable-cloud` row in the comparison matrix. It is intentionally not part of the Stratum identity and will be left alone.
- `public/placeholder.svg` is shadcn boilerplate, also untouched.
- No source code (`src/components/*`, `src/pages/*`) needs editing — the references are already correct.

Net result: one deleted orphan file, plus regenerated rasters if any drifted. No visual change to the live site if the rasters were already current; this is a cleanup + safety pass.