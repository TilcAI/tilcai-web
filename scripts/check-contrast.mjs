#!/usr/bin/env node
// Checks WCAG 2.x contrast for the colour pairs the UI really uses, reading the tokens from the
// :root block of src/app/globals.css. No dependencies: `node scripts/check-contrast.mjs`.
// Exit code 1 if an enforced pair fails. Results are recorded in docs/design-tokens.md.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const root = css.match(/:root\s*{([\s\S]*?)\n}/)?.[1] ?? "";
const hex = {};
for (const [, name, value] of root.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})\b/gi)) hex[name] = value;
const channels = {};
for (const [, name, r, g, b] of root.matchAll(/--([\w-]+)-rgb:\s*(\d+)\s+(\d+)\s+(\d+)/g)) channels[name] = [+r, +g, +b];

const rgb = (token) => {
  if (hex[token]) return [1, 3, 5].map((i) => parseInt(hex[token].slice(i, i + 2), 16));
  throw new Error(`Token --${token} is not a #rrggbb colour in :root`);
};
// A translucent tint, e.g. brand at 12%, composited over the surface it sits on.
const tint = (channel, alpha, over) => {
  const fg = channels[channel];
  if (!fg) throw new Error(`Channel --${channel}-rgb not found`);
  return rgb(over).map((c, i) => Math.round(fg[i] * alpha + c * (1 - alpha)));
};
const lum = ([r, g, b]) => {
  const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const surfaces = ["background", "background-alt", "surface", "surface-raised"];
const checks = [];
const text = (label, fg, bgs, min = 4.5) => {
  for (const bg of bgs) checks.push({ group: "Text", label: `${label} on ${bg}`, ratio: ratio(rgb(fg), rgb(bg)), min });
};
text("text-primary", "text-primary", surfaces);
text("text-secondary", "text-secondary", surfaces);
text("text-muted", "text-muted", surfaces);
text("brand (links, accents)", "brand", surfaces);
text("brand-hover", "brand-hover", ["background", "surface"]);
text("heritage-amber (eyebrow)", "heritage-amber", ["background", "background-alt", "surface"]);
text("positive", "positive", ["background", "surface", "surface-raised"]);
text("attention", "attention", ["background", "surface", "surface-raised"]);
text("negative", "negative", ["background", "surface", "surface-raised"]);

// Buttons: dark text on the cyan action.
checks.push({ group: "Button", label: "on-brand on brand (primary)", ratio: ratio(rgb("on-brand"), rgb("brand")), min: 4.5 });
checks.push({ group: "Button", label: "on-brand on brand-hover (primary hover)", ratio: ratio(rgb("on-brand"), rgb("brand-hover")), min: 4.5 });
checks.push({ group: "Button", label: "on-brand on heritage-amber (skip link)", ratio: ratio(rgb("on-brand"), rgb("heritage-amber")), min: 4.5 });
checks.push({ group: "Button", label: "text-primary on background (ghost)", ratio: ratio(rgb("text-primary"), rgb("background")), min: 4.5 });

// Badges: coloured text on its own 12% tint, over the surfaces they appear on.
for (const over of ["surface", "background-alt"]) {
  for (const [name, channel, fg] of [["brand", "brand", "brand"], ["attention", "attention", "attention"],
    ["positive", "positive", "positive"], ["negative", "negative", "negative"]]) {
    checks.push({ group: "Badge", label: `${name} on its 12% tint over ${over}`, ratio: ratio(rgb(fg), tint(channel, 0.12, over)), min: 4.5 });
  }
  checks.push({ group: "Badge", label: `text-secondary on a 3% white tint over ${over}`, ratio: ratio(rgb("text-secondary"), tint("white", 0.03, over)), min: 4.5 });
}

// Non-text UI: focus ring and icons need 3:1.
for (const bg of ["background", "surface"]) {
  checks.push({ group: "UI", label: `focus ring (heritage-amber) on ${bg}`, ratio: ratio(rgb("heritage-amber"), rgb(bg)), min: 3 });
  checks.push({ group: "UI", label: `brand icons on ${bg}`, ratio: ratio(rgb("brand"), rgb(bg)), min: 3 });
}

// Decorative only: reported so nobody uses it for small text by mistake.
const decorative = ["background", "surface"].map((bg) => ({ label: `brand-deep on ${bg}`, ratio: ratio(rgb("brand-deep"), rgb(bg)) }));

let failed = 0;
let group = "";
for (const c of checks) {
  if (c.group !== group) { group = c.group; console.log(`\n${group}`); }
  const pass = c.ratio >= c.min;
  if (!pass) failed += 1;
  console.log(`  ${pass ? "PASS" : "FAIL"}  ${c.ratio.toFixed(2).padStart(5)}:1  (min ${c.min})  ${c.label}`);
}
console.log("\nDecorative only (not for small text):");
for (const d of decorative) console.log(`        ${d.ratio.toFixed(2).padStart(5)}:1  ${d.label}`);
console.log(`\n${checks.length - failed}/${checks.length} enforced pairs pass.`);
process.exit(failed ? 1 : 0);
