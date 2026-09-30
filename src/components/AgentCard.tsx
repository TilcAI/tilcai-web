"use client";

import Image from "next/image";
import { useState } from "react";
import type { AgentClient } from "@/lib/content/agents";
import type { Copy } from "@/lib/i18n";
import { Icon } from "./Icon";

export function AgentCard({ agent, t, selected, onSelect }: {
  agent: AgentClient;
  t: Copy;
  selected: boolean;
  onSelect: (trigger: HTMLButtonElement) => void;
}) {
  const [assetFailed, setAssetFailed] = useState(false);
  const asset = assetFailed ? null : agent.asset;

  return (
    <article className={`agent-card${selected ? " is-selected" : ""}`} aria-labelledby={`agent-${agent.slug}`}>
      <div className="agent-card-top">
        <div className="agent-identity">
          {asset ? (
            <Image src={asset.src} width={48} height={48} alt={asset.alt[t.locale]} onError={() => setAssetFailed(true)} />
          ) : (
            <span className="agent-fallback" aria-hidden="true">
              <Icon name={agent.fallback.icon} />
              <span>{agent.fallback.initials}</span>
            </span>
          )}
        </div>
        <span className={`tag integration-${agent.status}`}>{t.integrationLabels[agent.status]}</span>
      </div>
      <h3 id={`agent-${agent.slug}`}>{agent.name}</h3>
      <p className="agent-surface">{agent.surfaceDetail[t.locale]}</p>
      <p className="agent-summary">{agent.summary[t.locale]}</p>
      <p className="agent-environment">{t.agents.exploration}: {t.environmentLabels[agent.environment]}</p>
      <button type="button" className="btn btn-ghost" aria-controls="agent-guide" aria-expanded={selected}
        aria-label={`${t.agents.guide}: ${agent.name}`} onClick={(event) => onSelect(event.currentTarget)}>
        {t.agents.guide}<Icon name="arrow" />
      </button>
    </article>
  );
}
