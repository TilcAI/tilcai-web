"use client";

import { useEffect, useRef, useState } from "react";
import type { AgentClient } from "@/lib/content/agents";
import type { Copy } from "@/lib/i18n";
import { Icon } from "./Icon";

export function AgentGuidePanel({ agent, t, onClose, returnFocus }: {
  agent: AgentClient; t: Copy; onClose: () => void; returnFocus: HTMLButtonElement | null;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const p = t.agents.panel;
  const validated = agent.guide.kind === "validated" ? agent.guide : null;

  useEffect(() => {
    const panel = dialog.current;
    if (!panel) return;
    const previousOverflow = document.body.style.overflow;
    panel.showModal();
    document.body.style.overflow = "hidden";
    heading.current?.focus({ preventScroll: true });
    return () => {
      panel.close();
      document.body.style.overflow = previousOverflow;
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, [returnFocus]);

  const copyConfiguration = async () => {
    if (!validated?.configuration) return;
    try { await navigator.clipboard.writeText(validated.configuration); setCopyStatus("copied"); }
    catch { setCopyStatus("error"); }
  };
  const facts = [
    [p.requirements, agent.prerequisite[t.locale]],
    [p.transport, validated?.transport ?? p.pendingTransport],
    [p.authentication, validated?.authentication[t.locale] ?? p.pendingAuthentication],
    [p.tools, validated ? validated.tools.join(", ") : p.pendingTools],
    [p.approval, p.approvalNote],
    [p.disconnect, validated?.disconnect[t.locale] ?? p.pendingDisconnect],
  ];

  return (
    <dialog id="agent-guide" className="agent-guide" ref={dialog} aria-modal="true"
      aria-labelledby="agent-guide-title" aria-describedby="agent-guide-summary"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), summary"))
          .filter((control) => control.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === heading.current)) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first?.focus();
        }
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}>
      <div className="agent-guide-head">
        <div><p className="eyebrow">{p.title}</p><h3 id="agent-guide-title" ref={heading} tabIndex={-1}>{agent.name}</h3></div>
        <button type="button" className="drawer-close" aria-label={p.close} onClick={onClose}><Icon name="x" /></button>
      </div>
      <div className="agent-guide-body">
        <p className="agent-guide-surface">{t.agents.surfaceLabels[agent.surface]} · {agent.surfaceDetail[t.locale]}</p>
        <p id="agent-guide-summary" className="agent-guide-summary">{agent.summary[t.locale]}</p>
        <div className="agent-guide-tags">
          <span className={`tag integration-${agent.status}`}>{t.integrationLabels[agent.status]}</span>
          <span>{t.agents.exploration}: {t.environmentLabels[agent.environment]}</span>
        </div>
        {!validated && <div className="agent-guide-preparation"><h4>{p.preparation}</h4><p>{p.preparationNote}</p></div>}
        <details className="guide-disclosure">
          <summary>{p.reference}</summary>
          <p>{agent.reference[t.locale]}</p>
        </details>
        <a className="agent-official-link" href={agent.officialDocs} target="_blank" rel="noopener noreferrer">{p.officialDocs}<Icon name="arrow" /></a>
        <div className="agent-guide-facts">
          {facts.map(([label, value], index) => <details className="guide-disclosure" key={label} open={index === 0 ? true : undefined}>
            <summary>{label}</summary><p>{value}</p>
          </details>)}
        </div>
        {validated && <div className="agent-guide-steps">
          <h4>{p.steps}</h4><p>{p.verified}: <time dateTime={validated.testedAt}>{validated.testedAt}</time></p>
          <ol>{validated.steps.map((step, index) => <li key={index}>{step[t.locale]}</li>)}</ol>
          {validated.configuration && <>
            <h4>{p.configuration}</h4><pre className="agent-configuration"><code>{validated.configuration}</code></pre>
            <button type="button" className="btn btn-ghost" onClick={copyConfiguration}>{p.copy}</button>
            <p role="status" aria-live="polite">{copyStatus === "copied" ? p.copied : copyStatus === "error" ? p.copyError : ""}</p>
          </>}
        </div>}
        <p className="agent-permission"><Icon name="shield" />{t.agents.permissionNote}</p>
      </div>
      <div className="agent-guide-footer"><a className="btn btn-primary" href="#demo" onClick={onClose}>{p.explore}<Icon name="arrow" /></a></div>
    </dialog>
  );
}
