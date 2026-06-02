import { ARCH_BY_ID, type ArchId } from "@/data/architectures";
import type { Inputs } from "@/lib/scoring";

// Mermaid v11 is strict about special chars (parentheses, slashes, plus signs,
// brackets) inside node labels. Wrap every label in double quotes to make it
// always-safe regardless of content.
const N = (id: string, label: string) => `${id}["${label}"]`;
const DB = (id: string, label: string) => `${id}[("${label}")]`;

const FRONTEND_HOST_LABEL: Partial<Record<ArchId, string>> = {
  "lovable-cloudflare": "Cloudflare Pages CDN",
  "lovable-vercel": "Vercel CDN + Edge",
  "lovable-netlify": "Netlify CDN + Edge",
};

const BACKEND_SERVICES: Partial<Record<ArchId, (wantsRealtime: boolean, wantsFiles: boolean, wantsAI: boolean) => string[]>> = {
  "lovable-cloud": (wantsRealtime, wantsFiles, wantsAI) => {
    const out: string[] = [
      `  HOST --> ${N("API", "Lovable Cloud Edge Functions")}`,
      `  HOST --> ${N("AUTH", "Cloud Auth")}`,
      `  API --> ${DB("DB", "Cloud Postgres")}`,
    ];
    if (wantsFiles) out.push(`  API --> ${N("ST", "Cloud Storage")}`);
    if (wantsRealtime) out.push("  HOST -.realtime.-> DB");
    if (wantsAI) out.push(`  API --> ${N("AI", "Lovable AI Gateway")}`);
    return out;
  },
  "lovable-supabase": (wantsRealtime, wantsFiles, wantsAI) => {
    const out: string[] = [
      `  HOST --> ${N("SAPI", "Supabase Edge Functions")}`,
      `  HOST --> ${N("SAUTH", "Supabase Auth")}`,
      `  SAPI --> ${DB("SDB", "Supabase Postgres")}`,
    ];
    if (wantsFiles) out.push(`  SAPI --> ${N("SST", "Supabase Storage")}`);
    if (wantsRealtime) out.push("  HOST -.realtime.-> SDB");
    if (wantsAI) out.push(`  SAPI --> ${N("AI", "OpenAI / Lovable AI")}`);
    return out;
  },
};

export function buildMermaid(archId: ArchId, inputs: Inputs): string {
  const wantsRealtime = inputs.workloads.includes("realtime");
  const wantsFiles = inputs.workloads.includes("files");
  const wantsAI = inputs.workloads.includes("ai") || inputs.workloads.includes("heavy-compute");
  const wantsJobs = inputs.workloads.includes("background-jobs");

  // Hybrid (split-services) stacks: frontend host → backend services.
  const arch = ARCH_BY_ID[archId];
  if (arch?.composition) {
    const frontLabel = FRONTEND_HOST_LABEL[arch.composition.frontend] ?? ARCH_BY_ID[arch.composition.frontend].short;
    const backendBuilder = BACKEND_SERVICES[arch.composition.backend];
    const hybridLines: string[] = [
      "graph TD",
      `  ${N("U", "Users")} --> ${N("HOST", `${frontLabel} (hosts frontend)`)}`,
    ];
    if (backendBuilder) {
      hybridLines.push(...backendBuilder(wantsRealtime, wantsFiles, wantsAI));
    }
    return hybridLines.join("\n");
  }

  const lines: string[] = [
    "graph TD",
    `  ${N("U", "Users")} --> ${N("FE", "Lovable Frontend (React + Vite)")}`,
  ];

  switch (archId) {

    case "lovable-cloud":
      lines.push(`  FE --> ${N("API", "Lovable Cloud Edge Functions")}`);
      lines.push(`  FE --> ${N("AUTH", "Cloud Auth")}`);
      lines.push(`  API --> ${DB("DB", "Cloud Postgres")}`);
      if (wantsFiles) lines.push(`  API --> ${N("ST", "Cloud Storage")}`);
      if (wantsRealtime) lines.push("  FE -.realtime.-> DB");
      if (wantsAI) lines.push(`  API --> ${N("AI", "Lovable AI Gateway")}`);
      break;
    case "lovable-supabase":
      lines.push(`  FE --> ${N("SAPI", "Supabase Edge Functions")}`);
      lines.push(`  FE --> ${N("SAUTH", "Supabase Auth")}`);
      lines.push(`  SAPI --> ${DB("SDB", "Supabase Postgres")}`);
      if (wantsFiles) lines.push(`  SAPI --> ${N("SST", "Supabase Storage")}`);
      if (wantsRealtime) lines.push("  FE -.realtime.-> SDB");
      if (wantsAI) lines.push(`  SAPI --> ${N("AI", "OpenAI / Lovable AI")}`);
      break;
    case "lovable-vercel":
      lines.push(`  FE --> ${N("CDN", "Vercel CDN")}`);
      lines.push(`  CDN --> ${N("FN", "Edge / Serverless Functions")}`);
      lines.push(`  FN --> ${DB("DB", "Managed Postgres (Neon / RDS)")}`);
      lines.push(`  FN --> ${N("AUTH", "Auth Provider (Clerk / Auth0)")}`);
      if (wantsFiles) lines.push(`  FN --> ${N("S3", "Object Storage (S3 / R2)")}`);
      if (wantsAI) lines.push(`  FN --> ${N("AI", "AI APIs")}`);
      if (wantsJobs) lines.push(`  FN --> ${N("Q", "Queue (Upstash / Inngest)")}`);
      break;
    case "lovable-netlify":
      lines.push(`  FE --> ${N("CDN", "Netlify CDN")}`);
      lines.push(`  CDN --> ${N("FN", "Netlify Edge / Functions")}`);
      lines.push(`  FN --> ${DB("DB", "Managed Postgres (Neon / Supabase)")}`);
      lines.push(`  FN --> ${N("AUTH", "Auth Provider (Clerk / Auth0)")}`);
      if (wantsFiles) lines.push(`  FN --> ${N("S3", "Object Storage (S3 / R2)")}`);
      if (wantsAI) lines.push(`  FN --> ${N("AI", "AI APIs")}`);
      if (wantsJobs) lines.push(`  FN --> ${N("Q", "Queue (Inngest / Upstash)")}`);
      break;
    case "lovable-aws":
      lines.push(`  FE --> ${N("CF", "CloudFront + API Gateway")}`);
      lines.push(`  CF --> ${N("SVC", "ECS Fargate / Lambda")}`);
      lines.push(`  SVC --> ${DB("DB", "Amazon RDS Postgres")}`);
      lines.push(`  SVC --> ${N("AUTH", "Amazon Cognito")}`);
      if (wantsFiles) lines.push(`  SVC --> ${N("S3", "Amazon S3")}`);
      if (wantsJobs) lines.push(`  SVC --> ${N("Q", "Amazon SQS")}`);
      if (wantsAI) lines.push(`  SVC --> ${N("GPU", "Bedrock / SageMaker")}`);
      break;
    case "lovable-gcp":
      lines.push(`  FE --> ${N("LB", "Cloud Load Balancing")}`);
      lines.push(`  LB --> ${N("SVC", "Cloud Run")}`);
      lines.push(`  SVC --> ${DB("DB", "Cloud SQL / AlloyDB Postgres")}`);
      lines.push(`  SVC --> ${N("AUTH", "Identity Platform")}`);
      if (wantsFiles) lines.push(`  SVC --> ${N("ST", "Cloud Storage")}`);
      if (wantsJobs) lines.push(`  SVC --> ${N("Q", "Pub/Sub")}`);
      if (wantsAI) lines.push(`  SVC --> ${N("AI", "Vertex AI")}`);
      break;
    case "lovable-azure":
      lines.push(`  FE --> ${N("FD", "Azure Front Door")}`);
      lines.push(`  FD --> ${N("SVC", "Container Apps / App Service")}`);
      lines.push(`  SVC --> ${DB("DB", "Azure Database for Postgres")}`);
      lines.push(`  SVC --> ${N("AUTH", "Microsoft Entra ID")}`);
      if (wantsFiles) lines.push(`  SVC --> ${N("ST", "Azure Blob Storage")}`);
      if (wantsJobs) lines.push(`  SVC --> ${N("Q", "Azure Service Bus")}`);
      if (wantsAI) lines.push(`  SVC --> ${N("AI", "Azure OpenAI")}`);
      break;
    case "lovable-heroku":
      lines.push(`  FE --> ${N("RT", "Heroku Router")}`);
      lines.push(`  RT --> ${N("WEB", "Web Dynos")}`);
      lines.push(`  WEB --> ${DB("DB", "Heroku Postgres")}`);
      if (wantsRealtime) lines.push(`  WEB --> ${N("RD", "Heroku Redis")}`);
      if (wantsFiles) lines.push(`  WEB --> ${N("S3", "AWS S3 add-on")}`);
      if (wantsJobs) lines.push(`  WEB --> ${N("WK", "Worker Dynos")}`);
      if (wantsAI) lines.push(`  WEB --> ${N("AI", "OpenAI / Anthropic")}`);
      break;
    case "lovable-render":
      lines.push(`  FE --> ${N("WEB", "Render Web Service")}`);
      lines.push(`  WEB --> ${DB("DB", "Render Postgres")}`);
      if (wantsFiles) lines.push(`  WEB --> ${N("S3", "Cloudflare R2 / S3")}`);
      if (wantsJobs) lines.push(`  WEB --> ${N("WK", "Background Workers + Cron")}`);
      if (wantsAI) lines.push(`  WEB --> ${N("AI", "OpenAI / Anthropic")}`);
      break;
    case "lovable-fly":
      lines.push(`  FE --> ${N("EDGE", "Fly Edge Anycast")}`);
      lines.push(`  EDGE --> ${N("APP", "Fly Machines (Containers)")}`);
      lines.push(`  APP --> ${DB("DB", "Fly Postgres")}`);
      if (wantsFiles) lines.push(`  APP --> ${N("S3", "Tigris / S3")}`);
      if (wantsJobs) lines.push(`  APP --> ${N("WK", "Background Machines")}`);
      if (wantsAI) lines.push(`  APP --> ${N("AI", "Replicate / OpenAI")}`);
      break;
    case "lovable-cloudflare":
      lines.push(`  FE --> ${N("PG", "Cloudflare Pages CDN")}`);
      lines.push(`  PG --> ${N("WK", "Workers (edge runtime)")}`);
      lines.push(`  WK --> ${DB("DB", "D1 SQLite / Hyperdrive Postgres")}`);
      if (wantsRealtime) lines.push(`  WK --> ${N("DO", "Durable Objects")}`);
      if (wantsFiles) lines.push(`  WK --> ${N("R2", "R2 Object Storage")}`);
      if (wantsAI) lines.push(`  WK --> ${N("AI", "Workers AI")}`);
      if (wantsJobs) lines.push(`  WK --> ${N("Q", "Cloudflare Queues")}`);
      break;
  }

  return lines.join("\n");
}

/**
 * Build a plain-text breakdown of the stack's components — used by the Tech Stack
 * card to show a "what's actually in this stack" summary alongside the diagram.
 */
export interface StackSummaryRow {
  label: string;
  value: string;
}

export function summarizeStack(archId: ArchId, inputs: Inputs): StackSummaryRow[] {
  const wantsRealtime = inputs.workloads.includes("realtime");
  const wantsFiles = inputs.workloads.includes("files");
  const wantsAI = inputs.workloads.includes("ai") || inputs.workloads.includes("heavy-compute");
  const wantsJobs = inputs.workloads.includes("background-jobs");
  const arch = ARCH_BY_ID[archId];

  // Hybrid (split) stacks — describe frontend host + backend services separately.
  if (arch?.composition) {
    const front = ARCH_BY_ID[arch.composition.frontend];
    const backendId = arch.composition.backend;
    const frontLabel = FRONTEND_HOST_LABEL[arch.composition.frontend] ?? front.short;
    const rows: StackSummaryRow[] = [{ label: "Frontend hosting", value: frontLabel }];
    rows.push(...backendRows(backendId, wantsRealtime, wantsFiles, wantsAI, wantsJobs));
    return rows;
  }

  return backendRows(archId, wantsRealtime, wantsFiles, wantsAI, wantsJobs);
}

function backendRows(
  archId: ArchId,
  wantsRealtime: boolean,
  wantsFiles: boolean,
  wantsAI: boolean,
  wantsJobs: boolean,
): StackSummaryRow[] {
  const r: StackSummaryRow[] = [];
  const push = (label: string, value: string) => r.push({ label, value });
  switch (archId) {
    case "lovable-cloud":
      push("Hosting & API", "Lovable Cloud Edge Functions");
      push("Database", "Cloud Postgres");
      push("Auth", "Cloud Auth");
      if (wantsFiles) push("Storage", "Cloud Storage");
      if (wantsRealtime) push("Realtime", "Postgres realtime subscriptions");
      if (wantsAI) push("AI", "Lovable AI Gateway");
      break;
    case "lovable-supabase":
      push("Hosting & API", "Supabase Edge Functions");
      push("Database", "Supabase Postgres");
      push("Auth", "Supabase Auth");
      if (wantsFiles) push("Storage", "Supabase Storage");
      if (wantsRealtime) push("Realtime", "Supabase realtime");
      if (wantsAI) push("AI", "OpenAI / Lovable AI");
      break;
    case "lovable-vercel":
      push("Hosting", "Vercel CDN + Edge");
      push("API", "Edge / Serverless Functions");
      push("Database", "Managed Postgres (Neon / RDS)");
      push("Auth", "Auth Provider (Clerk / Auth0)");
      if (wantsFiles) push("Storage", "Object Storage (S3 / R2)");
      if (wantsAI) push("AI", "AI APIs");
      if (wantsJobs) push("Jobs", "Queue (Upstash / Inngest)");
      break;
    case "lovable-netlify":
      push("Hosting", "Netlify CDN");
      push("API", "Netlify Edge / Functions");
      push("Database", "Managed Postgres (Neon / Supabase)");
      push("Auth", "Auth Provider (Clerk / Auth0)");
      if (wantsFiles) push("Storage", "Object Storage (S3 / R2)");
      if (wantsAI) push("AI", "AI APIs");
      if (wantsJobs) push("Jobs", "Queue (Inngest / Upstash)");
      break;
    case "lovable-aws":
      push("Hosting & API", "CloudFront + API Gateway");
      push("Compute", "ECS Fargate / Lambda");
      push("Database", "Amazon RDS Postgres");
      push("Auth", "Amazon Cognito");
      if (wantsFiles) push("Storage", "Amazon S3");
      if (wantsJobs) push("Jobs", "Amazon SQS");
      if (wantsAI) push("AI", "Bedrock / SageMaker");
      break;
    case "lovable-gcp":
      push("Hosting", "Cloud Load Balancing");
      push("Compute", "Cloud Run");
      push("Database", "Cloud SQL / AlloyDB Postgres");
      push("Auth", "Identity Platform");
      if (wantsFiles) push("Storage", "Cloud Storage");
      if (wantsJobs) push("Jobs", "Pub/Sub");
      if (wantsAI) push("AI", "Vertex AI");
      break;
    case "lovable-azure":
      push("Hosting", "Azure Front Door");
      push("Compute", "Container Apps / App Service");
      push("Database", "Azure Database for Postgres");
      push("Auth", "Microsoft Entra ID");
      if (wantsFiles) push("Storage", "Azure Blob Storage");
      if (wantsJobs) push("Jobs", "Azure Service Bus");
      if (wantsAI) push("AI", "Azure OpenAI");
      break;
    case "lovable-heroku":
      push("Hosting", "Heroku Router");
      push("Compute", "Web Dynos");
      push("Database", "Heroku Postgres");
      if (wantsRealtime) push("Cache / Realtime", "Heroku Redis");
      if (wantsFiles) push("Storage", "AWS S3 add-on");
      if (wantsJobs) push("Jobs", "Worker Dynos");
      if (wantsAI) push("AI", "OpenAI / Anthropic");
      break;
    case "lovable-render":
      push("Hosting & API", "Render Web Service");
      push("Database", "Render Postgres");
      if (wantsFiles) push("Storage", "Cloudflare R2 / S3");
      if (wantsJobs) push("Jobs", "Background Workers + Cron");
      if (wantsAI) push("AI", "OpenAI / Anthropic");
      break;
    case "lovable-fly":
      push("Hosting", "Fly Edge Anycast");
      push("Compute", "Fly Machines (containers)");
      push("Database", "Fly Postgres");
      if (wantsFiles) push("Storage", "Tigris / S3");
      if (wantsJobs) push("Jobs", "Background Machines");
      if (wantsAI) push("AI", "Replicate / OpenAI");
      break;
    case "lovable-cloudflare":
      push("Hosting", "Cloudflare Pages CDN");
      push("Compute", "Workers (edge runtime)");
      push("Database", "D1 SQLite / Hyperdrive Postgres");
      if (wantsRealtime) push("Realtime", "Durable Objects");
      if (wantsFiles) push("Storage", "R2 Object Storage");
      if (wantsAI) push("AI", "Workers AI");
      if (wantsJobs) push("Jobs", "Cloudflare Queues");
      break;
  }
  return r;
}

