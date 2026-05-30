import { ARCH_BY_ID, type ArchId } from "@/data/architectures";
import type { Inputs } from "@/lib/scoring";
import { stageFromMau } from "@/lib/scoring";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ExternalLink, Info, Flag } from "lucide-react";
import { GITHUB_URL } from "@/lib/constants";

function parseBand(band: string): number | null {
  const cleaned = band.replace(/\$/g, "").replace(/\s/g, "");
  const toNum = (s: string): number | null => {
    if (!s) return null;
    const m = s.match(/^([\d.]+)([km]?)\+?$/i);
    if (!m) return null;
    const n = parseFloat(m[1]);
    if (isNaN(n)) return null;
    const mult = m[2]?.toLowerCase() === "k" ? 1000 : m[2]?.toLowerCase() === "m" ? 1_000_000 : 1;
    return n * mult;
  };
  if (cleaned.includes("–") || cleaned.includes("-")) {
    const [a, b] = cleaned.split(/[–-]/);
    const lo = toNum(a);
    const hi = toNum(b);
    if (lo != null && hi != null) return (lo + hi) / 2;
    return hi ?? lo;
  }
  return toNum(cleaned);
}

export function CostEstimate({
  archId,
  inputs,
  enabled,
  topId,
}: {
  archId: ArchId;
  inputs: Inputs;
  enabled?: ArchId[];
  topId?: ArchId;
}) {
  const arch = ARCH_BY_ID[archId];
  const stage = stageFromMau(inputs.mau);
  const stageLabel = { prototype: "Prototype", mvp: "MVP", growth: "Growth", scale: "Scale" }[stage];

  const compareRows = (enabled ?? [])
    .map((id) => {
      const a = ARCH_BY_ID[id];
      const band = a.costBands[stage];
      return { id, short: a.short, band, mid: parseBand(band) };
    })
    .sort((a, b) => {
      if (a.mid == null && b.mid == null) return 0;
      if (a.mid == null) return 1;
      if (b.mid == null) return -1;
      return a.mid - b.mid;
    });
  const maxMid = Math.max(...compareRows.map((r) => r.mid ?? 0), 1);


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
            {GITHUB_URL && (
              <a
                href={`${GITHUB_URL}/issues/new?title=${encodeURIComponent(
                  `Cost correction: ${arch.name}`,
                )}&body=${encodeURIComponent(
                  `Stage: ${stageLabel}\nCurrent band: ${arch.costBands[stage]}\nSuggested band: \nSource: `,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground hover:underline"
              >
                <Flag className="h-3 w-3" /> Suggest a correction
              </a>
            )}
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

      {compareRows.length > 1 && (
        <div className="mt-5 border-t border-border pt-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Compare at {stageLabel} scale
            </h4>
            <span className="text-[10px] text-muted-foreground">/ month</span>
          </div>
          <ul className="space-y-1.5">
            {compareRows.map((r) => {
              const isTop = r.id === topId;
              const pct = r.mid != null ? Math.max(4, (r.mid / maxMid) * 100) : 0;
              return (
                <li key={r.id} className="flex items-center gap-2 text-xs">
                  <div className="flex w-24 shrink-0 items-center gap-1.5">
                    <span className={isTop ? "font-semibold text-foreground" : "text-foreground/80"}>
                      {r.short}
                    </span>
                    {isTop && (
                      <span className="rounded-sm bg-primary/15 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
                        Top
                      </span>
                    )}
                  </div>
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted/40">
                    {r.mid != null && (
                      <div
                        className={`h-full rounded-full ${isTop ? "bg-gradient-primary" : "bg-foreground/30"}`}
                        style={{ width: `${pct}%` }}
                      />
                    )}
                  </div>
                  <span className="w-20 shrink-0 text-right font-mono text-foreground/90">{r.band}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Ceiling:</span> {arch.scaleCeiling}
      </p>

    </div>
  );
}
