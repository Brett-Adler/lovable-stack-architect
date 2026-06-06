import { useEffect, useMemo, useState } from "react";
import LZString from "lz-string";
import { InputsPanel } from "@/components/InputsPanel";
import { ComparisonMatrix } from "@/components/ComparisonMatrix";
import { RecommendationCard } from "@/components/RecommendationCard";
import { PlatformsConsidered } from "@/components/PlatformsConsidered";
import { CostEstimate } from "@/components/CostEstimate";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { ReportExport } from "@/components/ReportExport";
import { SlidersHorizontal, Sparkle, ShieldAlert, HelpCircle, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SetupWizard } from "@/components/SetupWizard";
import { ResultsWalkthrough } from "@/components/ResultsWalkthrough";
import { FullscreenCardDialog } from "@/components/FullscreenCardDialog";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SeoHead } from "@/components/SeoHead";
import { toast } from "sonner";
import { ARCHITECTURES, type ArchId } from "@/data/architectures";
import { DEFAULT_INPUTS, type Inputs, rankFull } from "@/lib/scoring";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/** Small `?` help affordance — renders next to a heading and opens a popover. */
function HelpHint({ label, title, body }: { label: string; title?: string; body: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="max-w-xs text-sm">
        {title && <p className="mb-1 font-semibold text-foreground">{title}</p>}
        <p className="text-muted-foreground">{body}</p>
      </PopoverContent>
    </Popover>
  );
}


const STORAGE_KEY = "stack-architect:v2";
const DEFAULT_ENABLED: ArchId[] = ARCHITECTURES.map((a) => a.id);
const VALID_IDS = new Set<ArchId>(ARCHITECTURES.map((a) => a.id));
function sanitize(ids: ArchId[] | undefined): ArchId[] {
  const filtered = (ids ?? []).filter((id) => VALID_IDS.has(id));
  return filtered.length ? filtered : DEFAULT_ENABLED;
}

// Backwards-compat: older share links / localStorage had scalar values for
// stage / budget / lockInTolerance. Coerce them into arrays.
function migrateInputs(raw: unknown): Inputs {
  const i = { ...DEFAULT_INPUTS, ...(raw as Partial<Inputs> & Record<string, unknown>) };
  const arr = <T,>(v: unknown, fallback: T[]): T[] =>
    Array.isArray(v) ? (v as T[]) : v != null ? [v as T] : fallback;
  return {
    ...i,
    stage: arr(i.stage, DEFAULT_INPUTS.stage),
    budget: arr(i.budget, DEFAULT_INPUTS.budget),
    lockInTolerance: arr(i.lockInTolerance, DEFAULT_INPUTS.lockInTolerance),
    team: Array.isArray(i.team) ? i.team : DEFAULT_INPUTS.team,
    compliance: Array.isArray(i.compliance) ? i.compliance : DEFAULT_INPUTS.compliance,
    workloads: Array.isArray(i.workloads) ? i.workloads : DEFAULT_INPUTS.workloads,
  };
}

interface PersistedState {
  inputs: Inputs;
  enabled: ArchId[];
}

function loadState(): { state: PersistedState; shareError: boolean } {
  // URL takes precedence
  const params = new URLSearchParams(window.location.search);
  const s = params.get("s");
  if (s) {
    try {
      const json = LZString.decompressFromEncodedURIComponent(s);
      if (json) return { state: JSON.parse(json) as PersistedState, shareError: false };
      return { state: { inputs: DEFAULT_INPUTS, enabled: DEFAULT_ENABLED }, shareError: true };
    } catch {
      return { state: { inputs: DEFAULT_INPUTS, enabled: DEFAULT_ENABLED }, shareError: true };
    }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { state: JSON.parse(raw) as PersistedState, shareError: false };
  } catch {
    /* ignore */
  }
  return {
    state: { inputs: DEFAULT_INPUTS, enabled: DEFAULT_ENABLED },
    shareError: false,
  };
}

/** Step section shell — numbered badge + title + subtitle, consistent across steps 1/2/3. */
function StepShell({
  number,
  title,
  subtitle,
  id,
  className,
  help,
  children,
}: {
  number: 1 | 2 | 3;
  title: string;
  subtitle: string;
  id?: string;
  className?: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("min-w-0", className)}>
      <header className="mb-4 sm:mb-5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold tabular-nums text-background sm:h-8 sm:w-8 sm:text-sm"
          >
            {number}
          </span>
          <h2 className="text-lg font-bold tracking-[-0.01em] text-foreground sm:text-xl">
            <span className="sr-only">Step {number}: </span>
            {title}
          </h2>
          {help && (
            <span className="ml-auto">
              <HelpHint label={`Help: ${title}`} title={title} body={help} />
            </span>
          )}
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground sm:ml-11">{subtitle}</p>
      </header>
      {children}
    </section>
  );
}

const Index = () => {
  const [state, setState] = useState<PersistedState>(() => {
    const { state: s, shareError } = loadState();
    if (shareError) {
      // Defer toast until after mount
      setTimeout(() => toast.error("Couldn't read that share link", { description: "It looks malformed. Starting from defaults." }), 0);
    }
    return { ...s, inputs: migrateInputs(s.inputs), enabled: sanitize(s.enabled) };
  });
  type TabId = "setup" | "recommendation";
  const VALID_TABS: readonly TabId[] = ["setup", "recommendation"] as const;
  const getInitialTab = (): TabId => {
    if (typeof window === "undefined") return "setup";
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab");
    // Migrate legacy values
    if (t === "inputs" || t === "comparison") return "setup";
    return (VALID_TABS as readonly string[]).includes(t ?? "") ? (t as TabId) : "setup";
  };
  const [tab, setTab] = useState<TabId>(getInitialTab);
  const { inputs, enabled } = state;
  const [wizardOpen, setWizardOpen] = useState(false);
  const [resultsWalkOpen, setResultsWalkOpen] = useState(false);

  


  

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  // Sync ?tab= to URL (without polluting history) and scroll the panel into view on desktop
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") !== tab) {
      params.set("tab", tab);
      const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
      window.history.replaceState(null, "", newUrl);
    }
  }, [tab]);

  // On initial mount, if a ?tab= deep link is present, scroll the corresponding panel into view
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab");
    if (!t) return;
    const target = t === "inputs" || t === "comparison" ? "setup" : t;
    const el = document.getElementById(`panel-${target}`);
    if (el) {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requestAnimationFrame(() =>
        el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { results, excluded, userExcluded } = useMemo(
    () => rankFull(inputs, { enabled }),
    [inputs, enabled],
  );
  const topId = results[0]?.arch.id;
  const isNonTechnical = inputs.team.length === 0 || (inputs.team.length === 1 && inputs.team[0] === "none");

  const setInputs = (next: Inputs) => setState((s) => ({ ...s, inputs: next }));
  const toggleArch = (id: ArchId) =>
    setState((s) => {
      const has = s.enabled.includes(id);
      const next = has ? s.enabled.filter((x) => x !== id) : [...s.enabled, id];
      return { ...s, enabled: next };
    });
  const setEnabled = (next: ArchId[]) =>
    setState((s) => ({ ...s, enabled: next }));

  const shareUrl = useMemo(() => {
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(state));
    return `${window.location.origin}${window.location.pathname}?s=${compressed}`;
  }, [state]);

  return (
    <div className="min-h-dvh bg-background">
      <SeoHead
        title="Stack comparator — Lovable Stack Architect"
        description="Compare 11 backend and hosting platforms side by side. Tune to your stage, budget, team, and workloads to find the right pick."
        path="/app"
      />
      <SiteHeader />
      <h1 className="sr-only">Lovable Stack Architect — Pick the right backend stack for your Lovable app</h1>

      {/* Tight hero — three-step framing */}
      <section className="no-print relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-50%] -z-0 hidden h-[260px] w-[900px] -translate-x-1/2 bg-gradient-glow blur-3xl md:block"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1800px] px-3 pt-3 pb-2 sm:px-6 sm:pt-6 sm:pb-3 2xl:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-extrabold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl">
              Tune your stack, see the <span className="text-gradient">right pick</span>
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-xs text-muted-foreground sm:text-sm">
              Three steps: tell us about your project, choose what to compare, see your recommendation.
            </p>
          </div>
        </div>
      </section>

      {/* Step pill nav — two tabs across all breakpoints */}
      <nav
        className="no-print sticky top-12 z-30 mx-auto w-full max-w-[1800px] px-3 pt-4 sm:top-14 sm:px-6"
        aria-label="Switch between project steps"
      >
        <div
          role="tablist"
          aria-label="Step sections"
          className="mx-auto grid max-w-lg grid-cols-2 gap-1 rounded-full border border-border/60 bg-card/80 p-1 shadow-sm backdrop-blur"
          onKeyDown={(e) => {
            const order = ["setup", "recommendation"] as const;
            const idx = order.indexOf(tab);
            if (e.key === "ArrowRight") {
              e.preventDefault();
              setTab(order[(idx + 1) % order.length]);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              setTab(order[(idx - 1 + order.length) % order.length]);
            } else if (e.key === "Home") {
              e.preventDefault();
              setTab(order[0]);
            } else if (e.key === "End") {
              e.preventDefault();
              setTab(order[order.length - 1]);
            }
          }}
        >
          {([
            { id: "setup", label: "Setup", numLabel: "1–2", Icon: SlidersHorizontal },
            { id: "recommendation", label: "Recommendation", numLabel: "3", Icon: Sparkle },
          ] as const).map(({ id, label, numLabel, Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                id={`tab-${id}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => {
                  setTab(id);
                  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                  window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
                }}
                className={cn(
                  "inline-flex min-h-[40px] items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors sm:text-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                <span>
                  <span className="opacity-70">{numLabel}.</span> {label}
                </span>
                {active && <span className="sr-only"> (current step)</span>}
              </button>
            );
          })}
        </div>
      </nav>

      <main
        id="main-content"
        className="mx-auto w-full max-w-[1800px] px-3 py-4 sm:px-6 sm:py-6 2xl:px-10"
      >
        {tab === "setup" && (
          <div className="mb-4 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setWizardOpen(true)}
              className="gap-2"
            >
              <Wand2 className="h-4 w-4" aria-hidden="true" />
              Guided wizard
            </Button>
          </div>
        )}

        {/* TAB A — Setup: Steps 1 & 2 side-by-side on wide screens */}
        <div
          id="panel-setup"
          role="tabpanel"
          aria-labelledby="tab-setup"
          hidden={tab !== "setup"}
          className={tab === "setup" ? "grid items-start gap-8 sm:gap-10 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(0,500px)_minmax(0,1fr)] xl:gap-12" : "hidden"}
        >
          <StepShell
            number={1}
            title="Tell us about your project"
            subtitle="Stage, team, budget, compliance, and workloads. Every answer nudges the scoring."
            className="lg:sticky lg:top-28"
            help="Stage, team, budget, compliance, and workloads. Each answer reweights the scoring."
          >
            <InputsPanel inputs={inputs} onChange={setInputs} />
          </StepShell>

          <StepShell
            number={2}
            title="Choose what to compare"
            subtitle="Pick which platforms to weigh against each other. Exclusions hide them from the matrix and recommendation."
            help="Toggle which platforms are weighed. Hidden ones drop out of the matrix and recommendation."
          >
            <div className="space-y-3">
              <PlatformsConsidered
                enabled={enabled}
                onToggle={toggleArch}
                onReset={() => setEnabled(DEFAULT_ENABLED)}
                onSetEnabled={setEnabled}
                allowSplit={inputs.allowSplit ?? false}
              />

              {excluded.length > 0 && (
                <div
                  role="status"
                  className="flex items-start gap-2 rounded-xl border border-warning/40 bg-warning/5 px-3 py-2 text-xs text-foreground/90"
                >
                  <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" aria-hidden="true" />
                  <span>
                    <span className="font-medium">{excluded.length}</span> option
                    {excluded.length === 1 ? "" : "s"} hidden by your compliance requirement (
                    {excluded.map((e) => e.arch.short).join(", ")}). Adjust compliance to compare them.
                  </span>
                </div>
              )}

              <ComparisonMatrix
                view="controls"
                enabled={enabled}
                topId={topId}
                onToggle={toggleArch}
                onSetEnabled={setEnabled}
              />
            </div>
          </StepShell>
        </div>



        {/* TAB B — Recommendation: Step 3 self-splits when wide */}
        <div
          id="panel-recommendation"
          role="tabpanel"
          aria-labelledby="tab-recommendation"
          hidden={tab !== "recommendation"}
          className={tab === "recommendation" ? undefined : "hidden"}
        >
          {tab === "recommendation" && (
            <div className="mb-4 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setResultsWalkOpen(true)}
                className="gap-2"
              >
                <Wand2 className="h-4 w-4" aria-hidden="true" />
                Walk me through the results
              </Button>
            </div>
          )}
          <StepShell
            number={3}
            title="Your recommendation"
            subtitle="Based on your inputs and the platforms you're comparing. Updates live as you tweak setup."
            help="Your top pick based on inputs and platforms you're comparing, plus cost & scaling and the architecture diagram. Updates live."
          >
            <div className="grid gap-4 sm:gap-6 md:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_440px]">
              <div className="min-w-0 space-y-4 sm:space-y-6">
                <RecommendationCard
                  results={results}
                  inputs={inputs}
                  excluded={excluded}
                  userExcluded={userExcluded}
                  isNonTechnical={isNonTechnical}
                  onExclude={toggleArch}
                  onResetEnabled={() => setEnabled(DEFAULT_ENABLED)}
                />
              </div>
              <aside aria-label="Cost & scaling and tech stack for top pick" className="min-w-0 space-y-4 sm:space-y-6">
                {topId && <CostEstimate archId={topId} inputs={inputs} enabled={enabled} topId={topId} />}
                {topId && <ArchitectureDiagram archId={topId} inputs={inputs} />}
              </aside>
            </div>

            <div className="mt-4 sm:mt-6">
              <ReportExport inputs={inputs} results={results} excluded={excluded} userExcluded={userExcluded} shareUrl={shareUrl} />
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
              All options shown assume Lovable handles design, frontend dev, testing, and deployment.
              Costs are curated bands, not live quotes — verify against current pricing before committing.
            </p>
          </StepShell>
        </div>
      </main>



      {/* Supporting evidence — full matrix below, shown under the Setup tab */}
      <section
        aria-labelledby="full-matrix-heading"
        hidden={tab !== "setup"}
        className={cn(
          "mx-auto w-full max-w-[1800px] px-3 pb-6 sm:px-6 2xl:px-10",
          "mt-4 border-t border-border pt-8 sm:mt-8 sm:pt-10",
          tab !== "setup" && "hidden",
        )}
      >
        <header className="mb-8 text-center sm:mb-10">
          <div className="flex items-center justify-center gap-2">
            <h2 id="full-matrix-heading" className="text-3xl font-extrabold tracking-[-0.02em] text-foreground sm:text-4xl">
              Full comparison <span className="text-gradient">matrix</span>
            </h2>
            <HelpHint
              label="Help: Full comparison matrix"
              title="Full comparison matrix"
              body="Supporting evidence — every option scored on the same criteria, with your top pick highlighted."
            />
            <FullscreenCardDialog
              title="Full comparison matrix"
              ariaLabel="Expand full comparison matrix"
              maxWidthClass="max-w-[1600px]"
            >
              <div className="overflow-x-auto">
                <ComparisonMatrix
                  view="matrix"
                  enabled={enabled}
                  topId={topId}
                  onToggle={toggleArch}
                  onSetEnabled={setEnabled}
                />
              </div>
            </FullscreenCardDialog>
          </div>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Supporting evidence behind the recommendation. See how every option scores on the same criteria — your top pick is highlighted.
          </p>
        </header>
        <ComparisonMatrix view="matrix" enabled={enabled} topId={topId} onToggle={toggleArch} onSetEnabled={setEnabled} />
      </section>

      <SetupWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        inputs={inputs}
        setInputs={setInputs}
        enabled={enabled}
        setEnabled={setEnabled}
        toggleArch={toggleArch}
        resetEnabled={() => setEnabled(DEFAULT_ENABLED)}
        setTab={setTab}
      />
      <ResultsWalkthrough
        open={resultsWalkOpen}
        onOpenChange={setResultsWalkOpen}
        inputs={inputs}
        setInputs={setInputs}
        enabled={enabled}
        setEnabled={setEnabled}
        toggleArch={toggleArch}
        resetEnabled={() => setEnabled(DEFAULT_ENABLED)}
        setTab={setTab}
      />
      <SiteFooter />
    </div>
  );
};

export default Index;
