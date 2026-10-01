import type { Decision, ScenarioId, VariantId } from "../demo/scenarios";

// Shape of all visible copy. Both locales must implement every key,
// so a view never mixes languages.

export type Locale = "en" | "es";

export type Stage = "available" | "integration" | "next";
export type IntegrationStatus = "preparation" | "guide" | "pilot" | "enabled";
export type Environment = "simulation" | "testnet" | "production";

export const FAQ_IDS = ["assistant", "wallet", "authority", "business", "today", "simulation", "stellar", "fulfillment"] as const;
export type FaqId = typeof FAQ_IDS[number];

export const ROADMAP_IDS = [
  "rail", "evaluator", "contracts", "site",
  "connector", "commerce", "approval", "reconciliation",
  "smartAccounts", "sharedBudget", "scheduled",
] as const;
export type RoadmapId = typeof ROADMAP_IDS[number];

export interface Card {
  title: string;
  body: string;
}

export interface Capability extends Card {
  stage: Stage;
  note?: string;
}

export interface FlowStep {
  label: string;
  detail: string;
  tone?: "neutral" | "allow" | "deny" | "human" | "rail";
}

/** Copy for the illustrative three-node scene in the hero. */
export interface HeroScene {
  label: string;
  buyer: { role: string; action: string; message: string };
  core: { role: string; detail: string; control: string };
  business: {
    role: string;
    name: string;
    service: string;
    availability: string;
    quote: { label: string; amount: string; note: string };
  };
}

export interface CompareRow {
  topic: string;
  walletOnly: string;
  tilcai: string;
}

export interface DocsSection {
  id: string;
  title: string;
  /** Pre-rendered, trusted HTML authored in this repo (no user input). */
  html: string;
}

export interface Copy {
  locale: Locale;
  htmlLang: string;
  meta: { title: string; description: string; docsTitle: string; docsDescription: string };
  a11y: { skip: string; langSwitch: string; menu: string; copied: string; copy: string; codeTabs: string; mainNav: string; footerNav: string };
  nav: { problem: string; flow: string; demo: string; capabilities: string; agents: string; code: string; roadmap: string; docs: string; home: string };
  stageLabels: Record<Stage, string>;
  integrationLabels: Record<IntegrationStatus, string>;
  environmentLabels: Record<Environment, string>;
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    /** Short stage labels shown under the CTAs. */
    facts: string[];
    visionNote: string;
    scene: HeroScene;
  };
  /** "What TilcAI is": cards are buyer's agent, TilcAI, the business — in that order. */
  problem: { eyebrow: string; title: string; lead: string; cards: Card[]; question: string };
  businesses: {
    eyebrow: string; title: string; lead: string; empty: string;
    actions: { profile: string; scenario: string; inquiry: string; purchase: string; pilot: string };
  };
  agents: {
    eyebrow: string; title: string; lead: string; more: string; fewer: string;
    guide: string; pilot: string; permissionNote: string;
    carousel: { previous: string; next: string; hint: string; label: string };
    surfaceLabels: Record<"terminal" | "editor" | "desktop", string>;
    exploration: string; thirdPartyNote: string;
    panel: {
      title: string; empty: string; close: string; officialDocs: string;
      reference: string; requirements: string; preparation: string; preparationNote: string;
      transport: string; pendingTransport: string; authentication: string; pendingAuthentication: string;
      tools: string; pendingTools: string; approval: string; approvalNote: string;
      disconnect: string; pendingDisconnect: string; steps: string;
      verified: string; configuration: string; copy: string; copied: string; copyError: string;
      explore: string;
    };
  };
  control: { eyebrow: string; title: string; lead: string; panels: Card[]; note: string };
  faq: { eyebrow: string; title: string; items: Record<FaqId, { question: string; answer: string }> };
  flow: {
    eyebrow: string;
    title: string;
    lead: string;
    steps: FlowStep[];
    decisions: FlowStep[];
    after: FlowStep[];
    receiptNote: string;
    visionTitle: string;
    vision: string;
    firstCaseTitle: string;
    firstCase: string;
  };
  demo: {
    eyebrow: string;
    title: string;
    lead: string;
    scenarioPrompt: string;
    variantPrompt: string;
    scenarios: Record<ScenarioId, {
      title: string;
      summary: string;
      request: string;
      service: string;
      timing: string;
      recipient: string;
    }>;
    variants: Record<VariantId, { label: string; detail: string; reason: string }>;
    fields: {
      request: string;
      quote: string;
      service: string;
      quantity: string;
      timing: string;
      recipient: string;
      amount: string;
      limit: string;
      alternativeRecipient: string;
      result: string;
    };
    outcomes: Record<Decision, string>;
    approval: { title: string; body: string; action: string; pending: string; complete: string };
    reset: string;
    continuationNote: string;
  };
  capabilities: { eyebrow: string; title: string; lead: string; items: Capability[]; disclaimer: string };
  code: {
    eyebrow: string;
    title: string;
    lead: string;
    label: string;
    tabs: { id: "intent" | "receipt" | "offer"; name: string; caption: string }[];
    bullets: string[];
    comments: { illustrative: string; verifiedTerms: string; noFunds: string; trustedKey: string };
  };
  compare: { eyebrow: string; title: string; lead: string; colTopic: string; colWallet: string; colTilcai: string; rows: CompareRow[]; footnote: string };
  stack: { eyebrow: string; title: string; lead: string; badges: { name: string; role: string }[]; disclaimer: string; docsLink: string };
  roadmap: {
    eyebrow: string;
    title: string;
    lead: string;
    maintainer: string;
    columns: Record<Stage, { when: string; title: string; note?: string }>;
    items: Record<RoadmapId, { title: string; detail: string }>;
    signatureTitle: string;
    signatureChecks: string[];
    signatureNote: string;
  };
  cta: { title: string; body: string; primary: string; secondary: string };
  footer: { status: string; rights: string };
  notFound: { title: string; body: string; back: string };
  docs: {
    status: string;
    title: string;
    lead: string;
    tocTitle: string;
    backHome: string;
    sections: DocsSection[];
  };
}
