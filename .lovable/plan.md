## Goal

Today's "Guided wizard" walks through every input + every results panel inside one ~`max-w-2xl` modal. The results steps (recommendation card, cost & scaling, architecture diagram, full matrix) are cramped in that width. Split it into two purpose-built wizards.

## What changes

### 1. Setup Wizard — steps 1 & 2 only
Trim `SetupWizard.tsx` to the setup-only steps (stage, allow-split, MAU, team, budget, lock-in, compliance, workloads, time-to-market, platforms-considered). Drop every step where `kind: "results"` (recommendation, cost, diagram, considered duplicate, matrix, adjust).

- Keep the existing compact dialog (`max-w-2xl`, popup style).
- Remove the auto tab-switch effect (no more results steps means it always stays on Setup).
- Final step's "Finish" closes the modal and switches the page to the Recommendation tab so the user lands on Step 3.
- Header copy: "Step N of {total}" — recompute total from the trimmed step list. Drop the "Setup / Results walkthrough" sub-label.

### 2. New Results Walkthrough — step 3 in a roomy dialog
New component `src/components/ResultsWalkthrough.tsx`, modeled on `SetupWizard` but with a wide dialog (`w-[95vw] max-w-[1600px] max-h-[92vh] overflow-y-auto`, matching the FullscreenCardDialog pattern). Steps:

1. **Your recommendation** — full `RecommendationCard` at real width.
2. **Cost & scaling** — `CostEstimate` for the top pick.
3. **Architecture diagram** — `ArchitectureDiagram` for the top pick.
4. **Full comparison matrix** — `ComparisonMatrix view="all"` inside `overflow-x-auto`, taking advantage of the wider dialog.
5. **Adjust and run again** — same actions as today (reset inputs, restart tour, close).

Same Back / Skip / Next / Finish controls and progress bar as the setup wizard. Persists step index under a separate localStorage key (`stack-architect:results-step`) so the two wizards don't fight.

### 3. Entry points in `src/pages/Index.tsx`
- Setup tab keeps the existing "Guided wizard" button (now labeled the same; opens the trimmed Setup wizard).
- Recommendation tab gets a matching button at the top-right of the tab body: "Walk me through the results" (same `Wand2` icon, `outline` `size="sm"`), opening the new Results Walkthrough.
- Wire two pieces of state: `wizardOpen` (existing) and `resultsWalkOpen` (new).
- When the Setup wizard's Finish fires, switch `tab` to `"recommendation"` (already supported via `setTab`). Don't auto-open the results walkthrough — let the user choose.

### 4. Sync rule
Per the synced-surfaces memory, the wizard ↔ /app ↔ PDF parity rule still holds: this change does not add or remove sections, it only re-homes existing ones across two wizards. No PDF or /app structural changes needed.

## Out of scope

- No changes to scoring, results content, PDF export, or the inline Export bar in Step 3.
- No new copy beyond the new button label and the trimmed wizard header.
- No restyle of FullscreenCardDialog — the new wizard uses its own Dialog with the same sizing recipe.

## Open question

Should finishing the Setup wizard **auto-open** the Results Walkthrough (one continuous guided flow), or just drop the user on the Recommendation tab with the new "Walk me through the results" button visible (current plan)? I went with the latter so each wizard stands alone — let me know if you'd prefer the auto-handoff.
