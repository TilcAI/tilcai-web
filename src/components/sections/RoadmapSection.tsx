import type { Copy } from "@/lib/i18n";
import { roadmapEntries, roadmapStages } from "@/lib/content/roadmap";
import { Icon } from "../Icon";
import { SectionHead, StageTag } from "./shared";
import styles from "./RoadmapSection.module.css";

const ENVIRONMENT_CLASS = { testnet: styles.envTestnet, mainnet: styles.envMainnet, simulation: styles.envSimulation } as const;

/**
 * Status of every capability by stage, with where each one has evidence today (simulation, testnet or mainnet) and
 * who keeps it accurate. Nothing is dated and nothing says "production": see lib/content/roadmap.ts.
 */
export function RoadmapSection({ t, hideHeader = false }: { t: Copy; hideHeader?: boolean }) {
  const r = t.roadmap;
  return (
    <section id="roadmap" className={`section ${styles.root}`} aria-labelledby="road-title">
      <div className="container">
        {!hideHeader && <SectionHead id="road-title" eyebrow={r.eyebrow} title={r.title} lead={r.lead} />}
        {roadmapStages.map((stage, index) => {
          const column = r.columns[stage];
          return (
            <section key={stage} className={`${styles.stage} ${styles[stage]} reveal`} aria-labelledby={`road-${stage}`}>
              <header className={styles.head}>
                <div className={styles.headTop}>
                  <span className={styles.n} aria-hidden="true">
                    {index + 1}
                  </span>
                  <StageTag t={t} stage={stage} />
                </div>
                <p className={styles.when}>{column.when}</p>
                <h3 id={`road-${stage}`} className={styles.title}>
                  {column.title}
                </h3>
                {column.note && <p className={styles.note}>{column.note}</p>}
              </header>
              <ul className={styles.items} role="list">
                {roadmapEntries
                  .filter((entry) => entry.stage === stage)
                  .map((entry) => {
                    const item = r.items[entry.id];
                    return (
                      <li key={entry.id} className={styles.item}>
                        <div className={styles.main}>
                          <h4>{item.title}</h4>
                          <p>{item.detail}</p>
                        </div>
                        {(entry.environment || entry.maintainer) && (
                          <div className={styles.meta}>
                            {entry.environment && (
                              <span className={`tag ${styles.env} ${ENVIRONMENT_CLASS[entry.environment]}`}>
                                {t.environmentLabels[entry.environment]}
                              </span>
                            )}
                            {entry.maintainer && (
                              <p className={styles.owner}>
                                {r.maintainer} <strong>{entry.maintainer}</strong>
                              </p>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </section>
          );
        })}
        <div className={`${styles.closing} reveal`}>
          <aside className={styles.metrics} aria-labelledby="road-metrics-title">
            <h3 id="road-metrics-title">{r.metrics.title}</h3>
            <p>{r.metrics.body}</p>
          </aside>
          <aside className={styles.signature} aria-labelledby="sig-title">
            <h3 id="sig-title">
              <Icon name="shield" />
              {r.signatureTitle}
            </h3>
            <ol className={styles.checks} role="list">
              {r.signatureChecks.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
            <p className={styles.signatureNote}>{r.signatureNote}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
