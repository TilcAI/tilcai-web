import assert from "node:assert/strict";
import test from "node:test";
import { labelTableCells } from "../src/lib/docs-html.ts";
import { docsEn } from "../src/lib/i18n/docs.en.ts";
import { docsEs } from "../src/lib/i18n/docs.es.ts";

const locales = [
  ["es", docsEs],
  ["en", docsEn],
] as const;

test("both languages document the same sections, in the same order and groups", () => {
  assert.deepEqual(
    docsEn.sections.map(({ id, group }) => `${group}:${id}`),
    docsEs.sections.map(({ id, group }) => `${group}:${id}`),
  );
});

test("section ids are unique and every group in the index has a label and at least one section", () => {
  for (const [name, docs] of locales) {
    const ids = docs.sections.map((section) => section.id);
    assert.equal(new Set(ids).size, ids.length, `${name}: duplicate section id`);
    for (const group of Object.keys(docs.groups) as (keyof typeof docs.groups)[]) {
      assert.ok(docs.groups[group].length > 0, `${name}: group ${group} has no label`);
      assert.ok(docs.sections.some((section) => section.group === group), `${name}: group ${group} is empty`);
    }
  }
});

test("the reading paths and the anchors that the rest of the site links to land on a real section", () => {
  for (const [name, docs] of locales) {
    const ids = new Set(docs.sections.map((section) => section.id));
    for (const path of docs.paths) assert.ok(ids.has(path.id), `${name}: path ${path.id} has no section`);
    // Linked from the hero scene, the control section and the stack section.
    for (const anchor of ["status", "limits", "architecture"]) assert.ok(ids.has(anchor), `${name}: #${anchor} was removed`);
  }
});

test("section bodies carry no script, no inline handler and no unlabelled external link target", () => {
  for (const [name, docs] of locales) {
    for (const { id, html } of docs.sections) {
      assert.doesNotMatch(html, /<script|\son[a-z]+\s*=|javascript:/i, `${name}/${id}`);
      for (const link of html.matchAll(/<a\s[^>]*href="(https?:\/\/[^"]+)"[^>]*>/g)) {
        assert.match(link[0], /rel="noopener"/, `${name}/${id}: external link without rel=noopener (${link[1]})`);
      }
    }
  }
});

test("a document states what it cannot claim: testnet, nothing audited, no real funds", () => {
  const all = (docs: typeof docsEs) => docs.sections.map((section) => section.html).join("\n");
  assert.match(all(docsEs), /testnet/i);
  assert.match(all(docsEs), /Nada de lo descrito aquí ha sido auditado|sin auditar/i);
  assert.match(all(docsEn), /Nothing described here has been audited|not audited/i);
  assert.match(all(docsEs), /El flujo de compra completo no está habilitado/);
  assert.match(all(docsEn), /The complete purchase flow is not enabled/);
});

test("table cells take their label from the header, and the first column stays the row's name", () => {
  const html = `<table><thead><tr><th scope="col">Módulo</th><th scope="col">Función</th><th scope="col"><code>Permiso</code></th></tr></thead>
<tbody><tr><td>Uno</td><td>Dos</td><td>Tres</td></tr><tr><th scope="row">Fila</th><td>A</td><td data-label="Ya">B</td></tr></tbody></table>`;
  const out = labelTableCells(html);
  assert.match(out, /<td>Uno<\/td><td data-label="Función">Dos<\/td><td data-label="Permiso">Tres<\/td>/);
  assert.match(out, /<th scope="row">Fila<\/th><td data-label="Función">A<\/td><td data-label="Ya">B<\/td>/);
});

test("a table without a header is left as it was, and everything outside tables is untouched", () => {
  const html = `<p>Antes</p><table><tbody><tr><td>Solo</td><td>datos</td></tr></tbody></table><p>Después</p>`;
  assert.equal(labelTableCells(html), html);
});

test("every table in both languages ends up with labels on all of its cells but the first of each row", () => {
  let rows = 0;
  for (const [name, docs] of locales) {
    for (const { id, html } of docs.sections) {
      for (const tbody of labelTableCells(html).matchAll(/<tbody\b[^>]*>[\s\S]*?<\/tbody>/g)) {
        for (const row of tbody[0].matchAll(/<tr\b[^>]*>[\s\S]*?<\/tr>/g)) {
          rows += 1;
          const cells = [...row[0].matchAll(/<(td|th)\b([^>]*)>/g)].slice(1);
          for (const [, tag, attributes] of cells) {
            if (tag === "td") assert.match(attributes, /data-label="[^"]+"/, `${name}/${id}: ${row[0].slice(0, 80)}`);
          }
        }
      }
    }
  }
  assert.ok(rows > 20, "the documentation has tables to label");
});
