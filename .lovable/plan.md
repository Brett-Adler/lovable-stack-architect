## Stack Architect — Lovable Architecture Comparator

A single-page tool that helps cross-functional teams (founders, PMs, designers, devs, testers, execs) compare Lovable-compatible backend/hosting architectures side by side, rank them against their project's needs, and export a shareable report.

All four architecture options below assume Lovable handles design, frontend dev, testing, and deployment of the UI:

1. **Lovable Cloud (Supabase-managed)** — fastest path, integrated.
2. **Lovable + external Supabase** — own your Supabase project.
3. **Lovable + Vercel / Netlify** — frontend hosting + serverless functions (BYO DB).
4. **Lovable + AWS / GCP / Azure / Heroku** — full hyperscaler/PaaS control.

### User flow

```text
Project Inputs (left rail)        Comparison Matrix (center)         Detail / Export (right)
┌──────────────────────┐          ┌────────────────────────────┐     ┌──────────────────────┐
│ Stage / Scale        │          │ Criteria   │ A │ B │ C │ D │     │ Ranked recommendation│
│ Expected users       │   ───►   │ Speed      │ ● │ ◐ │ ◐ │ ○ │ ──► │ Rationale per option │
│ Team skills          │          │ Cost@scale │ ◐ │ ● │ ● │ ◐ │     │ Cost & scaling band  │
│ Budget band          │          │ Compliance │ ◐ │ ● │ ● │ ● │     │ Architecture diagram │
│ Compliance (HIPAA…)  │          │ Lock-in    │ ● │ ◐ │ ◐ │ ○ │     │ Export PDF / Markdown│
│ AI / heavy compute   │          │ DX w/ Lov. │ ● │ ● │ ◐ │ ○ │     │                      │
│ Realtime / files     │          │ Ops burden │ ● │ ◐ │ ◐ │ ○ │     │                      │
│ Region/data residency│          │ ...        │   │   │   │   │     │                      │
└──────────────────────┘          └────────────────────────────┘     └──────────────────────┘
```

1. User answers ~8–10 inputs in the left rail (sliders, chips, multi-select). Defaults make it usable without filling everything in.
2. The center matrix updates live: rows = criteria, columns = the 4 architectures. Each cell shows a score dot + short reason on hover.
3. User can toggle architectures on/off, pin two for a focused 2-up comparison, and reorder criteria by importance (drag handles); weights drive the ranking.
4. The right panel shows the ranked recommendation, a generated architecture diagram of the top pick, an estimated monthly cost band, and export buttons.

### Inputs collected

- Project stage (prototype / MVP / growth / scale)
- Expected concurrent users and monthly active users (sliders with log scale)
- Team strengths (multi-select: frontend, backend, devops, data, none)
- Budget sensitivity (low / medium / high)
- Compliance needs (none, GDPR, HIPAA, SOC2, data residency region)
- Workload mix (CRUD, realtime, file/media, AI inference, background jobs, heavy compute)
- Vendor lock-in tolerance
- Time-to-market priority

### Comparison criteria (rows)

Time-to-launch, DX with Lovable, Cost at small scale, Cost at large scale, Scaling ceiling, Realtime support, File/storage, AI/edge compute fit, Compliance coverage, Vendor lock-in, Ops/maintenance burden, Migration path off.

Each architecture has a static rubric (1–5) per criterion, multiplied by user-derived weights to produce the ranking. Rubric data lives in a typed JSON config so it is easy to tune.

### Outputs

- **Ranked recommendation** with a top pick + 2 runner-ups, each with 3–5 bullet pros/cons tied to the user's answers ("Picked because: HIPAA + small team + fast TTM").
- **Cost & scaling estimate**: monthly $ band (e.g. "$0–25 → $80–250 → $1k+") at the user's projected scale, plus a scaling ceiling note.
- **Architecture diagram**: auto-generated Mermaid diagram of the recommended stack (frontend, auth, DB, storage, functions, third parties), rendered inline.
- **Exportable report**: one-click Markdown download and a Print-to-PDF view (clean print stylesheet) summarizing inputs, matrix, ranking, rationale, costs, and diagram.

### Pages & components

- `/` — the tool itself (single page, three-pane responsive layout; stacks vertically on mobile).
- `/about` — short explainer of methodology and rubric.
- Components: `InputsPanel`, `ComparisonMatrix`, `ScoreCell`, `ArchToggleBar`, `RecommendationCard`, `CostEstimate`, `ArchitectureDiagram` (mermaid), `ReportExport`, `MethodologyDrawer`.

### Persistence

No accounts. Inputs and toggles are stored in `localStorage` and also serialized into the URL (`?state=...` base64) so a result can be shared via link without a backend.

### Design

Clean, neutral, decision-tool aesthetic: generous whitespace, tabular center pane, subtle accent color for the recommended column, dot-based scoring (●/◐/○) with tooltips, monospace for cost bands. Light/dark mode via existing tokens.

### Technical notes

- React + Vite + Tailwind + shadcn/ui (already in project).
- Rubric and cost bands in `src/data/architectures.ts` (typed). Scoring in `src/lib/scoring.ts` — pure function `(inputs, weights, rubric) => RankedResult[]`.
- Mermaid rendered client-side via `mermaid` npm package; one diagram template per architecture, parameterized by selected workloads.
- Markdown export built from a template string; PDF via `window.print()` with a dedicated `@media print` stylesheet (no extra deps).
- URL state via `lz-string` for compact sharing; falls back to localStorage.
- No backend, no auth, no Lovable Cloud needed for this tool itself.

### Out of scope (v1)

- Saved accounts / team workspaces.
- Live pricing API lookups (costs are curated bands, refreshed manually).
- AI chat advisor (could be added later as a second entry mode).
