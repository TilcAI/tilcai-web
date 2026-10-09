"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { acquireSmoothScroll } from "@/lib/smooth-scroll";
import { Icon, type IconName } from "../Icon";
import styles from "./ConnectionPaths.module.css";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Transparent illustrations for this section. The folder name has a space, hence the %20. */
const DIR = "/assets/img/caminos%20conect/";
export const connectionAssets = {
  node: { file: "cam-img1.png", width: 1254, height: 1254 },
  art: [
    { file: "cam-img2.png", width: 1448, height: 1086 }, // A · console
    { file: "cam-img3.png", width: 1448, height: 1086 }, // B · spreadsheet
    { file: "cam-img4.png", width: 1448, height: 1086 }, // C · API
    { file: "cam-img5.png", width: 1448, height: 1086 }, // D · agent
  ],
  hudConnected: { file: "cam-img6.png", width: 2172, height: 724 },
  hudCluster: { file: "cam-img7.png", width: 1448, height: 1086 },
  dust: { file: "cam-img8.png", width: 1672, height: 941 },
} as const;
const src = (file: string) => DIR + file;

const ROUTES = [0, 1, 2, 3] as const;
/** Seconds one data packet takes from a card to the node. Different on purpose: real traffic is never in step. */
const FLOW_SECONDS = [4.4, 3.8, 4.1, 4.8];
const FLOW_DELAY = [.15, 1.05, .55, 1.6];
const CHEVRON_AT = [.1, .27, .44];
/** How each route leaves its card (q1/h1) and reaches the node (q2/h2): asymmetric on purpose. */
const SHAPES = [
  { q1: .02, h1: .7, q2: .38, h2: .62 },
  { q1: .02, h1: .5, q2: .26, h2: .45 },
  { q1: 0, h1: .55, q2: 0, h2: .55 },
  { q1: .02, h1: .62, q2: .3, h2: .5 },
];
const HUD_ICONS: Record<"connected" | "identity" | "data", IconName> = { connected: "signal", identity: "shield", data: "layers" };

type Point = { x: number; y: number };
const pt = (a: Point) => `${a.x.toFixed(1)} ${a.y.toFixed(1)}`;

type Layout = "wide" | "two-columns" | "one-column";

/**
 * One route as a cubic Bézier, always drawn card → node so the packets and the drawing travel towards TilcAI.
 * With two columns the cards of the second row cannot go straight up (the first row is in the way): they
 * leave their card, run along the gap between the rows and climb the gutter between the columns.
 */
function routeD(index: number, a: Point, b: Point, layout: Layout, gutterX: number) {
  const dy = Math.max(40, a.y - b.y);
  const dx = b.x - a.x;
  if (layout === "two-columns" && index >= 2) {
    const gx = gutterX + (index === 2 ? -4 : 4);
    const gy = a.y - 16, r = 10;
    const s = Math.sign(gx - a.x) || 1;
    const k = Math.max(20, (gy - r - b.y) * .5);
    return `M ${pt(a)} L ${pt({ x: a.x, y: gy + r })} Q ${pt({ x: a.x, y: gy })}, ${pt({ x: a.x + s * r, y: gy })} L ${pt({ x: gx - s * r, y: gy })} Q ${pt({ x: gx, y: gy })}, ${pt({ x: gx, y: gy - r })} C ${pt({ x: gx, y: gy - r - k })}, ${pt({ x: b.x, y: b.y + k })}, ${pt(b)}`;
  }
  if (layout !== "wide" || Math.abs(dx) < 50) {
    return `M ${pt(a)} C ${pt({ x: a.x, y: a.y - dy * .55 })}, ${pt({ x: b.x, y: b.y + dy * .55 })}, ${pt(b)}`;
  }
  const dir = Math.sign(dx);
  const s = SHAPES[index];
  const span = Math.abs(dx);
  return `M ${pt(a)} C ${pt({ x: a.x + dir * span * s.q1, y: a.y - dy * s.h1 })}, ${pt({ x: b.x - dir * span * s.q2, y: b.y + dy * s.h2 })}, ${pt(b)}`;
}

type Route = {
  index: number;
  glow: SVGPathElement; line: SVGPathElement; grad: SVGLinearGradientElement;
  chevrons: SVGPathElement[]; chevronGroup: SVGGElement; particle: SVGGElement; fade: SVGGElement;
  len: number; draw: { p: number }; flow: { t: number }; flowTween?: gsap.core.Tween;
};

export function ConnectionPaths({ t }: { t: Copy }) {
  const c = narrative(t.locale).business.paths;
  const es = t.locale === "es";
  const root = useRef<HTMLElement>(null);
  const words = c.title.split(" ");
  const last = words.pop() ?? "";

  useEffect(() => acquireSmoothScroll(), []);

  useIsoLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const $ = <T extends Element>(selector: string) => section.querySelector<T>(selector)!;
      const $$ = <T extends Element>(selector: string) => Array.from(section.querySelectorAll<T>(selector));
      const scene = $<HTMLElement>("[data-scene]");
      const svg = $<SVGSVGElement>("[data-network]");
      const blur = $<SVGFilterElement>("#tcp-blur");
      const slotPorts = $$<HTMLElement>("[data-port]");
      const nodePorts = $$<HTMLElement>("[data-node-port]");
      const orbitDots = $$<SVGCircleElement>("[data-orbit-dot]");
      const back = $<SVGGElement>("[data-back]");
      const backFade = $<SVGGElement>("[data-back-fade]");
      const nodeIntro = $<HTMLElement>("[data-node-intro]");
      const nodeFloat = $<HTMLElement>("[data-node-float]");
      const nodeFlash = $<HTMLElement>("[data-node-flash]");

      const routes: Route[] = ROUTES.map((index) => {
        const g = $<SVGGElement>(`[data-route="${index}"]`);
        return {
          index,
          glow: g.querySelector<SVGPathElement>("[data-glow]")!,
          line: g.querySelector<SVGPathElement>("[data-line]")!,
          grad: $<SVGLinearGradientElement>(`#tcp-grad-${index}`),
          chevrons: Array.from(g.querySelectorAll<SVGPathElement>("[data-chevron]")),
          chevronGroup: g.querySelector<SVGGElement>("[data-chevrons]")!,
          particle: g.querySelector<SVGGElement>("[data-particle]")!,
          fade: g.querySelector<SVGGElement>("[data-fade]")!,
          len: 1, draw: { p: 0 }, flow: { t: 0 },
        };
      });

      // ── Geometry: every endpoint is read from the DOM, so the routes follow any viewport ─────────────────
      const wideQuery = window.matchMedia("(min-width: 1100px)");
      const narrowQuery = window.matchMedia("(max-width: 699px)");
      let orbit = { x: 0, y: 0, rx: 0, ry: 0 };
      const centre = (el: Element, origin: DOMRect): Point => {
        const r = el.getBoundingClientRect();
        return { x: r.left - origin.left + r.width / 2, y: r.top - origin.top + r.height / 2 };
      };
      const paintDraw = (r: Route) => {
        const done = r.draw.p >= 1;
        for (const el of [r.line, r.glow]) {
          el.style.strokeDasharray = done ? "none" : String(r.len);
          el.style.strokeDashoffset = done ? "0" : String(r.len * (1 - r.draw.p));
        }
      };
      const place = (g: Element, r: Route, along: number) => {
        const p = r.line.getPointAtLength(r.len * along);
        g.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
      };
      const build = () => {
        const box = scene.getBoundingClientRect();
        if (box.width < 10) return;
        svg.setAttribute("viewBox", `0 0 ${box.width.toFixed(0)} ${box.height.toFixed(0)}`);
        blur.setAttribute("width", String(box.width)); blur.setAttribute("height", String(box.height));
        const layout: Layout = wideQuery.matches ? "wide" : narrowQuery.matches ? "one-column" : "two-columns";
        const gutterX = (centre(slotPorts[0], box).x + centre(slotPorts[1], box).x) / 2;
        for (const r of routes) {
          const a = centre(slotPorts[r.index], box);
          const b = centre(nodePorts[r.index], box);
          const d = routeD(r.index, a, b, layout, gutterX);
          r.glow.setAttribute("d", d); r.line.setAttribute("d", d);
          r.len = r.line.getTotalLength();
          r.grad.setAttribute("x1", String(a.x)); r.grad.setAttribute("y1", String(a.y));
          r.grad.setAttribute("x2", String(b.x)); r.grad.setAttribute("y2", String(b.y));
          r.chevrons.forEach((chevron, k) => {
            const at = CHEVRON_AT[k];
            const p = r.line.getPointAtLength(r.len * at);
            const q = r.line.getPointAtLength(r.len * Math.min(1, at + .012));
            const angle = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
            chevron.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${angle.toFixed(1)})`);
          });
          paintDraw(r);
          if (r.draw.p >= 1 && r.flowTween?.paused() !== false) place(r.particle, r, r.flow.t);
        }
        const tile = $<HTMLElement>("[data-node-tile]").getBoundingClientRect();
        orbit = { x: tile.left - box.left + tile.width / 2, y: tile.top - box.top + tile.height * .72, rx: tile.width * 1.18, ry: tile.width * .2 };
      };
      let rebuildTimer = 0;
      const rebuildSoon = () => { window.clearTimeout(rebuildTimer); rebuildTimer = window.setTimeout(build, 80); };
      const observer = new ResizeObserver(rebuildSoon);
      observer.observe(scene);
      window.addEventListener("resize", rebuildSoon);
      window.addEventListener("orientationchange", rebuildSoon);
      build();
      document.fonts?.ready.then(build);

      // ── Highlight: one route, or all of them ─────────────────────────────────────────────────────────────
      const highlight = (which: number | "all" | null) => {
        section.dataset.all = String(which === "all");
        for (const r of routes) {
          const on = which === "all" || which === r.index;
          const dim = which !== null && !on;
          gsap.to(r.line, { opacity: dim ? .22 : on ? 1 : .8, strokeWidth: on ? 2.8 : 2, duration: .3, ease: "power2.out", overwrite: "auto" });
          gsap.to(r.glow, { opacity: dim ? .03 : on ? .28 : .14, strokeWidth: on ? 9 : 6, duration: .3, ease: "power2.out", overwrite: "auto" });
          gsap.to(r.chevronGroup, { opacity: dim ? .25 : 1, duration: .3, overwrite: "auto" });
          if (r.flowTween) gsap.to(r.flowTween, { timeScale: which === r.index ? 2.4 : 1, duration: .4, overwrite: "auto" });
          gsap.to(r.particle, { opacity: dim ? .35 : 1, duration: .3, overwrite: "auto" });
        }
      };
      // Hover and keyboard focus behave the same: the route of the card you are on lights up.
      const wire = () => {
        const off: (() => void)[] = [];
        const on = (el: Element, type: string, fn: (e: Event) => void) => { el.addEventListener(type, fn); off.push(() => el.removeEventListener(type, fn)); };
        const mouse = (e: Event) => (e as PointerEvent).pointerType === "mouse";
        $$<HTMLElement>("[data-slot]").forEach((slot, i) => {
          on(slot, "pointerenter", (e) => { if (mouse(e)) highlight(i); });
          on(slot, "pointerleave", (e) => { if (mouse(e)) highlight(null); });
          on(slot, "focusin", () => highlight(i));
          on(slot, "focusout", () => highlight(null));
        });
        const node = $<HTMLElement>("[data-node]");
        on(node, "pointerenter", (e) => { if (mouse(e)) highlight("all"); });
        on(node, "pointerleave", (e) => { if (mouse(e)) highlight(null); });
        return () => off.forEach((fn) => fn());
      };

      // ── Reduced motion: everything drawn, nothing moving ─────────────────────────────────────────────────
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        for (const r of routes) { r.draw.p = 1; paintDraw(r); }
        gsap.set(section.querySelectorAll("[data-chevron]"), { opacity: .55 });
        gsap.set(section.querySelectorAll("[data-port], [data-node-port]"), { opacity: 1 });
        section.dataset.live = "false"; section.dataset.active = "true";
        return wire();
      });


      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !narrowQuery.matches;
        const narrow = narrowQuery.matches;
        const loops: gsap.core.Animation[] = [];
        const heading = $$<HTMLElement>("[data-intro='heading'] > *");
        const cards = $$<HTMLElement>("[data-card-intro]");
        const huds = $$<HTMLElement>("[data-hud-intro]");
        const ports = [...slotPorts, ...nodePorts];
        const chevrons = $$<SVGPathElement>("[data-chevron]");

        // Hidden until the section arrives (set before the first paint, so nothing flashes).
        gsap.set(heading, { opacity: 0, y: 25 });
        gsap.set(cards, { opacity: 0, y: 60, scale: .96 });
        gsap.set(nodeIntro, { opacity: 0, scale: .75 });
        gsap.set(huds, { opacity: 0, y: 14 });
        gsap.set(ports, { opacity: 0, scale: .4 });
        gsap.set(chevrons, { opacity: 0 });
        gsap.set(section.querySelectorAll("[data-glow-top], [data-glow-bottom]"), { opacity: 0 });
        for (const r of routes) { r.draw.p = 0; paintDraw(r); }
        let live = false;

        // Pulse on the node each time a packet arrives. Four packets, never in step.
        let lastPulse = 0;
        const arrive = () => {
          const now = performance.now();
          if (now - lastPulse < 160) return;
          lastPulse = now;
          gsap.fromTo(nodeIntro, { scale: 1 }, { scale: 1.025, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", overwrite: false });
          gsap.fromTo(nodeFlash, { opacity: 0 }, { opacity: .55, duration: .15, yoyo: true, repeat: 1, ease: "power2.out" });
        };
        // The answer, now and then, travels the other way as a small cyan point.
        let replying = false;
        const reply = (r: Route) => {
          if (replying) return;
          replying = true;
          const progress = { t: 1 };
          gsap.to(progress, {
            t: 0, duration: 3, ease: "none",
            onUpdate: () => { place(back, r, progress.t); backFade.setAttribute("opacity", String(Math.min(1, progress.t * 8, (1 - progress.t) * 8))); },
            onComplete: () => { replying = false; backFade.setAttribute("opacity", "0"); },
          });
        };
        let cycles = 0;
        const startFlow = (r: Route) => {
          if (narrow && r.index % 2 === 1) return; // fewer packets on a phone
          r.flow.t = 0;
          r.flowTween = gsap.to(r.flow, {
            t: 1, duration: FLOW_SECONDS[r.index], ease: "none", repeat: -1, delay: FLOW_DELAY[r.index],
            onUpdate: () => {
              place(r.particle, r, r.flow.t);
              r.fade.setAttribute("opacity", String(Math.min(1, r.flow.t * 10, (1 - r.flow.t) * 10)));
            },
            onRepeat: () => { arrive(); cycles += 1; if (cycles > 3 && Math.random() < .3) reply(r); },
          });
          loops.push(r.flowTween);
          if (!live) r.flowTween.pause();
        };
        // Chevrons march towards the node, one after the other.
        const march = (r: Route) => {
          const tl = gsap.timeline({ repeat: -1, repeatDelay: .7, delay: r.index * .25 });
          r.chevrons.forEach((chevron, k) => tl.fromTo(chevron, { opacity: .12 }, { opacity: .95, duration: .45, yoyo: true, repeat: 1, ease: "sine.inOut" }, k * .34));
          loops.push(tl);
          if (!live) tl.pause();
        };
        const activateNode = () => {
          section.dataset.active = "true";
          gsap.to(section.querySelectorAll("[data-glow-top], [data-glow-bottom]"), { opacity: 1, duration: 1.2, ease: "power2.out", stagger: .2 });
          if (!narrow) gsap.to(orbitDots, { opacity: 1, duration: .8 });
        };

        // ── Entrance: heading, cards, node, then the routes are drawn card → node ─────────────────────────
        const intro = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        intro
          .to(heading, { opacity: 1, y: 0, duration: .8, stagger: .09 }, 0)
          .to(cards, { opacity: 1, y: 0, scale: 1, duration: .9, stagger: .08 }, .3)
          .to(nodeIntro, { opacity: 1, scale: 1, duration: 1 }, .7)
          .to(ports, { opacity: 1, scale: 1, duration: .4, stagger: .04 }, 1.1)
          .to(huds, { opacity: 1, y: 0, duration: .9, stagger: .14 }, 1.3);
        routes.forEach((r) => {
          const at = 1.2 + r.index * .12;
          intro.to(r.draw, { p: 1, duration: 1.8, ease: "power2.inOut", onUpdate: () => paintDraw(r) }, at);
          intro.add(() => { march(r); startFlow(r); }, at + 1.8);
        });
        intro.add(activateNode, 1.2 + 3 * .12 + 1.8);

        // ── Idle: the node hangs in the air, its rings ping, the dust drifts ──────────────────────────────
        loops.push(
          gsap.to(nodeFloat, { y: 4, duration: 4, ease: "sine.inOut", repeat: -1, yoyo: true, startAt: { y: -4 } }),
          gsap.to(nodeFloat, { scale: 1.015, duration: 4, ease: "sine.inOut", repeat: -1, yoyo: true, startAt: { scale: .99 } }),
          gsap.to("[data-dust]", { x: 15, y: -10, duration: 20, ease: "sine.inOut", repeat: -1, yoyo: true, startAt: { x: -15, y: 10 } }),
        );
        // Three small points circle the node (front half only: the back half is in the illustration).
        let angle = 0;
        const spin = (_time: number, dt: number) => {
          angle += dt * .00085;
          orbitDots.forEach((dot, k) => {
            const a = angle + k * 2.0944;
            dot.setAttribute("cx", (orbit.x + Math.cos(a) * orbit.rx).toFixed(1));
            dot.setAttribute("cy", (orbit.y + Math.sin(a) * orbit.ry).toFixed(1));
            dot.style.opacity = String(Math.max(0, Math.sin(a)) * (section.dataset.active === "true" ? 1 : 0));
          });
        };

        // ── Parallax: tiny, by depth. Scroll moves layers vertically; the pointer moves them sideways ────────
        const layers = $$<HTMLElement>("[data-par]").map((el) => ({
          scroll: Number(el.dataset.par) || 0, mouse: fine ? Number(el.dataset.mouse) || 0 : 0,
          setX: gsap.quickSetter(el, "x", "px") as (v: number) => void, setY: gsap.quickSetter(el, "y", "px") as (v: number) => void,
        }));
        const target = { p: 0, x: 0, y: 0 }, now = { p: 0, x: 0, y: 0 };
        const glide = () => {
          now.p += (target.p - now.p) * .12; now.x += (target.x - now.x) * .08; now.y += (target.y - now.y) * .08;
          for (const l of layers) { l.setX(now.x * l.mouse); l.setY(now.p * l.scroll + now.y * l.mouse); }
        };
        const onMove = (e: PointerEvent) => {
          const r = scene.getBoundingClientRect();
          target.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
          target.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
        };
        const onLeave = () => { target.x = 0; target.y = 0; };
        if (fine) { scene.addEventListener("pointermove", onMove); scene.addEventListener("pointerleave", onLeave); }

        const setLive = (value: boolean) => {
          if (value === live) return;
          live = value;
          section.dataset.live = String(value);
          loops.forEach((a) => (value ? a.resume() : a.pause()));
          if (value) { gsap.ticker.add(glide); gsap.ticker.add(spin); } else { gsap.ticker.remove(glide); gsap.ticker.remove(spin); }
        };
        loops.forEach((a) => a.pause());
        ScrollTrigger.create({ trigger: scene, start: "top 72%", once: true, onEnter: () => intro.play() });
        ScrollTrigger.create({
          trigger: scene, start: "top bottom", end: "bottom top",
          onUpdate: (self) => { target.p = self.progress * 2 - 1; },
          onToggle: (self) => setLive(self.isActive),
        });
        const unwire = wire();

        return () => {
          setLive(false); unwire();
          scene.removeEventListener("pointermove", onMove); scene.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => {
        window.clearTimeout(rebuildTimer);
        observer.disconnect();
        window.removeEventListener("resize", rebuildSoon);
        window.removeEventListener("orientationchange", rebuildSoon);
        mm.revert();
      };
    }, section);
    return () => ctx.revert();
  }, []);

  const hud = (kind: "connected" | "identity" | "data") => (
    <span className={styles.hudChip} data-kind={kind}><Icon name={HUD_ICONS[kind]} /><span>{c.hud[kind]}</span></span>
  );

  return (
    <section ref={root} id="business-paths" className={styles.root} aria-labelledby="paths-title" data-live="false" data-active="false">
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.grid} data-par="3" />
        <div className={styles.dustPar} data-par="18" data-mouse="12">
          <div className={styles.dust} data-dust>
            <Image src={src(connectionAssets.dust.file)} alt="" width={connectionAssets.dust.width} height={connectionAssets.dust.height} sizes="100vw" draggable={false} />
          </div>
        </div>
      </div>

      <div className={styles.scene} data-scene>
        <header className={styles.heading} data-intro="heading">
          <p className={styles.eyebrow}>{c.eyebrow}</p>
          <h3 id="paths-title">{words.join(" ")} <span className={styles.accent}>{last}</span></h3>
          <p className={styles.lead}>{c.lead}</p>
        </header>

        <div className={styles.stage}>
          <div className={`${styles.hud} ${styles.hudLeft}`} data-hud-intro>
            <div data-par="14" data-mouse="9"><div className={styles.hudFloat}>
              {es
                ? <Image src={src(connectionAssets.hudConnected.file)} alt={c.hud.connected} width={connectionAssets.hudConnected.width} height={connectionAssets.hudConnected.height} sizes="(min-width: 1100px) 22vw, 60vw" draggable={false} />
                : hud("connected")}
            </div></div>
          </div>

          <div className={styles.node} data-node role="img" aria-label={c.node}>
            <div className={styles.nodeGlowTop} data-glow-top aria-hidden="true" />
            <div className={styles.nodeGlowBottom} data-glow-bottom aria-hidden="true" />
            <div className={styles.ringBox} aria-hidden="true"><i className={styles.ring} /><i className={`${styles.ring} ${styles.ringLate}`} /></div>
            <div data-node-intro><div data-par="9" data-mouse="7"><div data-node-float>
              <Image src={src(connectionAssets.node.file)} alt="" width={connectionAssets.node.width} height={connectionAssets.node.height} sizes="(min-width: 1100px) 26vw, 70vw" draggable={false} />
              <i className={styles.nodeFlash} data-node-flash />
            </div></div></div>
            <span className={styles.tile} data-node-tile aria-hidden="true" />
            {[0, 1, 2, 3].map((i) => <i key={i} className={styles.nodePort} data-node-port style={{ "--i": i } as CSSProperties} aria-hidden="true" />)}
          </div>

          <div className={`${styles.hud} ${styles.hudRight}`} data-hud-intro>
            <div data-par="16" data-mouse="9"><div className={`${styles.hudFloat} ${styles.hudFloatLate}`}>
              {es
                ? <Image src={src(connectionAssets.hudCluster.file)} alt={`${c.hud.identity}. ${c.hud.data}`} width={connectionAssets.hudCluster.width} height={connectionAssets.hudCluster.height} sizes="(min-width: 1100px) 28vw, 70vw" draggable={false} />
                : <span className={styles.hudStack}>{hud("identity")}{hud("data")}</span>}
            </div></div>
          </div>
        </div>

        <svg className={styles.network} data-network aria-hidden="true" focusable="false">
          <defs>
            {ROUTES.map((i) => (
              <linearGradient key={i} id={`tcp-grad-${i}`} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#773BFF" /><stop offset=".45" stopColor="#8B5CFF" /><stop offset="1" stopColor="#55C7FF" />
              </linearGradient>
            ))}
            <filter id="tcp-blur" filterUnits="userSpaceOnUse" x="0" y="0" width="1" height="1"><feGaussianBlur stdDeviation="3.5" /></filter>
            <radialGradient id="tcp-halo"><stop offset="0" stopColor="#fff" stopOpacity=".95" /><stop offset=".22" stopColor="#a58bff" stopOpacity=".6" /><stop offset="1" stopColor="#7e5cff" stopOpacity="0" /></radialGradient>
            <radialGradient id="tcp-halo-cyan"><stop offset="0" stopColor="#e6fbff" stopOpacity=".95" /><stop offset=".22" stopColor="#55c7ff" stopOpacity=".6" /><stop offset="1" stopColor="#55c7ff" stopOpacity="0" /></radialGradient>
          </defs>
          {ROUTES.map((i) => (
            <g key={i} data-route={i}>
              <path data-glow className={styles.glow} fill="none" stroke={`url(#tcp-grad-${i})`} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" filter="url(#tcp-blur)" />
              <path data-line className={styles.line} fill="none" stroke={`url(#tcp-grad-${i})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <g data-chevrons>{CHEVRON_AT.map((at) => <path key={at} data-chevron className={styles.chevron} d="M -3.4 -3.6 L 1.6 0 L -3.4 3.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />)}</g>
              <g data-particle><g data-fade opacity="0"><circle r="9" fill="url(#tcp-halo)" /><circle r="2.6" fill="#fff" /></g></g>
            </g>
          ))}
          <g data-back><g data-back-fade opacity="0"><circle r="8" fill="url(#tcp-halo-cyan)" /><circle r="2.2" fill="#effcff" /></g></g>
          {[0, 1, 2].map((k) => <circle key={k} data-orbit-dot className={styles.orbitDot} r="2.2" cx="-20" cy="-20" />)}
        </svg>

        <ul className={styles.cards} role="list">
          {c.items.map((item, i) => {
            const art = connectionAssets.art[i];
            return (
              <li key={item.key} className={styles.slot} data-slot data-first={i === 0}>
                <i className={styles.port} data-port aria-hidden="true" />
                <div data-card-intro><div data-par="8"><article className={styles.card} data-first={i === 0}>
                  <span className={styles.key} aria-hidden="true">{item.key}</span>
                  <div className={styles.art} aria-hidden="true"><div data-par="12" data-mouse="5"><Image src={src(art.file)} alt="" width={art.width} height={art.height} sizes="(min-width: 1100px) 24vw, (min-width: 700px) 46vw, 92vw" draggable={false} /></div></div>
                  <h4>{item.title}</h4>
                  <p className={styles.who}>{item.who}</p>
                  <p className={styles.body}>{item.body}</p>
                </article></div></div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
