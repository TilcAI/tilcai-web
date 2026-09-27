// Shape of all visible copy. Both locales must implement every key,
// so a view never mixes languages.

export type Locale = "en" | "es";

export type Stage = "elite" | "meridian" | "vision";

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
  a11y: { skip: string; langSwitch: string; menu: string; copied: string; copy: string; codeTabs: string };
  nav: { problem: string; flow: string; capabilities: string; code: string; roadmap: string; docs: string; home: string };
  stageLabels: Record<Stage, string>;
  hero: {
    status: string;
    title: string;
    lead: string;
    visionNote: string;
    ctaPrimary: string;
    ctaSecondary: string;
    facts: string[];
    logoAlt: string;
  };
  problem: { eyebrow: string; title: string; lead: string; cards: Card[]; question: string };
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
  capabilities: { eyebrow: string; title: string; lead: string; items: Capability[]; disclaimer: string };
  code: {
    eyebrow: string;
    title: string;
    lead: string;
    label: string;
    tabs: { id: string; name: string; caption: string }[];
    bullets: string[];
  };
  compare: { eyebrow: string; title: string; lead: string; colTopic: string; colWallet: string; colTilcai: string; rows: CompareRow[]; footnote: string };
  stack: { eyebrow: string; title: string; lead: string; badges: { name: string; role: string }[]; disclaimer: string };
  roadmap: {
    eyebrow: string;
    title: string;
    lead: string;
    stages: { stage: Stage; when: string; title: string; items: string[]; note?: string }[];
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
