// Architectures, criteria, rubric, and curated cost bands.
// Scores are 1 (poor) to 5 (excellent) for each criterion.

export type ArchId = "lovable-cloud" | "lovable-supabase" | "lovable-vercel" | "lovable-hyperscaler";

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
    name: "Lovable Cloud",
    short: "Cloud",
    tagline: "Integrated backend — fastest path",
    description: "Database, auth, storage, and edge functions provisioned automatically inside Lovable. No external accounts.",
    bestFor: ["Prototypes & MVPs", "Small teams without DevOps", "Founder-led builds shipping this week"],
    watchOuts: ["Curated provider list", "Heavier GPU/long-running jobs need an external worker"],
    costBands: { prototype: "$0", mvp: "$0–25", growth: "$80–250", scale: "$300–1.5k" },
    scaleCeiling: "Comfortable to mid hundreds of thousands of MAU.",
  },
  {
    id: "lovable-supabase",
    name: "Lovable + external Supabase",
    short: "Supabase",
    tagline: "Own your backend project",
    description: "Lovable connects to a Supabase project you own. Full access to the dashboard, billing, and regions.",
    bestFor: ["Teams that already use Supabase", "Need specific region or org-billing", "Want direct DB access for analytics"],
    watchOuts: ["You manage the Supabase project", "Slightly more setup than Lovable Cloud"],
    costBands: { prototype: "$0", mvp: "$0–25", growth: "$25–300", scale: "$300–2k" },
    scaleCeiling: "Same Postgres-backed ceiling, with more tuning headroom.",
  },
  {
    id: "lovable-vercel",
    name: "Lovable + Vercel / Netlify",
    short: "Vercel",
    tagline: "Frontend hosting + serverless functions",
    description: "Use Lovable for the app, deploy frontend and edge/serverless functions to Vercel or Netlify. Pair with any DB.",
    bestFor: ["Edge-heavy apps", "Custom domains and global CDNs", "Teams comfortable wiring their own DB"],
    watchOuts: ["You pick and operate the database", "More moving parts than Cloud"],
    costBands: { prototype: "$0", mvp: "$20–60", growth: "$100–500", scale: "$500–3k" },
    scaleCeiling: "Very high — bound by your chosen database.",
  },
  {
    id: "lovable-hyperscaler",
    name: "Lovable + AWS / GCP / Azure / Heroku",
    short: "Hyperscaler",
    tagline: "Maximum control & enterprise reach",
    description: "Frontend from Lovable, backend on a hyperscaler or PaaS. Full access to managed services, regions, compliance.",
    bestFor: ["Enterprise & regulated industries", "Heavy compute, GPUs, data pipelines", "Strict residency and SSO needs"],
    watchOuts: ["Highest ops burden", "Slowest to a first deploy", "Needs experienced backend/DevOps"],
    costBands: { prototype: "$0–50", mvp: "$80–300", growth: "$400–2k", scale: "$2k–20k+" },
    scaleCeiling: "Effectively unbounded — scales to enterprise workloads.",
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
    "time-to-launch": 3, "dx-with-lovable": 3, "cost-small": 3, "cost-large": 4,
    "scaling-ceiling": 5, "realtime": 3, "storage": 3, "ai-compute": 3,
    "compliance": 3, "lock-in": 3, "ops-burden": 3, "migration": 4,
  },
  "lovable-hyperscaler": {
    "time-to-launch": 2, "dx-with-lovable": 2, "cost-small": 2, "cost-large": 4,
    "scaling-ceiling": 5, "realtime": 4, "storage": 5, "ai-compute": 5,
    "compliance": 5, "lock-in": 2, "ops-burden": 2, "migration": 3,
  },
};

export const ARCH_BY_ID: Record<ArchId, Architecture> = Object.fromEntries(
  ARCHITECTURES.map((a) => [a.id, a]),
) as Record<ArchId, Architecture>;
