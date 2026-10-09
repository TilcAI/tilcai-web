import { readAccess, refuse } from "@/lib/monitor/access";
import { MONITOR_SCHEMA } from "@/lib/monitor/contract";
import { monitorStore } from "@/lib/monitor/store";

/** Where things stand: each backend's last resource snapshot, its alerts and the feed's counters. */
export async function GET(request: Request): Promise<Response> {
  const denied = refuse(readAccess(request));
  if (denied) return denied;
  return Response.json({ schema: MONITOR_SCHEMA, ...monitorStore().summary() }, { headers: { "cache-control": "no-store" } });
}
