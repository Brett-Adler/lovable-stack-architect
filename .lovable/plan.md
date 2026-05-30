# Tighten the /app header & hero

The header itself is reasonable; the bulk of the wasted space comes from the hero band on `/app` (large top padding, big heading, glow blob pushing height). Trim both the sticky header and the hero so the main content (Inputs / Cost / Recommended) sits much closer to the top.

## Changes

1. **`src/components/SiteHeader.tsx`**
   - Reduce vertical padding: `py-3 sm:py-4` → `py-2 sm:py-2.5`.
   - Shrink logo: `h-9 w-9` → `h-8 w-8` (and matching `width`/`height` props).
   - Title size: `text-base sm:text-lg` → `text-sm sm:text-base`.
   - Hide the "Community template · not affiliated with Lovable" sub‑line on desktop too — move it to `hidden` and instead surface the disclaimer in the footer only (it already lives there). This reclaims a full line of header height while keeping the disclaimer visible on the page.

2. **`src/pages/Index.tsx` (hero section, lines ~131‑152)**
   - Section padding: `pt-8 sm:pt-12` → `pt-4 sm:pt-6`, add `pb-2 sm:pb-4`.
   - Glow blob: shrink `h-[420px]` → `h-[260px]` and move `top-[-30%]` → `top-[-50%]` so it doesn't add visible vertical bulk.
   - Pill chip: `mb-5` → `mb-3`.
   - Heading: `text-3xl sm:text-4xl md:text-5xl` → `text-2xl sm:text-3xl md:text-4xl`, keep gradient on "right pick".
   - Subcopy: `mt-3` → `mt-2`, `text-sm sm:text-base` → `text-xs sm:text-sm`.

3. **Main content top spacing**
   - The grid below the hero currently inherits its own `pt-*`. After the hero shrink, verify the first content row sits ~16–24px below the subcopy; if it still feels loose, drop one step of top padding on the main grid container.

## Out of scope

- No copy changes (all text stays exactly as-is, including the disclaimer — it just moves out of the header on desktop and remains in the footer).
- No color, font, or logo changes.
- Landing page hero is not touched (this is only the `/app` route the screenshot shows). If you'd like the Landing hero tightened too, say the word and I'll mirror these reductions there.
