import { useEffect, useMemo, useState } from "react";
import LZString from "lz-string";
import { InputsPanel } from "@/components/InputsPanel";
import { ComparisonMatrix } from "@/components/ComparisonMatrix";
import { RecommendationCard } from "@/components/RecommendationCard";
import { CostEstimate } from "@/components/CostEstimate";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { ReportExport } from "@/components/ReportExport";
import { Button } from "@/components/ui/button";
import { Link2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ARCHITECTURES, type ArchId } from "@/data/architectures";
import { DEFAULT_INPUTS, type Inputs, rank } from "@/lib/scoring";

const STORAGE_KEY = "stack-architect:v1";

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
    enabled: ARCHITECTURES.map((a) => a.id),
  };
}

const Index = () => {
  const [state, setState] = useState<PersistedState>(() => loadState());
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
      // Always keep at least one
      return { ...s, enabled: next.length ? next : s.enabled };
    });

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
      <header className="no-print border-b border-border bg-background/70 backdrop-blur">
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
              <Link2 className="h-4 w-4" /> <span className="hidden xs:inline">Share</span>
            </Button>
            <ReportExport inputs={inputs} results={results} />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1400px] gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:grid-cols-[280px_minmax(0,1fr)_340px] xl:grid-cols-[300px_minmax(0,1fr)_360px]">
        <InputsPanel inputs={inputs} onChange={setInputs} />

        <section className="order-3 space-y-4 sm:space-y-6 lg:order-none">
          <div>
            <h2 className="text-base font-semibold text-foreground sm:text-lg">Side-by-side comparison</h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Scores reflect how each architecture handles each criterion. Toggle options below the table.
            </p>
          </div>
          <ComparisonMatrix enabled={enabled} topId={topId} onToggle={toggleArch} />
          {topId && <ArchitectureDiagram archId={topId} inputs={inputs} />}
        </section>

        <aside className="order-2 space-y-4 sm:space-y-6 lg:order-none">
          <RecommendationCard results={results} />
          {topId && <CostEstimate archId={topId} inputs={inputs} />}
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            All four options assume Lovable handles design, frontend dev, testing, and deployment.
            Costs are curated bands, not live quotes — verify against current pricing before committing.
          </p>
        </aside>
      </main>
    </div>
  );
};

export default Index;
