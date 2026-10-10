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

test("the terminal session is an illustration: it says so on its title bar, uses only copy the site already has, and ends waiting for a person", () => {
  const scene = readFileSync(new URL("src/lib/content/terminal-scene.ts", root), "utf8");
  const art = readFileSync(new URL("src/components/AgentArt.tsx", root), "utf8");
  const catalog = readFileSync(new URL("src/components/AgentCatalog.tsx", root), "utf8");
  assert.match(scene, /Ilustración · sin conexión/);
  assert.match(scene, /Illustration · not connected/);
  assert.match(scene, /Esperando aprobación humana/);
  // the badge sits on the window itself and the request is the one of the cinema case of the simulation
  assert.match(art, /styles\.chromeBadge\}>\{scene\.badge\}/);
  assert.match(catalog, /t\.demo\.scenarios\.cinema\.request/);
  assert.match(catalog, /demoScenarios\[0\]/);
  // it runs only while on screen and has a last frame without motion
  assert.match(art, /new IntersectionObserver/);
  assert.match(art, /prefers-reduced-motion: no-preference/);
  assert.match(art, /clearProps: "opacity,transform"/);
  assert.ok(!/new Lenis/.test(art));
});
