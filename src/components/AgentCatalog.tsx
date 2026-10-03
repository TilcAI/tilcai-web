"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { agents } from "@/lib/content/agents";
import type { Copy } from "@/lib/i18n";
import { AgentCard } from "./AgentCard";
import { AgentGuidePanel } from "./AgentGuidePanel";
import { Icon } from "./Icon";
import "@/app/agents.css";
import styles from "./AgentStory.module.css";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function AgentCatalog({ t }: { t: Copy }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const selected = agents.find((agent) => agent.slug === selectedSlug);
  const entries = agents.filter((agent) => expanded || agent.group === "primary");
  const activeIndex = Math.min(active, entries.length - 1);
  const activeAgent = entries[activeIndex];

  useIsoLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      stepRefs.current.slice(0, entries.length).forEach((step, index) => {
        if (!step) return;
        ScrollTrigger.create({
          trigger: step,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => setActive(index),
          onEnterBack: () => setActive(index),
        });
      });
    }, section);
    ScrollTrigger.refresh();
    return () => context.revert();
  }, [expanded, entries.length]);

  const jumpTo = (index: number) => {
    stepRefs.current[index]?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "center",
    });
  };
  const openGuide = (slug: string, trigger: HTMLButtonElement) => {
    lastTrigger.current = trigger;
    setSelectedSlug(slug);
  };

  return (
    <section ref={root} id="agents" className={`section section-alt ${styles.root}`} aria-labelledby="agents-title">
      <header className={styles.intro}>
        <p className="eyebrow">{t.agents.eyebrow}</p>
        <h2 id="agents-title">{t.agents.title}</h2>
        <p>{t.agents.lead}</p>
      </header>

      <div className={styles.story}>
        <div className={styles.visual}>
          <div className={styles.stage}>
            <div className={styles.stageTop}>
              <span>{t.agents.eyebrow}</span>
              <span>{String(activeIndex + 1).padStart(2, "0")} / {String(entries.length).padStart(2, "0")}</span>
            </div>
            <div className={styles.featured} key={activeAgent.slug}>
              <AgentCard agent={activeAgent} t={t} selected={activeAgent.slug === selectedSlug}
                onSelect={(trigger) => openGuide(activeAgent.slug, trigger)} />
            </div>
            <div className={styles.chapterNav} aria-label={t.agents.carousel.label}>
              {entries.map((agent, index) => (
                <button key={agent.slug} type="button" className={activeIndex === index ? styles.current : ""}
                  aria-label={`${t.agents.carousel.label}: ${agent.name}`}
                  aria-current={activeIndex === index ? "step" : undefined}
                  onClick={() => jumpTo(index)}>{String(index + 1).padStart(2, "0")}</button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <ol id="agent-story-steps" className={styles.steps} aria-label={t.agents.carousel.label}>
            {entries.map((agent, index) => (
              <li key={agent.slug} ref={(element) => { stepRefs.current[index] = element; }}
                className={`${styles.step}${activeIndex === index ? ` ${styles.stepActive}` : ""}`}
                style={{ "--agent-accent": agent.asset?.accent === "warm" ? "#ffa801" : "#a994ff" } as CSSProperties}>
                <article className={styles.detail} aria-labelledby={`agent-step-${agent.slug}`}>
                  <div className={styles.detailTop}>
                    <span className={styles.surface}>{t.agents.surfaceLabels[agent.surface]}</span>
                    <span className={styles.index}>{String(index + 1).padStart(2, "0")} / {String(entries.length).padStart(2, "0")}</span>
                  </div>
                  <h3 id={`agent-step-${agent.slug}`}>{agent.name}</h3>
                  <p className={styles.surfaceDetail}>{agent.surfaceDetail[t.locale]}</p>
                  <p className={styles.summary}>{agent.summary[t.locale]}</p>
                  <p className={styles.requirement}><span>{t.agents.panel.requirements}</span>{agent.prerequisite[t.locale]}</p>
                  <div className={styles.detailBottom}>
                    <span className={`tag integration-${agent.status}`}>{t.integrationLabels[agent.status]}</span>
                    <button type="button" onClick={(event) => openGuide(agent.slug, event.currentTarget)}
                      aria-haspopup="dialog" aria-expanded={selectedSlug === agent.slug}>
                      {t.agents.guide}<Icon name="arrow" />
                    </button>
                  </div>
                  <span className={styles.progress} aria-hidden="true"><i style={{ width: `${(index + 1) / entries.length * 100}%` }} /></span>
                </article>
              </li>
            ))}
          </ol>
          <button type="button" className={`btn btn-ghost ${styles.more}`} aria-expanded={expanded} aria-controls="agent-story-steps"
            onClick={() => setExpanded(!expanded)}>
            {expanded ? t.agents.fewer : t.agents.more}<Icon name="arrow" />
          </button>
        </div>
      </div>

      <div className={styles.footer}>
        <p className="agent-permission"><Icon name="shield" />{t.agents.permissionNote}</p>
        <noscript><ul className="agent-static-links" role="list">{agents.map((agent) =>
          <li key={agent.slug}><a href={agent.officialDocs} target="_blank" rel="noopener noreferrer">{agent.name} · {t.agents.panel.officialDocs}</a></li>
        )}</ul></noscript>
        <p className="disclaimer">{t.agents.thirdPartyNote}</p>
      </div>
      {selected && <AgentGuidePanel key={selected.slug} agent={selected} t={t} onClose={() => setSelectedSlug(null)} returnFocus={lastTrigger.current} />}
    </section>
  );
}
