import type { Copy } from "@/lib/i18n";
import type { FlowStep } from "@/lib/i18n/types";
import { Icon } from "../Icon";
import { SectionHead } from "./shared";

function FlowNode({ step, n }: { step: FlowStep; n: number }) {
  return (
    <li className={`flow-node tone-${step.tone ?? "neutral"}`}>
      <span className="flow-n" aria-hidden="true">
        {String(n).padStart(2, "0")}
      </span>
      <span className="flow-label">{step.label}</span>
      <span className="flow-detail">{step.detail}</span>
    </li>
  );
}

export function FlowSection({ t }: { t: Copy }) {
  return (
    <section id="flow" className="section section-alt" aria-labelledby="flow-title">
      <div className="container">
        <SectionHead id="flow-title" eyebrow={t.flow.eyebrow} title={t.flow.title} lead={t.flow.lead} />
        <div className="flow reveal">
          <ol className="flow-track" role="list">
            {t.flow.steps.map((s, i) => (
              <FlowNode key={s.label} step={s} n={i + 1} />
            ))}
          </ol>
          <div className="flow-decide">
            <span className="flow-n" aria-hidden="true">
              04
            </span>
            <ul className="decisions" role="list">
              {t.flow.decisions.map((d) => (
                <li key={d.label} className={`decision tone-${d.tone}`}>
                  <code>{d.label}</code>
                  <span>{d.detail}</span>
                </li>
              ))}
            </ul>
          </div>
          <ol className="flow-track flow-after" role="list" start={5}>
            {t.flow.after.map((s, i) => (
              <FlowNode key={s.label} step={s} n={i + 5} />
            ))}
          </ol>
          <p className="flow-note">
            <Icon name="receipt" />
            {t.flow.receiptNote}
          </p>
        </div>
        <div className="grid grid-2 scope reveal">
          <div className="scope-card scope-vision">
            <p className="scope-kicker">{t.flow.visionTitle}</p>
            <p>{t.flow.vision}</p>
          </div>
          <div className="scope-card scope-first">
            <p className="scope-kicker">{t.flow.firstCaseTitle}</p>
            <p>{t.flow.firstCase}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
