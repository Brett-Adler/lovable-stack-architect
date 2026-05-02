import type { ArchId } from "@/data/architectures";
import type { Inputs } from "@/lib/scoring";

export function buildMermaid(archId: ArchId, inputs: Inputs): string {
  const wantsRealtime = inputs.workloads.includes("realtime");
  const wantsFiles = inputs.workloads.includes("files");
  const wantsAI = inputs.workloads.includes("ai") || inputs.workloads.includes("heavy-compute");
  const wantsJobs = inputs.workloads.includes("background-jobs");

  const lines: string[] = ["graph TD", "  U[Users] --> FE[Lovable Frontend - React + Vite]"];

  switch (archId) {
    case "lovable-cloud":
      lines.push("  FE --> API[Lovable Cloud Edge Functions]");
      lines.push("  FE --> AUTH[Cloud Auth]");
      lines.push("  API --> DB[(Cloud Postgres)]");
      if (wantsFiles) lines.push("  API --> ST[Cloud Storage]");
      if (wantsRealtime) lines.push("  FE -.realtime.-> DB");
      if (wantsAI) lines.push("  API --> AI[Lovable AI Gateway]");
      break;
    case "lovable-supabase":
      lines.push("  FE --> SAPI[Supabase Edge Functions]");
      lines.push("  FE --> SAUTH[Supabase Auth]");
      lines.push("  SAPI --> SDB[(Supabase Postgres)]");
      if (wantsFiles) lines.push("  SAPI --> SST[Supabase Storage]");
      if (wantsRealtime) lines.push("  FE -.realtime.-> SDB");
      if (wantsAI) lines.push("  SAPI --> AI[OpenAI / Lovable AI]");
      break;
    case "lovable-vercel":
      lines.push("  FE --> CDN[Vercel / Netlify CDN]");
      lines.push("  CDN --> FN[Edge / Serverless Functions]");
      lines.push("  FN --> DB[(Managed Postgres - Neon / RDS)]");
      lines.push("  FN --> AUTH[Auth Provider - Clerk / Auth0]");
      if (wantsFiles) lines.push("  FN --> S3[Object Storage - S3 / R2]");
      if (wantsAI) lines.push("  FN --> AI[AI APIs]");
      if (wantsJobs) lines.push("  FN --> Q[Queue - Upstash / Inngest]");
      break;
    case "lovable-hyperscaler":
      lines.push("  FE --> LB[Load Balancer / API Gateway]");
      lines.push("  LB --> SVC[Containers - ECS / Cloud Run / App Service]");
      lines.push("  SVC --> DB[(Managed Postgres - RDS / Cloud SQL)]");
      lines.push("  SVC --> AUTH[Cognito / Identity Platform / Entra ID]");
      if (wantsFiles) lines.push("  SVC --> S3[S3 / GCS / Blob Storage]");
      if (wantsJobs) lines.push("  SVC --> Q[SQS / Pub-Sub / Service Bus]");
      if (wantsAI) lines.push("  SVC --> GPU[GPU workers / Bedrock / Vertex AI]");
      break;
  }

  return lines.join("\n");
}
