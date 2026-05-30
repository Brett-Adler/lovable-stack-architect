## Goal

The "Export & share" hub currently mixes in-app browsing (Summary dialog, HTML "preview" that's really a print-staging screen) with actual exports. Strip it down to exports only, and make share-link copying obvious and clean.

## What changes in `src/components/ReportExport.tsx`

### 1. Reduce the hub to 4 actions

Remove these two cards from the export hub grid:
- **Summary** — redundant; the RecommendationCard already shows the in-app recap on the page.
- **Preview / Print** — confusing combo. "Preview" should mean the full report, not a print-staging modal.

Keep / rework:
- **Copy share link** (was "Share link") — new behavior below.
- **Download PDF** — unchanged.
- **Download Markdown** — unchanged.
- **View full report** (replaces "Preview / Print") — opens the full report in a new browser tab so the user can read, scroll, and use the browser's own Print/Save-as-PDF if they want. No nested dialog, no separate Print button in the app.

Delete the `SummaryDialog` component entirely and its state (`summaryOpen`, `onOpenFullPreview` plumbing).

### 2. Rework "Share link" UX

Today, "Share link" calls `onShare` in `Index.tsx`, which writes to clipboard and shows a toast — or on failure, dumps the giant URL into a `toast.message` (the screenshot the user showed). That's the messy part.

New behavior: clicking the **Copy share link** card opens a small dialog containing:
- A readonly `<input>` pre-filled with the full URL, auto-selected on open.
- A primary **Copy** button next to it (changes to "Copied ✓" for 2s on success).
- One-line helper text: "Anyone with this link sees your exact scenario."

Compute the URL locally in `ReportExport` from the existing `s` query param logic — easiest is to pass the share URL (or a `getShareUrl()` function) down from `Index.tsx` instead of the current `onShare` callback that does its own clipboard/toast work. New prop: `shareUrl: string` (recomputed on every render from `state`). Drop `onShare`.

This replaces the toast-with-wrapped-URL fallback with a proper, selectable, copyable field.

### 3. "View full report" → new tab

Instead of the current preview modal (`open`/`setOpen` + the Report preview dialog with Close / Download PDF / Print buttons), render the full report into a new tab:
- On click, `window.open("", "_blank")`, then write a minimal HTML document containing the same `ReportContent` markup (server-rendered via `renderToStaticMarkup` from `react-dom/server`) plus a small inline stylesheet for print-friendly typography.
- The user then uses the browser's own print / save-as-PDF if they want a hard copy. No in-app Print button.

This removes the entire `Report preview` Dialog and its footer.

### 4. Keep but simplify the offscreen PDF source

The hidden offscreen `<div ref={pdfSourceRef}>` that html2canvas captures stays — it's how Download PDF works. Keep the hidden print-root portal too so direct `Ctrl+P` on the app still produces a clean report (unrelated to the export hub).

## What changes in `src/pages/Index.tsx`

Replace the `onShare` plumbing:

```ts
// before
<ReportExport ... onShare={shareLink} />

// after
const shareUrl = useMemo(() => {
  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(state));
  return `${window.location.origin}${window.location.pathname}?s=${compressed}`;
}, [state]);

<ReportExport ... shareUrl={shareUrl} />
```

The existing `shareLink()` function can be removed (its analytics `track("Share link", ...)` call moves into `ReportExport`'s Copy handler).

## Out of scope

- No changes to PDF/Markdown content or `buildMarkdown`.
- No changes to `RecommendationCard` (that's the in-app summary the user referenced).
- No styling overhaul of the hub cards beyond removing two of them.

## Result

The Export & share dialog becomes a tidy 2×2 grid (Copy share link · Download PDF · Download Markdown · View full report). "Preview" means the real, full report opened in a new tab. Copying the share link is a one-click action with a visible, selectable URL — no more giant URL inside a toast.
