## Goal

The "Inputs you give" cards all use the same small blue icon tile, so the grid reads as monotone. Make each card visually distinct and more substantial.

## Changes — `src/pages/Landing.tsx` only

### 1. Refresh icon choices + add a per-card tint

`TrendingUp` is currently reused on both "Expected MAU" and on the criteria grid. Swap and tighten:

| Card | Icon | Tint token |
|---|---|---|
| Stage | `Milestone` | brand-violet |
| Expected MAU | `LineChart` | brand-blue |
| Team skills | `Users` | brand-cyan (existing) or `--brand-magenta` |
| Budget | `Wallet` | accent-amber (use `text-amber-500`) |
| Compliance | `ShieldCheck` | emerald (`text-emerald-500`) |
| Workloads | `Boxes` | brand-violet |
| Lock-in tolerance | `KeyRound` | brand-magenta |
| Time-to-market | `Rocket` | brand-blue |

Encode the tint per item in the `INPUTS` array:

```ts
const INPUTS = [
  { icon: Milestone, label: "Stage", body: "...", tint: "violet" },
  { icon: LineChart, label: "Expected MAU", body: "...", tint: "blue" },
  ...
];
const TINT: Record<string, string> = {
  violet:  "bg-brand-violet/10 text-brand-violet",
  blue:    "bg-brand-blue/10 text-brand-blue",
  magenta: "bg-brand-magenta/10 text-brand-magenta",
  amber:   "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  cyan:    "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
};
```

(Will verify which `brand-*` tokens exist in `tailwind.config.ts` before wiring — fall back to `primary` / `accent` if any are missing.)

### 2. Beef up the tile

In the card body, replace the current `h-9 w-9` flat tile with a slightly larger gradient-backed tile and a bigger icon, so the imagery actually reads:

```tsx
<div className={cn(
  "mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-inset ring-border/40 shadow-sm",
  TINT[i.tint],
)}>
  <Icon className="h-5 w-5" strokeWidth={2.25} />
</div>
```

No other layout changes — same grid, same padding, same hover lift.

## Out of scope

- "What we score on" criteria cards (already iconified in the previous turn).
- No new copy or per-card illustrations beyond the icon tile.
