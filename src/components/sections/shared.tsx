import type { ReactNode } from "react";
import type { Copy } from "@/lib/i18n";
import type { Stage } from "@/lib/i18n/types";

export function StageTag({ t, stage }: { t: Copy; stage: Stage }) {
  return <span className={`tag tag-${stage}`}>{t.stageLabels[stage]}</span>;
}

export function SectionHead({ id, eyebrow, title, dim, lead }: { id: string; eyebrow: string; title: string; dim?: string; lead?: string }) {
  return (
    <header className="section-head reveal">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}{dim && <> <span className="dim">{dim}</span></>}</h2>
      {lead && <p className="section-lead">{lead}</p>}
    </header>
  );
}

export function TechnicalSection({ id, titleId, eyebrow, title, children }: {
  id: string; titleId: string; eyebrow: string; title: string; children: ReactNode;
}) {
  return <section id={id} className="section section-alt technical-section" aria-labelledby={titleId}>
    <div className="container"><details className="technical-disclosure">
      <summary><h2 id={titleId}><span className="eyebrow">{eyebrow}</span><span className="technical-label">{title}</span><span className="technical-toggle" aria-hidden="true">+</span></h2></summary>
      <div className="technical-content">{children}</div>
    </details></div>
  </section>;
}
