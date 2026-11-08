"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { StrategyCopy } from "@/lib/content/strategy";
import styles from "./strategy.module.css";

/** /demo · go-to-market: positioning, first customer, channels, events, alliances and the validation funnel. */
export function GoToMarket({ c }: { c: StrategyCopy["gtm"] }) {
  const [audienceId, setAudienceId] = useState(c.positioning.audiences[0]!.id);
  const [eventId, setEventId] = useState(c.events.items[0]!.id);
  const [stageId, setStageId] = useState(c.funnel.stages[0]!.id);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const audience = c.positioning.audiences.find((a) => a.id === audienceId) ?? c.positioning.audiences[0]!;
  const event = c.events.items.find((e) => e.id === eventId) ?? c.events.items[0]!;
  const stageIndex = Math.max(0, c.funnel.stages.findIndex((s) => s.id === stageId));
  const stage = c.funnel.stages[stageIndex]!;
  const last = c.funnel.stages.length - 1;

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = c.events.items.length;
    const next = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    setEventId(c.events.items[next]!.id);
    tabs.current[next]?.focus();
  };

  return (
    <section id="gtm" className={`${styles.section} ${styles.alt}`} aria-labelledby="gtm-title">
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={`${styles.eyebrow} reveal`} suppressHydrationWarning>
            <span>02</span> {c.eyebrow}
          </p>
          <h2 id="gtm-title" className="reveal" suppressHydrationWarning>{c.title}</h2>
          <p className={`${styles.lead} reveal`} suppressHydrationWarning>{c.lead}</p>
        </header>

        {/* Positioning */}
        <div className={`${styles.panel} ${styles.positioning} reveal`} suppressHydrationWarning>
          <blockquote>«{c.positioning.quote}»</blockquote>
          <div className={styles.audiences}>
            <div className={styles.toggle} role="group" aria-label={c.positioning.audiences.map((a) => a.label).join(" / ")}>
              {c.positioning.audiences.map((a) => (
                <button key={a.id} type="button" aria-pressed={a.id === audienceId} className={a.id === audienceId ? styles.toggleOn : undefined} onClick={() => setAudienceId(a.id)}>
                  {a.label}
                </button>
              ))}
            </div>
            <p key={audience.id} className={styles.tagline} aria-live="polite">{audience.line}</p>
          </div>
        </div>

        {/* First customer + channels */}
        <div className={`${styles.split} reveal`} suppressHydrationWarning>
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>{c.icp.title}</h3>
            <ul className={styles.checks}>
              {c.icp.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>{c.channels.title}</h3>
            <ol className={styles.steps}>
              {c.channels.items.map((item, i) => (
                <li key={item.title} style={{ transitionDelay: `${i * 90}ms` }}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <div><strong>{item.title}</strong><small>{item.text}</small></div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Events (tabs) + alliances */}
        <div className={`${styles.split} reveal`} suppressHydrationWarning>
          <div className={styles.panel}>
            <h3 className={styles.panelTitle} id="gtm-events">{c.events.title}</h3>
            <div className={styles.tabs} role="tablist" aria-labelledby="gtm-events">
              {c.events.items.map((item, i) => (
                <button
                  key={item.id}
                  ref={(el) => { tabs.current[i] = el; }}
                  id={`gtm-tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={item.id === eventId}
                  aria-controls="gtm-event-panel"
                  tabIndex={item.id === eventId ? 0 : -1}
                  className={item.id === eventId ? styles.tabOn : undefined}
                  onClick={() => setEventId(item.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div id="gtm-event-panel" key={event.id} role="tabpanel" aria-labelledby={`gtm-tab-${event.id}`} className={styles.eventPanel}>
              <span className={styles.badge}>{event.audience}</span>
              <p>{event.goal}</p>
              <p className={styles.resolves}>→ {event.next}</p>
            </div>
          </div>
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>{c.alliances.title}</h3>
            <ul className={styles.alliances}>
              {c.alliances.items.map((item) => (
                <li key={item.partner}>
                  <span>{item.partner}</span>
                  <i aria-hidden="true" />
                  <strong>{item.reaches}</strong>
                </li>
              ))}
            </ul>
            <p className={styles.note}>{c.alliances.text}</p>
          </div>
        </div>

        {/* Funnel */}
        <div className={`${styles.panel} reveal`} suppressHydrationWarning>
          <h3 className={styles.panelTitle}>{c.funnel.title}</h3>
          <p className={styles.panelLead}>{c.funnel.lead}</p>
          <div className={styles.funnel}>
            <ol className={styles.funnelBars}>
              {c.funnel.stages.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-pressed={s.id === stageId}
                    className={`${styles.funnelBar} ${s.id === stageId ? styles.funnelOn : ""} ${i <= stageIndex ? styles.funnelPast : ""}`}
                    style={{ width: `${100 - (i / last) * 58}%`, transitionDelay: `${i * 60}ms` }}
                    onClick={() => setStageId(s.id)}
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span> {s.label}
                  </button>
                </li>
              ))}
            </ol>
            <div key={stage.id} className={styles.funnelDetail} aria-live="polite">
              <span className={styles.badge}>{String(stageIndex + 1).padStart(2, "0")} · {stage.label}</span>
              <p className={styles.question}>{stage.question}</p>
              <p className={styles.resolves}>{stage.evidence}</p>
              <div className={styles.funnelNav}>
                <button type="button" disabled={stageIndex === 0} onClick={() => setStageId(c.funnel.stages[stageIndex - 1]!.id)} aria-label={c.funnel.prev}>←</button>
                <button type="button" disabled={stageIndex === last} onClick={() => setStageId(c.funnel.stages[stageIndex + 1]!.id)} aria-label={c.funnel.next}>→</button>
              </div>
            </div>
          </div>
          <p className={styles.rule}>{c.funnel.rule}</p>
        </div>
      </div>
    </section>
  );
}
