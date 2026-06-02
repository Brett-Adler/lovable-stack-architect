## Goal

On widescreen, the three columns (Project Inputs / Cost & Scaling / Recommended) should top-align. Today the "X platforms removed by your filter" alert lives inside the Recommended column and pushes the Recommended card down. Move that information to a full-width "Platforms being considered" strip above the three-column grid.

## Changes

**1. Remove the in-column alert** — `src/components/RecommendationCard.tsx`
Delete the `userExcluded.length > 0` block (lines 89–98). The Recommended card now starts at th yeahe very top of its column, matching Inputs and Cost & Scaling.

**2. New `PlatformsConsidered` strip** — `src/components/PlatformsConsidered.tsx` (new)
A compact, full-width card rendered above the grid on `/app`:

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Considering 8 of 12 platforms                                Reset ↺ │
│ [⚡Cloud ×] [⚡Supabase ×] [▲Vercel ×] [Heroku ×] [Render ×] …       │
│ Excluded: Netlify · Azure · Fly.io · Cloudflare        + Add back ▾  │
└──────────────────────────────────────────────────────────────────────┘
```

- Active platforms render as small chips with a brand mark and an `×` to quickly remove (reuses existing `toggleArch`).
- Excluded list is a muted footer row; clicking a name (or the "Add back" menu) re-enables it.
- "Reset" returns to `DEFAULT_ENABLED`.
- On mobile the strip stays visible above the tab nav.
- All actions are keyboard accessible with proper `aria-label`s ("Remove Vercel from comparison", "Add Netlify back to comparison").

**3. Wire it into `/app**` — `src/pages/Index.tsx`
Render `<PlatformsConsidered enabled={enabled} onToggle={toggleArch} onReset={() => setEnabled(DEFAULT_ENABLED)} />` inside `<main>` immediately before the three-column grid. Sits below the hero and the mobile tab nav so it applies to every viewport.

**4. Empty-state guardrail**
If `enabled.length === 0`, the strip shows "No platforms selected — Reset to compare all 12" and the Recommended card's existing empty state already handles the rest.

## Out of scope

- No changes to scoring, rubric, or rankings.
- No changes to the PDF/markdown export (the "Excluded by you" section there is already covered separately).
- No restyling of the three column cards beyond removing the in-column banner.

## Open question

Two equivalent placements for the strip — which do you prefer?

1. **Inside `<main>`, above the grid** (recommended) — scrolls with content, always near the cards.
2. **Sticky just under the site header** — always visible while scrolling the matrix.

I'll go with option 1 unless you say otherwise.