// One-click example scenarios for the landing page. Each preset is a fully
// formed Inputs object; clicking a preset link loads /app with the scenario
// preloaded via the same compressed share-URL format the Share button produces.

import LZString from "lz-string";
import type { Inputs } from "@/lib/scoring";
import type { ArchId } from "@/data/architectures";

interface Preset {
  id: string;
  label: string;
  description: string;
  inputs: Inputs;
  enabled: ArchId[];
}

const DEFAULT_ENABLED: ArchId[] = [
  "lovable-cloud",
  "lovable-supabase",
  "lovable-vercel",
  "lovable-aws",
];

export const PRESETS: Preset[] = [
  {
    id: "solo-mvp",
    label: "Solo founder · MVP",
    description: "Shipping this week. Low budget. No DevOps. Wants AI in the product.",
    inputs: {
      stage: "mvp",
      mau: 1_000,
      team: ["frontend"],
      budget: "low",
      compliance: ["none"],
      workloads: ["crud", "ai"],
      lockInTolerance: "medium",
      ttmPriority: 5,
    },
    enabled: DEFAULT_ENABLED,
  },
  {
    id: "hipaa-telehealth",
    label: "HIPAA telehealth pilot",
    description: "Regulated workload, small team, needs BAA and region pinning.",
    inputs: {
      stage: "mvp",
      mau: 2_000,
      team: ["frontend", "backend"],
      budget: "medium",
      compliance: ["hipaa", "soc2"],
      workloads: ["crud", "files", "realtime"],
      lockInTolerance: "low",
      ttmPriority: 4,
    },
    enabled: ["lovable-supabase", "lovable-aws", "lovable-azure", "lovable-gcp"],
  },
  {
    id: "scale-past-100k",
    label: "Scaling past 100k MAU",
    description: "Growth-stage SaaS, backend team in place, cost matters.",
    inputs: {
      stage: "scale",
      mau: 500_000,
      team: ["frontend", "backend", "devops"],
      budget: "medium",
      compliance: ["soc2", "gdpr"],
      workloads: ["crud", "realtime", "files", "background-jobs"],
      lockInTolerance: "low",
      ttmPriority: 3,
    },
    enabled: ["lovable-supabase", "lovable-aws", "lovable-gcp", "lovable-render"],
  },
];

export function presetShareUrl(p: Preset): string {
  const compressed = LZString.compressToEncodedURIComponent(
    JSON.stringify({ inputs: p.inputs, enabled: p.enabled }),
  );
  return `/app?s=${compressed}`;
}
