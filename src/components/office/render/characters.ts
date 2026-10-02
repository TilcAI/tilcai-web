import type { Agent } from "../sim";
import { PALETTE, ROLE_ROOM } from "./palette";
import { glyph, type Glyph } from "./holograms";
import { iso, poly, shade } from "./geometry";

export function drawAgent(ctx: CanvasRenderingContext2D, a: Agent, seated: boolean, selected: boolean, t: number, reduced: boolean) {
  const [ax, ay] = iso(a.px, a.py);
  ctx.save();
  ctx.translate(ax, ay);
  ctx.scale(AGENT_SCALE, AGENT_SCALE);
  const fx = 0, fy = 0;
  const walk = a.moving && !reduced ? Math.sin(a.walkPhase) : 0;
  const bob = reduced ? 0 : a.moving ? Math.abs(Math.cos(a.walkPhase)) * 1.1 : Math.sin(t * 1.7 + a.id) * .45;
  const color = PALETTE[ROLE_ROOM[a.role]].primary;
  // Shadow / selection ring
  ctx.beginPath(); ctx.ellipse(fx, fy, selected ? 13 : 9, selected ? 6.5 : 4.5, 0, 0, Math.PI * 2);
  if (selected) { ctx.strokeStyle = "#A994FF"; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.fillStyle = "rgba(5,6,26,.6)"; ctx.fill();
  const base = fy - (seated ? 5 : 0) - bob;
  if (!seated) {
    ctx.fillStyle = "#1A1730";
    ctx.fillRect(fx - 5, base - 10 + Math.max(0, walk) * 2.4, 3.6, 10 - Math.max(0, walk) * 2.4);
    ctx.fillRect(fx + 1.4, base - 10 + Math.max(0, -walk) * 2.4, 3.6, 10 - Math.max(0, -walk) * 2.4);
  }
  // Torso as a small iso prism
  const tb = base - (seated ? 2 : 9);
  const w = 7, d = 3.5, h = 13;
  const top = shade(color, 0.28), left = color, right = shade(color, -0.28);
  poly(ctx, [[fx - w, tb - d * 0.0], [fx, tb + d], [fx, tb + d - h], [fx - w, tb - h]]);
  ctx.fillStyle = left; ctx.fill();
  poly(ctx, [[fx, tb + d], [fx + w, tb], [fx + w, tb - h], [fx, tb + d - h]]);
  ctx.fillStyle = right; ctx.fill();
  poly(ctx, [[fx - w, tb - h], [fx, tb + d - h], [fx + w, tb - h], [fx, tb - h - d]]);
  ctx.fillStyle = top; ctx.fill();
  // Sleeves, hands, lanyard and shoes give the silhouette depth.
  const swing = seated ? Math.sin(t * 2 + a.id) * .6 : walk * 2;
  ctx.strokeStyle = color; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-7, tb - 10); ctx.lineTo(-8 - swing, tb - 1); ctx.moveTo(7, tb - 10); ctx.lineTo(8 + swing, tb - 1); ctx.stroke();
  ctx.fillStyle = a.skin; ctx.fillRect(-10 - swing, tb - 2, 3, 3); ctx.fillRect(7 + swing, tb - 2, 3, 3);
  ctx.fillStyle = '#E1DDEB'; ctx.fillRect(-2, tb - 10, 2, 4);
  if (!seated) { ctx.fillStyle = '#727599'; ctx.fillRect(-6, base - 2, 5, 2); ctx.fillRect(1, base - 2, 5, 2); }
  // Head
  const hy = tb - h - 6.5;
  ctx.beginPath(); ctx.arc(fx, hy, 5.6, 0, Math.PI * 2); ctx.fillStyle = a.skin; ctx.fill();
  ctx.beginPath(); ctx.arc(fx, hy - 0.8, 5.8, Math.PI * 1.05, Math.PI * 1.95); ctx.fillStyle = a.hair; ctx.fill();
  const next = a.path[0];
  const facing = next ? Math.sign((next.x + .5 - a.px) - (next.y + .5 - a.py)) || 1 : a.id % 2 ? 1 : -1;
  ctx.fillStyle = '#241932'; ctx.fillRect(facing * 2, hy - .4, 1.2, 1.3);
  if (a.role === 'vault' || a.role === 'policy') { ctx.strokeStyle = '#57D2F9'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-4, hy); ctx.lineTo(4, hy); ctx.stroke(); }
  if (a.role === 'barista') { ctx.fillStyle = '#F2D5C4'; ctx.fillRect(-4, tb - 9, 7, 11); }
  if (a.role === 'guardian') { ctx.fillStyle = '#FFD166'; ctx.fillRect(3, tb - 10, 3, 3); }
  const badge: Partial<Record<Agent['role'], Glyph>> = { seller: 'quote', policy: 'shield', budget: 'budget', guardian: 'approval', vault: a.home.x === 34 ? 'relayer' : 'stellar', receipts: 'receipt', barista: 'cafe' };
  const icon = badge[a.role];
  if (icon) glyph(ctx, icon, 12, tb - 13, PALETTE[ROLE_ROOM[a.role]].light, .25);
  ctx.restore();
}

export const AGENT_SCALE = 1.45;

