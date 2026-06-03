## Goal
Add an optional **Guided wizard** that walks users through every input on the Setup tab one at a time, then walks them through the results. The existing Setup/Recommendation tabs and panels stay exactly as they are — the wizard is purely additive.

## Entry point
- New "Guided wizard" button (outline, `Wand2` icon from `lucide-react`) at the top-right of the Setup tab panel, above the two-column grid in `src/pages/Index.tsx`. Clicking opens the wizard dialog.
- No auto-prompt. Manual launch only.

## Wizard shell — `src/components/SetupWizard.tsx` (new)
- Built on shadcn `Dialog` (`@/components/ui/dialog`), `max-w-2xl`, scrollable body.
- Header: step counter ("Step 3 of 12"), `Progress` bar, title, one-line subtitle.
- Body: one step at a time — either a single input control or a single results section.
- Footer: `Back`, `Skip`, `Next` / `Finish`. `Esc` and the dialog close button dismiss.
- Operates on the **same `inputs` / `enabled` state** already in `Index.tsx` via props (`inputs`, `setInputs`, `enabled`, `setEnabled`, `results`, `topId`, `setTab`). No duplicate state — edits in the wizard update the live app immediately.

## Steps

### Setup steps (one input per step, mirrors `InputsPanel` order)
1. Stage (chips)
2. Allow splitting frontend hosting (switch)
3. Expected MAU (slider + number input)
4. Team strengths (chips)
5. Budget (chips)
6. Lock-in tolerance (chips)
7. Compliance (chips)
8. Workloads (chips)
9. Time-to-market priority (slider)
10. Platforms to compare (`PlatformsConsidered` reused inline)

Each setup step shows: short plain-language explainer (reuse `HELP` copy from `InputsPanel`) + the actual control. To keep `InputsPanel`'s internals untouched, the wizard re-renders the same shadcn primitives (`Chip` button, `Slider`, `Switch`, `Input`) bound to the shared state. A small helper `WizardField` keeps the markup consistent.

### Results steps (after switching tab to `recommendation`)
11. **Your recommendation** — embeds `RecommendationCard` (read-only walkthrough copy above it: top pick + why it won).
12. **Cost & scaling** — embeds `CostEstimate` for `topId`.
13. **Architecture diagram** — embeds `ArchitectureDiagram` for `topId`.
14. **Platforms considered** — embeds `PlatformsConsidered` with copy explaining in/out.
15. **Full comparison matrix** — embeds `ComparisonMatrix` (full view) with copy on how to read columns.
16. **Adjust & re-run** — closing screen: "Change any answer and results update live" with two buttons: `Start over` (resets to step 1, optionally `Reset inputs` via `DEFAULT_INPUTS`) and `Finish` (closes dialog, leaves user on Recommendation tab). Also a `Back to Setup` link.

When the wizard advances from step 10 to step 11, it calls `setTab("recommendation")` so the underlying page reflects the same context.

## Persistence
- localStorage key `stack-architect:wizard-step` stores the current step index (number).
- On open, the wizard resumes at the stored step (clamped to valid range). If none stored, starts at 1.
- `Finish` clears the key. `Start over` resets it to 1.
- Inputs themselves are not snapshotted — they're the live app state, which already persists via existing mechanisms.

## A11y
- Dialog has `aria-labelledby` (title) and `aria-describedby` (subtitle).
- Progress bar has `aria-valuenow/min/max`.
- Focus moves to the step title on each advance; `Next` is the default focused control after the input.
- All buttons are real `<button>` with labels.

## Files
- **New**: `src/components/SetupWizard.tsx` — wizard dialog + step components + `useWizardStep` hook.
- **Edited**: `src/pages/Index.tsx` — import wizard, add launch button row above the Setup grid, render `<SetupWizard …/>` with shared state; no changes to existing `StepShell`, `InputsPanel`, `HelpHint`, matrix section, or Recommendation tab markup.

## Out of scope
- No changes to `InputsPanel`, `RecommendationCard`, `ComparisonMatrix`, `PlatformsConsidered`, `CostEstimate`, `ArchitectureDiagram` internals.
- No changes to scoring, presets, routing, header/footer, or other pages.
- No analytics events beyond what already exists.
- No auto-open / first-visit prompt.
