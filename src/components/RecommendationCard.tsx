import type { Inputs, RankedResult } from "@/lib/scoring";
import { tradeoffVs } from "@/lib/scoring";
import type { ArchId, Architecture } from "@/data/architectures";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { CheckCircle2, Info, ShieldAlert, Users, X, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

interface Props {
  results: RankedResult[];
  inputs: Inputs;
  excluded?: { arch: Architecture; reason: string }[];
  userExcluded?: { arch: Architecture; reason: string }[];
  isNonTechnical?: boolean;
  onExclude?: (id: ArchId) => void;
  onResetEnabled?: () => void;
}

export function RecommendationCard({
  results,
  inputs,
  excluded = [],
  userExcluded = [],
  isNonTechnical = false,
  onExclude,
  onResetEnabled,
}: Props) {
  if (!results.length) {
    const filteredOut = userExcluded.length > 0;
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-sm">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div className="space-y-2">
            <p className="font-medium text-foreground">
              {filteredOut
                ? "You've filtered out every platform."
                : "No architecture meets your hard requirements."}
            </p>
            <p className="text-muted-foreground">
              {filteredOut
                ? "Re-enable at least one option in the \u201CPlatforms to consider\u201D picker (or click below to bring them all back) to see a recommendation."
                : "Loosen the compliance filter to see options."}
            </p>
            {filteredOut && onResetEnabled && (
              <Button type="button" size="sm" variant="outline" onClick={onResetEnabled}>
                Re-enable all platforms
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
  const top = results[0];
  // For non-technical teams, hide runners that require GitHub export + self-host.
  const visibleRunners = (isNonTechnical
    ? results.slice(1).filter((r) => r.arch.nativeIntegration)
    : results.slice(1)
  ).slice(0, 2);
  const runners = visibleRunners;
  const tradeoff = runners[0] ? tradeoffVs(top, runners[0], inputs) : null;

  return (
    <div>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Recommended: {top.arch.name} — score {Math.round(top.score)} of 100. {top.arch.tagline}
      </div>
      <div className="space-y-4 sm:space-y-5">
      <div className="rounded-2xl border border-primary/30 bg-gradient-primary p-[1px] shadow-elegant">
        <div className="rounded-[calc(theme(borderRadius.2xl)-1px)] bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Recommended
              </div>
              <h2 className="mt-1 flex items-center gap-2 text-xl font-bold text-foreground"><BrandMark archId={top.arch.id} size="lg" />{top.arch.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{top.arch.tagline}</p>
              {top.arch.composition && (
                <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                  Hybrid stack — split frontend hosting
                </p>
              )}

            </div>
            <ScoreBadge score={top.score} primary />
          </div>

          {isNonTechnical && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span>
                Non-technical team detected — runners-up are limited to native Lovable integrations
                so you don't have to manage GitHub exports or your own infra.
              </span>
            </div>
          )}


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
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Runner-up #{i + 1}
              </div>
              <h3 className="mt-0.5 flex items-center gap-1.5 text-base font-semibold text-foreground"><BrandMark archId={r.arch.id} size="md" />{r.arch.name}</h3>
              <p className="text-xs text-muted-foreground">{r.arch.tagline}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <ScoreBadge score={r.score} />
              {onExclude && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                  aria-label={`Hide ${r.arch.name} from comparison`}
                  title={`Hide ${r.arch.name} from comparison`}
                  onClick={() => onExclude(r.arch.id)}
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>
          <ul className="mt-3 space-y-1 text-sm">
            {r.rationale.slice(0, 2).map((x, j) => (
              <li key={j} className="text-foreground/80">• {x}</li>
            ))}
          </ul>
        </div>
      ))}
      </div>
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
      aria-label={`Score ${Math.round(score)} out of 100`}
    >
      {Math.round(score)}
      <span className="ml-0.5 opacity-60">/100</span>
    </Badge>
  );
}
