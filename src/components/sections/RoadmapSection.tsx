import type { Copy } from "@/lib/i18n";
import { Icon } from "../Icon";
import { SectionHead, StageTag } from "./shared";

export function RoadmapSection({ t }: { t: Copy }) {
  return (
    <section id="roadmap" className="section" aria-labelledby="road-title">
      <div className="container">
        <SectionHead id="road-title" eyebrow={t.roadmap.eyebrow} title={t.roadmap.title} lead={t.roadmap.lead} />
        <ol className="timeline" role="list">
          {t.roadmap.stages.map((s, i) => (
            <li key={s.title} className={`stage reveal stage-${s.stage}`}>
              <StageTag t={t} stage={s.stage} />
              <div className="stage-head">
                <span className="stage-n" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <p className="stage-when">{s.when}</p>
                  <h3>{s.title}</h3>
                </div>
              </div>
              <ul className="stage-items" role="list">
                {s.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              {s.note && <p className="cap-note">{s.note}</p>}
            </li>
          ))}
        </ol>
        <aside className="signature reveal" aria-labelledby="sig-title">
          <h3 id="sig-title">
            <Icon name="shield" />
            {t.roadmap.signatureTitle}
          </h3>
          <ol className="sig-checks">
            {t.roadmap.signatureChecks.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
          <p className="sig-note">{t.roadmap.signatureNote}</p>
        </aside>
      </div>
    </section>
  );
}
