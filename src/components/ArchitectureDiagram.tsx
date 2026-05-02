import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { buildMermaid } from "@/lib/diagram";
import type { ArchId } from "@/data/architectures";
import type { Inputs } from "@/lib/scoring";

let initialized = false;

export function ArchitectureDiagram({ archId, inputs }: { archId: ArchId; inputs: Inputs }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

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
    mermaid
      .render(id, code)
      .then(({ svg }) => setSvg(svg))
      .catch(() => setSvg(""));
  }, [archId, inputs]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Architecture diagram
      </h3>
      <div
        ref={ref}
        className="mt-3 flex justify-center overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
