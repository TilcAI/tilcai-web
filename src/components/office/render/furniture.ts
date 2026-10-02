import { ROOM_BY_ID } from "../layout";
import type { Furniture } from "../types";
import { hologram } from "./holograms";
import { box, P, poly, hexA } from "./geometry";

function drawFurnitureBase(ctx: CanvasRenderingContext2D, it: Furniture, t: number) {
  const r = ROOM_BY_ID[it.room];
  const x0 = it.x0, y0 = it.y0, x1 = it.x1 + 1, y1 = it.y1 + 1;
  switch (it.kind) {
    case "desk": {
      const i = 0.12;
      box(ctx, x0 + i, y0 + i, x1 - i, y1 - i, 13, "#2E2A48", "#1E1B33", "#16142A");
      const back = it.room === "business";
      // Monitor standing on the desk, parallel to x.
      const my = back ? y0 + 0.62 : y0 + 0.32;
      poly(ctx, [P(x0 + 0.22, my, 15), P(x1 - 0.22, my, 15), P(x1 - 0.22, my, 31), P(x0 + 0.22, my, 31)]);
      ctx.fillStyle = "#0C0B1A"; ctx.fill();
      if (!back) {
        poly(ctx, [P(x0 + 0.27, my, 17), P(x1 - 0.27, my, 17), P(x1 - 0.27, my, 29), P(x0 + 0.27, my, 29)]);
        ctx.fillStyle = hexA(r.color, 0.55 + 0.15 * Math.sin(t * 2 + x0 * 3 + y0)); ctx.fill();
      } else {
        ctx.strokeStyle = hexA(r.color, 0.6); ctx.lineWidth = 0.8; ctx.stroke();
      }
      break;
    }
    case "table": {
      box(ctx, x0 + 0.2, y0 + 0.2, x1 - 0.2, y1 - 0.2, 12, "#2B2163", "#1C1640", "#151133");
      poly(ctx, [P(x0 + 0.2, y0 + 0.2, 12), P(x1 - 0.2, y0 + 0.2, 12), P(x1 - 0.2, y1 - 0.2, 12), P(x0 + 0.2, y1 - 0.2, 12)]);
      ctx.strokeStyle = "rgba(140,112,255,.95)"; ctx.lineWidth = 1.4; ctx.stroke();
      poly(ctx, [P(x0 + 0.9, y0 + 0.9, 12.5), P(x1 - 0.9, y0 + 0.9, 12.5), P(x1 - 0.9, y1 - 0.9, 12.5), P(x0 + 0.9, y1 - 0.9, 12.5)]);
      ctx.fillStyle = "rgba(111,76,255,.22)"; ctx.fill();
      break;
    }
    case "console": {
      box(ctx, x0 + 0.15, y0 + 0.2, x1 - 0.15, y1 - 0.2, 16, "#25224A", "#191733", "#121029");
      poly(ctx, [P(x0 + 0.3, y0 + 0.35, 16.5), P(x1 - 0.3, y0 + 0.35, 16.5), P(x1 - 0.3, y1 - 0.35, 16.5), P(x0 + 0.3, y1 - 0.35, 16.5)]);
      ctx.fillStyle = hexA(r.color, 0.5 + 0.2 * Math.sin(t * 3 + x0)); ctx.fill();
      break;
    }
    case "rack": {
      const i = 0.14;
      box(ctx, x0 + i, y0 + i, x1 - i, y1 - i, 64, "#232542", "#171a31", "#10132a");
      for (let k = 0; k < 8; k++) {
        const z = 8 + k * 6.5;
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
      box(ctx, x0 + 0.34, y0 + 0.34, x1 - 0.34, y1 - 0.34, 8, "#3A2E2A", "#2A211E", "#211a17");
      const [cx, cy] = P(x0 + 0.5, y0 + 0.5, 20);
      ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fillStyle = "#2F8A5A"; ctx.fill();
      ctx.beginPath(); ctx.arc(cx - 3, cy - 4, 6, 0, Math.PI * 2); ctx.fillStyle = "#4BCA81"; ctx.fill();
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
    case "podium": {
      box(ctx, x0 + 0.15, y0 + 0.25, x1 - 0.15, y1 - 0.2, 15, "#3A3046", "#262033", "#1D1829");
      poly(ctx, [P(x0 + 0.4, y0 + 0.4, 15.5), P(x1 - 0.4, y0 + 0.4, 15.5), P(x1 - 0.4, y1 - 0.35, 15.5), P(x0 + 0.4, y1 - 0.35, 15.5)]);
      ctx.fillStyle = hexA("#FFA801", 0.5 + 0.15 * Math.sin(t * 2.4)); ctx.fill();
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
    const x = P(it.x0, it.y1 + 1)[0] - 18;
    const y = P(it.x0, it.y0)[1] - 85;
    const w = P(it.x1 + 1, it.y0)[0] - x + 18;
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
  if (it.kind === 'desk' || it.kind === 'console' || it.kind === 'podium') {
    const z = it.kind === 'desk' ? 14 : 17;
    // Screen light pools are cached together with the workstation.
    const glowPoint = P(x + .5, y + .5, z);
    const glow = ctx.createRadialGradient(...glowPoint, 1, ...glowPoint, 34);
    glow.addColorStop(0, hexA(color, .24)); glow.addColorStop(1, hexA(color, 0));
    ctx.fillStyle = glow; ctx.fillRect(glowPoint[0] - 34, glowPoint[1] - 34, 68, 68);
    if (it.kind === 'desk') {
      const screen = P(x + .5, y + .28, 32);
      ctx.save(); ctx.translate(...screen); ctx.transform(1, .5, 0, 1, 0, 0);
      ctx.fillStyle = '#080B23'; ctx.fillRect(-12, -13, 24, 17);
      ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.strokeRect(-12, -13, 24, 17);
      ctx.fillStyle = hexA(color, .7);
      for (let k = 0; k < 4; k++) ctx.fillRect(-9 + k * 5, -1 - k * 2, 3, 3 + k * 2);
      ctx.restore();
      if (it.room === 'business' || (it.room === 'hub' && (x + y) % 3 === 2)) {
        const q = P(x + .8, y + .3, 62);
        hologram(ctx, it.room === 'business' ? 'quote' : 'intent', q[0], q[1], color, .5, .85);
      }
    }
    // Edge lighting, inset keyboard, touch pad, cup and a tiny notebook.
    ctx.beginPath(); ctx.moveTo(...P(x + .13, yy - .12, z)); ctx.lineTo(...P(xx - .13, yy - .12, z));
    ctx.strokeStyle = hexA(color, .8); ctx.lineWidth = 1.4; ctx.stroke();
    box(ctx, x + .22, y + .65, x + .61, y + .82, 1, '#535076', '#211B43', '#17152F', z);
    for (let k = 0; k < 4; k++) {
      const p = P(x + .25 + k * .08, y + .73, z + 1);
      ctx.fillStyle = '#A8B8EA'; ctx.fillRect(p[0], p[1], 1.5, .7);
    }
    box(ctx, xx - .23, yy - .3, xx - .13, yy - .2, 4, '#E1DDEB', '#605680', '#39335E', z);
    if (it.room === 'business') {
      // Digital product showcase lives entirely on the existing seller desk.
      box(ctx, x + .2, y + .16, x + .44, y + .4, 6, '#F18BD5', '#9B377D', '#622269', z);
    }
    if (it.kind === 'podium') {
      // Warm task lamp, within the guardian's counter footprint.
      const a = P(x + .22, y + .4, z), b = P(x + .22, y + .4, z + 25);
      ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.strokeStyle = '#BDA090'; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(...b, 9, 4, 0, 0, Math.PI * 2); ctx.fillStyle = '#FFD166'; ctx.fill();
    }
  }
  if (it.kind === 'rack') {
    ctx.beginPath(); ctx.moveTo(...P(x + .15, yy - .14, 3)); ctx.lineTo(...P(x + .15, yy - .14, 44));
    ctx.strokeStyle = hexA(color, .7); ctx.lineWidth = 2; ctx.stroke();
    for (let k = 0; k < 5; k++) {
      const a = P(x + .23, y + .2 + k * .1, 46), b = P(x + .7, y + .2 + k * .1, 64);
      ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.strokeStyle = '#090E26'; ctx.lineWidth = 1.5; ctx.stroke();
    }
  }
  if (it.kind === 'table') {
    box(ctx, x + 1.2, y + 1.2, xx - 1.2, yy - 1.2, 12, '#483092', '#261857', '#19133F', 12, color);
    const p = P((x + xx) / 2, (y + yy) / 2, 25);
    const g = ctx.createRadialGradient(...p, 3, ...p, 85);
    g.addColorStop(0, '#925FF640'); g.addColorStop(1, '#925FF600');
    ctx.fillStyle = g; ctx.fillRect(p[0] - 85, p[1] - 85, 170, 170);
    ctx.beginPath(); ctx.ellipse(...p, 45, 22.5, 0, 0, Math.PI * 2); ctx.strokeStyle = '#B7A5FF'; ctx.lineWidth = 1.5; ctx.stroke();
    for (let k = 0; k < 4; k++) {
      const q = P(x + .4 + k * .8, yy - .4, 14);
      ctx.fillStyle = k % 2 ? '#51C5FB' : '#925FF6'; ctx.fillRect(q[0] - 5, q[1], 10, 2);
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
      ctx.fillStyle = k % 2 ? '#347664' : '#59A882'; ctx.fill();
    }
  }
}
