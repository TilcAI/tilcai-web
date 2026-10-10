import { readAccess, refuse } from "@/lib/monitor/access";
import { MONITOR_SCHEMA, MONITOR_SEVERITIES, MONITOR_SOURCES, parseDelivery, type MonitorSeverity, type MonitorSource } from "@/lib/monitor/contract";
import { authenticateDelivery, scopeAllows } from "@/lib/monitor/signature";
import { monitorStore } from "@/lib/monitor/store";

const MAX_BODY_BYTES = 1024 * 1024;

/**
 * Ingest: TilcAI's backend pushes its events here.
 *
 * Every delivery is signed with the secret both sides share (MONITOR_INGEST_SECRET here,
 * MONITOR_WEB_SECRET there). A mainnet backend has its own pair (MONITOR_INGEST_SECRET_MAINNET
 * here, MONITOR_WEB_SECRET_MAINNET there), and each secret is good for its environment only. A 2xx tells the backend to move on; anything else makes it
 * send the same events again later, so repeated deliveries are expected and harmless.
 */
export async function POST(request: Request): Promise<Response> {
  const secrets = { other: process.env.MONITOR_INGEST_SECRET || undefined, mainnet: process.env.MONITOR_INGEST_SECRET_MAINNET || undefined };
  if (!secrets.other && !secrets.mainnet) return Response.json({ error: "not_configured", message: "Set MONITOR_INGEST_SECRET to accept events." }, { status: 503 });

  const body = await request.text();
  if (Buffer.byteLength(body) > MAX_BODY_BYTES) return Response.json({ error: "too_large" }, { status: 413 });
  const signed = authenticateDelivery({ secrets, timestamp: request.headers.get("x-tilcai-timestamp"), signature: request.headers.get("x-tilcai-signature"), body });
  if (!signed.ok) return Response.json({ error: "unauthorized", reason: signed.reason }, { status: 401 });

  let json: unknown;
  try {
    json = JSON.parse(body);
  } catch {
    return Response.json({ error: "invalid", reason: "body is not JSON" }, { status: 400 });
  }
  const parsed = parseDelivery(json);
  if (!parsed.ok) return Response.json({ error: "invalid", reason: parsed.reason }, { status: 400 });
  if (!scopeAllows(signed.scope, parsed.delivery.origin.env)) return Response.json({ error: "unauthorized", reason: "environment" }, { status: 401 });
  return Response.json({ ok: true, ...monitorStore().ingest(parsed.delivery) });
}

/** The feed: `?after=<cursor>` for what came later, without it the newest events. */
export async function GET(request: Request): Promise<Response> {
  const denied = refuse(readAccess(request));
  if (denied) return denied;
  const q = new URL(request.url).searchParams;
  const number = (name: string) => (q.has(name) && /^\d{1,12}$/.test(q.get(name)!) ? Number(q.get(name)) : undefined);
  const source = q.get("source");
  const severity = q.get("severity");
  const type = q.get("type");
  const store = monitorStore();
  const events = store.list({
    after: number("after"),
    limit: number("limit"),
    ...(type && /^[a-z0-9_.]{1,80}$/.test(type) ? { type } : {}),
    ...((MONITOR_SOURCES as readonly string[]).includes(source ?? "") ? { source: source as MonitorSource } : {}),
    ...((MONITOR_SEVERITIES as readonly string[]).includes(severity ?? "") ? { minSeverity: severity as MonitorSeverity } : {}),
  });
  return Response.json({ schema: MONITOR_SCHEMA, cursor: store.summary().cursor, events }, { headers: { "cache-control": "no-store" } });
}
