import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, HelpCircle, Minus, Plus, Split } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";



type HelpItem = { label: string; description: string };

const HELP: Record<string, HelpItem[]> = {
  stage: [
    { label: "Prototype", description: "Throwaway proof-of-concept; optimize for speed over polish." },
    { label: "MVP", description: "First real version shipped to early users; needs auth + persistence." },
    { label: "Growth", description: "Paying users, real traffic; reliability and cost start to matter." },
    { label: "Scale", description: "Significant load, multiple teams; needs SLAs, observability, hardening." },
  ],
  team: [
    { label: "Frontend", description: "Comfortable with React/TS, CSS, UI work." },
    { label: "Backend", description: "Comfortable writing servers, APIs, and database queries." },
    { label: "DevOps", description: "Can manage infra, CI/CD, containers, networking." },
    { label: "Data", description: "Comfortable with SQL, pipelines, analytics, ML." },
    { label: "Non-technical", description: "Prefer fully managed tools with no code or infra work." },
  ],
  lockIn: [
    { label: "Low", description: "Must stay portable — open standards, easy to migrate off (e.g. plain Postgres, Docker)." },
    { label: "Medium", description: "Some proprietary services OK if migration is feasible." },
    { label: "High", description: "Fine to commit deeply to a vendor's ecosystem for speed and features." },
  ],
  compliance: [
    { label: "None", description: "No formal compliance requirements." },
    { label: "GDPR", description: "EU data protection rules; needs data export/delete, lawful basis, EU-friendly hosting." },
    { label: "HIPAA", description: "US health data; requires BAA with vendors, audit logs, encryption, access controls." },
    { label: "SOC 2", description: "Audited security/availability controls; favors vendors with existing SOC 2 reports." },
    { label: "Data residency", description: "Data must stay in a specific region (e.g. EU-only, US-only)." },
  ],
  workloads: [
    { label: "CRUD app", description: "Standard create/read/update/delete over a database." },
    { label: "Realtime", description: "Live updates, presence, chat, collaborative editing (websockets/pubsub)." },
    { label: "Files / media", description: "Uploading, storing, and serving images, video, or documents." },
    { label: "AI inference", description: "Calling LLMs or ML models from your app." },
    { label: "Background jobs", description: "Queues, scheduled tasks, long-running work outside the request cycle." },
    { label: "Heavy compute / GPU", description: "Training, video encoding, simulations — needs beefy or GPU machines." },
  ],
  ttm: [
    { label: "Lower (1–2)", description: "Speed-to-launch is just one factor; balance with cost, portability, control." },
    { label: "Higher (4–5)", description: "Boost options that ship fastest — typically managed backends and integrated platforms." },
  ],
};

function FieldHelp({ title, items }: { title: string; items: HelpItem[] }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`What do the ${title} options mean?`}
        >
          <HelpCircle aria-hidden="true" className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent role="dialog" align="start" className="w-72 p-3">
        <p className="mb-2 text-xs font-semibold text-foreground">{title}</p>
        <dl className="space-y-2 text-xs">
          {items.map((it) => (
            <div key={it.label}>
              <dt className="font-medium text-foreground">{it.label}</dt>
              <dd className="text-muted-foreground">{it.description}</dd>
            </div>
          ))}
        </dl>
      </PopoverContent>
    </Popover>
  );
}


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

export function InputsPanel({ inputs, onChange }: Props) {

  const [open, setOpen] = useState(true);
  const update = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    onChange({ ...inputs, [key]: value });

  const toggle = <T extends string>(arr: T[], value: T): T[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const mauIndex = Math.max(
    0,
    MAU_STEPS.findIndex((s) => s >= inputs.mau),
  );

  return (
    <aside className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <Collapsible open={open} onOpenChange={setOpen} className="md:!block">
        <div className="flex items-start justify-between gap-2">
          <h2 id="inputs-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Project inputs
          </h2>
          <div className="-mt-1 flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => {
                const previous = inputs;
                onChange(DEFAULT_INPUTS);
                toast("Inputs reset to defaults", {
                  action: { label: "Undo", onClick: () => onChange(previous) },
                });
              }}

              aria-label="Reset all project inputs to defaults"
            >
              Reset inputs
            </Button>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 md:hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={open ? "Collapse project inputs" : "Expand project inputs"}
                aria-expanded={open}
                aria-controls="inputs-content"
              >
                <ChevronDown aria-hidden="true" className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent
          forceMount
          id="inputs-content"
          role="region"
          aria-labelledby="inputs-heading"
          className="hidden data-[state=open]:block md:!block"
        >
          <div className="mt-5 flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label className="text-xs">Stage</Label>
          <FieldHelp title="Stage" items={HELP.stage} />
        </div>
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
        <p className="text-[11px] text-muted-foreground">
          Pick one or more — useful if you're on the cusp (e.g. Prototype + MVP).
        </p>
      </div>

      <div className="space-y-1.5 rounded-xl border border-dashed border-border bg-muted/20 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Split className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <Label htmlFor="allow-split" className="cursor-pointer text-xs font-medium">
              Allow splitting frontend hosting
            </Label>
          </div>
          <Switch
            id="allow-split"
            checked={inputs.allowSplit ?? false}
            onCheckedChange={(checked) => update("allowSplit", checked)}
            aria-label="Allow splitting frontend hosting"
          />
        </div>
        <p className="text-[11px] text-muted-foreground">
          Default is one platform for everything. Turn this on to also compare hybrid stacks like
          Supabase + Cloudflare Pages or Lovable Cloud + Cloudflare Pages.
        </p>
      </div>



      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <Label className="text-xs" htmlFor="mau-input">Expected monthly active users</Label>
          <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
            {fmtMau(inputs.mau)}
          </span>
        </div>
        <div className="flex items-stretch gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 w-10 shrink-0 p-0 sm:h-9 sm:w-9"
            aria-label="Decrease MAU"
            disabled={inputs.mau <= MAU_STEPS[0]}
            onClick={() => {
              const i = MAU_STEPS.findIndex((s) => s >= inputs.mau);
              const next = i <= 0 ? MAU_STEPS[0] : MAU_STEPS[i - 1];
              update("mau", next);
            }}
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Input
            id="mau-input"
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
            className="h-10 min-w-0 flex-1 text-center font-mono tabular-nums sm:h-9"
            aria-label="Expected monthly active users"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 w-10 shrink-0 p-0 sm:h-9 sm:w-9"
            aria-label="Increase MAU"
            disabled={inputs.mau >= MAU_STEPS[MAU_STEPS.length - 1]}
            onClick={() => {
              const i = MAU_STEPS.findIndex((s) => s > inputs.mau);
              const next = i === -1 ? MAU_STEPS[MAU_STEPS.length - 1] : MAU_STEPS[i];
              update("mau", next);
            }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        <Slider
          aria-label="Expected monthly active users slider"
          min={0}
          max={MAU_STEPS.length - 1}
          step={1}
          value={[mauIndex === -1 ? MAU_STEPS.length - 1 : mauIndex]}
          onValueChange={([i]) => update("mau", MAU_STEPS[i])}
        />
        <p className="text-[11px] text-muted-foreground">Current or near-term load — drives cost and scaling weight.</p>
      </div>


      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label className="text-xs">Team strengths</Label>
          <FieldHelp title="Team strengths" items={HELP.team} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TEAMS.map((t) => (
            <Chip
              key={t.id}
              active={inputs.team.includes(t.id)}
              onClick={() => {
                // "Non-technical" is mutually exclusive with technical skills.
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
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Budget</Label>
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
        <p className="text-[11px] text-muted-foreground">
          Pick one or more bands if you're flexible on spend.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label className="text-xs">Lock-in tolerance</Label>
          <FieldHelp title="Lock-in tolerance" items={HELP.lockIn} />
        </div>
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
        <p className="text-[11px] text-muted-foreground">
          How portable does the stack need to be? Pick more than one if you're undecided.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label className="text-xs">Compliance</Label>
          <FieldHelp title="Compliance" items={HELP.compliance} />
        </div>
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
        <div className="flex items-center gap-1.5">
          <Label className="text-xs">Workloads</Label>
          <FieldHelp title="Workloads" items={HELP.workloads} />
        </div>
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
          <div className="flex items-center gap-1.5">
            <Label className="text-xs">Time-to-market priority</Label>
            <FieldHelp title="Time-to-market priority" items={HELP.ttm} />
          </div>
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
        <p className="text-[11px] text-muted-foreground">
          Higher = boost options that ship fastest (managed backends). Lower = treat speed-to-launch as just one factor among many.
        </p>
      </div>

          </div>
        </CollapsibleContent>
      </Collapsible>
    </aside>
  );
}

