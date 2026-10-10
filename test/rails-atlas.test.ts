import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { narrative } from "../src/lib/i18n/narrative.ts";
import { destinationNetwork, evidencePayments, originNetworks, shortHash } from "../src/lib/content/rails.ts";

const dir = new URL("../src/components/sections/rails/", import.meta.url);
const read = (file: string) => readFileSync(new URL(file, dir), "utf8");
const atlas = read("RouteAtlas.tsx");
const ledger = read("EvidenceLedger.tsx");
const header = read("RailsHeader.tsx");
const section = readFileSync(new URL("../src/components/sections/RailsSection.tsx", import.meta.url), "utf8");

test("the map draws what the data says: the first network is the straight run, the others feed it (solid if verified, dashed if lab), one destination", () => {
  assert.equal(originNetworks.filter((n) => n.status === "verified").length, 4);
  assert.deepEqual(originNetworks.slice(0, 4).map((n) => n.status), ["verified", "verified", "verified", "verified"], "the verified networks come first");
  assert.equal(originNetworks[0]!.status, "verified", "the verified network is first, because the solid line leaves from its row");
  assert.equal(originNetworks[0]!.id, "avalanche-fuji");
  // Every network gets a row and a port the lines are measured from; the verified one is the only solid, bright dot.
  assert.match(atlas, /originNetworks\.map\(\(network, i\) =>/);
  assert.match(atlas, /data-pt=\{`o\$\{i\}`\}/);
  assert.match(atlas, /destinationNetwork\.name/);
  assert.equal(destinationNetwork.id, "stellar-testnet");
});

test("the unverified route never carries traffic: only the verified line has a packet", () => {
  assert.equal((atlas.match(/<g data-packet/g) ?? []).length, 1, "a single packet");
  assert.match(atlas, /vLine\.getPointAtLength/, "the packet follows the verified line");
  assert.ok(!/direct[A-Za-z]*\.getPointAtLength\([^)]*run/.test(atlas), "nothing travels the direct route");
  assert.match(atlas, /stroke-dasharray|strokeDasharray/);
});

test("lines and dots are measured from the page, not drawn in fixed coordinates, and are rebuilt when the layout changes", () => {
  assert.match(atlas, /getBoundingClientRect/);
  assert.match(atlas, /new ResizeObserver/);
  assert.match(atlas, /document\.fonts\?\.ready/);
  assert.ok(!/viewBox="0 0 [0-9]{3,}/.test(atlas), "no viewBox baked in: it is set from the grid's own size");
  assert.match(atlas, /setAttribute\("viewBox"/);
  assert.match(atlas, /\(min-width: 1100px\)/, "two layouts: wide and stacked");
});

test("one scrubbed timeline with its own trigger, a quiet loop that only runs on screen, and a path without motion", () => {
  assert.equal((atlas.match(/gsap\.timeline\(\{ paused: true/g) ?? []).length, 1);
  assert.equal((atlas.match(/ScrollTrigger\.create\(\{\s*animation: tl/g) ?? []).length, 1);
  assert.match(atlas, /scrub: 0\.6/);
  assert.match(atlas, /loop\.play\(\)/);
  assert.match(atlas, /loop\.pause\(\)/);
  assert.match(atlas, /prefers-reduced-motion: reduce/);
  assert.match(atlas, /showAll\(\)/, "everything drawn at once without motion");
  assert.match(atlas, /acquireSmoothScroll/, "the shared Lenis, not a second instance");
  assert.ok(!/new Lenis/.test(atlas + ledger + header));
  assert.ok(/ctx\.revert\(\)/.test(atlas) && /observer\.disconnect\(\)/.test(atlas), "everything it starts is cleaned up");
});

test("nothing in the section animates layout or uses a transform that drifts: dots grow by radius, lines by dash offset", () => {
  for (const [name, source] of [["atlas", atlas], ["ledger", ledger], ["header", header]] as const) {
    // (media queries such as "(min-width: 1100px)" are not animations, hence the look-behind)
    for (const forbidden of [/(?<![-\w])width:\s*[\d"']/, /(?<![-\w])height:\s*[\d"']/, /(?<![-\w])top:\s*[\d"']/, /(?<![-\w])left:\s*[\d"']/, /svgOrigin/]) {
      assert.ok(!forbidden.test(source.replace(/style=\{\{[^}]*\}\}/g, "")), `${name} must not use ${forbidden}`);
    }
  }
});

test("the ledger shows the real hashes: split for the reveal, whole in the link's name, with working explorer links", () => {
  assert.equal(evidencePayments.length, 2);
  assert.match(ledger, /aria-label=\{`\$\{e\.burn\} · Snowtrace · \$\{payment\.burnTxHash\}/);
  assert.match(ledger, /aria-label=\{`\$\{e\.mint\} · Stellar Expert · \$\{payment\.mintTxHash\}/);
  assert.match(ledger, /snowtraceTx\(payment\.burnTxHash\)/);
  assert.match(ledger, /stellarExpertTx\(payment\.mintTxHash\)/);
  assert.match(ledger, /aria-hidden="true">\{Array\.from\(shortHash\(value\)\)/, "the per-character spans are hidden from screen readers");
  for (const p of evidencePayments) assert.ok(shortHash(p.burnTxHash).includes("…"));
  assert.match(ledger, /id="evidence"/, "the #evidence anchor survives");
});

test("the section keeps route details, pipeline, limits and evidence without editorial notes", () => {
  for (const locale of ["es", "en"] as const) {
    const c = narrative(locale);
    for (const route of c.rails.routes) for (const key of ["tag", "title", "body", "status"] as const) assert.ok(route[key].length > 0, `${route.id}.${key}`);
    assert.equal(c.rails.pipelineSteps.length, 3);
    assert.equal(c.rails.limits.items.length, 4);
    assert.ok(c.evidence.lead.length > 0);
  }
  // The atlas reads every one of those fields, so removing one from the page would fail here.
  for (const field of ["route.tag", "route.title", "route.body", "route.status", "c.pipelineSteps", "step.plain", "step.term", "c.gasless", "c.mapTitle", "c.mapLead", "c.destinationNote", "c.legend.verified", "c.legend.lab", "c.legend.vision"]) {
    assert.ok(atlas.includes(field), field);
  }
  assert.match(section, /c\.limits\.items\.map/);
  assert.match(header, /c\.explainer\.term/);
  assert.ok(!header.includes("c.explainer.note"));
  assert.ok(!ledger.includes("e.note"));
});

test("the headline reveal never clips the descenders afterwards and does not play twice", () => {
  assert.match(header, /mask: "lines"/);
  assert.match(header, /overflow: "visible"/);
  assert.match(header, /played/);
  assert.match(header, /once: true/);
});
