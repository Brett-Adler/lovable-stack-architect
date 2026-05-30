import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SeoHead } from "@/components/SeoHead";
import { ScreenshotPlaceholder } from "@/components/ScreenshotPlaceholder";
import { CRITERIA, ARCHITECTURES } from "@/data/architectures";
import { LAST_REVIEWED, LOVABLE_REMIX_URL } from "@/lib/constants";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
  SlidersHorizontal,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function SectionHead({
  n,
  title,
  subtitle,
}: {
  n: number;
  title: string;
  subtitle?: React.ReactNode;
}) {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-white shadow-card">
        {n}
      </div>
      <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.02em] text-foreground sm:text-3xl">{title}</h2>
      {subtitle ? (
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
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
            className="pointer-events-none absolute left-1/2 top-[-10%] -z-0 h-[500px] w-[900px] -translate-x-1/2 bg-gradient-glow blur-3xl"
          />
          <div className="relative z-10 mx-auto max-w-6xl px-4 pb-12 pt-16 text-center sm:px-6 sm:pt-24 sm:pb-20">
            <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-gradient-primary" aria-hidden="true" />
              Methodology · Last reviewed {LAST_REVIEWED}
            </div>
            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl">
              How the recommendation is <span className="text-gradient">built</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              The rubric, the weights, the sources, and where we know the tool is biased — all in
              one place.
            </p>
            <div className="mt-8">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back home
              </Link>
            </div>
          </div>
        </section>

        {/* 1. How the score is computed */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHead
            n={1}
            title="How the score is computed"
            subtitle={
              <>
                Each of the 10 architectures is scored 1–5 on each of the {CRITERIA.length}{" "}
                criteria. Your inputs derive a per-criterion weight, and the final 0–100 score is
                the weighted sum normalized by the maximum possible score.
              </>
            }
          />
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
              <p className="leading-relaxed text-foreground/90">
                The rubric lives in{" "}
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
              <div className="mt-6 rounded-xl border border-border bg-muted/40 p-5">
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
        </section>

        {/* 2. Criteria */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHead
            n={2}
            title="Criteria"
            subtitle={`The ${CRITERIA.length} dimensions every architecture is scored against.`}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CRITERIA.map((c, i) => (
              <div
                key={c.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm font-semibold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-base font-semibold text-foreground">{c.label}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.hint}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Cost-band sources */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHead
            n={3}
            title="Cost-band sources"
            subtitle="Cost bands are curated estimates from public vendor pricing pages, not live quotes. Always verify against current pricing before committing."
          />
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
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
                      {a.name}
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
            n={4}
            title="Known biases & caveats"
            subtitle="Where the rubric is opinionated, approximate, or unavoidably our point of view."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {BIASES.map((b) =>
              b.accent ? (
                <div
                  key={b.title}
                  className="flex gap-4 rounded-2xl border border-warning/30 bg-warning/10 p-6"
                >
                  <div className="shrink-0 text-warning">
                    <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{b.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{b.body}</p>
                  </div>
                </div>
              ) : (
                <div
                  key={b.title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-card"
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
          <div className="rounded-[2rem] bg-gradient-primary p-[1.5px] shadow-elegant">
            <div className="rounded-[calc(2rem-1.5px)] bg-card p-8 sm:p-12">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                    For builders
                  </div>
                  <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                    Make it your own
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                    The whole app is data-driven. Fork it, edit the architectures and rubric in one
                    file, then tune the input weights if they don't match your domain.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {LOVABLE_REMIX_URL && (
                      <Button asChild size="lg" className="gap-2">
                        <a href={LOVABLE_REMIX_URL} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" aria-hidden="true" /> Remix on Lovable
                        </a>
                      </Button>
                    )}
                    <Button asChild size="lg" variant="outline" className="gap-2">
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
                    <div
                      key={b.file}
                      className="rounded-xl border border-border bg-muted/40 p-4"
                    >
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
