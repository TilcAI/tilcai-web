"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import type { MonitorSeverity, ResourceSnapshot } from "@/lib/monitor/contract";
import { MONITOR_COPY, type MonitorCopy } from "@/lib/monitor/copy";
import { CATEGORY_LABELS, categoryOf, explainAlert, explainEvent, MONITOR_CATEGORIES, type Lang, type MonitorCategory } from "@/lib/monitor/interpret";
import type { OriginState, StoredEvent } from "@/lib/monitor/store";
import { networkName, vaultLevel, vaultsOf } from "@/lib/monitor/vaults";
import styles from "./MonitorBoard.module.css";
import { useMonitorFeed } from "./useMonitorFeed";

type Level = "ok" | "warning" | "error" | "unknown";
const LEVEL_OF: Record<MonitorSeverity, Level> = { info: "ok", warning: "warning", error: "error" };

/**
 * Base view of the backend monitor: what is wrong now, the resources of each backend and the
 * event feed with its interpretation. It is deliberately plain: the designed dashboard
 * builds on the same hook (`useMonitorFeed`) and the same catalog (`lib/monitor/interpret`).
 */
export function MonitorBoard({ lang }: { lang: Lang }) {
  const t = MONITOR_COPY[lang];
  const feed = useMonitorFeed();

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <div>
          <p className={styles.kicker}>TilcAI</p>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.lead}>{t.lead}</p>
        </div>
        {/* The way back to the site and the language switch live in the site header. */}
        {feed.state === "ready" && (
          <div className={styles.links}>
            <Connection state={feed.connection} t={t} />
          </div>
        )}
      </header>

      {feed.state === "loading" && <p className={styles.note} role="status">…</p>}
      {feed.state === "locked" && <Locked t={t} unlock={feed.unlock} />}
      {feed.state === "unconfigured" && <Notice title={t.unconfigured.title} body={t.unconfigured.body} />}
      {feed.state === "failed" && (
        <Notice title={t.failed}>
          <button type="button" className={styles.button} onClick={feed.reload}>
            {t.retry}
          </button>
        </Notice>
      )}
      {feed.state === "ready" && feed.summary && (
        <>
          {!feed.summary.receiving && <Notice title={t.empty.title} body={t.empty.body} />}
          {feed.summary.origins.map((origin) => (
            <Origin key={origin.instance} origin={origin} lang={lang} t={t} />
          ))}
          <Feed events={feed.events} lang={lang} t={t} />
        </>
      )}
    </div>
  );
}

function Mark({ level, t, label }: { level: Level; t: MonitorCopy; label?: string }) {
  // Status never rides on colour alone: a distinct shape and a word go with it.
  const paths: Record<Level, ReactNode> = {
    ok: <path d="M4 8.5l3 3 5-6" />,
    warning: <path d="M8 2.5l6 11H2zM8 7v3M8 12v.01" />,
    error: <path d="M8 2a6 6 0 100 12A6 6 0 008 2zM5.8 5.8l4.4 4.4M10.2 5.8l-4.4 4.4" />,
    unknown: <path d="M4 8h8" />,
  };
  return (
    <span className={`${styles.mark} ${styles[level]}`}>
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {paths[level]}
      </svg>
      <span>{label ?? t.status[level]}</span>
    </span>
  );
}

function Connection({ state, t }: { state: "live" | "reconnecting" | "offline"; t: MonitorCopy }) {
  const level: Level = state === "live" ? "ok" : state === "reconnecting" ? "warning" : "error";
  return (
    <span role="status">
      <Mark level={level} t={t} label={t.connection[state]} />
    </span>
  );
}

function Notice({ title, body, children }: { title: string; body?: string; children?: ReactNode }) {
  return (
    <section className={styles.notice}>
      <h2>{title}</h2>
      {body && <p>{body}</p>}
      {children}
    </section>
  );
}

function Locked({ t, unlock }: { t: MonitorCopy; unlock: (token: string) => Promise<boolean> }) {
  const [wrong, setWrong] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = String(new FormData(e.currentTarget).get("token") ?? "");
    setBusy(true);
    setWrong(!(await unlock(token)));
    setBusy(false);
  };
  return (
    <Notice title={t.locked.title} body={t.locked.body}>
      <form className={styles.form} onSubmit={submit}>
        <label htmlFor="monitor-token">{t.locked.label}</label>
        <input id="monitor-token" name="token" type="password" autoComplete="off" required aria-describedby={wrong ? "monitor-token-error" : undefined} aria-invalid={wrong} />
        <button type="submit" className={styles.button} disabled={busy}>
          {t.locked.submit}
        </button>
        {wrong && (
          <p id="monitor-token-error" role="alert">
            {t.locked.wrong}
          </p>
        )}
      </form>
    </Notice>
  );
}

function Tile({ label, value, unit, level, t, children }: { label: string; value: string; unit?: string; level?: Level; t: MonitorCopy; children?: ReactNode }) {
  return (
    <div className={styles.tile}>
      <div className={styles.tileHead}>
        <span className={styles.tileLabel}>{label}</span>
        {level && <Mark level={level} t={t} />}
      </div>
      <p className={styles.value}>
        {value}
        {unit && <span className={styles.unit}> {unit}</span>}
      </p>
      {children && <div className={styles.tileBody}>{children}</div>}
    </div>
  );
}

/** Worst level among the alerts whose code starts with one of the prefixes. */
function levelFor(alerts: OriginState["alerts"], ...prefixes: string[]): Level {
  const hits = alerts.filter((a) => prefixes.some((p) => a.code === p || a.code.startsWith(`${p}:`) || a.code.startsWith(`${p}_`)));
  return hits.some((a) => a.severity === "error") ? "error" : hits.length > 0 ? "warning" : "ok";
}

const sum = (rows: Record<string, number>, keep: (state: string) => boolean) => Object.entries(rows).reduce((n, [state, count]) => (keep(state) ? n + count : n), 0);

function Origin({ origin, lang, t }: { origin: OriginState; lang: Lang; t: MonitorCopy }) {
  const number = useMemo(() => new Intl.NumberFormat(lang, { maximumFractionDigits: 2 }), [lang]);
  const time = useMemo(() => new Intl.DateTimeFormat(lang, { dateStyle: "short", timeStyle: "medium" }), [lang]);
  const r: ResourceSnapshot | null = origin.resources;
  const lag = Math.max(origin.head - origin.lastSeq, 0);
  const vaultTiles = r ? vaultsOf(r) : [];

  return (
    <section className={styles.origin} aria-labelledby={`origin-${origin.instance}`}>
      <header className={styles.originHead}>
        <h2 id={`origin-${origin.instance}`}>
          {t.origin.title} <span className={styles.code}>{origin.instance}</span> <span className={styles.env}>{origin.env}</span>
        </h2>
        <p className={styles.meta}>
          {origin.lastDeliveryAt && `${t.origin.lastDelivery}: ${time.format(new Date(origin.lastDeliveryAt))} · `}
          {lag > 0 ? `${number.format(lag)} ${t.origin.lag}` : t.origin.upToDate}
          {origin.resourcesAt && ` · ${t.origin.snapshot} ${time.format(new Date(origin.resourcesAt))}`}
        </p>
      </header>

      <div className={styles.alerts}>
        <h3>{t.alerts.title}</h3>
        {origin.alerts.length === 0 ? (
          <Mark level="ok" t={t} label={t.alerts.none} />
        ) : (
          <ul role="list">
            {origin.alerts.map((alert) => {
              const info = explainAlert(alert.code, lang);
              return (
                <li key={alert.code} className={styles.alert}>
                  <Mark level={LEVEL_OF[alert.severity]} t={t} />
                  <div>
                    <p className={styles.alertTitle}>
                      {info.title}
                      {info.target && <span className={styles.code}> {info.target}</span>}
                    </p>
                    <p>{alert.message}</p>
                    {info.action && (
                      <p className={styles.meta}>
                        {t.alerts.action}: {info.action}
                      </p>
                    )}
                    {alert.since && (
                      <p className={styles.meta}>
                        {t.alerts.since} {time.format(new Date(alert.since))}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {!r ? (
        <p className={styles.note}>{t.origin.noSnapshot}</p>
      ) : (
        <div className={styles.tiles}>
          {vaultTiles.length > 0 ? (
            vaultTiles.map(({ network, vault, error }) => {
              const level = vaultLevel(origin.alerts, network);
              const label = vaultTiles.length > 1 ? `${t.tiles.vault} · ${networkName(network)}` : t.tiles.vault;
              return vault ? (
                <Tile key={network} label={label} value={number.format(Number(vault.balance))} unit="USDC" level={level} t={t}>
                  <Meter value={Number(vault.availableToday)} max={Number(vault.dailyLimit)} label={`${number.format(Number(vault.availableToday))} / ${number.format(Number(vault.dailyLimit))} USDC ${t.tiles.availableToday}`} />
                  <p>
                    {number.format(Number(vault.pending))} USDC {t.tiles.pending} · {number.format(Number(vault.maxPerDisbursement))} USDC {t.tiles.maxPerPayout}
                    {vault.paused && ` · ${t.tiles.paused}`}
                  </p>
                </Tile>
              ) : (
                <Tile key={network} label={label} value="—" level={level === "ok" ? "unknown" : level} t={t}>
                  <p>{error ?? t.tiles.vaultNone}</p>
                </Tile>
              );
            })
          ) : (
            <Tile label={t.tiles.vault} value="—" level={levelFor(origin.alerts, "VAULT") === "ok" ? "unknown" : levelFor(origin.alerts, "VAULT")} t={t}>
              <p>{r.vaultError ?? t.tiles.vaultNone}</p>
            </Tile>
          )}

          {r.relayer.up ? (
            r.relayer.relayers.map((relayer) => (
              <Tile
                key={relayer.id}
                label={`${relayer.id} · ${t.tiles.relayerGas}`}
                value={relayer.balance === null ? "—" : number.format(Number(relayer.balance))}
                unit={relayer.unit ?? undefined}
                level={relayer.error ? "warning" : levelFor(origin.alerts, `RELAYER_LOW_GAS:${relayer.id}`, `RELAYER_PAUSED:${relayer.id}`, `RELAYER_DISABLED:${relayer.id}`)}
                t={t}
              >
                <p className={styles.code}>{relayer.error ?? relayer.address}</p>
              </Tile>
            ))
          ) : (
            <Tile label="Relayer" value="—" level="error" t={t}>
              <p>{t.tiles.relayerDown}</p>
            </Tile>
          )}

          <Tile label={t.tiles.memory} value={number.format(r.process.rssBytes / 1_048_576)} unit="MB" t={t}>
            <p>
              {t.tiles.cpu}: {r.process.cpuLoad === null ? "—" : `${number.format(r.process.cpuLoad * 100)} %`} · {t.tiles.uptime}: {duration(r.process.uptimeSeconds, lang)}
            </p>
          </Tile>
          <Tile label={t.tiles.loopDelay} value={number.format(r.process.eventLoopDelayMs.p99)} unit="ms" level={levelFor(origin.alerts, "EVENT_LOOP_SLOW")} t={t}>
            <p>
              {r.process.role} · pid {r.process.pid} · Node {r.process.node}
            </p>
          </Tile>

          <Queue label={t.tiles.payouts} rows={r.database.vaultDisbursements} done={["CONFIRMED", "FAILED"]} t={t} number={number} />
          <Queue label={t.tiles.payments} rows={r.database.crosschainPayments} done={["SETTLED", "FAILED"]} t={t} number={number} level={levelFor(origin.alerts, "PAYMENTS_UNCERTAIN")} />
          <Queue label={t.tiles.qr} rows={r.database.qrCodes} done={["Pagado", "Anulado", "Fallido"]} t={t} number={number}>
            {number.format(r.database.qrCallbacksPending)} {t.tiles.pendingCallbacks}
          </Queue>
          <Tile label={t.tiles.events} value={number.format(r.database.monitorEvents)} level={levelFor(origin.alerts, "MONITOR_SINK_FAILING")} t={t}>
            <p>
              {t.tiles.database}: {r.database.sizeBytes === null ? "—" : `${number.format((r.database.sizeBytes + (r.database.walBytes ?? 0)) / 1_048_576)} MB`}
            </p>
          </Tile>
        </div>
      )}
    </section>
  );
}

function Queue({ label, rows, done, t, number, level, children }: { label: string; rows: Record<string, number>; done: string[]; t: MonitorCopy; number: Intl.NumberFormat; level?: Level; children?: ReactNode }) {
  const inFlight = sum(rows, (state) => !done.includes(state));
  return (
    <Tile label={label} value={number.format(inFlight)} unit={t.tiles.inFlight} level={level} t={t}>
      <p>
        {number.format(sum(rows, (state) => done.includes(state)))} {t.tiles.settled}
        {children && <> · {children}</>}
      </p>
      {Object.keys(rows).length > 0 && (
        <p className={styles.code}>
          {Object.entries(rows)
            .map(([state, count]) => `${state} ${count}`)
            .join(" · ")}
        </p>
      )}
    </Tile>
  );
}

/** A share of a limit: the track is a lighter step of the fill, so the whole bar reads as one thing. */
function Meter({ value, max, label }: { value: number; max: number; label: string }) {
  const share = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;
  return (
    <div>
      <div className={styles.meter} role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label}>
        <span style={{ width: `${share * 100}%` }} />
      </div>
      <p>{label}</p>
    </div>
  );
}

function duration(seconds: number, lang: Lang): string {
  const units: Array<[number, Intl.RelativeTimeFormatUnit]> = [[86_400, "day"], [3600, "hour"], [60, "minute"], [1, "second"]];
  const [size, unit] = units.find(([s]) => seconds >= s) ?? units[3]!;
  return new Intl.NumberFormat(lang, { style: "unit", unit, unitDisplay: "short", maximumFractionDigits: 1 }).format(seconds / size);
}

function Feed({ events, lang, t }: { events: StoredEvent[]; lang: Lang; t: MonitorCopy }) {
  const [category, setCategory] = useState<MonitorCategory | "all">("all");
  const [severity, setSeverity] = useState<"all" | "warning" | "error">("all");
  const [query, setQuery] = useState("");
  const time = useMemo(() => new Intl.DateTimeFormat(lang, { dateStyle: "short", timeStyle: "medium" }), [lang]);

  const shown = useMemo(() => {
    const text = query.trim().toLowerCase();
    return events
      // The periodic snapshots are what the tiles above show; in the feed they would bury the rest.
      .filter((e) => (category === "all" ? e.type !== "resources.snapshot" : categoryOf(e.type) === category))
      .filter((e) => severity === "all" || e.severity === "error" || (severity === "warning" && e.severity === "warning"))
      .filter((e) => !text || `${e.type} ${e.summary} ${e.subject ?? ""}`.toLowerCase().includes(text))
      .reverse();
  }, [events, category, severity, query]);

  return (
    <section className={styles.feed} aria-labelledby="monitor-feed">
      <header className={styles.feedHead}>
        <h2 id="monitor-feed">
          {t.feed.title} <span className={styles.meta}>{t.feed.count(shown.length, events.length)}</span>
        </h2>
        <div className={styles.filters}>
          <label>
            {t.feed.category}
            <select value={category} onChange={(e) => setCategory(e.target.value as MonitorCategory | "all")}>
              <option value="all">{t.feed.all}</option>
              {MONITOR_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c][lang]}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t.feed.severity}
            <select value={severity} onChange={(e) => setSeverity(e.target.value as "all" | "warning" | "error")}>
              <option value="all">{t.feed.severityAll}</option>
              <option value="warning">{t.feed.severityWarning}</option>
              <option value="error">{t.feed.severityError}</option>
            </select>
          </label>
          <label>
            {t.feed.search}
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
        </div>
      </header>

      {shown.length === 0 ? (
        <p className={styles.note}>{t.feed.none}</p>
      ) : (
        <ol className={styles.rows} role="list">
          {shown.map((e) => {
            const info = explainEvent(e.type, lang);
            const kind = categoryOf(e.type);
            return (
              <li key={e.cursor}>
                <details className={styles.row}>
                  <summary>
                    <time dateTime={e.at} className={styles.when}>
                      {time.format(new Date(e.at))}
                    </time>
                    <Mark level={LEVEL_OF[e.severity]} t={t} />
                    <span className={styles.what}>
                      <strong>{info.title}</strong>
                      <span>{e.summary}</span>
                    </span>
                    <span className={styles.kind}>{kind === "other" ? e.type : CATEGORY_LABELS[kind][lang]}</span>
                  </summary>
                  <dl className={styles.detail}>
                    <dt>{t.feed.event}</dt>
                    <dd className={styles.code}>
                      {e.type} · {e.source} · #{e.seq} · {e.origin}
                    </dd>
                    {e.subject && (
                      <>
                        <dt>{t.feed.subject}</dt>
                        <dd className={styles.code}>{e.subject}</dd>
                      </>
                    )}
                    <dt>{t.feed.meaning}</dt>
                    <dd>{info.meaning}</dd>
                    <dt>{t.feed.data}</dt>
                    <dd>
                      <pre>{JSON.stringify(e.data, null, 2)}</pre>
                    </dd>
                  </dl>
                </details>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
