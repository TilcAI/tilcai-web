"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MonitorSummary, StoredEvent } from "@/lib/monitor/store";

export type FeedState = "loading" | "ready" | "locked" | "unconfigured" | "failed";
export type Connection = "live" | "reconnecting" | "offline";

/** How many events the page keeps on screen. Older ones stay in the backend's log. */
const MAX_EVENTS = 500;
const SUMMARY_EVERY_MS = 30_000;

class HttpError extends Error {
  constructor(readonly status: number) {
    super(`HTTP ${status}`);
  }
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store", credentials: "same-origin" });
  if (!res.ok) throw new HttpError(res.status);
  return (await res.json()) as T;
}

/**
 * The monitoring feed for a page: the summary (resources and alerts of each backend) and the
 * events, loaded once and then kept current over Server-Sent Events.
 *
 * The site's API is the only thing the browser talks to; it never reaches the backend.
 */
export function useMonitorFeed() {
  const [state, setState] = useState<FeedState>("loading");
  const [connection, setConnection] = useState<Connection>("offline");
  const [summary, setSummary] = useState<MonitorSummary | null>(null);
  const [events, setEvents] = useState<StoredEvent[]>([]);
  /** Bumped to load everything again (after unlocking, or on "try again"). */
  const [attempt, setAttempt] = useState(0);
  const cursor = useRef(0);

  const loadSummary = useCallback(async () => {
    setSummary(await getJson<MonitorSummary>("/api/monitor/summary"));
  }, []);

  useEffect(() => {
    let cancelled = false;
    let stream: EventSource | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;

    const add = (incoming: StoredEvent[]) => {
      if (incoming.length === 0) return;
      cursor.current = Math.max(cursor.current, ...incoming.map((e) => e.cursor));
      setEvents((current) => {
        const known = new Set(current.map((e) => e.cursor));
        return [...current, ...incoming.filter((e) => !known.has(e.cursor))].slice(-MAX_EVENTS);
      });
    };

    (async () => {
      try {
        const [first, feed] = await Promise.all([
          getJson<MonitorSummary>("/api/monitor/summary"),
          getJson<{ events: StoredEvent[] }>(`/api/monitor/events?limit=${MAX_EVENTS}`),
        ]);
        if (cancelled) return;
        setSummary(first);
        setEvents([]);
        cursor.current = 0;
        add(feed.events);
        setState("ready");

        stream = new EventSource(`/api/monitor/stream?after=${cursor.current}`);
        stream.onopen = () => setConnection("live");
        // The browser reconnects by itself and resumes with Last-Event-ID.
        stream.onerror = () => setConnection(stream?.readyState === EventSource.CLOSED ? "offline" : "reconnecting");
        stream.addEventListener("monitor", (message) => {
          const event = JSON.parse((message as MessageEvent<string>).data) as StoredEvent;
          add([event]);
          // These change the picture above the feed, not only the feed.
          if (event.type === "resources.snapshot" || event.type.startsWith("alert.")) void loadSummary().catch(() => {});
        });
        timer = setInterval(() => void loadSummary().catch(() => {}), SUMMARY_EVERY_MS);
      } catch (error) {
        if (cancelled) return;
        const status = error instanceof HttpError ? error.status : 0;
        setState(status === 401 ? "locked" : status === 503 ? "unconfigured" : "failed");
      }
    })();

    return () => {
      cancelled = true;
      stream?.close();
      if (timer) clearInterval(timer);
      setConnection("offline");
    };
  }, [attempt, loadSummary]);

  const reload = useCallback(() => {
    setState("loading");
    setAttempt((n) => n + 1);
  }, []);

  /** Presents the dashboard token. Resolves to false when it is not the right one. */
  const unlock = useCallback(
    async (token: string): Promise<boolean> => {
      const res = await fetch("/api/monitor/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) });
      if (!res.ok) return false;
      reload();
      return true;
    },
    [reload],
  );

  const signOut = useCallback(async () => {
    await fetch("/api/monitor/session", { method: "DELETE" });
    reload();
  }, [reload]);

  return { state, connection, summary, events, reload, unlock, signOut };
}
