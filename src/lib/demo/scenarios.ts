export const demoModes = ["visual", "policy", "testnet"] as const;
export type DemoMode = typeof demoModes[number];

export const scenarioIds = ["cinema", "digital-service", "scheduled-purchase"] as const;
export type ScenarioId = typeof scenarioIds[number];

export const variantIds = ["valid", "changed-recipient", "over-limit", "requires-approval"] as const;
export type VariantId = typeof variantIds[number];

export type Decision = "ALLOW" | "DENY" | "REQUIRE_APPROVAL";

export interface ScenarioVariantFixture {
  decision: Decision;
  recipient?: string;
  amount?: string;
}

export interface ScenarioFixture {
  id: ScenarioId;
  request: {
    reference: string;
    quantity: number;
  };
  quote: {
    reference: string;
    recipient: string;
    amount: string;
    limit: string;
    currency: "USDC";
  };
  variants: Record<VariantId, ScenarioVariantFixture>;
}

/** Only the visual, predefined-fixture mode is active in this website. */
export const demoMode: DemoMode = "visual";
export const initialScenarioId: ScenarioId = "cinema";
export const initialVariantId: VariantId = "valid";

export const demoScenarios: readonly ScenarioFixture[] = [
  {
    id: "cinema",
    request: { reference: "request_cinema_demo", quantity: 2 },
    quote: {
      reference: "quote_cinema_demo",
      recipient: "cinema_recipient_demo",
      amount: "10.00",
      limit: "12.00",
      currency: "USDC",
    },
    variants: {
      valid: { decision: "ALLOW" },
      "changed-recipient": { decision: "DENY", recipient: "unknown_recipient_demo" },
      "over-limit": { decision: "DENY", amount: "15.00" },
      "requires-approval": { decision: "REQUIRE_APPROVAL" },
    },
  },
  {
    id: "digital-service",
    request: { reference: "request_digital_service_demo", quantity: 1 },
    quote: {
      reference: "quote_digital_service_demo",
      recipient: "digital_service_recipient_demo",
      amount: "18.00",
      limit: "20.00",
      currency: "USDC",
    },
    variants: {
      valid: { decision: "ALLOW" },
      "changed-recipient": { decision: "DENY", recipient: "unknown_recipient_demo" },
      "over-limit": { decision: "DENY", amount: "25.00" },
      "requires-approval": { decision: "REQUIRE_APPROVAL" },
    },
  },
  {
    id: "scheduled-purchase",
    request: { reference: "request_scheduled_purchase_demo", quantity: 1 },
    quote: {
      reference: "quote_scheduled_purchase_demo",
      recipient: "scheduled_service_recipient_demo",
      amount: "8.00",
      limit: "10.00",
      currency: "USDC",
    },
    variants: {
      valid: { decision: "ALLOW" },
      "changed-recipient": { decision: "DENY", recipient: "unknown_recipient_demo" },
      "over-limit": { decision: "DENY", amount: "12.00" },
      "requires-approval": { decision: "REQUIRE_APPROVAL" },
    },
  },
];
