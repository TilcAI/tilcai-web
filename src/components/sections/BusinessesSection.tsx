"use client";

import { useState } from "react";
import Link from "next/link";
import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { businesses, publicBusinesses } from "@/lib/content/businesses";
import { BusinessGrid } from "../BusinessGrid";
import { Icon } from "../Icon";
import { CommerceIllustration } from "./CommerceIllustration";
import styles from "./Narrative.module.css";
import "@/app/businesses.css";

export function BusinessesSection({ t }: { t: Copy }) {
  const [active, setActive] = useState(0);
  const c = narrative(t.locale).business;
  const selected = c.tabs[active];
  const profiles = publicBusinesses(businesses);
  return (
    <section id="businesses" className={styles.section} aria-labelledby="businesses-title">
      <div className={styles.inner}>
        <div className={styles.split}>
          <div>
            <p className={styles.eyebrow}>{t.businesses.eyebrow}</p>
            <h2 id="businesses-title" className={styles.heading}>{c.title}</h2>
            <p className={styles.lead}>{c.lead}</p>
            <div id="capabilities" className={styles.selectors} role="group" aria-label={t.capabilities.eyebrow}>
              {c.tabs.map((tab, index) => <button key={tab.title} type="button" aria-pressed={active === index} aria-controls="business-capability" onClick={() => setActive(index)}>
                <span>0{index + 1}</span>{tab.title}
              </button>)}
            </div>
            <p id="business-capability" className={styles.description} aria-live="polite">{selected.body}</p>
            <div className={styles.actions}>
              <Link className="btn btn-primary" href={`/${t.locale}/docs#business`}>{c.pilot}<Icon name="arrow" /></Link>
              <span className={styles.status}>{c.status}</span>
            </div>
          </div>
          <div className={styles.art}>
            <p className={styles.artLabel}>{c.label}</p>
            <CommerceIllustration id="business-art" active={active} />
            <div className={styles.artifact}>
              <div className={styles.artifactHead}><strong>{selected.artifact}</strong><span>0{active + 1} / 03</span></div>
              <ul>{selected.lines.map(line => <li key={line}>{line}</li>)}</ul>
            </div>
            <p className={styles.caption}>{t.capabilities.disclaimer}</p>
          </div>
        </div>
        {profiles.length > 0 && <div className={styles.profiles}><BusinessGrid profiles={profiles} t={t} /></div>}
      </div>
    </section>
  );
}
