"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import type { AgentClient } from "@/lib/content/agents";
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

function TerminalScreen() {
  return (
    <div className={styles.term}>
      <p><b>›</b><i style={bar(44)} /></p>
      <p><i style={bar(70)} data-dim="" /></p>
      <p><i style={bar(56)} data-dim="" /></p>
      <p><b>›</b><Slot /></p>
      <p><b>›</b><span className={styles.caret} /></p>
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
export function AgentArt({ agent }: { agent: AgentClient }) {
  const mascot = useMascot(agent);
  return (
    <div className={styles.art} data-surface={agent.surface} aria-hidden="true">
      <div className={styles.window}>
        <div className={styles.chrome}><i /><i /><i /></div>
        <div className={styles.screen}>
          {agent.surface === "terminal" ? <TerminalScreen /> : agent.surface === "editor" ? <EditorScreen /> : <DesktopScreen />}
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
