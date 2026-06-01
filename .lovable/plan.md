## What I'll build

A new `/lovable` page that doubles as a remix gallery: three full-resolution screenshots of the live app and a branded "Remix in Lovable" poster, plus a clear, generic guide for forking this template into any decision-comparison tool.

## Assets (all 1920×1080)

1. **`/app` — full comparator (3 columns).** Browser screenshot at 1920×1080, top of `/app` with default preset loaded so inputs, recommendation/cost, and the architecture diagram are all visible.
2. **`/app` — full comparison matrix.** Browser screenshot at 1920×1080, scrolled to the matrix section so all 10 platforms × 12 criteria are in frame.
3. **`/methodology` — scoring explainer.** Browser screenshot at 1920×1080 capturing the rubric / weights explanation.
4. **"Remix this in Lovable" poster.** Generated illustration (16:9, 1920×1080) — on-brand cream background with the three-slab Stratum mark, the wordmark, a "Remix in Lovable" headline, and a subtle 3-step flow (Fork → Edit data → Ship). Uses palette ink `#0B0B1F`, cream `#FFF7F4`, slabs `#4D7CFF / #FF7A45 / #FF3D7F`.

All four are saved under `public/lovable/` so they're served as static files, then externalized via `lovable-assets` so the repo stays light.

## New page: `/lovable`

Route added in `src/App.tsx` above the catch-all. New file `src/pages/Lovable.tsx` reusing `SiteHeader`, `SiteFooter`, and `SeoHead`. The page also gets a nav link in `SiteHeader` and an entry in `sitemap.xml` / `llms.txt`.

Page structure:

```text
┌──────────────────────────────────────────────┐
│  Hero                                        │
│  Eyebrow: "Template"                         │
│  H1: "Remix this in Lovable"                 │
│  Sub: one-sentence pitch + primary CTA       │
│       (Open in Lovable) + secondary (GitHub) │
├──────────────────────────────────────────────┤
│  Gallery (4 images, click → full-screen)     │
│   1. Remix poster                            │
│   2. /app comparator                         │
│   3. /app matrix                             │
│   4. /methodology                            │
│   Each with a short caption.                 │
├──────────────────────────────────────────────┤
│  "How to remix" — generic 4-step guide       │
│   1. Fork the template in Lovable            │
│   2. Swap the options (ARCHITECTURES)        │
│   3. Edit the criteria + rubric scores       │
│   4. Tweak copy, brand, and ship             │
│  Each step: short paragraph + the exact      │
│  file path to edit (architectures.ts,        │
│  criteria, branding.ts, etc.).               │
├──────────────────────────────────────────────┤
│  "What you get out of the box" — bullets:    │
│   weighted scoring, presets, matrix, diagram,│
│   export, SEO, analytics, brand system       │
├──────────────────────────────────────────────┤
│  Final CTA: "Open in Lovable" button         │
└──────────────────────────────────────────────┘
```

Images use the existing `ScreenshotPlaceholder` (already supports `src` + click-to-fullscreen lightbox), so the gallery gets the lightbox UX for free.

## Technical details

- **Capturing:** `browser--navigate_to_sandbox` with `width: 1920, height: 1080` for each of the three routes; `browser--screenshot` (viewport, not full-page) to lock the 1920×1080 dimensions. Saved to `/tmp/`, then moved into `public/lovable/`.
- **Poster:** `imagegen--generate_image` with `model: "premium"` (text legibility), `width: 1920, height: 1080`, prompt grounded in the existing brand tokens from `scripts/brand-source.mjs`.
- **Asset hosting:** each PNG run through `lovable-assets create` and committed as `.asset.json` pointers under `src/assets/lovable/`, then imported in `Lovable.tsx`.
- **SEO:** `<SeoHead>` with title "Remix the Stack Architect template — Lovable", a unique meta description, and the poster as the OG image. Add `/lovable` to `public/sitemap.xml` and `public/llms.txt`.
- **Nav:** add a "Template" link to `SiteHeader` (desktop + mobile menus) pointing at `/lovable`.
- **No backend, no schema changes.** Pure frontend + static assets.

## Open question I'll just default

You didn't give a remix URL, so the "Open in Lovable" CTA will link to the project's published URL (`https://lovable-stack-architect.lovable.app`) as a placeholder. Easy one-line swap later if you want a specific remix/fork URL.
