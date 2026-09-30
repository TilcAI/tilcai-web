// Illustrative excerpts, not complete validated payloads or a public API.
// IDs, assets, addresses and digests are synthetic placeholders.
// Visible comments come from the same dictionaries as the landing copy.
import type { Copy } from "./i18n/types";

type SnippetId = Copy["code"]["tabs"][number]["id"];

export function snippets(t: Copy["code"]["comments"]): Record<SnippetId, string> {
  return {
    intent: `{
  "schema": "tilcai-intent-v1",       ${t.illustrative}
  "id": "intent_demo",
  "quoteId": "quote_demo",
  "orderId": "order_demo",
  "accountRef": "CONFIGURED_ACCOUNT",
  "purchase": {
    "amountAtomic": "50000",        ${t.verifiedTerms}
    "network": "stellar:testnet",
    "assetId": "CONFIGURED_ASSET_ID",
    "payTo": "CONFIGURED_RECIPIENT",
    "termsHash": "sha256:…"
  },
  "authorization": { "mode": "PER_PURCHASE" }
}`,
    receipt: `{
  "kind": "decision",               ${t.illustrative}
  "id": "decision_receipt_demo",
  "orderId": "order_demo",
  "intentId": "intent_demo",
  "outcome": "DENY",
  "reason": "RECIPIENT",
  "payment": "NOT_ATTEMPTED",        ${t.noFunds}
  "fulfillment": "PENDING"
}`,
    offer: `{
  "kind": "Quote",                  ${t.illustrative}
  "quoteId": "quote_demo",
  "businessId": "business_demo",
  "serviceId": "service_demo",
  "quantity": 1,
  "amountAtomic": "50000",
  "network": "stellar:testnet",
  "assetId": "CONFIGURED_ASSET_ID",
  "payTo": "CONFIGURED_RECIPIENT",
  "keyId": "merchant-key-demo",     ${t.trustedKey}
  "termsHash": "sha256:…",
  "signature": "…"
}`,
  };
}
