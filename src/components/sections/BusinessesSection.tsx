"use client";

import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { businesses, publicBusinesses } from "@/lib/content/businesses";
import { BusinessGrid } from "../BusinessGrid";
import { BusinessParallax } from "./BusinessParallax";
import { ConnectionPaths } from "./ConnectionPaths";
import styles from "./Narrative.module.css";
import explain from "./Explain.module.css";
import "@/app/businesses.css";

export function BusinessesSection({ t }: { t: Copy }) {
  const c = narrative(t.locale).business;
  const profiles = publicBusinesses(businesses);
  return (
    <section id="businesses" className={styles.section} style={{ paddingTop: 0 }} aria-labelledby="businesses-title">
      <BusinessParallax t={t} c={c} />
      <ConnectionPaths t={t} />
      <div className={styles.inner}>
        <div className={explain.keep} role="group" aria-label={c.keep.title}>
          <div className={`${explain.keepCol} ${explain.keepYours}`}>
            <h4>{c.keep.yours.title}</h4>
            <ul>{c.keep.yours.lines.map(line => <li key={line}>{line}</li>)}</ul>
          </div>
          <div className={explain.keepCol}>
            <h4>{c.keep.ours.title}</h4>
            <ul>{c.keep.ours.lines.map(line => <li key={line}>{line}</li>)}</ul>
          </div>
        </div>

        {profiles.length > 0 && <div className={styles.profiles}><BusinessGrid profiles={profiles} t={t} /></div>}
      </div>
    </section>
  );
}
