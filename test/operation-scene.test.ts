import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { narrative } from "../src/lib/i18n/narrative.ts";
import { CAMERA, PHASES, STEPS, phaseIndex, phaseLength, phaseMiddle } from "../src/components/sections/operation/phases.ts";
import { CHECK_AT, OFFER_AT, STOP_AT, VIEW } from "../src/components/sections/operation/scene/geometry.ts";

const es = narrative("es").flow;
const en = narrative("en").flow;
const dir = new URL("../src/components/sections/operation/", import.meta.url);
const read = (file: string) => readFileSync(new URL(file, dir), "utf8");
const allText = (value: unknown): string[] =>
  typeof value === "string" ? [value] : Array.isArray(value) ? value.flatMap(allText) : value && typeof value === "object" ? Object.values(value).flatMap(allText) : [];

test("the six phases cover the whole timeline once, in order, and map back to their step", () => {
  assert.equal(STEPS, 6);
  assert.equal(PHASES.length, STEPS + 1);
  assert.equal(PHASES[0], 0);
  assert.equal(PHASES[STEPS], 1);
  for (let i = 0; i < STEPS; i += 1) {
    assert.ok(PHASES[i + 1] > PHASES[i], `phase ${i} has length`);
    assert.equal(phaseIndex(phaseMiddle(i)), i, `the middle of phase ${i} belongs to it`);
    assert.equal(phaseIndex(PHASES[i] + 0.0005), i);
  }
  assert.equal(phaseIndex(0), 0);
  assert.equal(phaseIndex(1), STEPS - 1);
  assert.ok(Math.abs([...Array(STEPS).keys()].reduce((sum, i) => sum + phaseLength(i), 0) - 1) < 1e-9);
  assert.deepEqual([...PHASES], [0, 0.16, 0.32, 0.49, 0.66, 0.83, 1], "the split the design asks for");
});

test("the camera zooms in towards the approval and back out, within a small drift", () => {
  assert.equal(CAMERA.length, STEPS);
  assert.deepEqual(CAMERA.map((c) => c.scale), [1, 1.02, 1.05, 1.1, 1.06, 1.02]);
  for (const c of CAMERA) assert.ok(Math.abs(c.x) <= 30 && Math.abs(c.y) <= 30, "no more than 20–30 px of drift");
  assert.equal(CAMERA.indexOf(CAMERA.reduce((a, b) => (b.scale > a.scale ? b : a))), 3, "the closest point is the approval");
});

test("the scene copy exists in both languages with the same shape, and matches the places the drawing reserves for it", () => {
  for (const c of [es, en]) {
    assert.equal(c.scene.checks.length, CHECK_AT.length, "one label per check position");
    assert.equal(c.scene.stops.length, STOP_AT.length, "one label per rail checkpoint");
    assert.equal(c.scene.review.rows.length, 4, "amount, price, business, validity");
    assert.equal(OFFER_AT.length, 3, "price, stock, validity");
    for (const text of allText(c.scene)) assert.ok(text.trim().length > 0, "no empty label");
    assert.equal(c.steps.length, STEPS);
  }
  assert.deepEqual(Object.keys(es.scene).sort(), Object.keys(en.scene).sort());
  assert.deepEqual(Object.keys(es.scene.receipts).sort(), Object.keys(en.scene.receipts).sort());
  assert.deepEqual(Object.keys(es.scene.review).sort(), Object.keys(en.scene.review).sort());
  assert.deepEqual(es.scene.agents, { claude: "Claude", codex: "Codex", own: "Agente propio" });
  assert.equal(en.scene.agents.own, "Your own agent");
});

test("the scene never says that paying is delivering, and keeps the two receipts apart", () => {
  for (const c of [es, en]) {
    assert.match(c.scene.receipts.notDelivery, /≠/, "paid is not delivered");
    assert.notEqual(c.scene.receipts.paid, c.scene.receipts.confirmed, "the payment receipt and the delivery confirmation are different words");
    assert.match(c.scene.receipts.sameOrder, /orderId/);
  }
});

test("one SVG, one master timeline, one scroll trigger driving it, and no Canvas or WebGL", () => {
  const timeline = read("timeline.ts");
  const section = read("OperationSection.tsx");
  assert.equal((timeline.match(/gsap\.timeline\(\{ paused: true/g) ?? []).length, 1, "the master timeline");
  assert.equal((section.match(/ScrollTrigger\.create\(\{ animation: tl/g) ?? []).length, 2, "one per mode (pinned, flow), never both");
  assert.match(section, /acquireSmoothScroll/, "Lenis is the shared instance, not a second one");
  assert.ok(!/new Lenis|gsap\.ticker\.lagSmoothing/.test(section + timeline), "no second Lenis or ticker setup in this section");
  const scene = read("OperationScene.tsx");
  assert.equal((scene.match(/<svg\b/g) ?? []).length, 1, "a single SVG for the whole operation");
  assert.match(scene, new RegExp(`viewBox=\\{\`\\$\\{VIEW\\.x\\} \\$\\{VIEW\\.y\\} \\$\\{VIEW\\.w\\} \\$\\{VIEW\\.h\\}\``));
  assert.ok(VIEW.w > 0 && VIEW.h > 0);
  const everything = [section, timeline, scene, ...readdirSync(new URL("scene/", dir)).map((f) => read(`scene/${f}`))].join("\n");
  assert.ok(!/<canvas|getContext\(|from "three|THREE\.|WebGL/.test(everything), "SVG only");
});

test("every group the brief names exists in the scene, as a group of its own", () => {
  const files = readdirSync(new URL("scene/", dir)).map((f) => read(`scene/${f}`)).join("\n");
  for (const id of ["scene-grid", "agent", "business", "connection", "request", "offer", "tilcai-core", "rules", "approval", "payment", "receipts", "particles", "svg-camera", "main-path", "agent-body", "agent-head", "agent-eyes", "agent-left-arm", "agent-right-arm", "glow-purple", "glow-cyan"]) {
    assert.ok(files.includes(`id="${id}"`) || (id === "svg-camera" && read("OperationScene.tsx").includes(`id="${id}"`)), `#${id}`);
  }
  for (const part of ["biz-roof", "biz-awning", "biz-windows", "biz-door", "biz-base", "biz-plant", "biz-light"]) assert.ok(files.includes(`data-k="${part}"`), part);
});

test("there is a path without motion: reduced motion shows the final scene and a plain list, with no pin", () => {
  const section = read("OperationSection.tsx");
  assert.match(section, /prefers-reduced-motion: reduce/);
  assert.match(section, /tl\.progress\(1\)/, "the scene is drawn in its final state");
  const css = read("OperationSection.module.css");
  assert.match(css, /data-mode='static'/);
  const scenery = read("scene/scene.module.css");
  assert.match(scenery, /prefers-reduced-motion: reduce\) \{ \.ring, \.float, \.breathe, \.twinkle \{ animation: none; \}/);
});

test("the scene keeps at most twelve decorative marks and animates only transform, opacity and stroke offsets", () => {
  const particles = read("scene/Particles.tsx");
  const marks = Number(/const MARKS = \[([\s\S]*?)\] as const;/.exec(particles)![1].match(/\{ x:/g)!.length);
  assert.ok(marks + 5 <= 12, `${marks} marks plus the travelling dots stay within twelve`);
  const timeline = read("timeline.ts");
  for (const forbidden of [/\bwidth:/, /\bheight:/, /\btop:/, /\bleft:/, /\bmargin/]) assert.ok(!forbidden.test(timeline), `timeline animates ${forbidden}`);
});
