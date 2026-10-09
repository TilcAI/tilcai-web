import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import type { MonitorDelivery, MonitorEvent, MonitorOrigin, MonitorSeverity, MonitorSource, ResourceSnapshot } from "./contract.ts";

/** An event as this site keeps it: where it came from and its position here. */
export interface StoredEvent extends MonitorEvent {
  /** Position in this site's feed. Readers page and resume by it. */
  cursor: number;
  /** The backend instance that sent it. */
  origin: string;
}

export interface OriginState extends MonitorOrigin {
  /** Newest position the backend reported, and the newest one received from it. */
  head: number;
  lastSeq: number;
  lastDeliveryAt: string;
  resources: ResourceSnapshot | null;
  resourcesAt: string | null;
  alerts: Array<{ code: string; severity: "warning" | "error"; message: string; since: string | null }>;
}

export interface EventFilter {
  after?: number;
  limit?: number;
  /** Exact type or a prefix ending in a dot ("vault."). */
  type?: string;
  source?: MonitorSource;
  minSeverity?: MonitorSeverity;
}

export interface MonitorSummary {
  cursor: number;
  stored: number;
  capacity: number;
  /** False while nothing has arrived since this server process started. */
  receiving: boolean;
  origins: OriginState[];
  counts: { bySeverity: Record<MonitorSeverity, number>; bySource: Record<MonitorSource, number>; byCategory: Record<string, number> };
}

const RANK: Record<MonitorSeverity, number> = { info: 0, warning: 1, error: 2 };

/**
 * The events this site has received, newest last, in memory.
 *
 * It is a cache of the backend's log, not the log: it keeps the last `capacity` events and
 * starts empty with every server process. With `file`, it also appends each event to a
 * JSON-lines file and reloads its tail on start (a single long-lived server). On serverless
 * hosting each instance has its own memory, so a durable store has to replace this class
 * before the dashboard runs there with more than one instance.
 */
export class MonitorStore {
  private events: StoredEvent[] = [];
  private readonly seen = new Set<string>();
  private readonly origins = new Map<string, OriginState>();
  private readonly listeners = new Set<(e: StoredEvent) => void>();
  private cursor = 0;
  private readonly capacity: number;
  private readonly file: string | null;

  constructor(capacity = 2000, file: string | null = null) {
    this.capacity = capacity;
    this.file = file;
    if (file) this.load(file);
  }

  /** Stores what is new in a delivery. Events already here (a retried delivery) are skipped. */
  ingest(delivery: MonitorDelivery): { accepted: number; duplicates: number; cursor: number } {
    const origin = this.originOf(delivery.origin);
    origin.head = Math.max(origin.head, delivery.head);
    origin.lastDeliveryAt = delivery.sentAt;
    let accepted = 0;
    for (const event of delivery.events) {
      const key = `${origin.instance}\n${event.id}`;
      if (this.seen.has(key)) continue;
      const stored: StoredEvent = { ...event, cursor: ++this.cursor, origin: origin.instance };
      this.add(stored, key);
      this.apply(origin, stored);
      if (this.file) this.persist(stored, delivery.origin);
      accepted++;
      for (const listener of this.listeners) listener(stored);
    }
    return { accepted, duplicates: delivery.events.length - accepted, cursor: this.cursor };
  }

  /** Events after a position (oldest first) or, without one, the newest `limit`. */
  list(filter: EventFilter = {}): StoredEvent[] {
    const limit = Math.min(Math.max(Math.trunc(filter.limit ?? 100), 1), 500);
    const matches = this.events.filter((e) => this.matches(e, filter));
    return filter.after === undefined ? matches.slice(-limit) : matches.filter((e) => e.cursor > filter.after!).slice(0, limit);
  }

  summary(): MonitorSummary {
    const counts: MonitorSummary["counts"] = { bySeverity: { info: 0, warning: 0, error: 0 }, bySource: { tilcai: 0, relayer: 0, "qr-simple": 0 }, byCategory: {} };
    for (const e of this.events) {
      counts.bySeverity[e.severity]++;
      counts.bySource[e.source]++;
      const category = e.type.split(".", 1)[0]!;
      counts.byCategory[category] = (counts.byCategory[category] ?? 0) + 1;
    }
    return { cursor: this.cursor, stored: this.events.length, capacity: this.capacity, receiving: this.origins.size > 0, origins: [...this.origins.values()], counts };
  }

  subscribe(listener: (e: StoredEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private matches(e: StoredEvent, f: EventFilter): boolean {
    if (f.type && (f.type.endsWith(".") ? !e.type.startsWith(f.type) : e.type !== f.type)) return false;
    if (f.source && e.source !== f.source) return false;
    return !f.minSeverity || RANK[e.severity] >= RANK[f.minSeverity];
  }

  private originOf(o: MonitorOrigin): OriginState {
    let origin = this.origins.get(o.instance);
    if (!origin) {
      origin = { ...o, head: 0, lastSeq: 0, lastDeliveryAt: "", resources: null, resourcesAt: null, alerts: [] };
      this.origins.set(o.instance, origin);
    }
    origin.env = o.env;
    return origin;
  }

  private add(stored: StoredEvent, key: string): void {
    this.events.push(stored);
    this.seen.add(key);
    if (this.events.length > this.capacity) {
      const dropped = this.events.splice(0, this.events.length - this.capacity);
      for (const e of dropped) this.seen.delete(`${e.origin}\n${e.id}`);
    }
  }

  /** Keeps the picture of each backend current: its last snapshot and what is wrong with it. */
  private apply(origin: OriginState, e: StoredEvent): void {
    origin.lastSeq = Math.max(origin.lastSeq, e.seq);
    if (e.type === "resources.snapshot") {
      const snapshot = e.data as unknown as ResourceSnapshot;
      origin.resources = snapshot;
      origin.resourcesAt = e.at;
      const since = new Map(origin.alerts.map((a) => [a.code, a.since]));
      origin.alerts = (Array.isArray(snapshot.alerts) ? snapshot.alerts : []).map((a) => ({ ...a, since: since.get(a.code) ?? null }));
    } else if (e.type === "alert.raised" && typeof e.data.code === "string") {
      const code = e.data.code;
      origin.alerts = [...origin.alerts.filter((a) => a.code !== code), { code, severity: e.severity === "error" ? "error" : "warning", message: e.summary, since: e.at }];
    } else if (e.type === "alert.cleared" && typeof e.data.code === "string") {
      origin.alerts = origin.alerts.filter((a) => a.code !== e.data.code);
    }
  }

  private persist(e: StoredEvent, origin: MonitorOrigin): void {
    try {
      appendFileSync(this.file!, `${JSON.stringify({ origin, event: { ...e, cursor: undefined, origin: undefined } })}\n`);
    } catch {
      // The feed keeps working from memory; the next start simply has less history.
    }
  }

  private load(file: string): void {
    try {
      mkdirSync(dirname(file), { recursive: true });
      if (!existsSync(file)) return;
      const lines = readFileSync(file, "utf8").split("\n").filter(Boolean).slice(-this.capacity);
      for (const line of lines) {
        const { origin, event } = JSON.parse(line) as { origin: MonitorOrigin; event: MonitorEvent };
        const state = this.originOf(origin);
        const stored: StoredEvent = { ...event, cursor: ++this.cursor, origin: origin.instance };
        this.add(stored, `${origin.instance}\n${event.id}`);
        this.apply(state, stored);
        state.head = Math.max(state.head, event.seq);
        state.lastDeliveryAt = event.at;
      }
    } catch {
      // An unreadable history file is not a reason to refuse new events.
    }
  }
}

/** One store per server process, shared by every route handler (and kept across dev reloads). */
export function monitorStore(): MonitorStore {
  const holder = globalThis as typeof globalThis & { __tilcaiMonitorStore?: MonitorStore };
  holder.__tilcaiMonitorStore ??= new MonitorStore(Number(process.env.MONITOR_STORE_CAPACITY) || 2000, process.env.MONITOR_STORE_FILE || null);
  return holder.__tilcaiMonitorStore;
}
