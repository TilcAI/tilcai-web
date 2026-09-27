import type { Copy } from "./types";
import { docsEn } from "./docs.en";

export const en: Copy = {
  locale: "en",
  htmlLang: "en",
  meta: {
    title: "TilcAI — Spending policies and trust signals for agent payments (in development)",
    description:
      "TilcAI is an early-stage SDK and gateway, in development, that puts human-defined spending policies and verifiable receipts between an AI agent's intent and the money. Starting on Stellar testnet with USDC and x402.",
    docsTitle: "Proposed architecture — TilcAI (in development)",
    docsDescription:
      "The proposed architecture of TilcAI: shared budget tree on Soroban, policy gateway for x402 payments, decision receipts and narrow trust signals. Design document, not a public API.",
  },
  a11y: {
    skip: "Skip to content",
    langSwitch: "Language",
    menu: "Menu",
    copied: "Copied",
    copy: "Copy",
    codeTabs: "Proposed data structures",
  },
  nav: {
    problem: "Problem",
    flow: "Flow",
    capabilities: "Capabilities",
    code: "Interface",
    roadmap: "Roadmap",
    docs: "Architecture",
    home: "Home",
  },
  stageLabels: {
    elite: "Stellar Elite · in development",
    meridian: "HackMeridian · planned",
    vision: "Vision · not scheduled",
  },
  hero: {
    status: "Early-stage · In development",
    title: "Give agents purchasing power. Keep humans in control.",
    lead:
      "TilcAI is an SDK and gateway in development for spending policies and trust signals in payments between agents. Before an agent pays, TilcAI checks who gets paid, for what and within which budget — then allows, blocks or escalates, and keeps a receipt. Starting on Stellar.",
    visionNote:
      "The vision: agents acting for people and small businesses that discover, book and pay for services. The first use case is much narrower — an agent buying a test digital service on Stellar testnet.",
    ctaPrimary: "Explore the architecture",
    ctaSecondary: "See the payment flow",
    facts: ["Stellar-first", "Testnet only", "No production funds", "Nothing is live yet"],
    logoAlt: "TilcAI logo: an Andean tilcayo (wildcat) head with the TilcAI wordmark",
  },
  problem: {
    eyebrow: "The problem",
    title: "A wallet is not a mandate.",
    lead:
      "Agents can already discover and pay for APIs and tools. But an agent holding a funded wallet does not, on its own, know its budget, who it should pay or under which terms.",
    cards: [
      {
        title: "Budgets multiply",
        body:
          "An orchestrator starts sub-agents. Three agents with a 1 USDC limit each can spend 3 USDC, not 1. Nothing ties them to a single budget.",
      },
      {
        title: "Limits ignore the purchase",
        body:
          "A per-payment cap does not stop a small payment to a cloned endpoint, a swapped recipient or a service nobody approved.",
      },
      {
        title: "Instructions can be hijacked",
        body:
          "Prompt injection or a retry loop can change the amount, the recipient or repeat a purchase that already happened.",
      },
      {
        title: "No one can explain the payment",
        body:
          "A transaction hash proves a transfer. It does not prove who authorised it, under which rule — or why another payment was refused.",
      },
    ],
    question:
      "Can this agent, with this principal's funds, pay this amount to this provider for this resource — right now? And where is the proof?",
  },
  flow: {
    eyebrow: "Proposed flow",
    title: "The model proposes. Deterministic rules decide.",
    lead:
      "Price and recipient come from the service's 402 payment challenge, never from free text written by the model. Anything that cannot be verified is denied.",
    steps: [
      { label: "Agent", detail: "Requests a paid resource through the SDK or an MCP tool — never a generic “transfer” tool." },
      { label: "Payment intent", detail: "The 402 challenge is normalised: resource, provider, network, asset, amount, recipient, expiry." },
      { label: "Identity + policy", detail: "Provider profile, allowed services, per-payment cap, shared budget, duplicates, pause." },
    ],
    decisions: [
      { label: "ALLOW", detail: "All rules pass.", tone: "allow" },
      { label: "DENY", detail: "Any rule fails or is unverifiable.", tone: "deny" },
      { label: "REQUIRE_HUMAN", detail: "Above a threshold: stop and ask.", tone: "human" },
    ],
    after: [
      { label: "x402 + USDC on Stellar", detail: "Only on ALLOW: the payment is signed and settled on testnet through an x402 facilitator.", tone: "rail" },
      { label: "Decision receipt", detail: "Signed record with reason codes, policy hash and transaction — for every yes and every no.", tone: "neutral" },
    ],
    receiptNote: "A denied payment moves no funds, but still produces a receipt that explains why.",
    visionTitle: "Vision",
    vision:
      "A person asks their agent to book an appointment or a ticket. A business's agent publishes availability, price and conditions. The buying agent confirms under the limited authority of its owner. This is where TilcAI is heading — it is not built, and it is not promised for a hackathon.",
    firstCaseTitle: "First use case",
    firstCase:
      "An agent buys a test digital service — a small report priced at a few cents of testnet USDC — from a reference seller we run ourselves. One purchase is allowed; altered, repeated or over-budget purchases are blocked.",
  },
  capabilities: {
    eyebrow: "Planned capabilities",
    title: "What we are building, and when.",
    lead:
      "Each capability is labelled with the stage where it is planned. None of them is released. Scope is deliberately narrow so that every claim can be demonstrated.",
    items: [
      {
        stage: "elite",
        title: "Shared budget tree on Soroban",
        body:
          "A principal funds a root budget in a Soroban contract and splits it into sub-mandates. A child can never exceed its parent, every spend is debited up the tree, and a guardian can pause or revoke a branch.",
        note: "Contract not yet deployed.",
      },
      {
        stage: "elite",
        title: "Deterministic payment policies",
        body:
          "Allowed network, asset and scheme; allowed providers and resources; per-payment cap; remaining budget; duplicate intents; expiry and pause. Fail-closed by default.",
      },
      {
        stage: "elite",
        title: "Trust signals v0 — narrow by design",
        body:
          "Identity: a signed provider profile checked before paying. Reputation: buyer feedback tied to a paid, delivered receipt. Validation: a signed check of response format and freshness by a separate key.",
        note: "Inspired by the concepts of ERC-8004 — not an implementation of it.",
      },
      {
        stage: "elite",
        title: "Decision receipts",
        body:
          "Every decision, including refusals, produces a signed receipt with reason codes, intent and policy hashes, and the transaction when there is one.",
      },
      {
        stage: "meridian",
        title: "Signed seller offers",
        body:
          "A business publishes an offer — service, price, asset, network, recipient and expiry — signed with its key. The buying agent checks it against a key its owner already trusts and against the 402 challenge.",
      },
      {
        stage: "vision",
        title: "Agent-to-business commerce",
        body:
          "Bookings, inventory, cancellations and refunds between agents of people and small businesses. Requires validation with real businesses first.",
      },
    ],
    disclaimer: "Planned, not shipped. Where something is not finished by a milestone, we will say so instead of presenting it as done.",
  },
  code: {
    eyebrow: "Proposed interface",
    title: "Readable data, not magic.",
    lead:
      "These conceptual structures show what the gateway reasons about. They are not a published package or a public API.",
    label: "Proposed interface — subject to change",
    tabs: [
      { id: "intent", name: "PaymentIntent", caption: "Normalised from a 402 challenge before any signature." },
      { id: "receipt", name: "DecisionReceipt", caption: "A refusal still produces a signed receipt. No funds moved." },
      { id: "offer", name: "SignedOffer", caption: "Planned for HackMeridian: terms published and signed by the seller." },
    ],
    bullets: [
      "Price and recipient are read from the service's challenge, never from model output.",
      "Reason codes are machine-readable, so an agent can understand a refusal.",
      "Field names are illustrative and will change while the MVP is built.",
    ],
  },
  compare: {
    eyebrow: "Comparison",
    title: "A funded wallet vs. the proposed flow.",
    lead: "The same agent, the same payment request — with and without a policy layer in between.",
    colTopic: "Question",
    colWallet: "Agent with a funded wallet only",
    colTilcai: "Proposed TilcAI flow",
    rows: [
      { topic: "Budget across sub-agents", walletOnly: "Each key spends its own balance; totals add up.", tilcai: "One root budget; children can never exceed their parent." },
      { topic: "Where price and recipient come from", walletOnly: "Whatever the agent decides to send.", tilcai: "From the 402 challenge, checked against policy (and, later, a signed offer)." },
      { topic: "Which providers and services", walletOnly: "Any address the agent is given.", tilcai: "Only providers and resources allowed for that agent." },
      { topic: "Repeated purchase", walletOnly: "Pays again.", tilcai: "Same intent hash is refused." },
      { topic: "Large or unusual payment", walletOnly: "Signed like any other.", tilcai: "Stops and requires a human above a threshold." },
      { topic: "Refused payment", walletOnly: "No trace, no explanation.", tilcai: "Signed receipt with reason codes." },
      { topic: "If the agent is compromised", walletOnly: "The whole wallet balance is at risk.", tilcai: "Designed to cap loss at a small operating balance plus its remaining sub-mandate." },
    ],
    footnote: "This compares a design with a generic setup. It is not a comparison with any specific product.",
  },
  stack: {
    eyebrow: "Planned stack",
    title: "Stellar-first, on purpose.",
    lead:
      "The MVP targets a single network, asset and scheme so that every step can be verified. Interfaces are chain-neutral, but only Stellar is being built.",
    badges: [
      { name: "Stellar Testnet", role: "Network for the MVP" },
      { name: "Soroban", role: "Budget tree contract" },
      { name: "USDC (SEP-41)", role: "Payment asset" },
      { name: "x402 · exact", role: "HTTP payment challenge" },
      { name: "TypeScript", role: "Gateway and SDK" },
      { name: "MCP", role: "Agent-facing tools" },
    ],
    disclaimer:
      "Technologies we plan to use. Listing them does not imply partnership, sponsorship or a finished integration. No support for other networks is claimed.",
  },
  roadmap: {
    eyebrow: "Roadmap",
    title: "One project, two build stages.",
    lead: "Buyer and seller are two roles in the same transaction, not two products.",
    stages: [
      {
        stage: "elite",
        when: "Mid-October 2026",
        title: "Buyer base — Stellar Elite bootcamp",
        items: [
          "Shared budget tree contract on Soroban (testnet)",
          "Policy gateway for x402 payments, SDK and MCP tool",
          "Reference paid service we operate ourselves",
          "Signed decision receipts, including refusals",
          "Trust signals v0: identity, receipt-bound feedback, format/freshness validation",
          "Adversarial test cases: altered, repeated and over-budget payments",
        ],
      },
      {
        stage: "meridian",
        when: "HackMeridian · Oct 25–26, 2026",
        title: "Seller extension — signed offers",
        items: [
          "Small seller kit that publishes a signed offer",
          "Buyer verifies the offer against a pinned key and the 402 challenge",
          "Genuine offer is paid; altered price or recipient is blocked",
          "Pre-event work tagged separately from what is built at the event",
        ],
        note: "Participation depends on acceptance to the event.",
      },
    ],
    signatureTitle: "A signature alone never authorises a payment",
    signatureChecks: [
      "The seller's key was already trusted by the principal — not taken from the same file being verified.",
      "The offer's service, price, asset, network and recipient match the 402 challenge exactly.",
      "The spending policy and the remaining shared budget still allow it.",
    ],
    signatureNote:
      "A signature protects against terms being changed after signing. It does not protect against a stolen key, a phishing origin or a misconfigured policy.",
  },
  cta: {
    title: "Read how it is meant to work.",
    body:
      "The architecture page explains the proposed components, decision rules, security limits and what is out of scope — and which parts are still plans.",
    primary: "Explore the architecture",
    secondary: "Back to the flow",
  },
  footer: {
    status: "TilcAI is an early-stage project in development. Nothing on this site is live or handles real funds.",
    rights: "© 2026 TilcAI team",
  },
  notFound: { title: "Page not found", body: "This page does not exist. The project is early-stage, so links may still change.", back: "Back to overview" },
  docs: docsEn,
};
