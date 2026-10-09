import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import {
  destinationNetwork, evidenceDate, evidencePayments, originNetworks, shortHash, snowtraceTx, stellarExpertTx,
} from "@/lib/content/rails";
import { Icon } from "../Icon";
import styles from "./Narrative.module.css";
import explain from "./Explain.module.css";

const tagFor = { verified: "tag-available", lab: "tag-integration" } as const;

/**
 * How the money gets to the business: two alternative routes, the CCTP lab map with its honest status per network,
 * what is not promised, and real testnet evidence. Server component: nothing here needs the browser.
 */
export function RailsSection({ t }: { t: Copy }) {
  const c = narrative(t.locale).rails;
  const e = narrative(t.locale).evidence;
  const date = new Date(`${evidenceDate}T00:00:00Z`).toLocaleDateString(t.htmlLang, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

  return (
    <section id="rails" className={styles.section} aria-labelledby="rails-title">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{c.eyebrow}</p>
        <h2 id="rails-title" className={styles.heading} style={{ maxWidth: "26ch" }}>{c.title}</h2>
        <p className={styles.lead}>{c.lead}</p>

        <aside className={explain.explainer} aria-labelledby="crosschain-title">
          <span className={explain.explainerTerm}>{c.explainer.term}</span>
          <div>
            <h3 id="crosschain-title">{c.explainer.title}</h3>
            <p>{c.explainer.body}</p>
            <p className={explain.explainerNote}>{c.explainer.note}</p>
          </div>
        </aside>

        <ul className={explain.routes} role="list">
          {c.routes.map(route => (
            <li key={route.id} className={explain.route} data-tone={route.tone}>
              <div className={explain.routeTop}>
                <span className={explain.routeTag}>{route.tag}</span>
                <span className={`tag ${tagFor[route.tone]}`}>{route.status}</span>
              </div>
              <h3>{route.title}</h3>
              <p>{route.body}</p>
              <p className={explain.routeNote}>{route.note}</p>
            </li>
          ))}
        </ul>

        <div className={explain.map}>
          <div className={explain.mapHead}>
            <header className={explain.blockHead}>
              <h3 className={explain.blockTitle}>{c.mapTitle}</h3>
              <p className={explain.blockLead}>{c.mapLead}</p>
            </header>
            <ul className={explain.legend} role="list" aria-label={c.mapTitle}>
              <li><span className="tag tag-available">{c.legend.verified}</span></li>
              <li><span className="tag tag-integration">{c.legend.lab}</span></li>
              <li><span className="tag tag-next">{c.legend.vision}</span></li>
            </ul>
          </div>
          <div className={explain.mapGrid}>
            <div className={explain.col}>
              <p className={explain.colLabel}>{c.origin}</p>
              <ul className={explain.networks} role="list">
                {originNetworks.map(network => (
                  <li key={network.id} className={explain.network} data-status={network.status}>
                    <span>{network.name}</span>
                    <span className={`tag ${tagFor[network.status]}`}>{c.statuses[network.status]}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${explain.col} ${explain.pipeline}`}>
              <p className={explain.colLabel}>{c.pipeline}</p>
              {c.pipelineSteps.map((step, index) => (
                <div key={step.plain} className={explain.pipeStep}><b aria-hidden="true">0{index + 1}</b><span>{step.plain}<small className={explain.term}>{step.term}</small></span></div>
              ))}
              <p className={explain.gasless}>{c.gasless}</p>
            </div>
            <div className={`${explain.col} ${explain.dest}`}>
              <p className={explain.colLabel}>{c.destination}</p>
              <div className={explain.destCard}>
                <strong>{destinationNetwork.name}</strong>
                <span>{c.destinationNote}</span>
              </div>
            </div>
          </div>
          <p className={explain.vision}>{c.visionNote}</p>
        </div>

        <div className={explain.limits}>
          <h3>{c.limits.title}</h3>
          <ul role="list">{c.limits.items.map(item => <li key={item}>{item}</li>)}</ul>
        </div>

        <div id="evidence" className={explain.evidence} role="group" aria-labelledby="evidence-title">
          <header className={explain.blockHead}>
            <p className={styles.eyebrow}>{e.eyebrow}</p>
            <h3 id="evidence-title" className={explain.blockTitle}>{e.title}</h3>
            <p className={explain.blockLead}>{e.lead}</p>
          </header>
          <div className={explain.evidenceGrid}>
            {evidencePayments.map(payment => {
              const row = e.rows.find(r => r.id === payment.id)!;
              return (
                <article key={payment.id} className={explain.evRow}>
                  <h4>{row.label}</h4>
                  <p>{row.detail}</p>
                  <a className={explain.evLink} href={snowtraceTx(payment.burnTxHash)} target="_blank" rel="noopener noreferrer" title={payment.burnTxHash}>
                    <span><small>{e.burn} · Snowtrace</small><br />{shortHash(payment.burnTxHash)}</span>
                    <Icon name="arrow" /><span className="sr-only"> — {e.open}</span>
                  </a>
                  <a className={explain.evLink} href={stellarExpertTx(payment.mintTxHash)} target="_blank" rel="noopener noreferrer" title={payment.mintTxHash}>
                    <span><small>{e.mint} · Stellar Expert</small><br />{shortHash(payment.mintTxHash)}</span>
                    <Icon name="arrow" /><span className="sr-only"> — {e.open}</span>
                  </a>
                </article>
              );
            })}
          </div>
          <div className={explain.evMeta}>
            <span className={explain.pill}>{e.dateLabel} {date}</span>
            <span className={explain.pill}>{e.amount}</span>
          </div>
          <p className={explain.evNote}>{e.note}</p>
        </div>
      </div>
    </section>
  );
}
