"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { acquireSmoothScroll, scrollPageTo } from "@/lib/smooth-scroll";
import { OperationScene } from "./OperationScene";
import { PHASES, STEPS, phaseIndex, phaseLength, phaseMiddle } from "./phases";
import { buildOperationTimeline } from "./timeline";
import styles from "./OperationSection.module.css";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** How far each layer may drift with the pointer, in scene units (the scene is about 0.65 px per unit on a desktop). */
const POINTER_REACH = 1;

/**
 * "Una operación. Seis pasos. Dos recibos." One scene, one timeline. The scroll tells a single operation: the agent asks, the
 * business answers, TilcAI checks, the person approves, the payment crosses the rail and two receipts close it. Everything the
 * earlier steps put on the stage is still there at the end.
 *
 * Modes (see the CSS): `pinned` (desktop and tablet), `flow` (phone) and `static` (reduced motion, or before the script runs: the
 * scene shows its final state and the six cards read as a list). The text in the cards is always real HTML.
 */
export function OperationSection({ t }: { t: Copy }) {
  const c = narrative(t.locale).flow;
  const root = useRef<HTMLElement>(null);
  const total = `0${c.steps.length}`;

  useEffect(() => acquireSmoothScroll(), []);

  useIsoLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);
    const q = <T extends Element>(selector: string) => Array.from(section.querySelectorAll<T>(selector));
    const items = q<HTMLElement>('[data-k="nav-item"]');
    const links = q<HTMLElement>('[data-k="nav-link"]');
    const cards = q<HTMLElement>('[data-k^="step-"]');
    const fill = section.querySelector<HTMLElement>('[data-k="nav-fill"]')!;
    const headerHeight = () => Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 80;

    // Keeps the timeline of marks, the active card and the accessibility attributes in step with the scene.
    const sync = (progress: number, mode: string) => {
      const step = phaseIndex(progress);
      const done = (k: number) => progress >= (k === STEPS - 1 ? 0.975 : PHASES[k + 1] - 0.012);
      items.forEach((item, k) => { item.dataset.state = done(k) ? "done" : k === step ? "active" : "todo"; });
      links.forEach((link, k) => { if (k === step) link.setAttribute("aria-current", "step"); else link.removeAttribute("aria-current"); });
      cards.forEach((card, k) => {
        card.dataset.active = String(k === step);
        if (mode === "pinned") card.setAttribute("aria-hidden", String(k !== step)); else card.removeAttribute("aria-hidden");
      });
      const local = (progress - PHASES[step]) / phaseLength(step);
      gsap.set(fill, { scaleX: Math.min(1, (step + local) / (STEPS - 1)) });
    };

    const mm = gsap.matchMedia();
    mm.add({
      wide: "(min-width: 1100px) and (prefers-reduced-motion: no-preference)",
      mid: "(min-width: 768px) and (max-width: 1099px) and (prefers-reduced-motion: no-preference)",
      narrow: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
      still: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      const { wide, mid, narrow } = context.conditions as Record<string, boolean>;
      const mode = wide || mid ? "pinned" : narrow ? "flow" : "static";
      section.dataset.mode = mode;
      if (mode === "pinned") section.style.setProperty("--span", wide ? "6" : "5");

      const { tl, idle } = buildOperationTimeline(section, { panel: mode === "pinned", compact: !wide });
      tl.eventCallback("onUpdate", () => sync(tl.progress(), mode));
      let trigger: ScrollTrigger | undefined;
      const cleanups: (() => void)[] = [];

      if (mode === "static") {
        // No motion: every object of the story is shown in its final place, and the cards are a plain list.
        tl.progress(1);
        sync(1, mode);
        section.dataset.live = "false";
      } else {
        if (mode === "pinned") {
          trigger = ScrollTrigger.create({ animation: tl, trigger: section, start: () => `top top+=${headerHeight()}`, end: "bottom bottom", scrub: 0.8, invalidateOnRefresh: true });
        } else {
          const list = section.querySelector<HTMLElement>('[data-k="steps"]')!;
          trigger = ScrollTrigger.create({ animation: tl, trigger: list, start: "top 72%", end: "bottom 72%", scrub: 0.6, invalidateOnRefresh: true });
        }
        sync(0, mode);

        // Marks scroll to the middle of their step (inside the pinned range) or to their card.
        const aim = trigger;
        links.forEach((link, k) => {
          const onClick = (event: Event) => { event.preventDefault(); scrollPageTo(aim.start + (aim.end - aim.start) * phaseMiddle(k)); };
          link.addEventListener("click", onClick);
          cleanups.push(() => link.removeEventListener("click", onClick));
        });

        // Idle motion and the pointer only run while the section is on screen.
        const layers = q<SVGGElement>("[data-depth]").map((layer) => ({
          reach: Number(layer.dataset.depth) * POINTER_REACH,
          x: gsap.quickSetter(layer, "x", "px") as (value: number) => void,
          y: gsap.quickSetter(layer, "y", "px") as (value: number) => void,
        }));
        const pointer = { x: 0, y: 0 }, eased = { x: 0, y: 0 };
        const finePointer = wide && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const glide = () => {
          eased.x += (pointer.x - eased.x) * 0.08; eased.y += (pointer.y - eased.y) * 0.08;
          layers.forEach((layer) => { layer.x(eased.x * layer.reach); layer.y(eased.y * layer.reach); });
        };
        const onMove = (event: PointerEvent) => {
          const box = section.getBoundingClientRect();
          pointer.x = Math.max(-1, Math.min(1, ((event.clientX - box.left) / box.width) * 2 - 1));
          pointer.y = Math.max(-1, Math.min(1, ((event.clientY - Math.max(0, box.top)) / Math.min(box.height, window.innerHeight)) * 2 - 1));
        };
        if (finePointer) { section.addEventListener("pointermove", onMove); cleanups.push(() => section.removeEventListener("pointermove", onMove)); }
        let live = false;
        const setLive = (value: boolean) => {
          if (value === live) return;
          live = value;
          section.dataset.live = String(value);
          idle.forEach((animation) => (value ? animation.resume() : animation.pause()));
          if (finePointer) { if (value) gsap.ticker.add(glide); else gsap.ticker.remove(glide); }
        };
        const watcher = ScrollTrigger.create({ trigger: section, start: "top bottom", end: "bottom top", onToggle: (self) => setLive(self.isActive) });
        cleanups.push(() => { setLive(false); watcher.kill(); });
      }
      section.dataset.ready = "true";

      return () => {
        cleanups.forEach((fn) => fn());
        trigger?.kill();
        tl.kill();
        idle.forEach((animation) => animation.kill());
        section.style.removeProperty("--span");
        section.dataset.mode = "static";
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="flow" className={styles.root} data-mode="static" data-ready="false" data-live="false" aria-labelledby="flow-title">
      <div className={styles.sticky}>
        <div className={styles.left}>
          <header className={styles.head}>
            <p className={styles.eyebrow}>{t.nav.flow}</p>
            <h2 id="flow-title" className={styles.title}>{(c.title.match(/[^.!?]+[.!?]*/g) ?? [c.title]).map((s) => <span key={s}>{s.trim()}</span>)}</h2>
            <p className={styles.lead}>{c.lead}</p>
          </header>
          <div className={styles.stage}>
            <div className={styles.sceneBox}>
              <OperationScene copy={c.scene} agentLabel={c.agent.toUpperCase()} businessLabel={c.business.toUpperCase()} />
            </div>
            <nav className={styles.timeline} aria-label={t.flow.eyebrow}>
              <span className={styles.line} aria-hidden="true"><i data-k="nav-fill" /></span>
              <ol>
                {c.steps.map((step, index) => (
                  <li key={step.title} className={styles.item} data-k="nav-item" data-state={index === 0 ? "active" : "todo"}>
                    <a className={styles.mark} data-k="nav-link" href={`#purchase-step-${index}`} aria-label={`${index + 1}. ${step.title}`} aria-current={index === 0 ? "step" : undefined}>
                      <span>0{index + 1}</span>
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" /></svg>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.stack}>
          <div className={styles.bar} aria-hidden="true"><i data-k="bar" /></div>
          <ol className={styles.steps} data-k="steps">
            {c.steps.map((step, index) => (
              <li key={step.title} id={`purchase-step-${index}`} className={styles.step} data-k={`step-${index}`} data-active={index === 0} style={{ "--len": phaseLength(index) } as CSSProperties}>
                <div className={styles.stepCard}>
                  <span className={styles.stepNumber} data-p="num">0{index + 1} / {total}<span className={styles.stepActor}> · {c.actor}: {step.actor}</span></span>
                  <h3 data-p="title">{step.title}</h3>
                  <p data-p="body">{step.body}</p>
                  <div className={styles.artifact} data-p="artifact">
                    <div className={styles.artifactHead}><strong>{step.artifact}</strong><span>{c.state}: {step.state}</span></div>
                    <ul>{step.lines.map((line) => <li key={line}>{line}</li>)}</ul>
                  </div>
                  <p className={styles.detail} data-p="detail">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
