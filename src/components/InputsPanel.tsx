import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  type Inputs,
  type Stage,
  type BudgetBand,
  type LockInTolerance,
  type TeamSkill,
  type Compliance,
  type Workload,
  DEFAULT_INPUTS,
} from "@/lib/scoring";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Props {
  inputs: Inputs;
  onChange: (next: Inputs) => void;
}

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

// Log scale slider for MAU
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
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-secondary text-secondary-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

export function InputsPanel({ inputs, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const update = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    onChange({ ...inputs, [key]: value });

  const toggle = <T extends string>(arr: T[], value: T): T[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const mauIndex = Math.max(
    0,
    MAU_STEPS.findIndex((s) => s >= inputs.mau),
  );

  return (
    <aside className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
      <Collapsible open={open} onOpenChange={setOpen} className="lg:!block">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Project inputs
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onChange(DEFAULT_INPUTS)}
            >
              Reset
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 lg:hidden" aria-label="Toggle inputs">
                <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent forceMount className="hidden data-[state=open]:block lg:!block">
          <div className="mt-5 flex flex-col gap-6">
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => onChange(DEFAULT_INPUTS)}
        >
          Reset
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Stage</Label>
        <div className="flex flex-wrap gap-1.5">
          {STAGES.map((s) => (
            <Chip key={s.id} active={inputs.stage === s.id} onClick={() => update("stage", s.id)}>
              {s.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Expected monthly active users</Label>
          <span className="text-xs font-mono tabular-nums text-muted-foreground">
            {fmtMau(inputs.mau)}
          </span>
        </div>
        <Slider
          min={0}
          max={MAU_STEPS.length - 1}
          step={1}
          value={[mauIndex === -1 ? MAU_STEPS.length - 1 : mauIndex]}
          onValueChange={([i]) => update("mau", MAU_STEPS[i])}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Team strengths</Label>
        <div className="flex flex-wrap gap-1.5">
          {TEAMS.map((t) => (
            <Chip
              key={t.id}
              active={inputs.team.includes(t.id)}
              onClick={() => update("team", toggle(inputs.team, t.id))}
            >
              {t.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs">Budget</Label>
          <Select value={inputs.budget} onValueChange={(v) => update("budget", v as BudgetBand)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Lock-in tolerance</Label>
          <Select
            value={inputs.lockInTolerance}
            onValueChange={(v) => update("lockInTolerance", v as LockInTolerance)}
          >
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low — must be portable</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High — fine to commit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Compliance</Label>
        <div className="flex flex-wrap gap-1.5">
          {COMPLIANCE.map((c) => (
            <Chip
              key={c.id}
              active={inputs.compliance.includes(c.id)}
              onClick={() => {
                const next =
                  c.id === "none"
                    ? ["none" as Compliance]
                    : toggle(
                        inputs.compliance.filter((x) => x !== "none"),
                        c.id,
                      );
                update("compliance", next.length ? next : (["none"] as Compliance[]));
              }}
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Workloads</Label>
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
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Time-to-market priority</Label>
          <Badge variant="secondary" className="font-mono">{inputs.ttmPriority}/5</Badge>
        </div>
        <Slider
          min={1}
          max={5}
          step={1}
          value={[inputs.ttmPriority]}
          onValueChange={([v]) => update("ttmPriority", v)}
        />
      </div>
    </aside>
  );
}
