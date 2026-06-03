import { useCallback, useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { type Inputs, DEFAULT_INPUTS, rankFull } from "@/lib/scoring";
import { type ArchId } from "@/data/architectures";
import { RecommendationCard } from "@/components/RecommendationCard";
import { CostEstimate } from "@/components/CostEstimate";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { ComparisonMatrix } from "@/components/ComparisonMatrix";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";

const STEP_KEY = "stack-architect:results-step";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inputs: Inputs;
  setInputs: (next: Inputs) => void;
  enabled: ArchId[];
  setEnabled: (next: ArchId[]) => void;
  toggleArch: (id: ArchId) => void;
  resetEnabled: () => void;
  setTab: (t: "setup" | "recommendation") => void;
}

export function ResultsWalkthrough({
  open,
  onOpenChange,
  inputs,
  setInputs,
  enabled,
  setEnabled,
  toggleArch,
  resetEnabled,
  setTab,
}: Props) {
  const { results, excluded, userExcluded } = useMemo(
    () => rankFull(inputs, { enabled }),
    [inputs, enabled],
  );
  const topId = results[0]?.arch.id;
  const isNonTechnical =
    inputs.team.length === 0 || (inputs.team.length === 1 && inputs.team[0] === "none");

  type Step = { key: string; title: string; subtitle: string; render: () => React.ReactNode };

  const steps: Step[] = useMemo(() => [
    {
      key: "recommendation",
      title: "Your recommendation",
      subtitle: "Top pick based on everything you told us. Updates live as you tweak inputs.",
      render: () => (
        <RecommendationCard
          results={results}
          inputs={inputs}
          excluded={excluded}
          userExcluded={userExcluded}
          isNonTechnical={isNonTechnical}
          onExclude={toggleArch}
          onResetEnabled={resetEnabled}
        />
      ),
    },
    {
      key: "cost",
      title: "Cost & scaling",
      subtitle: "Rough monthly cost band for your top pick at your projected MAU.",
      render: () =>
        topId ? (
          <CostEstimate archId={topId} inputs={inputs} enabled={enabled} topId={topId} />
        ) : (
          <p className="text-sm text-muted-foreground">No top pick yet — enable at least one platform.</p>
        ),
    },
    {
      key: "diagram",
      title: "Architecture diagram",
      subtitle: "How the pieces fit together for your top pick.",
      render: () =>
        topId ? (
          <ArchitectureDiagram archId={topId} inputs={inputs} />
        ) : (
          <p className="text-sm text-muted-foreground">No top pick yet.</p>
        ),
    },
    {
      key: "matrix",
      title: "Full comparison matrix",
      subtitle: "Every option scored on the same criteria — your top pick is highlighted.",
      render: () => (
        <div className="overflow-x-auto px-4 sm:px-0">

          <ComparisonMatrix
            view="all"
            enabled={enabled}
            topId={topId}
            onToggle={toggleArch}
            onSetEnabled={setEnabled}
          />
        </div>
      ),
    },
    {
      key: "adjust",
      title: "Adjust and run again",
      subtitle: "Change any answer and results update live — or start fresh.",
      render: () => (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You're done. Tweak inputs from the Setup tab any time and the recommendation will follow.
            Want a clean slate? Reset inputs to defaults or restart this walkthrough.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setInputs(DEFAULT_INPUTS)}>
              <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
              Reset inputs to defaults
            </Button>
            <Button type="button" variant="outline" onClick={() => setStep(0)}>
              Restart walkthrough
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setTab("setup");
                onOpenChange(false);
              }}
            >
              Back to Setup tab
            </Button>
          </div>
        </div>
      ),
    },
  ], [results, inputs, excluded, userExcluded, isNonTechnical, topId, enabled, toggleArch, resetEnabled, setEnabled, setInputs, setTab, onOpenChange]);

  const total = steps.length;
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem(STEP_KEY);
      const n = raw ? parseInt(raw, 10) : 0;
      if (Number.isFinite(n)) setStep(Math.min(Math.max(0, n), total - 1));
    } catch {
      /* ignore */
    }
  }, [open, total]);

  useEffect(() => {
    if (!open) return;
    try {
      localStorage.setItem(STEP_KEY, String(step));
    } catch {
      /* ignore */
    }
  }, [step, open]);

  const current = steps[step];

  const finish = useCallback(() => {
    try {
      localStorage.removeItem(STEP_KEY);
    } catch {
      /* ignore */
    }
    setStep(0);
    onOpenChange(false);
  }, [onOpenChange]);

  const isLast = step === total - 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-[1600px] max-h-[92vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pr-8">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Step {step + 1} of {total}
            </span>
            <span className="hidden sm:inline text-xs text-muted-foreground">Results walkthrough</span>
          </div>
          <Progress
            value={((step + 1) / total) * 100}
            aria-label={`Results walkthrough progress: step ${step + 1} of ${total}`}
          />
          <DialogTitle className="mt-3 sm:mt-4 text-lg sm:text-xl">{current?.title}</DialogTitle>
          <DialogDescription className="text-sm">{current?.subtitle}</DialogDescription>
        </DialogHeader>

        <div className={current?.key === "matrix" ? "-mx-4 sm:mx-0 py-3 sm:py-4" : "py-3 sm:py-4"}>
          {current?.render()}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border pt-3 sm:pt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" aria-hidden="true" />
            Back
          </Button>
          <div className="flex items-center gap-1 sm:gap-2">
            {!isLast && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setStep((s) => Math.min(total - 1, s + 1))}>
                Skip
              </Button>
            )}
            {isLast ? (
              <Button type="button" size="sm" onClick={finish}>
                <Check className="mr-1 sm:mr-2 h-4 w-4" aria-hidden="true" />
                Finish
              </Button>
            ) : (
              <Button type="button" size="sm" onClick={() => setStep((s) => Math.min(total - 1, s + 1))}>
                Next
                <ArrowRight className="ml-1 sm:ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
