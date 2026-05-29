import { ARCH_BY_ID, type ArchId } from "@/data/architectures";
import type { Inputs } from "@/lib/scoring";
import { stageFromMau } from "@/lib/scoring";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ExternalLink, Info } from "lucide-react";

export function CostEstimate({ archId, inputs }: { archId: ArchId; inputs: Inputs }) {
  const arch = ARCH_BY_ID[archId];
  const stage = stageFromMau(inputs.mau);
  const stageLabel = { prototype: "Prototype", mvp: "MVP", growth: "Growth", scale: "Scale" }[stage];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Cost & scaling
        </h3>
        <span className="text-xs text-muted-foreground">at {stageLabel} scale</span>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-bold text-foreground">
          {arch.costBands[stage]}
        </span>
        <span className="text-xs text-muted-foreground">/ month</span>
        <Popover>
          <PopoverTrigger
            className="ml-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Show sources for cost bands"
          >
            <Info className="h-3 w-3" /> sources
          </PopoverTrigger>
          <PopoverContent side="top" className="w-72 p-3 text-xs">
            <div className="font-semibold text-foreground">Curated cost bands</div>
            <p className="mt-1 text-muted-foreground">
              These are estimates from vendor pricing pages, not live quotes.
              Always verify before committing. Last reviewed {arch.lastReviewed}.
            </p>
            <ul className="mt-2 space-y-1">
              {arch.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" /> {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-1 text-[11px] sm:grid-cols-4">
        {(["prototype", "mvp", "growth", "scale"] as const).map((s) => (
          <div
            key={s}
            className={`rounded-md border px-2 py-1.5 ${
              s === stage ? "border-primary bg-primary/10 text-foreground" : "border-border bg-muted/30 text-muted-foreground"
            }`}
          >
            <div className="font-medium capitalize">{s}</div>
            <div className="font-mono">{arch.costBands[s]}</div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Ceiling:</span> {arch.scaleCeiling}
      </p>
    </div>
  );
}
