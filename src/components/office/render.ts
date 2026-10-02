// Canvas 2D renderer for the isometric office (2:1 projection). Pure drawing: reads the simulation, never mutates it.
import { FURNITURE, GRID_H, GRID_W, HOLOGRAMS, ROOM_BY_ID, ROOMS, VAULT_DOOR, WALL_SCREENS } from "./layout";
import type { Agent, OfficeSim } from "./sim";
import type { EventKind, Furniture, RoomId } from "./types";

export const HALF_W = 32;
export const HALF_H = 16;

export interface Camera {
  /** World → CSS pixels. */
  scale: number;
  /** CSS-pixel offset of world origin. */
  ox: number;
  oy: number;
  dpr: number;
  width: number;
  height: number;
}

export interface RenderLabels {
  rooms: Record<RoomId, string>;
  sellers: string[];
  font: string;
  mono: string;
}

const TONE: Record<EventKind, string> = {
  intent: "#4C66FF",
  quote: "#FF79C6",
  allow: "#4BCA81",
  deny: "#ED4A6D",
  approval: "#FFA801",
  x402: "#66D8FF",
  receipt: "#4BCA81",
  system: "#A994FF",
};

export const MAP_BOUNDS = {
  minX: -GRID_H * HALF_W,
  maxX: GRID_W * HALF_W,
  minY: -60,
  maxY: (GRID_W + GRID_H) * HALF_H + 10,
};

/** World (tile) coordinates → world pixels (before camera). */
export const iso = (x: number, y: number): [number, number] => [(x - y) * HALF_W, (x + y) * HALF_H];

export const toScreen = (cam: Camera, x: number, y: number, z = 0): [number, number] => {
  const [wx, wy] = iso(x, y);
  return [wx * cam.scale + cam.ox, (wy - z) * cam.scale + cam.oy];
};

function applyWorld(ctx: CanvasRenderingContext2D, cam: Camera) {
  ctx.setTransform(cam.scale * cam.dpr, 0, 0, cam.scale * cam.dpr, cam.ox * cam.dpr, cam.oy * cam.dpr);
}

function poly(ctx: CanvasRenderingContext2D, pts: [number, number][]) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}

const P = (x: number, y: number, z = 0): [number, number] => { const [a, b] = iso(x, y); return [a, b - z]; };

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(k >= 0 ? v + (255 - v) * k : v * (1 + k))));
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

/** Axis-aligned iso box: x0..x1, y0..y1 in tiles, from z0 to z0+h world px. */
function box(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, h: number, top: string, left: string, right: string, z0 = 0, stroke?: string) {
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

// ---------------------------------------------------------------------------
// Static layer: floors, walls, labels, screens
// ---------------------------------------------------------------------------

export function drawStatic(ctx: CanvasRenderingContext2D, cam: Camera, labels: RenderLabels) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cam.width * cam.dpr, cam.height * cam.dpr);
  applyWorld(ctx, cam);

  // Base slab with a soft extrusion so the floor reads as a platform.
  poly(ctx, [P(0, 0), P(GRID_W, 0), P(GRID_W, GRID_H), P(0, GRID_H)]);
  ctx.fillStyle = "#110F24"; ctx.fill();
  poly(ctx, [P(0, GRID_H), P(GRID_W, GRID_H), P(GRID_W, GRID_H, -14), P(0, GRID_H, -14)]);
  ctx.fillStyle = "#0A0819"; ctx.fill();
  poly(ctx, [P(GRID_W, 0), P(GRID_W, GRID_H), P(GRID_W, GRID_H, -14), P(GRID_W, 0, -14)]);
  ctx.fillStyle = "#070614"; ctx.fill();
  // Outer glow line
  poly(ctx, [P(0, 0), P(GRID_W, 0), P(GRID_W, GRID_H), P(0, GRID_H)]);
  ctx.strokeStyle = "rgba(111,76,255,.55)"; ctx.lineWidth = 1.4; ctx.stroke();

  // Corridor grid
  ctx.strokeStyle = "rgba(255,255,255,.035)"; ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 1; x < GRID_W; x++) { const a = P(x, 0), b = P(x, GRID_H); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
  for (let y = 1; y < GRID_H; y++) { const a = P(0, y), b = P(GRID_W, y); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
  ctx.stroke();

  for (const r of ROOMS) {
    const x1 = r.x1 + 1, y1 = r.y1 + 1;
    poly(ctx, [P(r.x0, r.y0), P(x1, r.y0), P(x1, y1), P(r.x0, y1)]);
    ctx.fillStyle = r.floor; ctx.fill();
    // subtle radial light in each room
    const [cx, cy] = P((r.x0 + x1) / 2, (r.y0 + y1) / 2);
    const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, (x1 - r.x0 + y1 - r.y0) * 18);
    g.addColorStop(0, hexA(r.color, 0.1)); g.addColorStop(1, hexA(r.color, 0));
    ctx.fillStyle = g; ctx.fill();
    // tile grid
    ctx.strokeStyle = "rgba(255,255,255,.05)"; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = r.x0 + 1; x < x1; x++) { const a = P(x, r.y0), b = P(x, y1); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
    for (let y = r.y0 + 1; y < y1; y++) { const a = P(r.x0, y), b = P(x1, y); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
    ctx.stroke();
  }

  // Painted room names on the floor, along the room's front-left edge.
  for (const r of ROOMS) {
    const text = labels.rooms[r.id].toUpperCase();
    const width = r.x1 - r.x0 - 0.6;
    const k = 1 / 50; // 50px font ≙ 1 tile
    const [ex, ey] = P(r.x0 + 0.5, r.y1 + 0.55);
    ctx.save();
    ctx.transform(HALF_W * k, HALF_H * k, -HALF_W * k, HALF_H * k, ex, ey);
    let size = r.id === "cafe" || r.id === "budget" || r.id === "receipts" ? 34 : 40;
    ctx.font = `700 ${size}px ${labels.font}`;
    const m = ctx.measureText(text).width;
    if (m > width * 50) { size = Math.floor(size * (width * 50) / m); ctx.font = `700 ${size}px ${labels.font}`; }
    ctx.fillStyle = hexA(r.color, r.id === "cafe" ? 0.35 : 0.62);
    ctx.textBaseline = "alphabetic";
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }

  // Low walls with door gaps.
  for (const r of ROOMS) {
    const doors = new Set(r.doors.map((d) => `${d.x},${d.y}`));
    const h = 7;
    const seg = (ax: number, ay: number, bx: number, by: number, open: boolean, back: boolean) => {
      if (open) return;
      poly(ctx, [P(ax, ay), P(bx, by), P(bx, by, h), P(ax, ay, h)]);
      ctx.fillStyle = hexA(r.color, back ? 0.2 : 0.12); ctx.fill();
      ctx.beginPath(); const a = P(ax, ay, h), b = P(bx, by, h); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
      ctx.strokeStyle = hexA(r.color, 0.85); ctx.lineWidth = 1.3; ctx.stroke();
    };
    for (let x = r.x0; x <= r.x1; x++) {
      seg(x, r.y0, x + 1, r.y0, doors.has(`${x},${r.y0}`), true);
      seg(x, r.y1 + 1, x + 1, r.y1 + 1, doors.has(`${x},${r.y1}`), false);
    }
    for (let y = r.y0; y <= r.y1; y++) {
      seg(r.x0, y, r.x0, y + 1, doors.has(`${r.x0},${y}`), true);
      seg(r.x1 + 1, y, r.x1 + 1, y + 1, doors.has(`${r.x1},${y}`), false);
    }
    // Door mats
    for (const d of r.doors) {
      poly(ctx, [P(d.x + 0.15, d.y + 0.15), P(d.x + 0.85, d.y + 0.15), P(d.x + 0.85, d.y + 0.85), P(d.x + 0.15, d.y + 0.85)]);
      ctx.fillStyle = hexA(r.color, 0.16); ctx.fill();
    }
  }

  // Wall screens on back walls.
  for (const s of WALL_SCREENS) {
    const r = ROOM_BY_ID[s.room];
    const y = r.y0 + 0.02, z0 = 12, z1 = 46;
    poly(ctx, [P(s.from, y, z0), P(s.to + 1, y, z0), P(s.to + 1, y, z1), P(s.from, y, z1)]);
    ctx.fillStyle = "#08071A"; ctx.fill();
    ctx.strokeStyle = hexA(r.color, 0.9); ctx.lineWidth = 1.2; ctx.stroke();
    // Text and rows, skewed onto the wall plane (along x, up = -z)
    const [ox, oy] = P(s.from + 0.2, y, z1 - 6);
    ctx.save();
    ctx.transform(0.894, 0.447, 0, 1, ox, oy);
    ctx.font = `700 9px ${labels.mono}`;
    ctx.fillStyle = hexA(r.color, 1);
    ctx.fillText(s.title, 0, 0);
    ctx.restore();
    const rows = 4, span = s.to + 1 - s.from - 0.4;
    for (let i = 0; i < rows; i++) {
      const len = span * (0.45 + ((i * 37 + s.from * 13) % 50) / 100);
      const zz = z1 - 13 - i * 6;
      ctx.beginPath(); const a = P(s.from + 0.2, y, zz), b = P(s.from + 0.2 + len, y, zz);
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
      ctx.strokeStyle = i % 3 === 2 ? "rgba(237,74,109,.75)" : i % 2 ? "rgba(75,202,129,.75)" : hexA(r.color, 0.6);
      ctx.lineWidth = 2; ctx.stroke();
    }
  }

  // Vault door: a round door on the back wall.
  {
    const { x, y, color } = VAULT_DOOR;
    const [cx, cy] = P(x + 1, y + 0.02, 28);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.transform(1, 0.5, 0, 1, 0, 0);
    ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fillStyle = "#0E1A2E"; ctx.fill(); ctx.strokeStyle = hexA(color, 0.95); ctx.lineWidth = 2.2; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 17, 0, Math.PI * 2); ctx.strokeStyle = hexA(color, 0.5); ctx.lineWidth = 1.2; ctx.stroke();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * 5, Math.sin(a) * 5); ctx.lineTo(Math.cos(a) * 15, Math.sin(a) * 15);
      ctx.strokeStyle = hexA(color, 0.75); ctx.lineWidth = 1.6; ctx.stroke();
    }
    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// Dynamic layer: furniture + agents depth-sorted, holograms, packets, bubbles
// ---------------------------------------------------------------------------

type Drawable = { depth: number; draw: () => void };

function drawFurniture(ctx: CanvasRenderingContext2D, it: Furniture, t: number) {
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
      box(ctx, x0 + i, y0 + i, x1 - i, y1 - i, 46, "#232542", "#171a31", "#10132a");
      for (let k = 0; k < 6; k++) {
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

function drawAgent(ctx: CanvasRenderingContext2D, a: Agent, seated: boolean, selected: boolean) {
  const [ax, ay] = iso(a.px, a.py);
  ctx.save();
  ctx.translate(ax, ay);
  ctx.scale(AGENT_SCALE, AGENT_SCALE);
  const fx = 0, fy = 0;
  const walk = a.moving ? Math.sin(a.walkPhase) : 0;
  const bob = a.moving ? Math.abs(Math.cos(a.walkPhase)) * 1.4 : 0;
  // Shadow / selection ring
  ctx.beginPath(); ctx.ellipse(fx, fy, selected ? 13 : 9, selected ? 6.5 : 4.5, 0, 0, Math.PI * 2);
  if (selected) { ctx.strokeStyle = "#A994FF"; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fill();
  const base = fy - (seated ? 5 : 0) - bob;
  if (!seated) {
    ctx.fillStyle = "#1A1730";
    ctx.fillRect(fx - 5, base - 10 + Math.max(0, walk) * 2.4, 3.6, 10 - Math.max(0, walk) * 2.4);
    ctx.fillRect(fx + 1.4, base - 10 + Math.max(0, -walk) * 2.4, 3.6, 10 - Math.max(0, -walk) * 2.4);
  }
  // Torso as a small iso prism
  const tb = base - (seated ? 2 : 9);
  const w = 7, d = 3.5, h = 13;
  const top = shade(a.color, 0.28), left = a.color, right = shade(a.color, -0.28);
  poly(ctx, [[fx - w, tb - d * 0.0], [fx, tb + d], [fx, tb + d - h], [fx - w, tb - h]]);
  ctx.fillStyle = left; ctx.fill();
  poly(ctx, [[fx, tb + d], [fx + w, tb], [fx + w, tb - h], [fx, tb + d - h]]);
  ctx.fillStyle = right; ctx.fill();
  poly(ctx, [[fx - w, tb - h], [fx, tb + d - h], [fx + w, tb - h], [fx, tb - h - d]]);
  ctx.fillStyle = top; ctx.fill();
  // Head
  const hy = tb - h - 6.5;
  ctx.beginPath(); ctx.arc(fx, hy, 5.6, 0, Math.PI * 2); ctx.fillStyle = a.skin; ctx.fill();
  ctx.beginPath(); ctx.arc(fx, hy - 0.8, 5.8, Math.PI * 1.05, Math.PI * 1.95); ctx.fillStyle = a.hair; ctx.fill();
  ctx.restore();
}

const AGENT_SCALE = 1.25;

function headPoint(cam: Camera, a: Agent, seated: boolean): [number, number] {
  const [sx, sy] = toScreen(cam, a.px, a.py);
  return [sx, sy - (seated ? 34 : 42) * AGENT_SCALE * cam.scale];
}

function isSeated(a: Agent) {
  return !a.moving && a.cell.x === a.home.x && a.cell.y === a.home.y && a.role !== "barista";
}

function drawMark(ctx: CanvasRenderingContext2D, x: number, y: number, kind: "deny" | "allow" | "approval" | "pause", s: number) {
  const color = kind === "deny" ? "#ED4A6D" : kind === "allow" ? "#4BCA81" : "#FFA801";
  const r = 9 * s;
  ctx.beginPath(); ctx.arc(x, y, r + 3 * s, 0, Math.PI * 2); ctx.fillStyle = hexA(color, 0.25); ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
  ctx.strokeStyle = "#fff"; ctx.lineWidth = 2.2 * s; ctx.lineCap = "round"; ctx.beginPath();
  if (kind === "deny") { ctx.moveTo(x - r * 0.5, y); ctx.lineTo(x + r * 0.5, y); }
  else if (kind === "allow") { ctx.moveTo(x - r * 0.45, y); ctx.lineTo(x - r * 0.1, y + r * 0.35); ctx.lineTo(x + r * 0.5, y - r * 0.35); }
  else if (kind === "pause") { ctx.moveTo(x - r * 0.25, y - r * 0.4); ctx.lineTo(x - r * 0.25, y + r * 0.4); ctx.moveTo(x + r * 0.25, y - r * 0.4); ctx.lineTo(x + r * 0.25, y + r * 0.4); }
  else { ctx.moveTo(x, y - r * 0.45); ctx.lineTo(x, y + r * 0.1); ctx.moveTo(x, y + r * 0.42); ctx.lineTo(x, y + r * 0.45); }
  ctx.stroke(); ctx.lineCap = "butt";
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > max && line) { lines.push(line); line = w; } else line = test;
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

export interface FrameOptions {
  selected: number | null;
  hover: number | null;
  compact: boolean;
}

export function drawDynamic(ctx: CanvasRenderingContext2D, cam: Camera, sim: OfficeSim, labels: RenderLabels, opts: FrameOptions) {
  const t = sim.time;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cam.width * cam.dpr, cam.height * cam.dpr);
  applyWorld(ctx, cam);

  const items: Drawable[] = [];
  for (const it of FURNITURE) {
    items.push({ depth: (it.x0 + it.x1 + 1) / 2 + (it.y0 + it.y1 + 1) / 2, draw: () => drawFurniture(ctx, it, t) });
  }
  for (const a of sim.agents) {
    const seated = isSeated(a);
    items.push({ depth: a.px + a.py + 0.01, draw: () => drawAgent(ctx, a, seated, opts.selected === a.id || opts.hover === a.id) });
  }
  items.sort((p, q) => p.depth - q.depth);
  for (const d of items) d.draw();

  // Holograms
  for (const h of HOLOGRAMS) {
    const [cx, cy] = P(h.x, h.y, (h.kind === "tree" ? 58 : 34) + Math.sin(t * 1.6) * 2);
    ctx.save();
    ctx.translate(cx, cy);
    if (h.kind === "policy") {
      for (let k = 0; k < 3; k++) {
        ctx.beginPath(); ctx.ellipse(0, k * 7, 30 - k * 7, 15 - k * 3.5, 0, 0, Math.PI * 2);
        ctx.strokeStyle = hexA(h.color, 0.55 - k * 0.12); ctx.lineWidth = 1.3; ctx.stroke();
      }
      for (let k = 0; k < 8; k++) {
        const ang = t * 0.9 + (k / 8) * Math.PI * 2;
        ctx.beginPath(); ctx.arc(Math.cos(ang) * 30, Math.sin(ang) * 15, 2, 0, Math.PI * 2);
        ctx.fillStyle = k % 4 === 0 ? "#ED4A6D" : k % 3 === 0 ? "#FFA801" : "#4BCA81"; ctx.fill();
      }
      const g = ctx.createLinearGradient(0, 0, 0, 34);
      g.addColorStop(0, hexA(h.color, 0.0)); g.addColorStop(1, hexA(h.color, 0.25));
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(26, 0); ctx.lineTo(10, 34); ctx.lineTo(-10, 34); ctx.closePath(); ctx.fill();
    } else {
      const stats = sim.getStats();
      const used = 1 - stats.rootLeftCents / stats.rootCapCents;
      const nodes: [number, number][] = [[0, -16], [-20, 0], [20, 0], [-30, 15], [-10, 15], [10, 15], [30, 15]];
      const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
      ctx.strokeStyle = hexA(h.color, 0.6); ctx.lineWidth = 1.2;
      for (const [p, q] of edges) { ctx.beginPath(); ctx.moveTo(nodes[p][0], nodes[p][1]); ctx.lineTo(nodes[q][0], nodes[q][1]); ctx.stroke(); }
      nodes.forEach(([x, y], i) => {
        ctx.beginPath(); ctx.arc(x, y, i === 0 ? 5 : 3.6, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? (used > 0.85 ? "#FFA801" : "#A994FF") : hexA("#C5B7FF", 0.85); ctx.fill();
      });
      // root budget bar
      ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fillRect(-26, -30, 52, 3);
      ctx.fillStyle = "#4BCA81"; ctx.fillRect(-26, -30, 52 * (1 - used), 3);
    }
    ctx.restore();
  }

  // Packets travelling between rooms
  for (const p of sim.packets) {
    const u = Math.min(1, (t - p.born) / p.dur);
    const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    const x = p.fx + (p.tx - p.fx) * e, y = p.fy + (p.ty - p.fy) * e;
    const arc = Math.sin(e * Math.PI) * 40 + 20;
    const [sx, sy] = P(x, y, arc);
    ctx.beginPath(); ctx.arc(sx, sy, 7, 0, Math.PI * 2); ctx.fillStyle = hexA(p.color, 0.25); ctx.fill();
    ctx.beginPath(); ctx.arc(sx, sy, 3.2, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
  }

  // ---- Screen-space overlays (crisp text regardless of zoom)
  ctx.setTransform(cam.dpr, 0, 0, cam.dpr, 0, 0);
  const s = Math.max(0.8, Math.min(1.1, cam.scale));

  // Seller signs
  ctx.font = `600 ${Math.round(10.5 * s)}px ${labels.font}`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  FURNITURE.filter((it) => it.room === "business" && it.kind === "desk").forEach((it, i) => {
    const [x, y] = toScreen(cam, it.x0 + 0.5, it.y0 + 0.5, 62);
    const text = labels.sellers[i] ?? "";
    const w = ctx.measureText(text).width + 14;
    roundRect(ctx, x - w / 2, y - 9 * s, w, 18 * s, 9 * s);
    ctx.fillStyle = "rgba(37,14,37,.88)"; ctx.fill(); ctx.strokeStyle = "rgba(255,121,198,.6)"; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = "#FBDBE2"; ctx.fillText(text, x, y + 0.5);
  });

  // Status marks
  for (const a of sim.agents) {
    if (!a.mark) continue;
    const [hx, hy] = headPoint(cam, a, isSeated(a));
    drawMark(ctx, hx, hy - 12 * s, a.mark.kind, s);
  }

  // Bubbles: newest first, capped, simple vertical de-overlap.
  const fontSize = Math.round(12 * s);
  ctx.font = `500 ${fontSize}px ${labels.font}`;
  ctx.textAlign = "left"; ctx.textBaseline = "top";
  const withBubble = sim.agents.filter((a) => a.bubble).sort((p, q) => q.bubble!.born - p.bubble!.born).slice(0, opts.compact ? 3 : 6);
  const placed: [number, number, number, number][] = [];
  for (const a of withBubble) {
    const b = a.bubble!;
    const maxW = (opts.compact ? 170 : 230) * s;
    const lines = wrap(ctx, b.text, maxW - 22);
    const lh = fontSize + 4;
    const w = Math.min(maxW, Math.max(...lines.map((l) => ctx.measureText(l).width)) + 22);
    const h = lines.length * lh + 14;
    const [hx, hy] = headPoint(cam, a, isSeated(a));
    let x = hx - w / 2, y = hy - h - 14 * s - (a.mark ? 22 * s : 0);
    for (let tries = 0; tries < 4; tries++) {
      const hit = placed.find(([px, py, pw, ph]) => x < px + pw && x + w > px && y < py + ph && y + h > py);
      if (!hit) break;
      y = hit[1] - h - 6;
    }
    x = Math.max(8, Math.min(cam.width - w - 8, x));
    if (y < 4 || y > cam.height) continue;
    placed.push([x, y, w, h]);
    const age = t - b.born, life = b.until - t;
    ctx.globalAlpha = Math.min(1, age * 5, life * 3);
    roundRect(ctx, x, y, w, h, 8);
    ctx.fillStyle = "rgba(26,23,47,.94)"; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = TONE[b.tone];
    roundRect(ctx, x + 6, y + 7, 3, h - 14, 1.5); ctx.fill();
    // tail
    const tx = Math.max(x + 12, Math.min(x + w - 12, hx));
    ctx.beginPath(); ctx.moveTo(tx - 6, y + h); ctx.lineTo(tx, y + h + 7); ctx.lineTo(tx + 6, y + h); ctx.closePath();
    ctx.fillStyle = "rgba(26,23,47,.94)"; ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    lines.forEach((l, i) => ctx.fillText(l, x + 15, y + 7 + i * lh));
    ctx.globalAlpha = 1;
  }

  // Selected agent name tag
  const sel = opts.selected ?? opts.hover;
  if (sel !== null && sim.agents[sel]) {
    const a = sim.agents[sel];
    const [sx, sy] = toScreen(cam, a.px, a.py);
    ctx.font = `600 ${Math.round(11 * s)}px ${labels.font}`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const w = ctx.measureText(a.name).width + 16;
    roundRect(ctx, sx - w / 2, sy + 10, w, 20, 10);
    ctx.fillStyle = "rgba(111,76,255,.92)"; ctx.fill();
    ctx.fillStyle = "#fff"; ctx.fillText(a.name, sx, sy + 20.5);
  }
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
}

/** Hit-test agents in CSS pixels. */
export function agentAt(cam: Camera, sim: OfficeSim, x: number, y: number): number | null {
  let best: number | null = null, bestD = 18;
  for (const a of sim.agents) {
    const [sx, sy] = toScreen(cam, a.px, a.py);
    const cy = sy - 20 * cam.scale;
    const d = Math.hypot(sx - x, cy - y) / Math.max(0.6, cam.scale);
    if (d < bestD) { bestD = d; best = a.id; }
  }
  return best;
}

/** Camera that fits the floor to the viewport, then applies user zoom/pan. */
export function fitCamera(width: number, height: number, dpr: number, zoom: number, panX: number, panY: number): Camera {
  const mapW = MAP_BOUNDS.maxX - MAP_BOUNDS.minX;
  const mapH = MAP_BOUNDS.maxY - MAP_BOUNDS.minY;
  let base = Math.min(width / mapW, height / mapH) * 1.2;
  if (width < 760) base = Math.max(base, 0.46);
  const scale = base * zoom;
  // Centre on the policy core, nudged down a bit to leave room for the top HUD.
  const [cx, cy] = iso(GRID_W / 2, GRID_H / 2 - 1);
  const ox = width / 2 - cx * scale + panX;
  const oy = height / 2 - cy * scale + panY + (width < 760 ? -height * 0.17 : 34);
  return { scale, ox, oy, dpr, width, height };
}
