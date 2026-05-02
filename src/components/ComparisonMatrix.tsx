import { ARCHITECTURES, CRITERIA, RUBRIC, type ArchId } from "@/data/architectures";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  enabled: ArchId[];
  topId?: ArchId;
  onToggle: (id: ArchId) => void;
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
    <span className={cn("text-lg leading-none font-mono", colors[i])} aria-label={`${score}/5`}>
      {glyphs[i]}
    </span>
  );
}

export function ComparisonMatrix({ enabled, topId, onToggle }: Props) {
  const archs = ARCHITECTURES.filter((a) => enabled.includes(a.id));

  return (
    <TooltipProvider delayDuration={150}>
      <div className="w-full max-w-full overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full min-w-[480px] border-collapse text-sm sm:min-w-[640px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="sticky left-0 z-10 bg-muted/30 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Criterion
              </th>
              {archs.map((a) => (
                <th
                  key={a.id}
                  className={cn(
                    "px-4 py-3 text-center align-bottom",
                    a.id === topId && "bg-primary/5",
                  )}
                >
                  <div className="flex flex-col items-center gap-1">
                    {a.id === topId && (
                      <span className="rounded-full bg-gradient-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                        Top pick
                      </span>
                    )}
                    <span className="font-semibold text-foreground">{a.short}</span>
                    <span className="text-[11px] font-normal text-muted-foreground max-w-[140px]">
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
                <td className="sticky left-0 z-10 bg-card px-4 py-3 text-left">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help text-foreground">{c.label}</span>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">{c.hint}</TooltipContent>
                  </Tooltip>
                </td>
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
                      <ScoreDot score={score} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="no-print flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-4 py-3 text-xs">
          <div className="flex flex-wrap gap-2">
            {ARCHITECTURES.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onToggle(a.id)}
                className={cn(
                  "rounded-full border px-3 py-1 transition-colors",
                  enabled.includes(a.id)
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-muted",
                )}
              >
                {a.short}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1"><ScoreDot score={1} /> Poor</span>
            <span className="flex items-center gap-1"><ScoreDot score={3} /> OK</span>
            <span className="flex items-center gap-1"><ScoreDot score={5} /> Excellent</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
