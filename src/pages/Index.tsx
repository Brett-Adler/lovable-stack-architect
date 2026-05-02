import { useEffect, useMemo, useState } from "react";
import LZString from "lz-string";
import { InputsPanel } from "@/components/InputsPanel";
import { ComparisonMatrix } from "@/components/ComparisonMatrix";
import { RecommendationCard } from "@/components/RecommendationCard";
import { CostEstimate } from "@/components/CostEstimate";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { ReportExport } from "@/components/ReportExport";
import { Button } from "@/components/ui/button";
import { Link2, Sparkles, SlidersHorizontal, Sparkle, Columns3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ARCHITECTURES, type ArchId } from "@/data/architectures";
import { DEFAULT_INPUTS, type Inputs, rank } from "@/lib/scoring";

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

interface PersistedState {
  inputs: Inputs;
  enabled: ArchId[];
}

function loadState(): PersistedState {
  // URL takes precedence
  const params = new URLSearchParams(window.location.search);
  const s = params.get("s");
  if (s) {
    try {
      const json = LZString.decompressFromEncodedURIComponent(s);
      if (json) return JSON.parse(json) as PersistedState;
    } catch {
      /* ignore */
    }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PersistedState;
  } catch {
    /* ignore */
  }
  return {
    inputs: DEFAULT_INPUTS,
    enabled: DEFAULT_ENABLED,
  };
}

const Index = () => {
  const [state, setState] = useState<PersistedState>(() => {
    const s = loadState();
    return { ...s, enabled: sanitize(s.enabled) };
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

  const results = useMemo(() => rank(inputs), [inputs]);
  const topId = results[0]?.arch.id;

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
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied to clipboard");
    } catch {
      window.history.replaceState(null, "", `?s=${compressed}`);
      toast.message("Share link", { description: url });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="no-print sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold leading-tight text-foreground sm:text-lg">
                Stack Architect
              </h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Pick the right backend for your Lovable app
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={shareLink} variant="outline" size="sm" className="gap-1.5">
              <Link2 className="h-4 w-4" /> <span className="hidden sm:inline">Share</span>
            </Button>
            <ReportExport inputs={inputs} results={results} />
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1400px] gap-4 px-3 py-4 pb-24 sm:gap-6 sm:px-6 sm:py-6 lg:grid-cols-[280px_minmax(0,1fr)_340px] lg:pb-6 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
        <div
          id="panel-inputs"
          role="tabpanel"
          aria-labelledby="tab-inputs"
          hidden={mobileTab !== "inputs"}
          className={cn("min-w-0 lg:!block", mobileTab === "inputs" ? "block" : "hidden")}
        >
          <InputsPanel inputs={inputs} onChange={setInputs} />
        </div>

        <section
          id="panel-comparison"
          role="tabpanel"
          aria-labelledby="tab-comparison"
          hidden={mobileTab !== "comparison"}
          className={cn(
            "order-3 min-w-0 space-y-4 sm:space-y-6 lg:order-none lg:!block",
            mobileTab === "comparison" ? "block" : "hidden",
          )}
        >
          <div>
            <h2 className="text-base font-semibold text-foreground sm:text-lg">Side-by-side comparison</h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Scores reflect how each architecture handles each criterion. Toggle options below the table.
            </p>
          </div>
          <ComparisonMatrix enabled={enabled} topId={topId} onToggle={toggleArch} />
          {topId && <ArchitectureDiagram archId={topId} inputs={inputs} />}
        </section>

        <aside
          id="panel-recommendation"
          role="tabpanel"
          aria-labelledby="tab-recommendation"
          hidden={mobileTab !== "recommendation"}
          className={cn(
            "order-2 min-w-0 space-y-4 sm:space-y-6 lg:order-none lg:!block",
            mobileTab === "recommendation" ? "block" : "hidden",
          )}
        >
          <RecommendationCard results={results} />
          {topId && <CostEstimate archId={topId} inputs={inputs} />}
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            All four options assume Lovable handles design, frontend dev, testing, and deployment.
            Costs are curated bands, not live quotes — verify against current pricing before committing.
          </p>
        </aside>
      </main>

      {/* Mobile bottom tab nav */}
      <nav
        className="no-print fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden"
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
                  window.scrollTo({ top: 0, behavior: "smooth" });
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
    </div>
  );
};

export default Index;
