import assert from 'node:assert/strict';
import test from 'node:test';
import { registerHooks } from 'node:module';
import type { Agent, OfficeSim as SimType } from '../src/components/office/sim.ts';
import type { Cell, OfficeEvent } from '../src/components/office/types.ts';

// The app uses bundler resolution; resolve its extensionless local imports in Node.
registerHooks({ resolve(specifier, context, next) {
  try { return next(specifier, context); }
  catch (error) {
    if (specifier.startsWith('.') && !/\.[a-z]+$/i.test(specifier)) return next(specifier + '.ts', context);
    throw error;
  }
} });
const { OfficeSim } = await import('../src/components/office/sim.ts');
const { officeEn } = await import('../src/lib/i18n/office.en.ts');
const { SPOTS, blockedGrid, GRID_W, ROOMS } = await import('../src/components/office/layout.ts');
const { canStep, findPath } = await import('../src/components/office/pathfinding.ts');
const { packetFor } = await import('../src/components/office/render/effects.ts');
const { agentAt, fitCamera, toScreen } = await import('../src/components/office/render.ts');

function fixture(seed = 11, isolated = false) {
  const sim = new OfficeSim(officeEn.sim, seed);
  const events: OfficeEvent[] = [];
  sim.onEvent = e => events.push(e);
  if (isolated) for (const a of sim.agents) a.timer = a.id === 0 ? .1 : Infinity;
  return { sim, events };
}
function until(sim: SimType, done: () => boolean, seconds = 240) {
  for (let i = 0; i < seconds * 10 && !done(); i++) sim.update(.1);
  assert.ok(done(), 'simulation did not reach the expected state');
}
const buyer = (sim: SimType) => sim.agents[0];

test('all interaction points remain reachable through real doors and outside furniture', () => {
  const points: Cell[] = Object.values(SPOTS).flatMap(v => 'x' in v ? [v] : [...v]);
  for (const point of points) {
    assert.equal(blockedGrid[point.y * GRID_W + point.x], 0);
    const path = findPath(SPOTS.hubSeats[0], point);
    assert.ok(path, JSON.stringify(point));
    let previous = SPOTS.hubSeats[0];
    for (const step of path) {
      assert.equal(Math.abs(step.x - previous.x) + Math.abs(step.y - previous.y), 1);
      assert.ok(canStep(previous.x, previous.y, step.x, step.y)); previous = step;
    }
  }
  assert.equal(ROOMS.length, 8);
});

test('valid purchase settles, emits receipt and delivery, then returns to the office', () => {
  const { sim, events } = fixture(11, true);
  sim.command('purchase');
  until(sim, () => buyer(sim).ok === 1);
  assert.equal(sim.getStats().volumeCents, 5);
  assert.ok(events.some(e => e.kind === 'x402'));
  assert.ok(events.some(e => e.text.includes('delivery confirmed')));
  assert.ok(events.some(e => e.text.includes('payment receipt')));
  until(sim, () => buyer(sim).phase === 'idle');
});

test('injected payee and amount are denied without settlement', () => {
  const { sim, events } = fixture(11, true);
  sim.command('injection'); until(sim, () => buyer(sim).denied === 1);
  assert.ok(buyer(sim).op?.reasons.includes('PAYEE_NOT_ALLOWED'));
  assert.ok(buyer(sim).op?.reasons.includes('PER_PAYMENT_LIMIT_EXCEEDED'));
  assert.equal(sim.getStats().volumeCents, 0);
  until(sim, () => events.some(e => e.text.includes('denial receipt')));
});

test('duplicate retry produces no second settlement', () => {
  const { sim } = fixture(11, true);
  sim.command('purchase'); until(sim, () => buyer(sim).ok === 1);
  sim.command('duplicate');
  until(sim, () => !!buyer(sim).op?.reasons.includes('DUPLICATE_PAYMENT_INTENT'));
  assert.equal(sim.getStats().settled, 1); assert.equal(sim.getStats().volumeCents, 5);
});

test('over-threshold command visits guardian, gets approval and settles', () => {
  const { sim, events } = fixture(11, true);
  sim.command('approval'); until(sim, () => buyer(sim).phase === 'approval');
  assert.equal(buyer(sim).op?.decision, 'REQUIRE_APPROVAL');
  assert.equal(packetFor(buyer(sim))?.kind, 'approval');
  until(sim, () => buyer(sim).ok === 1);
  assert.ok(events.some(e => e.text.includes("principal approves")));
  assert.ok(sim.getStats().volumeCents > 1000);
});

test('natural human rejection remains reachable and moves no rejected funds', () => {
  let rejected = false;
  for (let seed = 1; seed <= 30 && !rejected; seed++) {
    const { sim } = fixture(seed, true);
    // Reach a real approval visit, then exercise the existing natural decision branch.
    sim.command('approval'); until(sim, () => buyer(sim).phase === 'approval');
    buyer(sim).op!.forcedApprove = false;
    until(sim, () => buyer(sim).phase !== 'approval');
    if (buyer(sim).op?.reasons.includes('HUMAN_REJECTED')) {
      rejected = true; assert.equal(sim.getStats().settled, 0); assert.equal(sim.getStats().volumeCents, 0);
    }
  }
  assert.ok(rejected);
});

test('mandate pause denies new operations; kill freezes positions, decisions and timers', () => {
  const { sim } = fixture(11, true);
  sim.command('togglePause'); sim.command('purchase');
  until(sim, () => buyer(sim).denied === 1);
  assert.ok(buyer(sim).op?.reasons.includes('MANDATE_PAUSED'));
  sim.command('togglePause'); assert.equal(sim.getStats().mandatePaused, false);
  sim.command('toggleKill');
  const before = sim.agents.map(a => [a.px, a.py, a.phase, a.timer]);
  const stats = sim.getStats();
  for (let i = 0; i < 100; i++) sim.update(.1);
  assert.deepEqual(sim.agents.map(a => [a.px, a.py, a.phase, a.timer]), before);
  assert.equal(sim.getStats().decisions, stats.decisions);
  sim.command('toggleKill'); assert.equal(sim.getStats().frozen, false);
});

test('busy office preserves seed, reservations, routes, coffee breaks and period resets', () => {
  const a = fixture(), b = fixture();
  let cafe = false, wait = false, concurrent = false;
  const completed = new Set<number>();
  for (let frame = 0; frame < 9000; frame++) {
    a.sim.update(.1); b.sim.update(.1);
    const reservations = a.sim.agents.map(x => x.spot).filter(Boolean);
    assert.equal(new Set(reservations).size, reservations.length);
    concurrent ||= a.sim.agents.filter(x => x.moving).length >= 5;
    for (const agent of a.sim.agents) {
      cafe ||= agent.phase === 'rest' || !!agent.onBreak;
      wait ||= agent.phase === 'wait';
      if (agent.ok + agent.denied) completed.add(agent.id);
      assert.equal(blockedGrid[agent.cell.y * GRID_W + agent.cell.x], 0);
      if (agent.path.length) assert.ok(canStep(agent.cell.x, agent.cell.y, agent.path[0].x, agent.path[0].y));
    }
  }
  assert.ok(cafe && wait && concurrent);
  assert.equal(completed.size, 12, 'all buyers must progress through a decision');
  assert.ok(a.events.filter(e => e.text.includes('New period')).length >= 4);
  assert.deepEqual(a.events, b.events);
  assert.deepEqual(a.sim.getStats(), b.sim.getStats());
  assert.deepEqual(a.sim.agents.map(x => [x.px, x.py, x.phase, x.ok, x.denied]), b.sim.agents.map(x => [x.px, x.py, x.phase, x.ok, x.denied]));
});

test('zoom and pan preserve character hit testing; packet state reads do not mutate agents', () => {
  const { sim } = fixture();
  for (const zoom of [.6, 1, 2.4]) {
    const cam = fitCamera(1200, 800, 1.75, zoom, 60, -30);
    const a = buyer(sim), p = toScreen(cam, a.px, a.py, 20);
    assert.equal(agentAt(cam, sim, ...p), a.id);
  }
  sim.command('purchase'); sim.update(.1);
  const a: Agent = buyer(sim), before = JSON.stringify(a);
  for (let i = 0; i < 100; i++) packetFor(a);
  assert.equal(JSON.stringify(a), before);
});

test('rendering is read-only and cached frames allocate no new canvases or gradients', async () => {
  const { drawStatic, drawDynamic } = await import('../src/components/office/render.ts');
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const originalPath = Object.getOwnPropertyDescriptor(globalThis, 'Path2D');
  let canvases = 0, gradients = 0;
  const context = () => new Proxy({} as CanvasRenderingContext2D, {
    get(target, key) {
      if (key in target) return Reflect.get(target, key);
      if (key === 'measureText') return (text: string) => ({ width: text.length * 6 });
      if (key === 'createRadialGradient' || key === 'createLinearGradient') return () => { gradients++; return { addColorStop() {} }; };
      return () => {};
    },
  });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: { createElement() { canvases++; return { width: 0, height: 0, getContext: context }; } } });
  Object.defineProperty(globalThis, 'Path2D', { configurable: true, value: class {} });
  try {
    const { sim } = fixture();
    for (let i = 0; i < 260; i++) sim.update(.1);
    const before = JSON.stringify({ agents: sim.agents, stats: sim.getStats(), time: sim.time, packets: sim.packets });
    const labels = { rooms: Object.fromEntries(Object.entries(officeEn.rooms).map(([k,v]) => [k,v.name])) as Record<keyof typeof officeEn.rooms,string>, sellers: Object.values(officeEn.sim.sellers), font: 'sans-serif', mono: 'monospace' };
    const cam = fitCamera(1400, 900, 1.75, 1, 0, 0), ctx = context();
    drawStatic(ctx, cam, labels);
    drawDynamic(ctx, cam, sim, labels, { selected: null, hover: null, compact: false });
    const warmCanvases = canvases, warmGradients = gradients;
    for (let i = 0; i < 120; i++) drawDynamic(ctx, cam, sim, labels, { selected: 0, hover: null, compact: false, reducedMotion: i % 2 === 0 });
    assert.equal(canvases, warmCanvases);
    assert.equal(gradients, warmGradients);
    assert.equal(JSON.stringify({ agents: sim.agents, stats: sim.getStats(), time: sim.time, packets: sim.packets }), before);
  } finally {
    if (originalDocument) Object.defineProperty(globalThis, 'document', originalDocument); else Reflect.deleteProperty(globalThis, 'document');
    if (originalPath) Object.defineProperty(globalThis, 'Path2D', originalPath); else Reflect.deleteProperty(globalThis, 'Path2D');
  }
});
