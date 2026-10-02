// The office floor plan, described as data. Coordinates are grid cells (x → screen down-right, y → screen down-left).
import type { Cell, Furniture, Room, RoomId } from "./types";

export const GRID_W = 40;
export const GRID_H = 30;

const c = (x: number, y: number): Cell => ({ x, y });

/** Room hues follow the TilcAI functional palette; floors are dark tints so agents and bubbles stay legible. */
export const ROOMS: Room[] = [
  { id: "business", x0: 1, y0: 1, x1: 12, y1: 12, doors: [c(5, 12), c(6, 12), c(12, 6), c(12, 7)], color: "#D946A8", floor: "#301331" },
  { id: "budget", x0: 14, y0: 1, x1: 25, y1: 7, doors: [c(19, 7), c(20, 7), c(14, 4)], color: "#A855F7", floor: "#291444" },
  { id: "vault", x0: 27, y0: 1, x1: 38, y1: 12, doors: [c(27, 6), c(27, 7), c(32, 12), c(33, 12)], color: "#29C7F6", floor: "#102D42" },
  { id: "hub", x0: 1, y0: 14, x1: 12, y1: 28, doors: [c(5, 14), c(6, 14), c(12, 20), c(12, 21)], color: "#416CD5", floor: "#121D40" },
  { id: "core", x0: 14, y0: 9, x1: 25, y1: 19, doors: [c(14, 13), c(14, 14), c(19, 9), c(20, 9), c(25, 13), c(25, 14), c(19, 19), c(20, 19)], color: "#6024E8", floor: "#211344" },
  { id: "receipts", x0: 27, y0: 14, x1: 38, y1: 20, doors: [c(27, 17), c(32, 14)], color: "#34D399", floor: "#12312F" },
  { id: "approval", x0: 14, y0: 21, x1: 25, y1: 28, doors: [c(19, 21), c(20, 21), c(14, 24)], color: "#F5A623", floor: "#302235" },
  { id: "cafe", x0: 27, y0: 22, x1: 38, y1: 28, doors: [c(32, 22), c(33, 22), c(27, 25)], color: "#B7A5FF", floor: "#2A253A" },
];

export const ROOM_BY_ID = Object.fromEntries(ROOMS.map((r) => [r.id, r])) as Record<RoomId, Room>;

const f = (kind: Furniture["kind"], room: RoomId, x0: number, y0: number, x1 = x0, y1 = y0, extra: Partial<Furniture> = {}): Furniture => ({ kind, room, x0, y0, x1, y1, ...extra });

export const FURNITURE: Furniture[] = [
  // Business booths: one seller per desk.
  f("desk", "business", 4, 4, 4, 4, { label: "cinema" }), f("desk", "business", 8, 4, 8, 4, { label: "data" }),
  f("desk", "business", 4, 9, 4, 9, { label: "risk" }), f("desk", "business", 8, 9, 8, 9, { label: "travel" }),
  f("plant", "business", 1, 1), f("plant", "business", 11, 1), f("plant", "business", 1, 12),
  ...[3, 4, 5, 7, 8, 9].map((x) => f("cabinet", "business", x, 1)), f("sofa", "business", 10, 11, 11, 11),
  // Hub: buyer agents' desks.
  ...[3, 6, 9].flatMap((x) => [17, 20, 23, 26].map((y) => f("desk", "hub", x, y))),
  f("plant", "hub", 1, 28), f("plant", "hub", 12, 28), f("plant", "hub", 1, 14),
  // Policy core: the central table.
  f("table", "core", 18, 12, 21, 15),
  f("plant", "core", 14, 9), f("plant", "core", 25, 9), f("plant", "core", 14, 19), f("plant", "core", 25, 19),
  // Shared budget console.
  f("console", "budget", 19, 4, 20, 4),
  f("plant", "budget", 14, 1), f("plant", "budget", 25, 1), f("cabinet", "budget", 24, 6),
  // Vault and Stellar rail: racks and signing consoles.
  ...[29, 30, 31, 32, 33, 34].map((x) => f("rack", "vault", x, 2)),
  ...[29, 30, 31, 32, 33, 34].map((x) => f("rack", "vault", x, 10)),
  f("console", "vault", 31, 6), f("console", "vault", 34, 6),
  // Receipts and reconciliation.
  ...[34, 35, 36, 37].map((x) => f("cabinet", "receipts", x, 14)),
  f("desk", "receipts", 32, 18), f("desk", "receipts", 35, 18), f("cabinet", "receipts", 29, 19), f("cabinet", "receipts", 29, 14), f("cabinet", "receipts", 30, 14), f("plant", "receipts", 38, 20),
  // Human approval.
  f("podium", "approval", 19, 25, 20, 25), f("sofa", "approval", 23, 27, 24, 27), f("plant", "approval", 14, 28), f("plant", "approval", 25, 21),
  // Café.
  f("counter", "cafe", 29, 24, 31, 24), f("sofa", "cafe", 34, 27, 36, 27), f("plant", "cafe", 38, 22), f("plant", "cafe", 38, 28), f("plant", "cafe", 27, 28),
];

/** Named interaction points. Staff sit on `*Staff`; buyers stand on `*Visit` while interacting. */
export const SPOTS = {
  hubSeats: [3, 6, 9].flatMap((x) => [17, 20, 23, 26].map((y) => c(x, y + 1))),
  sellerSeats: [c(4, 3), c(8, 3), c(4, 8), c(8, 8)],
  sellerVisit: [c(4, 5), c(8, 5), c(4, 10), c(8, 10)],
  coreStaff: [c(19, 11), c(17, 13), c(22, 14)],
  coreVisit: [c(18, 16), c(19, 16), c(20, 16), c(21, 16)],
  budgetStaff: c(19, 5),
  approvalStaff: c(20, 26),
  approvalVisit: [c(19, 24), c(20, 24)],
  vaultStaff: [c(31, 5), c(34, 5)],
  vaultVisit: [c(31, 7), c(34, 7)],
  receiptsStaff: c(32, 19),
  receiptsVisit: [c(32, 17), c(31, 18)],
  baristaSeat: c(30, 23),
  cafeRest: [c(34, 26), c(35, 26), c(36, 26), c(33, 25), c(30, 27), c(32, 27)],
} as const;

/** Holograms floating above key furniture (drawn last, animated). */
export const HOLOGRAMS = [
  { kind: "policy" as const, x: 20, y: 14, color: "#8C70FF" },
  { kind: "tree" as const, x: 20, y: 4, color: "#A855F7" },
];

/** Screens mounted on the back walls (y0 edge of a room, spanning x from..to). */
export const WALL_SCREENS: { room: RoomId; from: number; to: number; title: string }[] = [
  { room: "hub", from: 8, to: 11, title: "MCP · INTENTS" },
  { room: "business", from: 7, to: 11, title: "QUOTES" },
  { room: "core", from: 21, to: 24, title: "POLICY ENGINE" },
  { room: "budget", from: 21, to: 24, title: "MANDATES" },
  { room: "vault", from: 28, to: 32, title: "STELLAR TESTNET" },
  { room: "approval", from: 22, to: 24, title: "APPROVAL" },
];

/** A round vault door on the vault's back wall. */
export const VAULT_DOOR = { x: 36, y: 1, color: "#29C7F6" };

// ---------------------------------------------------------------------------
// Derived grid data
// ---------------------------------------------------------------------------

export const CORRIDOR = -1;

/** Region index per cell: index into ROOMS, or CORRIDOR. */
export const regionGrid: Int8Array = (() => {
  const g = new Int8Array(GRID_W * GRID_H).fill(CORRIDOR);
  ROOMS.forEach((r, i) => {
    for (let y = r.y0; y <= r.y1; y++) for (let x = r.x0; x <= r.x1; x++) g[y * GRID_W + x] = i;
  });
  return g;
})();

export const blockedGrid: Uint8Array = (() => {
  const g = new Uint8Array(GRID_W * GRID_H);
  for (const it of FURNITURE) for (let y = it.y0; y <= it.y1; y++) for (let x = it.x0; x <= it.x1; x++) g[y * GRID_W + x] = 1;
  return g;
})();

export const doorGrid: Uint8Array = (() => {
  const g = new Uint8Array(GRID_W * GRID_H);
  for (const r of ROOMS) for (const d of r.doors) g[d.y * GRID_W + d.x] = 1;
  return g;
})();

export const roomAt = (x: number, y: number): RoomId | null => {
  const xi = Math.floor(x), yi = Math.floor(y);
  if (xi < 0 || yi < 0 || xi >= GRID_W || yi >= GRID_H) return null;
  const i = regionGrid[yi * GRID_W + xi];
  return i === CORRIDOR ? null : ROOMS[i].id;
};
