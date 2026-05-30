import type { ArchId } from "@/data/architectures";
import type { Inputs } from "@/lib/scoring";

// Mermaid v11 is strict about special chars (parentheses, slashes, plus signs,
// brackets) inside node labels. Wrap every label in double quotes to make it
// always-safe regardless of content.
const N = (id: string, label: string) => `${id}["${label}"]`;
const DB = (id: string, label: string) => `${id}[("${label}")]`;

export function buildMermaid(archId: ArchId, inputs: Inputs): string {
  const wantsRealtime = inputs.workloads.includes("realtime");
  const wantsFiles = inputs.workloads.includes("files");
  const wantsAI = inputs.workloads.includes("ai") || inputs.workloads.includes("heavy-compute");
  const wantsJobs = inputs.workloads.includes("background-jobs");

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
  }

  return lines.join("\n");
}
