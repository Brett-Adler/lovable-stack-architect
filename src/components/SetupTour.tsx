import { useCallback, useEffect, useState } from "react";
import { Compass, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "stack-architect:setup-tour-open";
const PANEL_ID = "setup-tour-panel";

export function useSetupTour() {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "true") setOpen(true);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: boolean) => {
    setOpen(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      /* ignore */
    }
  }, []);

  return {
    open,
    panelId: PANEL_ID,
    toggle: () => persist(!open),
    close: () => persist(false),
  };
}

export function SetupTourToggle({
  open,
  panelId,
  onToggle,
  className,
}: {
  open: boolean;
  panelId: string;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={panelId}
      className={cn("h-8 gap-1.5 rounded-full text-xs", className)}
    >
      <Compass aria-hidden="true" className="h-3.5 w-3.5" />
      {open ? "Hide tour" : "Take the tour"}
    </Button>
  );
}

const STEPS: { n: number; title: string; body: string }[] = [
  {
    n: 1,
    title: "Step 1 — Project inputs",
    body: "Stage, team, budget, compliance, and workloads. Each answer reweights the scoring.",
  },
  {
    n: 2,
    title: "Step 2 — Platforms to compare",
    body: "Toggle which platforms are weighed. Hidden ones drop out of the matrix and recommendation.",
  },
  {
    n: 3,
    title: "Full comparison matrix",
    body: "Scroll below for supporting evidence — every option scored on the same criteria, with your top pick highlighted.",
  },
  {
    n: 4,
    title: "Recommendation tab",
    body: "Switch to the '3. Recommendation' pill at the top for the final pick, cost & scaling, and architecture.",
  },
];

export function SetupTourPanel({
  panelId,
  onClose,
  className,
}: {
  panelId: string;
  onClose: () => void;
  className?: string;
}) {
  return (
    <section
      id={panelId}
      aria-label="Setup tour"
      className={cn(
        "relative rounded-2xl border border-border bg-card/60 p-4 shadow-sm sm:p-5",
        className,
      )}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close tour"
        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>

      <div className="mb-3 flex items-center gap-2 pr-8">
        <Compass aria-hidden="true" className="h-4 w-4 text-foreground" />
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          A quick tour of Setup
        </h3>
      </div>
      <p className="mb-4 text-xs text-muted-foreground sm:text-sm">
        Four things to know before you tweak anything.
      </p>

      <ol className="grid gap-3 sm:grid-cols-2">
        {STEPS.map((s) => (
          <li key={s.n} className="flex gap-3">
            <span
              aria-hidden="true"
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-bold tabular-nums text-background"
            >
              {s.n}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium leading-tight text-foreground">{s.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
