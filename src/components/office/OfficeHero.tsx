"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { Copy } from "@/lib/i18n";
import { Icon, type IconName } from "../Icon";
import { agentAt, drawDynamic, drawStatic, fitCamera, type Camera, type RenderLabels } from "./render";
import { formatCents, OfficeSim } from "./sim";
import type { AgentInfo, EventKind, OfficeEvent, OfficeStats } from "./types";

const INITIAL_STATS: OfficeStats = {
  rootCapCents: 15000, rootLeftCents: 15000, volumeCents: 0, decisions: 0, allow: 0, deny: 0,
  approvals: 0, settled: 0, periodLeft: 180, mandatePaused: false, frozen: false,
};

type Filter = "all" | "decisions" | "payments" | "a2a";
const FILTERS: Record<Filter, EventKind[] | null> = {
  all: null,
  decisions: ["allow", "deny", "approval"],
  payments: ["x402", "receipt"],
  a2a: ["intent", "quote"],
};

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const m = window.matchMedia(reducedQuery);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

function useReducedMotion() {
  return useSyncExternalStore(subscribeReduced, () => window.matchMedia(reducedQuery).matches, () => false);
}

const narrowQuery = "(max-width: 900px)";
const subscribeNarrow = (cb: () => void) => {
  const m = window.matchMedia(narrowQuery);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

function useNarrow() {
  return useSyncExternalStore(subscribeNarrow, () => window.matchMedia(narrowQuery).matches, () => false);
}

const fmtClock = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
type FeedEvent = OfficeEvent & { renderKey: number };

/** Interactive office simulation below the landing hero. */
export function OfficeHero({ t }: { t: Copy }) {
  const o = t.office;
  const locale = t.locale;
  const stageRef = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLCanvasElement>(null);
  const dynRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<OfficeSim | null>(null);
  const camRef = useRef<Camera | null>(null);
  const viewRef = useRef({ zoom: 1, panX: 0, panY: 0, staticPanX: 0, staticPanY: 0, dirty: true, visible: true, compact: false });
  const bufferRef = useRef<FeedEvent[]>([]);
  const feedKeyRef = useRef(0);
  const selectedRef = useRef<number | null>(null);
  const hoverRef = useRef<number | null>(null);
  const runningRef = useRef(true);
  const dragRef = useRef<{ x: number; y: number; px: number; py: number; moved: boolean } | null>(null);

  const reduced = useReducedMotion();
  const [userRunning, setUserRunning] = useState<boolean | null>(null);
  const running = userRunning ?? !reduced;
  const [stats, setStats] = useState<OfficeStats>(INITIAL_STATS);
  const [feed, setFeed] = useState<FeedEvent[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const narrow = useNarrow();
  const [feedPref, setFeedPref] = useState<boolean | null>(null);
  const feedOpen = feedPref ?? !narrow;
  const toggleFeed = () => setFeedPref(!feedOpen);
  const [selected, setSelected] = useState<AgentInfo | null>(null);

  const labels = useMemo<Omit<RenderLabels, "font" | "mono">>(() => ({
    rooms: Object.fromEntries(Object.entries(o.rooms).map(([k, v]) => [k, v.name])) as RenderLabels["rooms"],
    sellers: [o.sim.sellers.cinema, o.sim.sellers.data, o.sim.sellers.risk, o.sim.sellers.travel],
  }), [o]);

  useEffect(() => { runningRef.current = running; }, [running]);

  // Simulation + render loop.
  useEffect(() => {
    const stage = stageRef.current, cs = staticRef.current, cd = dynRef.current;
    if (!stage || !cs || !cd) return;
    const sctx = cs.getContext("2d"), dctx = cd.getContext("2d");
    if (!sctx || !dctx) return;

    const sim = new OfficeSim(o.sim);
    simRef.current = sim;
    bufferRef.current = [];
    sim.onEvent = (e) => { bufferRef.current.push({ ...e, renderKey: ++feedKeyRef.current }); };
    // Pre-warm so the floor is already busy on first paint.
    for (let i = 0; i < 26 * 20; i++) sim.update(1 / 20);
    bufferRef.current = bufferRef.current.slice(-10);

    const css = getComputedStyle(document.documentElement);
    const font = css.getPropertyValue("--font-display").trim() || "system-ui, sans-serif";
    const mono = css.getPropertyValue("--font-mono-stack").trim() || "ui-monospace, monospace";
    const fullLabels: RenderLabels = { ...labels, font, mono };

    const view = viewRef.current;
    const resize = () => {
      const r = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      for (const c of [cs, cd]) { c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr); }
      view.compact = r.width < 760;
      camRef.current = fitCamera(r.width, r.height, dpr, view.zoom, view.panX, view.panY);
      view.dirty = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    const io = new IntersectionObserver(([entry]) => { view.visible = entry.isIntersecting; }, { threshold: 0.02 });
    io.observe(stage);

    let raf = 0, last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!view.visible || document.hidden) return;
      const cam = camRef.current;
      if (!cam) return;
      if (view.dirty) {
        drawStatic(sctx, cam, fullLabels);
        cs.style.transform = "";
        view.staticPanX = view.panX; view.staticPanY = view.panY;
        view.dirty = false;
      }
      if (runningRef.current) sim.update(dt);
      drawDynamic(dctx, cam, sim, fullLabels, { selected: selectedRef.current, hover: hoverRef.current, compact: view.compact });
    };
    // Draw at least once even when paused (reduced motion).
    raf = requestAnimationFrame(frame);

    const tick = window.setInterval(() => {
      setStats(sim.getStats());
      if (bufferRef.current.length) {
        const fresh = bufferRef.current.splice(0).reverse();
        setFeed((prev) => [...fresh, ...prev].slice(0, 40));
      }
      if (selectedRef.current !== null) setSelected(sim.agentInfo(selectedRef.current));
    }, 250);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(tick);
      ro.disconnect();
      io.disconnect();
      sim.onEvent = null;
      simRef.current = null;
    };
  }, [o, labels]);

  const recamera = useCallback(() => {
    const stage = stageRef.current, cam = camRef.current;
    if (!stage || !cam) return;
    const v = viewRef.current;
    const r = stage.getBoundingClientRect();
    camRef.current = fitCamera(r.width, r.height, cam.dpr, v.zoom, v.panX, v.panY);
    v.dirty = true;
  }, []);

  const zoomBy = (k: number) => {
    const v = viewRef.current;
    v.zoom = Math.max(0.6, Math.min(2.4, v.zoom * k));
    recamera();
  };
  const resetView = () => {
    Object.assign(viewRef.current, { zoom: 1, panX: 0, panY: 0 });
    recamera();
  };

  const command = (cmd: Parameters<OfficeSim["command"]>[0]) => {
    simRef.current?.command(cmd);
    const sim = simRef.current;
    if (sim) setStats(sim.getStats());
  };

  // Pointer: drag to pan (mouse/pen), click/tap to select an agent.
  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === "touch") return;
    const v = viewRef.current;
    dragRef.current = { x: e.clientX, y: e.clientY, px: v.panX, py: v.panY, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const d = dragRef.current;
    if (d) {
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
      if (d.moved) {
        const v = viewRef.current;
        v.panX = d.px + dx; v.panY = d.py + dy;
        // Move the cached floor with CSS while dragging; it is redrawn on release.
        staticRef.current!.style.transform = `translate(${v.panX - v.staticPanX}px, ${v.panY - v.staticPanY}px)`;
        recameraLive();
      }
      return;
    }
    const cam = camRef.current, sim = simRef.current;
    if (!cam || !sim || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    const id = agentAt(cam, sim, e.clientX - r.left, e.clientY - r.top);
    hoverRef.current = id;
    e.currentTarget.style.cursor = id !== null ? "pointer" : "grab";
  };
  const recameraLive = () => {
    // Recompute the camera for agents without redrawing the floor every move.
    const stage = stageRef.current, cam = camRef.current;
    if (!stage || !cam) return;
    const v = viewRef.current;
    const r = stage.getBoundingClientRect();
    camRef.current = fitCamera(r.width, r.height, cam.dpr, v.zoom, v.panX, v.panY);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (d?.moved) { viewRef.current.dirty = true; return; }
    select(e);
  };
  const select = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cam = camRef.current, sim = simRef.current;
    if (!cam || !sim) return;
    const r = e.currentTarget.getBoundingClientRect();
    const id = agentAt(cam, sim, e.clientX - r.left, e.clientY - r.top);
    selectedRef.current = id;
    setSelected(id === null ? null : sim.agentInfo(id));
  };

  const visibleFeed = FILTERS[filter] ? feed.filter((e) => FILTERS[filter]!.includes(e.kind)) : feed;
  const allowPct = stats.decisions ? Math.round((stats.allow / stats.decisions) * 100) : 0;
  const rootUsed = 1 - stats.rootLeftCents / stats.rootCapCents;

  const cmds: { id: Parameters<OfficeSim["command"]>[0]; icon: IconName; label: string; hint: string; tone?: string; pressed?: boolean }[] = [
    { id: "purchase", icon: "cart", label: o.commands.purchase, hint: o.hints.purchase, tone: "allow" },
    { id: "injection", icon: "alert", label: o.commands.injection, hint: o.hints.injection, tone: "deny" },
    { id: "duplicate", icon: "repeat", label: o.commands.duplicate, hint: o.hints.duplicate },
    { id: "approval", icon: "shield", label: o.commands.approval, hint: o.hints.approval, tone: "human" },
    { id: "togglePause", icon: stats.mandatePaused ? "play" : "pause", label: stats.mandatePaused ? o.commands.resume : o.commands.pause, hint: o.hints.pause, pressed: stats.mandatePaused },
  ];

  return (
    <section id="simulation" data-section-label={t.nav.demo} className={`office-hero${stats.frozen ? " is-frozen" : ""}${feedOpen ? " feed-open" : ""}`} aria-label={o.mode}>
      <div className="office-stage" ref={stageRef}>
        <canvas ref={staticRef} className="office-canvas" aria-hidden="true" />
        <canvas
          ref={dynRef}
          className="office-canvas office-dynamic"
          aria-hidden="true"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={() => { hoverRef.current = null; }}
        />
        <p className="sr-only">{o.description}</p>
      </div>
      <div className="office-glow" aria-hidden="true" />

      <div className="office-hud">
        <dl className="hud-stats">
          <div className="hud-stat hud-root">
            <dt>{o.stats.root}</dt>
            <dd>
              <span className="num">{formatCents(stats.rootLeftCents, locale)}</span>
              <small> / {formatCents(stats.rootCapCents, locale)} USDC</small>
              <span className="hud-bar" aria-hidden="true"><i style={{ width: `${Math.max(0, 100 - rootUsed * 100)}%` }} /></span>
            </dd>
          </div>
          <div className="hud-stat"><dt>{o.stats.volume}</dt><dd className="tone-allow"><span className="num">+{formatCents(stats.volumeCents, locale)}</span> <small>USDC</small></dd></div>
          <div className="hud-stat"><dt>{o.stats.decisions}</dt><dd><span className="num">{stats.decisions}</span></dd></div>
          <div className="hud-stat"><dt>{o.stats.allow}</dt><dd className="tone-allow"><span className="num">{allowPct}%</span></dd></div>
          <div className="hud-stat"><dt>{o.stats.deny}</dt><dd className="tone-deny"><span className="num">{stats.deny}</span></dd></div>
          <div className="hud-stat hud-optional"><dt>{o.stats.approvals}</dt><dd className="tone-human"><span className="num">{stats.approvals}</span></dd></div>
        </dl>
        <ul className="hud-pills" role="list">
          <li className="pill pill-mode">{o.mode}</li>
          <li className="pill"><span className="dot dot-rail" aria-hidden="true" />{o.network}</li>
          <li className="pill hud-optional"><span className="dot dot-allow" aria-hidden="true" />{o.relayer}</li>
          <li className="pill hud-optional hud-period"><span className="pill-label">{o.stats.period}</span> <span className="num">{fmtClock(stats.periodLeft)}</span></li>
        </ul>
      </div>

      {(stats.frozen || stats.mandatePaused) && (
        <p className={`office-banner ${stats.frozen ? "tone-deny" : "tone-human"}`} role="status">
          {stats.frozen ? o.killBanner : o.pausedBanner}
        </p>
      )}

      {selected && (
        <aside className="office-agent" aria-label={o.agent.title}>
          <div className="office-agent-head">
            <span className={`agent-dot role-${selected.role}`} aria-hidden="true" />
            <div>
              <p className="office-agent-role">{o.roles[selected.role]}</p>
              <h2 className="office-agent-name">{selected.name}</h2>
            </div>
            <button type="button" className="icon-btn" onClick={() => { selectedRef.current = null; setSelected(null); }} aria-label={o.agent.close}>
              <Icon name="x" />
            </button>
          </div>
          <dl className="office-agent-data">
            <div><dt>{o.agent.task}</dt><dd>{o.tasks[selected.task]}</dd></div>
            <div><dt>{o.agent.room}</dt><dd>{selected.room ? o.rooms[selected.room].name : o.agent.corridor}</dd></div>
            {selected.role === "buyer" && <>
              <div><dt>{o.agent.ok}</dt><dd className="tone-allow num">{selected.ok}</dd></div>
              <div><dt>{o.agent.denied}</dt><dd className="tone-deny num">{selected.denied}</dd></div>
            </>}
          </dl>
        </aside>
      )}

      <aside className={`office-feed${feedOpen ? " is-open" : ""}`} aria-label={o.feed.title}>
        <div className="feed-head">
          <h2><span className="live-dot" aria-hidden="true" />{o.feed.title} <small>{o.feed.live}</small></h2>
          <button type="button" className="icon-btn" aria-expanded={feedOpen} aria-controls="office-feed-body" onClick={toggleFeed} aria-label={feedOpen ? o.feed.close : o.feed.open}>
            <Icon name="panel" />
          </button>
        </div>
        <div id="office-feed-body" className="feed-body" hidden={!feedOpen}>
          <div className="feed-filters" role="group" aria-label={o.feed.title}>
            {(Object.keys(FILTERS) as Filter[]).map((f) => (
              <button key={f} type="button" aria-pressed={filter === f} className={filter === f ? "is-active" : undefined} onClick={() => setFilter(f)}>
                {o.feed.filters[f]}
              </button>
            ))}
          </div>
          <ol className="feed-list" role="log" aria-live="off">
            {visibleFeed.length === 0 && <li className="feed-empty">{o.feed.empty}</li>}
            {visibleFeed.map((e) => (
              <li key={e.renderKey} className={`feed-item kind-${e.kind}`}>
                <span className="feed-tag">{o.tags[e.kind]}</span>
                <span className="feed-text">{e.text}</span>
                <time className="feed-time">{fmtClock(e.t)}</time>
              </li>
            ))}
          </ol>
        </div>
      </aside>

      <div className="office-commands" role="toolbar" aria-label={o.commands.label}>
        <div className="cmd-group">
          {cmds.map((c) => (
            <button key={c.id} type="button" className={`cmd${c.tone ? ` tone-${c.tone}` : ""}`} title={c.hint} aria-pressed={c.pressed} disabled={stats.frozen && c.id !== "togglePause"} onClick={() => command(c.id)}>
              <Icon name={c.icon} />
              <span>{c.label}</span>
            </button>
          ))}
          <button type="button" className={`cmd cmd-kill${stats.frozen ? " is-on" : ""}`} title={o.hints.kill} aria-pressed={stats.frozen} onClick={() => command("toggleKill")}>
            <Icon name="power" />
            <span>{stats.frozen ? o.commands.revive : o.commands.kill}</span>
          </button>
        </div>
        <div className="cmd-group cmd-view">
          <button type="button" className="cmd cmd-icon" onClick={() => zoomBy(1 / 1.2)} aria-label={o.commands.zoomOut} title={o.commands.zoomOut}><Icon name="minus" /></button>
          <button type="button" className="cmd cmd-icon" onClick={() => zoomBy(1.2)} aria-label={o.commands.zoomIn} title={o.commands.zoomIn}><Icon name="plus" /></button>
          <button type="button" className="cmd cmd-icon" onClick={resetView} aria-label={o.commands.reset} title={o.commands.reset}><Icon name="expand" /></button>
          <button type="button" className="cmd cmd-icon" onClick={() => setUserRunning(!running)} aria-label={running ? o.commands.stop : o.commands.play} title={running ? o.commands.stop : o.commands.play} aria-pressed={!running}>
            <Icon name={running ? "pause" : "play"} />
          </button>
          <button type="button" className="cmd cmd-icon cmd-feed" onClick={toggleFeed} aria-label={feedOpen ? o.feed.close : o.feed.open} aria-pressed={feedOpen}><Icon name="panel" /></button>
        </div>
      </div>

      {!running && reduced && userRunning === null && <p className="office-reduced">{o.reducedMotion}</p>}

      <a className="office-scroll" href="#problem">
        {o.scroll}
        <Icon name="chevron" />
      </a>
    </section>
  );
}
