## Goal

1. Add **Cloudflare** (Pages + Workers + D1/R2) as an 11th option, fully wired into ranking, matrix, diagrams, brand icons, methodology, and exports.
2. Make the existing "what to compare" picker **actually exclude** platforms from the ranking, top pick, runners‑up, cost estimate, and PDF/Markdown report — today it only filters the matrix view.
3. Surface that picker earlier so users who *know* they don't want a vendor (e.g. Azure) can drop it in one tap, and users narrowing down have a clearer workflow.

---

## 1. New architecture: Cloudflare

### Data (`src/data/architectures.ts`)
- Extend `ArchId` union with `"lovable-cloudflare"`.
- Add catalog entry:
  - **category**: `frontend-host` (Pages is the entry point; Workers/D1/R2 form the backend)
  - **name**: `Self-host on Cloudflare`
  - **short**: `Cloudflare`
  - **tagline**: `Edge-first Pages + Workers + D1/R2`
  - **description**: Pages for static + SSR, Workers for serverless logic at the edge, D1 (SQLite) or Hyperdrive→Postgres for data, R2 for files, Workers AI for inference.
  - **nativeIntegration**: `false`
  - **bestFor**: `Latency-sensitive global apps`, `Edge AI inference`, `Generous free tier`
  - **watchOuts**: not a Lovable integration (GitHub export), D1 is SQLite (different from Postgres-centric peers), Workers runtime constraints (no long-running Node).
  - **costBands**: `$0` / `$0–20` / `$25–250` / `$250–2k` (free tier is generous; paid Workers is $5/mo + usage).
  - **scaleCeiling**: Very high for stateless edge workloads; D1 is the practical write-throughput limit.
  - **sources**: Workers pricing, Pages pricing, D1 pricing pages.
- Add `RUBRIC["lovable-cloudflare"]` row. Proposed values (tunable):
  - time-to-launch 3, dx-with-lovable 3, cost-small 5, cost-large 4, scaling-ceiling 5, realtime 4, storage 4, ai-compute 4, compliance 3, lock-in 3, ops-burden 3, migration 3.

### Branding (`src/lib/branding.ts`)
- Add `"lovable-cloudflare": { Icon: SiCloudflare, color: "#F38020" }` (icon already in `react-icons/si`).

### Architecture diagram (`src/lib/diagram.ts`)
- Add a `case "lovable-cloudflare"`: `FE → Pages CDN → Workers → D1 / Hyperdrive→Postgres`, plus optional `R2` (files), `Workers AI` (AI), `Queues` (jobs), `Durable Objects` (realtime).

### Rationale (`src/lib/scoring.ts`)
- Add an `if (id === "lovable-cloudflare")` block in `buildRationale` mirroring the existing per‑id sections (cheap free tier, edge for realtime/AI, not a Lovable integration, D1 caveat for heavy writes).

### Presets (`src/lib/presets.ts`)
- Add Cloudflare to one preset where it's a strong fit (e.g. "Scaling past 100k MAU" or a new "Edge-first global app" preset). Keep existing `DEFAULT_ENABLED` as-is unless we want it in the default Top picks.

### Label / glossary updates
- `src/lib/inputLabels.ts`: no change (labels are input-side, not arch-side).
- `Methodology.tsx`: copy mentions "10 backend options" — bump to **11** in SEO description, headline counters, and any "10 architectures" copy in `ScoreLegend` etc.
- `Landing.tsx`, `Lovable.tsx`: same "10" → "11" pass.
- `RecommendationCard`, `ReportExport`, tests: no hard-coded `10`, but verify.

---

## 2. Make the include/exclude picker drive ranking

Today `rankFull(inputs)` runs over **all** architectures and `enabled: ArchId[]` only filters what the matrix renders. We'll thread `enabled` into ranking so toggling Azure off removes it from the top pick, runners-up, cost estimate, and the exported report.

### `src/lib/scoring.ts`
- Extend `rankFull(inputs, options?: { enabled?: ArchId[] })`:
  - If `enabled` is provided and non-empty, skip architectures not in the set (treated like a user filter, separate from the compliance hard filter).
  - Return them in a new `userExcluded: { arch, reason: "Removed by your platform filter" }[]` array so the UI can show "3 hidden by your picks" alongside the existing compliance callout.
- `rank()` stays as a no-`enabled` convenience wrapper for tests.

### `src/pages/Index.tsx`
- Pass `enabled` into `rankFull`: `const { results, excluded, userExcluded } = useMemo(() => rankFull(inputs, { enabled }), [inputs, enabled])`.
- Edge case: if `enabled.length === 0`, show an empty state in `RecommendationCard` ("Select at least one platform to compare") instead of crashing on `results[0]`.
- Forward `userExcluded` to `ReportExport` so the report says "you excluded N options" rather than silently dropping them.

### `src/components/ReportExport.tsx`
- Add an optional `userExcluded` prop and render it in the "Excluded" section of both the React PDF view and `buildMarkdown`, separated from the compliance-excluded block.
- Verification script in `/tmp/verify.ts` (already exists from last loop) gets a 5th sample asserting an excluded Azure isn't anywhere in the markdown.

### `src/components/ComparisonMatrix.tsx`
- Already wired for include/exclude — no logic change. Bump `ALL_IDS` / `TOP_4_IDS` to include Cloudflare if we want it in the default Top 4 (proposal: leave Top 4 as Cloud / Supabase / Vercel / AWS; surface Cloudflare via "Compare all" or category select).
- Tighten the "Heads up" copy to mention **9** non-native options (was "other 8").

---

## 3. Easier "pick & choose" UX

### A. Compact platform filter in `InputsPanel`
Add a new collapsed-by-default section at the bottom of `InputsPanel.tsx` titled **"Platforms to consider"** with three quick modes:
- **All** (default) — every platform in the running.
- **Top picks** — the curated Top 4.
- **Custom** — opens a popover with the same category-grouped chip list from `ComparisonMatrix`, so the user can flip Azure off without scrolling to the matrix section.

A small live count chip (`8 of 11 enabled`) sits next to the title so the user always sees the scope.

### B. Quick-exclude affordance on result cards
- On `RecommendationCard` runner-up entries and on each matrix column header, add a small `×` button: "Don't show Azure again". Clicking it calls `toggleArch(id)`. Tooltip: "Hide from your comparison".
- Pairs naturally with "I'm not big on Azure but it needs to be there" → user can re-enable from the picker any time.

### C. Empty / sparse states
- If `enabled.length === 0`: replace the recommendation block with a friendly "Pick at least one platform" card linking to the picker.
- If `enabled.length === 1`: hide runner-up section, show "Add another platform to see trade-offs".

### D. Persist across loads
- The `enabled` array is already part of the share URL state, so the user's selections survive refresh / share — no change needed.

---

## 4. Things explicitly out of scope

- Re-tuning the rubric for existing platforms — only Cloudflare gets new scores.
- Replacing `html2canvas` PDF rendering. The new sections plug into existing `SectionWrapper`s.
- A "favorite vendors" sticky preference across projects (would need persisted user storage; current scope is per-share-URL).

---

## Files touched

- `src/data/architectures.ts` — new arch + rubric row
- `src/lib/branding.ts` — Cloudflare icon
- `src/lib/diagram.ts` — Cloudflare diagram case
- `src/lib/scoring.ts` — `enabled` filter + Cloudflare rationale + `userExcluded`
- `src/lib/presets.ts` — Cloudflare in one preset
- `src/pages/Index.tsx` — thread `enabled` into `rankFull`, handle empty state
- `src/pages/Methodology.tsx`, `src/pages/Landing.tsx`, `src/pages/Lovable.tsx` — copy bump 10 → 11
- `src/components/ComparisonMatrix.tsx` — copy tweak ("9 non-native"), keep current logic, add per-column quick-exclude `×`
- `src/components/RecommendationCard.tsx` — quick-exclude `×` on runner-ups, empty state
- `src/components/InputsPanel.tsx` — new "Platforms to consider" section
- `src/components/ReportExport.tsx` — accept + render `userExcluded`
- `/tmp/verify.ts` — extend with a Cloudflare + Azure-excluded sample

No DB / Cloud / route changes.
