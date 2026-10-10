"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import type { AgentClient } from "@/lib/content/agents";
import type { TerminalScene } from "@/lib/content/terminal-scene";
import { Icon } from "./Icon";
import { useReducedMotion } from "./useDepthMotion";
import styles from "./AgentCatalog.module.css";

/** The mascot to draw, or null when the entry has none (or it failed, or only an animation exists under reduced motion). */
function useMascot(agent: AgentClient) {
  const [failed, setFailed] = useState(false);
  const reduced = useReducedMotion();
  const animated = agent.asset?.src.toLowerCase().endsWith(".gif") ?? false;
  const asset = failed || (reduced && animated && !agent.asset?.poster) ? null : agent.asset;
  const src = reduced && animated ? asset?.poster : asset?.src;
  return { src: asset && src ? src : null, scale: asset?.scale ?? 1, animated: src?.toLowerCase().endsWith(".gif") ?? false, onError: () => setFailed(true) };
}

/** Small identity tile for the picker: the mascot when there is one, the client's initials when there is not. */
export function AgentBadge({ agent }: { agent: AgentClient }) {
  const mascot = useMascot(agent);
  return (
    <span className={styles.badge} aria-hidden="true">
      {mascot.src ? (
        <Image src={mascot.src} width={72} height={72} alt="" sizes="40px" unoptimized={mascot.animated} onError={mascot.onError} />
      ) : agent.fallback.initials}
    </span>
  );
}

const bar = (width: number, extra?: Record<string, string | number>) =>
  ({ "--w": `${width}%`, ...extra }) as CSSProperties;

/** Slot where TilcAI would appear in the client. Dashed on purpose: nothing is connected. */
function Slot() {
  return <span className={styles.slot}><i />tilcai</span>;
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * A terminal client in the middle of a session with TilcAI: the request is typed, three tools answer in turn, and the
 * last one stops to wait for a person. It is an illustration (the title bar says so) and it only runs while it is on
 * screen; without motion, or before it runs, it shows its last frame, so nothing is hidden waiting for a script.
 */
function TerminalScreen({ scene }: { scene: TerminalScene }) {
  const root = useRef<HTMLDivElement>(null);
  const last = scene.tools.length - 1;

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const all = (selector: string) => Array.from(el.querySelectorAll<HTMLElement>(selector));
      const chars = all("[data-ch]");
      const tools = all("[data-tool]");
      const details = all("[data-detail]");
      const marks = all("[data-mark]");
      const wait = el.querySelector<HTMLElement>("[data-wait]");
      const setMark = (index: number, state: string) => () => marks[index]?.setAttribute("data-state", state);

      const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.5 });
      // every pass starts from an empty session
      tl.set(chars, { opacity: 0 }, 0);
      tl.set([...tools, ...(wait ? [wait] : [])], { opacity: 0, y: 5 }, 0);
      tl.set(details, { opacity: 0 }, 0);
      tl.add(() => marks.forEach((mark) => mark.setAttribute("data-state", "idle")), 0);

      tl.to(chars, { opacity: 1, duration: 0.01, stagger: 0.032, ease: "none" }, 0.4);
      let at = 0.4 + chars.length * 0.032 + 0.35;
      tools.forEach((tool, i) => {
        tl.to(tool, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, at);
        tl.add(setMark(i, "run"), at);
        const settle = at + (i === 0 ? 0.7 : i === 1 ? 0.8 : 0.9);
        tl.add(setMark(i, i === last ? "wait" : "done"), settle);
        if (details[i]) tl.to(details[i], { opacity: 1, duration: 0.3, ease: "power2.out" }, settle);
        at = settle + 0.25;
      });
      if (wait) tl.to(wait, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, at);
      tl.to(el, { opacity: 0, duration: 0.4, ease: "power1.in" }, at + 4.2);
      tl.set(el, { opacity: 1 }, at + 4.7);

      const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) tl.play(); else tl.pause(); }, { threshold: 0.25 });
      observer.observe(el);
      return () => {
        observer.disconnect();
        tl.kill();
        // hand the drawing back to the markup: the last frame
        gsap.set([...chars, ...tools, ...details, ...(wait ? [wait] : []), el], { clearProps: "opacity,transform" });
        marks.forEach((mark, i) => mark.setAttribute("data-state", i === last ? "wait" : "done"));
      };
    });
    return () => mm.revert();
  }, [last]);

  return (
    <div ref={root} className={styles.term}>
      <p className={styles.cmd}>
        <b>›</b>
        <span className={styles.typed}>{Array.from(scene.prompt).map((ch, i) => <span key={i} data-ch>{ch}</span>)}</span>
      </p>
      {scene.tools.map((tool, i) => (
        <p key={tool.label} className={styles.tool} data-tool>
          <span className={styles.mark} data-mark data-state={i === last ? "wait" : "done"} />
          <Slot />
          <span className={styles.toolLabel}>{tool.label}</span>
          {tool.detail && <span className={styles.detail} data-detail>{tool.detail}</span>}
        </p>
      ))}
      <p className={styles.waiting} data-wait><b>›</b><span>{scene.waiting}</span><span className={styles.caret} /></p>
    </div>
  );
}

function EditorScreen() {
  return (
    <div className={styles.ide}>
      <div className={styles.tree}>
        <i style={bar(80)} /><i style={bar(58, { "--d": 1 })} /><i style={bar(66, { "--d": 1 })} /><i style={bar(48)} /><i style={bar(72)} />
      </div>
      <div className={styles.pane}>
        <div className={styles.tabs}><i data-on="" /><i /></div>
        <div className={styles.code}>
          <i style={bar(52)} /><i style={bar(70, { "--d": 1 })} /><i style={bar(38, { "--d": 1 })} /><i style={bar(60, { "--d": 2 })} /><i style={bar(30)} />
        </div>
      </div>
      <div className={styles.side}>
        <i style={bar(82)} data-dim="" /><i style={bar(64)} data-dim="" /><Slot />
      </div>
    </div>
  );
}

function DesktopScreen() {
  return (
    <div className={styles.chat}>
      <i style={bar(58)} data-from="user" />
      <i style={bar(78)} data-from="agent" />
      <i style={bar(48)} data-from="agent" />
      <Slot />
      <span className={styles.input}><i style={bar(36)} /></span>
    </div>
  );
}

/** Decorative: the client's own surface as a window, with the mascot (or initials) standing in front of it. */
export function AgentArt({ agent, scene }: { agent: AgentClient; scene?: TerminalScene }) {
  const mascot = useMascot(agent);
  return (
    <div className={styles.art} data-surface={agent.surface} aria-hidden="true">
      <div className={styles.window}>
        <div className={styles.chrome}>
          <i /><i /><i />
          {agent.surface === "terminal" && scene && (
            <>
              <span className={styles.chromeTitle}>{agent.name}</span>
              <span className={styles.chromeBadge}>{scene.badge}</span>
            </>
          )}
        </div>
        <div className={styles.screen}>
          {agent.surface === "terminal" && scene ? <TerminalScreen scene={scene} />
            : agent.surface === "editor" ? <EditorScreen /> : <DesktopScreen />}
        </div>
      </div>
      <div className={styles.mascot}>
        {mascot.src ? (
          <Image src={mascot.src} width={240} height={240} alt="" sizes="170px" unoptimized={mascot.animated}
            style={{ "--mascot-scale": mascot.scale } as CSSProperties} onError={mascot.onError} />
        ) : (
          <span className={styles.monogram}><Icon name={agent.fallback.icon} /><span>{agent.fallback.initials}</span></span>
        )}
      </div>
    </div>
  );
}
