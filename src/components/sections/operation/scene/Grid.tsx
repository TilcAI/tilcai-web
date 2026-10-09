import { VIEW } from "./geometry";

/** A segment of the lattice: from a vertex, `n` tiles along an isometric direction (up-right or down-right). */
const along = (x: number, y: number, n: number, up: boolean) => `M ${x} ${y.toFixed(2)} L ${x + 30 * n} ${(y + (up ? -17.32 : 17.32) * n).toFixed(2)}`;
const LIT = [
  { d: along(210, 34.64 * 13, 6, true), color: "#925fff" },
  { d: along(630, 34.64 * 11, 6, false), color: "#48d9ff" },
  { d: along(330, 34.64 * 14, 8, true), color: "#ac76ff" },
  { d: along(510, 34.64 * 17, 6, true), color: "#48d9ff" },
  { d: along(270, 34.64 * 10, 8, false), color: "#925fff" },
] as const;

/** `#scene-grid`: a faint isometric floor. A few lines wake up when a node becomes active; the grid itself never animates. */
export function SceneGrid() {
  return (
    <g id="scene-grid" data-k="grid">
      <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill="url(#op-iso)" opacity=".15" mask="url(#op-grid-mask)" />
      <g fill="none" strokeLinecap="round">
        {LIT.map((line, i) => <path key={i} data-k="grid-line" d={line.d} stroke={line.color} strokeWidth="1.6" opacity="0" />)}
      </g>
    </g>
  );
}
