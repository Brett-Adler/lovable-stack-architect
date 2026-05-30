import { Camera } from "lucide-react";

type Variant =
  | "recommendation"
  | "matrix"
  | "inputs-panel"
  | "report-export"
  | "diagram";

interface Props {
  variant: Variant;
  caption?: string;
  hint?: string;
  aspect?: "video" | "wide" | "square" | "portrait";
  url?: string;
}

const DEFAULTS: Record<
  Variant,
  { caption: string; hint: string; aspect: Props["aspect"]; url: string }
> = {
  recommendation: {
    caption: "The tool, at a glance",
    hint: "Wide shot of /app with all three columns visible: inputs left, recommendation + cost middle, architecture diagram right. Capture at 1440×900, default preset loaded.",
    aspect: "wide",
    url: "stack-architect.app/app",
  },
  matrix: {
    caption: "Full comparison matrix",
    hint: "Scroll /app to the full-width matrix section. Capture at 1600×900 so all 10 columns are visible; top-pick column subtly highlighted.",
    aspect: "video",
    url: "stack-architect.app/app#matrix",
  },
  "inputs-panel": {
    caption: "The inputs that move the score",
    hint: "Close-up crop (~700×900) of the project-inputs panel with one preset loaded — sliders mid-range, multi-select chips visible.",
    aspect: "portrait",
    url: "stack-architect.app/app",
  },
  "report-export": {
    caption: "Summary & export",
    hint: "Open the in-app Summary modal with a top-pick + runners-up visible. Capture at 1440×900.",
    aspect: "wide",
    url: "stack-architect.app/app",
  },
  diagram: {
    caption: "Architecture diagram",
    hint: "Close-up (~900×600) of the architecture diagram for the top pick.",
    aspect: "video",
    url: "stack-architect.app/app",
  },
};

const ASPECT_CLASS: Record<NonNullable<Props["aspect"]>, string> = {
  video: "aspect-video",
  wide: "aspect-[16/10]",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
};

function Sketch({ variant }: { variant: Variant }) {
  if (variant === "recommendation") {
    return (
      <div className="grid h-full grid-cols-12 gap-3 p-4 sm:gap-4 sm:p-6">
        {/* Left rail */}
        <div className="col-span-3 space-y-2">
          <div className="h-3 w-2/3 rounded bg-foreground/15" />
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="space-y-1.5 rounded-lg border border-border bg-card/60 p-2">
              <div className="h-1.5 w-1/2 rounded bg-foreground/15" />
              <div className="h-3 rounded bg-foreground/10" />
            </div>
          ))}
        </div>
        {/* Middle */}
        <div className="col-span-5 space-y-3">
          <div className="rounded-xl border border-border bg-card/70 p-3">
            <div className="mb-2 h-2 w-1/3 rounded bg-foreground/15" />
            <div className="mb-3 h-6 w-2/3 rounded bg-gradient-primary opacity-60" />
            <div className="space-y-1.5">
              <div className="h-1.5 w-full rounded bg-foreground/10" />
              <div className="h-1.5 w-5/6 rounded bg-foreground/10" />
              <div className="h-1.5 w-4/6 rounded bg-foreground/10" />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card/70 p-3">
            <div className="mb-2 h-2 w-1/4 rounded bg-foreground/15" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 rounded-md bg-foreground/10" />
              ))}
            </div>
          </div>
        </div>
        {/* Right diagram */}
        <div className="col-span-4 rounded-xl border border-border bg-card/70 p-3">
          <div className="mb-3 h-2 w-1/3 rounded bg-foreground/15" />
          <div className="relative h-[calc(100%-1rem)]">
            <div className="absolute left-1/2 top-2 h-6 w-16 -translate-x-1/2 rounded-md bg-foreground/15" />
            <div className="absolute left-2 top-1/2 h-6 w-12 rounded-md bg-foreground/10" />
            <div className="absolute right-2 top-1/2 h-6 w-12 rounded-md bg-foreground/10" />
            <div className="absolute bottom-2 left-1/2 h-6 w-20 -translate-x-1/2 rounded-md bg-gradient-primary opacity-50" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "matrix") {
    return (
      <div className="flex h-full flex-col gap-2 p-4 sm:p-6">
        <div className="grid grid-cols-11 gap-1.5">
          <div className="h-4 rounded bg-foreground/15" />
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`h-4 rounded ${i === 2 ? "bg-gradient-primary opacity-70" : "bg-foreground/10"}`}
            />
          ))}
        </div>
        <div className="flex-1 space-y-1.5 overflow-hidden">
          {Array.from({ length: 12 }).map((_, r) => (
            <div key={r} className="grid grid-cols-11 gap-1.5">
              <div className="h-3 rounded bg-foreground/15" />
              {Array.from({ length: 10 }).map((_, c) => (
                <div
                  key={c}
                  className={`h-3 rounded ${
                    c === 2 ? "bg-primary/30" : "bg-foreground/8 bg-foreground/10"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "inputs-panel") {
    return (
      <div className="space-y-3 p-4 sm:p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card/70 p-3">
            <div className="mb-2 h-2 w-1/3 rounded bg-foreground/15" />
            <div className="mb-2 flex flex-wrap gap-1.5">
              {Array.from({ length: 4 }).map((_, c) => (
                <div
                  key={c}
                  className={`h-5 w-14 rounded-full ${c === 1 ? "bg-gradient-primary opacity-60" : "bg-foreground/10"}`}
                />
              ))}
            </div>
            <div className="h-1.5 w-full rounded-full bg-foreground/10">
              <div className="h-1.5 w-1/3 rounded-full bg-gradient-primary opacity-70" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "report-export") {
    return (
      <div className="flex h-full flex-col gap-3 p-4 sm:p-6">
        <div className="h-5 w-1/2 rounded bg-foreground/15" />
        <div className="h-12 w-32 rounded-lg bg-gradient-primary opacity-60" />
        <div className="flex-1 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary/50" />
              <div className="h-2 flex-1 rounded bg-foreground/10" />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="h-7 w-20 rounded-md bg-foreground/15" />
          <div className="h-7 w-20 rounded-md bg-foreground/10" />
        </div>
      </div>
    );
  }

  // diagram
  return (
    <div className="relative h-full p-6">
      <div className="grid h-full grid-rows-2 items-center">
        <div className="flex justify-around">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 rounded-lg border border-border bg-card/70"
            />
          ))}
        </div>
        <div className="flex justify-around px-12">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-28 rounded-lg bg-gradient-primary opacity-60"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ScreenshotPlaceholder({ variant, caption, hint, aspect, url }: Props) {
  const d = DEFAULTS[variant];
  const a = aspect ?? d.aspect ?? "video";

  return (
    <figure className="mx-auto w-full max-w-5xl">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        {/* Title bar */}
        <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          </div>
          <div className="mx-auto w-full max-w-sm truncate rounded-md bg-background/60 px-3 py-1 text-center font-mono text-[11px] text-muted-foreground">
            {url ?? d.url}
          </div>
        </div>
        {/* Canvas */}
        <div className="relative bg-background">
          <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-dashed border-border bg-card/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
            <Camera className="h-3 w-3" aria-hidden="true" />
            Placeholder
          </div>
          <div className={`${ASPECT_CLASS[a]} w-full border-2 border-dashed border-border/60 bg-muted/20`}>
            <Sketch variant={variant} />
          </div>
        </div>
      </div>
      <figcaption className="mx-auto mt-4 max-w-2xl text-center">
        <div className="text-sm font-semibold text-foreground">{caption ?? d.caption}</div>
        <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold uppercase tracking-wider text-muted-foreground/80">
            To capture:
          </span>{" "}
          {hint ?? d.hint}
        </div>
      </figcaption>
    </figure>
  );
}
