// Conceptual data structures shown on the landing page.
// Illustrative only: not a published package, not a public API.
// Addresses and hashes are deliberately truncated placeholders.
// Field names stay in English; comments follow the page language.

import type { Locale } from "./i18n/types";

const c = {
  en: {
    proposed: "// proposed",
    fromChallenge: "// read from the 402 challenge",
    noFunds: "// no funds moved",
    meridian: "// planned for HackMeridian",
    pinned: "// must match a key pinned by the principal",
  },
  es: {
    proposed: "// propuesto",
    fromChallenge: "// leído del desafío 402",
    noFunds: "// no se movieron fondos",
    meridian: "// previsto para HackMeridian",
    pinned: "// debe coincidir con una clave fijada por el principal",
  },
} as const;

export function snippets(locale: Locale): Record<string, string> {
  const t = c[locale];
  return {
    intent: `{
  "kind": "PaymentIntent",          ${t.proposed}
  "resource": "https://seller.example/risk-report",
  "providerId": "seller-demo",
  "network": "stellar:testnet",
  "asset": "USDC",
  "amount": "0.05",
  "payTo": "G…SELLER",              ${t.fromChallenge}
  "scheme": "exact",
  "expiresAt": "2026-10-15T18:00:00Z",
  "intentHash": "sha256:…"
}`,
    receipt: `{
  "kind": "DecisionReceipt",        ${t.proposed}
  "agent": "sub-agent/risk",
  "mandate": "root/orchestrator/risk",
  "decision": "DENY",
  "reasonCodes": [
    "PER_PAYMENT_LIMIT_EXCEEDED",
    "PAYEE_NOT_ALLOWED"
  ],
  "requested": { "amount": "2.00", "payTo": "G…UNKNOWN" },
  "policyHash": "sha256:…",
  "transaction": null,              ${t.noFunds}
  "signature": "…"
}`,
    offer: `{
  "version": "tilcai-offer-v1",     ${t.meridian}
  "sellerId": "seller-demo",
  "origin": "https://seller.example",
  "keyId": "seller-key-1",          ${t.pinned}
  "service": "/risk-report",
  "network": "stellar:testnet",
  "asset": "USDC",
  "amount": "0.05",
  "payTo": "G…SELLER",
  "validUntil": "2026-10-26T18:00:00Z",
  "signature": "…"
}`,
  };
}
