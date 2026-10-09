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
import explain from "./Explain.module.css";
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
              <div className={styles.artifactHead}><strong>{selected.artifact}</strong><span>0{active + 1} / 0{c.tabs.length}</span></div>
              <ul>{selected.lines.map(line => <li key={line}>{line}</li>)}</ul>
            </div>
            <p className={styles.caption}>{t.capabilities.disclaimer}</p>
          </div>
        </div>

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
