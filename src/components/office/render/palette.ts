import type { EventKind, Role, RoomId } from "../types";

/** Presentation tokens only: none of these values participates in simulation decisions. */
export const PALETTE = {
  hub: { primary: "#416CD5", light: "#51C5FB", floor: "#121D40", number: "01" },
  business: { primary: "#D946A8", light: "#F18BD5", floor: "#301331", number: "02" },
  core: { primary: "#6024E8", light: "#9C83FF", floor: "#211344", number: "03" },
  approval: { primary: "#F5A623", light: "#FFD166", floor: "#302235", number: "04" },
  budget: { primary: "#A855F7", light: "#D946EF", floor: "#291444", number: "05" },
  vault: { primary: "#29C7F6", light: "#57D2F9", floor: "#102D42", number: "06" },
  receipts: { primary: "#34D399", light: "#2DD4BF", floor: "#12312F", number: "07" },
  cafe: { primary: "#B7A5FF", light: "#F2D5C4", floor: "#2A253A", number: "08" },
} satisfies Record<RoomId, { primary: string; light: string; floor: string; number: string }>;

export const ROLE_ROOM: Record<Role, RoomId> = {
  buyer: "hub", seller: "business", policy: "core", budget: "budget",
  guardian: "approval", vault: "vault", receipts: "receipts", barista: "cafe",
};

export const TONE: Record<EventKind, string> = {
  intent: PALETTE.hub.light, quote: PALETTE.business.primary, allow: PALETTE.receipts.primary,
  deny: "#ED4A6D", approval: PALETTE.approval.primary, x402: PALETTE.vault.primary,
  receipt: PALETTE.receipts.light, system: "#925FF6",
};
