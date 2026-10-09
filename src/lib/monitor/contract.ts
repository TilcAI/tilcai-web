/**
 * Wire contract between TilcAI's backend and this site: `tilcai-monitor-v1`.
 *
 * The backend owns it (tilcai-infrastructure, src/modules/monitor/domain.ts and
 * forwarder.ts). This file mirrors it: a new event type or field is added on both sides.
 */
export const MONITOR_SCHEMA = "tilcai-monitor-v1";

export const MONITOR_SOURCES = ["tilcai", "relayer", "qr-simple"] as const;
export type MonitorSource = (typeof MONITOR_SOURCES)[number];

export const MONITOR_SEVERITIES = ["info", "warning", "error"] as const;
export type MonitorSeverity = (typeof MONITOR_SEVERITIES)[number];

/** Every event type the backend emits. The part before the first dot is its category. */
export const MONITOR_EVENT_TYPES = [
  "system.started",
  "system.stopping",
  "resources.snapshot",
  "alert.raised",
  "alert.cleared",
  "api.request_rejected",
  "crosschain.payment.transition",
  "crosschain.payment.uncertain",
  "vault.disbursement.transition",
  "vault.disbursement.uncertain",
  "vault.disbursement.rejected",
  "account.transition",
  "account.deploy_delayed",
  "relayer.transaction_update",
  "relayer.state_update",
  "relayer.notification",
  "qr.token_issued",
  "qr.created",
  "qr.paid",
  "qr.expired",
  "qr.callback_delivered",
  "qr.callback_failed",
] as const;
export type MonitorEventType = (typeof MONITOR_EVENT_TYPES)[number];

export interface MonitorEvent {
  /** Position in the backend's log (per backend instance). */
  seq: number;
  id: string;
  /** A type this build does not know yet is still stored and shown as it came. */
  type: MonitorEventType | (string & {});
  source: MonitorSource;
  severity: MonitorSeverity;
  subject: string | null;
  summary: string;
  data: Record<string, unknown>;
  at: string;
}

export interface MonitorOrigin {
  env: string;
  instance: string;
}

/** Body of POST /api/monitor/events. */
export interface MonitorDelivery {
  schema: typeof MONITOR_SCHEMA;
  deliveryId: string;
  sentAt: string;
  origin: MonitorOrigin;
  /** Newest position in the backend's log when the delivery left. */
  head: number;
  events: MonitorEvent[];
}

/** What one vault holds and has left to pay today, in USDC. */
export interface VaultView {
  address: string;
  paused: boolean;
  operatorIsRelayer: boolean;
  balance: string;
  pending: string;
  maxPerDisbursement: string;
  dailyLimit: string;
  availableToday: string;
}

/** One network's vault in a snapshot: what it holds, or why it could not be read. */
export interface VaultEntry {
  /** CAIP-2 id of the network: `eip155:43113`, `stellar:testnet`. */
  network: string;
  vault: VaultView | null;
  error?: string;
}

/** `data` of a `resources.snapshot` event. */
export interface ResourceSnapshot {
  takenAt: string;
  process: {
    role: string;
    pid: number;
    node: string;
    uptimeSeconds: number;
    rssBytes: number;
    heapUsedBytes: number;
    heapTotalBytes: number;
    /** Share of one CPU core used since the previous snapshot. */
    cpuLoad: number | null;
    eventLoopDelayMs: { mean: number; p99: number; max: number };
  };
  host: { name: string; cpus: number; loadAverage: number[]; totalMemoryBytes: number; freeMemoryBytes: number };
  database: {
    path: string;
    sizeBytes: number | null;
    walBytes: number | null;
    crosschainPayments: Record<string, number>;
    vaultDisbursements: Record<string, number>;
    qrCodes: Record<string, number>;
    qrCallbacksPending: number;
    monitorEvents: number;
  };
  relayer: {
    up: boolean;
    authenticated: boolean;
    relayers: Array<{
      id: string;
      network: string | null;
      networkType: string | null;
      address: string | null;
      paused: boolean | null;
      systemDisabled: boolean | null;
      balance: string | null;
      unit: string | null;
      error?: string;
    }>;
  };
  /** The primary vault (Avalanche Fuji's). Older backends send only this one. */
  vault: VaultView | null;
  vaultError?: string;
  /** Every vault the backend has configured, the primary first (Fuji, Stellar). Absent from older backends. */
  vaults?: VaultEntry[];
  monitor: { head: number; sinks: Array<{ name: string; lastSeq: number; lag: number; attempts: number; lastError: string | null; lastDeliveredAt: string | null }> };
  alerts: Array<{ code: string; severity: "warning" | "error"; message: string }>;
}

const MAX_EVENTS_PER_DELIVERY = 500;
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isText = (v: unknown, max: number): v is string => typeof v === "string" && v.length > 0 && v.length <= max;

/**
 * Checks a delivery field by field. Returns the delivery, or why it is not one.
 * Nothing in it is trusted beyond its shape: the page shows it as text.
 */
export function parseDelivery(body: unknown): { ok: true; delivery: MonitorDelivery } | { ok: false; reason: string } {
  const fail = (reason: string) => ({ ok: false as const, reason });
  if (!isRecord(body)) return fail("body must be an object");
  if (body.schema !== MONITOR_SCHEMA) return fail(`schema must be ${MONITOR_SCHEMA}`);
  if (!isText(body.deliveryId, 80)) return fail("deliveryId");
  if (!isText(body.sentAt, 40) || Number.isNaN(Date.parse(body.sentAt))) return fail("sentAt");
  if (!isRecord(body.origin) || !isText(body.origin.env, 40) || !isText(body.origin.instance, 120)) return fail("origin");
  if (typeof body.head !== "number" || !Number.isInteger(body.head) || body.head < 0) return fail("head");
  if (!Array.isArray(body.events) || body.events.length > MAX_EVENTS_PER_DELIVERY) return fail("events");

  const events: MonitorEvent[] = [];
  for (const [i, e] of body.events.entries()) {
    const at = `events[${i}]`;
    if (!isRecord(e)) return fail(at);
    if (typeof e.seq !== "number" || !Number.isInteger(e.seq) || e.seq < 1) return fail(`${at}.seq`);
    if (!isText(e.id, 80)) return fail(`${at}.id`);
    if (!isText(e.type, 80) || !/^[a-z0-9_.]+$/.test(e.type)) return fail(`${at}.type`);
    if (!(MONITOR_SOURCES as readonly unknown[]).includes(e.source)) return fail(`${at}.source`);
    if (!(MONITOR_SEVERITIES as readonly unknown[]).includes(e.severity)) return fail(`${at}.severity`);
    if (e.subject !== null && !isText(e.subject, 300)) return fail(`${at}.subject`);
    if (typeof e.summary !== "string" || e.summary.length > 400) return fail(`${at}.summary`);
    if (!isRecord(e.data)) return fail(`${at}.data`);
    if (!isText(e.at, 40) || Number.isNaN(Date.parse(e.at))) return fail(`${at}.at`);
    events.push({ seq: e.seq, id: e.id, type: e.type, source: e.source as MonitorSource, severity: e.severity as MonitorSeverity, subject: e.subject, summary: e.summary, data: e.data, at: e.at });
  }
  return {
    ok: true,
    delivery: {
      schema: MONITOR_SCHEMA,
      deliveryId: body.deliveryId,
      sentAt: body.sentAt,
      origin: { env: body.origin.env, instance: body.origin.instance },
      head: body.head,
      events,
    },
  };
}
