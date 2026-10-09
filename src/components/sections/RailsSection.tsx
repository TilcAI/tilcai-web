import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { EvidenceLedger } from "./rails/EvidenceLedger";
import { RailsHeader } from "./rails/RailsHeader";
import { RouteAtlas } from "./rails/RouteAtlas";
import styles from "./Narrative.module.css";
import rails from "./rails/rails.module.css";

/**
 * How the money gets to the business. One map (two routes into one destination, with the lab networks drawn for what they are),
 * what the route does not promise, and the real testnet payments as a ledger. The pieces that animate are client components in
 * `./rails`; this one only composes them and renders the part that never moves.
 */
export function RailsSection({ t }: { t: Copy }) {
  const c = narrative(t.locale).rails;
  return (
    <section id="rails" className={`${styles.section} ${rails.root}`} aria-labelledby="rails-title">
      <div className={rails.inner}>
        <RailsHeader t={t} />
        <RouteAtlas t={t} />
        <div className={rails.limits}>
          <h3>{c.limits.title}</h3>
          <ul role="list">{c.limits.items.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <EvidenceLedger t={t} />
      </div>
    </section>
  );
}
