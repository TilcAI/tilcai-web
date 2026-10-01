"use client";

import { useEffect, useRef, useState } from "react";
import { agents } from "@/lib/content/agents";
import type { Copy } from "@/lib/i18n";
import { AgentCard } from "./AgentCard";
import { AgentGuidePanel } from "./AgentGuidePanel";
import { Icon } from "./Icon";
import "@/app/agents.css";

export function AgentCatalog({ t }: { t: Copy }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const track = useRef<HTMLUListElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const selected = agents.find((agent) => agent.slug === selectedSlug);
  const entries = agents.filter((agent) => expanded || agent.group === "primary");

  useEffect(() => {
    const rail = track.current;
    if (!rail) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!rail.dataset.initialized) {
      const initial = rail.children.item(rail.clientWidth > 700 ? 1 : 0) as HTMLLIElement | null;
      if (initial) rail.scrollLeft = initial.offsetLeft - (rail.clientWidth - initial.offsetWidth) / 2;
      rail.dataset.initialized = "true";
    }
    let frame = 0;
    const paint = () => {
      frame = 0;
      const center = rail.scrollLeft + rail.clientWidth / 2;
      const slides = Array.from(rail.children) as HTMLLIElement[];
      let nearest = 0;
      let distance = Infinity;
      slides.forEach((slide, index) => {
        const delta = slide.offsetLeft + slide.offsetWidth / 2 - center;
        if (Math.abs(delta) < distance) { nearest = index; distance = Math.abs(delta); }
        const depth = reduced.matches ? 0 : Math.max(-1, Math.min(1, delta / rail.clientWidth));
        slide.style.setProperty("--card-depth", depth.toFixed(3));
      });
      setActive(nearest);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const observer = new ResizeObserver(schedule);
    observer.observe(rail);
    rail.addEventListener("scroll", schedule, { passive: true });
    reduced.addEventListener("change", schedule);
    paint();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      rail.removeEventListener("scroll", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, [expanded]);

  const moveTo = (index: number, focus = false) => {
    const rail = track.current;
    const slide = rail?.children.item(index) as HTMLLIElement | null;
    if (!rail || !slide) return;
    rail.scrollTo({ left: slide.offsetLeft - (rail.clientWidth - slide.offsetWidth) / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    if (focus) slide.querySelector("button")?.focus({ preventScroll: true });
  };
  const closePanel = () => {
    setSelectedSlug(null);
    // The native dialog restores focus as it leaves the top layer.
  };

  return (
    <section id="agents" className="section section-alt" aria-labelledby="agents-title">
      <div className="container">
        <div className="catalog-heading">
          <header className="section-head">
            <p className="eyebrow">{t.agents.eyebrow}</p>
            <h2 id="agents-title">{t.agents.title}</h2>
            <p className="section-lead">{t.agents.lead}</p>
          </header>
          <div className="carousel-controls">
            <button type="button" aria-label={t.agents.carousel.previous} aria-controls="agent-carousel" disabled={active === 0}
              onClick={() => moveTo(active - 1)}><Icon name="arrow" className="icon flip" /></button>
            <span aria-hidden="true">{String(active + 1).padStart(2, "0")} / {String(entries.length).padStart(2, "0")}</span>
            <button type="button" aria-label={t.agents.carousel.next} aria-controls="agent-carousel" disabled={active === entries.length - 1}
              onClick={() => moveTo(active + 1)}><Icon name="arrow" /></button>
          </div>
        </div>
        <div className="carousel-shell" role="region" aria-label={t.agents.carousel.label}>
          <ul id="agent-carousel" className="agent-carousel" role="list" ref={track}
            onKeyDown={(event) => {
              if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
              const focused = (event.target as HTMLElement).closest("li");
              const index = Array.from(track.current?.children ?? []).indexOf(focused as Element);
              if (index < 0) return;
              event.preventDefault();
              moveTo(event.key === "Home" ? 0 : event.key === "End" ? entries.length - 1 :
                Math.max(0, Math.min(entries.length - 1, index + (event.key === "ArrowRight" ? 1 : -1))), true);
            }}>
            {entries.map((agent) => (
              <li key={agent.slug}>
                <AgentCard agent={agent} t={t} selected={agent.slug === selectedSlug} onSelect={(trigger) => {
                  lastTrigger.current = trigger;
                  setSelectedSlug(agent.slug);
                }} />
              </li>
            ))}
          </ul>
        </div>
        <div className="catalog-footer">
          <p className="carousel-hint">{t.agents.carousel.hint}</p>
          <button type="button" className="btn btn-ghost" aria-expanded={expanded} aria-controls="agent-carousel"
            onClick={() => { setExpanded(!expanded); moveTo(0); }}>
            {expanded ? t.agents.fewer : t.agents.more}<Icon name="arrow" />
          </button>
        </div>
        <p className="agent-permission"><Icon name="shield" />{t.agents.permissionNote}</p>
        <noscript><ul className="agent-static-links" role="list">{agents.map((agent) =>
          <li key={agent.slug}><a href={agent.officialDocs} target="_blank" rel="noopener noreferrer">{agent.name} · {t.agents.panel.officialDocs}</a></li>
        )}</ul></noscript>
        {selected && <AgentGuidePanel key={selected.slug} agent={selected} t={t} onClose={closePanel} returnFocus={lastTrigger.current} />}
        <p className="disclaimer">{t.agents.thirdPartyNote}</p>
      </div>
    </section>
  );
}
