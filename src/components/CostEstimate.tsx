import { ARCH_BY_ID, type ArchId } from "@/data/architectures";
import type { Inputs } from "@/lib/scoring";
import { stageFromMau } from "@/lib/scoring";

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
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1 text-[11px]">
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
