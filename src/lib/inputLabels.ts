import type {
  Stage,
  BudgetBand,
  LockInTolerance,
  TeamSkill,
  Compliance,
  Workload,
} from "@/lib/scoring";

export const STAGE_LABEL: Record<Stage, string> = {
  prototype: "Prototype",
  mvp: "MVP",
  growth: "Growth",
  scale: "Scale",
};

export const TEAM_LABEL: Record<TeamSkill, string> = {
  frontend: "Frontend",
  backend: "Backend",
  devops: "DevOps",
  data: "Data",
  none: "Non-technical",
};

export const COMPLIANCE_LABEL: Record<Compliance, string> = {
  none: "None",
  gdpr: "GDPR",
  hipaa: "HIPAA",
  soc2: "SOC 2",
  residency: "Data residency",
};

export const WORKLOAD_LABEL: Record<Workload, string> = {
  crud: "CRUD app",
  realtime: "Realtime",
  files: "Files / media",
  ai: "AI inference",
  "background-jobs": "Background jobs",
  "heavy-compute": "Heavy compute / GPU",
};

export const BUDGET_LABEL: Record<BudgetBand, string> = {
  low: "Low — under ~$50/mo",
  medium: "Medium — $50–500/mo",
  high: "High — $500+/mo",
};

export const LOCKIN_LABEL: Record<LockInTolerance, string> = {
  low: "Low — must be portable",
  medium: "Medium",
  high: "High — fine to commit",
};

// Short glossary descriptions used by the PDF report's input appendix.
export const COMPLIANCE_DESCRIPTION: Record<Compliance, string> = {
  none: "No regulated data — no specific certification required.",
  gdpr: "EU data protection: lawful basis, DSAR support, EU data handling.",
  hipaa: "US healthcare (PHI). Requires a signed BAA with the provider.",
  soc2: "Operational security audit common in B2B SaaS procurement.",
  residency: "Data must stay in a specific region (EU, US, etc.).",
};

export const WORKLOAD_DESCRIPTION: Record<Workload, string> = {
  crud: "Forms, lists, dashboards — standard read/write over a database.",
  realtime: "Websockets, presence, live queries (chat, collab, live feeds).",
  files: "Image, video, or document uploads with signed URLs.",
  ai: "LLM / model inference, usually via a managed gateway.",
  "background-jobs": "Async queues, cron jobs, webhooks, scheduled tasks.",
  "heavy-compute": "GPU jobs, long-running batch, or custom containers.",
};

export const TEAM_DESCRIPTION: Record<TeamSkill, string> = {
  frontend: "Comfortable with React/TypeScript and UI work.",
  backend: "Can write server code, design APIs and database schemas.",
  devops: "Owns CI/CD, infra-as-code, monitoring, and on-call.",
  data: "SQL, analytics, ETL, or ML pipelines.",
  none: "Non-technical builder — wants managed everything.",
};

export const STAGE_DESCRIPTION: Record<Stage, string> = {
  prototype: "Throwaway demo or internal validation.",
  mvp: "First public release — small audience, fast iteration.",
  growth: "Real traction, performance & cost start to matter.",
  scale: "Hundreds of thousands of users, SLAs, multi-region.",
};

export const LOCKIN_DESCRIPTION: Record<LockInTolerance, string> = {
  low: "Must be able to leave the vendor with a weekend of work.",
  medium: "Some lock-in is fine if it saves time.",
  high: "Happy to commit deeply to one vendor for velocity.",
};
