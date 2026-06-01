import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, GitFork, Pencil, Rocket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SeoHead } from "@/components/SeoHead";
import { ScreenshotPlaceholder } from "@/components/ScreenshotPlaceholder";
import { GITHUB_URL, LOVABLE_REMIX_URL } from "@/lib/constants";
import posterAsset from "@/assets/lovable/remix-poster.png.asset.json";
import comparatorAsset from "@/assets/lovable/app-comparator.png.asset.json";
import matrixAsset from "@/assets/lovable/app-matrix.png.asset.json";
import methodologyAsset from "@/assets/lovable/methodology.png.asset.json";

const STEPS = [
  {
    n: "01",
    icon: GitFork,
    title: "Fork the template in Lovable",
    body:
      "Open the project in Lovable and use Remix (or clone the GitHub repo) to get your own editable copy. No external accounts required to get going.",
    file: "—",
  },
  {
    n: "02",
    icon: Pencil,
    title: "Swap in your decision space",
    body:
      "Replace the options array with whatever you want to compare — CMSes, databases, auth providers, AI models, frameworks, anything with 5–15 alternatives.",
    file: "src/data/architectures.ts → ARCHITECTURES",
  },
  {
    n: "03",
    icon: Sparkles,
    title: "Edit the criteria and rubric",
    body:
      "Choose the dimensions that matter for your space, then score every option 1–5 against each one. Weights derive automatically from user inputs.",
    file: "src/data/architectures.ts → CRITERIA, RUBRIC",
  },
  {
    n: "04",
    icon: Rocket,
    title: "Tweak copy, brand, and ship",
    body:
      "Update the headline copy, swap the brand tokens, regenerate brand assets, and publish. Sitemap, SEO, analytics, and exports come along for free.",
    file: "src/lib/branding.ts · src/lib/constants.ts · TEMPLATE-SETUP.md",
  },
];

const FEATURES = [
  "Weighted 1–5 rubric scoring with live recommendation",
  "Side-by-side comparison matrix across all options",
  "Auto-generated architecture diagram per top pick",
  "Shareable scenario URLs and one-click Markdown / PDF export",
  "Preset scenarios so users land on something meaningful",
  "Built-in SEO head, sitemap, llms.txt, and OG image",
  "Privacy-friendly Plausible hook, ready to enable",
  "Full brand system: tokens, favicons, social rasters, all regenerable",
];

const GALLERY = [
  {
    src: posterAsset.url,
    caption: "Pick your Lovable stack",
    alt: "Stack Architect — weighted scoring across 10 architectures with a recommended pick",
  },
  {
    src: comparatorAsset.url,
    caption: "The comparator at a glance",
    alt: "Stack Architect comparator with inputs, recommendation and architecture diagram",
  },
  {
    src: matrixAsset.url,
    caption: "Side-by-side matrix",
    alt: "Full comparison matrix scoring every option across all criteria",
  },
  {
    src: methodologyAsset.url,
    caption: "Methodology, in the open",
    alt: "Methodology page explaining the 12 criteria",
  },
];

export default function Lovable() {
  const remixHref = LOVABLE_REMIX_URL ?? "https://lovable.dev";

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Remix this template in Lovable — Stack Architect"
        description="An open Lovable template for building any side-by-side decision comparator. Fork it, swap in your options and criteria, and ship a weighted recommendation tool in a day."
        path="/lovable"
      />
      <SiteHeader />

      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 -z-10 bg-gradient-soft opacity-60" aria-hidden="true" />
          <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Open template
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl">
              Remix this in <span className="inline-block bg-gradient-primary bg-clip-text text-transparent">Lovable</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
              Stack Architect is a weighted decision comparator built on a generic template.
              Point it at a different problem — CMSes, databases, AI models, anything with options
              and trade-offs — and ship your own version in an afternoon.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <a href={remixHref} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Open in Lovable
                </a>
              </Button>
              {GITHUB_URL && (
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                    View on GitHub
                  </a>
                </Button>
              )}
              <Button asChild size="lg" variant="ghost" className="gap-2">
                <Link to="/app">
                  See the live tool
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="border-b border-border/60 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                What you get out of the box
              </h2>
              <p className="mt-3 text-muted-foreground">
                Click any image to see it full size.
              </p>
            </div>
            <div className="mt-12 grid gap-12 sm:gap-16">
              {GALLERY.map((g) => (
                <ScreenshotPlaceholder
                  key={g.src}
                  variant="recommendation"
                  src={g.src}
                  alt={g.alt}
                  caption={g.caption}
                />
              ))}
            </div>
          </div>
        </section>

        {/* How to remix */}
        <section className="border-b border-border/60 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How to remix it
              </h2>
              <p className="mt-3 text-muted-foreground">
                The whole comparator is data-driven. Most projects only touch two files.
              </p>
            </div>
            <ol className="mt-12 grid gap-6 sm:grid-cols-2">
              {STEPS.map((s) => (
                <li
                  key={s.n}
                  className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-card backdrop-blur"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-sm font-bold text-primary-foreground">
                      {s.n}
                    </span>
                    <s.icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  <div className="mt-4 rounded-md bg-muted/60 px-3 py-2 font-mono text-[11px] text-muted-foreground">
                    {s.file}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features list */}
        <section className="border-b border-border/60 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Batteries included
              </h2>
              <p className="mt-3 text-muted-foreground">
                Everything below comes wired up — you focus on the decision space, not the plumbing.
              </p>
            </div>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/60 p-4 text-sm text-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Make it yours
            </h2>
            <p className="mt-4 text-muted-foreground">
              Fork the template, swap in your options, and ship a weighted recommendation tool by
              the end of the day.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <a href={remixHref} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Open in Lovable
                </a>
              </Button>
              {GITHUB_URL && (
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                    View on GitHub
                  </a>
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
