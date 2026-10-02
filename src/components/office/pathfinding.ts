// A* on the office grid (4-neighbour). Crossing between a room and the corridor is only allowed through doors.
import { blockedGrid, CORRIDOR, doorGrid, GRID_H, GRID_W, regionGrid } from "./layout";
import type { Cell } from "./types";

const idx = (x: number, y: number) => y * GRID_W + x;

export function canStep(ax: number, ay: number, bx: number, by: number): boolean {
  if (bx < 0 || by < 0 || bx >= GRID_W || by >= GRID_H) return false;
  const b = idx(bx, by);
  if (blockedGrid[b]) return false;
  const a = idx(ax, ay);
  const ra = regionGrid[a], rb = regionGrid[b];
  if (ra === rb) return true;
  if (ra !== CORRIDOR && !doorGrid[a]) return false;
  if (rb !== CORRIDOR && !doorGrid[b]) return false;
  return true;
}

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;

/** Binary-heap-free A*: the grid is small (1200 cells), a linear open-set scan is fast enough and simpler. */
export function findPath(from: Cell, to: Cell): Cell[] | null {
  if (from.x === to.x && from.y === to.y) return [];
  const N = GRID_W * GRID_H;
  const g = new Float32Array(N).fill(Infinity);
  const fScore = new Float32Array(N).fill(Infinity);
  const came = new Int32Array(N).fill(-1);
  const closed = new Uint8Array(N);
  const open: number[] = [];
  const start = idx(from.x, from.y), goal = idx(to.x, to.y);
  const h = (i: number) => Math.abs((i % GRID_W) - to.x) + Math.abs(Math.floor(i / GRID_W) - to.y);
  g[start] = 0; fScore[start] = h(start); open.push(start);
  while (open.length) {
    let best = 0;
    for (let k = 1; k < open.length; k++) if (fScore[open[k]] < fScore[open[best]]) best = k;
    const cur = open[best];
    open[best] = open[open.length - 1]; open.pop();
    if (cur === goal) {
      const path: Cell[] = [];
      for (let i = cur; i !== start; i = came[i]) path.push({ x: i % GRID_W, y: Math.floor(i / GRID_W) });
      return path.reverse();
    }
    closed[cur] = 1;
    const cx = cur % GRID_W, cy = Math.floor(cur / GRID_W);
    for (const [dx, dy] of DIRS) {
      const nx = cx + dx, ny = cy + dy;
      if (!canStep(cx, cy, nx, ny)) continue;
      const n = idx(nx, ny);
      if (closed[n]) continue;
      const cost = g[cur] + 1;
      if (cost < g[n]) {
        if (g[n] === Infinity) open.push(n);
        g[n] = cost; came[n] = cur; fScore[n] = cost + h(n);
      }
    }
  }
  return null;
}
