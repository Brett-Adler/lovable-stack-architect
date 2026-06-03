## Goal
Replace `src/assets/shots/app-matrix.png` (used on `/methodology`) with a clean shot of just the **Full comparison matrix** — no architecture diagram, no surrounding chrome above it. Also add a small "Expand" affordance on the live matrix so we can capture it in a roomy presentation.

## Steps

### 1. Add a fullscreen expand button on the matrix (Index.tsx)
- In `src/pages/Index.tsx`, inside the `Full comparison matrix` `<header>` row (around line 454-462), add a `FullscreenCardDialog` next to the existing `HelpHint`.
- Trigger label: "Expand full comparison matrix".
- Dialog title: "Full comparison matrix".
- Body: render `<ComparisonMatrix view="matrix" enabled={enabled} topId={topId} onToggle={toggleArch} onSetEnabled={setEnabled} />` inside a horizontally-scrollable wrapper.
- Bump `FullscreenCardDialog`'s `DialogContent` max-width for matrix use: extend the component with an optional `maxWidthClass` prop (default keeps current `max-w-[1100px]`), and pass `max-w-[1600px]` here so the matrix has room to breathe.

### 2. Capture the screenshot
Once built:
- `navigate_to_sandbox` to `/app?tab=setup` at 1920x1080.
- Scroll to the matrix, click the new Expand button.
- `screenshot` the open dialog (viewport-only, just the matrix).
- Save the raw image to `/tmp/matrix-fullscreen.png`.

### 3. Replace the methodology asset
- Overwrite `src/assets/shots/app-matrix.png` with the cropped/clean screenshot from step 2.
- No code change needed on `/methodology` — `Methodology.tsx` already imports `@/assets/shots/app-matrix.png`.

### 4. Verify
- Reload `/methodology` in the browser and screenshot to confirm the new image shows the matrix only (no Cloud Postgres diagram above it).

## Out of scope
- No changes to matrix scoring, columns, or styling.
- No changes to `/methodology` copy or layout.
- No new pages or routes.
