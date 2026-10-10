import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { agents, integrationStages, type AgentClient } from "../src/lib/content/agents.ts";

const i18n = new URL("../src/lib/i18n/", import.meta.url);
const read = (file: string) => readFileSync(new URL(file, i18n), "utf8");

const validated = (status: "guide" | "pilot" | "enabled", tools: readonly string[]): AgentClient => ({
  ...agents[0],
  teamVerified: false,
  status,
  guide: {
    kind: "validated", testedAt: "2026-10-01", transport: "stdio",
    authentication: { es: "n/d", en: "n/a" }, tools, steps: [], disconnect: { es: "n/d", en: "n/a" },
  },
});

const done = (agent: AgentClient) => integrationStages(agent).filter((stage) => stage.done).map((stage) => stage.key);

test("every client carries the team's sign-off and shows the four stages as verified, while its status stays in preparation", () => {
  assert.ok(agents.length > 0);
  for (const agent of agents) {
    assert.equal(agent.status, "preparation", `${agent.slug} keeps its status until it has a tested guide`);
    assert.equal(agent.teamVerified, true, agent.slug);
    assert.deepEqual(done(agent), ["docs", "transport", "tools", "approval"], agent.slug);
  }
});

test("without the team's sign-off a client in preparation shows only its documentation review", () => {
  assert.deepEqual(done({ ...agents[0], teamVerified: false }), ["docs"]);
});

test("the four stages keep their order", () => {
  assert.deepEqual(integrationStages(agents[0]).map((stage) => stage.key), ["docs", "transport", "tools", "approval"]);
});

test("without the sign-off a stage is only done when the entry carries the evidence for it", () => {
  assert.deepEqual(done(validated("guide", [])), ["docs", "transport"], "validated transport without exposed tools");
  assert.deepEqual(done(validated("guide", ["tilcai_quote"])), ["docs", "transport", "tools"]);
  assert.deepEqual(done(validated("pilot", ["tilcai_quote"])), ["docs", "transport", "tools"], "a pilot is not human approval validated");
  assert.deepEqual(done(validated("enabled", ["tilcai_quote"])), ["docs", "transport", "tools", "approval"]);
});

test("both languages describe the same four stages", () => {
  for (const file of ["es.ts", "en.ts"]) {
    const source = read(file);
    const block = source.match(/stages: \{[\s\S]*?\n    \},\n    panel:/)?.[0] ?? "";
    assert.ok(block.length > 0, `${file} has an agents.stages block`);
    for (const key of ["docs", "transport", "tools", "approval"]) {
      assert.match(block, new RegExp(`${key}: \\{ label: "[^"]+", done: "[^"]+", pending: "[^"]+" \\}`), `${file} stage ${key}`);
    }
    assert.match(block, /progress: "[^"]*\{done\}[^"]*\{total\}[^"]*"/, `${file} progress template`);
  }
});
