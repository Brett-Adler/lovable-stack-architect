## Goal

Make the home page do a better job explaining what the user puts *in* (inputs) and what the tool scores *on* (criteria), so visitors understand the substance before opening `/app`.

## Changes (all in `src/pages/Landing.tsx`)

Add two new sections, placed right after the existing "How it works" 3-step block and before "Platforms covered" — that flow becomes: *Hero → Bento → Example scenarios → How it works → **Inputs you give** → **Criteria we score** → Platforms covered → Matrix screenshot → Template → FAQ*.

### 1. "Inputs you give" section

A compact grid of 8 input cards (one per `Inputs` field in `src/lib/scoring.ts`), each with an icon, label, and one-line description of what it controls:

- Stage (prototype / MVP / growth / scale)
- Expected MAU
- Team skills (frontend, backend, DevOps, data, none)
- Budget band
- Compliance needs (none, GDPR, HIPAA, SOC 2, residency)
- Workloads (CRUD, realtime, files, AI, background jobs, heavy compute)
- Lock-in tolerance
- Time-to-market priority

Layout: 2 cols mobile, 4 cols desktop. Lucide icons reused from the rest of the page (e.g. `SlidersHorizontal`, `Users`, `Wallet`, `ShieldCheck`, `Workflow`, `Lock`, `Zap`, `Gauge`). Short intro line: "Eight inputs shape the recommendation."

### 2. "What we score on" section

Render the 12 `CRITERIA` from `src/data/architectures.ts` directly (import `CRITERIA`) so the page stays in sync with the data file. Each criterion is a small card showing `label` (bold) + `hint` (muted). 2 cols mobile, 3 cols desktop. Intro line: "Every option scored 1–5 on these 12 criteria. Weights shift based on your inputs." Link to `/methodology` at the bottom.

Both sections reuse existing rounded-3xl border-card styling for visual consistency with the rest of the page.

## Out of scope

- No new data files, no scoring/logic changes.
- No edits to `/app` or methodology pages.
- No new components — sections live inline in `Landing.tsx`.
