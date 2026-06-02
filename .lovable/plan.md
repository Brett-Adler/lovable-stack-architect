# Update the PDF report to match the /app and look better

## Issues found in the current PDF (`stack-architect-cloud-latest.pdf`)

1. **Raw enum IDs leak into "Project inputs"** — shows `mvp`, `frontend`, `crud`, `low`, `medium` instead of human labels ("MVP", "Frontend", "CRUD app", "Low — under ~$50/mo"). The `fmtList()` helper joins raw IDs from `inputs.*` without mapping through `InputsPanel`'s label dictionaries.
2. **Garbled "Best for" bullet** ("Prototypes  Prototypes & MVPs") — caused by html2canvas wrapping + the `•` glyph; needs cleaner list rendering with safer spacing.
3. **Doesn't reflect what the /app actually shows**:
   - For non-technical teams the app hides runners-up that require GitHub export. The PDF still lists them.
   - The app shows an **Excluded by compliance** callout and a **Cost estimate** block (with MAU + selected stage). Neither appears in the PDF.
   - The "Trade-off vs runner-up" line the app shows in the recommendation card is missing.
4. **Header is plain** — no brand bar, no top-pick category, no "what is this report" sentence.
5. **No methodology** — user asked for it. Currently no explanation of how the 12 criteria, weights, or rubric work; no glossary for inputs (Stage / Compliance / Workloads / Lock-in).
6. **Visual polish** — section dividers, page breaks, table zebra striping, and a footer with page numbers are missing. The big matrix sometimes splits awkwardly across pages.

## What the update does

All work is in `src/components/ReportExport.tsx` (the React `ReportContent` + the `buildMarkdown` mirror). No scoring or data changes.

### 1. Match the app

- Apply the **same non-technical runners-up filter** the app uses (`team` is empty or only `none` → drop runners that aren't `nativeIntegration`).
- Surface the **excluded-by-compliance** list as a callout near the top pick, matching the app's warning band.
- Add a **Cost estimate** sub-block under the top pick that mirrors `CostEstimate.tsx`: selected stage band, MAU, and "ceiling" note.
- Add the **trade-off sentence** vs runner-up #1 (reuse `tradeoffVs` from `scoring.ts`).
- Show the top pick's **category** (Managed backend / PaaS / Hyperscaler / Frontend host) from `CATEGORIES`.

### 2. Fix label mapping

Introduce small label dictionaries inside `ReportExport.tsx` (or import the existing ones from `InputsPanel.tsx` by extracting them to a shared `src/lib/inputLabels.ts`):

- `STAGE_LABEL`, `TEAM_LABEL`, `COMPLIANCE_LABEL`, `WORKLOAD_LABEL`, `BUDGET_LABEL`, `LOCKIN_LABEL`.

Replace every `fmtList(inputs.x)` with `fmtList(inputs.x.map(id => LABEL[id] ?? id))` in both the React report and Markdown builder.

### 3. New "Methodology & glossary" appendix (last 1–2 pages)

Added as the final section so casual readers can skip it:

- **How scoring works** — 3-bullet summary: baseline weight 1.0 → nudged by inputs → multiplied by rubric (0–5) → normalized to /100. Cross-link to `/methodology`.
- **Criteria glossary** — table of all 12 criteria with their `hint` strings from `CRITERIA` in `architectures.ts`.
- **Input glossary** — table explaining each input field the user filled in, with the chosen options highlighted:
  - Stage, MAU, Team, Budget, Compliance (GDPR/HIPAA/SOC 2/Data residency one-liners), Workloads (CRUD / Realtime / Files / AI / Background jobs / Heavy compute), Lock-in tolerance, Time-to-market priority.
- **Disclaimer & sources** — keep existing "curated bands" note, plus a flat list of every source URL from the top pick + runners-up.

### 4. Visual polish (still html2canvas → jsPDF)

- Replace CSS-variable classes (`text-foreground`, `bg-muted/30`, `border-border`, `text-primary`) inside the offscreen render with **inline hex colors** so html2canvas doesn't drop them. A neutral palette: `#0a0a0a` text, `#6b7280` muted, `#e5e7eb` borders, `#f9fafb` zebra rows, `#2563eb` primary accent. This also fixes any "color works in dialog but looks wrong in PDF" drift.
- Add a top **brand bar** (1 px gradient line + small "Lovable Stack Architect" wordmark + report date on the right).
- Use `print-break-before` between major sections (Recommendation / Runners-up / Matrix / Methodology) so each starts on a fresh page.
- Add zebra striping to the comparison matrix and bold the top-pick column.
- Move the matrix to **landscape page** by splitting the PDF generation: one jsPDF `addPage({ orientation: 'landscape' })` just for the matrix canvas, then back to portrait. (Implemented by rendering two offscreen sources — one portrait, one landscape — and stitching them.)
- Footer on every page: `Stack Architect · page N / M` (added via `pdf.setPage(i)` loop after content is laid out).

### 5. Markdown export stays in sync

Mirror every new section in `buildMarkdown` so the `.md` download includes labels, methodology, glossary, and disclaimer — same content, plain text.

## Files touched

- `src/components/ReportExport.tsx` — main rewrite of `ReportContent`, `buildMarkdown`, and `downloadPdf` (multi-orientation, page numbers).
- *(optional)* `src/lib/inputLabels.ts` — new file, shared label maps used by both `InputsPanel.tsx` and `ReportExport.tsx`. If we skip this, the maps live locally in `ReportExport.tsx`.

No changes to scoring, data, routes, or any other component.

## Out of scope

- Not switching away from html2canvas to a native jsPDF text layout (would make text selectable but is a much bigger rewrite — flag if you want it).
- Not embedding the architecture diagram SVG in the PDF (heavy, and the textual top-pick description already covers it).
