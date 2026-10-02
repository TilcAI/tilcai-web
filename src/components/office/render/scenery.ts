import type { Room } from "../types";
import { ROOMS, FURNITURE } from "../layout";
import { box, P, poly, hexA } from "./geometry";
import { PALETTE } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** Flat conduits follow existing corridors; they are paint, never obstacles. */
export function drawInfrastructure(ctx: Ctx) {
  const routes = [ [[13.5, .5], [13.5, 29.5]], [[26.5, .5], [26.5, 29.5]], [[.5, 13.5], [39.5, 13.5]], [[13.5, 8.5], [26.5, 8.5]], [[13.5, 20.5], [39.5, 20.5]], [[26.5, 21.5], [39.5, 21.5]] ];
  for (const route of routes) {
    ctx.beginPath();
    route.forEach(([x, y], i) => { const p = P(x, y); if (!i) ctx.moveTo(...p); else ctx.lineTo(...p); });
    ctx.strokeStyle = '#51C5FB10'; ctx.lineWidth = 8; ctx.stroke();
    ctx.strokeStyle = '#51C5FB45'; ctx.lineWidth = 1; ctx.stroke();
  }
  for (const [x, y] of [[13.5, 8.5], [26.5, 8.5], [13.5, 13.5], [26.5, 13.5], [13.5, 20.5], [26.5, 20.5]]) {
    poly(ctx, [P(x, y - .16), P(x + .16, y), P(x, y + .16), P(x - .16, y)]);
    ctx.fillStyle = '#57D2F9'; ctx.fill();
    const p = P(x, y);
    ctx.beginPath(); ctx.ellipse(...p, 13, 6.5, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#57D2F950'; ctx.stroke();
  }
  // Outer foundation, segmented illuminated service slots.
  for (let x = 1; x < 40; x += 2) {
    const a = P(x, 30, -6), b = P(x + .65, 30, -6);
    ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b);
    ctx.strokeStyle = x % 3 ? '#6024E870' : '#51C5FB90'; ctx.lineWidth = 2; ctx.stroke();
  }
}

/** This entire layer is cached by the static canvas, including gradients. */
export function drawRoomDetails(ctx: Ctx, r: Room) {
  const c = PALETTE[r.id];
  // Deterministic tile variation, without consuming the simulation PRNG.
  for (let x = r.x0; x <= r.x1; x++) for (let y = r.y0; y <= r.y1; y++) {
    const n = (x * 17 + y * 31) % 9;
    poly(ctx, [P(x + .05, y + .05), P(x + .95, y + .05), P(x + .95, y + .95), P(x + .05, y + .95)]);
    ctx.fillStyle = n < 3 ? hexA(c.primary, .045 + n * .018) : '#05061A12'; ctx.fill();
    if (n === 0) {
      const a = P(x + .12, y + .12), b = P(x + .34, y + .12);
      ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.strokeStyle = hexA(c.light, .32); ctx.lineWidth = 1; ctx.stroke();
    }
  }
  // Recessed desk circuits echo the live workflow without displaying full paths.
  for (const f of FURNITURE.filter(f => f.room === r.id && ['desk', 'console', 'podium'].includes(f.kind))) {
    const p = P(f.x0 + .5, f.y0 + .5);
    ctx.beginPath(); ctx.ellipse(...p, 27, 13.5, 0, 0, Math.PI * 2);
    ctx.strokeStyle = hexA(c.light, .24); ctx.lineWidth = 1.2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(...P(f.x0 + .5, f.y0 + .5)); ctx.lineTo(...P(f.x0 + .5, r.y0 + .6));
    ctx.strokeStyle = hexA(c.primary, .13); ctx.lineWidth = 1; ctx.stroke();
  }
  const x = r.x0, y = r.y0, xx = r.x1 + 1, yy = r.y1 + 1;
  // Recessed front fascia sits below floor level, so doors remain open.
  box(ctx, x, y, xx, yy, 9, 'transparent', '#08091E', '#050619', -10);
  for (const z of [-3, 0]) {
    ctx.beginPath(); ctx.moveTo(...P(x, yy, z)); ctx.lineTo(...P(xx, yy, z)); ctx.lineTo(...P(xx, y, z));
    ctx.strokeStyle = hexA(c.primary, z ? .25 : .8); ctx.lineWidth = z ? 5 : 1.5; ctx.stroke();
  }
  // Architectural cutaway: a solid service wall with framed glazing above it.
  // Segments respect the same door gaps used by the simulation.
  for (let k = x; k <= r.x1; k++) {
    if (r.doors.some(d => d.x === k && d.y === y)) continue;
    // Shadow is painted on the room floor, never over occupants.
    poly(ctx, [P(k, y), P(k + 1, y), P(k + 1.7, y + .65), P(k + .7, y + .65)]);
    ctx.fillStyle = '#05061A66'; ctx.fill();
    box(ctx, k, y - .09, k + 1, y + .09, 32, '#675B83', '#3B3356', '#211B37', 0, '#827399');
    poly(ctx, [P(k + .04, y, 34), P(k + .96, y, 34), P(k + .96, y, 79), P(k + .04, y, 79)]);
    ctx.fillStyle = '#171831BB'; ctx.fill();
    ctx.strokeStyle = '#6C658455'; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(...P(k + .12, y, 74)); ctx.lineTo(...P(k + .75, y, 42));
    ctx.strokeStyle = '#AFA4D016'; ctx.stroke();
    box(ctx, k, y - .06, k + 1, y + .06, 3, '#73668E', '#423755', '#312741', 80);
    if ((k - x) % 3 === 0) {
      box(ctx, k - .07, y - .13, k + .07, y + .13, 86, '#776889', '#473859', '#2E2444');
      ctx.beginPath(); ctx.moveTo(...P(k + .07, y + .14, 38)); ctx.lineTo(...P(k + .07, y + .14, 70));
      ctx.strokeStyle = hexA(c.light, .65); ctx.lineWidth = 1.5; ctx.stroke();
    }
  }
  // The adjacent wall stays low so the room reads as an open dollhouse.
  for (let k = y; k <= r.y1; k++) {
    if (r.doors.some(d => d.x === x && d.y === k)) continue;
    box(ctx, x - .08, k, x + .08, k + 1, 20, '#605677', '#302943', '#211B37', 0, '#8D7E9C55');
  }
  for (const d of r.doors) {
    const p = P(d.x + .5, d.y + .5);
    const g = ctx.createRadialGradient(...p, 0, ...p, 25);
    g.addColorStop(0, hexA(c.primary, .28)); g.addColorStop(1, hexA(c.primary, 0));
    ctx.fillStyle = g; ctx.fillRect(p[0] - 25, p[1] - 25, 50, 50);
  }
}

export const ROOM_ANCHORS = ROOMS.map(r => ({ room: r.id, ...({
  hub: { x: 6.5, y: 20.5, z: 64 }, business: { x: 8.5, y: 4.5, z: 65 },
  core: { x: 20, y: 14, z: 90 }, budget: { x: 20, y: 4.5, z: 74 },
  vault: { x: 34.5, y: 6.5, z: 78 }, receipts: { x: 35.5, y: 18.5, z: 67 },
  approval: { x: 20, y: 25.5, z: 72 }, cafe: { x: 30.5, y: 24.5, z: 62 },
}[r.id]) }));
