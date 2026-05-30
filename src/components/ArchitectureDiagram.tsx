import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { buildMermaid } from "@/lib/diagram";
import { ARCH_BY_ID, type ArchId } from "@/data/architectures";
import type { Inputs } from "@/lib/scoring";

let initialized = false;

export function ArchitectureDiagram({ archId, inputs }: { archId: ArchId; inputs: Inputs }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const arch = ARCH_BY_ID[archId];

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
        // Mermaid appends a temporary measurement node (#d{id}) to <body> and
        // leaves an error SVG behind on failure. Sweep them up.
        document.querySelectorAll(`#d${id}, #${id}`).forEach((n) => n.remove());
      });
    return () => {
      cancelled = true;
    };
  }, [archId, inputs]);

  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Architecture diagram
        </h3>
        <span className="text-xs text-muted-foreground">
          Top pick: <span className="font-medium text-foreground">{arch.short}</span>
        </span>
      </div>
      <div
        ref={ref}
        role="img"
        aria-label={`Architecture diagram for ${arch.name}: ${arch.tagline}`}
        className="mt-3 flex max-h-[420px] justify-center overflow-auto [&_svg]:max-h-[400px] [&_svg]:max-w-full [&_svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p className="sr-only">
        Visual diagram. Equivalent description: {arch.description}
      </p>
    </div>
  );
}
