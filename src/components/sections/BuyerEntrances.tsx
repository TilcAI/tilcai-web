import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import styles from "./Narrative.module.css";
import explain from "./Explain.module.css";

/**
 * The three ways a buyer reaches TilcAI, each with its real state. They share the same identity, quote, approval,
 * payment and receipts: the channel is not an authority (WhatsApp starts a process, it does not sign).
 */
export function BuyerEntrances({ t }: { t: Copy }) {
  const c = narrative(t.locale).entrances;
  return (
    <section id="entrances" className={styles.section} aria-labelledby="entrances-title">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{c.eyebrow}</p>
        <h2 id="entrances-title" className={styles.heading} style={{ maxWidth: "26ch" }}>{c.title}</h2>
        <p className={styles.lead}>{c.lead}</p>
        <ul className={explain.entranceGrid} role="list">
          {c.items.map(item => (
            <li key={item.id} className={explain.entrance}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <div className={explain.entranceFoot}>
                <span className={explain.pill}>{item.status}</span>
                <span className={explain.entranceNote}>{item.note}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className={styles.caption}>{c.footnote}</p>
      </div>
    </section>
  );
}
