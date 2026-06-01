## What I found

- The live header is using `public/logo-mark.svg`, which is the correct three-bar logo.
- The SVG source files in `public/` and `scripts/brand-source.mjs` are correct.
- The raster/app icon files in `public/` are stale and still show the old purple document icon from earlier branding.
- The old heart logo is still visible in `src/assets/logo-mark.svg` in your screenshots and should be removed if it still exists in the current workspace.
- `public/lovable-brand.svg` is a separate Lovable platform badge used in “Built with Lovable” UI, not the app logo; I would leave it unless you want those badges removed too.

## Plan

1. **Make `scripts/brand-source.mjs` the single source of truth**
   - Keep the three-bar mark geometry/color there as the canonical logo.
   - Ensure generated outputs all come from that file.

2. **Regenerate every public brand asset from the correct logo**
   - Re-run the existing brand builder to overwrite:
     - `favicon-16/32/48/64/96/192/512.png`
     - `favicon.ico`
     - `apple-touch-icon.png`
     - `android-chrome-192/512.png`
     - `maskable-512.png`
     - `mstile-150/310.png`
     - `og-image*.png`, `twitter-card.png`, `linkedin-share.png`, `facebook-share.png`
     - `email-header.png`, splash images, and logo SVG variants

3. **Delete old/orphan logo files**
   - Remove any lingering old heart/logo source such as `src/assets/logo-mark.svg` if present.
   - Keep only the intentional public logo set generated from the three-bar mark.

4. **Verify all references point to the right files**
   - Check `index.html`, `site.webmanifest`, `browserconfig.xml`, `SiteHeader`, and app pages.
   - Confirm nothing imports or references the old heart, purple document, or unused logo asset.

5. **Visual spot-check the generated outputs**
   - Inspect key outputs after regeneration: `favicon-512.png`, `android-chrome-512.png`, `apple-touch-icon.png`, `maskable-512.png`, and `og-image.png`.
   - Confirm they show the three-bar logo matching the header.

6. **Update docs if needed**
   - If `docs/BRAND-ASSETS.md` or `TEMPLATE-SETUP.md` references outdated assumptions, align wording with the three-bar source-of-truth workflow.