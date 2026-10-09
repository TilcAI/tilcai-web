import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/monitor/access";
import { sameSecret, sessionValue } from "@/lib/monitor/signature";

/** Trades the dashboard token for a session cookie the page's requests carry on their own. */
export async function POST(request: Request): Promise<Response> {
  const token = process.env.MONITOR_DASHBOARD_TOKEN;
  if (!token) return Response.json({ error: "not_configured" }, { status: 503 });
  const body = (await request.json().catch(() => null)) as { token?: unknown } | null;
  if (typeof body?.token !== "string" || !sameSecret(body.token, token)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  (await cookies()).set(SESSION_COOKIE, sessionValue(token), {
    httpOnly: true,
    sameSite: "strict",
    // A Secure cookie set over plain http (a tailnet IP, no TLS) is dropped by the browser, so the
    // session would answer ok and never stick. Secure follows how the request actually arrived.
    secure: (request.headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", "")) === "https",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return Response.json({ ok: true });
}

export async function DELETE(): Promise<Response> {
  (await cookies()).delete(SESSION_COOKIE);
  return Response.json({ ok: true });
}
