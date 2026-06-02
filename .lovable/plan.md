## Plan

Fix the remaining card alignment by making the desktop grid align each column by its visible card top, not by whatever column happens to be in a different row/track.

### What I’ll change

1. **Normalize the desktop grid placement**
   - Keep the three main desktop columns in the same top grid row at large widths: inputs, cost/scaling, and recommendation.
   - Remove the responsive ordering/column-start rules that can make the recommendation card participate in a different row at medium/large breakpoints.

2. **Align the actual card surfaces**
   - Ensure the `InputsPanel`, `CostEstimate`, and `RecommendationCard` wrappers all start at the top of their grid cells.
   - Keep existing mobile tab behavior unchanged.

3. **Preserve current content and behavior**
   - No scoring, platform selection, hybrid-stack logic, or copy changes.
   - This is presentation/layout only.

### Technical details

- Update the grid/tabpanel classes in `src/pages/Index.tsx` so the recommendation aside is explicitly placed with the other top-level columns on desktop.
- If needed, add a small layout wrapper/class adjustment around the recommendation card so its bordered card begins at the same y-position as the cost and inputs cards.
- Validate against the attached wide screenshots and the current `/app?tab=inputs` route.