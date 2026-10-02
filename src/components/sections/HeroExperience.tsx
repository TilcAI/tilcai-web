"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Copy } from "@/lib/i18n";
import { paths } from "@/lib/site";
import { Icon } from "../Icon";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroScene, type HeroStep } from "./HeroScene";
import { useHeroAnimation } from "./useHeroAnimation";

function AnimatedLine({ text, accent = false }: { text: string; accent?: boolean }) {
  const words = text.split(" ");
  return (
    <span className={`hero-title-line${accent ? " is-accent" : ""}`} aria-hidden="true">
      {words.map((word, index) => (
        <span className="hero-word" key={index}>
          {Array.from(word).map((letter, i) => <span className="hero-letter" key={i}>{letter}</span>)}
          {index < words.length - 1 && <span className="hero-word-space"> </span>}
        </span>
      ))}
    </span>
  );
}

export function HeroExperience({ t }: { t: Copy }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<HeroStep>("buyer");
  const [paused, setPaused] = useState(false);
  const h = t.hero;
  useHeroAnimation(root, paused);
  const details = {
    buyer: { label: h.visual.person, text: h.scene.buyer.message },
    business: { label: h.visual.business, text: h.scene.business.availability },
    control: { label: h.visual.document, text: h.scene.core.detail },
  };

  return (
    <section ref={root} className="brand-hero" aria-labelledby="hero-title">
      <div className="hero-ambient" aria-hidden="true" />
      <HeroBackdrop eventSource={root} paused={paused} />
      <HeroScene t={t} active={active} onSelect={setActive} />

      <div className="brand-hero-content">
        <div className="brand-hero-copy">
          <h1 id="hero-title" className="brand-hero-title" aria-label={`${h.titleTop}. ${h.titleBottom}.`}>
            <AnimatedLine text={h.titleTop} />
            <AnimatedLine text={h.titleBottom} accent />
          </h1>
          <p className="brand-hero-lead" data-hero-reveal>{h.lead}</p>
          <div className="brand-hero-actions" data-hero-reveal>
            <a className="brand-hero-primary" href="#simulation">{h.ctaPrimary}<span aria-hidden="true">↗</span></a>
            <Link className="brand-hero-secondary" href={paths.docs(t.locale)}>{h.visual.docs}</Link>
          </div>
          <p id="hero-scene-detail" className="hero-scene-detail" role="status" aria-live="polite" data-hero-reveal>
            <span className="hero-detail-dot" aria-hidden="true" />
            <span><strong>{details[active].label}</strong><span className="hero-detail-divider" aria-hidden="true"> / </span>{details[active].text}</span>
          </p>
        </div>
      </div>

      <div className="hero-bottom-controls">
        <a className="hero-scroll-cue" href="#simulation"><span aria-hidden="true">↓</span>{h.visual.scroll}</a>
        <button className="hero-motion-control" type="button" onClick={() => setPaused((value) => !value)}
          aria-pressed={paused} aria-label={paused ? h.visual.resume : h.visual.pause} title={paused ? h.visual.resume : h.visual.pause}>
          <Icon name={paused ? "play" : "pause"} /><span>{paused ? h.visual.resume : h.visual.pause}</span>
        </button>
      </div>
    </section>
  );
}
