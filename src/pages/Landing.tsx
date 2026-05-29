import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, Sparkles, ExternalLink, Gauge, Share2, FileDown, SlidersHorizontal, Trophy, FileText, Database, Info } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SeoHead } from "@/components/SeoHead";
import { ARCHITECTURES } from "@/data/architectures";
import { LAST_REVIEWED, LOVABLE_REMIX_URL } from "@/lib/constants";
import { PRESETS, presetShareUrl } from "@/lib/presets";

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
  { q: "Where does the data come from?", a: "Curated from public vendor pricing pages, docs, and hands-on experience. Every score is editable in one file, and every cost band links to its source on the Methodology page." },
  { q: "How is bias handled?", a: "This tool is Lovable-authored, so it has a perspective. Every criterion starts at the same baseline weight to avoid structurally favoring Lovable Cloud, and the recommendation card shows the top criteria that drove the score so you can sanity-check it. Full disclosure on the Methodology page." },
  { q: "What's actually in Lovable Cloud?", a: "Postgres database, auth, file storage, edge functions, and the Lovable AI Gateway (managed Gemini/Claude/GPT calls — no API keys to rotate). It's powered by Supabase under the hood, so if you outgrow Cloud you can detach to a self-owned Supabase project." },
  { q: "Do the other 8 platforms work with Lovable too?", a: "Not as native integrations. Only Lovable Cloud and external Supabase are wired in. For Vercel, Netlify, AWS, GCP, Azure, Heroku, Render, and Fly.io you export your Lovable project to GitHub and deploy the backend yourself." },
  { q: "How fresh is it?", a: `Cost bands and rubric were last reviewed ${LAST_REVIEWED}. Always verify against current vendor pricing before committing.` },
  { q: "Can I customize it for a different decision?", a: "Yes — that's the point. The whole app is data-driven. Edit architectures.ts and you have a picker for CMSs, databases, auth providers, AI models, anything." },
  { q: "Is it free?", a: "Yes, MIT licensed. Fork it, ship it, sell a branded version — all fine." },
  { q: "Does it store my data?", a: "No backend. Your inputs live in your browser's localStorage and in the share URL you generate. Nothing leaves your device." },
];

const Landing = () => {
  return (
    <div className="min-h-dvh bg-background">
      <SeoHead
        title="Lovable Stack Architect — Pick the right backend for your Lovable app"
        description="Compare 10 hosting and backend platforms side by side. Free, open-source Lovable template you can rebrand for any decision space."
        path="/"
      />
      <SiteHeader />

      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[-10%] -z-0 h-[600px] w-[900px] -translate-x-1/2 bg-gradient-glow blur-3xl"
          />
          <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24 sm:pb-20">
            <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-magenta opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-primary" />
              </span>
              Free Lovable template · Last reviewed {LAST_REVIEWED}
            </div>
            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-6xl md:text-7xl">
              Pick the right backend for{" "}
              <span className="text-gradient">your Lovable app</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              An interactive comparator across 10 hosting and backend options — Lovable Cloud,
              Supabase, Vercel, Netlify, AWS, GCP, Azure, Heroku, Render, and Fly.io — tuned to your
              stage, budget, and workloads. Methodology and sources are{" "}
              <Link
                to="/methodology"
                className="underline decoration-dotted underline-offset-4 hover:text-foreground"
              >
                openly published
              </Link>
              .
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <div className="rounded-full bg-gradient-primary p-[1.5px] shadow-elegant transition-transform hover:scale-[1.02]">
                <Button asChild size="lg" className="gap-2 rounded-full px-7">
                  <Link to="/app">
                    Open the tool <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 rounded-full border-border bg-card px-7"
              >
                <a href={LOVABLE_REMIX_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" /> Use this template
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Bento: features + Lovable Cloud tile */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid grid-cols-12 gap-4 sm:gap-5">
            {/* Tile 1 — big feature */}
            <div className="group col-span-12 rounded-3xl border border-border bg-card p-8 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant md:col-span-8 sm:p-10">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue transition-transform group-hover:scale-110">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {FEATURES[0].title}
              </h3>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                {FEATURES[0].body}
              </p>
            </div>

            {/* Tile 2 */}
            <div className="group col-span-12 rounded-3xl border border-border bg-card p-8 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant md:col-span-4">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-magenta/10 text-brand-magenta transition-transform group-hover:scale-110">
                <Gauge className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {FEATURES[1].title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {FEATURES[1].body}
              </p>
            </div>

            {/* Tile 3 */}
            <div className="group col-span-12 rounded-3xl border border-border bg-card p-8 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant md:col-span-4">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange transition-transform group-hover:scale-110">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {FEATURES[2].title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {FEATURES[2].body}
              </p>
            </div>

            {/* Tile 4 — dark Lovable Cloud */}
            <div className="group relative col-span-12 overflow-hidden rounded-3xl border border-white/10 bg-foreground p-8 text-background shadow-elegant md:col-span-8 sm:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-[-4rem] top-[-4rem] h-64 w-64 rounded-full bg-gradient-primary opacity-40 blur-3xl transition-opacity group-hover:opacity-70"
              />
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/70">
                  <Database className="h-3 w-3" /> Lovable Cloud
                </div>
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  What's Lovable Cloud?
                </h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-white/70">
                  Lovable's integrated backend: Postgres, auth, file storage, edge functions, and
                  the Lovable AI Gateway (managed Gemini/Claude/GPT — no API keys to rotate),
                  provisioned automatically. Powered by Supabase under the hood, so if you outgrow
                  it you can detach to a self-owned Supabase project.
                </p>
                <Link
                  to="/methodology"
                  className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-white transition-transform hover:translate-x-0.5"
                >
                  Read the methodology <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Example scenarios */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground sm:text-4xl">
              Try an example scenario
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              One click loads the tool with these inputs preset.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {PRESETS.map((p) => (
              <Link
                key={p.id}
                to={presetShareUrl(p)}
                className="group rounded-3xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gradient-primary" />
                  <div className="text-sm font-semibold text-foreground">{p.label}</div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{p.description}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-foreground/80 transition-transform group-hover:translate-x-0.5">
                  Open scenario <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground sm:text-4xl">
              How it works
            </h2>
            <p className="mt-2 inline-flex items-center justify-center gap-1 text-sm text-muted-foreground">
              Three steps to a transparent, sourced recommendation.
              <Link
                to="/methodology"
                className="inline-flex items-center gap-0.5 text-foreground underline-offset-4 hover:underline"
              >
                <Info className="h-3 w-3" /> methodology
              </Link>
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-3xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-white shadow-card">
                  {s.n}
                </div>
                <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platforms */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground sm:text-4xl">
              Platforms covered
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              10 options across managed backends, frontend hosts, hyperscalers, and PaaS.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {ARCHITECTURES.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-border bg-card p-4 text-center shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant"
              >
                <div className="text-sm font-semibold text-foreground">{a.short}</div>
                <div className="mt-1 text-xs text-muted-foreground">{a.tagline}</div>
              </div>
            ))}
          </div>
        </section>


        {/* Use as a template */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="rounded-[2rem] bg-gradient-primary p-[1.5px] shadow-elegant">
            <div className="rounded-[calc(2rem-1.5px)] bg-card p-8 sm:p-12">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-primary" /> For builders
                  </div>
                  <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.02em] text-foreground sm:text-4xl">
                    Use this as a template for any decision
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                    The whole app is data-driven. Fork it, swap three files, and you have a decision
                    tool for CMS picks, database picks, auth providers, AI models — anything you'd
                    put in a comparison table.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild size="lg" className="gap-2 rounded-full px-6">
                      <a href={LOVABLE_REMIX_URL} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" /> Remix on Lovable
                      </a>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="gap-2 rounded-full border-border bg-card px-6"
                    >
                      <Link to="/app">
                        <SlidersHorizontal className="h-4 w-4" /> Try it first
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  {TEMPLATE_BULLETS.map((b) => (
                    <div key={b.file} className="rounded-2xl border border-border bg-muted/40 p-4">
                      <div className="flex items-center gap-2 font-mono text-xs text-foreground/70">
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
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground sm:text-4xl">
              FAQ
            </h2>
          </div>
          <div className="rounded-3xl border border-border bg-card p-2 shadow-card sm:p-6">
            <Accordion type="single" collapsible className="w-full">
              {FAQ.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-sm sm:text-base">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center shadow-card sm:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[-30%] h-72 w-[700px] -translate-x-1/2 bg-gradient-glow blur-3xl"
            />
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground sm:text-4xl">
                Ready to pick a stack?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
                Tell the tool about your project and get a ranked recommendation in under a minute.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <div className="rounded-full bg-gradient-primary p-[1.5px] shadow-elegant">
                  <Button asChild size="lg" className="gap-2 rounded-full px-7">
                    <Link to="/app">
                      Open the tool <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="gap-2 rounded-full border-border bg-card px-7"
                >
                  <a href={LOVABLE_REMIX_URL} target="_blank" rel="noopener noreferrer">
                    <FileDown className="h-4 w-4" /> Use this template
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
};

export default Landing;
