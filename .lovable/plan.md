## Goal

Remove the "Export & share" button in the site header and its modal, and surface the three actions (Copy share link, Download PDF, Download Markdown) directly inside Step 3 ("Your recommendation") in a compact, mobile-friendly row.

## Changes

### 1. `src/components/ReportExport.tsx`
- Keep all logic (markdown builder, PDF render portal, `downloadMd`, `downloadPdf`, `copyShareUrl`) intact.
- Replace the default exported UI:
  - Drop the header trigger Button, the `hubOpen` hub Dialog, and the separate `shareOpen` share Dialog.
  - Render a compact inline action bar: three buttons in a row — `Copy link` (turns into "Copied ✓" on success via existing `copied` state + sonner toast), `Download PDF` (shows spinner when `pdfBusy`), `Download .md`.
  - Keep the offscreen PDF portal exactly as-is so PDF export still works.
- Layout: `flex flex-wrap items-center gap-2` with `size="sm"` outline buttons; icons + short labels. On mobile (`<sm`), labels shrink to icon + 1-word ("Link", "PDF", ".md") via `hidden xs:inline` patterns already used elsewhere; on `sm+` show full labels. Bar prefixed by a tiny `Share2` + "Export this recommendation" muted label on `sm+` only (hidden on mobile to save space).
- Component remains `<ReportExport ... />` with the same props — drop-in.

### 2. `src/pages/Index.tsx`
- Remove `<ReportExport ... />` from inside `<SiteHeader>` (line 237).
- Render `<ReportExport ... />` inside the Step 3 panel, placed at the bottom of `StepShell` just above the existing disclaimer paragraph (after the grid, before line 435's `<p>`), so it sits with the recommendation but doesn't push the card down.

### 3. Sync surfaces (per memory rule)
- Wizard: no Export references today — no change needed.
- PDF report: unaffected (still generated from the same portal).
- `/app`: this is the change.

## Out of scope
- No changes to PDF contents, markdown contents, or share URL encoding.
- No new actions, no rewording of action descriptions beyond shortening for mobile.
- No changes to SiteHeader other than removing the ReportExport child.
