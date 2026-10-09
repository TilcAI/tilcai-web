import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { readAccess, refuse, SESSION_COOKIE } from "../src/lib/monitor/access.ts";
import { MONITOR_EVENT_TYPES, MONITOR_SCHEMA, parseDelivery, type MonitorDelivery, type MonitorEvent } from "../src/lib/monitor/contract.ts";
import { ALERT_CATALOG, categoryOf, CATEGORY_LABELS, EVENT_CATALOG, explainAlert, explainEvent, MONITOR_CATEGORIES } from "../src/lib/monitor/interpret.ts";
import { sessionValue, signDelivery, verifyDelivery } from "../src/lib/monitor/signature.ts";
import { MonitorStore } from "../src/lib/monitor/store.ts";

let n = 0;
const event = (over: Partial<MonitorEvent> = {}): MonitorEvent => {
  n++;
  return { seq: n, id: `evt_${n}`, type: "qr.paid", source: "qr-simple", severity: "info", subject: `qr:${n}`, summary: `evento ${n}`, data: {}, at: "2026-10-09T07:00:00.000Z", ...over };
};
const delivery = (events: MonitorEvent[], over: Partial<MonitorDelivery> = {}): MonitorDelivery => ({
  schema: MONITOR_SCHEMA,
  deliveryId: "d-1",
  sentAt: "2026-10-09T07:00:01.000Z",
  origin: { env: "testnet", instance: "host-a" },
  head: events.at(-1)?.seq ?? 0,
  events,
  ...over,
});

test("contract: a delivery is checked field by field before anything is stored", () => {
  const good = delivery([event(), event({ subject: null, type: "future.kind_of_event" })]);
  const parsed = parseDelivery(JSON.parse(JSON.stringify(good)));
  assert.equal(parsed.ok, true);
  assert.deepEqual(parsed.ok && parsed.delivery, good);

  const bad: Array<[unknown, RegExp]> = [
    [null, /object/],
    [{ ...good, schema: "tilcai-monitor-v0" }, /schema/],
    [{ ...good, deliveryId: "" }, /deliveryId/],
    [{ ...good, sentAt: "ayer" }, /sentAt/],
    [{ ...good, origin: { env: "testnet" } }, /origin/],
    [{ ...good, head: -1 }, /head/],
    [{ ...good, events: "muchos" }, /events/],
    [{ ...good, events: Array.from({ length: 501 }, () => event()) }, /events/],
    [{ ...good, events: [{ ...event(), seq: 0 }] }, /events\[0\]\.seq/],
    [{ ...good, events: [{ ...event(), type: "<script>" }] }, /events\[0\]\.type/],
    [{ ...good, events: [event(), { ...event(), source: "banco" }] }, /events\[1\]\.source/],
    [{ ...good, events: [{ ...event(), severity: "fatal" }] }, /severity/],
    [{ ...good, events: [{ ...event(), summary: "x".repeat(401) }] }, /summary/],
    [{ ...good, events: [{ ...event(), data: [] }] }, /data/],
    [{ ...good, events: [{ ...event(), at: "nunca" }] }, /\.at/],
  ];
  for (const [body, reason] of bad) {
    const r = parseDelivery(body);
    assert.equal(r.ok, false);
    assert.match(r.ok ? "" : r.reason, reason);
  }
  // Fields nobody declared do not travel further.
  const extra = parseDelivery({ ...good, admin: true, events: [{ ...event(), __proto__: { x: 1 }, extra: "x" }] });
  assert.equal(extra.ok && "admin" in extra.delivery, false);
  assert.equal(extra.ok && "extra" in extra.delivery.events[0]!, false);
});

test("signature: the backend's HMAC over «timestamp.body», fresh and untouched", () => {
  const secret = "secreto-compartido-de-prueba";
  const body = JSON.stringify(delivery([event()]));
  const nowMs = Date.parse("2026-10-09T07:00:00Z");
  const timestamp = String(nowMs / 1000);
  const signature = signDelivery(secret, timestamp, body);
  // The same computation tilcai-infrastructure does (src/modules/monitor/forwarder.ts).
  assert.equal(signature, `v1=${createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex")}`);
  // A fixed vector computed with OpenSSL: printf '1791529200.{}' | openssl dgst -sha256 -hmac k
  assert.equal(signDelivery("k", "1791529200", "{}"), "v1=8cac9852ba6db796cf12fee8f3df5e29e3d143e840968d14a667bb844d06f8f7");

  assert.deepEqual(verifyDelivery({ secret, timestamp, signature, body, nowMs }), { ok: true });
  assert.deepEqual(verifyDelivery({ secret, timestamp, signature, body, nowMs: nowMs + 299_000 }), { ok: true });
  assert.deepEqual(verifyDelivery({ secret, timestamp, signature, body, nowMs: nowMs + 301_000 }), { ok: false, reason: "stale" });
  assert.deepEqual(verifyDelivery({ secret, timestamp, signature, body, nowMs: nowMs - 301_000 }), { ok: false, reason: "stale" });
  assert.deepEqual(verifyDelivery({ secret, timestamp, signature, body: body.replace("evento", "Evento"), nowMs }), { ok: false, reason: "mismatch" });
  assert.deepEqual(verifyDelivery({ secret: "otro", timestamp, signature, body, nowMs }), { ok: false, reason: "mismatch" });
  // A valid signature does not survive another timestamp.
  assert.deepEqual(verifyDelivery({ secret, timestamp: String(nowMs / 1000 + 5), signature, body, nowMs }), { ok: false, reason: "mismatch" });
  for (const [t, s] of [[null, signature], [timestamp, null], ["ahora", signature], ["", ""]] as const) {
    assert.deepEqual(verifyDelivery({ secret, timestamp: t, signature: s, body, nowMs }), { ok: false, reason: "missing" });
  }
});

test("store: keeps events in arrival order, once, and tells readers what is new", () => {
  const store = new MonitorStore();
  const heard: number[] = [];
  store.subscribe((e) => heard.push(e.cursor));
  const [a, b, c] = [event(), event({ type: "vault.disbursement.rejected", source: "tilcai", severity: "error" }), event({ type: "relayer.transaction_update", source: "relayer" })];

  assert.deepEqual(store.ingest(delivery([a!, b!])), { accepted: 2, duplicates: 0, cursor: 2 });
  // The backend retries a delivery it did not get an answer for.
  assert.deepEqual(store.ingest(delivery([a!, b!, c!])), { accepted: 1, duplicates: 2, cursor: 3 });
  assert.deepEqual(heard, [1, 2, 3]);

  assert.deepEqual(store.list().map((e) => [e.cursor, e.id, e.origin]), [[1, a!.id, "host-a"], [2, b!.id, "host-a"], [3, c!.id, "host-a"]]);
  assert.deepEqual(store.list({ after: 1 }).map((e) => e.cursor), [2, 3]);
  assert.deepEqual(store.list({ after: 1, limit: 1 }).map((e) => e.cursor), [2]);
  assert.deepEqual(store.list({ limit: 2 }).map((e) => e.cursor), [2, 3]);
  assert.deepEqual(store.list({ type: "vault." }).map((e) => e.cursor), [2]);
  assert.deepEqual(store.list({ type: "qr.paid" }).map((e) => e.cursor), [1]);
  assert.deepEqual(store.list({ source: "relayer" }).map((e) => e.cursor), [3]);
  assert.deepEqual(store.list({ minSeverity: "warning" }).map((e) => e.cursor), [2]);

  const s = store.summary();
  assert.deepEqual([s.cursor, s.stored, s.receiving], [3, 3, true]);
  assert.deepEqual(s.counts.bySeverity, { info: 2, warning: 0, error: 1 });
  assert.deepEqual(s.counts.bySource, { tilcai: 1, relayer: 1, "qr-simple": 1 });
  assert.deepEqual(s.counts.byCategory, { qr: 1, vault: 1, relayer: 1 });
});

test("store: two backends are told apart, even when their event ids collide", () => {
  const store = new MonitorStore();
  const e = event();
  store.ingest(delivery([e], { head: 40 }));
  assert.equal(store.ingest(delivery([e], { origin: { env: "testnet", instance: "host-b" }, head: 7 })).accepted, 1);
  const origins = store.summary().origins;
  assert.deepEqual(origins.map((o) => [o.instance, o.head, o.lastSeq]), [["host-a", 40, e.seq], ["host-b", 7, e.seq]]);
});

test("store: holds the last events only, and a dropped one can come back", () => {
  const store = new MonitorStore(3);
  const events = [event(), event(), event(), event(), event()];
  store.ingest(delivery(events));
  assert.deepEqual(store.list().map((e) => e.id), events.slice(2).map((e) => e.id));
  assert.deepEqual([store.summary().stored, store.summary().capacity, store.summary().cursor], [3, 3, 5]);
  // Forgotten, so not a duplicate any more.
  assert.equal(store.ingest(delivery([events[0]!])).accepted, 1);
  assert.equal(store.ingest(delivery([events[4]!])).accepted, 0);
});

test("store: the last snapshot and the alerts of each backend stay current", () => {
  const store = new MonitorStore();
  const snapshot = (alerts: Array<{ code: string; severity: "warning" | "error"; message: string }>) =>
    event({ type: "resources.snapshot", source: "tilcai", at: `2026-10-09T07:0${n % 10}:00.000Z`, data: { takenAt: "t", vault: { balance: "0" }, alerts } });
  const empty = { code: "VAULT_EMPTY", severity: "error" as const, message: "El vault no tiene USDC" };

  store.ingest(delivery([event({ type: "alert.raised", source: "tilcai", severity: "error", summary: empty.message, data: { code: "VAULT_EMPTY" }, at: "2026-10-09T06:59:00.000Z" })]));
  assert.deepEqual(store.summary().origins[0]!.alerts, [{ ...empty, since: "2026-10-09T06:59:00.000Z" }]);
  assert.equal(store.summary().origins[0]!.resources, null);

  const first = snapshot([empty, { code: "RELAYER_LOW_GAS:stellar-example", severity: "warning", message: "poco gas" }]);
  store.ingest(delivery([first]));
  const origin = store.summary().origins[0]!;
  assert.equal(origin.resourcesAt, first.at);
  assert.deepEqual((origin.resources as unknown as { vault: unknown }).vault, { balance: "0" });
  // The snapshot is the truth about what is wrong now; the moment it started is kept.
  assert.deepEqual(origin.alerts.map((a) => [a.code, a.since]), [["VAULT_EMPTY", "2026-10-09T06:59:00.000Z"], ["RELAYER_LOW_GAS:stellar-example", null]]);

  store.ingest(delivery([event({ type: "alert.cleared", source: "tilcai", data: { code: "VAULT_EMPTY" } })]));
  assert.deepEqual(store.summary().origins[0]!.alerts.map((a) => a.code), ["RELAYER_LOW_GAS:stellar-example"]);
  store.ingest(delivery([snapshot([])]));
  assert.deepEqual(store.summary().origins[0]!.alerts, []);
});

test("store: with a file, a restarted server remembers the tail of the feed", () => {
  const dir = mkdtempSync(join(tmpdir(), "tilcai-monitor-"));
  const file = join(dir, "nested", "events.jsonl");
  try {
    const first = new MonitorStore(3, file);
    const events = [event(), event(), event(), event({ type: "alert.raised", source: "tilcai", severity: "error", summary: "sin fondos", data: { code: "VAULT_EMPTY" } })];
    first.ingest(delivery(events));
    assert.equal(readFileSync(file, "utf8").trim().split("\n").length, 4);

    const second = new MonitorStore(3, file);
    assert.deepEqual(second.list().map((e) => e.id), events.slice(1).map((e) => e.id));
    assert.deepEqual(second.summary().origins.map((o) => [o.instance, o.env, o.alerts.map((a) => a.code)]), [["host-a", "testnet", ["VAULT_EMPTY"]]]);
    // What it reloaded is still recognised as already seen.
    assert.deepEqual(second.ingest(delivery([events[3]!, event()])), { accepted: 1, duplicates: 1, cursor: 4 });
    // A history that cannot be read does not stop the feed.
    assert.doesNotThrow(() => new MonitorStore(3, dir).ingest(delivery([event()])));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("access: reading needs the dashboard token; unconfigured is open only outside production", () => {
  const request = (headers: Record<string, string> = {}) => new Request("https://tilcai.test/api/monitor/events", { headers });
  const token = "token-del-tablero";

  assert.equal(readAccess(request(), { NODE_ENV: "development" }), "open");
  assert.equal(readAccess(request(), { NODE_ENV: "production" }), "unconfigured");
  assert.equal(readAccess(request(), { NODE_ENV: "production", MONITOR_DASHBOARD_TOKEN: "" }), "unconfigured");

  const env = { NODE_ENV: "production", MONITOR_DASHBOARD_TOKEN: token };
  assert.equal(readAccess(request(), env), "denied");
  assert.equal(readAccess(request({ authorization: `Bearer ${token}` }), env), "granted");
  assert.equal(readAccess(request({ authorization: "Bearer otro" }), env), "denied");
  assert.equal(readAccess(request({ cookie: `tema=oscuro; ${SESSION_COOKIE}=${sessionValue(token)}` }), env), "granted");
  // The cookie holds a value derived from the token, never the token.
  assert.equal(readAccess(request({ cookie: `${SESSION_COOKIE}=${token}` }), env), "denied");
  assert.equal(readAccess(request({ cookie: `${SESSION_COOKIE}=${sessionValue("otro")}` }), env), "denied");
  assert.notEqual(sessionValue(token), token);
  // In development a configured token is still required.
  assert.equal(readAccess(request(), { NODE_ENV: "development", MONITOR_DASHBOARD_TOKEN: token }), "denied");

  assert.equal(refuse("open"), null);
  assert.equal(refuse("granted"), null);
  assert.equal(refuse("denied")?.status, 401);
  assert.equal(refuse("unconfigured")?.status, 503);
});

test("interpretation: every event type and category is explained in both languages", () => {
  assert.deepEqual(Object.keys(EVENT_CATALOG).sort(), [...MONITOR_EVENT_TYPES].sort());
  for (const type of MONITOR_EVENT_TYPES) {
    assert.notEqual(categoryOf(type), "other", type);
    for (const lang of ["en", "es"] as const) {
      const { title, meaning } = explainEvent(type, lang);
      assert.ok(title.length > 3 && meaning.length > 20, `${type} ${lang}`);
    }
    assert.notEqual(explainEvent(type, "en").meaning, explainEvent(type, "es").meaning, type);
  }
  assert.deepEqual(Object.keys(CATEGORY_LABELS).sort(), [...MONITOR_CATEGORIES].sort());
  assert.deepEqual([categoryOf("vault.disbursement.rejected"), categoryOf("qr.paid"), categoryOf("billing.invoice")], ["vault", "qr", "other"]);
  // A type from a newer backend is shown by its name instead of breaking the page.
  assert.equal(explainEvent("billing.invoice", "es").title, "billing.invoice");
});

test("interpretation: alerts say what to do, including the one that kept payouts waiting", () => {
  const empty = explainAlert("VAULT_EMPTY", "es");
  assert.match(empty.action, /dirección del contrato vault \(no a la cuenta del relayer\)/);
  assert.equal(empty.target, null);
  assert.deepEqual(explainAlert("RELAYER_LOW_GAS:avalanche-fuji-relayer", "en"), { title: "A relayer is low on gas", action: "Fund its account (AVAX on Fuji, XLM on Stellar).", target: "avalanche-fuji-relayer" });
  assert.deepEqual(explainAlert("SOMETHING_NEW:x:y", "en"), { title: "SOMETHING_NEW:x:y", action: "", target: "x:y" });
  for (const [code, entry] of Object.entries(ALERT_CATALOG)) {
    for (const lang of ["en", "es"] as const) assert.ok(entry.title[lang] && entry.action[lang], `${code} ${lang}`);
  }
});

// With both repositories side by side (the team's layout), the mirror is checked against the
// backend's own list. Elsewhere (CI of this repository alone) there is nothing to compare.
const backend = new URL("../../tilcai-infrastructure/src/modules/monitor/", import.meta.url);
test("contract: event types and alert codes match the backend's", { skip: !existsSync(new URL("domain.ts", backend)) }, () => {
  const domain = readFileSync(new URL("domain.ts", backend), "utf8");
  const list = /export const MONITOR_EVENT_TYPES = \[([\s\S]*?)\] as const;/.exec(domain)![1]!;
  assert.deepEqual([...list.matchAll(/^\s*"([a-z0-9_.]+)"/gm)].map((m) => m[1]), [...MONITOR_EVENT_TYPES]);
  assert.match(domain, new RegExp(`MONITOR_SCHEMA = "${MONITOR_SCHEMA}"`));

  const resources = readFileSync(new URL("resources.ts", backend), "utf8");
  const codes = new Set([...resources.matchAll(/add\((?:"|`)([A-Z_]+)/g)].map((m) => m[1]!));
  assert.ok(codes.size >= 10);
  for (const code of codes) assert.ok(ALERT_CATALOG[code], `alert ${code} has no explanation`);
});
