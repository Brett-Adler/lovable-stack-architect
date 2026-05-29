import {
  ARCHITECTURES,
  CATEGORIES,
  CRITERIA,
  RUBRIC,
  type ArchId,
  type ArchCategory,
} from "@/data/architectures";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";

interface Props {
  enabled: ArchId[];
  topId?: ArchId;
  onToggle: (id: ArchId) => void;
  onSetEnabled: (ids: ArchId[]) => void;
}

function ScoreDot({ score }: { score: number }) {
  // 1-5 → ○ ◔ ◐ ◕ ●
  const glyphs = ["○", "◔", "◐", "◕", "●"];
  const colors = [
    "text-muted-foreground/50",
    "text-muted-foreground",
    "text-warning",
    "text-accent",
    "text-success",
  ];
  const i = Math.max(0, Math.min(4, score - 1));
  return (
    <span
      className={cn("text-lg leading-none font-mono", colors[i])}
      aria-label={`${score} out of 5`}
    >
      {glyphs[i]}
    </span>
  );
}

const ALL_IDS = ARCHITECTURES.map((a) => a.id);

export function ComparisonMatrix({ enabled, topId, onToggle, onSetEnabled }: Props) {
  const archs = ARCHITECTURES.filter((a) => enabled.includes(a.id));
  const allSelected = enabled.length === ALL_IDS.length;
  const noneSelected = enabled.length === 0;

  const setCategory = (cat: ArchCategory, on: boolean) => {
    const inCat = ARCHITECTURES.filter((a) => a.category === cat).map((a) => a.id);
    if (on) {
      const merged = Array.from(new Set([...enabled, ...inCat]));
      onSetEnabled(merged);
    } else {
      onSetEnabled(enabled.filter((id) => !inCat.includes(id)));
    }
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="mb-4 rounded-xl border border-border bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Heads up:</span>{" "}
        Lovable Cloud and external Supabase are native Lovable integrations. The
        other 8 options assume you export your Lovable project to GitHub and
        deploy the backend yourself.
      </div>
      {/* Selection panel — always visible above the matrix */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Choose options to compare
            </h3>
            <p className="text-xs text-muted-foreground">
              {enabled.length} of {ALL_IDS.length} selected — tap any platform to add or remove it.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onSetEnabled(ALL_IDS)}
              disabled={allSelected}
            >
              Compare all
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() =>
                onSetEnabled(["lovable-cloud", "lovable-supabase", "lovable-vercel", "lovable-aws"])
              }
            >
              Popular 4
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onSetEnabled([])}
              disabled={noneSelected}
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {CATEGORIES.map((cat) => {
            const inCat = ARCHITECTURES.filter((a) => a.category === cat.id);
            const selectedInCat = inCat.filter((a) => enabled.includes(a.id)).length;
            const allInCat = selectedInCat === inCat.length;
            return (
              <div key={cat.id} className="rounded-xl border border-border/70 bg-muted/20 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                        {cat.label}
                      </h4>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {selectedInCat}/{inCat.length}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{cat.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCategory(cat.id, !allInCat)}
                    className="rounded-md border border-border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={
                      allInCat
                        ? `Remove all ${cat.label} options from comparison`
                        : `Add all ${cat.label} options to comparison`
                    }
                  >
                    {allInCat ? "Remove all" : "Select all"}
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {inCat.map((a) => {
                    const active = enabled.includes(a.id);
                    return (
                      <Tooltip key={a.id}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={active}
                            aria-label={`${active ? "Remove" : "Add"} ${a.name}`}
                            onClick={() => onToggle(a.id)}
                            className={cn(
                              "group inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-foreground hover:bg-muted",
                            )}
                          >
                            {active ? (
                              <Check className="h-3 w-3" aria-hidden="true" />
                            ) : (
                              <Plus className="h-3 w-3 opacity-60 group-hover:opacity-100" aria-hidden="true" />
                            )}
                            {a.short}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <div className="font-semibold">{a.name}</div>
                          <div className="text-xs opacity-80">{a.tagline}</div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Matrix */}
      {archs.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground sm:mt-6">
          Select at least one option above to see the comparison matrix.
        </div>
      ) : (
        <div className="mt-4 w-full max-w-full overflow-x-auto rounded-2xl border border-border bg-card shadow-card sm:mt-6">
          <table className="w-full border-collapse text-sm" style={{ minWidth: `${180 + archs.length * 130}px` }}>
            <caption className="sr-only">
              Architecture scores by criterion, 1 (poor) to 5 (excellent).
            </caption>
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th
                  scope="col"
                  className="sticky left-0 z-10 bg-muted/30 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  Criterion
                </th>
                {archs.map((a) => (
                  <th
                    key={a.id}
                    scope="col"
                    className={cn(
                      "min-w-[120px] px-3 py-3 text-center align-bottom",
                      a.id === topId && "bg-primary/5",
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {a.id === topId && (
                        <span className="whitespace-nowrap rounded-full bg-gradient-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                          Top pick
                        </span>
                      )}
                      <span className="whitespace-nowrap font-semibold text-foreground">{a.short}</span>
                      <span className="block max-w-[140px] text-[11px] font-normal leading-snug text-muted-foreground">
                        {a.tagline}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CRITERIA.map((c, idx) => (
                <tr
                  key={c.id}
                  className={cn(
                    "border-b border-border/60 last:border-0 hover:bg-muted/20",
                    idx % 2 === 1 && "bg-muted/10",
                  )}
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-card px-4 py-3 text-left font-normal"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label={`${c.label}. ${c.hint}`}
                          className="rounded text-left text-foreground underline decoration-dotted decoration-muted-foreground/60 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                        >
                          {c.label}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        {c.hint}
                      </TooltipContent>
                    </Tooltip>
                  </th>
                  {archs.map((a) => {
                    const score = RUBRIC[a.id][c.id];
                    return (
                      <td
                        key={a.id}
                        className={cn(
                          "px-4 py-3 text-center",
                          a.id === topId && "bg-primary/5",
                        )}
                      >
                        <span className="sr-only">
                          {a.short}, {c.label}:{" "}
                        </span>
                        <ScoreDot score={score} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="no-print flex flex-wrap items-center justify-end gap-3 border-t border-border bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><ScoreDot score={1} /> Poor</span>
            <span className="flex items-center gap-1"><ScoreDot score={3} /> OK</span>
            <span className="flex items-center gap-1"><ScoreDot score={5} /> Excellent</span>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}
