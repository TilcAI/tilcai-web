/** One coordinate system for the whole scene (viewBox 900 × 620). Components draw here and the timeline reads here. */
export const VIEW = { x: -30, y: -24, w: 960, h: 668 } as const;

/** Feet of the agent and centre of the store. */
export const AGENT_AT = { x: 156, y: 400 } as const;
export const BUSINESS_AT = { x: 770, y: 330 } as const;
export const BUSINESS_SCALE = 0.64;
export const CORE_AT = { x: 440, y: 344 } as const;

/** The route between agent and business. A curve, never a straight line. */
export const MAIN_PATH = "M 200 352 C 330 268, 500 436, 735 352";
export const MAIN_START = { x: 200, y: 352 } as const;

/** Generic badges shown around the agent before the request: any agent can start an operation. */
export const BADGES = [
  { id: "claude", x: 146, y: 214 },
  { id: "codex", x: 262, y: 262 },
  { id: "own", x: 262, y: 462 },
] as const;

/** Where each small offer panel rests, and the quote they feed. */
export const OFFER_AT = [{ x: 500, y: 152 }, { x: 640, y: 118 }, { x: 780, y: 152 }] as const;
export const QUOTE_AT = { x: 586, y: 262 } as const;

/** The six checks around the core: two columns, so the rail and the approval panel have room. */
export const CHECK_AT = [
  { x: 292, y: 232 }, { x: 600, y: 232 },
  { x: 292, y: 324 }, { x: 600, y: 324 },
  { x: 292, y: 416 }, { x: 600, y: 416 },
] as const;

export const APPROVAL_AT = { x: 450, y: 408 } as const;

/** The core scales about its middle; once the receipts are up it rests smaller and higher. */
export const CORE_PIVOT = { x: CORE_AT.x, y: CORE_AT.y - 40 } as const;
export const CORE_FINAL = { y: -70, scale: 0.74 } as const;

/** The payment lane: it drops out of the core, turns, runs along the bottom and rises into the business. */
export const PAY_PATH = "M 440 376 L 440 500 Q 440 548 490 548 L 700 548 Q 772 548 780 440";
/** Checkpoints sit on that path (the timeline finds their position along it). */
export const STOP_AT = [{ x: 440, y: 452 }, { x: 540, y: 548 }, { x: 630, y: 548 }, { x: 716, y: 548 }] as const;

export const RECEIPT_AT = { payment: { x: 355, y: 382 }, delivery: { x: 545, y: 382 } } as const;
