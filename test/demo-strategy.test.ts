import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { strategy } from "../src/lib/content/strategy.ts";

const root = new URL("../", import.meta.url);

/** Every string the page shows, with its path, so a failure names the exact field. */
function strings(value: unknown, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k));
  return [];
}

/** Same keys and same list lengths in both languages, ignoring the text itself. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)]));
  return typeof value;
}

// /demo is a public page: its copy is written as firm statements. These words belong to internal
// working documents and must never reach it (see docs/demo-strategy.md).
const FORBIDDEN = [
  /preliminar/i, /hip[oó]tesis/i, /hipot[eé]tic/i, /borrador/i, /ficticio/i, /\bfals[oa]s?\b/i, /sin (verificar|comprobar|comprobación|validar)/i,
  /no verificad/i, /por (confirmar|validar|definir)/i, /pendiente/i, /ilustrativ/i, /provisional/i, /tentativ/i, /estimad[oa]/i, /de relleno/i,
  /preliminary/i, /hypothes/i, /\bdraft/i, /\bfake\b/i, /fictional/i, /unverified/i, /not verified/i, /to be (confirmed|defined)/i, /\btbd\b/i,
  /placeholder/i, /illustrative/i, /tentative/i, /\bpending\b/i, /\bmock/i, /dummy/i, /\[\[/,
];

test("the /demo strategy copy never uses draft, placeholder or unverified wording", () => {
  for (const locale of ["es", "en"] as const) {
    for (const [path, text] of strings(strategy[locale])) {
      for (const word of FORBIDDEN) assert.doesNotMatch(text, word, `${locale}.${path}: «${text}»`);
    }
  }
});

test("both languages carry the same structure", () => {
  assert.deepEqual(shape(strategy.en), shape(strategy.es));
});

test("every figure on the page cites an external source over https", () => {
  for (const locale of ["es", "en"] as const) {
    const { stats, infra } = strategy[locale].business.signals;
    for (const item of [...stats, ...infra]) assert.match(item.source.href, /^https:\/\//, `${locale}: ${item.source.label}`);
  }
});

test("the sprint covers days 1–30 without gaps and only names existing deliverables", () => {
  for (const locale of ["es", "en"] as const) {
    const { sprint, deliverables } = strategy[locale].roadmap;
    const ids = new Set(deliverables.items.map((d) => d.id));
    let day = 1;
    for (const p of sprint.periods) {
      assert.equal(p.from, day, `${locale}: ${p.label} starts on day ${day}`);
      assert.ok(p.to >= p.from);
      day = p.to + 1;
      for (const d of p.deliverables) assert.ok(ids.has(d), `${locale}: ${p.label} → ${d}`);
    }
    assert.equal(day, 31, `${locale}: the sprint ends on day 30`);
    for (const d of deliverables.items) for (const dep of d.dependsOn) assert.ok(ids.has(dep));
  }
});

test("the demo page mounts the three sections and the in-page nav points at them", () => {
  const page = readFileSync(new URL("src/app/[lang]/demo/page.tsx", root), "utf8");
  for (const name of ["DemoNav", "BusinessModel", "GoToMarket", "StrategyRoadmap"]) assert.match(page, new RegExp(`<${name}\\b`));
  assert.match(page, /id="video"/);
  const sources = ["BusinessModel", "GoToMarket", "StrategyRoadmap"].map((f) => readFileSync(new URL(`src/components/demo/${f}.tsx`, root), "utf8")).join("\n");
  for (const { id } of strategy.es.nav.items.filter((i) => i.id !== "video")) assert.match(sources, new RegExp(`id="${id}"`));
});

test("the public contact address is on the tilcai.com domain", () => {
  const site = readFileSync(new URL("src/lib/site.ts", root), "utf8");
  assert.match(site, /email: "contacto@tilcai\.com"/);
  assert.doesNotMatch(site, /@gmail\.com/);
});
