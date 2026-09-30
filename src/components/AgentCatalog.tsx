"use client";

import { useRef, useState } from "react";
import { agents } from "@/lib/content/agents";
import type { Copy } from "@/lib/i18n";
import { AgentCard } from "./AgentCard";
import { AgentGuidePanel } from "./AgentGuidePanel";
import { Icon } from "./Icon";

export function AgentCatalog({ t }: { t: Copy }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const selected = agents.find((agent) => agent.slug === selectedSlug);
  const primary = agents.filter((agent) => agent.group === "primary");
  const additional = agents.filter((agent) => agent.group === "additional");

  const closePanel = () => {
    setSelectedSlug(null);
    lastTrigger.current?.focus();
  };

  const cards = (entries: typeof agents) => entries.map((agent) => (
    <li key={agent.slug}>
      <AgentCard agent={agent} t={t} selected={agent.slug === selectedSlug}
        onSelect={(trigger) => {
          lastTrigger.current = trigger;
          setSelectedSlug(agent.slug === selectedSlug ? null : agent.slug);
        }} />
    </li>
  ));

  return (
    <section id="agents" className="section section-alt" aria-labelledby="agents-title">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">{t.agents.eyebrow}</p>
          <h2 id="agents-title">{t.agents.title}</h2>
          <p className="section-lead">{t.agents.lead}</p>
        </header>
        <p className="agent-permission"><Icon name="shield" />{t.agents.permissionNote}</p>
        <ul className="grid grid-3 agent-grid" role="list">{cards(primary)}</ul>
        <div id="additional-agents" hidden={!expanded}>
          <ul className="grid grid-3 agent-grid" role="list">{cards(additional)}</ul>
        </div>
        <button type="button" className="btn btn-ghost agent-more" aria-expanded={expanded} aria-controls="additional-agents"
          onClick={() => {
            if (expanded && selected?.group === "additional") setSelectedSlug(null);
            setExpanded(!expanded);
          }}>
          {expanded ? t.agents.fewer : t.agents.more}
        </button>
        {selected ? <AgentGuidePanel key={selected.slug} agent={selected} t={t} onClose={closePanel} /> : (
          <div id="agent-guide" className="agent-guide-empty"><Icon name="doc" /><p>{t.agents.panel.empty}</p></div>
        )}
        <p className="disclaimer">{t.agents.thirdPartyNote}</p>
      </div>
    </section>
  );
}
