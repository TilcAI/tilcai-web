import { ROOM_BY_ID } from "../layout";
import type { Furniture } from "../types";
import { commandTable, workstation, tilcayoDock } from "./workstations";
import { box, P, poly, hexA } from "./geometry";

function drawFurnitureBase(ctx: CanvasRenderingContext2D, it: Furniture, t: number) {
  const r = ROOM_BY_ID[it.room];
  const x0 = it.x0, y0 = it.y0, x1 = it.x1 + 1, y1 = it.y1 + 1;
  switch (it.kind) {
    case "dock": tilcayoDock(ctx, x0, y0); break;
    case "desk": case "console": case "podium":
      workstation(ctx, it, r.color); break;
    case "table":
      commandTable(ctx, it, r.color); break;
    case "rack": {
      const i = 0.14;
      box(ctx, x0 + i, y0 + i, x1 - i, y1 - i, 78, "#454563", "#25283F", "#141A2E");
      for (let k = 0; k < 8; k++) {
        const z = 10 + k * 8;
        const on = Math.sin(t * (2 + (k % 3)) + x0 * 1.7 + k) > -0.2;
        const [ax, ay] = P(x0 + 0.3, y1 - i, z);
        ctx.fillStyle = on ? (k % 2 ? "#66D8FF" : "#4BCA81") : "rgba(102,216,255,.15)";
        ctx.fillRect(ax - 1, ay - 1, 2.4, 2.4);
        const [bx, by] = P(x0 + 0.55, y1 - i, z);
        ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.fillRect(bx, by - 0.8, 10, 1.4);
      }
      break;
    }
    case "plant": {
      box(ctx, x0 + 0.34, y0 + 0.34, x1 - 0.34, y1 - 0.34, 8, "#79708F", "#423753", "#30263F");
      break;
    }
    case "sofa": {
      box(ctx, x0 + 0.1, y0 + 0.2, x1 - 0.1, y1 - 0.15, 8, "#3A374D", "#2A2739", "#201E30");
      box(ctx, x0 + 0.1, y0 + 0.15, x1 - 0.1, y0 + 0.42, 16, "#45425C", "#2E2B42", "#24223A");
      break;
    }
    case "counter": {
      box(ctx, x0 + 0.1, y0 + 0.2, x1 - 0.1, y1 - 0.2, 16, "#4A4560", "#2E2B42", "#24223A");
      box(ctx, x0 + 0.3, y0 + 0.3, x0 + 0.75, y0 + 0.7, 12, "#1B1830", "#14122A", "#0E0C22", 16);
      const [sx, sy] = P(x0 + 0.52, y0 + 0.5, 30 + ((t * 8) % 8));
      ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.beginPath(); ctx.arc(sx, sy, 2, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case "cabinet": {
      box(ctx, x0 + 0.15, y0 + 0.2, x1 - 0.15, y1 - 0.2, 24, "#2E2A48", "#201D36", "#18162D");
      for (let k = 0; k < 3; k++) {
        ctx.beginPath(); const a = P(x0 + 0.25, y1 - 0.2, 5 + k * 7), b = P(x1 - 0.25, y1 - 0.2, 5 + k * 7);
        ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.strokeStyle = hexA(r.color, 0.45); ctx.lineWidth = 0.9; ctx.stroke();
      }
      break;
    }

  }
}


// Furniture stays in the depth queue, but its geometry is rasterized just once.
// This preserves occlusion with walking agents without rebuilding every desk each frame.
const sprites = new WeakMap<Furniture, { canvas: HTMLCanvasElement; x: number; y: number; w: number; h: number }>();
export function drawFurniture(ctx: CanvasRenderingContext2D, it: Furniture, t: number) {
  let sprite = sprites.get(it);
  if (!sprite) {
    const x = P(it.x0, it.y1 + 1)[0] - 28;
    const y = P(it.x0, it.y0)[1] - 105;
    const w = P(it.x1 + 1, it.y0)[0] - x + 28;
    const h = P(it.x1 + 1, it.y1 + 1)[1] - y + 16;
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(w * 2); canvas.height = Math.ceil(h * 2);
    const c = canvas.getContext('2d')!; c.scale(2, 2); c.translate(-x, -y);
    const p = P((it.x0 + it.x1 + 1) / 2, (it.y0 + it.y1 + 1) / 2);
    c.beginPath(); c.ellipse(p[0], p[1] + 5, w * .36, (it.x1 - it.x0 + it.y1 - it.y0 + 2) * 7, 0, 0, Math.PI * 2);
    c.fillStyle = '#05061A80'; c.fill();
    drawFurnitureBase(c, it, 0);
    details(c, it);
    sprite = { canvas, x, y, w, h }; sprites.set(it, sprite);
  }
  ctx.drawImage(sprite.canvas, sprite.x, sprite.y, sprite.w, sprite.h);
  const color = ROOM_BY_ID[it.room].color;
  if (it.kind === 'desk' || it.kind === 'console' || it.kind === 'rack') {
    const p = P(it.x0 + .28, it.y0 + .7, it.kind === 'rack' ? 36 : 18);
    ctx.fillStyle = hexA(color, .4 + .3 * Math.sin(t * 1.5 + it.x0 + it.y0));
    ctx.fillRect(p[0], p[1], 3, 1.5);
  }
}

function details(ctx: CanvasRenderingContext2D, it: Furniture) {
  const x = it.x0, y = it.y0, xx = it.x1 + 1, yy = it.y1 + 1;
  const color = ROOM_BY_ID[it.room].color;
  if (it.kind === 'rack') {
    ctx.beginPath(); ctx.moveTo(...P(x + .15, yy - .14, 3)); ctx.lineTo(...P(x + .15, yy - .14, 44));
    ctx.strokeStyle = hexA(color, .7); ctx.lineWidth = 2; ctx.stroke();
    for (let k = 0; k < 5; k++) {
      const a = P(x + .23, y + .2 + k * .1, 78), b = P(x + .7, y + .2 + k * .1, 78);
      ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.strokeStyle = '#090E26'; ctx.lineWidth = 1.5; ctx.stroke();
    }
  }
  if (it.kind === 'counter') {
    for (let k = 0; k < 3; k++) {
      box(ctx, x + 1.1 + k * .45, y + .45, x + 1.24 + k * .45, y + .59, 4, '#F2D5C4', '#B7A5A0', '#786985', 17);
    }
    const p = P(x + .52, y + .62, 23);
    ctx.fillStyle = '#F5A623'; ctx.fillRect(p[0], p[1], 4, 3);
  }
  if (it.kind === 'sofa') {
    for (let k = x; k < xx; k++) {
      box(ctx, k + .18, y + .45, k + .82, y + .85, 2, hexA(color, .4), '#292243', '#201C36', 8);
    }
  }
  if (it.kind === 'plant') {
    const p = P(x + .5, y + .5, 12);
    for (let k = 0; k < 7; k++) {
      const a = k * 2.4;
      ctx.beginPath(); ctx.moveTo(...p);
      ctx.quadraticCurveTo(p[0] + Math.cos(a) * 19, p[1] - 21 - k * 2, p[0] + Math.cos(a) * 14, p[1] - 29 - k);
      ctx.quadraticCurveTo(p[0] + Math.cos(a) * 5, p[1] - 26, ...p);
      ctx.fillStyle = k % 2 ? '#405979' : '#79759C'; ctx.fill();
    }
  }
}
