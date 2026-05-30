# Truly sticky, single-row header at every viewport

The header already has `sticky top-0` but on mobile it wraps to a second row (the pill nav is `order-3 w-full md:order-none`), so it stretches to ~110px tall and reads more like a banner than a sticky bar. On `/app` that also pushes the mobile section-tab nav (offset `top-12`) underneath the header.

Goal: one compact sticky row at every breakpoint, same height, same behavior on `/`, `/methodology`, and `/app`.

## Changes — `src/components/SiteHeader.tsx`

1. **Drop the wrap.** Remove `flex-wrap` and remove the nav's `order-3 w-full md:order-none` so the row stays single-line from 320px up.
2. **Compact logo on mobile.** Below `sm`, hide the wordmark text and show only the 32×32 mark. From `sm` up, show mark + "Lovable Stack Architect".
3. **Compact pill nav on mobile.** Keep all three items inline but tighten: `px-2 py-1 text-[11px]` below `sm`, current sizes from `sm` up. Drop the `grid grid-cols-3 w-full` mobile layout — use `flex` at every size.
4. **Compact CTA on mobile.** Keep the "Remix" / "Use this template" button but switch to icon-only below `sm` (just the `ExternalLink` icon with `sr-only` label) so the row never wraps.
5. **Lock the header height.** Set the outer row to `h-12 sm:h-14` so the sticky surface is predictable and identical across pages.

## Change — `src/pages/Index.tsx`

- Update the mobile section-tab nav's sticky offset from `sticky top-12` to `sticky top-12 sm:top-14` so it sits flush against the (now consistent-height) header at both mobile and small-desktop widths. No other changes to that nav.

## Out of scope

- No changes to nav items, page content, hero sections, or any other component.
- No changes to colors, blur, or border styling on the header — only layout/sizing.
- `ReportExport` (the extra child passed on `/app`) keeps its current sizing; on very narrow screens it will sit beside the CTA in the same row.

## Files touched

- `src/components/SiteHeader.tsx`
- `src/pages/Index.tsx` (one line, the sticky offset)
