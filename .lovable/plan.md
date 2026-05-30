## Goal

Give each "What we score on" card a small icon so the 12 criteria are scannable instead of a wall of text.

## Change

Edit `src/pages/Landing.tsx` only — keep `src/data/architectures.ts` icon-free (presentation stays in the page).

### 1. Add a local icon map keyed by `CriterionId`

Import the needed icons from `lucide-react` (already used elsewhere) and define:

```ts
const CRITERION_ICON: Record<CriterionId, LucideIcon> = {
  "time-to-launch":  Rocket,
  "dx-with-lovable": Sparkles,
  "cost-small":      PiggyBank,
  "cost-large":      TrendingUp,
  "scaling-ceiling": Gauge,
  "realtime":        Radio,
  "storage":         FolderOpen,
  "ai-compute":      Cpu,
  "compliance":      ShieldCheck,
  "lock-in":         Unlock,
  "ops-burden":      Wrench,
  "migration":       ArrowRightLeft,
};
```

### 2. Render the icon inside each card (lines ~330–338)

Replace the existing card body with a layout that puts a small icon tile to the left of the label:

```tsx
<div className="flex items-start gap-3 ...">
  <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
    <Icon className="h-4 w-4" />
  </div>
  <div className="min-w-0">
    <div className="text-sm font-semibold text-foreground">{c.label}</div>
    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.hint}</p>
  </div>
</div>
```

Keep the existing card chrome (rounded-2xl border, hover lift, shadow). Icon tile uses the same `bg-primary/10 text-primary` pattern already used in the Export & share cards and the inputs section so it feels native.

## Out of scope

- No new criteria, copy, or layout changes.
- No icons on other criteria-mentioning surfaces (Methodology page, matrix headers) — only the "What we score on" grid on the home page, which is what the screenshot shows.
