## Goal

Keep today's "one platform does it all" model as the default and the unit you pick/exclude. Add an **opt-in "Break up services"** mode that lets a user split frontend hosting away from the backend (e.g. keep Supabase backend, host the frontend on Cloudflare Pages).

## Mental model

- **Default mode** (unchanged): the 11 existing platforms are what you pick from. Every card, the matrix, the picker, the PDF — all stay as they are today.
- **Split mode** (new, opt-in): a single toggle in the inputs panel — *"Allow splitting frontend hosting"*. When on, a small set of curated **hybrid stacks** is added to the same catalog and competes in the ranking.

No cross-product, no two-list picker. The hybrids are just additional items in the same list users already filter.

## Hybrid stacks (initial curated set)

Four items, all using Supabase or Lovable Cloud for the backend and a dedicated frontend host:

1. `lovable-cloud + cloudflare-pages` — "Lovable Cloud backend on Cloudflare Pages"
2. `lovable-supabase + cloudflare-pages` — "Supabase backend on Cloudflare Pages"
3. `lovable-supabase + vercel` — "Supabase backend on Vercel"
4. `lovable-supabase + netlify` — "Supabase backend on Netlify"

Each is a single new entry in `ARCHITECTURES` with its own brand mark (two stacked logos), tagline, watch-outs, cost bands, and rubric row. They behave exactly like any other architecture — they just have a `composition: { backend, frontend }` field so the diagram and rationale can describe both halves.

## Picker behavior (unchanged shape)

- `PlatformsConsidered` strip and the InputsPanel "Platforms to consider" picker still show one flat list of chips.
- Hybrids only appear in the list when split mode is on. When off, they're hidden and skipped by ranking — exactly like a manually excluded platform.
- The existing per-chip × / + still works.

## Changes

1. **`src/data/architectures.ts`**
   - Add 4 hybrid entries with `composition: { backend: ArchId; frontend: ArchId }`.
   - Add their rubric rows (blend of the two halves; documented inline).
   - Bump `ArchId` union.

2. **`src/lib/branding.ts`** — paired brand mark for each hybrid (two small logos).

3. **`src/lib/diagram.ts`** — for any arch with `composition`, render frontend → backend edges.

4. **`src/lib/scoring.ts`**
   - `Inputs` gains `allowSplit: boolean` (default `false`).
   - `rankFull` filters out hybrids when `allowSplit === false`, before applying the user's `enabled` set.

5. **`src/components/InputsPanel.tsx`** — new compact toggle near the top: *"Allow splitting frontend hosting"* with one-line helper ("Adds combos like Supabase + Cloudflare Pages to the comparison."). Persisted via the share URL like every other input.

6. **`src/components/PlatformsConsidered.tsx`** — no structural change; just receives the filtered catalog so hybrids appear/disappear with the toggle. Optional: small "hybrid" label badge on those chips so they're identifiable.

7. **`src/components/RecommendationCard.tsx`** / **`CostEstimate`** / **`ReportExport`** — when the winning arch has `composition`, render the two-half brand mark and a short "frontend on X, backend on Y" line. No new layouts.

8. **Copy bumps** — "11 platforms" → "11 platforms + 4 hybrid stacks (opt-in)" on Landing/Methodology/SEO and the Heads-up line.

## Defaults

- `allowSplit` defaults to `false` for new sessions. Existing share URLs decode to `false` (no migration needed).
- When toggled on for the first time, all four hybrids start enabled in `PlatformsConsidered` (user can `×` them off like anything else).

## Out of scope

- Generic backend × frontend cross-product or two-list picker.
- Per-vendor preference weighting.
- New criteria; the 12 stay.
- Re-tuning existing platforms' scores.

## Open question

The four hybrids above are the curated starter set. Want me to add any others up front (e.g. Supabase + AWS Amplify, Lovable Cloud + Vercel), or keep it tight and add more later?
