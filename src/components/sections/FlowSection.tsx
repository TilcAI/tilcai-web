"use client";

import { useScrollStep } from "../useScrollStep";
import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { CommerceIllustration } from "./CommerceIllustration";
import styles from "./Narrative.module.css";

/**
 * One operation told in order: request, offer, rules, approval, payment, two receipts. Each card names who acts and
 * the state it leaves the order in. The states are part of an illustrative journey (the label says so); nothing here
 * moves because an animation says it did: the active card only follows the scroll position.
 */
export function FlowSection({ t }: { t: Copy }) {
  const c = narrative(t.locale).flow;
  const { list, active } = useScrollStep<HTMLOListElement>();
  const total = `0${c.steps.length}`;

  return (
    <section id="flow" className={styles.journey} aria-labelledby="flow-title">
      <div className={`${styles.inner} ${styles.journeyGrid}`}>
        <div className={styles.sticky}>
          <p className={styles.eyebrow}>{t.nav.flow}</p>
          <h2 id="flow-title" className={styles.heading}>{c.title}</h2>
          <p className={styles.lead}>{c.lead}</p>
          <div className={styles.journeyScene}>
            <CommerceIllustration id="journey-art" active={active} />
            <div className={styles.sceneLabels}><span>{c.agent}</span><span>{c.business}</span></div>
          </div>
          <nav className={styles.progress} aria-label={t.flow.eyebrow}>
            {c.steps.map((step, index) => <a key={step.title} href={`#purchase-step-${index}`} aria-current={active === index ? "step" : undefined} aria-label={`${index + 1}. ${step.title}`}>0{index + 1}</a>)}
          </nav>
          <p className={styles.caption}>{c.label}</p>
        </div>
        <ol ref={list} className={styles.steps}>
          {c.steps.map((step, index) => <li id={`purchase-step-${index}`} className={styles.step} data-active={index === active} key={step.title}>
            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>0{index + 1} / {total}<span className={styles.stepActor}> · {c.actor}: {step.actor}</span></span>
              <h3>{step.title}</h3><p>{step.body}</p>
              <div className={styles.artifact}>
                <div className={styles.artifactHead}><strong>{step.artifact}</strong><span>{c.state}: {step.state}</span></div>
                <ul>{step.lines.map(line => <li key={line}>{line}</li>)}</ul>
              </div>
              <p className={styles.detail}>{step.detail}</p>
            </div>
          </li>)}
        </ol>
      </div>
    </section>
  );
}
