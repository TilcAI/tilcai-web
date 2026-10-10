import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import styles from "./Narrative.module.css";
import { EntranceMap } from "./EntranceMap";

/**
 * The three ways a buyer reaches TilcAI, each with its real state. They share the same identity, quote, approval,
 * payment and receipts: the channel is not an authority (WhatsApp starts a process, it does not sign).
 * The section's name labels the group of entrances (it is not a kicker above the heading).
 */
export function BuyerEntrances({ t }: { t: Copy }) {
  const c = narrative(t.locale).entrances;
  return (
    <section id="entrances" className={styles.section} aria-labelledby="entrances-title">
      <div className={styles.inner}>
        <h2 id="entrances-title" className={styles.heading} style={{ maxWidth: "26ch" }}>{c.title}</h2>
        <p className={styles.lead}>{c.lead}</p>
        <EntranceMap group={c.eyebrow} items={c.items} shared={c.shared} />
      </div>
    </section>
  );
}
