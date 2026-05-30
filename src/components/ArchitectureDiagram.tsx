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
        theme: isDark ? "dark" : "neutral",
        securityLevel: "loose",
        fontFamily: "inherit",
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
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Architecture diagram
      </h3>
      <div
        ref={ref}
        role="img"
        aria-label={`Architecture diagram for ${arch.name}: ${arch.tagline}`}
        className="mt-3 flex justify-center overflow-x-auto [&_svg]:max-w-full [&_svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p className="sr-only">
        Visual diagram. Equivalent description: {arch.description}
      </p>
    </div>
  );
}
