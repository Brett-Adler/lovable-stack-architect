// Architectures, criteria, rubric, and curated cost bands.
// Scores are 1 (poor) to 5 (excellent) for each criterion.

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

export interface Architecture {
  id: ArchId;
  category: ArchCategory;
  name: string;
  short: string;
  tagline: string;
  description: string;
  bestFor: string[];
  watchOuts: string[];
  // Monthly cost bands by scale tier (USD).
  costBands: { prototype: string; mvp: string; growth: string; scale: string };
  scaleCeiling: string;
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

export const ARCHITECTURES: Architecture[] = [
  {
    id: "lovable-cloud",
    category: "managed-bff",
    name: "Lovable Cloud",
    short: "Cloud",
    tagline: "Integrated backend — fastest path",
    description:
      "Database, auth, storage, and edge functions provisioned automatically inside Lovable. No external accounts.",
    bestFor: ["Prototypes & MVPs", "Small teams without DevOps", "Founder-led builds shipping this week"],
    watchOuts: ["Curated provider list", "Heavier GPU/long-running jobs need an external worker"],
    costBands: { prototype: "$0", mvp: "$0–25", growth: "$80–250", scale: "$300–1.5k" },
    scaleCeiling: "Comfortable to mid hundreds of thousands of MAU.",
  },
  {
    id: "lovable-supabase",
    category: "managed-bff",
    name: "Lovable + external Supabase",
    short: "Supabase",
    tagline: "Own your Postgres backend project",
    description:
      "Lovable connects to a Supabase project you own. Full access to the dashboard, billing, regions, and tuning.",
    bestFor: ["Teams that already use Supabase", "Need specific region or org-billing", "Want direct DB access"],
    watchOuts: ["You manage the Supabase project", "Slightly more setup than Lovable Cloud"],
    costBands: { prototype: "$0", mvp: "$0–25", growth: "$25–300", scale: "$300–2k" },
    scaleCeiling: "Same Postgres-backed ceiling, with more tuning headroom.",
  },
  {
    id: "lovable-vercel",
    category: "frontend-host",
    name: "Lovable + Vercel",
    short: "Vercel",
    tagline: "Edge functions + global CDN",
    description:
      "Deploy the Lovable frontend and serverless/edge functions to Vercel. Pair with Neon, Supabase, or any managed DB.",
    bestFor: ["Edge-heavy apps", "Custom domains and global CDNs", "Teams that want best-in-class DX for Next-style apps"],
    watchOuts: ["Bandwidth and function-invocation costs can spike", "You pick and operate the database"],
    costBands: { prototype: "$0", mvp: "$20–60", growth: "$100–500", scale: "$500–3k" },
    scaleCeiling: "Very high — bound by your chosen database.",
  },
  {
    id: "lovable-netlify",
    category: "frontend-host",
    name: "Lovable + Netlify",
    short: "Netlify",
    tagline: "JAMstack hosting + edge functions",
    description:
      "Static + edge function hosting on Netlify. Connects to any external database and auth provider.",
    bestFor: ["Marketing + app combo sites", "Form handlers and lightweight APIs", "Teams already on Netlify"],
    watchOuts: ["Background jobs need an external service", "You still pick the database"],
    costBands: { prototype: "$0", mvp: "$19–60", growth: "$99–400", scale: "$500–2.5k" },
    scaleCeiling: "Very high — bound by your chosen database.",
  },
  {
    id: "lovable-aws",
    category: "hyperscaler",
    name: "Lovable + AWS",
    short: "AWS",
    tagline: "Every service, every region",
    description:
      "Frontend from Lovable, backend on AWS: API Gateway/ALB → ECS/Lambda → RDS, with S3, Cognito, SQS, and Bedrock.",
    bestFor: ["Enterprise & regulated industries", "Heavy compute, GPUs, data pipelines", "Strict residency and SSO"],
    watchOuts: ["Highest ops burden", "Slowest to first deploy", "Bill complexity grows fast"],
    costBands: { prototype: "$0–50", mvp: "$80–300", growth: "$400–2k", scale: "$2k–20k+" },
    scaleCeiling: "Effectively unbounded — scales to enterprise workloads.",
  },
  {
    id: "lovable-gcp",
    category: "hyperscaler",
    name: "Lovable + Google Cloud",
    short: "GCP",
    tagline: "Cloud Run + Vertex AI",
    description:
      "Cloud Run for stateless services, Cloud SQL/AlloyDB for Postgres, Cloud Storage, Identity Platform, and Vertex AI.",
    bestFor: ["AI/ML-heavy products", "Container-based services that auto-scale to zero", "BigQuery analytics pipelines"],
    watchOuts: ["Requires DevOps to wire IAM and networking", "Egress and AI inference can dominate the bill"],
    costBands: { prototype: "$0–30", mvp: "$60–250", growth: "$300–1.8k", scale: "$1.8k–18k+" },
    scaleCeiling: "Effectively unbounded — global, multi-region scale.",
  },
  {
    id: "lovable-azure",
    category: "hyperscaler",
    name: "Lovable + Azure",
    short: "Azure",
    tagline: "Enterprise & Microsoft estate",
    description:
      "App Service / Container Apps, Azure SQL or Postgres, Blob Storage, Entra ID for SSO, and Azure OpenAI.",
    bestFor: ["Enterprises on Microsoft 365 / Entra ID", "Regulated workloads in EU/US gov regions", "Azure OpenAI use cases"],
    watchOuts: ["Steep learning curve outside the MS ecosystem", "Heaviest setup of the hyperscalers for new teams"],
    costBands: { prototype: "$0–50", mvp: "$80–300", growth: "$400–2k", scale: "$2k–20k+" },
    scaleCeiling: "Effectively unbounded — enterprise-grade.",
  },
  {
    id: "lovable-heroku",
    category: "paas",
    name: "Lovable + Heroku",
    short: "Heroku",
    tagline: "Classic push-to-deploy PaaS",
    description:
      "Heroku dynos for backend services with Heroku Postgres, Redis, and add-ons. Minimal infra to manage.",
    bestFor: ["Familiar Rails/Node teams", "Simple web + worker setups", "Predictable monolith deploys"],
    watchOuts: ["Pricier per unit of compute at scale", "Limited regions and managed-service breadth"],
    costBands: { prototype: "$0–10", mvp: "$25–100", growth: "$200–1k", scale: "$1k–6k" },
    scaleCeiling: "High — fine for most SaaS, weaker on heavy data/compute.",
  },
  {
    id: "lovable-render",
    category: "paas",
    name: "Lovable + Render",
    short: "Render",
    tagline: "Modern Heroku-style PaaS",
    description:
      "Web services, background workers, cron jobs, and managed Postgres on Render with infra-as-code blueprints.",
    bestFor: ["Indie/SMB teams wanting simple PaaS", "Background workers + cron", "Predictable pricing"],
    watchOuts: ["Smaller ecosystem than hyperscalers", "Fewer compliance certifications"],
    costBands: { prototype: "$0", mvp: "$15–80", growth: "$150–800", scale: "$800–4k" },
    scaleCeiling: "High — comparable to Heroku with friendlier pricing.",
  },
  {
    id: "lovable-fly",
    category: "paas",
    name: "Lovable + Fly.io",
    short: "Fly.io",
    tagline: "Run containers close to users",
    description:
      "Deploy Docker containers to Fly's global edge with Fly Postgres or Litestream-replicated SQLite.",
    bestFor: ["Latency-sensitive apps", "Geo-distributed workloads", "Teams that like containers"],
    watchOuts: ["Postgres HA needs careful setup", "Smaller managed-service catalog than hyperscalers"],
    costBands: { prototype: "$0", mvp: "$10–60", growth: "$100–600", scale: "$600–3k" },
    scaleCeiling: "Very high for stateless; database is the limit.",
  },
];

// Rubric: 1 (poor) – 5 (excellent)
export const RUBRIC: Record<ArchId, Record<CriterionId, number>> = {
  "lovable-cloud": {
    "time-to-launch": 5, "dx-with-lovable": 5, "cost-small": 5, "cost-large": 3,
    "scaling-ceiling": 3, "realtime": 4, "storage": 4, "ai-compute": 3,
    "compliance": 3, "lock-in": 2, "ops-burden": 5, "migration": 3,
  },
  "lovable-supabase": {
    "time-to-launch": 4, "dx-with-lovable": 5, "cost-small": 5, "cost-large": 4,
    "scaling-ceiling": 4, "realtime": 5, "storage": 4, "ai-compute": 3,
    "compliance": 4, "lock-in": 3, "ops-burden": 4, "migration": 4,
  },
  "lovable-vercel": {
    "time-to-launch": 4, "dx-with-lovable": 4, "cost-small": 3, "cost-large": 3,
    "scaling-ceiling": 5, "realtime": 3, "storage": 3, "ai-compute": 3,
    "compliance": 3, "lock-in": 3, "ops-burden": 3, "migration": 4,
  },
  "lovable-netlify": {
    "time-to-launch": 4, "dx-with-lovable": 4, "cost-small": 3, "cost-large": 3,
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
