## Goals

1. Clearer header + visual break above the full-width comparison matrix.
2. A real downloadable PDF (in addition to the existing Print → Save as PDF).
3. An in-app "Summary" modal that shows a one-page recap of the recommendation.

## Changes

### 1. `src/pages/Index.tsx` — divider + H2 above the matrix

Wrap the bottom matrix `<section>` content with a header block:

```text
─────────────────────────────────  (border-t border-border, full inner width)
Full comparison matrix             (h2, text-xl sm:text-2xl font-semibold)
See how every option scores on the same criteria. Top pick is highlighted.
                                   (text-sm text-muted-foreground)
[ existing <ComparisonMatrix view="matrix" /> ]
```

- Add `mt-8 sm:mt-12 pt-8 sm:pt-10 border-t border-border` to give the section real breathing room from the three-column grid above it.
- Header sits inside the same max-width container so it lines up with the matrix.

### 2. `src/components/ReportExport.tsx` — direct PDF download + Summary

Add two new buttons to the toolbar alongside the existing Markdown + Preview/Print:

- **Summary** (Eye icon, opens new in-app modal)
- **PDF** (FileDown icon, triggers direct download)

#### Direct PDF download

- Add deps: `jspdf` and `html2canvas`.
- Render the existing `<ReportContent />` into an offscreen hidden div (`position: fixed; left: -10000px; width: 800px`), snapshot with `html2canvas`, paginate into a multi-page A4 PDF via `jsPDF`, then save as `stack-architect-{top}.pdf`.
- Keep the existing Markdown and Print buttons untouched — they're useful fallbacks.

#### Summary modal

- New `<Dialog>` triggered by the Summary button.
- Renders a compact one-screen recap (not the full report):
  - Top pick name + score (large)
  - Tagline + 1-line description
  - 3 bullets: top "Why this fits" rationales
  - Cost band for current stage + scaling ceiling
  - Mini matrix: just the top pick column + 2 runners-up, 5 most-weighted criteria
  - Footer: "Download PDF" and "Open full preview" buttons
- Uses the same data already passed to `ReportExport` — no new props.

### 3. No business logic changes

Scoring, inputs, and architecture data stay untouched. This is presentation + export only.

## Technical notes

- `jspdf` + `html2canvas` is the standard pair for client-side React → PDF and handles the existing Tailwind-styled `ReportContent` without restyling.
- Pagination: render at A4 width (≈794px @ 96dpi), slice the canvas into page-height chunks, add each as an image to the PDF.
- The hidden render container is mounted only during the export call and unmounted after, so it has zero impact on normal page weight.
- Print button still works exactly as today.

## Files touched

- `src/pages/Index.tsx` — divider + header block above the matrix section.
- `src/components/ReportExport.tsx` — new Summary modal + PDF download button + offscreen render logic.
- `package.json` — add `jspdf`, `html2canvas`.
