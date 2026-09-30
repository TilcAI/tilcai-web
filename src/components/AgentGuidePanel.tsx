"use client";

import { useEffect, useRef, useState } from "react";
import type { AgentClient } from "@/lib/content/agents";
import type { Copy } from "@/lib/i18n";
import { Icon } from "./Icon";

export function AgentGuidePanel({ agent, t, onClose }: { agent: AgentClient; t: Copy; onClose: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const p = t.agents.panel;
  const validated = agent.guide.kind === "validated" ? agent.guide : null;

  useEffect(() => { heading.current?.focus(); }, []);

  const copyConfiguration = async () => {
    if (!validated?.configuration) return;
    try {
      await navigator.clipboard.writeText(validated.configuration);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  return (
    <section id="agent-guide" className="agent-guide" aria-labelledby="agent-guide-title"
      onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); onClose(); } }}>
      <div className="agent-guide-head">
        <div>
          <p className="eyebrow">{p.title}</p>
          <h3 id="agent-guide-title" ref={heading} tabIndex={-1}>{agent.name}</h3>
          <p>{t.agents.surfaceLabels[agent.surface]} · {agent.surfaceDetail[t.locale]}</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onClose}>{p.close}<Icon name="x" /></button>
      </div>
      <div className="agent-guide-tags">
        <span className={`tag integration-${agent.status}`}>{t.integrationLabels[agent.status]}</span>
        <span>{t.agents.exploration}: {t.environmentLabels[agent.environment]}</span>
      </div>
      <div className="agent-guide-reference">
        <h4>{p.reference}</h4>
        <p>{agent.reference[t.locale]}</p>
        <a href={agent.officialDocs} target="_blank" rel="noopener noreferrer">{p.officialDocs} · {agent.name}<Icon name="arrow" /></a>
      </div>
      {!validated && (
        <div className="agent-guide-preparation">
          <h4>{p.preparation}</h4>
          <p>{p.preparationNote}</p>
        </div>
      )}
      <dl className="agent-guide-facts">
        <div><dt>{p.requirements}</dt><dd>{agent.prerequisite[t.locale]}</dd></div>
        <div><dt>{p.transport}</dt><dd>{validated?.transport ?? p.pendingTransport}</dd></div>
        <div><dt>{p.authentication}</dt><dd>{validated?.authentication[t.locale] ?? p.pendingAuthentication}</dd></div>
        <div><dt>{p.tools}</dt><dd>{validated ? validated.tools.join(", ") : p.pendingTools}</dd></div>
        <div><dt>{p.approval}</dt><dd>{p.approvalNote}</dd></div>
        <div><dt>{p.disconnect}</dt><dd>{validated?.disconnect[t.locale] ?? p.pendingDisconnect}</dd></div>
      </dl>
      {validated && (
        <div className="agent-guide-steps">
          <h4>{p.steps}</h4>
          <p>{p.verified}: <time dateTime={validated.testedAt}>{validated.testedAt}</time></p>
          <ol>{validated.steps.map((step, index) => <li key={index}>{step[t.locale]}</li>)}</ol>
          {validated.configuration && (
            <>
              <h4>{p.configuration}</h4>
              <pre className="agent-configuration"><code>{validated.configuration}</code></pre>
              <button type="button" className="btn btn-ghost" onClick={copyConfiguration}>{p.copy}</button>
              <p role="status" aria-live="polite">{copyStatus === "copied" ? p.copied : copyStatus === "error" ? p.copyError : ""}</p>
            </>
          )}
        </div>
      )}
      <p className="agent-permission"><Icon name="shield" />{t.agents.permissionNote}</p>
      <a className="btn btn-primary" href="#demo">{p.explore}<Icon name="arrow" /></a>
    </section>
  );
}
