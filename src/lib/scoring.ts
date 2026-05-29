import {
  ARCHITECTURES,
  ARCH_BY_ID,
  CRITERIA,
  RUBRIC,
  type ArchId,
  type Architecture,
  type Criterion,
  type CriterionId,
} from "@/data/architectures";

export type Stage = "prototype" | "mvp" | "growth" | "scale";
export type BudgetBand = "low" | "medium" | "high";
export type LockInTolerance = "low" | "medium" | "high";
export type TeamSkill = "frontend" | "backend" | "devops" | "data" | "none";
export type Compliance = "none" | "gdpr" | "hipaa" | "soc2" | "residency";
export type Workload =
  | "crud"
  | "realtime"
  | "files"
  | "ai"
  | "background-jobs"
  | "heavy-compute";

export interface Inputs {
  stage: Stage[];
  mau: number; // monthly active users (log slider)
  team: TeamSkill[];
  budget: BudgetBand[];
  compliance: Compliance[];
  workloads: Workload[];
  lockInTolerance: LockInTolerance[];
  ttmPriority: number; // 1-5, how important is time-to-market
}

export const DEFAULT_INPUTS: Inputs = {
  stage: ["mvp"],
  mau: 1000,
  team: ["frontend"],
  budget: ["low"],
  compliance: ["none"],
  workloads: ["crud"],
  lockInTolerance: ["medium"],
  ttmPriority: 5,
};

// Derive criterion weights (0–3) from inputs.
//
// Methodology note: every criterion starts at a baseline weight of 1.0 so no
// single criterion is structurally favored. Inputs then nudge weights up or
// down. This avoids the bias that a high constant DX-with-Lovable baseline
// (the tool is built by a Lovable fan) would otherwise introduce.
export function deriveWeights(inputs: Inputs): Record<CriterionId, number> {
  const w: Record<CriterionId, number> = {
    "time-to-launch": 1,
    "dx-with-lovable": 1,
    "cost-small": 1,
    "cost-large": 1,
    "scaling-ceiling": 1,
    "realtime": 0.5,
    "storage": 0.5,
    "ai-compute": 0.5,
    "compliance": 0.5,
    "lock-in": 1,
    "ops-burden": 1,
    "migration": 0.5,
  };

  // Time to market
  w["time-to-launch"] += inputs.ttmPriority * 0.3;

  // Stage shifts what matters
  if (inputs.stage === "prototype" || inputs.stage === "mvp") {
    w["time-to-launch"] += 0.8;
    w["cost-small"] += 0.8;
    w["ops-burden"] += 0.5;
  } else {
    w["scaling-ceiling"] += 1;
    w["cost-large"] += 1;
    w["compliance"] += 0.5;
  }

  // Scale
  if (inputs.mau >= 100_000) {
    w["scaling-ceiling"] += 1.5;
    w["cost-large"] += 1.2;
  }
  if (inputs.mau < 5_000) {
    w["cost-small"] += 1;
  }

  // Team skills
  if (inputs.team.includes("none") || inputs.team.length === 0) {
    w["ops-burden"] += 1.2;
    w["dx-with-lovable"] += 0.5;
  }
  if (!inputs.team.includes("devops")) {
    w["ops-burden"] += 0.6;
  }
  if (inputs.team.includes("backend") || inputs.team.includes("devops")) {
    w["scaling-ceiling"] += 0.3;
  }

  // Budget
  if (inputs.budget === "low") {
    w["cost-small"] += 0.8;
    w["cost-large"] += 0.4;
  } else if (inputs.budget === "high") {
    w["cost-small"] -= 0.2;
  }

  // Compliance
  const hasReg = inputs.compliance.some((c) => c !== "none");
  if (hasReg) w["compliance"] += 1.5;
  if (inputs.compliance.includes("hipaa") || inputs.compliance.includes("residency")) {
    w["compliance"] += 0.8;
  }

  // Workloads
  if (inputs.workloads.includes("realtime")) w["realtime"] += 1.5;
  if (inputs.workloads.includes("files")) w["storage"] += 1.2;
  if (inputs.workloads.includes("ai") || inputs.workloads.includes("heavy-compute")) {
    w["ai-compute"] += 1.5;
  }
  if (inputs.workloads.includes("background-jobs")) w["ai-compute"] += 0.5;

  // Lock-in tolerance
  if (inputs.lockInTolerance === "low") {
    w["lock-in"] += 1.5;
    w["migration"] += 1;
  } else if (inputs.lockInTolerance === "high") {
    w["lock-in"] -= 0.3;
  }

  // Clamp to >= 0
  for (const k of Object.keys(w) as CriterionId[]) {
    if (w[k] < 0) w[k] = 0;
  }
  return w;
}

export interface RankedResult {
  arch: Architecture;
  score: number; // 0–100 normalized
  rationale: string[];
  /** Top weighted contributions to this architecture's score (criterion × weight × rubric). */
  topContributors: { criterion: Criterion; contribution: number; rubricScore: number }[];
}

export interface RankOutput {
  results: RankedResult[];
  /** Architectures excluded because of a hard compliance requirement (HIPAA / SOC 2 / residency). */
  excluded: { arch: Architecture; reason: string }[];
}

/** Compliance levels that act as hard filters — anything scoring < 4 on `compliance` is removed. */
const STRICT_COMPLIANCE: Compliance[] = ["hipaa", "soc2", "residency"];

export function rank(inputs: Inputs): RankedResult[] {
  return rankFull(inputs).results;
}

export function rankFull(inputs: Inputs): RankOutput {
  const weights = deriveWeights(inputs);
  const totalWeight = (Object.values(weights) as number[]).reduce((a, b) => a + b, 0) || 1;
  const strict = inputs.compliance.filter((c) => STRICT_COMPLIANCE.includes(c));
  const strictLabel = strict
    .map((c) => (c === "hipaa" ? "HIPAA" : c === "soc2" ? "SOC 2" : "data residency"))
    .join(" / ");

  const excluded: { arch: Architecture; reason: string }[] = [];

  const scored = ARCHITECTURES.flatMap((arch) => {
    if (strict.length && RUBRIC[arch.id]["compliance"] < 4) {
      excluded.push({
        arch,
        reason: `Insufficient ${strictLabel} coverage for a hard requirement.`,
      });
      return [];
    }
    let weighted = 0;
    const contributions: { criterion: Criterion; contribution: number; rubricScore: number }[] = [];
    for (const c of CRITERIA) {
      const contribution = weights[c.id] * RUBRIC[arch.id][c.id];
      weighted += contribution;
      contributions.push({ criterion: c, contribution, rubricScore: RUBRIC[arch.id][c.id] });
    }
    const score = (weighted / (totalWeight * 5)) * 100;
    const topContributors = contributions
      .filter((c) => c.contribution > 0)
      .sort((a, b) => b.contribution - a.contribution)
      .slice(0, 3);
    return [{ arch, score, rationale: buildRationale(arch.id, inputs), topContributors }];
  });

  return { results: scored.sort((a, b) => b.score - a.score), excluded };
}

/**
 * Given the top pick and runner-up, return a one-line tradeoff string:
 * what criterion the runner-up wins on vs what the top pick wins on.
 * Returns null if no meaningful tradeoff exists (e.g. top dominates).
 */
export function tradeoffVs(
  top: RankedResult,
  runnerUp: RankedResult,
  inputs: Inputs,
): { topWins: Criterion; runnerWins: Criterion } | null {
  const weights = deriveWeights(inputs);
  let bestRunnerGain: { criterion: Criterion; gain: number } | null = null;
  let bestTopGain: { criterion: Criterion; gain: number } | null = null;

  for (const c of CRITERIA) {
    const w = weights[c.id];
    if (w <= 0) continue;
    const delta = (RUBRIC[runnerUp.arch.id][c.id] - RUBRIC[top.arch.id][c.id]) * w;
    if (delta > (bestRunnerGain?.gain ?? 0)) {
      bestRunnerGain = { criterion: c, gain: delta };
    }
    if (-delta > (bestTopGain?.gain ?? 0)) {
      bestTopGain = { criterion: c, gain: -delta };
    }
  }

  if (!bestRunnerGain || !bestTopGain) return null;
  return { topWins: bestTopGain.criterion, runnerWins: bestRunnerGain.criterion };
}

function buildRationale(id: ArchId, inputs: Inputs): string[] {
  const arch = ARCH_BY_ID[id];
  const rs: string[] = [];
  const earlyStage = inputs.stage === "prototype" || inputs.stage === "mvp";
  const noOps = inputs.team.includes("none") || !inputs.team.includes("devops");
  const strictCompliance =
    inputs.compliance.includes("hipaa") ||
    inputs.compliance.includes("soc2") ||
    inputs.compliance.includes("residency");
  const heavyAI =
    inputs.workloads.includes("heavy-compute") || inputs.workloads.includes("ai");

  if (id === "lovable-cloud") {
    if (earlyStage) rs.push("Fastest path to a live MVP — zero infra setup.");
    if (inputs.budget === "low") rs.push("Stays in the free or near-free band early on.");
    if (noOps) rs.push("No DevOps required; Lovable manages the backend.");
    if (heavyAI && !inputs.workloads.includes("heavy-compute"))
      rs.push("AI Gateway gives managed access to Gemini/Claude/GPT — no API keys to rotate.");
    if (inputs.compliance.includes("hipaa"))
      rs.push("HIPAA workloads need an external Supabase or hyperscaler tier for BAA today.");
    if (inputs.compliance.includes("residency"))
      rs.push("Region pinning isn't exposed on Cloud — use external Supabase for that.");
    if (inputs.mau >= 200_000)
      rs.push("At very high scale, consider detaching to your own Supabase project for tuning.");
  }
  if (id === "lovable-supabase") {
    rs.push("Same Postgres + auth + storage as Cloud, but on a project you own.");
    if (inputs.compliance.length && !inputs.compliance.includes("none"))
      rs.push("Pick the region, BAA, and add-ons you need for compliance.");
    if (inputs.workloads.includes("realtime"))
      rs.push("Best-in-class realtime (Postgres changes, presence, broadcast).");
    if (inputs.lockInTolerance === "low")
      rs.push("Easier to leave: it's standard Postgres you can dump and migrate.");
  }
  if (id === "lovable-vercel") {
    rs.push("Global edge functions and a polished deploy pipeline.");
    rs.push("Not a Lovable integration — requires GitHub export + your own DB choice.");
    if (heavyAI) rs.push("Edge runtimes help with low-latency AI proxies.");
  }
  if (id === "lovable-netlify") {
    rs.push("Strong fit for marketing + app combos with edge functions.");
    rs.push("Not a Lovable integration — requires GitHub export + your own DB choice.");
    if (inputs.workloads.includes("background-jobs"))
      rs.push("Background jobs need an external service (e.g. Inngest).");
  }
  if (id === "lovable-aws") {
    if (strictCompliance) rs.push("Broadest compliance coverage and BAA options.");
    if (heavyAI) rs.push("Bedrock, SageMaker, and GPU instances cover most AI needs.");
    if (earlyStage) rs.push("Overkill for an early MVP — slowest to first deploy.");
    if (noOps) rs.push("Needs experienced backend/DevOps to operate well.");
    rs.push("Not a Lovable integration — you own the deploy and ops story.");
  }
  if (id === "lovable-gcp") {
    if (heavyAI) rs.push("Vertex AI and Gemini models are first-class on GCP.");
    if (inputs.workloads.includes("background-jobs"))
      rs.push("Cloud Run + Pub/Sub make event-driven workloads simple.");
    if (earlyStage) rs.push("Heavier setup than managed-backend options.");
    if (noOps) rs.push("Requires DevOps to wire IAM, networking, and CI/CD.");
    rs.push("Not a Lovable integration — requires GitHub export.");
  }
  if (id === "lovable-azure") {
    if (inputs.compliance.includes("soc2") || inputs.compliance.includes("residency"))
      rs.push("Strong fit for enterprises on Microsoft 365 / Entra ID.");
    if (heavyAI) rs.push("Azure OpenAI gives enterprise SLAs on GPT models.");
    if (earlyStage) rs.push("Overkill for an early MVP.");
    if (noOps) rs.push("Steepest learning curve outside the Microsoft ecosystem.");
    rs.push("Not a Lovable integration — requires GitHub export.");
  }
  if (id === "lovable-heroku") {
    rs.push("Push-to-deploy simplicity with managed Postgres add-ons.");
    rs.push("Not a Lovable integration — requires GitHub export.");
    if (inputs.mau >= 100_000) rs.push("Watch the dyno bill at scale — cheaper alternatives exist.");
    if (noOps) rs.push("Friendly for teams without dedicated DevOps.");
  }
  if (id === "lovable-render") {
    rs.push("Modern Heroku-style PaaS with friendlier pricing.");
    rs.push("Not a Lovable integration — requires GitHub export.");
    if (inputs.workloads.includes("background-jobs"))
      rs.push("First-class workers and cron jobs out of the box.");
    if (noOps) rs.push("Low ops burden — close to PaaS-grade simplicity.");
  }
  if (id === "lovable-fly") {
    rs.push("Run containers near your users for low latency.");
    rs.push("Not a Lovable integration — requires GitHub export.");
    if (inputs.workloads.includes("realtime")) rs.push("Anycast edge helps realtime workloads.");
    if (strictCompliance) rs.push("Smaller compliance catalog than the hyperscalers.");
  }

  if (rs.length === 0) {
    rs.push(
      "No specific reason to prefer or avoid this option for your inputs — it scored on baseline criteria only.",
    );
    rs.push(arch.tagline);
  }
  return rs;
}

export function costForStage(arch: Architecture, stage: Stage): string {
  return arch.costBands[stage];
}

export function stageFromMau(mau: number): Stage {
  if (mau < 200) return "prototype";
  if (mau < 10_000) return "mvp";
  if (mau < 100_000) return "growth";
  return "scale";
}
