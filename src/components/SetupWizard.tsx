import { useCallback, useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  type Inputs,
  type Stage,
  type BudgetBand,
  type LockInTolerance,
  type TeamSkill,
  type Compliance,
  type Workload,
} from "@/lib/scoring";
import { type ArchId } from "@/data/architectures";
import { PlatformsConsidered } from "@/components/PlatformsConsidered";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const STEP_KEY = "stack-architect:wizard-step";

const STAGES: { id: Stage; label: string }[] = [
  { id: "prototype", label: "Prototype" },
  { id: "mvp", label: "MVP" },
  { id: "growth", label: "Growth" },
  { id: "scale", label: "Scale" },
];
const TEAMS: { id: TeamSkill; label: string }[] = [
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "devops", label: "DevOps" },
  { id: "data", label: "Data" },
  { id: "none", label: "Non-technical" },
];
const COMPLIANCE: { id: Compliance; label: string }[] = [
  { id: "none", label: "None" },
  { id: "gdpr", label: "GDPR" },
  { id: "hipaa", label: "HIPAA" },
  { id: "soc2", label: "SOC 2" },
  { id: "residency", label: "Data residency" },
];
const WORKLOADS: { id: Workload; label: string }[] = [
  { id: "crud", label: "CRUD app" },
  { id: "realtime", label: "Realtime" },
  { id: "files", label: "Files / media" },
  { id: "ai", label: "AI inference" },
  { id: "background-jobs", label: "Background jobs" },
  { id: "heavy-compute", label: "Heavy compute / GPU" },
];
const BUDGETS: { id: BudgetBand; label: string }[] = [
  { id: "low", label: "Low — under ~$50/mo" },
  { id: "medium", label: "Medium — $50–500/mo" },
  { id: "high", label: "High — $500+/mo" },
];
const LOCK_INS: { id: LockInTolerance; label: string }[] = [
  { id: "low", label: "Low — must be portable" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High — fine to commit" },
];

const MAU_STEPS = [50, 200, 1_000, 5_000, 10_000, 50_000, 100_000, 500_000, 1_000_000];
function fmtMau(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return `${n}`;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="switch"
      aria-checked={active}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-secondary text-secondary-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

interface WizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inputs: Inputs;
  setInputs: (next: Inputs) => void;
  enabled: ArchId[];
  setEnabled: (next: ArchId[]) => void;
  toggleArch: (id: ArchId) => void;
  resetEnabled: () => void;
  /** Switched to "recommendation" when the wizard finishes. */
  setTab: (t: "setup" | "recommendation") => void;
}

export function SetupWizard({
  open,
  onOpenChange,
  inputs,
  setInputs,
  enabled,
  setEnabled,
  toggleArch,
  resetEnabled,
  setTab,
}: WizardProps) {
  const toggle = <T extends string>(arr: T[], value: T): T[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  const update = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setInputs({ ...inputs, [key]: value });

  const mauIndex = Math.max(0, MAU_STEPS.findIndex((s) => s >= inputs.mau));

  type Step = {
    key: string;
    title: string;
    subtitle: string;
    render: () => React.ReactNode;
  };

  const steps: Step[] = useMemo(() => [
    {
      key: "stage",
      title: "What stage is your project at?",
      subtitle: "Pick one or more — useful if you're on the cusp (e.g. Prototype + MVP).",
      render: () => (
        <div className="flex flex-wrap gap-1.5">
          {STAGES.map((s) => (
            <Chip
              key={s.id}
              active={inputs.stage.includes(s.id)}
              onClick={() => {
                const next = toggle(inputs.stage, s.id);
                update("stage", (next.length ? next : [s.id]) as Stage[]);
              }}
            >
              {s.label}
            </Chip>
          ))}
        </div>
      ),
    },
    {
      key: "split",
      title: "Allow splitting frontend hosting?",
      subtitle:
        "Default is one platform for everything. Turn this on to also compare hybrid stacks like Supabase + Cloudflare Pages.",
      render: () => (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 p-4">
          <Label htmlFor="wiz-split" className="cursor-pointer text-sm font-medium">
            Compare hybrid stacks
          </Label>
          <Switch
            id="wiz-split"
            checked={inputs.allowSplit ?? false}
            onCheckedChange={(checked) => update("allowSplit", checked)}
          />
        </div>
      ),
    },
    {
      key: "mau",
      title: "Expected monthly active users",
      subtitle: "Current or near-term load — drives cost and scaling weight.",
      render: () => (
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">MAU</span>
            <span className="text-sm font-mono tabular-nums text-foreground">{fmtMau(inputs.mau)}</span>
          </div>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            step={50}
            value={inputs.mau}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (!Number.isFinite(n) || n < 0) return;
              update("mau", Math.min(n, MAU_STEPS[MAU_STEPS.length - 1]));
            }}
            className="text-center font-mono tabular-nums"
            aria-label="Expected monthly active users"
          />
          <Slider
            aria-label="Expected monthly active users slider"
            min={0}
            max={MAU_STEPS.length - 1}
            step={1}
            value={[mauIndex === -1 ? MAU_STEPS.length - 1 : mauIndex]}
            onValueChange={([i]) => update("mau", MAU_STEPS[i])}
          />
        </div>
      ),
    },
    {
      key: "team",
      title: "What are your team's strengths?",
      subtitle: "Influences how much DevOps and infra we'll recommend you take on.",
      render: () => (
        <div className="flex flex-wrap gap-1.5">
          {TEAMS.map((t) => (
            <Chip
              key={t.id}
              active={inputs.team.includes(t.id)}
              onClick={() => {
                const next =
                  t.id === "none"
                    ? (["none"] as TeamSkill[])
                    : toggle(inputs.team.filter((x) => x !== "none"), t.id);
                update("team", next.length ? next : (["none"] as TeamSkill[]));
              }}
            >
              {t.label}
            </Chip>
          ))}
        </div>
      ),
    },
    {
      key: "budget",
      title: "What's your monthly budget?",
      subtitle: "Pick one or more bands if you're flexible on spend.",
      render: () => (
        <div className="flex flex-wrap gap-1.5">
          {BUDGETS.map((b) => (
            <Chip
              key={b.id}
              active={inputs.budget.includes(b.id)}
              onClick={() => {
                const next = toggle(inputs.budget, b.id);
                update("budget", (next.length ? next : [b.id]) as BudgetBand[]);
              }}
            >
              {b.label}
            </Chip>
          ))}
        </div>
      ),
    },
    {
      key: "lockin",
      title: "How much vendor lock-in can you tolerate?",
      subtitle: "How portable does the stack need to be? Pick more than one if you're undecided.",
      render: () => (
        <div className="flex flex-wrap gap-1.5">
          {LOCK_INS.map((l) => (
            <Chip
              key={l.id}
              active={inputs.lockInTolerance.includes(l.id)}
              onClick={() => {
                const next = toggle(inputs.lockInTolerance, l.id);
                update("lockInTolerance", (next.length ? next : [l.id]) as LockInTolerance[]);
              }}
            >
              {l.label}
            </Chip>
          ))}
        </div>
      ),
    },
    {
      key: "compliance",
      title: "Any compliance requirements?",
      subtitle: "Excluded vendors are dropped from the matrix and recommendation.",
      render: () => (
        <div className="flex flex-wrap gap-1.5">
          {COMPLIANCE.map((c) => (
            <Chip
              key={c.id}
              active={inputs.compliance.includes(c.id)}
              onClick={() => {
                const next =
                  c.id === "none"
                    ? (["none"] as Compliance[])
                    : toggle(inputs.compliance.filter((x) => x !== "none"), c.id);
                update("compliance", next.length ? next : (["none"] as Compliance[]));
              }}
            >
              {c.label}
            </Chip>
          ))}
        </div>
      ),
    },
    {
      key: "workloads",
      title: "What kinds of workloads will you run?",
      subtitle: "Reweights criteria like realtime, storage, and compute.",
      render: () => (
        <div className="flex flex-wrap gap-1.5">
          {WORKLOADS.map((w) => (
            <Chip
              key={w.id}
              active={inputs.workloads.includes(w.id)}
              onClick={() => update("workloads", toggle(inputs.workloads, w.id))}
            >
              {w.label}
            </Chip>
          ))}
        </div>
      ),
    },
    {
      key: "ttm",
      title: "How important is time-to-market?",
      subtitle: "Higher = boost options that ship fastest (managed backends).",
      render: () => (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Priority</span>
            <Badge variant="secondary" className="font-mono">{inputs.ttmPriority}/5</Badge>
          </div>
          <Slider
            aria-label="Time-to-market priority"
            min={1}
            max={5}
            step={1}
            value={[inputs.ttmPriority]}
            onValueChange={([v]) => update("ttmPriority", v)}
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Balanced</span>
            <span>Ship ASAP</span>
          </div>
        </div>
      ),
    },
    {
      key: "platforms",
      title: "Which platforms should we compare?",
      subtitle: "Toggle off any you're not willing to consider — they drop out of scoring.",
      render: () => (
        <PlatformsConsidered
          enabled={enabled}
          onToggle={toggleArch}
          onReset={resetEnabled}
          onSetEnabled={setEnabled}
          allowSplit={inputs.allowSplit ?? false}
        />
      ),
    },
  ], [inputs, enabled, mauIndex, setEnabled, toggleArch, resetEnabled]);

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
    setTab("recommendation");
    onOpenChange(false);
  }, [onOpenChange, setTab]);

  const isLast = step === total - 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Step {step + 1} of {total}
            </span>
            <span className="text-xs text-muted-foreground">Setup</span>
          </div>
          <Progress
            value={((step + 1) / total) * 100}
            aria-label={`Wizard progress: step ${step + 1} of ${total}`}
          />
          <DialogTitle className="mt-4 text-xl">{current?.title}</DialogTitle>
          <DialogDescription>{current?.subtitle}</DialogDescription>
        </DialogHeader>

        <div className="py-4">{current?.render()}</div>

        <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {!isLast && (
              <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.min(total - 1, s + 1))}>
                Skip
              </Button>
            )}
            {isLast ? (
              <Button type="button" onClick={finish}>
                <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                See recommendation
              </Button>
            ) : (
              <Button type="button" onClick={() => setStep((s) => Math.min(total - 1, s + 1))}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
