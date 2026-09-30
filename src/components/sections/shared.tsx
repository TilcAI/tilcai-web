import type { Copy } from "@/lib/i18n";
import type { Stage } from "@/lib/i18n/types";

export function StageTag({ t, stage }: { t: Copy; stage: Stage }) {
  return <span className={`tag tag-${stage}`}>{t.stageLabels[stage]}</span>;
}

export function SectionHead({ id, eyebrow, title, lead }: { id: string; eyebrow: string; title: string; lead?: string }) {
  return (
    <header className="section-head reveal">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {lead && <p className="section-lead">{lead}</p>}
    </header>
  );
}
