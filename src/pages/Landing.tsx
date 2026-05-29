import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, Sparkles, ExternalLink, Gauge, Share2, FileDown, SlidersHorizontal, Trophy, FileText } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SeoHead } from "@/components/SeoHead";
import { ARCHITECTURES } from "@/data/architectures";
import { LAST_REVIEWED, LOVABLE_REMIX_URL } from "@/lib/constants";

const FEATURES = [
  {
    icon: Trophy,
    title: "Side-by-side scoring",
    body: "10 hosting and backend platforms scored across 12 criteria — time-to-launch, cost, scaling, lock-in, compliance, AI.",
  },
  {
    icon: Gauge,
    title: "Live recommendation",
    body: "Adjust your stage, team, budget, and workloads. The ranking, rationale, and cost band update instantly.",
  },
  {
    icon: Share2,
    title: "Share & export",
    body: "Shareable URLs encode your scenario. One-click Markdown or print-to-PDF for a stakeholder-ready report.",
  },
];

const STEPS = [
  { n: 1, title: "Describe your project", body: "Stage, expected MAU, team skills, budget, compliance needs, workloads." },
  { n: 2, title: "See the recommendation", body: "A ranked pick with rationale, runners-up, and an architecture diagram." },
  { n: 3, title: "Export or share", body: "Copy a share link, download Markdown, or print to PDF." },
];

const TEMPLATE_BULLETS = [
  { file: "src/data/architectures.ts", body: "Swap the options being compared, the criteria, and the 1–5 rubric scores." },
  { file: "src/lib/scoring.ts", body: "Tune default inputs and how user inputs reweight each criterion." },
  { file: "index.html + public/", body: "Rebrand: title, meta, OG image, favicons, manifest." },
];

const FAQ = [
  { q: "Where does the data come from?", a: "Curated from public vendor pricing pages, docs, and hands-on experience. Every score is editable in one file." },
  { q: "How fresh is it?", a: `Cost bands and rubric were last reviewed ${LAST_REVIEWED}. Always verify against current vendor pricing before committing.` },
  { q: "Can I customize it for a different decision?", a: "Yes — that's the point. The whole app is data-driven. Edit architectures.ts and you have a picker for CMSs, databases, auth providers, AI models, anything." },
  { q: "Is it free?", a: "Yes, MIT licensed. Fork it, ship it, sell a branded version — all fine." },
  { q: "Does it store my data?", a: "No backend. Your inputs live in your browser's localStorage and in the share URL you generate. Nothing leaves your device." },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <SeoHead
        title="Lovable Stack Architect — Pick the right backend for your Lovable app"
        description="Compare 10 hosting and backend platforms side by side. Free, open-source Lovable template you can rebrand for any decision space."
        path="/"
      />
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-12 pt-12 sm:px-6 sm:pt-20 sm:pb-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Free Lovable template · Last reviewed {LAST_REVIEWED}
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Pick the right backend for your Lovable app
            </h1>
            <p className="mt-5 text-base text-muted-foreground sm:text-lg">
              An interactive comparator across Lovable Cloud, Supabase, Vercel, Netlify, AWS, GCP, Azure,
              Heroku, Render, and Fly.io. Tuned to your stage, budget, and workloads.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/app">
                  Open the tool <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <a href={LOVABLE_REMIX_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" /> Use this template
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-4 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="border-border/60">
                <CardContent className="p-6">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">How it works</h2>
            <p className="mt-2 text-sm text-muted-foreground">Three steps from a vague idea to a defensible pick.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {s.n}
                </div>
                <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platforms */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Platforms covered</h2>
            <p className="mt-2 text-sm text-muted-foreground">10 options across managed backends, frontend hosts, hyperscalers, and PaaS.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {ARCHITECTURES.map((a) => (
              <div key={a.id} className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="text-sm font-semibold text-foreground">{a.short}</div>
                <div className="mt-1 text-xs text-muted-foreground">{a.tagline}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Use as a template */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="rounded-3xl border border-primary/30 bg-gradient-primary p-[1px] shadow-elegant">
            <div className="rounded-[calc(1.5rem-1px)] bg-card p-8 sm:p-12">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">For builders</div>
                  <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                    Use this as a template for any decision
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                    The whole app is data-driven. Fork it, swap three files, and you have a decision tool for
                    CMS picks, database picks, auth providers, AI models — anything you'd put in a comparison table.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild size="lg" className="gap-2">
                      <a href={LOVABLE_REMIX_URL} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" /> Remix on Lovable
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="gap-2">
                      <Link to="/app">
                        <SlidersHorizontal className="h-4 w-4" /> Try it first
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  {TEMPLATE_BULLETS.map((b) => (
                    <div key={b.file} className="rounded-xl border border-border bg-background/50 p-4">
                      <div className="flex items-center gap-2 font-mono text-xs text-primary">
                        <FileText className="h-3.5 w-3.5" /> {b.file}
                      </div>
                      <div className="mt-1.5 text-sm text-foreground/90">{b.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">FAQ</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-sm sm:text-base">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
          <div className="rounded-3xl border border-border bg-card p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Ready to pick a stack?</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Tell the tool about your project and get a ranked recommendation in under a minute.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/app">
                  Open the tool <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <a href={LOVABLE_REMIX_URL} target="_blank" rel="noopener noreferrer">
                  <FileDown className="h-4 w-4" /> Use this template
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Landing;
