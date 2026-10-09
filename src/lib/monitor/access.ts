import { sameSecret, sessionValue } from "./signature.ts";

export const SESSION_COOKIE = "tilcai_monitor";
export const SESSION_MAX_AGE_SECONDS = 12 * 3600;

export type Access = "open" | "granted" | "denied" | "unconfigured";

const cookieOf = (request: Request, name: string): string | null => {
  for (const part of (request.headers.get("cookie") ?? "").split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return null;
};

/**
 * Who may read the monitoring data: balances, addresses and operation ids of the backend.
 *
 *  - with MONITOR_DASHBOARD_TOKEN: whoever presents it (the session cookie the page sets, or
 *    `Authorization: Bearer <token>` for scripts);
 *  - without it: anyone in development, nobody in production. A dashboard nobody configured
 *    must not end up public by default.
 */
export function readAccess(request: Request, env: Record<string, string | undefined> = process.env): Access {
  const token = env.MONITOR_DASHBOARD_TOKEN;
  if (!token) return env.NODE_ENV === "production" ? "unconfigured" : "open";
  const bearer = /^Bearer (.+)$/.exec(request.headers.get("authorization") ?? "")?.[1];
  if (bearer && sameSecret(bearer, token)) return "granted";
  const session = cookieOf(request, SESSION_COOKIE);
  return session && sameSecret(session, sessionValue(token)) ? "granted" : "denied";
}

/** The JSON answer for a reader that may not read, or null when it may. */
export function refuse(access: Access): Response | null {
  if (access === "open" || access === "granted") return null;
  return access === "denied"
    ? Response.json({ error: "unauthorized", message: "Present the dashboard token." }, { status: 401 })
    : Response.json({ error: "not_configured", message: "Set MONITOR_DASHBOARD_TOKEN to enable the dashboard." }, { status: 503 });
}
