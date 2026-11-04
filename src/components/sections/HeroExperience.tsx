"use client";

import { useRef } from "react";
import localFont from "next/font/local";
import type { Copy } from "@/lib/i18n";
import { Icon, type IconName } from "../Icon";
import { HeroScene } from "./HeroScene";
import { useHeroAnimation } from "./useHeroAnimation";

/** Same marks as the tech band below: a mark per piece, not its logo. */
const TECH_MARKS: Record<string, IconName> = { Soroban: "layers", x402: "bolt", CCTP: "route" };
const TECH_ORDER = ["Stellar", "x402", "Soroban", "CCTP"];
const heroSans = localFont({
  src: [
    { path: "../../fonts/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../fonts/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
  ],
  display: "swap",
});

function HeroStellarMark() {
  return (
    <svg className="hero-tech-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="16" cy="16" r="12.5" />
      <path d="M3 19.5 29 9M3 25 29 14.5" />
    </svg>
  );
}

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
      {accent && <span className="hero-title-spark"><i /><i /><i /></span>}
    </span>
  );
}

export function HeroExperience({ t }: { t: Copy }) {
  const root = useRef<HTMLElement>(null);
  const h = t.hero;
  useHeroAnimation(root, false);
  const tech = TECH_ORDER.map((name) => t.stack.badges.find((badge) => badge.name === name)).filter(
    (badge): badge is NonNullable<typeof badge> => !!badge,
  );

  return (
    <section ref={root} className="brand-hero" aria-labelledby="hero-title">
      <div className="hero-ambient" aria-hidden="true" />
      <HeroScene />

      <svg className="hero-wave" viewBox="0 0 1600 150" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="hero-wave-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1c1035" />
            <stop offset="1" stopColor="#0d0a1c" />
          </linearGradient>
          <pattern id="hero-wave-dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.3" fill="#ffffff26" />
          </pattern>
        </defs>
        <path d="M0 60 C250 125,450 5,750 65 S1250 130,1600 55 L1600 150 L0 150 Z" fill="url(#hero-wave-fill)" />
        <path d="M0 60 C250 125,450 5,750 65 S1250 130,1600 55 L1600 150 L0 150 Z" fill="url(#hero-wave-dots)" />
        <path d="M0 60 C250 125,450 5,750 65 S1250 130,1600 55" fill="none" stroke="#9c6bff" strokeOpacity=".7" strokeWidth="2.5" />
      </svg>

      <div className="brand-hero-content">
        <div className={`brand-hero-copy ${heroSans.className}`}>
          <span className="hero-badge-pill" data-hero-reveal><Icon name="layers" className="hero-badge-icon" />{h.badge}</span>
          <h1 id="hero-title" className="brand-hero-title" aria-label={h.title}>
            <AnimatedLine text={h.titleTop} />
            <AnimatedLine text={h.titleBottom} accent />
          </h1>
          <p className="brand-hero-lead" data-hero-reveal>{h.lead}</p>
          <div className="brand-hero-actions" data-hero-reveal>
            <a className="brand-hero-primary" href="#simulation">{h.ctaPrimary}<span aria-hidden="true">↗</span></a>
            <a className="brand-hero-secondary" href="#flow"><Icon name="play" />{h.ctaSecondary}</a>
          </div>
          <ul className="hero-tech-row" data-hero-reveal aria-label={t.stack.eyebrow}>
            {tech.map((badge) => (
              <li key={badge.name} className="hero-tech-item">
                {badge.name === "Stellar" ? <HeroStellarMark /> : <Icon name={TECH_MARKS[badge.name] ?? "layers"} />}
                <span>{badge.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hero-bottom-controls">
        <a className="hero-scroll-cue" href="#simulation"><span aria-hidden="true">↓</span>{h.visual.scroll}</a>
      </div>
    </section>
  );
}
