import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { solutions } from "../src/lib/i18n/solutions.ts";

const locales = ["es", "en"] as const;
const home = readFileSync(new URL("../src/components/HomePage.tsx", import.meta.url), "utf8");
const section = readFileSync(new URL("../src/components/sections/SolutionsSection.tsx", import.meta.url), "utf8");
const typography = readFileSync(new URL("../src/app/typography.css", import.meta.url), "utf8");

/** Every string leaf of a copy object, with its path. */
function leaves(value: unknown, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((item, i) => leaves(item, `${path}[${i}]`));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  return [];
}

test("both languages have the same copy, with nothing empty", () => {
  const es = leaves(solutions("es"));
  const en = leaves(solutions("en"));
  assert.deepEqual(es.map(([path]) => path), en.map(([path]) => path));
  for (const [path, text] of [...es, ...en]) assert.ok(text.trim().length > 0, `empty copy at ${path}`);
});

test("Optipagos is being implemented and Baral is next: no status is stronger than the facts", () => {
  for (const locale of locales) {
    const c = solutions(locale);
    assert.notEqual(c.status.implementing, c.status.next);
    // Nothing here may read as live, audited or real money: everything is on a test network.
    const claims = leaves(c).map(([, text]) => text).join(" ").toLowerCase();
    assert.doesNotMatch(claims, /mainnet|en producción|in production|auditad[oa] por|audited by|dinero real disponible/);
    assert.match(c.footnote.toLowerCase(), /pruebas|test network/);
  }
});

test("Optipagos shows its real chat inside a phone, without the old figures, the verification note or the drawn chat", () => {
  for (const locale of locales) {
    const o = solutions(locale).optipagos as Record<string, unknown>;
    assert.ok(!("facts" in o) && !("note" in o) && !("chat" in o), "the figures, the note and the illustrated chat are gone");
    assert.equal((o.steps as unknown[]).length, 2);
  }
  assert.match(section, /file: "pago optipago\.jpg", width: 720, height: 1612/);
  assert.ok(existsSync(new URL("../public/assets/img/logos empresas/pago optipago.jpg", import.meta.url)));
  assert.ok(!/SolutionsChat|styles\.facts|styles\.note/.test(section));
  assert.ok(!existsSync(new URL("../src/components/sections/SolutionsChat.tsx", import.meta.url)), "the illustrated chat is removed");
});

test("the logos the section draws exist in the repository", () => {
  const files = [...section.matchAll(/file: "([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(files.sort(), ["baral.webp", "optipago_logo_vec.svg", "pago optipago.jpg"]);
  for (const file of files) {
    assert.ok(existsSync(new URL(`../public/assets/img/logos empresas/${file}`, import.meta.url)), `${file} is missing`);
  }
  assert.ok(existsSync(new URL("../public/assets/img/logos empresas/Baumans-Regular.ttf", import.meta.url)));
});

test("the section sits right below 'Empresas' and takes part in the type system", () => {
  const order = [...home.matchAll(/<(\w+Section) t=\{t\} \/>/g)].map((m) => m[1]);
  assert.equal(order[order.indexOf("BusinessesSection") + 1], "SolutionsSection");
  assert.match(typography, /#solutions\b/);
  assert.match(typography, /#solutions-title/);
  assert.match(section, /id="solutions"/);
  assert.match(section, /id="solutions-title"/);
});
