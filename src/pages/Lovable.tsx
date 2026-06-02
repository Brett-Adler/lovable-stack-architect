import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  ExternalLink,
  GitFork,
  Layers,
  Pencil,
  Rocket,
  Share2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SeoHead } from "@/components/SeoHead";
import { ScreenshotPlaceholder } from "@/components/ScreenshotPlaceholder";
import { GITHUB_URL, LOVABLE_LISTING_URL, LOVABLE_REMIX_URL, SITE_URL } from "@/lib/constants";
import posterAsset from "@/assets/lovable/remix-poster.png.asset.json";
import comparatorAsset from "@/assets/lovable/app-comparator.png.asset.json";
import matrixAsset from "@/assets/lovable/app-matrix.png.asset.json";
import methodologyAsset from "@/assets/lovable/methodology.png.asset.json";

const TAGLINE =
  "A weighted decision comparator for picking the right Lovable stack — inputs in, recommendation out, with a transparent rubric you can see and edit.";

const HIGHLIGHTS = [
  "Weighted 1–5 rubric scoring with a live, explained recommendation",
  "Side-by-side comparison matrix across every option you keep in play",
  "Auto-generated architecture diagram for the top pick",
  "Shareable scenario URLs and one-click Markdown / PDF export",
  "Preset scenarios so users land on something meaningful",
  "Full methodology page — nothing about the scoring is hidden",
];

const FEATURES = [
  {
    icon: CheckCircle,
    title: "Weighted scoring",
    desc: "Enter your project; get a ranked, explainable pick — not a gut call.",
  },
  {
    icon: BarChart3,
    title: "Side-by-side matrix",
    desc: "Compare every option across the same criteria in one view.",
  },
  {
    icon: Layers,
    title: "Architecture diagram",
    desc: "Auto-generated top-pick diagram you can screenshot or export.",
  },
  {
    icon: Share2,
    title: "Shareable + exportable",
    desc: "Copy a link or export a PDF report with one click.",
  },
  {
    icon: Pencil,
    title: "Editable rubric",
    desc: "Open criteria, open weights, open scoring — nothing is hidden.",
  },
  {
    icon: Rocket,
    title: "Remix-ready",
    desc: "Swap in any decision space and ship your own comparator in an afternoon.",
  },
];

const GALLERY = [
  {
    src: posterAsset.url,
    caption: "Pick your Lovable stack",
    alt: "Stack Architect — weighted scoring across 11 architectures with a recommended pick",
  },
  {
    src: comparatorAsset.url,
    caption: "Inputs, recommendation, and architecture in one view",
    alt: "Stack Architect comparator with inputs, recommendation and architecture diagram",
  },
  {
    src: matrixAsset.url,
    caption: "Side-by-side matrix of every option",
    alt: "Full comparison matrix scoring every option across all criteria",
  },
  {
    src: methodologyAsset.url,
    caption: "Methodology, in the open",
    alt: "Methodology page explaining the 12 criteria",
  },
];

const REMIX_STEPS = [
  {
    n: "01",
    icon: GitFork,
    title: "Open in Lovable or clone from GitHub",
    body:
      "Use Remix on the Lovable listing — or clone the GitHub repo — to get your own editable copy. No external accounts required.",
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

export default function Lovable() {
  const remixHref = LOVABLE_REMIX_URL ?? LOVABLE_LISTING_URL;

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Stack Architect — the Lovable listing"
        description="Stack Architect on Lovable: a weighted decision comparator for picking the right Lovable stack. See the screenshots, try it live, or remix the template."
        path="/lovable"
      />
      <SiteHeader />

      <main id="main-content">
        {/* Hero — listing-style */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 -z-10 bg-gradient-soft opacity-60" aria-hidden="true" />
          <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              On the Lovable gallery
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl">
              <span className="inline-block bg-gradient-primary bg-clip-text text-transparent">Stack Architect</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
              {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/app">
                  Try it live
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <a href={LOVABLE_LISTING_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  View on Lovable
                </a>
              </Button>
              <Button asChild size="lg" variant="ghost" className="gap-2">
                <a href="#remix">
                  Remix the template
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Live at <a href={SITE_URL} className="underline-offset-2 hover:underline">{SITE_URL.replace(/^https?:\/\//, "")}</a>
            </p>
          </div>
        </section>

        {/* Gallery — front and center */}
        <section className="border-b border-border/60 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                What it looks like
              </h2>
              <p className="mt-3 text-muted-foreground">
                Four screens that cover the whole flow — inputs, comparison, recommendation, and the methodology behind the scores.
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

        {/* What it is / highlights */}
        <section className="border-b border-border/60 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Built for one job: pick a stack with confidence
              </h2>
              <p className="mt-3 text-muted-foreground">
                Stack Architect turns a fuzzy “which stack should I use?” into a weighted, explainable answer
                — with a matrix, a diagram, and an exportable report behind it.
              </p>
            </div>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {HIGHLIGHTS.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/60 p-4 text-sm text-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/app">
                  Open the live tool
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link to="/methodology">
                  Read the methodology
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Remix — secondary, but complete */}
        <section id="remix" className="border-b border-border/60 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                <GitFork className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Also an open template
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Want to remix it?
              </h2>
              <p className="mt-3 text-muted-foreground">
                The whole comparator is data-driven. Point it at any decision space —
                CMSes, databases, AI models, anything with 5–15 alternatives — and ship your own
                weighted recommender in an afternoon. Most projects only touch two files.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" className="gap-2">
                  <a href={remixHref} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Remix in Lovable
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

            <ol className="mt-12 grid gap-6 sm:grid-cols-2">
              {REMIX_STEPS.map((s) => (
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

        {/* Final CTA */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Try it, share it, or make it yours
            </h2>
            <p className="mt-4 text-muted-foreground">
              Use Stack Architect to pick your next Lovable stack — or fork the template and
              ship a weighted recommender for your own decision space.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/app">
                  Try it live
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <a href={LOVABLE_LISTING_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  View on Lovable
                </a>
              </Button>
              {GITHUB_URL && (
                <Button asChild size="lg" variant="ghost" className="gap-2">
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                    GitHub
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
