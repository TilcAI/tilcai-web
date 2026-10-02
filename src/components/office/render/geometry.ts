export const HALF_W = 32;
export const HALF_H = 16;
export const iso = (x: number, y: number): [number, number] => [(x - y) * HALF_W, (x + y) * HALF_H];

export function poly(ctx: CanvasRenderingContext2D, pts: [number, number][]) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}

export const P = (x: number, y: number, z = 0): [number, number] => { const [a, b] = iso(x, y); return [a, b - z]; };

export function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(k >= 0 ? v + (255 - v) * k : v * (1 + k))));
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

/** Axis-aligned iso box: x0..x1, y0..y1 in tiles, from z0 to z0+h world px. */
export function box(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, h: number, top: string, left: string, right: string, z0 = 0, stroke?: string) {
  const zt = z0 + h;
  // +y face (screen bottom-left)
  poly(ctx, [P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, zt), P(x0, y1, zt)]);
  ctx.fillStyle = left; ctx.fill();
  // +x face (screen bottom-right)
  poly(ctx, [P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, zt), P(x1, y0, zt)]);
  ctx.fillStyle = right; ctx.fill();
  poly(ctx, [P(x0, y0, zt), P(x1, y0, zt), P(x1, y1, zt), P(x0, y1, zt)]);
  ctx.fillStyle = top; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 0.8; ctx.stroke(); }
}

