import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = readFileSync(new URL("src/lib/content/agents.ts", root), "utf8");

test("every mascot the catalog names is a file that exists, with a description in both languages", () => {
  const assets = [...source.matchAll(/asset: \{ src: "(\/assets\/[^"]+)", alt: text\("([^"]+)", "([^"]+)"\)/g)];
  assert.ok(assets.length >= 4, "Codex, Claude Code, OpenCode and Gemini CLI have a mascot");
  for (const [, src, es, en] of assets) {
    assert.ok(existsSync(new URL(`public${src}`, root)), `${src} exists`);
    assert.ok(es!.length > 0 && en!.length > 0, `${src} has alt text`);
  }
});

test("OpenCode and Gemini CLI use the images in public/assets/img/agentes", () => {
  assert.match(source, /slug: "opencode"[\s\S]{0,200}asset: \{ src: "\/assets\/img\/agentes\/agente-opencode\.png"/);
  assert.match(source, /slug: "gemini-cli"[\s\S]{0,200}asset: \{ src: "\/assets\/img\/agentes\/agente-gemini\.png"/);
});
