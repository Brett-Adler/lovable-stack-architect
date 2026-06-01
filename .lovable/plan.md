# Next step — pre-publish polish (revised)

`LOVABLE_REMIX_URL` is parked until after you publish. Everything else can ship now.

---

## Stage A — Refresh stale screenshots (P0)

Screenshots in `docs/screenshots/` predate the bento landing, brand logos, new methodology table, and the inputs-panel fix. Plan:

1. Read `README.md` to enumerate every screenshot filename it references — those are the targets to refresh.
2. For each one, open the relevant route in the preview via the browser tool, set the right viewport (1440×900 desktop, 390×844 mobile when a mobile shot exists), and capture.
3. Overwrite the files in `docs/screenshots/` using the existing filenames so README links keep working. Don't introduce new filenames in this pass.
4. If README references a screenshot whose subject no longer exists (e.g. an old layout that's been replaced), I'll flag it for your call rather than silently dropping it.

No visual edits to the app — just captures.

---

## Stage B — P1 audits

### B1. Methodology rubric sanity-check
Re-read `src/data/architectures.ts` and `src/pages/Methodology.tsx`. Specifically check:
- Whether "DX with Lovable" double-counts the "native integration" flag (could be inflating Lovable Cloud's score).
- Spot-check 2–3 platforms where the score feels off and verify the per-criterion math matches what the page claims.

If I find a real bias, I'll surface a diff for your approval before changing scores — no silent re-ranking.

### B2. Cost-band spot-check
Spot-check cost bands in `src/data/architectures.ts` against current public pricing for the platforms most likely to have moved: Vercel, Netlify, Render, Fly. Web-fetch each pricing page, compare, flag anything stale. Same rule: diff first, then change.

### B3. Build + lint + smoke
Run `npm run build` and `npm run lint`. Fix breakages. Quick click-through of `/`, `/app`, `/methodology` in the preview to catch any runtime fallout from the brand-asset wiring.

---

## Post-publish followup (one item, do this after you ship)

Set `LOVABLE_REMIX_URL` in `src/lib/constants.ts` to the public Remix link from Lovable's Share panel, then republish. All "Use this template" / "Remix" CTAs will light up automatically. No other code changes required.

I'll add a `TODO(post-publish): set LOVABLE_REMIX_URL` comment next to the constant so it's obvious when you come back.

---

## Explicitly skipped this pass

- P2 polish (extra docs entries, sitemap host check, analytics domain).
- New features or visual changes.
- Re-opening brand mark or screenshots of new layouts.

---

Ready when you are — approve and I'll run A → B in one pass and stop at B1/B2 if I find anything that would change rubric scores or cost numbers.
