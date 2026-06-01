// ---------------------------------------------------------------------------
// Architectures, criteria, rubric, and curated cost bands.
//
// This file is the single source of truth for what gets compared and how it
// scores. To repurpose this template for a different decision space:
//
//   1. Replace the `ArchId` union and the `ARCHITECTURES` array with your
//      own options (name, tagline, description, best-for, watch-outs, cost
//      bands per stage, sources, lastReviewed, nativeIntegration).
//   2. Edit `CRITERIA` to the dimensions you want to score on.
//   3. Fill in `RUBRIC` with a 1 (poor) – 5 (excellent) score for every
//      (architecture × criterion) pair. Missing entries will break ranking.
//
// Scoring weights and input handling live in `src/lib/scoring.ts`.
// Cost bands last reviewed: May 2026. Re-verify against vendor pricing.
// ---------------------------------------------------------------------------

export type ArchId =
  | "lovable-cloud"
  | "lovable-supabase"
  | "lovable-vercel"
  | "lovable-netlify"
  | "lovable-aws"
  | "lovable-gcp"
  | "lovable-azure"
  | "lovable-heroku"
  | "lovable-render"
  | "lovable-fly";

export type ArchCategory = "managed-bff" | "frontend-host" | "hyperscaler" | "paas";

export type CriterionId =
  | "time-to-launch"
  | "dx-with-lovable"
  | "cost-small"
  | "cost-large"
  | "scaling-ceiling"
  | "realtime"
  | "storage"
  | "ai-compute"
  | "compliance"
  | "lock-in"
  | "ops-burden"
  | "migration";

export interface Source {
  label: string;
  url: string;
}

export interface Architecture {
  id: ArchId;
  category: ArchCategory;
  name: string;
  short: string;
  tagline: string;
  description: string;
  // True for first-party Lovable integrations (Cloud, external Supabase).
  // False means you'd export to GitHub and deploy the backend yourself.
  nativeIntegration: boolean;
  bestFor: string[];
  watchOuts: string[];
  // Monthly cost bands by scale tier (USD). Curated, not live quotes.
  costBands: { prototype: string; mvp: string; growth: string; scale: string };
  scaleCeiling: string;
  // Pricing/doc links backing the bands above.
  sources: Source[];
  // ISO date string for when this row was last sanity-checked against the vendor.
  lastReviewed: string;
}

export interface Criterion {
  id: CriterionId;
  label: string;
  hint: string;
}

export const CATEGORIES: { id: ArchCategory; label: string; description: string }[] = [
  {
    id: "managed-bff",
    label: "Managed backend",
    description: "Database, auth, storage, and functions in one product.",
  },
  {
    id: "frontend-host",
    label: "Frontend host + serverless",
    description: "Edge/serverless functions and CDN hosting; pair with any database.",
  },
  {
    id: "hyperscaler",
    label: "Hyperscaler cloud",
    description: "AWS, GCP, Azure — full control, every service, enterprise reach.",
  },
  {
    id: "paas",
    label: "Application PaaS",
    description: "Push-to-deploy app hosting that owns servers, scaling, and the database.",
  },
];

export const CRITERIA: Criterion[] = [
  { id: "time-to-launch", label: "Time to launch", hint: "How fast can you ship a first version?" },
  { id: "dx-with-lovable", label: "DX with Lovable", hint: "How smoothly does Lovable build against this stack?" },
  { id: "cost-small", label: "Cost at small scale", hint: "Monthly bill while you're under ~10k MAU." },
  { id: "cost-large", label: "Cost at large scale", hint: "Monthly bill at 100k+ MAU and heavy load." },
  { id: "scaling-ceiling", label: "Scaling ceiling", hint: "How far can it scale before you must replatform?" },
  { id: "realtime", label: "Realtime support", hint: "Websockets, presence, live queries." },
  { id: "storage", label: "File / media storage", hint: "Uploads, signed URLs, large files." },
  { id: "ai-compute", label: "AI / heavy compute", hint: "GPUs, long-running jobs, model hosting." },
  { id: "compliance", label: "Compliance reach", hint: "HIPAA, SOC2, regional residency." },
  { id: "lock-in", label: "Low vendor lock-in", hint: "Ease of leaving the vendor later." },
  { id: "ops-burden", label: "Low ops burden", hint: "Maintenance, on-call, infra work." },
  { id: "migration", label: "Migration path off", hint: "How painful to migrate away later?" },
];

const REVIEWED = "2026-05";

export const ARCHITECTURES: Architecture[] = [
  {
    id: "lovable-cloud",
    category: "managed-bff",
    name: "Lovable Cloud",
    short: "Cloud",
    tagline: "Integrated backend — fastest path",
    description:
      "Database (Postgres), auth, file storage, edge functions, and the Lovable AI Gateway (managed Gemini/Claude/GPT calls) provisioned automatically inside Lovable. No external accounts, no API keys to rotate.",
    nativeIntegration: true,
    bestFor: ["Prototypes & MVPs", "Small teams without DevOps", "Founder-led builds shipping this week", "Apps using AI Gateway for inference"],
    watchOuts: [
      "Curated provider list — no direct region pinning or BAA today",
      "Heavier GPU / long-running jobs need an external worker",
      "If you outgrow Cloud you can detach to a self-owned Supabase project — data is standard Postgres",
    ],
    costBands: { prototype: "$0", mvp: "$0–25", growth: "$80–250", scale: "$300–1.5k" },
    scaleCeiling: "Mid hundreds of thousands of MAU for typical CRUD + auth + storage workloads; heavy realtime or analytics lowers this.",
    sources: [
      { label: "Lovable pricing", url: "https://lovable.dev/pricing" },
      { label: "Lovable Cloud docs", url: "https://docs.lovable.dev/features/cloud" },
    ],
    lastReviewed: REVIEWED,
  },
  {
    id: "lovable-supabase",
    category: "managed-bff",
    name: "Lovable + external Supabase",
    short: "Supabase",
    tagline: "Own your Postgres backend project",
    description:
      "Lovable connects to a Supabase project you own. Full access to the dashboard, billing, regions, BAA, and tuning. Native Lovable integration.",
    nativeIntegration: true,
    bestFor: ["Teams that already use Supabase", "Need specific region, BAA, or org-billing", "Want direct DB access and dashboards"],
    watchOuts: ["You manage the Supabase project and billing", "Slightly more setup than Lovable Cloud"],
    costBands: { prototype: "$0", mvp: "$0–25", growth: "$25–300", scale: "$300–2k" },
    scaleCeiling: "Same Postgres-backed ceiling, with more tuning headroom and region/HA options.",
    sources: [
      { label: "Supabase pricing", url: "https://supabase.com/pricing" },
      { label: "Lovable + Supabase docs", url: "https://docs.lovable.dev/integrations/supabase" },
    ],
    lastReviewed: REVIEWED,
  },
  {
    id: "lovable-vercel",
    category: "frontend-host",
    name: "Self-host on Vercel",
    short: "Vercel",
    tagline: "Edge functions + global CDN",
    description:
      "Export the Lovable project to GitHub and deploy the frontend plus serverless/edge functions on Vercel. Pair with Neon, Supabase, or any managed DB.",
    nativeIntegration: false,
    bestFor: ["Edge-heavy apps", "Custom domains and global CDNs", "Teams already on Vercel"],
    watchOuts: [
      "Not a Lovable integration — requires GitHub export + your own deploy pipeline",
      "Hobby plan is personal-use only; commercial use requires Pro ($20/seat/mo)",
      "Bandwidth and function-invocation costs can spike",
      "You pick and operate the database",
    ],
    costBands: { prototype: "$0–20", mvp: "$20–60", growth: "$100–500", scale: "$500–3k" },
    scaleCeiling: "Very high — bound by your chosen database.",
    sources: [{ label: "Vercel pricing", url: "https://vercel.com/pricing" }],
    lastReviewed: REVIEWED,
  },
  {
    id: "lovable-netlify",
    category: "frontend-host",
    name: "Self-host on Netlify",
    short: "Netlify",
    tagline: "JAMstack hosting + edge functions",
    description:
      "Static + edge function hosting on Netlify after exporting from Lovable. Connects to any external database and auth provider.",
    nativeIntegration: false,
    bestFor: ["Marketing + app combo sites", "Form handlers and lightweight APIs", "Teams already on Netlify"],
    watchOuts: [
      "Not a Lovable integration — requires GitHub export + your own deploy pipeline",
      "Background jobs need an external service",
      "You still pick and operate the database",
    ],
    costBands: { prototype: "$0", mvp: "$9–40", growth: "$20–200", scale: "$500–2.5k" },
    scaleCeiling: "Very high — bound by your chosen database.",
    sources: [{ label: "Netlify pricing", url: "https://www.netlify.com/pricing/" }],
    lastReviewed: REVIEWED,
  },
  {
    id: "lovable-aws",
    category: "hyperscaler",
    name: "Self-host on AWS",
    short: "AWS",
    tagline: "Every service, every region",
    description:
      "Export from Lovable and run the backend on AWS: API Gateway/ALB → ECS/Lambda → RDS, with S3, Cognito, SQS, and Bedrock.",
    nativeIntegration: false,
    bestFor: ["Enterprise & regulated industries", "Heavy compute, GPUs, data pipelines", "Strict residency and SSO"],
    watchOuts: [
      "Not a Lovable integration — you own the entire deploy and ops story",
      "Highest ops burden of the list",
      "Slowest to first deploy; bill complexity grows fast",
    ],
    costBands: { prototype: "$0–50", mvp: "$80–300", growth: "$400–2k", scale: "$2k–20k+" },
    scaleCeiling: "Effectively unbounded for typical web workloads — scales to enterprise loads with appropriate tuning.",
    sources: [{ label: "AWS pricing", url: "https://aws.amazon.com/pricing/" }],
    lastReviewed: REVIEWED,
  },
  {
    id: "lovable-gcp",
    category: "hyperscaler",
    name: "Self-host on Google Cloud",
    short: "GCP",
    tagline: "Cloud Run + Vertex AI",
    description:
      "Cloud Run for stateless services, Cloud SQL/AlloyDB for Postgres, Cloud Storage, Identity Platform, and Vertex AI.",
    nativeIntegration: false,
    bestFor: ["AI/ML-heavy products", "Container-based services that auto-scale to zero", "BigQuery analytics pipelines"],
    watchOuts: [
      "Not a Lovable integration — requires GitHub export + your own DevOps",
      "IAM and networking require real expertise",
      "Egress and AI inference can dominate the bill",
    ],
    costBands: { prototype: "$0–30", mvp: "$60–250", growth: "$300–1.8k", scale: "$1.8k–18k+" },
    scaleCeiling: "Effectively unbounded for typical web workloads — global, multi-region scale available.",
    sources: [{ label: "GCP pricing", url: "https://cloud.google.com/pricing" }],
    lastReviewed: REVIEWED,
  },
  {
    id: "lovable-azure",
    category: "hyperscaler",
    name: "Self-host on Azure",
    short: "Azure",
    tagline: "Enterprise & Microsoft estate",
    description:
      "App Service / Container Apps, Azure SQL or Postgres, Blob Storage, Entra ID for SSO, and Azure OpenAI.",
    nativeIntegration: false,
    bestFor: ["Enterprises on Microsoft 365 / Entra ID", "Regulated workloads in EU/US gov regions", "Azure OpenAI use cases"],
    watchOuts: [
      "Not a Lovable integration — requires GitHub export + your own DevOps",
      "Steep learning curve outside the Microsoft ecosystem",
      "Heaviest setup of the hyperscalers for new teams",
    ],
    costBands: { prototype: "$0–50", mvp: "$80–300", growth: "$400–2k", scale: "$2k–20k+" },
    scaleCeiling: "Effectively unbounded for typical web workloads — enterprise-grade.",
    sources: [{ label: "Azure pricing", url: "https://azure.microsoft.com/en-us/pricing/" }],
    lastReviewed: REVIEWED,
  },
  {
    id: "lovable-heroku",
    category: "paas",
    name: "Self-host on Heroku",
    short: "Heroku",
    tagline: "Classic push-to-deploy PaaS",
    description:
      "Heroku dynos for backend services with Heroku Postgres, Redis, and add-ons. Minimal infra to manage.",
    nativeIntegration: false,
    bestFor: ["Familiar Rails/Node teams", "Simple web + worker setups", "Predictable monolith deploys"],
    watchOuts: [
      "Not a Lovable integration — requires GitHub export + your own deploy pipeline",
      "No free tier — Eco dynos start at $5/mo, Basic Postgres $5/mo",
      "Pricier per unit of compute at scale; limited regions",
    ],
    costBands: { prototype: "$5–15", mvp: "$25–100", growth: "$200–1k", scale: "$1k–6k" },
    scaleCeiling: "High — fine for most SaaS, weaker on heavy data/compute.",
    sources: [{ label: "Heroku pricing", url: "https://www.heroku.com/pricing" }],
    lastReviewed: REVIEWED,
  },
  {
    id: "lovable-render",
    category: "paas",
    name: "Self-host on Render",
    short: "Render",
    tagline: "Modern Heroku-style PaaS",
    description:
      "Web services, background workers, cron jobs, and managed Postgres on Render with infra-as-code blueprints.",
    nativeIntegration: false,
    bestFor: ["Indie/SMB teams wanting simple PaaS", "Background workers + cron", "Predictable pricing"],
    watchOuts: [
      "Not a Lovable integration — requires GitHub export + your own deploy pipeline",
      "No free always-on web services; paid instances start at $7/mo",
      "Smaller ecosystem than hyperscalers; fewer compliance certifications",
    ],
    costBands: { prototype: "$0–7", mvp: "$15–80", growth: "$150–800", scale: "$800–4k" },
    scaleCeiling: "High — comparable to Heroku with friendlier pricing.",
    sources: [{ label: "Render pricing", url: "https://render.com/pricing" }],
    lastReviewed: REVIEWED,
  },
  {
    id: "lovable-fly",
    category: "paas",
    name: "Self-host on Fly.io",
    short: "Fly.io",
    tagline: "Run containers close to users",
    description:
      "Deploy Docker containers to Fly's global edge with Fly Postgres or Litestream-replicated SQLite.",
    nativeIntegration: false,
    bestFor: ["Latency-sensitive apps", "Geo-distributed workloads", "Teams that like containers"],
    watchOuts: [
      "Not a Lovable integration — requires GitHub export + your own deploy pipeline",
      "No free allowance — pay-as-you-go from a few dollars/mo",
      "Postgres HA needs careful setup; smaller managed-service catalog",
    ],
    costBands: { prototype: "$1–5", mvp: "$10–60", growth: "$100–600", scale: "$600–3k" },
    scaleCeiling: "Very high for stateless workloads; the database is the practical limit.",
    sources: [{ label: "Fly.io pricing", url: "https://fly.io/docs/about/pricing/" }],
    lastReviewed: REVIEWED,
  },
];

// Rubric: 1 (poor) – 5 (excellent).
// Notes on Lovable Cloud scores vs external Supabase:
// - ai-compute: 4 because AI Gateway covers managed inference (Gemini/Claude/GPT)
//   without API key handling. GPU/training would still need an external worker.
// - lock-in: 3 because Cloud data lives in standard Postgres and can be
//   detached to a self-owned Supabase project — same portability story.
// - compliance: 3 (vs Supabase's 4) because Cloud does not yet expose region
//   pinning, BAA, or custom DPAs directly to the user.
export const RUBRIC: Record<ArchId, Record<CriterionId, number>> = {
  "lovable-cloud": {
    "time-to-launch": 5, "dx-with-lovable": 5, "cost-small": 5, "cost-large": 3,
    "scaling-ceiling": 3, "realtime": 4, "storage": 4, "ai-compute": 4,
    "compliance": 3, "lock-in": 3, "ops-burden": 5, "migration": 3,
  },
  "lovable-supabase": {
    "time-to-launch": 4, "dx-with-lovable": 5, "cost-small": 5, "cost-large": 4,
    "scaling-ceiling": 4, "realtime": 5, "storage": 4, "ai-compute": 3,
    "compliance": 4, "lock-in": 3, "ops-burden": 4, "migration": 4,
  },
  "lovable-vercel": {
    "time-to-launch": 3, "dx-with-lovable": 3, "cost-small": 3, "cost-large": 3,
    "scaling-ceiling": 5, "realtime": 3, "storage": 3, "ai-compute": 3,
    "compliance": 3, "lock-in": 3, "ops-burden": 3, "migration": 4,
  },
  "lovable-netlify": {
    "time-to-launch": 3, "dx-with-lovable": 3, "cost-small": 3, "cost-large": 3,
    "scaling-ceiling": 4, "realtime": 2, "storage": 3, "ai-compute": 2,
    "compliance": 3, "lock-in": 3, "ops-burden": 3, "migration": 4,
  },
  "lovable-aws": {
    "time-to-launch": 2, "dx-with-lovable": 2, "cost-small": 2, "cost-large": 4,
    "scaling-ceiling": 5, "realtime": 4, "storage": 5, "ai-compute": 5,
    "compliance": 5, "lock-in": 2, "ops-burden": 2, "migration": 3,
  },
  "lovable-gcp": {
    "time-to-launch": 2, "dx-with-lovable": 2, "cost-small": 2, "cost-large": 4,
    "scaling-ceiling": 5, "realtime": 4, "storage": 5, "ai-compute": 5,
    "compliance": 5, "lock-in": 2, "ops-burden": 2, "migration": 3,
  },
  "lovable-azure": {
    "time-to-launch": 2, "dx-with-lovable": 2, "cost-small": 2, "cost-large": 4,
    "scaling-ceiling": 5, "realtime": 3, "storage": 5, "ai-compute": 5,
    "compliance": 5, "lock-in": 2, "ops-burden": 2, "migration": 3,
  },
  "lovable-heroku": {
    "time-to-launch": 4, "dx-with-lovable": 3, "cost-small": 3, "cost-large": 2,
    "scaling-ceiling": 3, "realtime": 3, "storage": 3, "ai-compute": 2,
    "compliance": 3, "lock-in": 3, "ops-burden": 4, "migration": 4,
  },
  "lovable-render": {
    "time-to-launch": 4, "dx-with-lovable": 3, "cost-small": 4, "cost-large": 3,
    "scaling-ceiling": 4, "realtime": 3, "storage": 3, "ai-compute": 3,
    "compliance": 3, "lock-in": 4, "ops-burden": 4, "migration": 4,
  },
  "lovable-fly": {
    "time-to-launch": 3, "dx-with-lovable": 3, "cost-small": 4, "cost-large": 3,
    "scaling-ceiling": 4, "realtime": 4, "storage": 3, "ai-compute": 3,
    "compliance": 3, "lock-in": 4, "ops-burden": 3, "migration": 4,
  },
};

export const ARCH_BY_ID: Record<ArchId, Architecture> = Object.fromEntries(
  ARCHITECTURES.map((a) => [a.id, a]),
) as Record<ArchId, Architecture>;
