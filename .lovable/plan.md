## Goal

Keep the Lovable-inspired look (palette, fonts, gradient) but make it unmistakable that this is a fan-made / community template — not an official Lovable product — while leaving room for a light, tasteful "I'd love to work at Lovable" note.

## Author info

- Handle: `@brettadler`
- Link: `https://lovable.dev/@brettadler`

## Positioning rules

1. Never imply authorship by Lovable. Drop phrasing like "Lovable-authored".
2. Add a clear, persistent unaffiliated disclosure.
3. Keep "Built with Lovable" and "Use this template" — those are factually true.
4. Add one small, friendly "by @brettadler — hoping to join the Lovable team" note.

## Changes

### 1. `src/lib/constants.ts`
Add:
- `AUTHOR_HANDLE = "@brettadler"`
- `AUTHOR_URL = "https://lovable.dev/@brettadler"`

### 2. `src/components/SiteHeader.tsx`
Below or beside the wordmark on desktop, add a tiny muted line: `Community template · not affiliated with Lovable`. Hidden on mobile to keep the header compact.

### 3. `src/components/SiteFooter.tsx`
Replace the single-line footer with two stacked lines:
- Existing: `Last reviewed {LAST_REVIEWED} · MIT License`
- New, muted, smaller: `An independent, community-built template by [@brettadler]({AUTHOR_URL}) — open to joining the Lovable team. Not affiliated with, endorsed by, or representing Lovable. "Lovable" and the Lovable brand belong to Lovable.`

Footer nav stays as-is.

### 4. `src/pages/Landing.tsx` — hero
- Pill badge becomes: `Community template · Inspired by Lovable · Last reviewed {LAST_REVIEWED}`.
- Add a small italic line under the subhead: `An independent project by @brettadler — not affiliated with Lovable.` (handle links to AUTHOR_URL.)

### 5. `Landing.tsx` — FAQ
- Fix the bias answer: replace "This tool is Lovable-authored, so it has a perspective" with "I built this and I'm a Lovable fan, so it has a perspective…".
- Add a new FAQ item near the top:
  - **Q:** Is this an official Lovable product?
  - **A:** No. It's an independent, community-built template by @brettadler, inspired by Lovable's design language. Not affiliated with, endorsed by, or representing Lovable. The Lovable name and brand belong to Lovable.

### 6. "Use as a template" section
Subhead becomes: `A free, MIT-licensed community template you can remix on Lovable.`

### 7. Small "About the builder" bento tile
Insert one card just above the final CTA:
- Title: `Built by @brettadler`
- Body: `Independent builder. Big fan of Lovable — open to joining the team. Say hi.`
- CTA link: `View Lovable profile →` (→ AUTHOR_URL, new tab).

Easy to delete for anyone remixing the template.

### 8. SEO
Update meta description on `/` to: `An independent, community-built comparator for picking a backend for your Lovable app. Free, MIT, remix it.`

## Out of scope

No changes to scoring, data, routing, or the `/app` tool itself. Pure copy + small header/footer + one optional tile.
