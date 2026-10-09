import type { Environment, RoadmapId, Stage } from "../i18n/types";

export type Maintainer = "Saul" | "Omar" | "Jhamil" | "Jose";

export interface RoadmapEntry {
  id: RoadmapId;
  stage: Stage;
  /**
   * Person who keeps the item's status accurate, as assigned in the team backlog. Never a date or a commitment.
   * Left out when nobody has been assigned yet: the page does not invent an owner.
   */
  maintainer?: Maintainer;
  /**
   * Where there is evidence today: a simulation or a real test network. Left out when there is none
   * (code or design only). `production` is never used: nothing runs there.
   */
  environment?: Exclude<Environment, "production">;
}

/**
 * Build status by capability, as of the official context of 2026-10-08/09 (documentation/0-OFICIAL).
 * Moving an item between stages requires evidence in its own environment; there are no public dates on purpose.
 * Order within a stage is the display order.
 */
export const roadmapEntries: readonly RoadmapEntry[] = [
  { id: "cctp", stage: "available", maintainer: "Saul", environment: "testnet" },
  { id: "evaluator", stage: "available", maintainer: "Omar", environment: "simulation" },
  { id: "contracts", stage: "available", maintainer: "Omar" },
  { id: "site", stage: "available", maintainer: "Jhamil", environment: "simulation" },
  { id: "rail", stage: "integration", maintainer: "Saul", environment: "testnet" },
  { id: "commerce", stage: "integration", maintainer: "Jhamil" },
  { id: "approval", stage: "integration", maintainer: "Jose" },
  { id: "reconciliation", stage: "integration", maintainer: "Saul" },
  { id: "connector", stage: "integration", maintainer: "Omar" },
  { id: "whatsapp", stage: "integration", maintainer: "Saul" },
  { id: "tenants", stage: "integration", maintainer: "Jhamil" },
  { id: "smartAccounts", stage: "next", maintainer: "Jose" },
  { id: "sharedBudget", stage: "next", maintainer: "Jhamil" },
  { id: "scheduled", stage: "next", maintainer: "Omar" },
  { id: "networks", stage: "next", maintainer: "Saul" },
  { id: "fiat", stage: "next" },
];

export const roadmapStages: readonly Stage[] = ["available", "integration", "next"];
