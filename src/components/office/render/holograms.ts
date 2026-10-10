/** Reusable vector glyphs. Paths and translucent panel sprites are built once. */
import { networkLogos } from '../../../lib/content/network-logos.ts';

export type Glyph = 'intent' | 'quote' | 'shield' | 'approval' | 'deny' | 'identity' | 'budget' | 'payment' | 'receipt' | 'stellar' | 'relayer' | 'cafe' | 'retry' | 'check';
const DATA: Record<Exclude<Glyph, 'stellar'>, string> = {
  intent: 'M-10 -8H10V5H1L-5 10V5H-10ZM-5 -3H5M-5 1H2',
  quote: 'M-9 -11H5L10 -6V11H-9ZM4 -11V-5H10M-5 -1H5M-5 4H2M-5 8H5',
  shield: 'M0 -12L10 -7V0Q10 8 0 13Q-10 8 -10 0V-7ZM-5 0L-1 4L6 -4',
  approval: 'M0 -11V2M0 7V10M-10 -13H10V13H-10Z',
  deny: 'M-8 -8L8 8M8 -8L-8 8',
  identity: 'M-11 -12H11V12H-11ZM-4 -4A4 4 0 1 0 4 -4A4 4 0 1 0 -4 -4M-7 8Q0 0 7 8',
  budget: 'M0 -12V-2M-10 4V-2H10V4M-13 4H-7V10H-13ZM7 4H13V10H7ZM-3 -17H3V-11H-3Z',
  payment: 'M-11 -7H11V8H-11ZM-11 -2H11M3 3H7',
  receipt: 'M-9 -12H9V12L5 9L1 12L-3 9L-9 12ZM-4 -6H4M-4 0H4M-4 5L-1 8L5 2',
  relayer: 'M-12 -4H10L4 -10M12 4H-10L-4 10',
  cafe: 'M-9 -5H6V4Q6 11 -1 11Q-9 11 -9 4ZM6 -3H11V3H6M-12 14H10M-5 -10Q-8 -13 -4 -16M2 -10Q-1 -13 3 -16',
  retry: 'M-9 -4A10 10 0 1 1 -8 7M-9 -12V-3H0',
  check: 'M-9 0L-2 7L11 -8',
};
const paths = new Map<Glyph, Path2D>();
let stellarLogo: HTMLImageElement | undefined;

function getStellarLogo() {
  if (typeof window === 'undefined') return null;
  if (!stellarLogo) {
    stellarLogo = new window.Image();
    stellarLogo.onload = () => {
      for (const key of panels.keys()) if (key.startsWith('stellar')) panels.delete(key);
    };
    stellarLogo.src = networkLogos['stellar-testnet'];
  }
  return stellarLogo.complete && stellarLogo.naturalWidth > 0 ? stellarLogo : null;
}

export function glyph(ctx: CanvasRenderingContext2D, kind: Glyph, x: number, y: number, color: string, scale = 1) {
  if (kind === 'stellar') {
    const logo = getStellarLogo();
    if (logo) ctx.drawImage(logo, x - 14 * scale, y - 14 * scale, 28 * scale, 28 * scale);
    return;
  }
  let path = paths.get(kind);
  if (!path) { path = new Path2D(DATA[kind]); paths.set(kind, path); }
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.lineWidth = 1.7; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = color; ctx.stroke(path); ctx.restore();
}
const panels = new Map<string, HTMLCanvasElement>();
export function hologram(ctx: CanvasRenderingContext2D, kind: Glyph, x: number, y: number, color: string, scale = 1, alpha = 1) {
  const key = kind + color;
  let canvas = panels.get(key);
  if (!canvas) {
    canvas = document.createElement('canvas'); canvas.width = 144; canvas.height = 176;
    const c = canvas.getContext('2d')!;
    c.scale(2, 2); c.translate(36, 39);
    c.transform(1, .18, 0, 1, 0, 0);
    c.beginPath(); c.roundRect(-23, -28, 46, 56, 5);
    c.fillStyle = color + '0C'; c.fill();
    c.strokeStyle = color + 'B0'; c.lineWidth = 1; c.shadowColor = color; c.shadowBlur = 9; c.stroke(); c.shadowBlur = 0;
    c.strokeStyle = color + '22'; c.lineWidth = .5;
    for (let i = -23; i < 26; i += 4) { c.beginPath(); c.moveTo(-20, i); c.lineTo(20, i); c.stroke(); }
    glyph(c, kind, 0, -2, color, 1.1);
    c.fillStyle = color + '90'; c.fillRect(-15, 20, 12, 1); c.fillRect(3, 20, 6, 1);
    c.fillStyle = '#E1DDEB'; c.fillRect(-17, -23, 3, 1);
    panels.set(key, canvas);
  }
  ctx.save(); ctx.globalAlpha *= alpha;
  ctx.drawImage(canvas, x - 36 * scale, y - 39 * scale, 72 * scale, 88 * scale); ctx.restore();
}
