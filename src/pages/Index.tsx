import { useEffect, useMemo, useState } from "react";
import LZString from "lz-string";
import { InputsPanel } from "@/components/InputsPanel";
import { ComparisonMatrix } from "@/components/ComparisonMatrix";
import { RecommendationCard } from "@/components/RecommendationCard";
import { CostEstimate } from "@/components/CostEstimate";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { ReportExport } from "@/components/ReportExport";
import { SlidersHorizontal, Sparkle, Columns3, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SeoHead } from "@/components/SeoHead";
import { toast } from "sonner";
import { ARCHITECTURES, type ArchId } from "@/data/architectures";
import { DEFAULT_INPUTS, type Inputs, rankFull } from "@/lib/scoring";
import { track } from "@/lib/analytics";

const STORAGE_KEY = "stack-architect:v2";
const DEFAULT_ENABLED: ArchId[] = [
  "lovable-cloud",
  "lovable-supabase",
  "lovable-vercel",
  "lovable-aws",
];
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

const Index = () => {
  const [state, setState] = useState<PersistedState>(() => {
    const { state: s, shareError } = loadState();
    if (shareError) {
      // Defer toast until after mount
      setTimeout(() => toast.error("Couldn't read that share link", { description: "It looks malformed. Starting from defaults." }), 0);
    }
    return { ...s, inputs: migrateInputs(s.inputs), enabled: sanitize(s.enabled) };
  });
  const [mobileTab, setMobileTab] = useState<"inputs" | "recommendation" | "comparison">("recommendation");
  const { inputs, enabled } = state;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const { results, excluded } = useMemo(() => rankFull(inputs), [inputs]);
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

  const shareLink = async () => {
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(state));
    const url = `${window.location.origin}${window.location.pathname}?s=${compressed}`;
    track("Share link", { top: topId ?? "none" });
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied to clipboard");
    } catch {
      window.history.replaceState(null, "", `?s=${compressed}`);
      toast.message("Share link", { description: url });
    }
  };

  return (
    <div className="min-h-dvh bg-background">
      <SeoHead
        title="Stack comparator — Lovable Stack Architect"
        description="Compare 10 hosting and backend platforms side by side. Tune to your stage, budget, team, and workloads."
        path="/app"
      />
      <SiteHeader>
        <ReportExport inputs={inputs} results={results} excluded={excluded} onShare={shareLink} />
      </SiteHeader>
      <h1 className="sr-only">Lovable Stack Architect — Pick the right backend stack for your Lovable app</h1>

      {/* Hero band — matches Landing/Methodology language */}
      <section className="no-print relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-30%] -z-0 h-[420px] w-[900px] -translate-x-1/2 bg-gradient-glow blur-3xl"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1800px] px-3 pt-8 sm:px-6 sm:pt-12 2xl:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-brand-magenta" aria-hidden="true" />
              Stack comparator
            </div>
            <h2 className="text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-4xl md:text-5xl">
              Tune your stack, see the{" "}
              <span className="text-gradient">right pick</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Adjust your stage, team, budget, and workloads on the left. The recommendation,
              cost band, and rankings update live.
            </p>
          </div>
        </div>
      </section>

      {/* Mobile section pill nav */}
      <nav
        className="no-print sticky top-14 z-30 mx-auto w-full max-w-[1800px] px-3 pt-4 sm:px-6 md:hidden"
        aria-label="Switch between Inputs, Recommendation, and Comparison sections"
      >
        <div
          role="tablist"
          aria-label="App sections"
          className="mx-auto grid max-w-md grid-cols-3 gap-1 rounded-full border border-border/60 bg-card/80 p-1 shadow-sm backdrop-blur"
          onKeyDown={(e) => {
            const order = ["inputs", "recommendation", "comparison"] as const;
            const idx = order.indexOf(mobileTab);
            if (e.key === "ArrowRight") {
              e.preventDefault();
              setMobileTab(order[(idx + 1) % order.length]);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              setMobileTab(order[(idx - 1 + order.length) % order.length]);
            } else if (e.key === "Home") {
              e.preventDefault();
              setMobileTab(order[0]);
            } else if (e.key === "End") {
              e.preventDefault();
              setMobileTab(order[order.length - 1]);
            }
          }}
        >
          {([
            { id: "inputs", label: "Inputs", Icon: SlidersHorizontal },
            { id: "recommendation", label: "Pick", Icon: Sparkle },
            { id: "comparison", label: "Compare", Icon: Columns3 },
          ] as const).map(({ id, label, Icon }) => {
            const active = mobileTab === id;
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
                  setMobileTab(id);
                  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                  window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
                }}
                className={cn(
                  "inline-flex min-h-[40px] items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                <span>{label}</span>
                {active && <span className="sr-only"> (current section)</span>}
              </button>
            );
          })}
        </div>
      </nav>

      <main id="main-content" className="mx-auto grid w-full max-w-[1800px] gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-6 md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)_320px] xl:grid-cols-[300px_minmax(0,1fr)_360px] 2xl:gap-8 2xl:px-10 2xl:grid-cols-[320px_minmax(0,1fr)_400px]">

        <div
          id="panel-inputs"
          role="tabpanel"
          aria-labelledby="tab-inputs"
          hidden={mobileTab !== "inputs"}
          className={cn(
            "min-w-0 md:!block md:row-span-2 lg:row-span-1",
            mobileTab === "inputs" ? "block" : "hidden",
          )}
        >
          <InputsPanel inputs={inputs} onChange={setInputs} />
        </div>

        <section
          id="panel-comparison"
          role="tabpanel"
          aria-labelledby="tab-comparison"
          hidden={mobileTab !== "comparison"}
          className={cn(
            "order-3 min-w-0 space-y-4 sm:space-y-6 md:order-2 md:!block lg:order-none",
            mobileTab === "comparison" ? "block" : "hidden",
          )}
        >
          <ComparisonMatrix view="controls" enabled={enabled} topId={topId} onToggle={toggleArch} onSetEnabled={setEnabled} />
          {topId && <ArchitectureDiagram archId={topId} inputs={inputs} />}
        </section>

        <aside
          id="panel-recommendation"
          role="tabpanel"
          aria-labelledby="tab-recommendation"
          hidden={mobileTab !== "recommendation"}
          className={cn(
            "order-2 min-w-0 space-y-4 sm:space-y-6 md:order-1 md:!block md:col-start-2 lg:order-none lg:col-start-auto",
            mobileTab === "recommendation" ? "block" : "hidden",
          )}
        >
          {topId && <CostEstimate archId={topId} inputs={inputs} enabled={enabled} topId={topId} />}
          <RecommendationCard
            results={results}
            inputs={inputs}
            excluded={excluded}
            isNonTechnical={isNonTechnical}
          />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            All four options assume Lovable handles design, frontend dev, testing, and deployment.
            Costs are curated bands, not live quotes — verify against current pricing before committing.
          </p>
        </aside>
      </main>

      <section
        aria-labelledby="full-matrix-heading"
        hidden={mobileTab !== "comparison"}
        className={cn(
          "mx-auto w-full max-w-[1800px] px-3 pb-24 sm:px-6 md:pb-6 2xl:px-10",
          "mt-4 border-t border-border pt-8 sm:mt-8 sm:pt-10",
          mobileTab === "comparison" ? "block" : "hidden md:block",
        )}
      >
        <header className="mb-8 text-center sm:mb-10">
          <h2 id="full-matrix-heading" className="text-3xl font-extrabold tracking-[-0.02em] text-foreground sm:text-4xl">
            Full comparison <span className="text-gradient">matrix</span>
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            See how every option scores on the same criteria. Your top pick is highlighted, and you can scroll horizontally to compare all enabled stacks side by side.
          </p>
        </header>
        <ComparisonMatrix view="matrix" enabled={enabled} topId={topId} onToggle={toggleArch} onSetEnabled={setEnabled} />
      </section>



      {/* Mobile bottom tab nav */}
      <nav
        className="no-print fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden"
        aria-label="Switch between Inputs, Recommendation, and Comparison sections"
      >
        <div
          role="tablist"
          aria-label="App sections"
          className="mx-auto grid max-w-[1400px] grid-cols-3"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          onKeyDown={(e) => {
            const order = ["inputs", "recommendation", "comparison"] as const;
            const idx = order.indexOf(mobileTab);
            if (e.key === "ArrowRight") {
              e.preventDefault();
              setMobileTab(order[(idx + 1) % order.length]);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              setMobileTab(order[(idx - 1 + order.length) % order.length]);
            } else if (e.key === "Home") {
              e.preventDefault();
              setMobileTab(order[0]);
            } else if (e.key === "End") {
              e.preventDefault();
              setMobileTab(order[order.length - 1]);
            }
          }}
        >
          {([
            { id: "inputs", label: "Inputs", Icon: SlidersHorizontal },
            { id: "recommendation", label: "Pick", Icon: Sparkle },
            { id: "comparison", label: "Compare", Icon: Columns3 },
          ] as const).map(({ id, label, Icon }) => {
            const active = mobileTab === id;
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
                  setMobileTab(id);
                  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                  window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
                }}
                className={cn(
                  "flex min-h-[48px] flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon
                  aria-hidden="true"
                  className={cn("h-5 w-5", active && "drop-shadow-[0_0_8px_hsl(var(--primary)/0.4)]")}
                />
                <span>{label}</span>
                {active && <span className="sr-only"> (current section)</span>}
              </button>
            );
          })}
        </div>
      </nav>

      <SiteFooter />
    </div>
  );
};

export default Index;
