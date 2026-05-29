import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SeoHead } from "@/components/SeoHead";
import { CRITERIA, ARCHITECTURES } from "@/data/architectures";
import { LAST_REVIEWED, LOVABLE_REMIX_URL } from "@/lib/constants";
import { ArrowLeft, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

function SectionHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        {n}
      </span>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
    </div>
  );
}

const BIASES = [
  {
    title: "Lovable-authored",
    body: "This tool is built by a Lovable user and lives on a Lovable-hosted site. The rubric reflects Lovable's perspective on developer experience. The DX-with-Lovable criterion has the same baseline weight as every other criterion to limit that bias, but it is still our judgement.",
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
  const half = Math.ceil(CRITERIA.length / 2);
  const colA = CRITERIA.slice(0, half);
  const colB = CRITERIA.slice(half);

  return (
    <div className="min-h-dvh bg-gradient-subtle">
      <SeoHead
        title="Methodology — Lovable Stack Architect"
        description="How the Lovable Stack Architect scores 10 backend options across 12 criteria, including the rubric, weights, sources, and known biases."
        path="/methodology"
      />
      <SiteHeader />

      <main id="main-content" className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1.5 rounded text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back home
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Methodology
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            How the recommendation is computed, where the data comes from, and where the tool is biased.
          </p>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            Last reviewed {LAST_REVIEWED}
          </p>
        </div>

        <div className="space-y-8">
          {/* 1. How the score is computed */}
          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="p-6 sm:p-8">
              <SectionHeader n={1} title="How the score is computed" />
              <p className="leading-relaxed text-foreground/80">
                Each of the 10 architectures is scored{" "}
                <span className="font-semibold text-foreground">1–5</span> on each of the {CRITERIA.length} criteria in{" "}
                <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-sm text-primary">
                  src/data/architectures.ts
                </code>{" "}
                (the <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-sm text-primary">RUBRIC</code>{" "}
                table). Your inputs derive a weight for each criterion in{" "}
                <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-sm text-primary">
                  src/lib/scoring.ts
                </code>{" "}
                via{" "}
                <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-sm text-primary">
                  deriveWeights
                </code>
                .
              </p>
              <div className="mt-6 rounded-xl border border-border bg-muted/30 p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  The formula
                </p>
                <p className="text-foreground/90">
                  The final <span className="font-semibold">0–100 score</span> is the weighted sum
                  normalized by the maximum possible score. Every criterion starts at a baseline weight
                  of <span className="font-semibold">1.0</span> so no single criterion is structurally
                  favored — your stage, MAU, team, budget, compliance needs, workloads, lock-in tolerance,
                  and time-to-market priority nudge weights up or down from there.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Criteria */}
          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="p-6 sm:p-8">
              <SectionHeader n={2} title="Criteria" />
              <dl className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
                {[colA, colB].map((col, ci) => (
                  <div key={ci} className="space-y-6">
                    {col.map((c) => (
                      <div key={c.id}>
                        <dt className="text-sm font-bold uppercase tracking-tight text-foreground">
                          {c.label}
                        </dt>
                        <dd className="mt-1 text-sm text-muted-foreground">{c.hint}</dd>
                      </div>
                    ))}
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* 3. Cost-band sources */}
          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="p-6 sm:p-8">
              <SectionHeader n={3} title="Cost-band sources" />
              <p className="mb-6 text-foreground/80">
                Cost bands are curated estimates from public vendor pricing pages, not live quotes.
                Always verify against current pricing before committing.
              </p>
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="min-w-full divide-y divide-border">
                  <caption className="sr-only">
                    Cost-band sources by vendor, with last-reviewed date and links to pricing pages.
                  </caption>
                  <thead className="bg-muted/40">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        Architecture
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        Reviewed
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
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
            </div>
          </section>

          {/* 4. Known biases & caveats */}
          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="p-6 sm:p-8">
              <SectionHeader n={4} title="Known biases & caveats" />
              <div className="space-y-4">
                {BIASES.map((b) =>
                  b.accent ? (
                    <div
                      key={b.title}
                      className="flex gap-4 rounded-xl border border-warning/30 bg-warning/10 p-4"
                    >
                      <div className="shrink-0 text-warning">
                        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{b.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-foreground/80">{b.body}</p>
                      </div>
                    </div>
                  ) : (
                    <div key={b.title} className="rounded-xl border border-border p-4">
                      <p className="text-sm font-bold text-foreground">{b.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </section>

          {/* 5. Make it your own */}
          <section className="overflow-hidden rounded-2xl bg-gradient-primary shadow-elegant">
            <div className="p-6 text-primary-foreground sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-primary-foreground">
                  5
                </span>
                <h2 className="text-xl font-bold">Make it your own</h2>
              </div>
              <p className="leading-relaxed text-primary-foreground/90">
                The whole app is data-driven. Fork it, edit the architectures and rubric in one file,
                then tune the input weights if they don't match your domain.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <code className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 font-mono text-xs">
                  src/data/architectures.ts
                </code>
                <code className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 font-mono text-xs">
                  src/lib/scoring.ts
                </code>
              </div>
              <div className="mt-6">
                <Button asChild variant="secondary" size="sm" className="gap-1.5">
                  <a href={LOVABLE_REMIX_URL} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" aria-hidden="true" /> Use this template
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Methodology;
