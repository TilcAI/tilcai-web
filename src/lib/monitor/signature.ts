import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/** A delivery older or newer than this is refused: a captured one cannot be replayed later. */
export const SIGNATURE_TOLERANCE_SECONDS = 300;

/** Compares two secrets without leaking, through timing, how much of them matches. */
export function sameSecret(a: string, b: string): boolean {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}

/** What the backend sends in `X-Tilcai-Signature`: `v1=` + HMAC-SHA256 of "<timestamp>.<body>". */
export function signDelivery(secret: string, timestamp: string, body: string): string {
  return `v1=${createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex")}`;
}

/**
 * Checks that a delivery was signed with the shared secret a moment ago. `timestamp` is the
 * `X-Tilcai-Timestamp` header (unix seconds) and `body` the exact text received.
 */
export function verifyDelivery(p: { secret: string; timestamp: string | null; signature: string | null; body: string; nowMs?: number }): { ok: true } | { ok: false; reason: "missing" | "stale" | "mismatch" } {
  if (!p.timestamp || !p.signature || !/^\d{1,12}$/.test(p.timestamp)) return { ok: false, reason: "missing" };
  const ageSeconds = Math.abs((p.nowMs ?? Date.now()) / 1000 - Number(p.timestamp));
  if (ageSeconds > SIGNATURE_TOLERANCE_SECONDS) return { ok: false, reason: "stale" };
  return sameSecret(p.signature, signDelivery(p.secret, p.timestamp, p.body)) ? { ok: true } : { ok: false, reason: "mismatch" };
}

/** What the browser keeps after presenting the dashboard token: a value derived from it. */
export const sessionValue = (token: string): string => createHash("sha256").update(`tilcai-monitor-session:${token}`).digest("hex");
