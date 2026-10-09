import { readAccess, refuse } from "@/lib/monitor/access";
import { monitorStore, type StoredEvent } from "@/lib/monitor/store";

/**
 * The feed, live (Server-Sent Events). `?after=<cursor>` or the browser's own
 * `Last-Event-ID` resume where a dropped connection left off; without either, only what
 * arrives from now on is sent.
 */
export async function GET(request: Request): Promise<Response> {
  const denied = refuse(readAccess(request));
  if (denied) return denied;
  const store = monitorStore();
  const asked = new URL(request.url).searchParams.get("after") ?? request.headers.get("last-event-id");
  let cursor = asked && /^\d{1,12}$/.test(asked) ? Number(asked) : store.summary().cursor;

  const encoder = new TextEncoder();
  let close = () => {};
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (text: string) => {
        try {
          controller.enqueue(encoder.encode(text));
        } catch {
          close();
        }
      };
      const push = (e: StoredEvent) => {
        if (e.cursor <= cursor) return;
        cursor = e.cursor;
        send(`id: ${e.cursor}\nevent: monitor\ndata: ${JSON.stringify(e)}\n\n`);
      };
      send("retry: 3000\n\n");
      for (const e of store.list({ after: cursor, limit: 500 })) push(e);
      const unsubscribe = store.subscribe(push);
      // Proxies drop a connection that says nothing for a while.
      const beat = setInterval(() => send(": ping\n\n"), 20_000);
      close = () => {
        clearInterval(beat);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // already closed by the client
        }
      };
      request.signal.addEventListener("abort", close);
    },
    cancel() {
      close();
    },
  });
  return new Response(stream, {
    headers: { "content-type": "text/event-stream; charset=utf-8", "cache-control": "no-cache, no-transform", connection: "keep-alive", "x-accel-buffering": "no" },
  });
}
