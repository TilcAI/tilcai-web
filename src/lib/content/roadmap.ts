import type { RoadmapId, Stage } from "../i18n/types";

export type Maintainer = "Saul" | "Omar" | "Jhamil" | "Jose";

export interface RoadmapEntry {
  id: RoadmapId;
  stage: Stage;
  /** Person who keeps the item's status accurate. Never a date or a commitment. */
  maintainer: Maintainer;
}

/**
 * Build status by capability. Moving an item between stages requires evidence
 * in its own environment; there are no public dates on purpose.
 * Order within a stage is the display order.
 */
export const roadmapEntries: readonly RoadmapEntry[] = [
  { id: "rail", stage: "available", maintainer: "Saul" },
  { id: "evaluator", stage: "available", maintainer: "Omar" },
  { id: "contracts", stage: "available", maintainer: "Omar" },
  { id: "site", stage: "available", maintainer: "Jhamil" },
  { id: "connector", stage: "integration", maintainer: "Omar" },
  { id: "commerce", stage: "integration", maintainer: "Jhamil" },
  { id: "approval", stage: "integration", maintainer: "Jose" },
  { id: "reconciliation", stage: "integration", maintainer: "Saul" },
  { id: "smartAccounts", stage: "next", maintainer: "Jose" },
  { id: "sharedBudget", stage: "next", maintainer: "Jhamil" },
  { id: "scheduled", stage: "next", maintainer: "Omar" },
];

export const roadmapStages: readonly Stage[] = ["available", "integration", "next"];
