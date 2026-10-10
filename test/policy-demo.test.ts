import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { demoScenarios, scenarioIds, variantIds } from "../src/lib/demo/scenarios.ts";

const dir = new URL("../src/components/", import.meta.url);
const dictionary = (locale: "es" | "en") => {
  // The dictionaries use extensionless imports that Node cannot load; their demo block is plain data, read as text.
  const source = readFileSync(new URL(`../src/lib/i18n/${locale}.ts`, import.meta.url), "utf8");
  const from = source.indexOf("  demo: {");
  const to = source.indexOf("  capabilities: {", from);
  assert.ok(from > 0 && to > from, `${locale}: demo block found`);
  return source.slice(from, to);
};
const read = (file: string) => readFileSync(new URL(file, dir), "utf8");
const demo = read("PolicyDemo.tsx");
const stage = read("PolicyFlowVisualization.tsx");
const stageCss = read("PolicyFlowVisualization.module.css");
const demoCss = read("PolicyDemo.module.css");
const section = read("sections/DemoSection.tsx");

test("the fixtures still say what each condition does, for every case", () => {
  assert.deepEqual(demoScenarios.map((s) => s.id), [...scenarioIds]);
  for (const s of demoScenarios) {
    assert.equal(s.variants.valid.decision, "ALLOW");
    assert.equal(s.variants["requires-approval"].decision, "REQUIRE_APPROVAL");
    assert.equal(s.variants["changed-recipient"].decision, "DENY");
    assert.ok(s.variants["changed-recipient"].recipient, `${s.id}: the changed-recipient condition names another recipient`);
    assert.equal(s.variants["over-limit"].decision, "DENY");
    assert.ok(Number(s.variants["over-limit"].amount) > Number(s.quote.limit), `${s.id}: over-limit really is over the limit`);
    assert.ok(Number(s.quote.amount) <= Number(s.quote.limit), `${s.id}: the quoted amount is within the limit`);
  }
});

test("every case and every condition is a real, labelled, pressable choice that points at the result region", () => {
  assert.match(demo, /demoScenarios\.map\(/);
  assert.match(demo, /variantIds\.map\(/);
  assert.equal((demo.match(/aria-pressed={/g) ?? []).length, 2, "cases and conditions, and nothing else, toggle");
  assert.equal((demo.match(/aria-controls="demo-result"/g) ?? []).length, 3, "cases, conditions and the approval button");
  assert.match(demo, /id="demo-result"[^>]*role="status"[^>]*aria-live="polite"[^>]*aria-atomic="true"/);
  assert.match(demo, /role="group" aria-label=\{t\.scenarioPrompt\}/);
  assert.match(demo, /role="group" aria-label=\{t\.variantPrompt\}/);
});

test("every text the simulation had is still on the page, in both languages", () => {
  for (const locale of ["es", "en"] as const) {
    const block = dictionary(locale);
    for (const id of scenarioIds) assert.ok(block.includes(id), `${locale}: scenario ${id}`);
    for (const id of variantIds) assert.ok(block.includes(id), `${locale}: variant ${id}`);
    for (const key of ["eyebrow:", "continuationNote:", "blocked:", "allowed:", "reviewRequired:", "recipientNotAllowed:", "overLimit:", "user:", "tilcaiAgent:", "policy:", "businessAgent:", "business:", "scenarioPrompt:", "variantPrompt:", "reset:", "outcomes:"]) {
      assert.ok(block.includes(key), `${locale}: ${key}`);
    }
  }
  for (const field of ["t.eyebrow", "t.reset", "t.continuationNote", "t.approval.title", "t.approval.action", "t.approval.complete", "t.approval.pending", "t.outcomes[displayedDecision]", "variantCopy.reason", "scenarioCopy.request", "t.fields.request", "t.fields.service", "t.fields.quantity", "t.fields.timing", "t.fields.result", "t.fields.limit"]) {
    assert.ok(demo.includes(field), field);
  }
  for (const field of ["t.flow.user", "t.flow.tilcaiAgent", "t.flow.policy", "t.flow.businessAgent", "t.flow.business", "t.flow.allowed", "t.flow.recipientNotAllowed", "t.flow.overLimit", "t.fields.recipient", "t.fields.amount", "t.fields.limit"]) {
    assert.ok(stage.includes(field), field);
  }
});

test("the notice that no funds move sits on the simulation itself, not above the heading as a kicker", () => {
  assert.match(demo, /className=\{styles\.sandbox\}[\s\S]{0,200}\{t\.eyebrow\}/);
  assert.ok(!/eyebrow=\{|className="eyebrow"/.test(section), "no kicker in the section head");
  assert.match(section, /<h2 id="demo-title">/);
});

test("the path is drawn by the page, not by a graph library, and it is walked by one timeline per run", () => {
  assert.ok(!/@xyflow/.test(stage + demo), "no graph library");
  assert.equal((stage.match(/gsap\.timeline\(/g) ?? []).length, 1);
  assert.match(stage, /prefers-reduced-motion: no-preference/);
  assert.match(stage, /once: true/);
  assert.ok(/ctx\.revert\(\)/.test(stage) && /mm\.revert\(\)/.test(stage), "everything it starts is cleaned up");
  assert.match(stage, /markerEl\?\.dataset\.state/, "the run reads the drawn end state, not a closure of the first render");
  // without motion the stylesheet is the whole drawing: a fill falls back to its end value
  assert.match(stageCss, /scaleX\(var\(--p, var\(--max, 1\)\)\)/);
  assert.match(stageCss, /scaleY\(var\(--p, var\(--max, 1\)\)\)/);
  assert.match(stageCss, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(demoCss, /@media \(prefers-reduced-motion: reduce\)/);
});

test("nothing animates layout properties and no second smooth-scroll instance is created", () => {
  for (const [name, source] of [["stage", stage], ["demo", demo]] as const) {
    for (const forbidden of [/(?<![-\w])width:\s*[\d"']/, /(?<![-\w])height:\s*[\d"']/, /(?<![-\w])top:\s*[\d"']/, /(?<![-\w])left:\s*[\d"']/, /svgOrigin/]) {
      assert.ok(!forbidden.test(source.replace(/style=\{\{[^}]*\}\}/g, "")), `${name} must not use ${forbidden}`);
    }
  }
  assert.match(demo, /acquireSmoothScroll/);
  assert.ok(!/new Lenis/.test(demo + stage));
});

test("the result keeps one height for every outcome and follows the reader on narrow screens", () => {
  assert.match(demoCss, /\.verdict \{[^}]*min-height: 166px/);
  assert.match(demoCss, /position: sticky;\s*bottom: 12px/);
});

test("the answer waits for its cause, an early approval cannot corrupt the walk, and the stage can always walk again", () => {
  // the policy resolves, then the verdict lights up; until then the approval button is not pressable
  assert.ok(stage.includes("walking.current?.(true)"));
  assert.ok(stage.includes("walking.current?.(false)"));
  assert.ok(demo.includes("data-walking={walking || undefined}"));
  assert.ok(demo.includes("disabled={walking}"));
  assert.match(demoCss, /\.verdict\[data-walking\] \{ opacity: 0\.38/);
  // resuming from the gate while the first walk is going lets that walk land first
  assert.ok(stage.includes('from === "gate" && tl?.isActive()) tl.progress(1)'));
  // a rebuilt player (strict mode, motion preference switched back on) is allowed to walk again
  assert.ok(stage.includes("entered.current = false;"));
  // a fromTo placed later on the timeline must not draw its first frame immediately
  assert.ok(stage.includes("immediateRender: false"));
});

test("choosing what is already chosen replays the path, and a case change keeps the condition being compared", () => {
  assert.ok(demo.includes("if (next === scenarioId) again()"));
  assert.ok(demo.includes("if (next === variantId) again()"));
  assert.ok(demo.includes("runKey={`${scenarioId}:${variantId}:${replay}`}"));
  const chooseScenario = demo.slice(demo.indexOf("const chooseScenario"), demo.indexOf("const chooseVariant"));
  assert.ok(!chooseScenario.includes("setVariantId"), "changing the case does not reset the condition");
});

test("assistive technology gets one sentence per change, focus follows the approval, the plate measures the wrapper", () => {
  assert.ok(demo.includes('className="sr-only">{announcement}'));
  assert.ok(demo.includes('className={styles.resultVisual} aria-hidden="true"'));
  assert.ok(demo.includes("approvedLine.current?.focus("));
  assert.ok(demo.includes("tabIndex={-1} className={styles.approved}"));
  assert.ok(demo.includes("?.parentElement"), "the plate follows the option's wrapper, not a transformed button");
  assert.match(demoCss, /\.plate\[data-ready\]/);
  // the sticky bar must not cover a focused control
  assert.ok(demoCss.includes("scroll-margin-bottom: 200px"));
});

test("the decision is drawn as a row of the policy card, and nothing in the path is dimmed below readable contrast", () => {
  assert.ok(stage.includes("data-tone={decision}"));
  assert.ok(stage.includes("t.flow.reviewRequired"));
  assert.match(stageCss, /\.station\[data-reached="false"\] \.medal/);
  assert.match(stageCss, /\.station\[data-reached="false"\] \.caption,[^{]*\{\s*opacity: 0\.72/);
  assert.ok(!/\.marker \{[^}]*transition:[^;}]*(opacity|scale)/.test(stageCss), "the marker's opacity and scale belong to GSAP, not to a CSS transition");
  assert.ok(!/backdrop-filter/.test(demoCss + stageCss), "no decorative blur");
});
