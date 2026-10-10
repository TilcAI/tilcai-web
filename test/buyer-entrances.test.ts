import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { narrative } from "../src/lib/i18n/narrative.ts";

const dir = new URL("../src/components/sections/", import.meta.url);
const read = (file: string) => readFileSync(new URL(file, dir), "utf8");
const map = read("EntranceMap.tsx");
const mapCss = read("EntranceMap.module.css");
const art = read("EntranceArt.tsx");
const section = read("BuyerEntrances.tsx");
const explain = read("Explain.module.css");

test("three entrances and one shared stretch, with the same shape in both languages", () => {
  for (const locale of ["es", "en"] as const) {
    const c = narrative(locale).entrances;
    assert.deepEqual(c.items.map((i) => i.id), ["whatsapp", "mcp", "api"]);
    assert.equal(c.shared.steps.length, 5, "identity, quote, approval, payment, receipts");
    assert.ok(c.shared.label.length > 0 && c.shared.steps.every((s) => s.length > 0));
  }
  assert.deepEqual(narrative("es").entrances.shared.steps, ["Identidad", "Cotización", "Aprobación", "Pago", "Recibos"]);
  assert.deepEqual(narrative("en").entrances.shared.steps, ["Identity", "Quote", "Approval", "Payment", "Receipts"]);
});

test("each entrance shows its description and real state, without editorial notes", () => {
  for (const field of ["item.title", "item.body", "item.status", "shared.label", "shared.steps.map", "{group}"]) {
    assert.ok(map.includes(field), field);
  }
  assert.ok(!map.includes("item.note"));
  // how firm the state is drawn is part of the claim: available is solid, defined is a ring, reported is dashed
  assert.match(map, /whatsapp: \{[^}]*state: "reported"/);
  assert.match(map, /mcp: \{[^}]*state: "defined"/);
  assert.match(map, /api: \{[^}]*state: "available"/);
  assert.match(mapCss, /\.status\[data-state="available"\] i \{ background/);
  assert.match(mapCss, /\.status\[data-state="reported"\] i \{ border-style: dashed/);
});

test("the section's name labels the group of entrances instead of sitting above the heading as a kicker", () => {
  assert.ok(!/styles\.eyebrow|className="eyebrow"/.test(section));
  assert.match(section, /group=\{c\.eyebrow\}/);
  assert.match(section, /<h2 id="entrances-title"/);
  assert.match(section, /aria-labelledby="entrances-title"/);
});

test("the drawings carry no words of their own", () => {
  assert.ok(!/<text[\s>]/.test(art), "bars stand where text would be");
});

test("the line is measured from the page, drawn once, and is complete without motion", () => {
  assert.match(map, /getBoundingClientRect/);
  assert.match(map, /getPointAtLength/);
  assert.match(map, /new ResizeObserver/);
  assert.match(map, /document\.fonts\?\.ready/);
  assert.match(map, /prefers-reduced-motion: no-preference/);
  assert.match(map, /once: true/);
  assert.equal((map.match(/gsap\.timeline\(/g) ?? []).length, 1);
  assert.match(map, /acquireSmoothScroll/);
  assert.ok(!/new Lenis/.test(map));
  assert.match(mapCss, /stroke-dashoffset: 0/);
  assert.match(mapCss, /@media \(prefers-reduced-motion: reduce\)/);
  // no layout properties are animated
  assert.ok(!/(?<![-\w])(width|height|top|left):\s*[\d"']/.test(map.replace(/style=\{\{[^}]*\}\}/g, "")));
});

test("the shared stylesheet no longer carries the three-card grid it replaced", () => {
  assert.ok(!/\.entrance/.test(explain));
  assert.ok(!/\.pill/.test(explain));
  assert.ok(!/styles\.entranceGrid|explain\./.test(section));
});
