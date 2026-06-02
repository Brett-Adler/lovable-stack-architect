import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { buildMermaid, summarizeStack, type StackSummaryRow } from "@/lib/diagram";
import { ARCH_BY_ID, type ArchId } from "@/data/architectures";
import type { Inputs } from "@/lib/scoring";
import { FullscreenCardDialog } from "@/components/FullscreenCardDialog";
import { List } from "lucide-react";

let initialized = false;

function StackSummary({ rows, compact = false }: { rows: StackSummaryRow[]; compact?: boolean }) {
  if (rows.length === 0) return null;
  return (
    <dl
      className={
        compact
          ? "mt-3 grid gap-x-4 gap-y-1.5 text-xs sm:grid-cols-2"
          : "mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2"
      }
    >
      {rows.map((r) => (
        <div key={r.label} className="flex items-baseline justify-between gap-3 border-b border-border/40 py-1">
          <dt className="shrink-0 font-medium uppercase tracking-wider text-muted-foreground text-[10px]">
            {r.label}
          </dt>
          <dd className="text-right text-foreground/90">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}


export function ArchitectureDiagram({ archId, inputs }: { archId: ArchId; inputs: Inputs }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [showSummary, setShowSummary] = useState(false);
  const arch = ARCH_BY_ID[archId];
  const summary = summarizeStack(archId, inputs);

  useEffect(() => {
    if (!initialized) {
      const isDark = document.documentElement.classList.contains("dark");
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        securityLevel: "loose",
        fontFamily: "inherit",
        themeVariables: isDark
          ? {
              primaryColor: "#1f1730",
              primaryTextColor: "#f4f1fb",
              primaryBorderColor: "#E94BD2",
              lineColor: "#a78bd6",
              secondaryColor: "#2a1f3d",
              tertiaryColor: "#1a1428",
              background: "transparent",
              mainBkg: "#1f1730",
              clusterBkg: "#1a1428",
              edgeLabelBackground: "#1a1428",
              fontSize: "14px",
            }
          : {
              primaryColor: "#fdf2fb",
              primaryTextColor: "#1a0f24",
              primaryBorderColor: "#E94BD2",
              lineColor: "#9b4dca",
              secondaryColor: "#f4e8fa",
              tertiaryColor: "#fafafa",
              background: "transparent",
              mainBkg: "#fdf2fb",
              clusterBkg: "#fafafa",
              edgeLabelBackground: "#ffffff",
              fontSize: "14px",
            },
      });
      initialized = true;
    }
    const code = buildMermaid(archId, inputs);
    const id = `diagram-${archId}-${Date.now()}`;
    let cancelled = false;
    mermaid
      .render(id, code)
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg);
      })
      .catch((err) => {
        console.error("Mermaid render failed:", err);
        if (!cancelled) setSvg("");
      })
      .finally(() => {
        document.querySelectorAll(`#d${id}, #${id}`).forEach((n) => n.remove());
      });
    return () => {
      cancelled = true;
    };
  }, [archId, inputs]);

  const Diagram = ({ expanded = false }: { expanded?: boolean }) => (
    <div
      ref={expanded ? undefined : ref}
      role="img"
      aria-label={`Tech stack diagram for ${arch.name}: ${arch.tagline}`}
      className={
        expanded
          ? "flex min-h-[50vh] justify-center overflow-auto [&_svg]:h-auto [&_svg]:max-h-[68vh] [&_svg]:max-w-full"
          : "mt-3 flex max-h-[360px] justify-center overflow-auto [&_svg]:h-auto [&_svg]:max-h-[340px] [&_svg]:max-w-full"
      }
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Tech stack
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Top pick: <span className="font-medium text-foreground">{arch.short}</span>
          </span>
          {summary.length > 0 && (
            <button
              type="button"
              aria-label={showSummary ? "Hide tech stack summary" : "Show tech stack summary"}
              aria-pressed={showSummary}
              onClick={() => setShowSummary((s) => !s)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-pressed:bg-muted aria-pressed:text-foreground"
            >
              <List className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
          <FullscreenCardDialog
            title={`Tech stack — ${arch.name}`}
            ariaLabel="Expand tech stack"
          >
            <Diagram expanded />
            {summary.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Stack summary
                </h4>
                <StackSummary rows={summary} />
              </div>
            )}
            <p className="mt-4 text-xs text-muted-foreground">{arch.description}</p>
          </FullscreenCardDialog>
        </div>
      </div>
      <Diagram />
      {showSummary && summary.length > 0 && (
        <div className="mt-4 border-t border-border pt-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Stack summary
          </h4>
          <StackSummary rows={summary} compact />
        </div>
      )}
      <p className="sr-only">
        Visual diagram. Equivalent description: {arch.description}
      </p>
    </div>
  );
}
