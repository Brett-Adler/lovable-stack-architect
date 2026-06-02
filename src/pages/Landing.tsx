import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, Sparkles, ExternalLink, Gauge, Share2, FileDown, SlidersHorizontal, Trophy, FileText, Database, Info, Layers, Users, Wallet, ShieldCheck, Workflow, Lock, Zap, TrendingUp, Rocket, PiggyBank, Radio, FolderOpen, Cpu, Unlock, Wrench, ArrowRightLeft, Milestone, LineChart, Boxes, KeyRound, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SeoHead } from "@/components/SeoHead";
import { ScreenshotPlaceholder } from "@/components/ScreenshotPlaceholder";
import appRecommendationShot from "@/assets/shots/app-recommendation.png";
import appMatrixShot from "@/assets/shots/app-matrix.png";
import { ARCHITECTURES, CRITERIA, type ArchId, type CriterionId } from "@/data/architectures";
import { BRAND } from "@/lib/branding";

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
import { AUTHOR_HANDLE, AUTHOR_URL, LAST_REVIEWED, LOVABLE_REMIX_URL } from "@/lib/constants";
import { PRESETS, presetShareUrl } from "@/lib/presets";
import brettPhoto from "@/assets/brett-adler.png";

const FIGMA_URL = "https://www.figma.com/@brettadler";

const INPUT_TINT: Record<string, string> = {
  blue: "bg-brand-blue/10 text-brand-blue",
  magenta: "bg-brand-magenta/10 text-brand-magenta",
  orange: "bg-brand-orange/10 text-brand-orange",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
};


const INPUTS = [
  { icon: Milestone, label: "Stage", body: "Prototype, MVP, growth, or scale — sets what matters most.", tint: "magenta" },
  { icon: LineChart, label: "Expected MAU", body: "Monthly active users — drives the scaling and cost-at-scale weights.", tint: "blue" },
  { icon: Users, label: "Team skills", body: "Frontend, backend, DevOps, data, or none — shifts ops-burden weight.", tint: "sky" },
  { icon: Wallet, label: "Budget", body: "Low, medium, or high — tunes cost-at-small vs cost-at-large emphasis.", tint: "amber" },
  { icon: ShieldCheck, label: "Compliance", body: "GDPR, HIPAA, SOC 2, residency — HIPAA / SOC 2 / residency act as hard filters.", tint: "emerald" },
  { icon: Boxes, label: "Workloads", body: "CRUD, realtime, files, AI, background jobs, heavy compute.", tint: "magenta" },
  { icon: KeyRound, label: "Lock-in tolerance", body: "How willing you are to be tied to one vendor.", tint: "orange" },
  { icon: Rocket, label: "Time-to-market", body: "1–5 priority — how much speed-to-launch should dominate the ranking.", tint: "blue" },
];

const FEATURES = [
  {
    icon: Trophy,
    title: "Side-by-side scoring",
    body: "11 hosting and backend platforms scored across 12 criteria — time-to-launch, cost, scaling, lock-in, compliance, AI.",
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
  { q: "Is this an official Lovable product?", a: <>No. It's an independent, community-built template by <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-foreground">@brettadler on lovable.dev</a>, inspired by Lovable's design language. Not affiliated with, endorsed by, or representing Lovable. The Lovable name and brand belong to Lovable.</> },
  { q: "Where does the data come from?", a: "Curated from public vendor pricing pages, docs, and hands-on experience. Every score is editable in one file, and every cost band links to its source on the Methodology page." },
  { q: "How is bias handled?", a: "I built this and I'm a Lovable fan, so it has a perspective. Every criterion starts at the same baseline weight to avoid structurally favoring Lovable Cloud, and the recommendation card shows the top criteria that drove the score so you can sanity-check it. Full disclosure on the Methodology page." },
  { q: "What's actually in Lovable Cloud?", a: "Postgres database, auth, file storage, edge functions, and the Lovable AI Gateway (managed Gemini/Claude/GPT calls — no API keys to rotate). It's powered by Supabase under the hood, so if you outgrow Cloud you can detach to a self-owned Supabase project." },
  { q: "Do the other 9 platforms work with Lovable too?", a: "Not as native integrations. Only Lovable Cloud and external Supabase are wired in. For Vercel, Netlify, AWS, GCP, Azure, Cloudflare, Heroku, Render, and Fly.io you export your Lovable project to GitHub and deploy the backend yourself." },
  { q: "How fresh is it?", a: `Cost bands and rubric were last reviewed ${LAST_REVIEWED}. Always verify against current vendor pricing before committing.` },
  { q: "Can I customize it for a different decision?", a: "Yes — that's the point. The whole app is data-driven. Edit architectures.ts and you have a picker for CMSs, databases, auth providers, AI models, anything." },
  { q: "Is it free?", a: "Yes, MIT licensed. Fork it, ship it, sell a branded version — all fine." },
  { q: "Does it store my data?", a: "No backend. Your inputs live in your browser's localStorage and in the share URL you generate. Nothing leaves your device." },
];

const FAQ_PLAIN: { q: string; a: string }[] = [
  { q: "Is this an official Lovable product?", a: "No. It's an independent, community-built template by @brettadler on lovable.dev, inspired by Lovable's design language. Not affiliated with, endorsed by, or representing Lovable. The Lovable name and brand belong to Lovable." },
  { q: "Where does the data come from?", a: "Curated from public vendor pricing pages, docs, and hands-on experience. Every score is editable in one file, and every cost band links to its source on the Methodology page." },
  { q: "How is bias handled?", a: "I built this and I'm a Lovable fan, so it has a perspective. Every criterion starts at the same baseline weight to avoid structurally favoring Lovable Cloud, and the recommendation card shows the top criteria that drove the score so you can sanity-check it. Full disclosure on the Methodology page." },
  { q: "What's actually in Lovable Cloud?", a: "Postgres database, auth, file storage, edge functions, and the Lovable AI Gateway (managed Gemini/Claude/GPT calls — no API keys to rotate). It's powered by Supabase under the hood, so if you outgrow Cloud you can detach to a self-owned Supabase project." },
  { q: "Do the other 9 platforms work with Lovable too?", a: "Not as native integrations. Only Lovable Cloud and external Supabase are wired in. For Vercel, Netlify, AWS, GCP, Azure, Cloudflare, Heroku, Render, and Fly.io you export your Lovable project to GitHub and deploy the backend yourself." },
  { q: "How fresh is it?", a: `Cost bands and rubric were last reviewed ${LAST_REVIEWED}. Always verify against current vendor pricing before committing.` },
  { q: "Can I customize it for a different decision?", a: "Yes — that's the point. The whole app is data-driven. Edit architectures.ts and you have a picker for CMSs, databases, auth providers, AI models, anything." },
  { q: "Is it free?", a: "Yes, MIT licensed. Fork it, ship it, sell a branded version — all fine." },
  { q: "Does it store my data?", a: "No backend. Your inputs live in your browser's localStorage and in the share URL you generate. Nothing leaves your device." },
];

const Landing = () => {
  useEffect(() => {
    const ld = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_PLAIN.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seo = "faq";
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="min-h-dvh bg-background">
      <SeoHead
        title="Lovable Stack Architect — pick your backend"
        description="An independent, community-built comparator for picking a backend for your Lovable app. Free, MIT — remix it."
        path="/"
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
              Community template · Inspired by Lovable · Last reviewed {LAST_REVIEWED}
            </div>
            <h1 className="mx-auto max-w-4xl text-[2.5rem] font-extrabold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-6xl md:text-7xl">
              Pick the right backend for{" "}
              <span className="text-gradient">your Lovable app</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              An interactive comparator across 11 hosting and backend options — Lovable Cloud,
              Supabase, Vercel, Netlify, AWS, GCP, Azure, Cloudflare, Heroku, Render, and Fly.io — tuned to your
              stage, budget, and workloads. Methodology and sources are{" "}
              <Link
                to="/methodology"
                className="underline decoration-dotted underline-offset-4 hover:text-foreground"
              >
                openly published
              </Link>
              .
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-xs italic text-muted-foreground/80">
              A fan project by{" "}
              <a
                href={AUTHOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted underline-offset-2 hover:text-foreground"
              >
                {AUTHOR_HANDLE}
              </a>
              {" "}— not affiliated with Lovable.
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
                    Open the tool <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              {LOVABLE_REMIX_URL && (
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
              )}
            </div>
          </div>
        </section>

        {/* Screenshot placeholder — tool overview */}
        <section className="mx-auto -mt-4 max-w-6xl px-4 sm:px-6">
          <ScreenshotPlaceholder variant="recommendation" src={appRecommendationShot} />
        </section>



        {/* Bento: features + Lovable Cloud tile */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid grid-cols-12 gap-4 sm:gap-5">
            {/* Tile 1 — big feature */}
            <div className="group col-span-12 rounded-3xl border border-border bg-card p-8 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant md:col-span-8 sm:p-10">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue transition-transform group-hover:scale-110">
                <Trophy className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {FEATURES[0].title}
              </h2>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                {FEATURES[0].body}
              </p>
            </div>

            {/* Tile 2 */}
            <div className="group col-span-12 rounded-3xl border border-border bg-card p-8 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant md:col-span-4">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-magenta/10 text-brand-magenta transition-transform group-hover:scale-110">
                <Gauge className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {FEATURES[1].title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {FEATURES[1].body}
              </p>
            </div>

            {/* Tile 3 */}
            <div className="group col-span-12 rounded-3xl border border-border bg-card p-8 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant md:col-span-4">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange transition-transform group-hover:scale-110">
                <Share2 className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {FEATURES[2].title}
              </h2>
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
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  What's Lovable Cloud?
                </h2>
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

        {/* Inputs you give */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground sm:text-4xl">
              Inputs you give
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Eight inputs shape the recommendation — each one reweights the criteria below.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {INPUTS.map((i) => {
              const Icon = i.icon;
              return (
                <div
                  key={i.label}
                  className="rounded-3xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                >
                  <div className={cn(
                    "mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-inset ring-border/40 shadow-sm",
                    INPUT_TINT[i.tint],
                  )}>
                    <Icon className="h-5 w-5" strokeWidth={2.25} />
                  </div>
                  <div className="text-sm font-semibold text-foreground">{i.label}</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{i.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* What we score on */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground sm:text-4xl">
              What we score on
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Every option is scored 1–5 on these {CRITERIA.length} criteria. Your inputs shift the weights.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CRITERIA.map((c) => {
              const Icon = CRITERION_ICON[c.id];
              return (
                <div
                  key={c.id}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                >
                  <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground">{c.label}</div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.hint}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/methodology"
              className="inline-flex items-center gap-1 text-sm font-semibold text-foreground underline-offset-4 hover:underline"
            >
              See the full rubric & weights <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </section>

        {/* Platforms */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground sm:text-4xl">
              Platforms covered
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              11 options across managed backends, frontend hosts, hyperscalers, and PaaS.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {ARCHITECTURES.map((a) => {
              const brand = BRAND[a.id];
              const Icon = brand.Icon;
              return (
                <div
                  key={a.id}
                  className="rounded-2xl border border-border bg-card p-5 text-center shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                >
                  <div
                    className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-inset ring-border/40"
                    style={{ backgroundColor: `${brand.color}14`, color: brand.color }}
                  >
                    {brand.src ? (
                      <img src={brand.src} alt="" className="h-7 w-7" />
                    ) : Icon ? (
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    ) : null}
                  </div>
                  <div className="text-sm font-semibold text-foreground">{a.short}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{a.tagline}</div>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-xs italic text-muted-foreground/70">
            Logos are trademarks of their respective owners. Shown for identification only — this site is not affiliated with or endorsed by any of them.
          </p>
        </section>

        {/* Screenshot placeholder — comparison matrix */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground sm:text-4xl">
              See every option side-by-side
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              The full-width matrix shows all 11 platforms scored across all 12 criteria.
            </p>
          </div>
          <ScreenshotPlaceholder variant="matrix" src={appMatrixShot} />
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
                    A free, MIT-licensed community template you can remix on Lovable. The whole app
                    is data-driven — fork it, swap three files, and you have a decision tool for CMS
                    picks, database picks, auth providers, AI models, anything you'd put in a
                    comparison table.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {LOVABLE_REMIX_URL ? (
                      <Button asChild size="lg" className="gap-2 rounded-full px-6">
                        <a href={LOVABLE_REMIX_URL} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" /> Remix on Lovable
                        </a>
                      </Button>
                    ) : (
                      <span className="text-xs italic text-muted-foreground">
                        Remix link coming soon.
                      </span>
                    )}
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
          <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-3">
            {FAQ.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
              >
                <AccordionTrigger className="bg-card px-5 py-4 text-left text-sm hover:no-underline sm:text-base">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="border-t border-border/60 bg-muted/40 px-5 pt-4 pb-5 text-sm text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* About the builder */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-card sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <a
                href={AUTHOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative shrink-0 self-start"
                aria-label={`${AUTHOR_HANDLE} on lovable.dev`}
              >
                <span
                  aria-hidden="true"
                  className="absolute -inset-1 rounded-full bg-gradient-primary opacity-60 blur-md transition-opacity group-hover:opacity-90"
                />
                <img
                  src={brettPhoto}
                  alt="Brett Adler"
                  loading="lazy"
                  className="relative h-24 w-24 rounded-full border-2 border-border object-cover shadow-card sm:h-28 sm:w-28"
                />
              </a>
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  About the builder
                </div>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Built by{" "}
                  <a
                    href={AUTHOR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-dotted underline-offset-4 hover:text-foreground/80"
                  >
                    {AUTHOR_HANDLE} on lovable.dev
                  </a>
                </h3>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
                  Independent builder and Lovable superfan. Built this because friends kept asking which backend to use with Lovable and I didn't know enough to answer well. Figured other Lovable fans might want the same shortcut. Open to joining the Lovable team — say hi.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="rounded-full bg-gradient-primary p-[1.5px] shadow-elegant">
                    <Button asChild size="lg" className="gap-2 rounded-full px-6">
                      <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer">
                        <img src="/lovable-brand.svg" alt="" className="h-4 w-4" />
                        Lovable portfolio <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="gap-1.5 rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <a href={FIGMA_URL} target="_blank" rel="noopener noreferrer">
                      Figma portfolio <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
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
                {LOVABLE_REMIX_URL && (
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
                )}
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
