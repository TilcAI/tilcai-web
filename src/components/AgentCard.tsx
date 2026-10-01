"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import type { AgentClient } from "@/lib/content/agents";
import type { Copy } from "@/lib/i18n";
import { Icon } from "./Icon";
import { useReducedMotion } from "./useDepthMotion";

export function AgentCard({ agent, t, selected, onSelect }: {
  agent: AgentClient;
  t: Copy;
  selected: boolean;
  onSelect: (trigger: HTMLButtonElement) => void;
}) {
  const [assetFailed, setAssetFailed] = useState(false);
  const reduced = useReducedMotion();
  const animation = agent.asset?.src.toLowerCase().endsWith(".gif");
  const asset = assetFailed || (reduced && animation && !agent.asset?.poster) ? null : agent.asset;
  const source = reduced && animation ? asset?.poster : asset?.src;
  return (
    <article className={`agent-card${selected ? " is-selected" : ""}`} data-accent={agent.asset?.accent ?? "cool"}
      aria-labelledby={`agent-${agent.slug}`}>
      <div className="agent-card-top">
        <span className="agent-surface-label">{t.agents.surfaceLabels[agent.surface]}</span>
        <span className={`tag integration-${agent.status}`}>{t.integrationLabels[agent.status]}</span>
      </div>
      <div className="agent-art" aria-hidden="true">
        <span className="agent-orbit" /><span className="agent-pedestal" />
        {asset && source ? (
          <Image src={source} width={240} height={240} alt="" sizes="240px" unoptimized={source.toLowerCase().endsWith(".gif")}
            style={{ "--mascot-scale": asset.scale ?? 1 } as CSSProperties} onError={() => setAssetFailed(true)} />
        ) : (
          <span className="agent-fallback"><Icon name={agent.fallback.icon} /><span>{agent.fallback.initials}</span></span>
        )}
      </div>
      <div className="agent-card-caption">
        <h3 id={`agent-${agent.slug}`}>{agent.name}</h3>
        <p className="agent-surface">{agent.surfaceDetail[t.locale]}</p>
        <span className="agent-open-label">{t.agents.guide}<Icon name="arrow" /></span>
      </div>
      <button type="button" className="agent-card-trigger" aria-haspopup="dialog" aria-expanded={selected}
        aria-controls={selected ? "agent-guide" : undefined} aria-label={`${t.agents.guide}: ${agent.name}`}
        onClick={(event) => onSelect(event.currentTarget)} />
    </article>
  );
}
