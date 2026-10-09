import type { Copy } from "@/lib/i18n";
import { roadmapEntries, roadmapStages } from "@/lib/content/roadmap";
import { Icon } from "../Icon";
import { SectionHead, StageTag } from "./shared";

/**
 * Status of every capability by stage, with where each one has evidence today (simulation or testnet) and who keeps
 * it accurate. Nothing is dated and nothing says "production": see lib/content/roadmap.ts.
 */
export function RoadmapSection({ t, hideHeader = false }: { t: Copy; hideHeader?: boolean }) {
  const r = t.roadmap;
  return (
    <section id="roadmap" className="section" aria-labelledby="road-title">
      <div className="container">
        {!hideHeader && <SectionHead id="road-title" eyebrow={r.eyebrow} title={r.title} lead={r.lead} />}
        <div className="roadmap-cols">
          {roadmapStages.map((stage, index) => {
            const column = r.columns[stage];
            return (
              <section key={stage} className={`road-col reveal stage-${stage}`} aria-labelledby={`road-${stage}`}>
                <StageTag t={t} stage={stage} />
                <div className="stage-head">
                  <span className="stage-n" aria-hidden="true">
                    {index + 1}
                  </span>
                  <div>
                    <p className="stage-when">{column.when}</p>
                    <h3 id={`road-${stage}`}>{column.title}</h3>
                  </div>
                </div>
                <ul className="road-items" role="list">
                  {roadmapEntries
                    .filter((entry) => entry.stage === stage)
                    .map((entry) => {
                      const item = r.items[entry.id];
                      return (
                        <li key={entry.id} className="road-item">
                          {entry.environment && (
                            <p className="road-tags">
                              <span className={`tag tag-env tag-env-${entry.environment}`}>{t.environmentLabels[entry.environment]}</span>
                            </p>
                          )}
                          <h4>{item.title}</h4>
                          <p>{item.detail}</p>
                          {entry.maintainer && (
                            <p className="road-owner">
                              {r.maintainer}: <strong>{entry.maintainer}</strong>
                            </p>
                          )}
                        </li>
                      );
                    })}
                </ul>
                {column.note && <p className="cap-note">{column.note}</p>}
              </section>
            );
          })}
        </div>
        <aside className="road-metrics reveal" aria-labelledby="road-metrics-title">
          <h3 id="road-metrics-title">{r.metrics.title}</h3>
          <p>{r.metrics.body}</p>
        </aside>
        <aside className="signature reveal" aria-labelledby="sig-title">
          <h3 id="sig-title">
            <Icon name="shield" />
            {r.signatureTitle}
          </h3>
          <ol className="sig-checks">
            {r.signatureChecks.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
          <p className="sig-note">{r.signatureNote}</p>
        </aside>
      </div>
    </section>
  );
}
