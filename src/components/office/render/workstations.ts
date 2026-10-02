import { box, hexA, P, poly } from "./geometry";
import type { Furniture } from "../types";

type Ctx = CanvasRenderingContext2D;

/** Small, physical displays; all their detail is baked into the furniture sprite. */
export function monitor(ctx: Ctx, x: number, y: number, z: number, width: number, color: string, variant = 0) {
  box(ctx, x + width * .4, y - .09, x + width * .6, y + .13, 2, "#686488", "#39354F", "#211F37", z);
  box(ctx, x + width * .48, y, x + width * .53, y + .05, 8, "#918BA9", "#45405E", "#29243F", z + 2);
  const a = P(x, y, z + 8);
  ctx.save(); ctx.translate(...a); ctx.transform(1, .5, 0, 1, 0, 0);
  const w = width * 32;
  ctx.fillStyle = "#090D20"; ctx.strokeStyle = "#787497"; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.roundRect(0, -24, w, 25, 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#152240"; ctx.fillRect(3, -21, w - 6, 19);
  ctx.fillStyle = hexA(color, .85); ctx.fillRect(5, -19, w - 10, 2);
  if (variant % 2) {
    for (let k = 0; k < 5; k++) {
      const h = 3 + ((k * 7 + variant) % 10);
      ctx.fillStyle = k === 3 ? "#E1DDEB" : hexA(color, .45 + k * .1);
      ctx.fillRect(5 + k * (w - 11) / 5, -4 - h, (w - 15) / 6, h);
    }
  } else {
    ctx.fillStyle = hexA(color, .2); ctx.fillRect(5, -14, (w - 12) * .32, 10);
    for (let k = 0; k < 3; k++) {
      ctx.fillStyle = k === 1 ? "#A4B2D0" : color;
      ctx.fillRect(w * .45, -13 + k * 4, (w * .45 - 4) * (k === 1 ? .65 : 1), 1.2);
    }
  }
  ctx.fillStyle = color; ctx.fillRect(w / 2 - 1, 0, 2, 1);
  ctx.restore();
}

function keyboard(ctx: Ctx, x: number, y: number, z: number) {
  box(ctx, x, y, x + .58, y + .25, 1.4, "#78768D", "#37334D", "#272139", z);
  for (let row = 0; row < 3; row++) for (let key = 0; key < 7; key++) {
    poly(ctx, [P(x + .04 + key * .071, y + .03 + row * .065, z + 1.5), P(x + .095 + key * .071, y + .03 + row * .065, z + 1.5), P(x + .095 + key * .071, y + .08 + row * .065, z + 1.5), P(x + .04 + key * .071, y + .08 + row * .065, z + 1.5)]);
    ctx.fillStyle = "#24273F"; ctx.fill();
  }
}

function taskLamp(ctx: Ctx, x: number, y: number, z: number, color: string) {
  box(ctx, x - .08, y - .08, x + .08, y + .08, 2, "#8D849E", "#39354F", "#211F37", z);
  ctx.beginPath(); ctx.moveTo(...P(x, y, z + 2)); ctx.lineTo(...P(x, y, z + 24)); ctx.lineTo(...P(x + .22, y, z + 29));
  ctx.strokeStyle = "#9289A7"; ctx.lineWidth = 2; ctx.stroke();
  box(ctx, x + .08, y - .08, x + .43, y + .09, 3, "#B8AECB", "#574966", "#34304A", z + 26);
  ctx.beginPath(); ctx.moveTo(...P(x + .1, y + .09, z + 26)); ctx.lineTo(...P(x + .4, y + .09, z + 26));
  ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
}

export function workstation(ctx: Ctx, it: Furniture, color: string) {
  const x = it.x0, y = it.y0, xx = it.x1 + 1, yy = it.y1 + 1;
  const z = 25;
  // A privacy screen sits inside each occupied desk footprint.
  if (it.room === "business" || it.room === "hub") {
    box(ctx, x + .01, y + .06, x + .07, yy - .1, 44, "#827196", "#342D4D", "#433858", 0, "#A296BC66");
    poly(ctx, [P(x + .075, y + .13, 28), P(x + .075, yy - .18, 28), P(x + .075, yy - .18, 41), P(x + .075, y + .13, 41)]);
    ctx.fillStyle = hexA(color, .13); ctx.fill();
  }
  // Pedestal drawers and open knee space replace the old solid cube.
  box(ctx, x + .05, y + .18, x + .27, yy - .06, z - 3, "#625776", "#383149", "#211F38");
  box(ctx, xx - .15, y + .16, xx - .07, yy - .08, z - 3, "#777088", "#3B344F", "#27233C");
  for (let k = 0; k < 3; k++) {
    ctx.beginPath(); ctx.moveTo(...P(x + .08, yy - .06, 5 + k * 6)); ctx.lineTo(...P(x + .23, yy - .06, 5 + k * 6));
    ctx.strokeStyle = "#8A7E9D"; ctx.lineWidth = 1; ctx.stroke();
  }
  box(ctx, x - .12, y + .02, xx + .12, yy - .01, 3, "#77728D", "#4B4361", "#312A49", z - 3, "#A49BBB");
  // Dark felt work surface.
  box(ctx, x + .31, y + .43, xx - .07, yy - .06, .5, "#262D4B", "#262D4B", "#262D4B", z);
  const wide = xx - x > 1;
  monitor(ctx, x + .02, y + .23, z, wide ? .85 : .54, color, it.x0);
  monitor(ctx, x + (wide ? .97 : .62), y + .23, z, wide ? .78 : .49, color, it.y0 + 1);
  keyboard(ctx, x + .36, y + .59, z + .5);
  const mouse = P(xx - .09, y + .74, z + 1.5);
  ctx.beginPath(); ctx.ellipse(...mouse, 2.5, 1.5, .5, 0, Math.PI * 2); ctx.fillStyle = "#C0B8D2"; ctx.fill();
  taskLamp(ctx, x + .08, y + .73, z, it.kind === "podium" ? "#FFD166" : "#BFCFF6");
  box(ctx, xx - .16, y + .35, xx - .04, y + .47, 5, "#E1DDEB", "#8B82A2", "#5C5374", z);
  if (wide) {
    box(ctx, x + 1.25, y + .61, xx - .15, yy - .12, 1.5, "#D6CEE7", "#827492", "#554D6B", z);
  }
  ctx.beginPath(); ctx.moveTo(...P(x - .08, yy, z - 2)); ctx.lineTo(...P(xx + .08, yy, z - 2));
  ctx.strokeStyle = hexA(color, .8); ctx.lineWidth = 1.5; ctx.stroke();
  if (it.room === "business") {
    // A framed product tile on the customer's side of each booth.
    const p = P(x + .15, yy - .02, z - 7);
    ctx.save(); ctx.translate(...p); ctx.transform(1, .5, 0, 1, 0, 0);
    ctx.fillStyle = "#1F1A57"; ctx.fillRect(0, -8, 22, 10);
    ctx.fillStyle = color; ctx.fillRect(3, -5, 3, 4);
    ctx.fillStyle = "#B8AAD7"; ctx.fillRect(9, -4, 10, 1); ctx.fillRect(9, -1, 6, 1); ctx.restore();
    // A recognisable service icon per booth, with no extra text at map scale.
    const tile = P(xx - .48, yy - .02, z - 6);
    ctx.save(); ctx.translate(...tile); ctx.transform(1, .5, 0, 1, 0, 0);
    ctx.fillStyle = "#15132E"; ctx.fillRect(-8, -10, 16, 13);
    ctx.strokeStyle = color; ctx.lineWidth = 1;
    if (it.label === "cinema") {
      ctx.strokeRect(-5, -7, 10, 7); ctx.fillStyle = color;
      for (let k = 0; k < 3; k++) { ctx.fillRect(-4 + k * 3, -7, 1, 1); ctx.fillRect(-4 + k * 3, -1, 1, 1); }
    } else if (it.label === "travel") {
      poly(ctx, [[-6, -2], [-1, -7], [2, -3], [4, -5], [7, -1]]); ctx.stroke();
    } else if (it.label === "data") {
      for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.ellipse(0, -6 + k * 3, 5, 2, 0, 0, Math.PI * 2); ctx.stroke(); }
    } else {
      ctx.strokeRect(-4, -8, 8, 10); ctx.beginPath(); ctx.moveTo(-2, -1); ctx.lineTo(-2, -3); ctx.lineTo(0, -2); ctx.lineTo(2, -6); ctx.stroke();
    }
    ctx.restore();
  }
}

/** Chair at a seat, kept independent from the agent so it stays when they leave. */
function paintChair(ctx: Ctx, x: number, y: number, color: string) {
  const p = P(x, y, 2);
  ctx.save(); ctx.translate(...p);
  ctx.strokeStyle = "#55526F"; ctx.lineWidth = 2;
  for (let k = 0; k < 5; k++) {
    const a = k * Math.PI * 2 / 5;
    ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(Math.cos(a) * 13, Math.sin(a) * 6); ctx.stroke();
    ctx.fillStyle = "#080B1C"; ctx.fillRect(Math.cos(a) * 13 - 2, Math.sin(a) * 6, 4, 3);
  }
  ctx.fillStyle = "#5A5472"; ctx.fillRect(-1.5, -16, 3, 12);
  poly(ctx, [[-13, -15], [0, -21], [13, -15], [0, -9]]); ctx.fillStyle = "#45405D"; ctx.fill();
  ctx.strokeStyle = "#88819E"; ctx.lineWidth = 1; ctx.stroke();
  poly(ctx, [[3, -12], [14, -18], [14, -36], [3, -30]]); ctx.fillStyle = "#29273F"; ctx.fill();
  ctx.strokeStyle = "#746A8C"; ctx.stroke();
  ctx.strokeStyle = hexA(color, .7); ctx.beginPath(); ctx.moveTo(5, -29); ctx.lineTo(12, -33); ctx.stroke();
  ctx.restore();
}

const chairs = new Map<string, HTMLCanvasElement>();
export function officeChair(ctx: Ctx, x: number, y: number, color: string) {
  let sprite = chairs.get(color);
  if (!sprite) {
    sprite = document.createElement('canvas'); sprite.width = 80; sprite.height = 100;
    const c = sprite.getContext('2d')!; c.scale(2, 2); c.translate(20, 42);
    paintChair(c, 0, 0, color); chairs.set(color, sprite);
  }
  const p = P(x, y);
  ctx.drawImage(sprite, p[0] - 20, p[1] - 42, 40, 50);
}

export function tilcayoDock(ctx: Ctx, x: number, y: number) {
  box(ctx, x + .1, y + .1, x + .9, y + .9, 3, "#322359", "#1F1738", "#130E29", 0, "#925FF6");
  const p = P(x + .5, y + .5, 4);
  ctx.save(); ctx.translate(...p);
  ctx.strokeStyle = "#AAA1C7"; ctx.lineWidth = 5; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(8, -10); ctx.bezierCurveTo(25, -11, 26, -26, 17, -24); ctx.stroke();
  ctx.fillStyle = "#AAA1C7"; ctx.beginPath(); ctx.ellipse(0, -15, 11, 14, -.25, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#E1DDEB"; ctx.beginPath(); ctx.ellipse(-3, -16, 8, 12, -.25, 0, Math.PI * 2); ctx.fill();
  for (const dx of [-7, 5]) { ctx.fillStyle = "#E1DDEB"; ctx.beginPath(); ctx.roundRect(dx - 3, -9, 6, 9, 2); ctx.fill(); }
  poly(ctx, [[-12, -28], [-13, -44], [-3, -36], [5, -36], [13, -44], [13, -27]]); ctx.fillStyle = "#E1DDEB"; ctx.fill();
  poly(ctx, [[-10, -34], [-10, -40], [-5, -35]]); ctx.fillStyle = "#925FF6"; ctx.fill();
  poly(ctx, [[7, -35], [11, -40], [11, -33]]); ctx.fill();
  ctx.beginPath(); ctx.roundRect(-14, -35, 29, 21, 8); ctx.fillStyle = "#E1DDEB"; ctx.fill();
  ctx.beginPath(); ctx.roundRect(-11, -32, 23, 14, 5); ctx.fillStyle = "#090B21"; ctx.fill();
  ctx.fillStyle = "#57D2F9"; ctx.fillRect(-7, -28, 5, 3); ctx.fillRect(4, -28, 5, 3);
  ctx.fillStyle = "#6024E8"; ctx.fillRect(-4, -15, 8, 3);
  ctx.restore();
}

export function commandTable(ctx: Ctx, it: Furniture, color: string) {
  const x = (it.x0 + it.x1 + 1) / 2, y = (it.y0 + it.y1 + 1) / 2;
  const ring = (radius: number, z: number) => Array.from({ length: 8 }, (_, k) => {
    const a = k * Math.PI / 4; return P(x + Math.cos(a) * radius, y + Math.sin(a) * radius, z);
  });
  const lower = ring(1.75, 6), upper = ring(1.75, 27);
  for (let k = 0; k < 8; k++) {
    poly(ctx, [lower[k], lower[(k + 1) % 8], upper[(k + 1) % 8], upper[k]]);
    ctx.fillStyle = k < 4 ? "#38305A" : "#1F1A36"; ctx.fill(); ctx.strokeStyle = "#0C0B25"; ctx.lineWidth = 1; ctx.stroke();
  }
  poly(ctx, upper); ctx.fillStyle = "#605482"; ctx.fill(); ctx.strokeStyle = "#B5A0D3"; ctx.stroke();
  poly(ctx, ring(1.18, 27.2)); ctx.fillStyle = "#171434"; ctx.fill();
  const p = P(x, y, 28);
  ctx.beginPath(); ctx.ellipse(...p, 39, 19.5, 0, 0, Math.PI * 2); ctx.fillStyle = "#352166"; ctx.fill();
  ctx.strokeStyle = "#B79AFF"; ctx.lineWidth = 2; ctx.stroke();
  for (const [dx, dy] of [[-1.05, -.65], [.65, -.65], [-1.05, .8], [.65, .8]]) monitor(ctx, x + dx, y + dy, 27, .48, color, 1);
  const rim = ring(1.77, 14);
  ctx.beginPath(); ctx.moveTo(...rim[0]); for (const p of rim.slice(1, 5)) ctx.lineTo(...p);
  ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
}
