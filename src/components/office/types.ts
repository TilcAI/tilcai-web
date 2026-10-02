// Shared types for the isometric office simulation. Framework-agnostic: no React here.

export type RoomId = "hub" | "business" | "budget" | "core" | "approval" | "vault" | "receipts" | "cafe";

export type Role = "buyer" | "seller" | "policy" | "budget" | "guardian" | "vault" | "receipts" | "barista";

export type SellerKey = "cinema" | "data" | "risk" | "travel";

export type ReasonCode =
  | "PAYEE_NOT_ALLOWED"
  | "PER_PAYMENT_LIMIT_EXCEEDED"
  | "BUDGET_EXCEEDED"
  | "DUPLICATE_PAYMENT_INTENT"
  | "MANDATE_PAUSED"
  | "HUMAN_REJECTED";

export type EventKind = "intent" | "quote" | "allow" | "deny" | "approval" | "x402" | "receipt" | "system";

export type TaskKind = "idle" | "intent" | "walking" | "quoting" | "policy" | "approval" | "settling" | "receipt" | "resting" | "frozen";

export type Cell = { x: number; y: number };

export type FurnitureKind = "desk" | "table" | "console" | "rack" | "plant" | "sofa" | "counter" | "cabinet" | "podium";

export interface Furniture {
  kind: FurnitureKind;
  /** Footprint, inclusive cell coordinates. */
  x0: number; y0: number; x1: number; y1: number;
  room: RoomId;
  /** Which side the screen of a desk/console faces (+y or +x). */
  facing?: "x" | "y";
  label?: string;
}

export interface Room {
  id: RoomId;
  x0: number; y0: number; x1: number; y1: number;
  /** Cells on the room perimeter that connect to the corridor. */
  doors: Cell[];
  color: string;
  floor: string;
}

export interface OfficeEvent {
  id: number;
  kind: EventKind;
  text: string;
  /** Simulation time in seconds. */
  t: number;
}

export interface OfficeStats {
  rootCapCents: number;
  rootLeftCents: number;
  volumeCents: number;
  decisions: number;
  allow: number;
  deny: number;
  approvals: number;
  settled: number;
  periodLeft: number;
  mandatePaused: boolean;
  frozen: boolean;
}

export interface AgentInfo {
  id: number;
  name: string;
  role: Role;
  task: TaskKind;
  ok: number;
  denied: number;
  room: RoomId | null;
}

/** All localized strings the simulation needs to narrate itself. */
export interface OfficeStrings {
  locale: "en" | "es";
  reasons: Record<ReasonCode, string>;
  services: Record<SellerKey, string>;
  sellers: Record<SellerKey, string>;
  staff: { policy: string; verifier: string; identity: string; budget: string; guardian: string; soroban: string; relayer: string; receipts: string; barista: string };
  buyerName: string;
  buyers: string[];
  msg: Record<
    | "intent" | "quote" | "allow" | "deny" | "approvalReq" | "approved" | "rejected" | "hold" | "x402" | "settled"
    | "receipt" | "receiptDeny" | "delivery" | "paused" | "resumed" | "kill" | "revive" | "period" | "injection" | "duplicate",
    string
  >;
  bubble: Record<
    "intent" | "quote" | "allow" | "deny" | "approvalReq" | "approved" | "rejected" | "hold" | "x402" | "receipt" | "delivery" | "rest" | "injection" | "duplicate" | "frozen",
    string
  >;
}
