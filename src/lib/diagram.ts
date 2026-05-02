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
    case "lovable-netlify":
      lines.push("  FE --> CDN[Netlify CDN]");
      lines.push("  CDN --> FN[Netlify Edge / Functions]");
      lines.push("  FN --> DB[(Managed Postgres - Neon / Supabase)]");
      lines.push("  FN --> AUTH[Auth Provider - Clerk / Auth0]");
      if (wantsFiles) lines.push("  FN --> S3[Object Storage - S3 / R2]");
      if (wantsAI) lines.push("  FN --> AI[AI APIs]");
      if (wantsJobs) lines.push("  FN --> Q[Queue - Inngest / Upstash]");
      break;
    case "lovable-aws":
      lines.push("  FE --> CF[CloudFront + API Gateway]");
      lines.push("  CF --> SVC[ECS Fargate / Lambda]");
      lines.push("  SVC --> DB[(Amazon RDS Postgres)]");
      lines.push("  SVC --> AUTH[Amazon Cognito]");
      if (wantsFiles) lines.push("  SVC --> S3[Amazon S3]");
      if (wantsJobs) lines.push("  SVC --> Q[Amazon SQS]");
      if (wantsAI) lines.push("  SVC --> GPU[Bedrock / SageMaker]");
      break;
    case "lovable-gcp":
      lines.push("  FE --> LB[Cloud Load Balancing]");
      lines.push("  LB --> SVC[Cloud Run]");
      lines.push("  SVC --> DB[(Cloud SQL / AlloyDB Postgres)]");
      lines.push("  SVC --> AUTH[Identity Platform]");
      if (wantsFiles) lines.push("  SVC --> ST[Cloud Storage]");
      if (wantsJobs) lines.push("  SVC --> Q[Pub/Sub]");
      if (wantsAI) lines.push("  SVC --> AI[Vertex AI]");
      break;
    case "lovable-azure":
      lines.push("  FE --> FD[Azure Front Door]");
      lines.push("  FD --> SVC[Container Apps / App Service]");
      lines.push("  SVC --> DB[(Azure Database for Postgres)]");
      lines.push("  SVC --> AUTH[Microsoft Entra ID]");
      if (wantsFiles) lines.push("  SVC --> ST[Azure Blob Storage]");
      if (wantsJobs) lines.push("  SVC --> Q[Azure Service Bus]");
      if (wantsAI) lines.push("  SVC --> AI[Azure OpenAI]");
      break;
    case "lovable-heroku":
      lines.push("  FE --> RT[Heroku Router]");
      lines.push("  RT --> WEB[Web Dynos]");
      lines.push("  WEB --> DB[(Heroku Postgres)]");
      if (wantsRealtime) lines.push("  WEB --> RD[Heroku Redis]");
      if (wantsFiles) lines.push("  WEB --> S3[AWS S3 add-on]");
      if (wantsJobs) lines.push("  WEB --> WK[Worker Dynos]");
      if (wantsAI) lines.push("  WEB --> AI[OpenAI / Anthropic]");
      break;
    case "lovable-render":
      lines.push("  FE --> WEB[Render Web Service]");
      lines.push("  WEB --> DB[(Render Postgres)]");
      if (wantsFiles) lines.push("  WEB --> S3[Cloudflare R2 / S3]");
      if (wantsJobs) lines.push("  WEB --> WK[Background Workers + Cron]");
      if (wantsAI) lines.push("  WEB --> AI[OpenAI / Anthropic]");
      break;
    case "lovable-fly":
      lines.push("  FE --> EDGE[Fly Edge Anycast]");
      lines.push("  EDGE --> APP[Fly Machines - Containers]");
      lines.push("  APP --> DB[(Fly Postgres)]");
      if (wantsFiles) lines.push("  APP --> S3[Tigris / S3]");
      if (wantsJobs) lines.push("  APP --> WK[Background Machines]");
      if (wantsAI) lines.push("  APP --> AI[Replicate / OpenAI]");
      break;
  }

  return lines.join("\n");
}
