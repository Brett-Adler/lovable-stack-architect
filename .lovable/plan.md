# Plan: Icon-only Export button on mobile

In `src/components/ReportExport.tsx` (around lines 514–525), change the Export button so on mobile it renders as a compact icon-only button (with an accessible label), and keeps the "Export & share" text on `sm:` and up.

## Changes

- Drop the "Export" text span shown below `sm`. Keep only the `Share2` icon on mobile.
- Add `aria-label="Export & share"` to the button for screen readers.
- Make the button square on mobile (`h-9 w-9 p-0`) and revert to the normal sized padded button at `sm:` and up (`sm:h-9 sm:w-auto sm:px-3`).
- Keep the existing `Export & share` label visible from `sm:` upward.

This frees up header space so the "Comparator" pill no longer overlaps the Export button.