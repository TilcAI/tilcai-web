"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { destinationNetwork, originNetworks } from "@/lib/content/rails";
import { acquireSmoothScroll } from "@/lib/smooth-scroll";
import s from "./RouteAtlas.module.css";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const tagFor = { verified: "tag-available", lab: "tag-integration" } as const;
const LAB = originNetworks.map((network, index) => ({ network, index })).filter((item) => item.network.status === "lab");

type Pt = { x: number; y: number };
const f = (n: number) => n.toFixed(1);

/** Centre of an element, in the coordinates of the grid that holds the drawing. */
const centre = (el: Element, box: DOMRect): Pt => {
  const r = el.getBoundingClientRect();
  return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
};

/** Share of a path (0..1) that lies closest to a point: used to time the stops against the line that passes through them. */
function fractionNear(path: SVGGeometryElement, point: Pt): number {
  const length = path.getTotalLength();
  let best = 0, bestDistance = Infinity;
  for (let i = 0; i <= 300; i += 1) {
    const p = path.getPointAtLength((length * i) / 300);
    const distance = (p.x - point.x) ** 2 + (p.y - point.y) ** 2;
    if (distance < bestDistance) { bestDistance = distance; best = i / 300; }
  }
  return best;
}

export function RouteAtlas({ t }: { t: Copy }) {
  const c = narrative(t.locale).rails;
  const direct = c.routes.find((route) => route.id === "direct")!;
  const cctp = c.routes.find((route) => route.id === "cctp")!;
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => acquireSmoothScroll(), []);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const one = <T extends Element = SVGElement>(selector: string) => el.querySelector<T>(selector)!;
    const all = <T extends Element = SVGElement>(selector: string) => Array.from(el.querySelectorAll<T>(selector));
    const grid = one<HTMLElement>("[data-grid]");
    const svg = one<SVGSVGElement>("[data-wires]");
    const wideQuery = window.matchMedia("(min-width: 1100px)");
    const point = (key: string) => one<HTMLElement>(`[data-pt="${key}"]`);
    const dot = (key: string) => one<SVGCircleElement>(`[data-dot="${key}"]`);
    const dotKeys = all<SVGCircleElement>("[data-dot]").map((node) => node.dataset.dot!);
    const maskOf = (name: string) => one<SVGPathElement>(`[data-mask="${name}"]`);
    const pathOf = (name: string) => one<SVGPathElement>(`[data-line="${name}"]`);
    const vLine = pathOf("verified"), vGlow = one<SVGPathElement>('[data-glow="verified"]');
    const dashed = ["direct", "spine", ...LAB.map(({ index }) => `stub-${index}`)];

    let cleanup: (() => void) | undefined;
    let measured = { w: 0, h: 0 };
    let rebuildTimer = 0;

    // ── Geometry: every endpoint is read from the DOM; the paths are rewritten whenever the layout changes ───────────
    const place = (): { wide: boolean; fractions: number[]; dFraction: number } => {
      const box = grid.getBoundingClientRect();
      const wide = wideQuery.matches;
      el.dataset.layout = wide ? "wide" : "stack";
      svg.setAttribute("viewBox", `0 0 ${f(box.width)} ${f(box.height)}`);
      const P = (key: string) => centre(point(key), box);
      const dest = el.querySelector<HTMLElement>("[data-dest]")!.getBoundingClientRect();
      const o0 = P("o0"), d0 = P("d0"), d1 = P("d1");
      const s = [P("s0"), P("s1"), P("s2")];
      let dv: Pt, dd: Pt;
      const set = (name: string, d: string) => {
        pathOf(name).setAttribute("d", d);
        el.querySelector(`[data-mask="${name}"]`)?.setAttribute("d", d);
      };
      for (const name of dashed) set(name, "M0 0");
      set("verified", "M0 0");
      if (wide) {
        const j = P("j"), x2 = dest.left - box.left;
        dv = { x: x2, y: o0.y }; dd = { x: x2, y: d0.y };
        set("verified", `M ${f(o0.x)} ${f(o0.y)} L ${f(dv.x)} ${f(dv.y)}`);
        set("direct", `M ${f(d0.x)} ${f(d0.y)} L ${f(dd.x)} ${f(dd.y)}`);
        const bus = o0.x + (j.x - o0.x) * 0.42;
        let lowest = o0.y;
        for (const { index } of LAB) {
          const o = P(`o${index}`);
          lowest = Math.max(lowest, o.y);
          set(`stub-${index}`, `M ${f(o.x)} ${f(o.y)} L ${f(bus)} ${f(o.y)}`);
        }
        set("spine", `M ${f(bus)} ${f(lowest)} L ${f(bus)} ${f(o0.y + 9)} Q ${f(bus)} ${f(o0.y)} ${f(bus + 9)} ${f(o0.y)} L ${f(j.x)} ${f(o0.y)}`);
        el.querySelector<HTMLElement>("[data-dest]")!.style.setProperty("--vy", `${f(o0.y - dest.top + box.top)}px`);
        const g = one<SVGLinearGradientElement>("#ra-v");
        g.setAttribute("x1", f(o0.x)); g.setAttribute("x2", f(dv.x)); g.setAttribute("y1", f(o0.y)); g.setAttribute("y2", f(o0.y));
        dot("j").setAttribute("cx", f(j.x)); dot("j").setAttribute("cy", f(j.y));
      } else {
        dv = P("dm"); dd = P("dc");
        const labTop = LAB.map(({ index }) => P(`o${index}`)).sort((a, b) => a.y - b.y)[0];
        set("verified", `M ${f(o0.x)} ${f(o0.y)} L ${f(dv.x)} ${f(dv.y)}`);
        set("spine", `M ${f(labTop.x)} ${f(labTop.y)} L ${f(o0.x)} ${f(o0.y)}`);
        set("direct", `M ${f(d0.x)} ${f(d0.y)} L ${f(dd.x)} ${f(dd.y)}`);
        const g = one<SVGLinearGradientElement>("#ra-v");
        g.setAttribute("x1", f(o0.x)); g.setAttribute("x2", f(o0.x)); g.setAttribute("y1", f(o0.y)); g.setAttribute("y2", f(dv.y));
      }
      vGlow.setAttribute("d", vLine.getAttribute("d")!);
      for (const key of dotKeys) {
        const node = dot(key);
        node.style.display = !wide && key === "j" ? "none" : "";
        const p = key === "dv" ? dv : key === "dd" ? dd : P(key);
        node.setAttribute("cx", f(p.x)); node.setAttribute("cy", f(p.y));
      }
      for (const arrow of all<SVGPathElement>("[data-arrow]")) {
        const end = arrow.dataset.arrow === "v" ? dv : dd;
        arrow.setAttribute("d", wide ? `M ${f(end.x - 20)} ${f(end.y - 5)} L ${f(end.x - 13)} ${f(end.y)} L ${f(end.x - 20)} ${f(end.y + 5)}` : `M ${f(end.x - 5)} ${f(end.y - 18)} L ${f(end.x)} ${f(end.y - 11)} L ${f(end.x + 5)} ${f(end.y - 18)}`);
      }
      const mw = box.width + 40, mh = box.height + 40;
      for (const mask of all<SVGMaskElement>("[data-mask-box]")) {
        mask.setAttribute("x", "-20"); mask.setAttribute("y", "-20"); mask.setAttribute("width", f(mw)); mask.setAttribute("height", f(mh));
      }
      for (const name of dashed) {
        const live = wide || !name.startsWith("stub");
        const display = live ? "" : "none";
        (pathOf(name) as SVGElement).style.display = display;
        (maskOf(name) as SVGElement).style.display = display;
      }
      measured = { w: Math.round(box.width), h: Math.round(box.height) };
      return { wide, fractions: s.map((p) => fractionNear(vLine, p)), dFraction: fractionNear(pathOf("direct"), d1) };
    };

    // ── Without motion the whole map is simply there ─────────────────────────────────────────────────────────────
    const showAll = () => {
      for (const path of [vLine, vGlow, ...dashed.map(maskOf)]) path.style.strokeDasharray = "none";
      el.dataset.state = "done";
    };

    // ── With motion: one scrubbed timeline, a packet on the verified line, and nothing that moves off screen ───────
    const animate = (info: ReturnType<typeof place>) => {
      const ctx = gsap.context(() => {
        const heads = all<HTMLElement>("[data-head]");
        const rows = all<HTMLElement>("[data-network]");
        const stations = all<HTMLElement>("[data-station]");
        const laneTag = one<HTMLElement>("[data-lanetag]");
        const destBox = one<HTMLElement>("[data-dest]");
        const lengthOf = (path: SVGGeometryElement) => path.getTotalLength();
        const prep = (path: SVGGeometryElement) => { const len = lengthOf(path); gsap.set(path, { strokeDasharray: len, strokeDashoffset: len }); return len; };
        prep(vLine); prep(vGlow);
        const masks = dashed.map((name) => ({ name, node: maskOf(name) })).filter(({ node }) => node.style.display !== "none");
        masks.forEach(({ node }) => prep(node));
        const radius = (node: Element) => Number((node as SVGCircleElement).dataset.r);
        const hidden = (nodes: Element[]) => nodes.forEach((n) => gsap.set(n, { attr: { r: radius(n) * 0.3 }, opacity: 0 }));

        gsap.set(heads, { opacity: 0, y: 16 });
        gsap.set(rows, { opacity: 0, x: -14 });
        gsap.set(stations, { opacity: 0, y: 10 });
        gsap.set(laneTag, { opacity: 0 });
        gsap.set(destBox, { opacity: 0, y: 14 });
        gsap.set(all("[data-arrow]"), { opacity: 0 });
        const allDots = all<SVGCircleElement>("[data-dot]").filter((node) => node.style.display !== "none");
        hidden(allDots);
        gsap.set(one("[data-packet]"), { opacity: 0 });

        const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
        const draw = (node: SVGGeometryElement, at: number, duration: number, ease = "none") => tl.to(node, { strokeDashoffset: 0, duration, ease }, at);
        const pop = (nodes: Element | Element[], at: number, stagger = 0, duration = 0.1) => (Array.isArray(nodes) ? nodes : [nodes]).forEach((node, i) => tl.to(node, { opacity: 1, attr: { r: radius(node) }, duration, ease: "power3.out" }, at + i * stagger));
        const along = (k: number, from: number, span: number) => from + span * k; // the moment a line that starts drawing at `from` reaches fraction k

        // Band 1: the direct route (a lab line: dashed, amber, it never carries a packet)
        tl.to(heads[0], { opacity: 1, y: 0, duration: 0.14 }, 0);
        pop(dot("d0"), 0.04);
        draw(maskOf("direct"), 0.06, 0.34);
        pop(dot("d1"), along(info.dFraction, 0.06, 0.34) - 0.03, 0, 0.08);
        tl.to(laneTag, { opacity: 1, duration: 0.1 }, along(info.dFraction, 0.06, 0.34) - 0.03);
        pop(dot("dd"), 0.36, 0, 0.08); tl.to(one('[data-arrow="d"]'), { opacity: 1, duration: 0.08 }, 0.36);

        // Band 2: the networks arrive, the lab ones feed the line dashed, the verified one is the straight run
        tl.to(heads[1], { opacity: 1, y: 0, duration: 0.14 }, 0.2);
        tl.to(rows, { opacity: 1, x: 0, duration: 0.12, stagger: 0.035 }, 0.24);
        pop(allDots.filter((node) => /^o\d$/.test(node.dataset.dot!)), 0.28, 0.03);
        masks.filter(({ name }) => name.startsWith("stub")).forEach(({ node }, i) => draw(node, 0.36 + i * 0.02, 0.1, "power1.out"));
        const bus = masks.find(({ name }) => name === "spine");
        if (bus) draw(bus.node, info.wide ? 0.46 : 0.36, info.wide ? 0.12 : 0.3, "power1.inOut");
        if (info.wide) pop(dot("j"), 0.42, 0, 0.08);
        draw(vGlow, 0.42, 0.42); draw(vLine, 0.42, 0.42);
        info.fractions.forEach((fraction, k) => {
          const moment = along(fraction, 0.42, 0.42) - 0.03;
          tl.to(stations[k], { opacity: 1, y: 0, duration: 0.1 }, moment);
          pop(dot(`s${k}`), moment, 0, 0.08);
        });
        tl.to(destBox, { opacity: 1, y: 0, duration: 0.14 }, 0.74);
        pop(dot("dv"), 0.84); tl.to(one('[data-arrow="v"]'), { opacity: 1, duration: 0.1 }, 0.84);

        // Packet: after the line is drawn, a small light travels it, lights each stop as it passes and warms the destination
        const packet = one<SVGGElement>("[data-packet]");
        const run = { t: 0 };
        const length = lengthOf(vLine);
        const stopAt = info.fractions;
        let last = 0;
        const pulse = (node: Element, amount = 1.7) => gsap.fromTo(node, { attr: { r: radius(node) } }, { attr: { r: radius(node) * amount }, duration: 0.22, ease: "power2.out", yoyo: true, repeat: 1, overwrite: "auto" });
        const loop = gsap.to(run, {
          t: 1, duration: info.wide ? 6.5 : 5, ease: "none", repeat: -1, paused: true,
          onUpdate: () => {
            const p = vLine.getPointAtLength(length * run.t);
            packet.setAttribute("transform", `translate(${f(p.x)} ${f(p.y)})`);
            const fade = Math.min(1, run.t * 14, (1 - run.t) * 14);
            packet.style.opacity = String(fade);
            stopAt.forEach((fraction, k) => { if (last < fraction && run.t >= fraction) pulse(dot(`s${k}`)); });
            if (run.t < last) pulse(dot("dv"), 1.7);
            last = run.t;
          },
        });
        let inView = false, drawn = false;
        const sync = () => { if (inView && drawn) loop.play(); else { loop.pause(); } };
        const trigger = ScrollTrigger.create({
          animation: tl, trigger: grid,
          start: "top 85%", end: info.wide ? "bottom 80%" : "bottom 72%", scrub: 0.6,
          onUpdate: (self) => { const now = self.progress > 0.985; if (now !== drawn) { drawn = now; sync(); } },
        });
        const watcher = ScrollTrigger.create({ trigger: grid, start: "top bottom", end: "bottom top", onToggle: (self) => { inView = self.isActive; sync(); } });
        return () => { trigger.kill(); watcher.kill(); loop.kill(); tl.kill(); };
      }, el);
      return () => ctx.revert();
    };

    const setup = () => {
      cleanup?.();
      const info = place();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { showAll(); cleanup = undefined; }
      else { el.dataset.state = "ready"; cleanup = animate(info); }
    };
    setup();

    // The layout can change under the drawing (resize, orientation, web fonts): measure again and rebuild, never stack.
    const observer = new ResizeObserver(() => {
      const box = grid.getBoundingClientRect();
      if (Math.abs(Math.round(box.width) - measured.w) < 2 && Math.abs(Math.round(box.height) - measured.h) < 2) return;
      window.clearTimeout(rebuildTimer);
      rebuildTimer = window.setTimeout(setup, 120);
    });
    observer.observe(grid);
    document.fonts?.ready.then(() => { window.clearTimeout(rebuildTimer); rebuildTimer = window.setTimeout(setup, 60); });
    return () => { window.clearTimeout(rebuildTimer); observer.disconnect(); cleanup?.(); };
  }, []);

  const head = (route: typeof direct, area: "h1" | "h2") => (
    <header className={s.head} data-area={area} data-head>
      <div>
        <div className={s.headTop}><span className={s.tagMono}>{route.tag}</span><span className={`tag ${tagFor[route.tone]}`}>{route.status}</span></div>
        <h3>{route.title}</h3>
      </div>
      <div><p>{route.body}</p></div>
    </header>
  );

  return (
    <figure ref={root} className={s.atlas} data-state="idle" data-layout="wide" aria-labelledby="atlas-title">
      <div className={s.grid} data-grid>
        <svg className={s.wires} data-wires aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="ra-v" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#7347ff" /><stop offset=".55" stopColor="#925fff" /><stop offset="1" stopColor="#57d2f9" /></linearGradient>
            <radialGradient id="ra-halo"><stop stopColor="#fff" stopOpacity=".95" /><stop offset=".25" stopColor="#a58bff" stopOpacity=".55" /><stop offset="1" stopColor="#7347ff" stopOpacity="0" /></radialGradient>
            {dashedMasks.map((name) => <mask key={name} id={`ra-m-${name}`} maskUnits="userSpaceOnUse" data-mask-box><path data-mask={name} fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="butt" /></mask>)}
          </defs>
          {LAB.map(({ index }) => <path key={index} className={`${s.line} ${s.stub}`} data-line={`stub-${index}`} mask={`url(#ra-m-stub-${index})`} />)}
          <path className={`${s.line} ${s.stub}`} data-line="spine" mask="url(#ra-m-spine)" />
          <path className={`${s.line} ${s.direct}`} data-line="direct" mask="url(#ra-m-direct)" />
          <path className={s.glow} data-glow="verified" />
          <path className={`${s.line} ${s.verified}`} data-line="verified" />
          <path className={s.arrow} data-arrow="v" />
          <path className={s.arrow} data-arrow="d" style={{ stroke: "#e5b66e" }} />
          {dotKeys.map((key) => {
            const kind = key === "o0" || key === "dv" ? "verified" : /^s\d$/.test(key) ? "station" : key === "d0" || key === "d1" || key === "dd" ? "direct" : "lab";
            const r = kind === "station" ? 5.5 : kind === "verified" ? 5 : 3.6;
            return <circle key={key} className={s.dot} data-dot={key} data-kind={kind} data-r={r} r={r} />;
          })}
          <g data-packet style={{ opacity: 0 }}><circle className={s.halo} r="13" /><circle className={s.packet} r="3" /></g>
        </svg>

        {head(direct, "h1")}
        <div className={s.lane}>
          <i className={s.pt} data-pt="d0" /><i className={s.pt} data-pt="d1" />
          <span className={s.laneTag} data-lanetag>{direct.tag}</span>
          <div className={s.chip}><i className={s.pt} data-pt="dc" /><strong>{destinationNetwork.name}</strong><span>{c.destinationNote}</span></div>
        </div>

        {head(cctp, "h2")}
        <div className={s.origins}>
          <p className={s.colLabel}>{c.origin}</p>
          <ul role="list">
            {originNetworks.map((network, i) => (
              <li key={network.id} className={s.network} data-network data-status={network.status}>
                <span>{network.name}</span>
                {network.status === "verified"
                  ? <span className={`tag ${tagFor.verified}`}>{c.statuses.verified}</span>
                  : <span className={s.labWord}>{c.statuses.lab}</span>}
                <i className={s.pt} data-pt={`o${i}`} />
              </li>
            ))}
          </ul>
        </div>
        <div className={s.stations}>
          <i className={s.pt} data-pt="j" />
          <p className={s.colLabel}>{c.pipeline}</p>
          <ol className={s.stops}>
            {c.pipelineSteps.map((step, i) => (
              <li key={step.plain} className={s.stop} data-station>
                <i className={s.pt} data-pt={`s${i}`} />
                <b aria-hidden="true">0{i + 1}</b>
                <span>{step.plain}<small className={s.term}>{step.term}</small></span>
              </li>
            ))}
          </ol>
          <p className={s.gasless}>{c.gasless}</p>
        </div>

        <div className={s.dest} data-dest>
          <i className={s.pt} data-pt="dm" />
          <p className={s.colLabel}>{c.destination}</p>
          <strong>{destinationNetwork.name}</strong>
          <span>{c.destinationNote}</span>
        </div>
      </div>

      <figcaption className={s.foot}>
        <div><h3 id="atlas-title">{c.mapTitle}</h3><p>{c.mapLead}</p></div>
        <ul className={s.legend} role="list">
          <li><span className="tag tag-available">{c.legend.verified}</span></li>
          <li><span className="tag tag-integration">{c.legend.lab}</span></li>
          <li><span className="tag tag-next">{c.legend.vision}</span></li>
        </ul>
      </figcaption>
    </figure>
  );
}

const dashedMasks = ["direct", "spine", ...LAB.map(({ index }) => `stub-${index}`)];
const dotKeys = ["d0", "d1", "dd", "dv", "j", ...originNetworks.map((_, i) => `o${i}`), "s0", "s1", "s2"];
