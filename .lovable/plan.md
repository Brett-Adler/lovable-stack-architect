# Accuracy, truthfulness & bias review

Reviewed as if I work at Lovable and would have to defend this in front of devrel, product, and a skeptical user on Twitter. Findings below, ordered by severity. Most are quick data/copy fixes; a few are structural.

---

## 1. The "Lovable + X" framing is misleading for 8 of 10 options

**Issue.** Every option is labelled `Lovable + <vendor>`, but Lovable only has first-party backend integrations for **Lovable Cloud** and **external Supabase**. For Vercel, Netlify, AWS, GCP, Azure, Heroku, Render, and Fly.io, Lovable doesn't deploy or wire the backend — the user must export to GitHub and host themselves. The current naming suggests parity that doesn't exist.

**Fix.**
- Rename non-integrated rows to `Self-hosted on <vendor> (via GitHub export)` or split a "Lovable integration" column from a "Where you'd run the backend" column.
- Add a short note on the landing page and above the matrix: *"Lovable Cloud and Supabase are native integrations. The other 8 options assume you export your Lovable project to GitHub and deploy the backend yourself."*

---

## 2. "DX with Lovable" criterion is structurally biased

**Issue.** The criterion is weighted 1.5 by default (highest baseline weight) and Lovable controls the scoring. Lovable Cloud gets 5, hyperscalers get 2. Because this weight is high and constant, Lovable Cloud almost always wins regardless of user inputs. That's not necessarily wrong — but it's not transparent.

**Fix.**
- Lower the default weight on `dx-with-lovable` from 1.5 → 1.0, matching peers.
- Show users which criteria drove the top score (top 3 weighted contributors per recommendation).
- Add a "Methodology" disclosure link in the footer and on the recommendation card explaining the rubric, weights, and that the project is Lovable-authored.

---

## 3. Several cost bands are factually wrong (free tiers that no longer exist)

| Arch | Current `prototype` band | Reality | Source |
|---|---|---|---|
| Heroku | $0–10 | Free dynos removed Nov 2022; Eco starts at $5/mo and Basic Postgres $5/mo | heroku.com/pricing |
| Fly.io | $0 | Free allowance ended Oct 2024; pay-as-you-go from ~$5/mo with $5 credit | fly.io/docs/about/pricing |
| Render | $0 | Free web services were deprecated; only static sites and free Postgres (90-day) remain free | render.com/pricing |
| Vercel | $0 | Hobby is free, but commercial use violates ToS — should be noted | vercel.com/pricing |

**Fix.** Update `costBands` in `src/data/architectures.ts` and add a 1-line note next to commercial-use caveats.

---

## 4. Lovable Cloud's lock-in score is internally inconsistent

**Issue.** Lovable Cloud scores `lock-in: 2` while external Supabase scores `lock-in: 3`. Lovable Cloud *is* Supabase under the hood — your data is in Postgres and exportable. The portability story is nearly identical (you can detach to your own Supabase project). The current score over-penalises Cloud and pushes lock-in-averse users away from it incorrectly.

**Fix.** Raise Lovable Cloud `lock-in` from 2 → 3 and add a `watchOut` clarifying it can be migrated to a self-owned Supabase project.

---

## 5. Compliance scores understate Lovable Cloud

**Issue.** Lovable Cloud = 3, external Supabase = 4. Since Cloud runs on Supabase, the compliance ceiling should be the same modulo what Lovable exposes (region pinning, BAA availability). Today this is partly accurate (Cloud doesn't expose region/BAA controls directly), but the gap should be explained, not just shown as a lower number.

**Fix.** Either set both to 4 with a note ("Cloud inherits Supabase posture; pick external Supabase for region pinning, BAA, custom DPA"), or keep 3 and surface the exact reason in the rationale text.

---

## 6. No mention of Lovable AI Gateway

**Issue.** The tool has an "AI inference" workload but doesn't mention Lovable AI Gateway, which is Lovable's first-party way to call Gemini, Claude, GPT, etc., from a Cloud app without managing API keys. This is a significant omission — AI Gateway directly improves Cloud's `ai-compute` story.

**Fix.**
- Raise Lovable Cloud `ai-compute` from 3 → 4 when AI Gateway covers the workload (inference, not training/GPU).
- Mention AI Gateway in Cloud's `description` and in the AI rationale.
- Add a FAQ entry: *"What about AI? Lovable Cloud ships with AI Gateway — managed access to Gemini/Claude/GPT with built-in usage limits, no API keys to rotate."*

---

## 7. Cost bands have no per-row sources or "last reviewed" date

**Issue.** A single `LAST_REVIEWED = "May 2026"` on the landing page is the only freshness signal. Each row's bands are unsourced, which is the #1 thing a skeptical reader will challenge.

**Fix.**
- Add a `sources: string[]` field to each `Architecture` with 1–3 canonical pricing/doc links.
- Show them in a popover on the cost cell and in the exported Markdown report.
- Add `lastReviewed` per architecture (some pages change more often than others).

---

## 8. "Scaling ceiling" claims are unsourced assertions

Examples currently shipped:
- Lovable Cloud: *"Comfortable to mid hundreds of thousands of MAU"* — no evidence, and depends entirely on workload shape.
- Hyperscalers: *"Effectively unbounded"* — true in theory, hand-wavy in practice.

**Fix.** Reword to bind ceilings to a workload shape, e.g. *"Mid hundreds of thousands of MAU for typical CRUD + auth + storage; heavy realtime or analytics lowers this."*

---

## 9. Rationales repeat tagline when no rule fires

`buildRationale` falls back to `arch.tagline` when nothing matched. That produces vacuous, marketing-flavored bullets like *"Edge functions + global CDN"* under the recommendation. Users perceive this as filler.

**Fix.** When no rule fires, write a real fallback: *"No specific reason to prefer or avoid this option for your inputs — it scored on baseline criteria only."*

---

## 10. Recommendation lacks a "Why not the runner-up?" comparison

A defensible pick should tell the user **what they trade off** by picking #1 over #2. Right now we show two scores and three bullets each, with no head-to-head.

**Fix.** Under the top card, add: *"Picking <top> over <runner-up> trades <criterion the runner-up wins> for <criterion top wins>."* Computed from the per-criterion weighted deltas.

---

## 11. Landing page copy overclaims

- *"Three steps from a vague idea to a defensible pick."* — "defensible" only holds if we publish methodology (see #2 + #7).
- *"Curated from public vendor pricing pages, docs, and hands-on experience."* — fine, but link the methodology page.
- *"10 hosting and backend platforms"* — accurate count but conflates frontend hosts (Vercel, Netlify) with backends. Reword: *"10 hosting and backend options across 4 categories."*
- The Lovable Cloud section never says *what it actually includes* (Postgres, auth, storage, edge functions, AI Gateway, file storage). A first-time visitor doesn't know Cloud is a real backend.

**Fix.** Edit hero subhead + add a 2-line "What's Lovable Cloud?" callout on the landing page.

---

## 12. Missing template-readiness items (Lovable store launch)

These aren't strictly "accuracy" but block the template-launch goal:

- **No methodology page.** `/methodology` route covering rubric, weights, sources, and edit instructions. Linked from footer + recommendation card.
- **No "Edit the rubric" inline help** in `src/data/architectures.ts` (only a header comment exists today). README should have a 5-minute "Make it your own" walkthrough.
- **No screenshots / OG image variants.** Only one OG SVG. Need:
  - Hero screenshot (recommendation + matrix) at 1600×900 for the Lovable template gallery.
  - Mobile screenshot.
  - 2–3 in-app shots for the listing detail page.
- **No example presets** — landing should let users try "I'm a solo founder building an MVP" / "I run a HIPAA telehealth pilot" / "We're scaling past 100k MAU" with one click, dropping them into `/app` with that scenario preloaded via the share-URL format that already exists.
- **`LOVABLE_REMIX_URL` is still `"#"`** (per last turn) — the "Use this template" CTAs are dead links until set.

---

## Proposed implementation order (when you switch to build mode)

1. **Data fixes** (`src/data/architectures.ts`): cost bands #3, lock-in #4, compliance #5, AI Gateway #6, scaling-ceiling wording #8, add `sources` + per-arch `lastReviewed` (#7). Naming clarification for non-integrated options (#1).
2. **Scoring** (`src/lib/scoring.ts`): drop `dx-with-lovable` default weight from 1.5 → 1.0 (#2); improve rationale fallback (#9); compute "Why not #2" deltas (#10).
3. **UI**: methodology disclosure link + top-contributors breakdown on `RecommendationCard` (#2, #10); source popover on `CostEstimate` (#7); native-vs-export note above `ComparisonMatrix` (#1).
4. **Landing copy** (`src/pages/Landing.tsx`): rewrite hero subhead, add "What's Lovable Cloud?" callout, add AI Gateway FAQ entry, fix "defensible" claim or link methodology (#2, #6, #11).
5. **Template launch**: `/methodology` page, example-scenario presets on landing, README rewrite, set real `LOVABLE_REMIX_URL`, generate screenshots (#12).

I'd suggest doing steps 1–2 in one pass (they're the truthfulness fixes), then 3–4, then 5 as the launch-prep pass.

## Out of scope for this audit
- Visual design polish on the matrix.
- Dark-mode tuning.
- Test coverage for the new rationale logic (worth adding but separate task).
