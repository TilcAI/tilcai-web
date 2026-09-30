import type { Copy } from "./types";

// Section bodies are trusted HTML written in this repository and rendered with
// dangerouslySetInnerHTML. Never interpolate form data, query strings or any
// other user-supplied value into these strings.
export const docsEn: Copy["docs"] = {
  status: "Proposed architecture · in development · subject to change",
  title: "How TilcAI is meant to work",
  lead:
    "This page describes the design of TilcAI for builders and reviewers. It is not documentation of a public API. Each section says what exists today and what is still being integrated.",
  tocTitle: "On this page",
  backHome: "Back to overview",
  sections: [
    {
      id: "status",
      title: "Status and scope",
      html: `
<p>TilcAI is an infrastructure for the agent of a person or organization to inquire, quote, book and buy from a business agent with limited authority, verifiable terms and payments on Stellar. It is being built in stages. <strong>The complete purchase flow is not enabled.</strong> Names may change.</p>
<ul class="checklist">
  <li><span class="tag tag-available">Available foundation</span> An x402 payment rail with an OpenZeppelin Relayer on Stellar Testnet, a deterministic policy evaluator and versioned shared contracts.</li>
  <li><span class="tag tag-integration">Being integrated</span> MCP connector, quotes and orders, approval per purchase, payment reconciliation and delivery confirmation.</li>
  <li><span class="tag tag-next">Next steps</span> Smart accounts with limited permissions, shared budget across agents and scheduled tasks.</li>
</ul>
<p>The first flow targets one business, one service, one assistant, one user and one asset on <code>stellar:testnet</code>. The status of each item, and who keeps it up to date, is on the <a href="/en#roadmap">build status</a> section of the overview.</p>
<p class="callout">A component being available is not the same as a purchase flow being enabled. Nothing here has been audited, and nothing runs with real funds.</p>`,
    },
    {
      id: "architecture",
      title: "Architecture",
      html: `
<p>A request moves through the path below. The language model helps with the task; the infrastructure decides which actions can run and under which conditions.</p>
<div class="diagram" role="img" aria-label="Flow: MCP or commercial adapter, then gateway, then identity and policy, then authorization, then x402 on Stellar, then reconciliation.">
  <div class="d-row"><span class="d-node">MCP / adapter</span><span class="d-arrow">→</span><span class="d-node">Gateway</span><span class="d-arrow">→</span><span class="d-node d-accent">Identity &amp; policy</span><span class="d-arrow">→</span><span class="d-node d-accent">Authorization</span><span class="d-arrow">→</span><span class="d-node">x402 · Stellar</span><span class="d-arrow">→</span><span class="d-node">Reconciliation</span></div>
</div>
<p>Three planes stay separate, so a request can move forward in the first one without holding permissions in the third:</p>
<ol class="numbered">
  <li><strong>Communication.</strong> Assistants, MCP tools and agent messages.</li>
  <li><strong>Commerce and control.</strong> Business identity, quotes, orders, mandates and policy.</li>
  <li><strong>Financial.</strong> Account, authorization, signing, payment and reconciliation.</li>
</ol>
<div class="table-wrap"><table>
<caption>Main modules and the control each one keeps</caption>
<thead><tr><th scope="col">Module</th><th scope="col">Responsibility</th><th scope="col">Essential control</th></tr></thead>
<tbody>
<tr><td>MCP server</td><td>Expose tools to assistants</td><td>Scopes and the principal's context</td></tr>
<tr><td>Gateway</td><td>Coordinate the purchase cycle</td><td>Idempotency and a state machine</td></tr>
<tr><td>Commercial adapter</td><td>Connect a business's capabilities</td><td>The business is the source of truth</td></tr>
<tr><td>Identity and offer verifier</td><td>Check who offers and that the terms are intact</td><td>Keys from an independent source of trust</td></tr>
<tr><td>Policy and budget</td><td>Evaluate provider, service, amount and limits</td><td>Deny by default</td></tr>
<tr><td>Authorization and signer</td><td>Bind the exact action to consent or a mandate</td><td>Secrets kept away from the model</td></tr>
<tr><td>Stellar adapter, facilitator and Relayer</td><td>Build, verify and submit the x402 payment</td><td>Exact asset, network and invocation</td></tr>
<tr><td>Reconciler and receipts</td><td>Establish the real result and keep evidence</td><td>Never repeat an uncertain payment</td></tr>
</tbody></table></div>
<p>Modules are logical responsibilities, not one service per box. Orders, mandates and states are kept in durable storage: a chat history is not a purchase record.</p>`,
    },
    {
      id: "business",
      title: "Business integration",
      html: `
<p>The business keeps authority over its services, prices, availability and conditions. A commercial adapter connects the capabilities it can really back to the shared flow, and its agent consults the business's own systems. It does not invent stock, discounts or confirmations.</p>
<ul class="plain">
  <li><strong>Explicit capabilities.</strong> Each business exposes only the operations it supports, for example checking availability, holding a resource or confirming an order. Permissions distinguish them.</li>
  <li><strong>Context from authentication.</strong> Business, user and role come from the authenticated session, never from a free argument proposed by the model.</li>
  <li><strong>Identity with a limited scope.</strong> A business registers its operator, origin, keys and payment destination. Controlling a key or a domain does not prove legal identity or commercial quality.</li>
  <li><strong>Signed quotes.</strong> A quote binds business, service, quantity, total price, network, asset, recipient, expiry and a hash of the terms.</li>
</ul>
<p>A buyer accepts a quote only when:</p>
<ol class="numbered">
  <li>the signing key is recognized by an independent source (onboarding, an accepted registry or the principal's trusted configuration), never taken from the quote itself;</li>
  <li>service, network, asset, amount and recipient match the payment requirements exactly, and the quote has not expired;</li>
  <li>policy, budget and approval still allow the operation.</li>
</ol>
<p class="callout">A signature protects the terms after signing. It does not protect against a compromised key, a phishing origin or a misconfigured policy, and it never grants spending authority.</p>
<p><strong>Delivery comes from the business.</strong> The order is confirmed and fulfilled by the business's own system, and that evidence is kept apart from the payment receipt. Publishing a business profile requires its approval; adding a profile or exploring a use case does not enable sales. A business is presented as enabled only after its operational flow has been verified.</p>`,
    },
    {
      id: "mcp",
      title: "MCP and assistants",
      html: `
<p><strong>MCP</strong> (Model Context Protocol) is the tool interface for compatible assistants. TilcAI is designed to publish an MCP server with specific operations, authenticated following the MCP authorization specification. <strong>No MCP server is exposed yet.</strong> The names below are interface design, not a published package.</p>
<div class="table-wrap"><table>
<caption>Designed tool surface</caption>
<thead><tr><th scope="col">Tool</th><th scope="col">Function</th><th scope="col">Permission</th></tr></thead>
<tbody>
<tr><td><code>list_businesses</code></td><td>Discover onboarded providers</td><td>Read</td></tr>
<tr><td><code>get_service</code></td><td>Read services and conditions</td><td>Read</td></tr>
<tr><td><code>get_availability</code></td><td>Check availability</td><td>Read</td></tr>
<tr><td><code>request_quote</code></td><td>Get an identifiable quote</td><td>Preparation</td></tr>
<tr><td><code>prepare_purchase</code></td><td>Verify and prepare an order</td><td>Authenticated user and policy</td></tr>
<tr><td><code>request_purchase</code></td><td>Request execution of a prepared order</td><td>Exact confirmation or mandate</td></tr>
<tr><td><code>get_order_status</code></td><td>Read the result of your own order</td><td>Ownership of the order</td></tr>
<tr><td><code>request_cancellation</code></td><td>Ask to cancel under the terms</td><td>Matching commercial permission</td></tr>
<tr><td><code>get_budget_status</code></td><td>Read limits and holds</td><td>Access to your own budget</td></tr>
</tbody></table></div>
<p>The model works with quote and order IDs. There is no unrestricted tool to send money to an arbitrary address. Price, recipient, quantity, network and asset travel as versioned data; the conversation explains that data but does not redefine it.</p>
<ul class="plain">
  <li><strong>Connecting is not spending.</strong> Connection, data access and purchase authority are separate. Selecting an assistant or allowing a tool never grants permission to spend.</li>
  <li><strong>A skill is guidance, not permission.</strong> It explains how to inquire, clarify, prepare and report states. The server enforces the rules even if an agent ignores the skill.</li>
  <li><strong>Support is per capability.</strong> The client catalog distinguishes reading, quoting, preparing and executing. Supporting MCP does not imply autonomous payments. Every client is tested with its own version and authentication.</li>
  <li><strong>Status today.</strong> Every client in the catalog is in preparation. A guide is published for a client only after it has been tested, and no guide asks for a seed phrase, private key or token.</li>
</ul>`,
    },
    {
      id: "payments",
      title: "Permissions and payments",
      html: `
<p>A payment becomes eligible only when all of these hold at once:</p>
<ol class="numbered">
  <li>a recognized identity and an authentic, current offer;</li>
  <li>an intent bound to an order and an applicable mandate;</li>
  <li>available and held budget;</li>
  <li>exact approval or a verifiable delegation.</li>
</ol>
<p><strong>A valid signature is not enough to authorize a payment.</strong> Reputation can inform a decision but never bypasses a limit.</p>
<h3>Decisions and states are different things</h3>
<div class="table-wrap"><table>
<caption>Five words that must not be confused</caption>
<thead><tr><th scope="col">State</th><th scope="col">It means</th><th scope="col">It does not mean</th></tr></thead>
<tbody>
<tr><td>Allowed (<code>ALLOW</code>)</td><td>The policy passed for this intent</td><td>Permission to sign, a payment or a delivery</td></tr>
<tr><td>Approved</td><td>The user authorized the exact terms, or a valid mandate applies</td><td>That any funds moved</td></tr>
<tr><td>Sent</td><td>A payment attempt was submitted to the rail</td><td>That it settled; the result can still be uncertain</td></tr>
<tr><td>Settled</td><td>The rail confirmed the payment</td><td>That the service was delivered</td></tr>
<tr><td>Delivered</td><td>The business provided evidence of fulfillment</td><td>Evidence of the payment itself</td></tr>
</tbody></table></div>
<p>The policy engine returns <code>ALLOW</code>, <code>DENY</code> or <code>REQUIRE_APPROVAL</code>. The current prototype returns <code>ALLOW</code> or <code>DENY</code>; human approval is part of the authorization flow. An order keeps separate commerce, payment and budget states, so a paid order can still be waiting for delivery.</p>
<h3>Two ways to authorize</h3>
<ul class="plain">
  <li><strong>Approval per purchase (first route).</strong> The user connects a compatible account and reviews service, amount, asset, network, recipient and terms. The wallet signs an authorization compatible with the rail, which on Stellar x402 means a Soroban authorization entry. A login signature or a wallet connection is not enough. If the offer or the invocation changes, a new approval is required.</li>
  <li><strong>Limited delegation (target route).</strong> A Soroban smart account owned by the user accepts a restricted signer within a mandate: exact network and asset, allowed contracts, recipients, per-operation and per-period amounts, providers, expiry and revocation. It is enabled only after the account, signer and rail are tested together. A working smart account does not by itself prove that a payment payload is compatible with it.</li>
</ul>
<h3>The payment rail today</h3>
<p>The rail is an x402 facilitator running as a plugin inside an OpenZeppelin Relayer, on Stellar Testnet. It exposes <code>verify</code>, <code>settle</code> and <code>supported</code>. It checks the network, the allowed asset, the recipient, the amount and the payer's signed authorization, simulates the transaction, and the Relayer submits it and pays the network fee.</p>
<ul class="plain">
  <li><strong>Tested.</strong> A Testnet payment was confirmed on-chain and independently checked. Altered payloads were rejected before any funds moved. Repeating a settled payload did not pay twice. The settlement response carries payment evidence only, never delivery data.</li>
  <li><strong>Not yet.</strong> Connection to quotes, approvals, budget and orders; a smart account as payer; mainnet; and USDC, since the Testnet test used the network's native asset.</li>
</ul>
<p>The technical detail, payloads and error contract are in the <a href="https://github.com/TilcAI/tilcai-core/blob/main/docs/payment-rail-environment.md" rel="noopener">payment rail documentation</a> of the open <code>tilcai-core</code> repository.</p>
<h3>When something goes wrong</h3>
<ul class="plain">
  <li><strong>Uncertain payment.</strong> A timeout after sending is not a failure. The budget hold is kept and the same attempt is reconciled before anything is signed again. Retrying a query can be safe; retrying a financial execution requires knowing the state of the previous attempt.</li>
  <li><strong>Payment without delivery.</strong> The order is not marked delivered. The issue is resolved under the commercial terms, and repeating the purchase is not an automatic fix.</li>
  <li><strong>Revocation.</strong> Revoking a mandate blocks new signatures. It does not reverse a payment that already settled.</li>
  <li><strong>Changed terms.</strong> A different price, provider or service stops the operation for a new approval. The agent cannot raise its own limit or approve its own exception.</li>
</ul>`,
    },
    {
      id: "extensions",
      title: "Planned extensions",
      html: `
<p>These are planned, not active. They are added behind the same operations and states.</p>
<ul class="checklist">
  <li><span class="tag tag-next">Planned extension</span> <strong>A2A.</strong> A standard for agent-to-agent communication, with capabilities described by Agent Cards. It would connect a buyer's request to a business agent's capabilities. It does not replace inventory, a mandate or a financial signature. The first flow can run on MCP and a commercial API.</li>
  <li><span class="tag tag-next">Planned extension</span> <strong>ERC-8004.</strong> A draft standard for identity, reputation and validation registries on Ethereum/EVM. It is not a native Stellar contract and does not guarantee trust. TilcAI plans a native operational identity on Stellar and, separately, an adapter to resolve an EVM registry. Reading an EVM identity never moves funds between networks or builds a bridge.</li>
  <li><span class="tag tag-next">Next steps</span> <strong>Smart accounts, shared budget and scheduled tasks.</strong> See the build status on the overview.</li>
</ul>`,
    },
    {
      id: "limits",
      title: "Security model and known limits",
      html: `
<ul class="plain">
  <li><strong>The model proposes; rules decide.</strong> Model output is never trusted for price, recipient or approval. An unverifiable condition blocks the operation or asks for human review.</li>
  <li><strong>The signer is a separate boundary.</strong> Keys stay away from the model and from business data. This website stores no private keys, financial tokens or spending mandates.</li>
  <li><strong>Facilitator dependency.</strong> Settlement relies on an x402 facilitator and a Relayer on Testnet. If they are unavailable, payments stop.</li>
  <li><strong>Testnet only.</strong> The first flow runs on Stellar Testnet. Testnet and mainnet have separate configuration and are enabled separately.</li>
  <li><strong>Not audited.</strong> Nothing described here has been audited.</li>
</ul>
<p>Out of scope for now: an agent marketplace, trading or DeFi, cross-chain bridges, free-form price negotiation, purchases from any business without an adapter, regulated services and unlimited agent autonomy.</p>`,
    },
    {
      id: "glossary",
      title: "Glossary",
      html: `
<dl class="glossary">
  <dt>Principal</dt><dd>The person or organization that owns the funds and grants authority.</dd>
  <dt>Mandate</dt><dd>Authority delegated to an agent, with scope, limits, period and revocation.</dd>
  <dt>Quote</dt><dd>Exact commercial terms from a business: service, price, asset, network, recipient and expiry.</dd>
  <dt>Order</dt><dd>The commercial operation linking principal, business and quote, with its own states.</dd>
  <dt>MCP</dt><dd>Model Context Protocol: the tool interface for compatible assistants.</dd>
  <dt>x402</dt><dd>An HTTP payment protocol: a server answers <code>402 Payment Required</code> with payment terms and the client pays to obtain the resource.</dd>
  <dt>Facilitator</dt><dd>The component that verifies and submits an x402 payment. Here, a plugin running in an OpenZeppelin Relayer.</dd>
  <dt>Soroban</dt><dd>Stellar's smart contract platform.</dd>
  <dt>Reconciliation</dt><dd>Establishing the real result of a payment attempt, including when a call failed midway.</dd>
  <dt>Reason code</dt><dd>A machine-readable explanation of a decision.</dd>
</dl>`,
    },
  ],
};
