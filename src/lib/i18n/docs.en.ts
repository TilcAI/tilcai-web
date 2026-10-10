import type { Copy } from "./types";
import { networkLogos } from "../content/network-logos.ts";

// Each section body is trusted HTML authored in this repository and rendered with
// dangerouslySetInnerHTML. Never interpolate form data, URL parameters or any
// user-supplied value.
//
// Source: the team's official context (cut of 8 to 10 October 2026), the 10 October document on mainnet and
// testnet running together and the code of tilcai-core, tilcai-infrastructure and tilcai-cctp-engine. If an older document claims
// another status, the code and its tests decide. Keep aligned with src/lib/content/roadmap.ts.
export const docsEn: Copy["docs"] = {
  status: "Proposed architecture · in development · subject to change",
  title: "TilcAI documentation",
  lead:
    "How the infrastructure is designed, what can be checked today and what is still being integrated. It is written for builders and reviewers: it is not the reference of a public API.",
  breadcrumb: "Breadcrumb",
  meta: [
    { label: "Updated", value: "10 October 2026" },
    { label: "Environment", value: "Testnet and mainnet" },
    { label: "Funds and audit", value: "Mainnet with 0.01 USDC payments · not audited" },
  ],
  pathsTitle: "Start where it applies to you",
  paths: [
    { id: "status", title: "I want to understand what TilcAI is", text: "What it does, what works today and what does not yet." },
    { id: "business", title: "I represent a business", text: "How a business joins and what it keeps." },
    { id: "mcp", title: "I build an assistant or an app", text: "The MCP tools and the ways in." },
  ],
  tocTitle: "On this page",
  groups: { overview: "Overview", design: "Design", payments: "Payments and control", reference: "Reference" },
  sections: [
    {
      id: "status",
      title: "What TilcAI is and where it stands",
      group: "overview",
      html: `
<p class="lede">TilcAI is commerce infrastructure between agents: the assistant of a person or organization inquires, quotes and buys from a business with limited authority, verifiable terms and payments on Stellar.</p>
<p>It receives a purchase or booking intent, gets from the business an offer with a verifiable price, availability and payout destination, applies identity, limits and approval, coordinates a payment over a supported rail and links the financial result to the order and to the commercial confirmation. It is being built in stages and names may change. <strong>The complete purchase flow is not enabled.</strong></p>
<ul class="checklist">
  <li><span class="tag tag-available">Available foundation</span> Technical USDC payments from Avalanche to Stellar with CCTP, also gasless for the buyer: verified on testnet and, on 10 October, with two real 0.01 USDC payments on mainnet; a disbursement vault and a simulated QR charge, tested with Optipagos on testnet; contract accounts with a passkey on Avalanche Fuji and Stellar Testnet; an MCP server published on npm (<code>tilcai-mcp</code>) with cross-network payment tools; an x402 rail with an OpenZeppelin Relayer tested in isolation; a deterministic policy evaluator and versioned shared contracts.</li>
  <li><span class="tag tag-integration">Being integrated</span> Commercial MCP tools (catalog, quote, approval and order), quotes and orders, approval per purchase, linking order, payment and delivery, the WhatsApp channel, delegating payments to agents and accounts, vault and x402 on mainnet.</li>
  <li><span class="tag tag-next">Next steps</span> Smart accounts with limited permissions, shared budget across agents, scheduled tasks and more CCTP routes.</li>
</ul>
<p class="callout">A component being available is not the same as a purchase flow being enabled. Nothing here has been audited. Testnet has no real funds; on mainnet only the Avalanche → Stellar corridor was tested, with two 0.01 USDC payments. Every capability, with its evidence and who maintains it, is on the <a href="/en/roadmap">build status</a> page.</p>
<h3>What TilcAI builds and what is external</h3>
<div class="table-wrap"><table>
<caption>Boundaries of the infrastructure</caption>
<thead><tr><th scope="col">TilcAI builds and operates</th><th scope="col">Connected, but external</th></tr></thead>
<tbody>
<tr><td>API and gateway, shared contracts, channel adapters, commercial directory, quote and order, rules, approval, payment router, reconciliation, receipts and events</td><td>WhatsApp Business Platform, assistants and AI models, the business's POS, inventory and calendar, Circle Iris and CCTP, the Stellar and EVM networks, explorers and any fiat conversion provider</td></tr>
<tr><td>Registry of issued accounts, delegations and quotas, once the accounts phase is operational</td><td>The account owner's private credential, the user's funds and the business's original prices</td></tr>
</tbody></table></div>
<p>The first flow targets one business, one service, one assistant, one user and one asset on <code>stellar:testnet</code>.</p>`,
    },
    {
      id: "operation",
      title: "One purchase, end to end",
      group: "overview",
      html: `
<p class="lede">A single operation joins the buyer and the business. Every step has an owner, a state and its own evidence: payment is never confused with delivery.</p>
<ol class="doc-steps">
  <li>
    <h3>Intent</h3>
    <p>The buyer asks for a product or service, the quantity and the conditions. TilcAI structures the intent and records the authenticated principal.</p>
    <dl class="doc-meta"><div><dt>State</dt><dd>Requested</dd></div><div><dt>Evidence</dt><dd>Message and authenticated principal</dd></div></dl>
  </li>
  <li>
    <h3>Offer</h3>
    <p>The business consults its source of truth and returns an identified quote, with validity, asset, amount, costs, availability and the registered payout destination (<code>payTo</code>). If it cannot guarantee stock or capacity, it confirms before promising it.</p>
    <dl class="doc-meta"><div><dt>State</dt><dd>Quoted, or pending confirmation</dd></div><div><dt>Evidence</dt><dd><code>quoteId</code>, version, source and time of the availability</dd></div></dl>
  </li>
  <li>
    <h3>Verification</h3>
    <p>TilcAI verifies the business identity, the payout destination, the offer version, the limits and the policy. A rejection or a pending approval does not start the payment. <code>ALLOW</code> is eligibility: it neither signs nor pays.</p>
    <dl class="doc-meta"><div><dt>State</dt><dd>Evaluated</dd></div><div><dt>Evidence</dt><dd>Decision and reason code</dd></div></dl>
  </li>
  <li>
    <h3>Approval</h3>
    <p>The person reviews the exact terms on a trusted surface and approves them. The approval commits amount, asset, network, recipient, <code>quoteId</code>, expiry and <code>orderId</code>. A written "yes" in a chat does not replace the authorization.</p>
    <dl class="doc-meta"><div><dt>State</dt><dd>Approved</dd></div><div><dt>Evidence</dt><dd>Approval bound to the order</dd></div></dl>
  </li>
  <li>
    <h3>Payment</h3>
    <p>The router picks a single route: a direct payment on Stellar with x402, or USDC from another network with CCTP. Every attempt carries an idempotency key.</p>
    <dl class="doc-meta"><div><dt>State</dt><dd>Prepared, sent</dd></div><div><dt>Evidence</dt><dd><code>paymentAttemptId</code> and chosen route</dd></div></dl>
  </li>
  <li>
    <h3>Reconciliation</h3>
    <p>TilcAI checks the on-chain evidence and links <code>orderId</code>, <code>quoteId</code>, <code>paymentAttemptId</code>, source hash, attestation and destination hash. A timeout is <code>UNCERTAIN</code> until reconciled: it is not permission to repeat the payment.</p>
    <dl class="doc-meta"><div><dt>State</dt><dd>Settled</dd></div><div><dt>Evidence</dt><dd>Financial receipt with links to the network's explorer</dd></div></dl>
  </li>
  <li>
    <h3>Fulfillment</h3>
    <p>The business confirms the booking, pickup or delivery separately. Buyer and business see the same order state, each with its own receipt.</p>
    <dl class="doc-meta"><div><dt>State</dt><dd>Closed or in follow-up</dd></div><div><dt>Evidence</dt><dd>The business's confirmation, distinct from the payment receipt</dd></div></dl>
  </li>
</ol>
<h3>Minimum shared contract</h3>
<p>Channels, API and rails share the same identifiers:</p>
<ul class="doc-chips" role="list"><li><code>principalId</code></li><li><code>agentId</code></li><li><code>businessId</code></li><li><code>serviceId</code></li><li><code>quoteId</code></li><li><code>orderId</code></li><li><code>paymentAttemptId</code></li></ul>
<p>On top of them come the commerce, payment and budget states of <code>tilcai-shared-v1</code>, an <code>Idempotency-Key</code> on every write, amounts in atomic units, an unambiguous network and a versioned <code>payTo</code>. The shared contracts are a proposal: the team must review them before fixing them as the final API.</p>
<p class="callout">Paid does not mean delivered. If delivery fails after payment, the result is a visible commercial exception, not an automatic conversion. Cancellation and refunds need their own rules and do not exist yet.</p>`,
    },
    {
      id: "architecture",
      title: "Architecture and planes",
      group: "design",
      html: `
<p class="lede">A request moves through three planes that stay separate, so it can move forward in the first one without holding permissions in the third. The language model helps with the task; the infrastructure decides which actions can run and under which conditions.</p>
<div class="doc-lanes">
  <section class="doc-lane" aria-labelledby="lane-communication">
    <h3 id="lane-communication">Communication</h3>
    <ul role="list"><li>Guided WhatsApp</li><li>Assistant with MCP</li><li>App with API</li></ul>
  </section>
  <section class="doc-lane is-control" aria-labelledby="lane-control">
    <h3 id="lane-control">Commerce and control</h3>
    <ul role="list"><li>Gateway and tenant</li><li>Directory and commercial adapter</li><li>Quote, order and states</li><li>Policy, budget and approval</li></ul>
  </section>
  <section class="doc-lane is-financial" aria-labelledby="lane-financial">
    <h3 id="lane-financial">Financial</h3>
    <ul role="list"><li>Payment router</li><li>x402 with Relayer</li><li>CCTP, from Fuji to Stellar</li><li>Reconciler and receipts</li></ul>
  </section>
  <section class="doc-lane is-external" aria-labelledby="lane-external">
    <h3 id="lane-external">External</h3>
    <ul role="list"><li>Business: agent, POS or console</li><li>Circle Iris</li><li>Stellar and Avalanche</li><li>WhatsApp Business</li></ul>
  </section>
</div>
<p>Orders, mandates and states are kept in durable storage: a chat history is not a purchase record. Modules are logical responsibilities, not one service per box.</p>
<div class="table-wrap"><table>
<caption>Main modules and the control each one keeps</caption>
<thead><tr><th scope="col">Module</th><th scope="col">Responsibility</th><th scope="col">Essential control</th></tr></thead>
<tbody>
<tr><td>Channels (WhatsApp, MCP and API)</td><td>Receive intents and return states</td><td>A channel is never the financial authority</td></tr>
<tr><td>MCP server</td><td>Expose tools to assistants</td><td>Scopes and the principal's context</td></tr>
<tr><td>Gateway</td><td>Coordinate the purchase cycle</td><td>Idempotency and a state machine</td></tr>
<tr><td>Commercial adapter</td><td>Connect a business's capabilities</td><td>The business is the source of truth</td></tr>
<tr><td>Identity and offer verifier</td><td>Check who offers and that the terms are intact</td><td>Keys from an independent source of trust</td></tr>
<tr><td>Policy and budget</td><td>Evaluate provider, service, amount and limits</td><td>Deny by default</td></tr>
<tr><td>Authorization and signer</td><td>Bind the exact action to consent or a mandate</td><td>Secrets kept away from the model</td></tr>
<tr><td>Payment router</td><td>Choose one route for each order</td><td>One attempt per idempotency key</td></tr>
<tr><td>Stellar adapter, facilitator and Relayer</td><td>Build, verify and submit the payment</td><td>Exact asset, network and invocation</td></tr>
<tr><td>Reconciler and receipts</td><td>Establish the real result and keep evidence</td><td>Never repeat an uncertain payment</td></tr>
</tbody></table></div>`,
    },
    {
      id: "business",
      title: "Businesses and verifiable offers",
      group: "design",
      html: `
<p class="lede">The business keeps authority over its services, prices, availability, payout destination and delivery confirmation. TilcAI does not invent stock, discounts or confirmations.</p>
<h3>Four integration paths</h3>
<div class="table-wrap"><table>
<caption>The same business can move from one path to another without losing its identity, its order history or its payout destination</caption>
<thead><tr><th scope="col">Path</th><th scope="col">For whom</th><th scope="col">What the business manages</th><th scope="col">First safe capability</th></tr></thead>
<tbody>
<tr><td>A · Managed console</td><td>A business with no software or agent</td><td>An operator, the catalog and manual availability</td><td>Inquire and quote, with manual confirmation</td></tr>
<tr><td>B · File or spreadsheet</td><td>A business with a spreadsheet or a closed system</td><td>Exporting a file and reviewing changes</td><td>A versioned catalog; stock stays subject to confirmation</td></tr>
<tr><td>C · API, webhooks or POS connector</td><td>A business with a sales or inventory system</td><td>Credentials, endpoints and product mapping</td><td>Real-time price and stock; a hold if the system allows it</td></tr>
<tr><td>D · Own agent</td><td>A company with a technical team</td><td>Its server, its credentials and its rules</td><td>One certified capability per operation, not unrestricted access</td></tr>
</tbody></table></div>
<p class="callout is-note">These are onboarding proposals, not a launched product. There is no commerce portal, no real connected catalog and no operational seller agent yet; they are tested first with a bounded pilot business, on testnet. No AI agent or website is needed to start.</p>
<h3>What the business keeps</h3>
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
<h3>Who answers for the business</h3>
<p>The seller agent is the operational interface that serves requests through authorized capabilities. It can be a rules service with a human operator as backup (the recommended mode for the pilot, because it is the most verifiable), an assistant managed by TilcAI or the company's own agent connected by API. In every case the model does not set price, stock, payout or authority on its own.</p>
<p><strong>Delivery comes from the business.</strong> The order is confirmed and fulfilled by the business's own system, and that evidence is kept apart from the payment receipt. Publishing a business profile requires its approval; adding a profile or exploring a use case does not enable sales. A business is presented as enabled only after its operational flow has been verified.</p>`,
    },
    {
      id: "mcp",
      title: "Buyers and assistants",
      group: "design",
      html: `
<p class="lede">There are three ways into the same infrastructure. All of them end in the same identity, offer, policy, authorization, order, payment and receipt services: a channel is not the financial authority.</p>
<div class="table-wrap"><table>
<caption>A buyer's ways in</caption>
<thead><tr><th scope="col">Way in</th><th scope="col">For whom</th><th scope="col">How it works</th><th scope="col">Status</th></tr></thead>
<tbody>
<tr><td>Guided WhatsApp</td><td>A person with no agent or wallet</td><td>A conversation and a secure web link for identity and signing. It never asks for seed phrases or keys in the chat</td><td><span class="tag tag-integration">Being integrated</span> The team gave an external demonstration; the own integration is missing</td></tr>
<tr><td>Assistant with MCP</td><td>Someone who already uses a compatible assistant</td><td>Installs TilcAI's MCP server (<code>tilcai-mcp</code>) and authenticates with an API key</td><td><span class="tag tag-integration">Being integrated</span> The package is already on npm with six cross-network payment tools; the 12 commercial tools are still pending</td></tr>
<tr><td>API and future SDK</td><td>An app or a backend of their own</td><td>Authenticated REST API. The SDK, when it exists, packages authentication, types, idempotency and errors</td><td><span class="tag tag-integration">Being integrated</span> The cross-network payments API is verified on testnet and with real test payments on mainnet; the commercial API is pending</td></tr>
</tbody></table></div>
<h3>MCP tools</h3>
<p><strong>MCP</strong> (Model Context Protocol) is the tool interface for compatible assistants. TilcAI already publishes an MCP server, <a href="https://www.npmjs.com/package/tilcai-mcp" rel="noopener"><code>tilcai-mcp</code></a>, but only with cross-network payment tools. The commercial tools, with catalog, quote, approval and order, are still a contract designed in <code>tilcai-core</code>, with no server yet.</p>
<h3>The tilcai-mcp package</h3>
<p>It is a stdio MCP server, MIT-licensed, at version 0.2.0 on npm. It lets an agent with an EVM wallet pay USDC to a Stellar address through TilcAI's API (CCTP V2). To sign, the agent uses a separate EVM wallet server: <code>tilcai-mcp</code> only talks to the API, tells the agent what to sign and never handles private keys.</p>
<div class="table-wrap"><table>
<caption>The six published tools</caption>
<thead><tr><th scope="col">Tool</th><th scope="col">What it does</th></tr></thead>
<tbody>
<tr><td><code>tilcai_status</code></td><td>Health of TilcAI and the relayer, routes and the configured network</td></tr>
<tr><td><code>tilcai_quote</code></td><td>Quotes a USDC amount to a Stellar address and checks the trustline</td></tr>
<tr><td><code>tilcai_create_payment</code></td><td>Creates the payment. Gasless (the default) returns what the agent must sign; in <code>external</code> mode it returns the <code>approve</code> and burn calls</td></tr>
<tr><td><code>tilcai_submit_authorization</code></td><td>Gasless: submits the agent's signature; the relayer pays the gas on both networks</td></tr>
<tr><td><code>tilcai_submit_burn</code></td><td><code>external</code> mode: reports the burn hash</td></tr>
<tr><td><code>tilcai_payment_status</code></td><td>Status up to <code>SETTLED</code>; it can force a reconciliation step</td></tr>
</tbody></table></div>
<p>There are two environments, one per process, chosen with <code>TILCAI_NETWORK</code>: testnet (Avalanche Fuji → Stellar Testnet, the default) or mainnet (Avalanche C-Chain → Stellar Public Network). Mainnet moves real USDC and uses its own API keys, different from testnet's. Before creating a payment, the tool checks that the API belongs to the configured environment and is not read-only.</p>
<p class="callout is-note">It is a technical payment tool. The destination travels as quote data, and the package includes no catalog, signed offer or approval by a person: whoever connects it decides which agent and which wallet sign. It is not the purchase flow with exact approval that this page describes, and it is not audited.</p>
<h3>Designed commercial tools</h3>
<div class="table-wrap"><table>
<caption>Designed tool surface</caption>
<thead><tr><th scope="col">Tool</th><th scope="col">Function</th><th scope="col">Permission</th></tr></thead>
<tbody>
<tr><td><code>list_businesses</code></td><td>Discover onboarded businesses</td><td><code>catalog:read</code></td></tr>
<tr><td><code>get_service</code></td><td>Read a service and its conditions</td><td><code>catalog:read</code></td></tr>
<tr><td><code>get_availability</code></td><td>Check availability at a verified moment; it does not hold</td><td><code>catalog:read</code></td></tr>
<tr><td><code>request_quote</code></td><td>Get an identifiable quote</td><td><code>quotes:write</code></td></tr>
<tr><td><code>create_intent</code></td><td>Create an intent from a quote</td><td><code>intents:write</code></td></tr>
<tr><td><code>prepare_purchase</code></td><td>Verify and prepare the purchase; it neither signs nor pays</td><td><code>intents:write</code></td></tr>
<tr><td><code>request_approval</code></td><td>Ask for the person's approval; it does not grant it</td><td><code>approvals:request</code></td></tr>
<tr><td><code>request_purchase</code></td><td>Request execution of a prepared purchase</td><td><code>purchases:request</code> with exact authority</td></tr>
<tr><td><code>get_order_status</code></td><td>Read the state of your own order</td><td><code>orders:read</code></td></tr>
<tr><td><code>request_cancellation</code></td><td>Ask to cancel; it does not imply a refund</td><td><code>orders:cancel</code></td></tr>
<tr><td><code>get_budget_status</code></td><td>Read limits and holds</td><td><code>budgets:read</code></td></tr>
<tr><td><code>get_receipts</code></td><td>Read the receipts of an order</td><td><code>receipts:read</code></td></tr>
</tbody></table></div>
<p>The model works with quote, intent and order IDs. In this designed contract there is no unrestricted tool to send money to an arbitrary address; <code>tilcai-mcp</code>, described above, is a technical payment tool separate from this contract. Price, recipient, quantity, network and asset travel as versioned data; the conversation explains that data but does not redefine it.</p>
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
      group: "payments",
      html: `
<p class="lede">A payment becomes eligible only when four conditions hold at once. A valid signature is not enough to authorize it, and reputation can inform a decision but never bypasses a limit.</p>
<ol class="numbered">
  <li>a recognized identity and an authentic, current offer;</li>
  <li>an intent bound to an order and an applicable mandate;</li>
  <li>available and held budget;</li>
  <li>exact approval or a verifiable delegation.</li>
</ol>
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
  <li><strong>Limited delegation (target route).</strong> A Soroban smart account owned by the user accepts a restricted signer within a mandate: exact network and asset, allowed contracts, recipients, per-operation and per-period amounts, providers, expiry and revocation. It is enabled only after the account, signer and rail are tested together.</li>
</ul>
<h3>When something goes wrong</h3>
<ul class="plain">
  <li><strong>Uncertain payment.</strong> A timeout after sending is not a failure. The budget hold is kept and the same attempt is reconciled before anything is signed again. Retrying a query can be safe; retrying a financial execution requires knowing the state of the previous attempt.</li>
  <li><strong>Payment without delivery.</strong> The order is not marked delivered. The issue is resolved under the commercial terms, and repeating the purchase is not an automatic fix.</li>
  <li><strong>Revocation.</strong> Revoking a mandate blocks new signatures. It does not reverse a payment that already settled.</li>
  <li><strong>Changed terms.</strong> A different price, provider or service stops the operation for a new approval. The agent cannot raise its own limit or approve its own exception.</li>
</ul>`,
    },
    {
      id: "rails",
      title: "Payment rails and networks",
      group: "payments",
      html: `
<p class="lede">TilcAI picks a single route for each order. A direct payment on Stellar and a cross-network payment with CCTP are alternatives, not two charges for the same order, and they do not yet form an integrated commercial checkout.</p>
<div class="table-wrap"><table>
<caption>Two rails that must not be confused</caption>
<thead><tr><th scope="col"><span class="sr-only">Aspect</span></th><th scope="col">Direct payment on Stellar (x402)</th><th scope="col">USDC across networks (CCTP V2)</th></tr></thead>
<tbody>
<tr>
<th scope="row">How it works</th>
<td>A service answers <code>402 Payment Required</code> with the terms; the payer signs an authorization and a facilitator, running as a plugin inside an OpenZeppelin Relayer, verifies and settles it. It exposes <code>verify</code>, <code>settle</code> and <code>supported</code>.</td>
<td>Burns native USDC on the source network, waits for Circle's attestation and mints native USDC on Stellar. The burn's recipient is always a forwarder, and the final account travels in <code>hookData</code>.</td>
</tr>
<tr>
<th scope="row">Status today</th>
<td><span class="tag tag-integration">Isolated test</span> A payment was confirmed on Stellar Testnet with the native asset, altered payloads were rejected before any funds moved, and repeating a settled one did not pay twice.</td>
<td><span class="tag tag-available">Verified on testnet and mainnet</span> Real transfers from Avalanche Fuji to Stellar Testnet and, on mainnet, two 0.01 USDC payments from Avalanche C-Chain to Stellar. With a gasless mode: the payer signs an exact authorization and the Relayer pays the gas on both networks.</td>
</tr>
<tr>
<th scope="row">Missing</th>
<td>Repeat it with USDC and with the intended account, and connect it to quotes, approvals and orders.</td>
<td>Link it to quotes, orders and approval, and enable each additional network with its own end-to-end test.</td>
</tr>
</tbody></table></div>
<h3>Lifecycle of a cross-network payment</h3>
<p>A payment moves through stored states: a retry resumes from the last one and never repeats the burn.</p>
<ol class="doc-states">
  <li><code>AWAITING_BURN</code><span>Payment created, waiting for the signed burn</span></li>
  <li><code>BURN_SUBMITTED</code><span>Burn sent; its hash is stored</span></li>
  <li><code>BURN_CONFIRMED</code><span>The receipt and the event match the quote</span></li>
  <li><code>ATTESTED</code><span>Circle attested and the message was verified again</span></li>
  <li><code>MINT_SUBMITTED</code><span>The Relayer sent the mint</span></li>
  <li><code>SETTLED</code><span>Mint confirmed; USDC at the destination and a payment receipt</span></li>
</ol>
<ul class="plain">
  <li><strong>A burn backs a single payment</strong> and a CCTP nonce a single settlement.</li>
  <li><strong>The mint is idempotent.</strong> It is retried without risk, and a second burn is never created for an existing payment.</li>
  <li><strong>The signature commits the exact terms.</strong> In gasless mode the Relayer can only send what the payer signed.</li>
  <li><strong>Uncertainty is reconciled.</strong> A burn that is not found or an attestation that does not match goes to <code>UNCERTAIN</code> and is not minted; it is never marked failed without evidence.</li>
</ul>
<h3>Network coverage</h3>
<p>The <code>tilcai-cctp-engine</code> lab models eight test networks. TilcAI's backend vouches for a single complete corridor, Avalanche → Stellar, which runs on testnet (Fuji) and on mainnet (C-Chain).</p>
<ul class="doc-nets" role="list">
  <li data-state="verified"><span class="doc-net-label"><img src="${networkLogos["avalanche-fuji"]}" alt="" width="30" height="30" loading="lazy" decoding="async"><span class="doc-net-name">Avalanche Fuji</span></span><span class="tag tag-available">Verified in TilcAI</span></li>
  <li data-state="verified"><span class="doc-net-label"><img src="${networkLogos["ethereum-sepolia"]}" alt="" width="30" height="30" loading="lazy" decoding="async"><span class="doc-net-name">Ethereum Sepolia</span></span><span class="tag tag-available">Verified in TilcAI</span></li>
  <li data-state="verified"><span class="doc-net-label"><img src="${networkLogos["arbitrum-sepolia"]}" alt="" width="30" height="30" loading="lazy" decoding="async"><span class="doc-net-name">Arbitrum Sepolia</span></span><span class="tag tag-available">Verified in TilcAI</span></li>
  <li data-state="verified"><span class="doc-net-label"><img src="${networkLogos["base-sepolia"]}" alt="" width="30" height="30" loading="lazy" decoding="async"><span class="doc-net-name">Base Sepolia</span></span><span class="tag tag-available">Verified in TilcAI</span></li>
  <li data-state="lab"><span class="doc-net-label"><img src="${networkLogos["arc-testnet"]}" alt="" width="30" height="30" loading="lazy" decoding="async"><span class="doc-net-name">Arc Testnet</span></span><span class="tag tag-next">Lab</span></li>
  <li data-state="lab"><span class="doc-net-label"><img src="${networkLogos["solana-devnet"]}" alt="" width="30" height="30" loading="lazy" decoding="async"><span class="doc-net-name">Solana Devnet</span></span><span class="tag tag-next">Lab</span></li>
  <li data-state="lab"><span class="doc-net-label"><img src="${networkLogos["sui-testnet"]}" alt="" width="30" height="30" loading="lazy" decoding="async"><span class="doc-net-name">Sui Testnet</span></span><span class="tag tag-next">Lab</span></li>
  <li data-state="destination"><span class="doc-net-label"><img src="${networkLogos["stellar-testnet"]}" alt="" width="30" height="30" loading="lazy" decoding="async"><span class="doc-net-name">Stellar Testnet</span></span><span class="tag tag-dest">Destination · the business's USDC</span></li>
</ul>
<p>"Lab" means code, a route matrix and contract verification; each route still lacks its end-to-end transfer and reconciliation. Circle supporting a network does not enable it in TilcAI: networks are enabled one by one, when each passes its test. CCTP moves native USDC: it does not convert bolivianos or other tokens, and someone who already holds USDC on Stellar does not need it.</p>
<h3>Mainnet</h3>
<p>Testnet and mainnet run as two instances of the same image, each with its own database, keys, port and monitoring secret. One process never serves both networks, and mainnet refuses to start with development keys, local signing or the QR simulator.</p>
<div class="table-wrap"><table>
<caption>The backend's two environments</caption>
<thead><tr><th scope="col">Aspect</th><th scope="col">Testnet</th><th scope="col">Mainnet</th></tr></thead>
<tbody>
<tr><td>Networks</td><td>Avalanche Fuji → Stellar Testnet</td><td>Avalanche C-Chain → Stellar Public Network</td></tr>
<tr><td>Own contracts</td><td>Router, vault, account factory and router v2 on Fuji; account factory and vault on Stellar Testnet</td><td>Only <code>TilcaiCctpRouter</code>, with no owner and no upgrade</td></tr>
<tr><td>Accounts, vault and x402</td><td>On</td><td>Off until their contracts are deployed and verified</td></tr>
<tr><td>Sending funds</td><td>Always, with test funds</td><td>Only when explicitly enabled; otherwise the instance quotes and reads, and creates no payments</td></tr>
</tbody></table></div>
<p>On 10 October 2026 the Avalanche → Stellar route settled two real payments of 0.01 USDC:</p>
<ul class="plain">
  <li><strong>First payment,</strong> gasless for the payer, in about 27 seconds and with a CCTP fee of 0. Burn <a href="https://snowtrace.io/tx/0x3bfdc1021f1d1277e7ae05065b157c7346a4f8e072fea4c03ab430ee0b739056" rel="noopener"><code>0x3bfdc1…739056</code></a> and mint <a href="https://stellar.expert/explorer/public/tx/cead8c23f46687dc90feba1242a20382756454366fc287f7b66b11ffe10ebbc0" rel="noopener"><code>cead8c23…0ebbc0</code></a>.</li>
  <li><strong>Second payment,</strong> against the mainnet instance and through its API, with the end-to-end test, in 1 min 45 s. Burn <a href="https://snowtrace.io/tx/0xcfb8bb2d8aa214d09d93ce6ecdb3d2a0883c7a92f8f05ad523173431051c4413" rel="noopener"><code>0xcfb8bb…1c4413</code></a> and mint <a href="https://stellar.expert/explorer/public/tx/43c32917b08c685abeca884188302531eca6a2caad63bdf9a25e81b2bd124821" rel="noopener"><code>43c32917…124821</code></a>.</li>
</ul>
<p class="callout is-note">These are two technical payments of a minimal amount, and none of TilcAI's own contracts has an independent audit. Larger amounts, concurrency and failures were not tested on mainnet. The relayer shares its signer with testnet and has no allow-list of receivers, and its webhook notices do not yet reach the mainnet instance: payments advance by polling.</p>
<p>The technical detail, payloads and error contract of the x402 rail are in the <a href="https://github.com/TilcAI/tilcai-core/blob/main/docs/payment-rail-environment.md" rel="noopener">payment rail documentation</a> of the open <code>tilcai-core</code> repository.</p>`,
    },
    {
      id: "accounts",
      title: "Accounts and funding",
      group: "payments",
      html: `
<p class="lede">The account belongs to the person or the organization; it is not a "bot's wallet". The agent is software authorized to request actions; it does not own the funds.</p>
<p class="callout is-note">Account issuance is implemented and verified on testnet: accounts with a passkey on Avalanche Fuji (with their factory and a router of TilcAI's own) and on Stellar Testnet (account factory and vault). On mainnet it is off until its contracts are deployed and verified. Still missing are delegation to agents with limits, tested recovery and an audit.</p>
<h3>Payments made by an agent or a third party</h3>
<ul class="plain">
  <li><strong>Each third party has its own key and scope.</strong> The keys TilcAI issues carry permissions (<code>payments</code>, <code>accounts:read</code>, <code>accounts:write</code>) and a daily quota. They see only their own accounts and payments, and never reach the vault, the event log or the relayer.</li>
  <li><strong>An agent's backend pays through the same API.</strong> It quotes, creates the payment with an idempotency key and TilcAI reconciles the result on the chain. The backends of Optipagos and of its agent (<code>optus-agentBE</code>) already call this API.</li>
  <li><strong>The passkey signs; the agent asks.</strong> In <code>account</code> mode the owner's passkey signs the same exact authorization and the Relayer pays the gas. The agent is software authorized to ask for actions, not the owner of the funds.</li>
  <li><strong>Delegation does not exist yet.</strong> A rule signed by the owner that lets an agent pay within a limit has base contracts but is not deployed or tested. An agent's x402 payment for an HTTP resource is still an isolated test and is off on mainnet.</li>
</ul>
<h3>Creating an account from a chat</h3>
<p>The chat only starts the process and shows states. A secure web screen, tied to a short session, is the boundary for identity, credentials and signatures.</p>
<ol class="numbered">
  <li>The channel generates a single-use link with an expiry. No seeds or keys are sent through the chat.</li>
  <li>The browser opens an HTTPS origin of TilcAI and the person creates their owner credential, preferably a passkey; otherwise a key of their own or the connection of an existing wallet.</li>
  <li>TilcAI associates the public key with the authenticated principal and requests the account with an idempotency key. Technical credentials stay on the server.</li>
  <li>The account provider computes the address and deploys the smart account; it marks it active only after checking the deployment on-chain. The Relayer pays the fee and does not become the owner.</li>
  <li>The person sees their address, the network, the asset and how to fund. Creating an account does not fund it.</li>
  <li>To buy, an exact owner approval is prepared. Later delegation is optional, limited and revocable.</li>
</ol>
<h3>How it is funded</h3>
<div class="table-wrap"><table>
<caption>Funding paths and their status</caption>
<thead><tr><th scope="col">Path</th><th scope="col">How it works</th><th scope="col">Status</th></tr></thead>
<tbody>
<tr><td>USDC on Stellar</td><td>From a compatible wallet; it is the shortest path and does not need CCTP</td><td>Depends on verifying the direct rail with USDC</td></tr>
<tr><td>USDC from another network</td><td>With CCTP, over an enabled route</td><td>Avalanche Fuji, Ethereum Sepolia, Arbitrum Sepolia and Base Sepolia to Stellar Testnet are verified</td></tr>
<tr><td>Bolivianos</td><td>A fiat on-ramp provider that quotes, confirms the deposit and delivers USDC</td><td>No verified provider or corridor; the QR payment that exists today is a mock, with no bank</td></tr>
</tbody></table></div>
<p>TilcAI does not credit a balance from a captured QR or an unauthenticated notice: a deposit is credited only on verifiable confirmation from the provider.</p>
<h3>Recovery</h3>
<p>Losing the phone, changing the WhatsApp number and recovering an account are different problems. A chat number identifies a conversation; it does not prove ownership of funds by itself, and nobody should be able to reassign an account because they control that number. The recovery design must be reviewed before real funds are used.</p>`,
    },
    {
      id: "monitoring",
      title: "Monitoring: from the backend to the dashboard",
      group: "payments",
      html: `
<p class="lede">What happens in the backend is recorded as events with an order that only grows, reaches the site signed and is interpreted in Spanish and English. Watching cannot break what is watched.</p>
<ul class="plain">
  <li><strong>The backend is the source of truth.</strong> It records each event with a position that only grows; the site keeps a recent copy and nothing more.</li>
  <li><strong>The backend pushes.</strong> It can live behind a private network, so it is the one that starts the connection, with a signed delivery.</li>
  <li><strong>At least once and in order.</strong> If the site was down, it receives what it missed afterwards; repeats are discarded by identifier.</li>
  <li><strong>Monitoring does not break what is monitored.</strong> Emitting an event never fails and never waits on the network.</li>
</ul>
<div class="table-wrap"><table>
<caption>What is recorded, under the <code>tilcai-monitor-v1</code> contract</caption>
<thead><tr><th scope="col">Source</th><th scope="col">Events</th><th scope="col">What it is for</th></tr></thead>
<tbody>
<tr><td>Cross-network payments</td><td>Creation, every state change and uncertain payments</td><td>Follow a payment from the burn to settlement</td></tr>
<tr><td>Disbursement vault</td><td>Transitions, uncertain ones and rejections for budget, pause or limit</td><td>See each disbursement and why one was rejected</td></tr>
<tr><td>Relayer notices</td><td>Changes in transaction state and in the relayer itself</td><td>Compare what the relayer reports with what TilcAI reconciles</td></tr>
<tr><td>QR payment (mock)</td><td>Issue, simulated payment, expiry and delivered notice</td><td>Rehearse the journey without a bank or money</td></tr>
<tr><td>Resources and alerts</td><td>A resource snapshot every 30 seconds; alerts that are raised and cleared</td><td>Know whether the system is healthy</td></tr>
<tr><td>API</td><td>5xx responses, grouped per minute</td><td>Detect service failures</td></tr>
</tbody></table></div>
<p>Notices are for seeing, not for deciding: a payment or a disbursement is only considered settled when TilcAI checked the chain itself.</p>
<h3>Channel security</h3>
<ul class="plain">
  <li><strong>One secret per direction.</strong> One protects writes (backend to site) and another reads (person to site). Neither reaches the browser.</li>
  <li><strong>A delivery expires.</strong> The signature covers the time, and the site rejects anything older than five minutes.</li>
  <li><strong>No secrets in events.</strong> They do carry public addresses, balances, amounts and hashes, which is why reading requires a credential.</li>
  <li><strong>The browser never talks to the backend</strong> nor knows its address.</li>
</ul>
<p class="callout is-note">The full path is implemented and verified against testnet services. The <code>/en/monitor</code> view shows one block per backend, mainnet first and labelled as real funds, and each environment delivers its signed events with its own secret: one cannot report as the other. Still missing are a durable store on the site (today it is memory and does not work with several instances) and the mainnet relayer's notices reaching TilcAI.</p>`,
    },
    {
      id: "limits",
      title: "Security model and known limits",
      group: "reference",
      html: `
<ul class="plain">
  <li><strong>The model proposes; rules decide.</strong> Model output is never trusted for price, recipient or approval. An unverifiable condition blocks the operation or asks for human review.</li>
  <li><strong>The signer is a separate boundary.</strong> Keys stay away from the model and from business data. This website stores no private keys, financial tokens or spending mandates.</li>
  <li><strong>Facilitator and Relayer dependency.</strong> Settlement relies on an x402 facilitator and an OpenZeppelin Relayer. If they are unavailable, payments stop.</li>
  <li><strong>Limited mainnet.</strong> Testnet and mainnet are two separate instances, and one process never serves both. On mainnet only the cross-network payment router exists, tested with two 0.01 USDC payments; accounts, vault and x402 stay off there. Testnet has no real funds.</li>
  <li><strong>A lab is not a product.</strong> Eight modeled networks are not eight commercial corridors: today four are verified.</li>
  <li><strong>Not audited.</strong> Nothing described here has been audited.</li>
</ul>
<p>Out of scope for now: an agent marketplace, trading or DeFi, wrapped-asset bridges between chains (paying across networks with CCTP, which retires and issues native USDC, is planned and today Avalanche Fuji, Ethereum Sepolia, Arbitrum Sepolia and Base Sepolia to Stellar are verified), free-form price negotiation, purchases from any business without an adapter, regulated services, converting bolivianos without a verified provider and unlimited agent autonomy.</p>`,
    },
    {
      id: "extensions",
      title: "Planned extensions",
      group: "reference",
      html: `
<p>These are planned, not active. They are added behind the same operations and states.</p>
<ul class="checklist">
  <li><span class="tag tag-next">Planned extension</span> <strong>A2A.</strong> A standard for agent-to-agent communication, with capabilities described by Agent Cards. It would connect a buyer's request to a business agent's capabilities. It does not replace inventory, a mandate or a financial signature. The first flow can run on MCP and a commercial API.</li>
  <li><span class="tag tag-next">Planned extension</span> <strong>ERC-8004.</strong> A draft standard for identity, reputation and validation registries on Ethereum/EVM. It is not a native Stellar contract and does not guarantee trust. TilcAI plans a native operational identity on Stellar and, separately, an adapter to resolve an EVM registry. Reading an EVM identity never moves funds between networks or builds a bridge.</li>
  <li><span class="tag tag-next">Next steps</span> <strong>Smart accounts, shared budget and scheduled tasks.</strong> See the <a href="/en/roadmap">build status</a>.</li>
</ul>`,
    },
    {
      id: "glossary",
      title: "Glossary",
      group: "reference",
      html: `
<dl class="glossary">
  <dt>Principal</dt><dd>The person or organization that owns the funds and grants authority.</dd>
  <dt>Mandate</dt><dd>Authority delegated to an agent, with scope, limits, period and revocation.</dd>
  <dt>Quote</dt><dd>Exact commercial terms from a business: service, price, asset, network, recipient and expiry.</dd>
  <dt>Intent</dt><dd>The purchase a person wants to make, bound to a quote and immutable once created.</dd>
  <dt>Order</dt><dd>The commercial operation linking principal, business and quote, with its own states.</dd>
  <dt>MCP</dt><dd>Model Context Protocol: the tool interface for compatible assistants.</dd>
  <dt>A2A</dt><dd>A standard for agent-to-agent communication. It is a planned extension, not a requirement of the first flow.</dd>
  <dt>x402</dt><dd>An HTTP payment protocol: a server answers <code>402 Payment Required</code> with payment terms and the client pays to obtain the resource.</dd>
  <dt>Facilitator</dt><dd>The component that verifies and submits an x402 payment. Here, a plugin running in an OpenZeppelin Relayer.</dd>
  <dt>OpenZeppelin Relayer</dt><dd>A service that sends transactions with the networks, signers and policies configured on it. It can pay the network fee without becoming the owner of the funds.</dd>
  <dt>CCTP</dt><dd>Circle's protocol that moves native USDC between networks: it burns it at the source, waits for an attestation and mints it at the destination.</dd>
  <dt>Attestation</dt><dd>Circle's signature (the Iris service) proving the burn happened and allowing the mint at the destination.</dd>
  <dt>Soroban</dt><dd>Stellar's smart contract platform.</dd>
  <dt>Smart account</dt><dd>A programmable account whose rules, signers and limits are defined by a contract.</dd>
  <dt>Idempotency</dt><dd>Repeating an operation with the same key yields the same result and does not run it twice.</dd>
  <dt>Tenant</dt><dd>The isolated space of a business or integrator, with its identity, quotas and roles.</dd>
  <dt>Vault</dt><dd>A TilcAI contract on Avalanche Fuji that executes disbursements subject to a budget, a per-payment limit and a pause. It is not yet deployed on mainnet.</dd>
  <dt>Reconciliation</dt><dd>Establishing the real result of a payment attempt, including when a call failed midway.</dd>
  <dt>Reason code</dt><dd>A machine-readable explanation of a decision.</dd>
</dl>`,
    },
    {
      id: "sources",
      title: "Sources and updates",
      group: "reference",
      html: `
<p class="lede">This page summarizes the team's official context, cut from 8 to 10 October 2026, and the code of the repositories. The code and its tests determine what is implemented; a testnet run proves the route that was reproduced, not every planned route.</p>
<div class="table-wrap"><table>
<caption>Where each claim comes from</caption>
<thead><tr><th scope="col">Repository</th><th scope="col">What it holds</th></tr></thead>
<tbody>
<tr><td><code>tilcai-core</code></td><td>Shared contracts, MCP tools, the policy evaluator and the reproducible x402 rail guide</td></tr>
<tr><td><code>tilcai-mcp</code></td><td>The MCP server published on npm: cross-network USDC payment tools on top of TilcAI's API</td></tr>
<tr><td><code>tilcai-infrastructure</code></td><td>The backend: cross-network payments API and worker, vault, monitoring and contracts</td></tr>
<tr><td><code>tilcai-cctp-engine</code></td><td>The eight-network lab: route matrix, contract verification and test transfers</td></tr>
<tr><td><code>tilcai-web</code></td><td>This site, its simulations and the monitoring view</td></tr>
</tbody></table></div>
<ul class="plain">
  <li>From the open <code>tilcai-core</code> repository: <a href="https://github.com/TilcAI/tilcai-core/blob/main/docs/shared-contracts.md" rel="noopener">shared contracts</a>, <a href="https://github.com/TilcAI/tilcai-core/blob/main/docs/mcp-intent-mandate.md" rel="noopener">MCP tools, intent and mandate</a>, <a href="https://github.com/TilcAI/tilcai-core/blob/main/docs/payment-rail-environment.md" rel="noopener">payment rail on testnet</a> and <a href="https://github.com/TilcAI/tilcai-core/blob/main/docs/payment-rail-reproducibility.md" rel="noopener">rail reproducibility</a>.</li>
  <li>Published package: <a href="https://www.npmjs.com/package/tilcai-mcp" rel="noopener"><code>tilcai-mcp</code> on npm</a>.</li>
  <li>External references: <a href="https://docs.openzeppelin.com/relayer/quickstart" rel="noopener">OpenZeppelin Relayer</a>, <a href="https://docs.openzeppelin.com/stellar-contracts/accounts/smart-account" rel="noopener">smart accounts on Stellar</a>, <a href="https://developers.circle.com/cctp/concepts/supported-chains-and-domains" rel="noopener">CCTP networks and domains</a> and <a href="https://modelcontextprotocol.io/specification/latest/server/tools" rel="noopener">MCP tools</a>.</li>
</ul>`,
    },
  ],
};
