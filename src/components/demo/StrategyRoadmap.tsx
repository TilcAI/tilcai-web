"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { DeliverableId, StrategyCopy } from "@/lib/content/strategy";
import { LiquiditySim } from "./LiquiditySim";
import styles from "./strategy.module.css";

const STEP_MS = 4200;
const DAYS = 30;

/** /demo · roadmap: starting point, deliverables with dependencies, the 30-day sprint, later phases and liquidity. */
export function StrategyRoadmap({ c }: { c: StrategyCopy["roadmap"] }) {
  const periods = c.sprint.periods;
  const [periodIndex, setPeriodIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [focus, setFocus] = useState<DeliverableId | null>(null);
  const sprintRef = useRef<HTMLDivElement>(null);
  const autoStarted = useRef(false);

  // Start playing the first time the sprint scrolls into view (never with reduced motion).
  useEffect(() => {
    const el = sprintRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && !autoStarted.current) {
        autoStarted.current = true;
        setPlaying(true);
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setPeriodIndex((i) => (i + 1) % periods.length), STEP_MS);
    return () => window.clearInterval(id);
  }, [playing, periods.length]);

  const period = periods[periodIndex]!;
  const choose = (i: number) => {
    setPlaying(false);
    setPeriodIndex(i);
  };
  const focused = c.deliverables.items.find((d) => d.id === focus);
  const related = (id: DeliverableId) => !focused || focused.id === id || focused.dependsOn.includes(id);

  return (
    <section id="roadmap" className={styles.section} aria-labelledby="roadmap-title">
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={`${styles.eyebrow} reveal`} suppressHydrationWarning>
            <span>03</span> {c.eyebrow}
          </p>
          <h2 id="roadmap-title" className="reveal" suppressHydrationWarning>{c.title}</h2>
          <p className={`${styles.lead} reveal`} suppressHydrationWarning>{c.lead}</p>
        </header>

        {/* Starting point */}
        <h3 className={`${styles.subTitle} reveal`} suppressHydrationWarning>{c.base.title}</h3>
        <ul className={styles.base}>
          {c.base.items.map((item, i) => (
            <li key={item.label} className="reveal" suppressHydrationWarning style={{ transitionDelay: `${i * 70}ms` }}>
              <span className={styles.badge}>{item.label}</span>
              <p>{item.text}</p>
              {item.href && <a href={item.href} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
            </li>
          ))}
        </ul>

        {/* Deliverables */}
        <div className={`${styles.panel} reveal`} suppressHydrationWarning>
          <h3 className={styles.panelTitle}>{c.deliverables.title}</h3>
          <ol className={styles.deliverables} onMouseLeave={() => setFocus(null)}>
            {c.deliverables.items.map((d, i) => (
              <li
                key={d.id}
                tabIndex={0}
                className={`${styles.deliverable} ${related(d.id) ? "" : styles.dim} ${focus === d.id ? styles.deliverableOn : ""} ${period.deliverables.includes(d.id) ? styles.deliverableLive : ""}`}
                onMouseEnter={() => setFocus(d.id)}
                onFocus={() => setFocus(d.id)}
                onBlur={() => setFocus(null)}
              >
                <span className={styles.deliverableId}>{d.id}</span>
                <strong>{d.title}</strong>
                <small>{d.text}</small>
                {d.dependsOn.length > 0 && <span className={styles.depends}>{c.deliverables.dependsLabel}: {d.dependsOn.join(" + ")}</span>}
                {i < c.deliverables.items.length - 1 && <span className={styles.arrow} aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </div>

        {/* 30-day sprint */}
        <div ref={sprintRef} className={`${styles.panel} reveal`} suppressHydrationWarning>
          <div className={styles.sprintHead}>
            <h3 className={styles.panelTitle}>{c.sprint.title}</h3>
            <button type="button" className={styles.ghost} onClick={() => setPlaying((p) => !p)} aria-pressed={playing}>
              {playing ? `❚❚ ${c.sprint.pause}` : `▶ ${c.sprint.play}`}
            </button>
          </div>
          <div className={styles.track} role="group" aria-label={c.sprint.title}>
            {periods.map((p, i) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={i === periodIndex}
                className={`${styles.trackSeg} ${i === periodIndex ? styles.trackOn : ""} ${i < periodIndex ? styles.trackDone : ""}`}
                style={{ flexGrow: p.to - p.from + 1 }}
                onClick={() => choose(i)}
              >
                <span>{p.label}</span>
                <small>{c.sprint.dayLabel} {p.from}–{p.to}</small>
                {i === periodIndex && playing && <i key={`${p.id}-${periodIndex}`} className={styles.trackProgress} style={{ animationDuration: `${STEP_MS}ms` }} />}
              </button>
            ))}
          </div>
          <div className={styles.ticks} aria-hidden="true">
            {Array.from({ length: DAYS }, (_, d) => (
              <span key={d} className={d + 1 >= period.from && d + 1 <= period.to ? styles.tickOn : undefined} />
            ))}
          </div>
          <div key={period.id} className={styles.periodDetail} aria-live="polite">
            <div>
              <span className={styles.badge}>{c.sprint.workLabel}</span>
              <p>{period.work}</p>
            </div>
            <div>
              <span className={styles.badge}>{c.sprint.evidenceLabel}</span>
              <p>{period.evidence}</p>
              <p className={styles.dChips}>
                {c.deliverables.items.map((d) => (
                  <span key={d.id} className={period.deliverables.includes(d.id) ? styles.dChipOn : undefined}>{d.id}</span>
                ))}
              </p>
            </div>
          </div>
          <div className={styles.exit}>
            <strong>{c.sprint.exit.title}</strong>
            <p>{c.sprint.exit.text}</p>
          </div>
        </div>

        {/* Later phases */}
        <h3 className={`${styles.subTitle} reveal`} suppressHydrationWarning>{c.phases.title}</h3>
        <ol className={styles.phases}>
          {c.phases.items.map((phase, i) => (
            <li key={phase.title} className="reveal" suppressHydrationWarning style={{ transitionDelay: `${i * 90}ms`, "--step": i } as CSSProperties}>
              <span className={styles.phaseNum}>{String(i + 1).padStart(2, "0")}</span>
              <strong>{phase.title}</strong>
              <p>{phase.text}</p>
              <p className={styles.condition}><b>{c.phases.conditionLabel}:</b> {phase.condition}</p>
            </li>
          ))}
        </ol>

        {/* Pre-funded liquidity */}
        <div className={`${styles.panel} ${styles.liquidity} reveal`} suppressHydrationWarning>
          <div>
            <h3 className={styles.panelTitle}>{c.liquidity.title}</h3>
            <p className={styles.panelLead}>{c.liquidity.lead}</p>
            <ol className={styles.steps}>
              {c.liquidity.steps.map((s, i) => (
                <li key={s.title}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <div><strong>{s.title}</strong><small>{s.text}</small></div>
                </li>
              ))}
            </ol>
          </div>
          <LiquiditySim c={c.liquidity.sim} />
        </div>
      </div>
    </section>
  );
}
