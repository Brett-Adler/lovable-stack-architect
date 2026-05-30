# Give the 12 Criteria real visual signal

Right now every criterion card looks identical — icon, title, one-liner. The section explains what's being scored but shows none of the scoring. Each card can carry the actual rubric data for that criterion, turning the section from a glossary into a useful "at a glance, here's where vendors differ and who leads."

## What each card gains (in addition to icon + title + hint)

1. **10-vendor scoreboard strip** — a tight row of 10 small squares (one per architecture), color-coded by the 1–5 rubric score (red → amber → green). Squares stay in a consistent vendor order across all 12 cards so the eye learns the shape: a card where most squares are green tells you "everyone is fine here"; a card with a mix tells you "this is where the decision happens." Each square has a `title` tooltip (`Lovable Cloud — 5/5`) and the top-scoring vendor's square gets a thin ring.

2. **Leader chip** — a small pill under the scoreboard: brand mark + vendor name + score, e.g. `[LC] Lovable Cloud · 5/5`. Uses the existing `BRAND` icon mapping. Ties top-pick on this criterion back to vendors the user already knows from the comparator.

3. **Spread micro-label** — a faint right-aligned label that summarises the distribution in one phrase: `Differentiating · 2–5` when the range is wide, `Everyone scores 3+` when concentrated, `Tight race · 4–5` when high+narrow. Computed from min/max + std-dev of the 10 scores. Lets users skim for the criteria that actually move the ranking.

## Layout

- Card body grows from ~6 lines to ~10 lines. Grid stays 3 columns on `lg`, 2 on `sm`, 1 on mobile.
- Scoreboard renders as a single flex row, 10 × `h-3 w-3 rounded-sm` squares with a 2px gap. Fits comfortably even on mobile cards.
- Color tokens reuse existing semantic colors: 1 → `bg-destructive/70`, 2 → `bg-destructive/40`, 3 → `bg-warning/60`, 4 → `bg-success/50`, 5 → `bg-success/80`. No new design tokens.
- Legend strip above the grid: one row with the five color squares labeled "Poor → Excellent" so users decode the dots without hovering.

## Why this is the right add

- Reuses data that already exists (`RUBRIC` in `src/data/architectures.ts`) — no new content to maintain.
- Makes the section *useful*: it answers "which criteria actually differentiate the 10 options?" before the user opens the comparator.
- Visually differentiates each card by pattern, not just by text — the section becomes scannable.
- Ties the methodology directly to vendors the user sees on `/app`, reinforcing the brand mapping established on `/`.

## Optional add-ons (only if you want more)

- Click a card → deep-link to `/app` with the comparator scrolled to that criterion's row and highlighted.
- Tiny histogram instead of vendor dots (counts of 1s/2s/3s/4s/5s) — denser but loses the "who leads" info; I'd skip it in favor of the scoreboard.

## Files

- `src/pages/Methodology.tsx` — update the Criteria section's card to render the scoreboard, leader chip, and spread label. Add a small helper or inline computation for spread + leader. Reuse the `BRAND` mapping by importing it (currently lives in `Landing.tsx` — extract to `src/lib/branding.ts` so both pages share it).
- `src/lib/branding.ts` (new, ~30 lines) — exports the `ArchId → { Icon|src, color, name }` map currently inlined in `Landing.tsx`. Landing.tsx switches to importing from here.

## Out of scope

- No rubric data changes.
- No changes to other Methodology sections, the hero, or Landing.
- No interactivity beyond the hover tooltip and (if you greenlight the optional add-on) the deep link.
