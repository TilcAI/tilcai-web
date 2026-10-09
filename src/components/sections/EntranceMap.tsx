"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { acquireSmoothScroll } from "@/lib/smooth-scroll";
import { EntranceArt } from "./EntranceArt";
import styles from "./EntranceMap.module.css";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type Entrance = { id: "whatsapp" | "mcp" | "api"; title: string; body: string; status: string; note: string };

/** One colour per way in, and how firm its state is drawn: solid = available, ring = defined, dashed ring = reported. */
const look: Record<Entrance["id"], { rgb: string; state: "available" | "defined" | "reported" }> = {
  whatsapp: { rgb: "114, 221, 185", state: "reported" },
  mcp: { rgb: "169, 138, 233", state: "defined" },
  api: { rgb: "87, 210, 249", state: "available" },
};

/**
 * The three ways in as three branches of one line that ends in the stretch they share. The line is measured from the
 * page (dots and nodes), so it follows whatever the text height is; on narrow screens it simply runs straight down.
 * It is drawn once as the section arrives; without motion it is drawn at once.
 */
export function EntranceMap({ group, items, shared }: {
  group: string;
  items: Entrance[];
  shared: { label: string; steps: string[] };
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => acquireSmoothScroll(), []);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const all = (selector: string) => Array.from(el.querySelectorAll<HTMLElement>(selector));
    const svg = el.querySelector<SVGSVGElement>("[data-wire]")!;
    const base = svg.querySelector<SVGPathElement>("[data-base]")!;
    const line = svg.querySelector<SVGPathElement>("[data-line]")!;
    const head = svg.querySelector<SVGCircleElement>("[data-head]")!;
    const dots = all("[data-dot]");
    const nodes = all("[data-node]");
    const parts = all("[data-part]");
    const labels = all("[data-label]");
    const caption = el.querySelector<HTMLElement>("[data-caption]");

    /** Where each mark sits along the line, as a share of its length (found by sampling, so any path shape works). */
    let marks: { dots: number[]; nodes: number[] } = { dots: [], nodes: [] };

    const place = () => {
      const box = el.getBoundingClientRect();
      const centre = (node: Element) => {
        const r = node.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      };
      const d = dots.map(centre);
      const n = nodes.map(centre);
      if (!d.length || !n.length) return;
      const rail = d[0]!.x;
      const stacked = Math.abs(n[0]!.x - n[n.length - 1]!.x) < 2; // narrow screens: every node sits on the rail
      const last = n[n.length - 1]!;
      const radius = 22;
      const path = stacked
        ? `M${rail} ${d[0]!.y}V${last.y}`
        : `M${rail} ${d[0]!.y}V${n[0]!.y - radius}Q${rail} ${n[0]!.y} ${rail + radius} ${n[0]!.y}H${last.x}`;
      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      svg.setAttribute("width", String(box.width));
      svg.setAttribute("height", String(box.height));
      base.setAttribute("d", path);
      line.setAttribute("d", path);

      const total = line.getTotalLength() || 1;
      const samples = 240;
      const at = (p: { x: number; y: number }) => {
        let best = 0;
        let min = Infinity;
        for (let i = 0; i <= samples; i += 1) {
          const q = line.getPointAtLength((i / samples) * total);
          const dist = (q.x - p.x) ** 2 + (q.y - p.y) ** 2;
          if (dist < min) { min = dist; best = i / samples; }
        }
        return best;
      };
      marks = { dots: d.map(at), nodes: n.map(at) };
    };

    place();
    const settle = () => {
      line.style.removeProperty("stroke-dashoffset");
      gsap.set([...dots, ...nodes, ...parts, ...labels, ...(caption ? [caption] : []), head], { clearProps: "opacity,visibility,transform" });
      [...dots, ...nodes].forEach((node) => node.removeAttribute("data-hold"));
    };

    const mm = gsap.matchMedia();
    let tl: gsap.core.Timeline | null = null;
    let played = false;
    let entered = false;
    let observer: ResizeObserver | null = null;

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const duration = 2;
      const build = () => {
        tl?.kill();
        settle();
        if (played) return;
        gsap.set(parts, { opacity: 0, y: 14 });
        gsap.set([...labels, ...(caption ? [caption] : [])], { opacity: 0, y: 6 });
        [...dots, ...nodes].forEach((node) => node.setAttribute("data-hold", ""));
        gsap.set(head, { opacity: 0 });
        const total = line.getTotalLength() || 1;
        const proxy = { p: 0 };
        const next = gsap.timeline({ paused: true, onComplete: () => { played = true; settle(); } });
        tl = next;
        next.fromTo(line, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration, ease: "none" }, 0);
        next.set(head, { opacity: 1 }, 0);
        next.to(proxy, {
          p: 1, duration, ease: "none",
          onUpdate: () => {
            const q = line.getPointAtLength(proxy.p * total);
            head.setAttribute("cx", String(q.x));
            head.setAttribute("cy", String(q.y));
          },
        }, 0);
        next.set(head, { opacity: 0 }, duration);
        marks.dots.forEach((p, i) => {
          next.add(() => dots[i]?.removeAttribute("data-hold"), p * duration);
          const row = parts.filter((part) => part.dataset.part === String(i));
          next.to(row, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: "power3.out" }, Math.max(0, p * duration - 0.12));
        });
        if (caption) next.to(caption, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, Math.max(0, (marks.nodes[0] ?? 0) * duration - 0.1));
        marks.nodes.forEach((p, i) => {
          next.add(() => nodes[i]?.removeAttribute("data-hold"), p * duration);
          if (labels[i]) next.to(labels[i], { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, p * duration);
        });
      };

      build();
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 72%",
        once: true,
        onEnter: () => { entered = true; tl?.play(); },
      });
      // a re-flow (fonts, resize) before the line has started re-measures the whole drawing; once it runs it just finishes
      observer = new ResizeObserver(() => { place(); if (!played && !entered) build(); });
      observer.observe(el);
      return () => {
        trigger.kill();
        tl?.kill();
        observer?.disconnect();
        settle();
      };
    });

    // Without motion (or once drawn) the line is only kept in step with the layout.
    const follow = new ResizeObserver(() => place());
    follow.observe(el);
    void document.fonts?.ready.then(() => place());
    const frame = requestAnimationFrame(() => place());
    return () => {
      cancelAnimationFrame(frame);
      mm.revert();
      follow.disconnect();
    };
  }, []);

  return (
    <div ref={root} className={styles.map}>
      <svg className={styles.wire} data-wire aria-hidden="true">
        <path className={styles.base} data-base />
        <path className={styles.line} data-line pathLength={1} />
        <circle className={styles.head} data-head r="4.5" />
      </svg>

      <p className={styles.group}>{group}</p>
      <ul className={styles.rows} role="list">
        {items.map((item, i) => {
          const tone = look[item.id];
          return (
            <li key={item.id} className={styles.row} data-row style={{ "--accent": tone.rgb } as CSSProperties}>
              <span className={styles.dot} data-dot aria-hidden="true" />
              <div className={styles.art} data-part={i}><EntranceArt id={item.id} /></div>
              <div className={styles.copy} data-part={i}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
              <div className={styles.state} data-part={i}>
                <p className={styles.status} data-state={tone.state}><i aria-hidden="true" />{item.status}</p>
                <p className={styles.note}>{item.note}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className={styles.shared}>
        <p className={styles.sharedLabel} data-caption>{shared.label}</p>
        <ol className={styles.steps}>
          {shared.steps.map((step) => (
            <li key={step} className={styles.step}>
              <span className={styles.node} data-node aria-hidden="true" />
              <span className={styles.stepLabel} data-label>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
