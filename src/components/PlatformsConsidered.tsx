import { useMemo } from "react";
import { ARCHITECTURES, type ArchId } from "@/data/architectures";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

const TOP_PICKS: ArchId[] = ["lovable-cloud", "lovable-supabase", "lovable-vercel", "lovable-aws"];

interface Props {
  enabled: ArchId[];
  onToggle: (id: ArchId) => void;
  onReset: () => void;
  onSetEnabled?: (ids: ArchId[]) => void;
  /** When false, hybrid (split-services) entries are hidden from the picker. */
  allowSplit?: boolean;
  className?: string;
}


export function PlatformsConsidered({ enabled, onToggle, onReset, onSetEnabled, allowSplit = false, className }: Props) {
  const catalog = useMemo(
    () => ARCHITECTURES.filter((a) => allowSplit || !a.hybrid),
    [allowSplit],
  );
  const total = catalog.length;
  const enabledSet = useMemo(() => new Set(enabled), [enabled]);
  const activeArchs = useMemo(
    () => catalog.filter((a) => enabledSet.has(a.id)),
    [catalog, enabledSet],
  );
  const excludedArchs = useMemo(
    () => catalog.filter((a) => !enabledSet.has(a.id)),
    [catalog, enabledSet],
  );


  const isEmpty = activeArchs.length === 0;
  const isFull = excludedArchs.length === 0;

  return (
    <section
      aria-label="Platforms being considered"
      className={cn(
        "rounded-2xl border border-border bg-card/60 p-3 shadow-sm sm:p-4",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {isEmpty ? (
            <>No platforms selected — reset to compare all {total}</>
          ) : (
            <>
              Considering{" "}
              <span className="text-foreground">{activeArchs.length}</span> of {total} platforms
            </>
          )}
        </div>
        {!isFull && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={onReset}
            aria-label="Reset to compare all platforms"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            Reset
          </Button>
        )}
      </div>

      {activeArchs.length > 0 && (
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {activeArchs.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => onToggle(a.id)}
                aria-label={`Remove ${a.short} from comparison`}
                className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <BrandMark archId={a.id} size="sm" />
                <span className="font-medium">{a.short}</span>
                <X
                  className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-destructive"
                  aria-hidden="true"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {excludedArchs.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 border-t border-border/60 pt-2.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Excluded
          </span>
          <ul className="flex flex-wrap gap-1.5">
            {excludedArchs.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => onToggle(a.id)}
                  aria-label={`Add ${a.short} back to comparison`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-dashed border-border bg-transparent px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <BrandMark archId={a.id} size="sm" />
                  <span>{a.short}</span>
                  <Plus
                    className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-primary"
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
