"use client";

import { useState } from "react";
import type { StrategyCopy } from "@/lib/content/strategy";
import { CountUp } from "./CountUp";
import styles from "./strategy.module.css";

const R = { className: "reveal", suppressHydrationWarning: true } as const;

/** /demo · business model: payment path, segments, revenue models, unit economics and market signals. */
export function BusinessModel({ c, locale }: { c: StrategyCopy["business"]; locale: string }) {
  const [segmentId, setSegmentId] = useState(c.segments.items[0]!.id);
  const [modeId, setModeId] = useState(c.revenue.modes[0]!.id);
  const segment = c.segments.items.find((s) => s.id === segmentId) ?? c.segments.items[0]!;
  const mode = c.revenue.modes.find((m) => m.id === modeId) ?? c.revenue.modes[0]!;

  return (
    <section id="modelo" className={styles.section} aria-labelledby="modelo-title">
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={`${styles.eyebrow} reveal`} suppressHydrationWarning>
            <span>01</span> {c.eyebrow}
          </p>
          <h2 id="modelo-title" {...R}>{c.title}</h2>
          <p className={`${styles.lead} reveal`} suppressHydrationWarning>{c.lead}</p>
        </header>

        {/* Payment path + segment selector */}
        <div className={`${styles.panel} reveal`} suppressHydrationWarning>
          <h3 className={styles.panelTitle}>{c.flow.label}</h3>
          <ol className={styles.flow}>
            {c.flow.nodes.map((node, i) => (
              <li key={node.id} className={`${styles.flowNode} ${segment.nodes.includes(node.id) ? styles.flowOn : ""}`}>
                <span className={styles.flowIndex}>{String(i + 1).padStart(2, "0")}</span>
                <strong>{node.title}</strong>
                <small>{node.text}</small>
                {i < c.flow.nodes.length - 1 && <span className={styles.flowLink} aria-hidden="true"><i /></span>}
              </li>
            ))}
          </ol>

          <div className={styles.segments}>
            <div>
              <h3 className={styles.panelTitle}>{c.segments.label}</h3>
              <p className={styles.hint}>{c.segments.hint}</p>
              <div className={styles.chips} role="group" aria-label={c.segments.label}>
                {c.segments.items.map((s) => (
                  <button key={s.id} type="button" aria-pressed={s.id === segmentId} className={s.id === segmentId ? styles.chipOn : styles.chip} onClick={() => setSegmentId(s.id)}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
            <div key={segment.id} className={styles.segmentCard} aria-live="polite">
              <span className={styles.badge}>{segment.role}</span>
              <p><b>{segment.name}</b> — {segment.need}</p>
              <p className={styles.resolves}>{segment.resolves}</p>
            </div>
          </div>
        </div>

        {/* What the integration delivers */}
        <h3 className={`${styles.subTitle} reveal`} suppressHydrationWarning>{c.value.title}</h3>
        <ul className={styles.valueGrid}>
          {c.value.items.map((item, i) => (
            <li key={item.title} className={`${styles.valueCard} reveal`} suppressHydrationWarning style={{ transitionDelay: `${i * 70}ms` }}>
              <span className={styles.valueDot} aria-hidden="true" />
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>

        {/* Revenue models */}
        <div className={`${styles.split} reveal`} suppressHydrationWarning>
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>{c.revenue.title}</h3>
            <p className={styles.panelLead}>{c.revenue.lead}</p>
            <div className={styles.toggle} role="group" aria-label={c.revenue.title}>
              {c.revenue.modes.map((m) => (
                <button key={m.id} type="button" aria-pressed={m.id === modeId} className={m.id === modeId ? styles.toggleOn : undefined} onClick={() => setModeId(m.id)}>
                  {m.label}
                </button>
              ))}
            </div>
            <div key={mode.id} className={styles.revenue}>
              <p className={styles.revenueSummary}>{mode.summary}</p>
              <div className={styles.bar} aria-hidden="true">
                {mode.parts.map((p, i) => (
                  <span key={p.label} style={{ flexGrow: p.weight, animationDelay: `${i * 120}ms` }} className={i ? styles.barAlt : undefined}>
                    {p.label}
                  </span>
                ))}
              </div>
              <ul className={styles.parts}>
                {mode.parts.map((p, i) => (
                  <li key={p.label}>
                    <span className={i ? styles.swatchAlt : styles.swatch} aria-hidden="true" />
                    <div><strong>{p.label}</strong><small>{p.detail}</small></div>
                  </li>
                ))}
              </ul>
            </div>
            <p className={styles.note}>{c.revenue.note}</p>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>{c.economics.title}</h3>
            <p className={styles.panelLead}>{c.economics.lead}</p>
            <ul className={styles.metrics}>
              {c.economics.items.map((item) => (
                <li key={item.name} tabIndex={0}>
                  <strong>{item.name}</strong>
                  <small>{item.measure}</small>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Market signals */}
        <div className={`${styles.panel} ${styles.signals} reveal`} suppressHydrationWarning>
          <h3 className={styles.panelTitle}>{c.signals.title}</h3>
          <p className={styles.panelLead}>{c.signals.lead}</p>
          <ul className={styles.stats}>
            {c.signals.stats.map((s) => (
              <li key={s.label}>
                <span className={styles.statValue}><CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} locale={locale} /></span>
                <p>{s.label}</p>
                <a href={s.source.href} target="_blank" rel="noopener noreferrer">{s.source.label} ↗</a>
              </li>
            ))}
          </ul>
          <ul className={styles.infra}>
            {c.signals.infra.map((s) => (
              <li key={s.label}>
                <span>{s.label}</span>
                <a href={s.source.href} target="_blank" rel="noopener noreferrer">{s.source.label} ↗</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
