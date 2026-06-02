import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SeoHead } from "@/components/SeoHead";
import { ScreenshotPlaceholder } from "@/components/ScreenshotPlaceholder";
import appInputsPanelShot from "@/assets/shots/app-inputs-panel.png";
import appMatrixShot from "@/assets/shots/app-matrix.png";
import { CRITERIA, ARCHITECTURES, RUBRIC, type CriterionId, type ArchId } from "@/data/architectures";
import { BrandMark } from "@/components/BrandMark";
import { LAST_REVIEWED, LOVABLE_REMIX_URL } from "@/lib/constants";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
  SlidersHorizontal,
  FileText,
  Rocket,
  Sparkles,
  PiggyBank,
  TrendingUp,
  Gauge,
  Radio,
  FolderOpen,
  Cpu,
  ShieldCheck,
  Unlock,
  Wrench,
  ArrowRightLeft,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CRITERION_ICON: Record<CriterionId, LucideIcon> = {
  "time-to-launch": Rocket,
  "dx-with-lovable": Sparkles,
  "cost-small": PiggyBank,
  "cost-large": TrendingUp,
  "scaling-ceiling": Gauge,
  "realtime": Radio,
  "storage": FolderOpen,
  "ai-compute": Cpu,
  "compliance": ShieldCheck,
  "lock-in": Unlock,
  "ops-burden": Wrench,
  "migration": ArrowRightLeft,
};

const CRITERION_TINTS = [
  "bg-brand-blue/10 text-brand-blue",
  "bg-brand-magenta/10 text-brand-magenta",
  "bg-brand-orange/10 text-brand-orange",
  "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "bg-sky-500/10 text-sky-600 dark:text-sky-400",
];

function SectionHead({
  pill,
  title,
  accent,
  subtitle,
}: {
  pill: string;
  title: string;
  accent: string;
  subtitle?: React.ReactNode;
}) {
  return (
    <div className="mb-10 text-center">
      <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-gradient-primary" aria-hidden="true" />
        {pill}
      </div>
      <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground sm:text-4xl">
        {title} <span className="text-gradient">{accent}</span>
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

const BIASES = [
  {
    title: "Built by a Lovable fan",
    body: "This is an independent, community-built template — not affiliated with, endorsed by, or representing Lovable. I built it because I'm a Lovable user and fan, so the rubric has a perspective on what makes a good Lovable backend. The DX-with-Lovable criterion has the same baseline weight as every other criterion to limit that bias, but it's still my judgement.",
    accent: true,
  },
  {
    title: "Two native integrations, eight self-hosted",
    body: "Lovable Cloud and external Supabase are first-party integrations. The other 8 options require exporting to GitHub and deploying the backend yourself — we score them as if you have done that.",
  },
  {
    title: "Cost bands are wide ranges",
    body: "They are designed to be roughly right, not precisely accurate. Workload shape (heavy realtime, analytics, egress) easily moves the actual bill outside the band.",
  },
  {
    title: "Compliance is a single number",
    body: "\"Compliance reach\" is one criterion, but HIPAA, SOC 2, ISO 27001, FedRAMP, and EU residency each have different stories per vendor. Treat the score as a hint, not a substitute for your compliance team.",
  },
  {
    title: "No vendor relationships influence the scores",
    body: "No vendor pays for placement. If you find a score you disagree with, the rubric lives in one file and is one PR away from a fix.",
  },
];

// Fixed vendor order across all 12 scoreboards so the eye learns the shape.
const VENDOR_ORDER: ArchId[] = ARCHITECTURES.map((a) => a.id);

const SCORE_SWATCH: Record<number, string> = {
  1: "bg-destructive/70",
  2: "bg-destructive/40",
  3: "bg-warning/60",
  4: "bg-success/50",
  5: "bg-success/80",
};

function getCriterionStats(criterionId: CriterionId) {
  const scores = VENDOR_ORDER.map((id) => ({ id, score: RUBRIC[id][criterionId] }));
  const values = scores.map((s) => s.score);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const leader = [...scores].sort((a, b) => b.score - a.score)[0];
  const leaderArch = ARCHITECTURES.find((a) => a.id === leader.id)!;
  let spreadLabel: string;
  if (max - min >= 3) spreadLabel = `Differentiating · ${min}–${max}`;
  else if (min >= 4) spreadLabel = `Tight race · ${min}–${max}`;
  else if (min >= 3) spreadLabel = `Everyone scores ${min}+`;
  else spreadLabel = `Range ${min}–${max}`;
  return { scores, leader, leaderArch, spreadLabel };
}

function Scoreboard({ criterionId }: { criterionId: CriterionId }) {
  const { scores, leader } = getCriterionStats(criterionId);
  return (
    <div className="flex items-center gap-[3px]" role="img" aria-label="Per-vendor rubric scores">
      {scores.map(({ id, score }) => {
        const arch = ARCHITECTURES.find((a) => a.id === id)!;
        const isLeader = id === leader.id;
        return (
          <span
            key={id}
            title={`${arch.name} — ${score}/5`}
            className={`h-3 w-3 rounded-sm ${SCORE_SWATCH[score]} ${
              isLeader ? "ring-1 ring-foreground/40 ring-offset-1 ring-offset-card" : ""
            }`}
          />
        );
      })}
    </div>
  );
}

function LeaderChip({ archId, score }: { archId: ArchId; score: number }) {
  const arch = ARCHITECTURES.find((a) => a.id === archId)!;
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-foreground/80">
      <BrandMark archId={archId} size="sm" />
      <span className="truncate">{arch.short || arch.name}</span>
      <span className="text-muted-foreground">· {score}/5</span>
    </div>
  );
}

function ScoreLegend() {
  return (
    <div className="mx-auto mb-6 flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground">
      <span className="font-medium uppercase tracking-wider">Poor</span>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`h-3 w-3 rounded-sm ${SCORE_SWATCH[s]}`} aria-hidden="true" />
      ))}
      <span className="font-medium uppercase tracking-wider">Excellent</span>
      <span className="ml-2 hidden sm:inline">· each square = one of the {ARCHITECTURES.length} architectures, in catalog order</span>
    </div>
  );
}

const Methodology = () => {
  return (
    <div className="min-h-dvh bg-background">
      <SeoHead
        title="Methodology — Lovable Stack Architect"
        description="How the Lovable Stack Architect scores 10 backend options across 12 criteria, including the rubric, weights, sources, and known biases."
        path="/methodology"
      />
      <SiteHeader />

      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[900px] bg-gradient-aurora blur-2xl"
          />
          <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24 sm:pb-20">
            <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-magenta opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-primary" />
              </span>
              Methodology · Last reviewed {LAST_REVIEWED}
            </div>
            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-6xl md:text-7xl">
              How the recommendation is <span className="text-gradient">built</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              The rubric, the weights, the sources, and where the tool is opinionated — all in one place.
              Same voice as the home page: a Lovable fan being honest about how this thing was built.
            </p>
            <a
              href="https://lovable.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
            >
              Built with <img src="/lovable-brand.svg" alt="" className="h-3.5 w-3.5" /> <span className="font-medium">Lovable</span>
            </a>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <div className="rounded-full bg-gradient-primary p-[1.5px] shadow-elegant transition-transform hover:scale-[1.02]">
                <Button asChild size="lg" className="gap-2 rounded-full px-7">
                  <Link to="/app">
                    <SlidersHorizontal className="h-4 w-4" /> Open the tool <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 rounded-full border-border bg-card px-7"
              >
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" /> Back home
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 1. How the score is computed */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHead
            pill="The rubric"
            title="How the score is"
            accent="computed"
            subtitle="One file, one formula, no magic. Every criterion starts equal — your inputs nudge the weights from there."
          />
          <div className="mx-auto max-w-3xl">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant sm:p-8">
              <p className="leading-relaxed text-foreground/90">
                Each of the 10 architectures is scored 1–5 on each of the {CRITERIA.length}{" "}
                criteria. Your inputs derive a per-criterion weight, and the final 0–100 score is the
                weighted sum normalized by the maximum possible score. The rubric lives in{" "}
                <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-sm text-primary">
                  src/data/architectures.ts
                </code>{" "}
                (the{" "}
                <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-sm text-primary">
                  RUBRIC
                </code>{" "}
                table). Weights are derived in{" "}
                <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-sm text-primary">
                  src/lib/scoring.ts
                </code>{" "}
                via{" "}
                <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-sm text-primary">
                  deriveWeights
                </code>
                .
              </p>
              <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  The formula
                </p>
                <p className="leading-relaxed text-foreground/90">
                  Every criterion starts at a baseline weight of{" "}
                  <span className="font-semibold">1.0</span> so no single criterion is structurally
                  favored — your stage, MAU, team, budget, compliance needs, workloads, lock-in
                  tolerance, and time-to-market priority nudge weights up or down from there.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <ScreenshotPlaceholder variant="inputs-panel" src={appInputsPanelShot} />
          </div>
        </section>

        {/* 2. Criteria */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHead
            pill="The dimensions"
            title={`The ${CRITERIA.length}`}
            accent="criteria"
            subtitle="Every architecture is scored 1–5 on each of these. Tap a column in the comparator to see why it scored the way it did."
          />
          <ScoreLegend />
          <ol className="overflow-hidden rounded-3xl border border-border bg-card shadow-card divide-y divide-border">
            {CRITERIA.map((c, i) => {
              const Icon = CRITERION_ICON[c.id] ?? Sparkles;
              const tint = CRITERION_TINTS[i % CRITERION_TINTS.length];
              const { leader, spreadLabel } = getCriterionStats(c.id);
              return (
                <li
                  key={c.id}
                  className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30 sm:gap-4 sm:px-5"
                >
                  <span
                    className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:inline-flex ${tint}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="w-5 shrink-0 text-right text-xs font-semibold tabular-nums text-muted-foreground sm:hidden">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="hidden text-xs font-semibold tabular-nums text-muted-foreground sm:inline">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="truncate text-sm font-semibold text-foreground">{c.label}</h3>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground sm:line-clamp-1">
                      {c.hint}
                    </p>
                  </div>
                  <div className="hidden shrink-0 sm:block">
                    <Scoreboard criterionId={c.id} />
                  </div>
                  <div className="hidden shrink-0 md:block">
                    <LeaderChip archId={leader.id} score={leader.score} />
                  </div>
                  <span className="hidden shrink-0 text-[10px] font-medium uppercase tracking-wider text-muted-foreground lg:inline">
                    {spreadLabel}
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="mt-10">
            <ScreenshotPlaceholder
              variant="matrix"
              src={appMatrixShot}
              caption="How the rubric renders in the app"
            />
          </div>
        </section>

        {/* 3. Cost-band sources */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHead
            pill="Receipts"
            title="Cost-band"
            accent="sources"
            subtitle="Curated from public vendor pricing pages — not live quotes. Verify against current pricing before committing."
          />
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <table className="min-w-full divide-y divide-border">
              <caption className="sr-only">
                Cost-band sources by vendor, with last-reviewed date and links to pricing pages.
              </caption>
              <thead className="bg-muted/40">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Architecture
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Reviewed
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Sources
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {ARCHITECTURES.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/20">
                    <th
                      scope="row"
                      className="px-4 py-3 text-left text-sm font-medium text-foreground"
                    >
                      <span className="inline-flex items-center gap-2">
                        <BrandMark archId={a.id} size="md" />
                        {a.name}
                      </span>
                    </th>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{a.lastReviewed}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-x-3 gap-y-1">
                        {a.sources.map((s) => (
                          <a
                            key={s.url}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded text-sm font-medium text-primary hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                          >
                            {s.label}
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Known biases & caveats */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHead
            pill="Full disclosure"
            title="Known"
            accent="biases"
            subtitle="Where the rubric is opinionated, approximate, or unavoidably my point of view."
          />
          <div className="grid grid-cols-12 gap-4 sm:gap-5">
            {BIASES.map((b) =>
              b.accent ? (
                <div
                  key={b.title}
                  className="group relative col-span-12 overflow-hidden rounded-3xl border border-white/10 bg-foreground p-8 text-background shadow-elegant md:col-span-12"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-[-4rem] top-[-4rem] h-64 w-64 rounded-full bg-gradient-primary opacity-40 blur-3xl transition-opacity group-hover:opacity-70"
                  />
                  <div className="relative z-10">
                    <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/70">
                      <AlertTriangle className="h-3 w-3" /> The big one
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">{b.title}</h3>
                    <p className="mt-3 max-w-3xl text-base leading-relaxed text-white/70">
                      {b.body}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  key={b.title}
                  className="col-span-12 rounded-3xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant md:col-span-6"
                >
                  <h3 className="text-base font-semibold text-foreground">{b.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                </div>
              ),
            )}
          </div>
        </section>

        {/* 5. Make it your own */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHead
            pill="Fork it"
            title="Make it"
            accent="your own"
            subtitle="The whole app is data-driven. Edit one file and you have a picker for CMSs, databases, AI models — anything."
          />
          <div className="rounded-[2rem] bg-gradient-primary p-[1.5px] shadow-elegant">
            <div className="rounded-[calc(2rem-1.5px)] bg-card p-8 sm:p-12">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                    For builders
                  </div>
                  <h3 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                    Two files do all the work
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                    Fork it, edit the architectures and rubric in one file, then tune the input
                    weights if they don't match your domain.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {LOVABLE_REMIX_URL && (
                      <div className="rounded-full bg-gradient-primary p-[1.5px] shadow-elegant transition-transform hover:scale-[1.02]">
                        <Button asChild size="lg" className="gap-2 rounded-full px-7">
                          <a href={LOVABLE_REMIX_URL} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" aria-hidden="true" /> Remix on Lovable
                          </a>
                        </Button>
                      </div>
                    )}
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="gap-2 rounded-full border-border bg-card px-7"
                    >
                      <Link to="/app">
                        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Open the tool
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      file: "src/data/architectures.ts",
                      body: "The 10 architectures, their cost bands, and the 12-criterion RUBRIC.",
                    },
                    {
                      file: "src/lib/scoring.ts",
                      body: "deriveWeights turns user inputs into per-criterion weights.",
                    },
                  ].map((b) => (
                    <div key={b.file} className="rounded-2xl border border-border bg-muted/40 p-4">
                      <div className="flex items-center gap-2 font-mono text-xs text-primary">
                        <FileText className="h-3.5 w-3.5" aria-hidden="true" /> {b.file}
                      </div>
                      <div className="mt-1.5 text-sm text-foreground/90">{b.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Methodology;
