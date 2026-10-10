import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { narrative } from "../src/lib/i18n/narrative.ts";
import { FAQ_IDS, ROADMAP_IDS } from "../src/lib/i18n/types.ts";
import {
  destinationNetwork, evidenceDate, evidencePayments, originNetworks, shortHash, snowtraceTx, stellarExpertTx,
} from "../src/lib/content/rails.ts";
import { roadmapEntries, roadmapStages } from "../src/lib/content/roadmap.ts";

const es = narrative("es");
const en = narrative("en");

/** Same keys, same array lengths, no empty text: so a view never mixes languages or shows a hole. */
function shape(value: unknown, path = "narrative"): string[] {
  if (typeof value === "string") return value.trim() === "" ? [`${path}: empty text`] : [];
  if (Array.isArray(value)) return value.flatMap((item, i) => shape(item, `${path}[${i}]`));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => shape(v, `${path}.${k}`));
  return [`${path}: not text, list or object`];
}
function sameStructure(a: unknown, b: unknown, path = "narrative"): string[] {
  if (typeof a === "string" || typeof b === "string") return typeof a === typeof b ? [] : [`${path}: type differs`];
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return [`${path}: list length differs`];
    return a.flatMap((item, i) => sameStructure(item, b[i], `${path}[${i}]`));
  }
  const ka = Object.keys(a as object).sort();
  const kb = Object.keys(b as object).sort();
  if (ka.join() !== kb.join()) return [`${path}: keys differ (${ka.join()} vs ${kb.join()})`];
  return ka.flatMap((k) => sameStructure((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], `${path}.${k}`));
}
const allText = (value: unknown): string[] =>
  typeof value === "string" ? [value] : Array.isArray(value) ? value.flatMap(allText) : value && typeof value === "object" ? Object.values(value).flatMap(allText) : [];

test("both languages tell the lower half of the landing with the same structure and no empty text", () => {
  assert.deepEqual(shape(es), []);
  assert.deepEqual(shape(en), []);
  assert.deepEqual(sameStructure(es, en), []);
});

test("the story has the shape the documentation asks for", () => {
  for (const c of [es, en]) {
    assert.equal(c.business.paths.items.length, 4, "four ways to connect a business");
    assert.deepEqual(c.business.paths.items.map((p) => p.key), ["A", "B", "C", "D"]);
    assert.equal(c.flow.steps.length, 6, "request, offer, rules, approval, payment, two receipts");
    for (const step of c.flow.steps) assert.ok(step.actor && step.state && step.lines.length === 3, step.title);
    assert.equal(c.rails.routes.length, 2, "two alternative routes");
    assert.equal(c.rails.pipelineSteps.length, 3, "burn, attestation, mint");
    assert.equal(c.entrances.items.length, 3, "WhatsApp, MCP, API");
    assert.equal(c.evidence.rows.length, evidencePayments.length);
  }
  assert.deepEqual(es.flow.steps.map((s) => s.title), ["Pedido", "Oferta", "Reglas", "Aprobación", "Pago", "Dos recibos"]);
});

test("the payment is never presented as the delivery, and an allow is never presented as a payment", () => {
  for (const c of [es, en]) {
    const last = c.flow.steps[5]!;
    assert.match(last.detail, /(entregado|delivered)/i, "the last step separates paid from delivered");
    assert.match(c.flow.steps[2]!.detail, /(no firma ni paga|neither signs nor pays)/i);
  }
});

// ── Networks: only Fuji is verified; the rest are lab ─────────────────────────────────────────────────

test("exactly one network is verified end to end (Fuji); the others are lab, and Stellar is the destination", () => {
  assert.deepEqual(originNetworks.filter((n) => n.status === "verified").map((n) => n.id), ["avalanche-fuji"]);
  assert.equal(originNetworks.length, 7, "Fuji plus six lab networks");
  assert.equal(new Set(originNetworks.map((n) => n.id)).size, originNetworks.length);
  assert.ok(originNetworks.every((n) => n.status === "verified" || n.status === "lab"));
  assert.equal(destinationNetwork.id, "stellar-testnet");
  for (const c of [es, en]) assert.match(c.rails.mapLead, /Fuji/, "the lead says which one is verified");
});

test("the rails copy never promises any token, any network or a currency conversion", () => {
  const forbidden = [/\bmainnet\b/i, /\bproducci[oó]n\b/i, /\bproduction\b/i, /\bgarantiz/i, /\bguarantee/i];
  for (const c of [es, en]) {
    const text = allText(c);
    for (const re of forbidden) assert.ok(!text.some((t) => re.test(t)), `forbidden claim ${re}`);
    // "cualquier"/"any" may only appear to deny it.
    for (const t of c.rails.limits.items) assert.ok(!/(^|\s)(paga|pay|works|funciona)\b.*\b(cualquier|any)\b/i.test(t), t);
  }
  assert.match(es.rails.limits.items.join(" "), /bolivianos/);
  assert.match(en.rails.limits.items.join(" "), /bolivianos/);
});

test("no adoption numbers are claimed anywhere in the lower half", () => {
  const adoption = /\b\d[\d.,]*\s*(negocios|empresas|usuarios|clientes|businesses|companies|users|customers)\b/i;
  for (const c of [es, en]) assert.ok(!allText(c).some((t) => adoption.test(t)), "an adoption figure appeared");
});

// ── Evidence: real, checkable, and labelled as technical ──────────────────────────────────────────────

test("the evidence rows are real transaction hashes with working explorer links", () => {
  assert.equal(evidencePayments.length, 2);
  assert.equal(new Set(evidencePayments.flatMap((p) => [p.burnTxHash, p.mintTxHash])).size, 4, "four distinct hashes");
  for (const p of evidencePayments) {
    assert.match(p.burnTxHash, /^0x[0-9a-f]{64}$/);
    assert.match(p.mintTxHash, /^[0-9a-f]{64}$/);
    assert.equal(snowtraceTx(p.burnTxHash), `https://testnet.snowtrace.io/tx/${p.burnTxHash}`);
    assert.equal(stellarExpertTx(p.mintTxHash), `https://stellar.expert/explorer/testnet/tx/${p.mintTxHash}`);
    assert.ok(shortHash(p.burnTxHash).length < p.burnTxHash.length);
  }
  assert.match(evidenceDate, /^\d{4}-\d{2}-\d{2}$/);
});

test("the evidence lead identifies test payments rather than commercial orders, in both languages", () => {
  assert.match(es.evidence.lead, /no son órdenes comerciales/);
  assert.match(en.evidence.lead, /not commercial orders/);
  assert.match(es.flow.label, /ilustrativo/);
  assert.match(en.flow.label, /llustrative/i);
});

// ── Progress ──────────────────────────────────────────────────────────────────────────────────────────

test("every roadmap item appears exactly once, in a known stage, and nothing claims production", () => {
  const ids = roadmapEntries.map((e) => e.id).sort();
  assert.deepEqual(ids, [...ROADMAP_IDS].sort());
  assert.equal(new Set(ids).size, ids.length);
  for (const e of roadmapEntries) {
    assert.ok(roadmapStages.includes(e.stage), e.id);
    assert.ok(e.environment === undefined || e.environment === "simulation" || e.environment === "testnet", `${e.id} claims an environment it cannot have`);
  }
});

test("only the verified testnet items carry the testnet label, and nothing in 'next' has an environment", () => {
  const testnet = roadmapEntries.filter((e) => e.environment === "testnet").map((e) => e.id).sort();
  assert.deepEqual(testnet, ["cctp", "rail"], "promoting an item to testnet needs evidence and a change here");
  assert.ok(roadmapEntries.filter((e) => e.stage === "next").every((e) => e.environment === undefined));
  assert.equal(roadmapEntries.find((e) => e.id === "cctp")?.stage, "available");
  assert.equal(roadmapEntries.find((e) => e.id === "fiat")?.maintainer, undefined, "no owner is invented for what nobody has been assigned");
});

// ── Dictionaries (es.ts / en.ts cannot be imported by this runner: read them) ─────────────────────────

for (const locale of ["es", "en"] as const) {
  const source = readFileSync(new URL(`../src/lib/i18n/${locale}.ts`, import.meta.url), "utf8");
  test(`${locale}.ts answers every FAQ question, describes every roadmap item and names every route`, () => {
    for (const id of FAQ_IDS) assert.match(source, new RegExp(`\\b${id}: \\{ question:`), `faq ${id}`);
    for (const id of ROADMAP_IDS) assert.match(source, new RegExp(`\\b${id}: \\{ title:`), `roadmap ${id}`);
    assert.match(source, /rails: "/, "nav.rails");
    assert.match(source, /metrics: \{ title:/, "roadmap.metrics");
    assert.match(source, /name: "CCTP"/, "CCTP is part of the technology list");
  });
}

// ── "Crosschain" explained in plain words ────────────────────────────────────────────────────────────

test("paying across networks is defined in both languages, names the term, and says it is not a swap or a wrapped token", () => {
  for (const c of [es, en]) assert.equal(c.rails.explainer.term, "crosschain");
  assert.match(es.rails.explainer.body, /no es un cambio de moneda/i);
  assert.match(en.rails.explainer.body, /not a currency swap/i);
  assert.match(es.rails.explainer.body, /nativo/);
  assert.match(en.rails.explainer.body, /native Circle USDC/);
  for (const c of [es, en]) assert.match(c.rails.routes[1]!.tag, /crosschain/, "the term is on the route itself");
});

test("each step of the route says what happens in plain words and keeps the technical term beside it", () => {
  for (const c of [es, en]) {
    assert.deepEqual(c.rails.pipelineSteps.map((s) => s.term.length > 0 && s.plain.length > s.term.length), [true, true, true]);
    assert.deepEqual(c.rails.pipelineSteps.map((s) => s.term), c === es ? ["burn", "atestación", "mint"] : ["burn", "attestation", "mint"]);
  }
});

for (const locale of ["es", "en"] as const) {
  test(`the architecture page (${locale}) no longer rules out the CCTP route by calling every cross-chain move a bridge`, () => {
    const docs = readFileSync(new URL(`../src/lib/i18n/docs.${locale}.ts`, import.meta.url), "utf8");
    const outOfScope = docs.split("\n").find((l) => /(Fuera del alcance por ahora|Out of scope for now)/.test(l)) ?? "";
    assert.ok(outOfScope, "the out-of-scope sentence exists");
    assert.match(outOfScope, locale === "es" ? /puentes de activos envueltos/ : /wrapped-asset bridges/);
    assert.match(outOfScope, /CCTP/, "it says the CCTP route is planned");
    assert.match(outOfScope, /Fuji/, "and that only Fuji is verified");
    assert.ok(!/bridges entre cadenas|cross-chain bridges/.test(outOfScope), "the blanket claim is gone");
  });
}

// ── "Cuatro caminos": the routes are an SVG built from the page, and its illustrations exist ─────────────────

const pathsSource = readFileSync(new URL("../src/components/sections/ConnectionPaths.tsx", import.meta.url), "utf8");

test("four ways to connect: every illustration the section names exists on disk, with real transparency", () => {
  const files = [...pathsSource.matchAll(/file: "(cam-img\d+\.png)"/g)].map((m) => m[1]);
  assert.equal(new Set(files).size, 8, "node, four cards, two notes and the dust");
  const dir = new URL("../public/assets/img/caminos conect/", import.meta.url);
  for (const name of files) {
    const bytes = readFileSync(new URL(name, dir));
    assert.equal(bytes.subarray(1, 4).toString(), "PNG", name);
    assert.equal(bytes[25], 6, `${name} must be RGBA so no black box sits behind it`);
  }
});

test("four ways to connect: routes follow the DOM instead of fixed coordinates, and a reduced-motion path exists", () => {
  assert.match(pathsSource, /getBoundingClientRect/, "endpoints are read from the ports");
  assert.match(pathsSource, /new ResizeObserver/, "routes are rebuilt when the scene changes size");
  assert.match(pathsSource, /prefers-reduced-motion: reduce/, "a branch with everything drawn and nothing moving");
  assert.ok(!/viewBox="0 0 1[0-9]{3}/.test(pathsSource), "no 1920-wide viewBox baked in");
  assert.equal((pathsSource.match(/FLOW_SECONDS = \[/g) ?? []).length, 1);
});

test("four ways to connect: the notes around the node are real text in both languages", () => {
  for (const c of [es, en]) {
    for (const key of ["connected", "identity", "data"] as const) assert.ok(c.business.paths.hud[key].length > 8, key);
    assert.ok(c.business.paths.node.length > 8);
  }
  assert.notEqual(es.business.paths.hud.identity, en.business.paths.hud.identity);
});
