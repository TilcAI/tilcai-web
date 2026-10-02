import type { Agent, OfficeSim } from "../sim";
import type { RoomId } from "../types";
import { P, hexA } from "./geometry";
import { glyph, hologram, type Glyph } from "./holograms";
import { PALETTE, TONE } from "./palette";
import { ROOM_ANCHORS } from "./scenery";

const ROOM_GLYPH: Record<RoomId, Glyph> = { hub: 'intent', business: 'quote', core: 'shield', budget: 'budget', vault: 'stellar', receipts: 'receipt', approval: 'approval', cafe: 'cafe' };
const EVENT_GLYPH = { intent: 'intent', quote: 'quote', allow: 'check', deny: 'deny', approval: 'approval', x402: 'payment', receipt: 'receipt', system: 'retry' } as const;
const circle = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, alpha: number) => {
  ctx.beginPath(); ctx.ellipse(x, y, r, r / 2, 0, 0, Math.PI * 2);
  ctx.strokeStyle = hexA(color, alpha); ctx.lineWidth = 1.3; ctx.stroke();
};

/** Elevated room objects share the same depth ordering as furniture and people. */
export function drawRoomHologram(ctx: CanvasRenderingContext2D, room: RoomId, sim: OfficeSim, t: number, reduced: boolean) {
  const anchor = ROOM_ANCHORS.find(a => a.room === room)!;
  const c = PALETTE[room];
  const [x, base] = P(anchor.x, anchor.y, anchor.z);
  const y = base + (reduced ? 0 : Math.sin(t * 1.3 + anchor.x) * 2);
  const floor = P(anchor.x, anchor.y, 19);
  circle(ctx, floor[0], floor[1], room === 'core' ? 55 : 25, c.light, .4);
  ctx.beginPath(); ctx.moveTo(floor[0] - 9, floor[1]); ctx.lineTo(x - 22, y + 20); ctx.lineTo(x + 22, y + 20); ctx.lineTo(floor[0] + 9, floor[1]);
  ctx.fillStyle = hexA(c.primary, .055); ctx.fill();
  if (room === 'budget') {
    const nodes = [[0, -23], [-26, 0], [26, 0], [-42, 25], [-14, 25], [14, 25], [42, 25]];
    const hold = sim.agents.some(a => a.role === 'budget' && a.bubble?.tone === 'allow');
    for (const [i, j] of [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]]) {
      const a = nodes[i], b = nodes[j];
      ctx.beginPath(); ctx.moveTo(x + a[0], y + a[1]); ctx.lineTo(x + b[0], y + b[1]); ctx.strokeStyle = hexA(c.light, .6); ctx.lineWidth = 1; ctx.stroke();
      if (hold) {
        const u = reduced ? .5 : (t * .6 + j * .12) % 1;
        ctx.fillStyle = '#E1DDEB'; ctx.fillRect(x + a[0] + (b[0] - a[0]) * u - 2, y + a[1] + (b[1] - a[1]) * u - 2, 4, 4);
      }
    }
    nodes.forEach(([dx, dy], i) => {
      ctx.beginPath(); ctx.arc(x + dx, y + dy, i ? 4 : 7, 0, Math.PI * 2);
      ctx.fillStyle = '#291698'; ctx.fill(); ctx.strokeStyle = c.light; ctx.stroke();
    });
    const stats = sim.getStats();
    ctx.fillStyle = '#E1DDEB20'; ctx.fillRect(x - 38, y + 39, 76, 3);
    ctx.fillStyle = c.light; ctx.fillRect(x - 38, y + 39, 76 * Math.max(0, stats.rootLeftCents / stats.rootCapCents), 3);
    return;
  }
  if (room === 'core') {
    // The shared policy pedestal is the central TilcAI infrastructure node.
    for (let k = 0; k < 3; k++) {
      circle(ctx, x, y + 12 + k * 13, 42 - k * 6, c.light, .65 - k * .15);
      const angle = t * .35 + k * 2.1;
      ctx.beginPath(); ctx.arc(x + Math.cos(angle) * (42 - k * 6), y + 12 + k * 13 + Math.sin(angle) * (21 - k * 3), 2.5, 0, Math.PI * 2);
      ctx.fillStyle = k === 1 ? '#51C5FB' : '#E1DDEB'; ctx.fill();
    }
    hologram(ctx, 'stellar', x, y - 20, '#B7A5FF', 1.65);
    glyph(ctx, 'shield', x - 54, y + 10, c.light, .65);
    glyph(ctx, 'identity', x + 54, y + 10, '#51C5FB', .6);
    return;
  }
  if (room === 'vault') {
    hologram(ctx, 'stellar', x, y, c.light, 1.2);
    const left = P(31.5, 6.5, 24), right = P(34.5, 6.5, 24);
    ctx.beginPath(); ctx.moveTo(...left); ctx.lineTo(...right); ctx.strokeStyle = hexA(c.light, .5); ctx.lineWidth = 2; ctx.stroke();
    const active = sim.agents.find(a => a.phase === 'settle');
    if (active) {
      const u = reduced ? .5 : Math.max(0, Math.min(1, 1 - active.timer / 2.4));
      const px = left[0] + (right[0] - left[0]) * u, py = left[1] + (right[1] - left[1]) * u;
      glyph(ctx, u > .88 ? 'check' : 'payment', px, py - 8, '#E1DDEB', .65);
    }
    glyph(ctx, 'identity', left[0], left[1] - 20, c.light, .55);
    glyph(ctx, 'relayer', right[0], right[1] - 20, c.light, .55);
    return;
  }
  let kind = ROOM_GLYPH[room];
  if (room === 'approval') {
    const b = sim.agents.find(a => a.role === 'guardian')?.bubble;
    if (b?.tone === 'allow') kind = 'check';
    else if (b?.tone === 'deny') kind = 'deny';
  }
  hologram(ctx, kind, x, y, kind === 'deny' ? TONE.deny : c.light, room === 'approval' ? 1.2 : 1);
  if (room === 'cafe' && !reduced) {
    for (let k = 0; k < 3; k++) {
      const u = (t * .25 + k / 3) % 1;
      ctx.beginPath(); ctx.ellipse(x + Math.sin(u * 4 + k) * 5, y - 24 - u * 20, 2 + u * 3, 1.5, 0, 0, Math.PI * 2);
      ctx.strokeStyle = hexA(c.light, (1 - u) * .28); ctx.stroke();
    }
  }
}

/** Floor FX precede the depth queue. No gradients, random calls or DOM nodes per frame. */
export function drawAmbient(ctx: CanvasRenderingContext2D, sim: OfficeSim, t: number, reduced: boolean, selected: number | null) {
  for (const a of sim.agents) {
    const p = P(a.px, a.py);
    if (a.phase === 'policy' || a.mark) {
      const decision = a.phase === 'policy' && a.timer < .7 ? a.op?.decision : null;
      const color = a.mark?.kind === 'deny' || decision === 'DENY' ? TONE.deny : a.mark?.kind === 'allow' || decision === 'ALLOW' ? TONE.allow : decision === 'REQUIRE_APPROVAL' ? TONE.approval : a.phase === 'policy' ? PALETTE.core.light : TONE.approval;
      const u = reduced ? .4 : (t * .6 + a.id * .1) % 1;
      circle(ctx, p[0], p[1], 17 + u * 15, color, .65 * (1 - u));
      if (a.phase === 'policy') circle(ctx, p[0], p[1] - (reduced ? 14 : (1 - a.timer / 2.3) * 35), 15, PALETTE.core.light, .5);
    }
    const freshIntent = a.bubble?.tone === 'intent' && sim.time - a.bubble.born < 1.4;
    if (!reduced && a.moving && (a.id === selected || freshIntent)) {
      const color = packetFor(a)?.color ?? PALETTE.hub.light;
      ctx.beginPath(); ctx.moveTo(...p);
      for (const step of a.path.slice(0, 3)) ctx.lineTo(...P(step.x + .5, step.y + .5));
      ctx.strokeStyle = hexA(color, .4); ctx.lineWidth = 1.3; ctx.stroke();
      for (const step of a.path.slice(0, 3)) { const q = P(step.x + .5, step.y + .5); ctx.fillStyle = hexA(color, .7); ctx.fillRect(q[0] - 1.5, q[1] - 1.5, 3, 3); }
    }
  }
  if (reduced) return;
  for (const a of ROOM_ANCHORS) {
    const c = PALETTE[a.room];
    for (let k = 0; k < 3; k++) {
      const u = (t * .08 + k * .33 + a.x * .13) % 1;
      const p = P(a.x + Math.sin(k * 2.4) * 1.2, a.y + Math.cos(k * 2.4), 8 + u * 35);
      ctx.fillStyle = hexA(c.light, Math.sin(u * Math.PI) * .35); ctx.fillRect(p[0], p[1], 1.5, 1.5);
    }
  }
}

/** Stage identity follows the actual operation; it never advances independently. */
export function packetFor(a: Agent): { kind: Glyph; color: string } | null {
  if (a.phase === 'rest' || (a.onBreak && !a.moving)) return { kind: 'cafe', color: PALETTE.cafe.light };
  if (a.role !== 'buyer' || !a.op) return null;
  if (a.op.reasons.includes('DUPLICATE_PAYMENT_INTENT')) return { kind: 'retry', color: '#925FF6' };
  if (a.op.injected && a.phase !== 'toSeller') return { kind: 'deny', color: TONE.deny };
  const phase = a.phase === 'wait' ? a.task : a.phase;
  switch (phase) {
    case 'toSeller': return { kind: 'intent', color: PALETTE.hub.light };
    case 'quote': case 'quoting': case 'toCore': return { kind: 'quote', color: PALETTE.business.light };
    case 'policy': return { kind: 'shield', color: PALETTE.core.light };
    case 'toApproval': case 'approval': return { kind: 'approval', color: PALETTE.approval.light };
    case 'toVault': case 'settle': return { kind: 'payment', color: PALETTE.vault.light };
    case 'toReceipts': case 'receipt': return { kind: 'receipt', color: PALETTE.receipts.light };
    case 'denied': return { kind: 'deny', color: TONE.deny };
    default: return null;
  }
}

export function drawAgentEffects(ctx: CanvasRenderingContext2D, a: Agent, time: number, t: number, reduced: boolean) {
  const packet = packetFor(a);
  if (packet) {
    const p = P(a.px, a.py, 43 + (reduced ? 0 : Math.sin(t * 2 + a.id) * 1.5));
    hologram(ctx, packet.kind, p[0] + 18, p[1], packet.color, .38, .9);
  }
  if (!a.bubble || a.role === 'buyer') return;
  const b = a.bubble;
  const age = time - b.born;
  const alpha = reduced ? .9 : Math.max(0, Math.min(1, age * 4, (b.until - time) * 2));
  const p = P(a.px, a.py, 69);
  // Receipt materializes then contracts into the terminal on the final second.
  const scale = b.tone === 'receipt' && !reduced ? .58 * Math.min(1, (b.until - time) * 1.4) : .58;
  hologram(ctx, EVENT_GLYPH[b.tone], p[0], p[1], TONE[b.tone], scale, alpha);
}
