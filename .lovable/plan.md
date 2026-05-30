## Changes — `src/pages/Landing.tsx` FAQ section (lines ~529–540)

1. **Open the first item by default**
   - Switch `<Accordion type="single" collapsible>` → add `defaultValue="item-0"`.

2. **Differentiate question vs. answer backgrounds**
   - `AccordionItem` wrapper: keep card base, add `bg-card` + rounded border per item, with `mb-3` gap so each Q+A reads as one block.
   - `AccordionTrigger`: `bg-card px-5 rounded-t-xl` (slightly lighter — current card tone).
   - `AccordionContent`: `bg-muted/40 px-5 pt-4 pb-5 rounded-b-xl border-t border-border/60` (subtly tinted, with a hairline divider so the seam is visible even on the open item).
   - Remove the wrapping single-card container so each item becomes its own bordered card; or keep the outer container and just add `border-t` separators between items — going with **per-item bordered cards** for clearest start/end boundaries.

No copy changes, no other sections touched.
