## Goal

Replace the four `<ScreenshotPlaceholder>` instances on `/` and `/methodology` with real, framed screenshots of the live `/app`.

## Shots to capture

| # | Where | Variant | Viewport | What's on screen |
|---|---|---|---|---|
| 1 | Landing, below hero | `recommendation` | 1440×900 | Full `/app` with all 3 columns visible (Inputs, Cost+Picker, Recommendation), default preset loaded, top of page |
| 2 | Landing, "What you'll see" section | `matrix` | 1600×900 | Scrolled to "Full comparison matrix" section, all enabled columns visible |
| 3 | Methodology, after the formula card | `inputs-panel` | 1000×1200 | Tight crop of just the Project Inputs panel (left column), default state |
| 4 | Methodology, after criteria grid | `matrix` | 1600×900 | Same matrix shot as #2 (can reuse, or recapture with one column hovered) |

## Approach

1. **Capture raw shots** with `browser--screenshot` at the listed viewports. For the inputs-panel crop I'll screenshot full `/app` at 1440 wide, then crop to the inputs column with `image_tools--zoom_image` before framing.
2. **Frame each shot** with the product-shot skill (`/tmp/generate.py`) using the `candy` preset (warm pink/peach to match brand magenta gradient). Save framed PNGs to `src/assets/shots/`:
   - `app-recommendation.png`
   - `app-matrix.png`
   - `app-inputs-panel.png`
3. **Extend `ScreenshotPlaceholder.tsx`** so it accepts an optional `src` prop. When `src` is provided, it renders the framed `<img>` (already has its own chrome + gradient from the product-shot output) with the caption underneath — and skips the "Placeholder" badge and dashed sketch. When `src` is absent, behavior is unchanged.
4. **Wire the images in:**
   - `src/pages/Landing.tsx` line 189 → `src={appRecommendation}`
   - `src/pages/Landing.tsx` line 449 → `src={appMatrix}`
   - `src/pages/Methodology.tsx` line 292 → `src={appInputsPanel}`
   - `src/pages/Methodology.tsx` line 336 → `src={appMatrix}` (reuse)
5. **Verify** by re-screenshotting `/` and `/methodology` at 1440 and 390 to confirm framed shots render crisp, are not clipped on mobile, and the captions still read well.

## Technical details

- Imports use ES6 image imports from `src/assets/shots/` so Vite hashes them.
- Framed PNGs already contain the mac window chrome, drop shadow, and mesh-gradient background — no extra wrapper card needed in the React component, just `<img class="mx-auto w-full max-w-5xl rounded-2xl" />` + `<figcaption>`.
- Captions stay (helpful on Landing/Methodology), but the "To capture:" hint is dropped when a real `src` is provided since it's no longer needed.
- Product-shot preset: `candy` (warm pink/peach/rose) to echo the brand magenta gradient used across the site. If it clashes with the white app shots in QA, fall back to `fog` (subtle silver) or `peach`.

## Out of scope

- No copy changes on Landing/Methodology beyond the swap.
- No new screenshots on `/app` itself.
- Mobile-specific shots — desktop shots scale down fine inside the framed PNG.
