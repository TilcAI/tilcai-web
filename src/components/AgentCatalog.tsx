"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { agents, integrationStages, type AgentClient, type AgentSurface } from "@/lib/content/agents";
import { terminalScene } from "@/lib/content/terminal-scene";
import { demoScenarios } from "@/lib/demo/scenarios";
import type { Copy } from "@/lib/i18n";
import { AgentArt, AgentBadge } from "./AgentArt";
import { AgentGuidePanel } from "./AgentGuidePanel";
import { Icon } from "./Icon";
import "@/app/agents.css";
import styles from "./AgentCatalog.module.css";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const SURFACES: readonly AgentSurface[] = ["terminal", "editor", "desktop"];
const SURFACE_ACCENT: Record<AgentSurface, string> = { terminal: "#a994ff", editor: "#57d2f9", desktop: "#ffa801" };
/** A client's colour follows its mascot when it has one, and its surface otherwise. */
const accentOf = (agent: AgentClient) => (agent.asset?.accent === "warm" ? "#ffa801" : SURFACE_ACCENT[agent.surface]);
const tint = (agent: AgentClient) => ({ "--accent": accentOf(agent) }) as CSSProperties;

export function AgentCatalog({ t }: { t: Copy }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(agents[0].slug);
  const [guideSlug, setGuideSlug] = useState<string | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const tabs = useRef(new Map<string, HTMLButtonElement>());
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  const groups = useMemo(() => {
    const visible = agents.filter((agent) => expanded || agent.group === "primary");
    return SURFACES.map((surface) => ({ surface, items: visible.filter((agent) => agent.surface === surface) }))
      .filter((group) => group.items.length > 0);
  }, [expanded]);
  const flat = useMemo(() => groups.flatMap((group) => group.items), [groups]);
  // Collapsing the list while an extra client is selected falls back to the first one.
  const current = flat.find((agent) => agent.slug === selectedSlug) ?? flat[0];
  const guide = agents.find((agent) => agent.slug === guideSlug);
  const stages = integrationStages(current);
  const doneCount = stages.filter((stage) => stage.done).length;
  const s = t.agents.stages;
  // The illustrative session of the terminal clients plays the cinema case of the simulation below it.
  const cinema = demoScenarios[0];
  const scene = useMemo(
    () => terminalScene(t.locale, t.demo.scenarios.cinema.request, `${cinema.quote.amount} ${cinema.quote.currency}`),
    [t.locale, t.demo.scenarios.cinema.request, cinema.quote.amount, cinema.quote.currency],
  );

  // The plate that slides behind the selected client. Rows have a fixed height, so only its offset is measured.
  useIsoLayoutEffect(() => {
    const element = list.current;
    if (!element) return;
    const place = () => {
      const tab = tabs.current.get(current.slug);
      if (!tab || tab.offsetParent !== element) return;
      element.style.setProperty("--plate-y", `${tab.offsetTop}px`);
      element.dataset.plate = "on";
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(element);
    return () => observer.disconnect();
  }, [current.slug, expanded]);

  const select = (slug: string, focus = false) => {
    setSelectedSlug(slug);
    if (focus) tabs.current.get(slug)?.focus();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const forward = event.key === "ArrowDown" || event.key === "ArrowRight";
    const backward = event.key === "ArrowUp" || event.key === "ArrowLeft";
    if (!forward && !backward && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const index = flat.findIndex((agent) => agent.slug === current.slug);
    const next = event.key === "Home" ? 0 : event.key === "End" ? flat.length - 1
      : (index + (forward ? 1 : -1) + flat.length) % flat.length;
    select(flat[next].slug, true);
  };
  const openGuide = (slug: string, trigger: HTMLButtonElement) => {
    lastTrigger.current = trigger;
    setGuideSlug(slug);
  };

  return (
    <section id="agents" className={`section section-alt ${styles.root}`} aria-labelledby="agents-title">
      <div className={styles.inner}>
        <header className={styles.intro}>
          <div>
            <p className="eyebrow">{t.agents.eyebrow}</p>
            <h2 id="agents-title">{t.agents.title}</h2>
            <p className={styles.lead}>{t.agents.lead}</p>
          </div>
          <p className={styles.permission}><Icon name="shield" /><span>{t.agents.permissionNote}</span></p>
        </header>

        <div className={`${styles.layout} reveal`}>
          <div className={styles.picker}>
            <div ref={list} className={styles.list} role="tablist" id="agent-tablist" aria-orientation="vertical"
              aria-label={t.agents.carousel.label} data-expanded={expanded ? "" : undefined} onKeyDown={onKeyDown} style={tint(current)}>
              <span className={styles.plate} aria-hidden="true" />
              {groups.map((group) => (
                <div key={group.surface} role="presentation" className={styles.group}>
                  <p className={styles.groupLabel} aria-hidden="true">{t.agents.surfaceLabels[group.surface]}</p>
                  {group.items.map((agent, index) => {
                    const isCurrent = agent.slug === current.slug;
                    return (
                      <button key={agent.slug} type="button" role="tab" id={`agent-tab-${agent.slug}`}
                        ref={(element) => { if (element) tabs.current.set(agent.slug, element); else tabs.current.delete(agent.slug); }}
                        className={styles.tab} style={{ ...tint(agent), "--i": index } as CSSProperties}
                        aria-selected={isCurrent} aria-controls="agent-stage" tabIndex={isCurrent ? 0 : -1}
                        onClick={() => select(agent.slug)}>
                        <AgentBadge agent={agent} />
                        <span className={styles.tabText}>
                          <span className={styles.tabName}>{agent.name}</span>
                          <span className={styles.tabSub}>{agent.surfaceDetail[t.locale]}</span>
                        </span>
                        <span className={styles.dot} data-status={agent.status} aria-hidden="true" />
                        <span className="sr-only">{t.integrationLabels[agent.status]}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <button type="button" className={`btn btn-ghost ${styles.more}`} aria-expanded={expanded} aria-controls="agent-tablist"
              onClick={() => setExpanded(!expanded)}>
              {expanded ? t.agents.fewer : t.agents.more}
              <Icon name={expanded ? "minus" : "plus"} />
            </button>
          </div>

          <div className={styles.panel} role="tabpanel" id="agent-stage" aria-labelledby={`agent-tab-${current.slug}`}>
            <article key={current.slug} className={styles.card} style={tint(current)} aria-labelledby={`agent-name-${current.slug}`}>
              <AgentArt agent={current} scene={scene} />
              <div className={styles.body}>
                <div className={styles.identity}>
                  <div className={styles.meta}>
                    <span className={styles.surfaceLabel}>{t.agents.surfaceLabels[current.surface]}</span>
                    <span className={`tag integration-${current.status}`}>{t.integrationLabels[current.status]}</span>
                  </div>
                  <h3 id={`agent-name-${current.slug}`}>{current.name}</h3>
                  <p className={styles.surfaceDetail}>{current.surfaceDetail[t.locale]}</p>
                  <p className={styles.summary}>{current.summary[t.locale]}</p>
                  <div className={styles.actions}>
                    <button type="button" className="btn btn-primary" aria-haspopup="dialog"
                      aria-expanded={guideSlug === current.slug} aria-controls={guideSlug === current.slug ? "agent-guide" : undefined}
                      onClick={(event) => openGuide(current.slug, event.currentTarget)}>
                      {t.agents.guide}<Icon name="arrow" />
                    </button>
                    <a className="btn btn-ghost" href={current.officialDocs} target="_blank" rel="noopener noreferrer">
                      {t.agents.panel.officialDocs}<Icon name="upright" />
                    </a>
                  </div>
                </div>

                <section className={styles.stages} aria-labelledby="agent-stages-title">
                  <header>
                    <h4 id="agent-stages-title">{s.title}</h4>
                    <span className={styles.progress} role="img"
                      aria-label={s.progress.replace("{done}", String(doneCount)).replace("{total}", String(stages.length))}>
                      {stages.map((stage) => <i key={stage.key} data-on={stage.done ? "" : undefined} />)}
                    </span>
                  </header>
                  <ol>
                    {stages.map((stage, index) => {
                      const item = s.items[stage.key];
                      return (
                        <li key={stage.key} data-done={stage.done ? "" : undefined} style={{ "--i": index } as CSSProperties}>
                          <span className={styles.mark} aria-hidden="true">{stage.done && <Icon name="check" />}</span>
                          <span className={styles.stageLabel}>{item.label}</span>
                          <span className={styles.stageState}>{stage.done ? item.done : item.pending}</span>
                        </li>
                      );
                    })}
                  </ol>
                  <p className={styles.checked}>
                    {s.checkedOn} <time dateTime={current.docsCheckedAt}>{current.docsCheckedAt}</time>
                  </p>
                </section>
              </div>
            </article>
          </div>
        </div>

        <footer className={styles.footer}>
          <noscript><ul className="agent-static-links" role="list">{agents.map((agent) =>
            <li key={agent.slug}><a href={agent.officialDocs} target="_blank" rel="noopener noreferrer">{agent.name} · {t.agents.panel.officialDocs}</a></li>
          )}</ul></noscript>
          <p className="disclaimer">{t.agents.thirdPartyNote}</p>
        </footer>
      </div>
      {guide && <AgentGuidePanel key={guide.slug} agent={guide} t={t} onClose={() => setGuideSlug(null)} returnFocus={lastTrigger.current} />}
    </section>
  );
}
