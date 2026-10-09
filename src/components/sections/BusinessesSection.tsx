"use client";

import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { businesses, publicBusinesses } from "@/lib/content/businesses";
import { BusinessGrid } from "../BusinessGrid";
import { BusinessParallax } from "./BusinessParallax";
import styles from "./Narrative.module.css";
import explain from "./Explain.module.css";
import "@/app/businesses.css";

export function BusinessesSection({ t }: { t: Copy }) {
  const c = narrative(t.locale).business;
  const profiles = publicBusinesses(businesses);
  return (
    <section id="businesses" className={styles.section} style={{ paddingTop: 0 }} aria-labelledby="businesses-title">
      <BusinessParallax t={t} c={c} />
      <div className={styles.inner}>
        <p className={styles.caption}>{t.capabilities.disclaimer}</p>
        <div id="business-paths" className={explain.paths}>
          <header className={explain.blockHead}>
            <p className={styles.eyebrow}>{c.paths.eyebrow}</p>
            <h3 className={explain.blockTitle}>{c.paths.title}</h3>
            <p className={explain.blockLead}>{c.paths.lead}</p>
          </header>
          <ul className={explain.pathGrid} role="list">
            {c.paths.items.map((path, index) => (
              <li key={path.key} className={explain.pathCard} data-first={index === 0}>
                <span className={explain.pathKey} aria-hidden="true">{path.key}</span>
                <h4>{path.title}</h4>
                <p className={explain.pathWho}>{path.who}</p>
                <p>{path.body}</p>
                <div className={explain.pathFoot}>
                  <span className={explain.pill}>{c.paths.status}</span>
                  {index === 0 && <span className={`${explain.pill} ${explain.pillFirst}`}>{c.paths.first}</span>}
                </div>
              </li>
            ))}
          </ul>
          <p className={styles.caption}>{c.paths.note}</p>
        </div>

        <div className={explain.keep} role="group" aria-label={c.keep.title}>
          <div className={`${explain.keepCol} ${explain.keepYours}`}>
            <h4>{c.keep.yours.title}</h4>
            <ul>{c.keep.yours.lines.map(line => <li key={line}>{line}</li>)}</ul>
          </div>
          <div className={explain.keepCol}>
            <h4>{c.keep.ours.title}</h4>
            <ul>{c.keep.ours.lines.map(line => <li key={line}>{line}</li>)}</ul>
          </div>
          <p className={explain.keepNote}>{c.keep.note}</p>
        </div>

        {profiles.length > 0 && <div className={styles.profiles}><BusinessGrid profiles={profiles} t={t} /></div>}
      </div>
    </section>
  );
}
