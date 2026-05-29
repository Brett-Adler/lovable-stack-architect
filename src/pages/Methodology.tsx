import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SeoHead } from "@/components/SeoHead";
import { CRITERIA, ARCHITECTURES } from "@/data/architectures";
import { LAST_REVIEWED } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

const Methodology = () => {
  return (
    <div className="min-h-dvh bg-gradient-subtle">
      <SeoHead
        title="Methodology — Lovable Stack Architect"
        description="How the Lovable Stack Architect scores 10 backend options across 12 criteria, including the rubric, weights, sources, and known biases."
        path="/methodology"
      />
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Back home
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Methodology</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          How the recommendation is computed, where the data comes from, and where the tool is biased. Last reviewed {LAST_REVIEWED}.
        </p>

        <section className="prose prose-sm mt-8 max-w-none text-foreground/90">
          <h2 className="mt-8 text-xl font-semibold text-foreground">1. How the score is computed</h2>
          <p>
            Each of the 10 architectures is scored 1–5 on each of the {CRITERIA.length} criteria
            in <code>src/data/architectures.ts</code> (the <code>RUBRIC</code> table). Your inputs
            derive a weight for each criterion (<code>src/lib/scoring.ts</code> →{" "}
            <code>deriveWeights</code>). The final 0–100 score is the weighted sum normalized by
            the maximum possible score.
          </p>
          <p>
            Every criterion starts at a baseline weight of <strong>1.0</strong> so no single
            criterion is structurally favored. Your stage, MAU, team skills, budget, compliance
            needs, workloads, lock-in tolerance, and time-to-market priority nudge weights up or
            down from there.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-foreground">2. Criteria</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {CRITERIA.map((c) => (
              <li key={c.id}>
                <strong className="text-foreground">{c.label}.</strong>{" "}
                <span className="text-muted-foreground">{c.hint}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-foreground">3. Cost-band sources</h2>
          <p>
            Cost bands are curated estimates from public vendor pricing pages, not live quotes.
            Always verify against current pricing before committing.
          </p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {ARCHITECTURES.map((a) => (
              <li key={a.id}>
                <strong className="text-foreground">{a.name}</strong>{" "}
                <span className="text-muted-foreground">(reviewed {a.lastReviewed}):</span>{" "}
                {a.sources.map((s, i) => (
                  <span key={s.url}>
                    {i > 0 && ", "}
                    <a className="text-primary hover:underline" href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  </span>
                ))}
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-foreground">4. Known biases &amp; caveats</h2>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <strong>Lovable-authored.</strong> This tool is built by a Lovable user and lives on a
              Lovable-hosted site. The rubric reflects Lovable's perspective on developer experience.
              The DX-with-Lovable criterion has the same baseline weight as every other criterion to
              limit that bias, but it is still our judgement.
            </li>
            <li>
              <strong>Two native integrations, eight self-hosted.</strong> Lovable Cloud and external
              Supabase are first-party integrations. The other 8 options require exporting to GitHub
              and deploying the backend yourself — we score them as if you have done that.
            </li>
            <li>
              <strong>Cost bands are wide ranges.</strong> They are designed to be roughly right, not
              precisely accurate. Workload shape (heavy realtime, analytics, egress) easily moves the
              actual bill outside the band.
            </li>
            <li>
              <strong>Compliance is a single number.</strong> "Compliance reach" is one criterion, but
              HIPAA, SOC 2, ISO 27001, FedRAMP, and EU residency each have different stories per
              vendor. Treat the score as a hint, not a substitute for your compliance team.
            </li>
            <li>
              <strong>No vendor relationships influence the scores.</strong> No vendor pays for
              placement. If you find a score you disagree with, the rubric lives in one file and is
              one PR away from a fix.
            </li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-foreground">5. Make it your own</h2>
          <p>
            The whole app is data-driven. Fork it, edit <code>src/data/architectures.ts</code> to
            swap the options and rubric, then tune <code>src/lib/scoring.ts</code> if the input
            weights don't match your domain.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Methodology;
