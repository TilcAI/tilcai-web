import type { Copy } from "./types";
import { sig } from "../highlight";

const contractSurface = sig(`init(principal, guardian, asset)        // USDC via SEP-41
deposit(from, amount)                   // funds the root budget
create_mandate(parent, agent, wallet, cap, period, expires) -> id
                                        // requires cap <= parent's available
top_up(mandate_id, amount)              // pays the operating wallet only if it fits
                                        // this mandate and every ancestor
pause(mandate_id) / revoke(mandate_id)  // guardian or principal; inherited by children
remaining(mandate_id) -> i128`);

const gatewayModel = sig(`PaymentIntent  { resource, providerId, network, asset, amount,
                 payTo, scheme, expiresAt, intentHash }
PolicyEngine.evaluate(intent, mandate)
               -> { decision, reasonCodes[], policyHash }
RailAdapter    // supports, sign, settle, reconcile
  StellarExactAdapter     // the only adapter being built
SignerProvider
  ClassicKeypairSigner    // small operating wallet`);

export const docsEn: Copy["docs"] = {
  status: "Proposed architecture · in development · subject to change",
  title: "How TilcAI is meant to work",
  lead:
    "This page describes the proposed design of TilcAI. It is a design document for builders and reviewers — not documentation of a public API, and not a description of running software.",
  tocTitle: "On this page",
  backHome: "Back to overview",
  sections: [
    {
      id: "status",
      title: "Status and scope",
      html: `
<p>TilcAI is being designed and built. At the time of writing there is <strong>no deployed contract, no published package and no live service</strong>. Everything below is a plan, and names may change.</p>
<ul class="checklist">
  <li><span class="tag tag-elite">Stellar Elite</span> Buyer base: budget tree, policy gateway, receipts, trust signals v0.</li>
  <li><span class="tag tag-meridian">HackMeridian</span> Seller extension: signed offers verified by the buyer.</li>
  <li><span class="tag tag-vision">Vision</span> Agent-to-business commerce. Not scheduled.</li>
</ul>
<p>The MVP targets exactly one combination: <code>stellar:testnet</code>, USDC and the x402 <code>exact</code> scheme. Anything else is refused.</p>`,
    },
    {
      id: "overview",
      title: "Overview",
      html: `
<p>Five pieces work together. The agent never holds a key that can move the treasury.</p>
<ol class="numbered">
  <li><strong>Budget tree</strong> — a Soroban contract holding the principal's root budget and sub-mandates.</li>
  <li><strong>Policy gateway</strong> — turns a <code>402</code> challenge into a payment intent and returns <code>ALLOW</code>, <code>DENY</code> or <code>REQUIRE_HUMAN</code>.</li>
  <li><strong>Decision receipt</strong> — a signed record of every decision, including refusals.</li>
  <li><strong>Trust signals v0</strong> — a signed provider profile, receipt-bound feedback and a narrow validation.</li>
  <li><strong>Principal view</strong> — a minimal page to see the tree, decisions and signals, and to pause.</li>
</ol>
<div class="diagram" role="img" aria-label="Principal funds the budget tree. The tree tops up a small operating wallet. The agent asks the gateway, which pays through x402 on Stellar only when policy allows, and writes a receipt either way.">
  <div class="d-row"><span class="d-node">Principal</span><span class="d-arrow">funds →</span><span class="d-node d-accent">Budget tree · Soroban</span><span class="d-arrow">tops up →</span><span class="d-node">Operating wallet</span></div>
  <div class="d-row"><span class="d-node">Agent</span><span class="d-arrow">asks →</span><span class="d-node d-accent">Policy gateway</span><span class="d-arrow">ALLOW →</span><span class="d-node">x402 · USDC · Stellar</span><span class="d-arrow">→</span><span class="d-node">Receipt</span></div>
</div>`,
    },
    {
      id: "budget-tree",
      title: "Shared budget tree (Soroban)",
      html: `
<p>The principal deposits USDC into a contract and creates mandates for agents and sub-agents. The rule that matters: <strong>a child can never exceed what its parent still has</strong>, and every spend is debited from all ancestors.</p>
<p class="label">Proposed contract surface — not deployed</p>
<pre class="code"><code>${contractSurface}</code></pre>
<p>Planned contract tests: child above parent, top-up above cap, period reset, expired mandate, inherited pause, revocation and wrong authorisation.</p>`,
    },
    {
      id: "operating-wallet",
      title: "Why a small operating wallet",
      html: `
<p>Ideally an agent would pay directly from a smart account with on-chain limits. At the time of design, the official x402 client for Stellar only signs with classic accounts, and the official facilitator rejects payments whose policy contracts emit extra events (<a href="https://github.com/x402-foundation/x402/issues/3158" rel="noopener">issue #3158</a>, <a href="https://github.com/x402-foundation/x402/issues/3352" rel="noopener">issue #3352</a>).</p>
<p>So the MVP uses a classic <code>G…</code> wallet with a very small balance per agent, refilled only by the budget contract. If the agent or the gateway is compromised, the designed maximum loss is that balance plus what remains in its sub-mandate. Paying directly from a smart account is a later option, behind the same interfaces.</p>`,
    },
    {
      id: "gateway",
      title: "Policy gateway",
      html: `
<p>The agent requests a resource. The gateway reads the <code>402</code> challenge, normalises it and evaluates rules. The language model proposes; the rule engine decides.</p>
<pre class="code"><code>${gatewayModel}</code></pre>
<div class="table-wrap"><table>
<caption>Proposed rules — all fail-closed</caption>
<thead><tr><th scope="col">Rule</th><th scope="col">Reason code when it fails</th></tr></thead>
<tbody>
<tr><td>Network, scheme and asset are the allowed ones</td><td><code>NETWORK_NOT_ALLOWED</code> · <code>SCHEME_NOT_ALLOWED</code> · <code>ASSET_NOT_ALLOWED</code></td></tr>
<tr><td>Provider and recipient are allowed for this agent</td><td><code>PAYEE_NOT_ALLOWED</code></td></tr>
<tr><td>Service or resource is allowed</td><td><code>SERVICE_NOT_ALLOWED</code></td></tr>
<tr><td>Amount within per-payment cap</td><td><code>PER_PAYMENT_LIMIT_EXCEEDED</code></td></tr>
<tr><td>Amount within remaining sub-mandate</td><td><code>BUDGET_EXCEEDED</code></td></tr>
<tr><td>Same intent not paid before</td><td><code>DUPLICATE_PAYMENT_INTENT</code></td></tr>
<tr><td>Mandate active, not paused or expired</td><td><code>MANDATE_PAUSED</code> · <code>MANDATE_EXPIRED</code></td></tr>
<tr><td>Amount above human threshold</td><td><code>REQUIRE_HUMAN</code></td></tr>
</tbody></table></div>
<p>The agent-facing tool fetches a URL and pays only if the rules allow it. It does not offer a generic “send money to an address” capability.</p>`,
    },
    {
      id: "receipts",
      title: "Decision receipts",
      html: `
<p>Each decision produces a signed receipt: intent hash, mandate, provider, resource, decision, reason codes, policy hash, and — when a payment happened — network, asset, amount and transaction hash, plus a hash of the response.</p>
<p>A payment proves that value moved. It does not prove the service was good. Receipts keep authorisation, payment, delivery and later signals separate. Batch anchoring of receipt hashes on Stellar is optional for the MVP.</p>`,
    },
    {
      id: "trust-signals",
      title: "Trust signals v0",
      html: `
<p>Inspired by the identity, reputation and validation concepts of <a href="https://eips.ethereum.org/EIPS/eip-8004" rel="noopener">ERC-8004</a> (a draft Ethereum standard). This is <strong>not</strong> an implementation of its registries on Stellar. Each signal is deliberately narrow.</p>
<div class="table-wrap"><table>
<thead><tr><th scope="col">Signal</th><th scope="col">Minimal version</th><th scope="col">What it does not prove</th></tr></thead>
<tbody>
<tr><td>Identity</td><td>Signed provider profile binding a Stellar key, HTTPS endpoint and recipient. Checked before paying; the policy pins which key and origin are accepted.</td><td>Legal identity, KYC or global uniqueness.</td></tr>
<tr><td>Reputation</td><td>Feedback signed by a buyer and bound to a paid, delivered receipt. One entry per receipt. Shown as history, not a score.</td><td>That a review is true, impartial or Sybil-proof.</td></tr>
<tr><td>Validation</td><td>Attestation by a key different from the seller's that the response has the expected format and a recent <code>asOf</code>.</td><td>That the content is correct, or that the validator is independent. If the team runs the validator for the demo, it will say so.</td></tr>
</tbody></table></div>`,
    },
    {
      id: "signed-offers",
      title: "Signed offers (planned for HackMeridian)",
      html: `
<p>The provider profile answers <em>who</em> gets paid. A signed offer answers <em>what</em> is sold, <em>for how much</em> and <em>until when</em>. A small seller kit would publish the offer; the buyer's gateway would verify it before paying.</p>
<p>The buyer accepts an offer only when:</p>
<ol class="numbered">
  <li>the signing key was already trusted by the principal and bound to the seller's profile — never taken from the offer itself;</li>
  <li>service, network, asset, amount and recipient match the <code>402</code> challenge exactly, and the offer has not expired;</li>
  <li>the spending policy and the shared budget still allow the payment.</li>
</ol>
<p class="callout">A signature protects against terms being changed after signing. It does not protect against a compromised key, a phishing origin or a misconfigured policy. Key rotation, revocation and an interoperable registry come later.</p>`,
    },
    {
      id: "limits",
      title: "Security model and known limits",
      html: `
<ul class="plain">
  <li><strong>Custody.</strong> The gateway holds only the key of a small operating wallet; it cannot move the treasury.</li>
  <li><strong>Facilitator dependency.</strong> Settlement relies on an external x402 facilitator on testnet. If it is unavailable, payments stop; decisions and receipts still work.</li>
  <li><strong>Deterministic decisions.</strong> Model output is never trusted for price, recipient or approval.</li>
  <li><strong>Testing.</strong> The plan includes adversarial cases: altered amount or recipient, repeated intent, expired or paused mandate, over-budget child.</li>
  <li><strong>Not audited.</strong> Nothing here has been audited. Nothing will run with real funds as part of this MVP.</li>
</ul>`,
    },
    {
      id: "out-of-scope",
      title: "Out of scope for now",
      html: `
<ul class="plain two-col">
  <li>Mainnet and real funds</li>
  <li>Our own x402 facilitator</li>
  <li>Other blockchains (interfaces only)</li>
  <li>Bridges or cross-chain transfers</li>
  <li>Fiat on/off-ramps and KYC</li>
  <li>Credit lines</li>
  <li>Tokens of our own</li>
  <li>Universal reputation scores</li>
  <li>Real bookings, inventory or refunds</li>
  <li>Full ERC-8004 registries</li>
</ul>`,
    },
    {
      id: "glossary",
      title: "Glossary",
      html: `
<dl class="glossary">
  <dt>Principal</dt><dd>The person or organisation that owns the funds and defines the rules.</dd>
  <dt>Mandate</dt><dd>A budget with limits delegated to one agent, as a node of the budget tree.</dd>
  <dt>x402</dt><dd>An HTTP payment protocol: a server answers <code>402 Payment Required</code> with payment terms, and the client pays to get the resource.</dd>
  <dt>Soroban</dt><dd>Stellar's smart contract platform.</dd>
  <dt>SEP-41</dt><dd>Stellar's token interface standard, used by USDC.</dd>
  <dt>Reason code</dt><dd>A machine-readable explanation of a decision, such as <code>BUDGET_EXCEEDED</code>.</dd>
</dl>`,
    },
  ],
};
