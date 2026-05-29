import type { Inputs, RankedResult } from "@/lib/scoring";
import { tradeoffVs } from "@/lib/scoring";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { CheckCircle2, Info } from "lucide-react";

export function RecommendationCard({
  results,
  inputs,
}: {
  results: RankedResult[];
  inputs: Inputs;
}) {
  if (!results.length) return null;
  const top = results[0];
  const runners = results.slice(1, 3);
  const tradeoff = runners[0] ? tradeoffVs(top, runners[0], inputs) : null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-primary/30 bg-gradient-primary p-[1px] shadow-elegant">
        <div className="rounded-[calc(theme(borderRadius.2xl)-1px)] bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Recommended
              </div>
              <h3 className="mt-1 text-xl font-bold text-foreground">{top.arch.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{top.arch.tagline}</p>
            </div>
            <ScoreBadge score={top.score} primary />
          </div>

          <p className="mt-4 text-sm text-foreground/90">{top.arch.description}</p>

          <div className="mt-4 space-y-1.5">
            {top.rationale.map((r, i) => (
              <div key={i} className="flex gap-2 text-sm text-foreground/90">
                <span className="text-primary">→</span>
                <span>{r}</span>
              </div>
            ))}
          </div>

          {top.topContributors.length > 0 && (
            <div className="mt-4 rounded-xl border border-border bg-muted/20 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Top reasons it scored well
              </div>
              <ul className="mt-1.5 space-y-1 text-xs text-foreground/90">
                {top.topContributors.map((c) => (
                  <li key={c.criterion.id} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>{c.criterion.label}</span>
                    <span className="ml-auto font-mono text-muted-foreground">
                      {c.rubricScore}/5
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/methodology"
                className="mt-2 inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
              >
                <Info className="h-3 w-3" /> How scoring works
              </Link>
            </div>
          )}

          {tradeoff && (
            <p className="mt-3 rounded-xl border border-dashed border-border bg-background/40 p-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Trade-off vs {runners[0].arch.short}:</span>{" "}
              you gain <span className="font-medium text-foreground">{tradeoff.topWins.label.toLowerCase()}</span>{" "}
              and give up some <span className="font-medium text-foreground">{tradeoff.runnerWins.label.toLowerCase()}</span>.
            </p>
          )}

          <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Best for</div>
              <ul className="mt-1 space-y-1">
                {top.arch.bestFor.map((b) => (
                  <li key={b} className="text-foreground/90">• {b}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Watch outs</div>
              <ul className="mt-1 space-y-1">
                {top.arch.watchOuts.map((b) => (
                  <li key={b} className="text-foreground/90">• {b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {runners.map((r, i) => (
        <div key={r.arch.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Runner-up #{i + 1}
              </div>
              <h4 className="mt-0.5 text-base font-semibold text-foreground">{r.arch.name}</h4>
              <p className="text-xs text-muted-foreground">{r.arch.tagline}</p>
            </div>
            <ScoreBadge score={r.score} />
          </div>
          <ul className="mt-3 space-y-1 text-sm">
            {r.rationale.slice(0, 2).map((x, j) => (
              <li key={j} className="text-foreground/80">• {x}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ScoreBadge({ score, primary }: { score: number; primary?: boolean }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "font-mono tabular-nums",
        primary && "bg-primary/10 text-primary",
      )}
    >
      {Math.round(score)}
    </Badge>
  );
}
