import Image from "next/image";
import type { Copy } from "@/lib/i18n";
import { Icon } from "../Icon";

export type HeroStep = "buyer" | "business" | "control";

export function HeroScene({ t, active, onSelect }: { t: Copy; active: HeroStep; onSelect: (step: HeroStep) => void }) {
  const v = t.hero.visual;
  const cards = [
    { step: "buyer" as const, label: v.person, className: "hero-person" },
    { step: "business" as const, label: v.business, className: "hero-business" },
    { step: "control" as const, label: v.document, className: "hero-document" },
  ];

  return (
    <>
      <div className="hero-city hero-depth" data-depth=".4" aria-hidden="true">
        <Image src="/assets/hero-city-transparent.png" alt="" fill sizes="(max-width: 800px) 100vw, 85vw" className="hero-city-image" priority />
      </div>
      <div className="hero-scene" aria-label={t.hero.scene.label}>
        <svg className="hero-orbits" viewBox="0 0 800 640" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="hero-wire" x1="150" y1="200" x2="690" y2="500" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a75dff" /><stop offset=".5" stopColor="#66deff" /><stop offset="1" stopColor="#bf6dff" />
            </linearGradient>
          </defs>
          <path id="hero-orbit-one" className="hero-orbit-path" d="M130 220C-80 420 240 430 535 230S775-20 445 80S235 120 130 220Z" />
          <path id="hero-orbit-two" className="hero-orbit-path orbit-secondary" d="M125 505C-100 565 215 655 570 445S805 180 550 250S315 455 125 505Z" />
          <path className="hero-connection" d="M155 145L214 242L247 303L360 330M165 460L216 409L247 303M665 306L602 356L490 332M530 469L430 526L155 575" />
          <path className="hero-connection-flow" d="M155 145L214 242L247 303L360 330M165 460L216 409L247 303M665 306L602 356L490 332M530 469L430 526L155 575" />
          {[ [214,242], [247,303], [216,409], [602,356], [430,526] ].map(([cx,cy], i) => <circle key={i} className="hero-wire-node" cx={cx} cy={cy} r="4" />)}
          <circle className="hero-satellite hero-satellite-one" cx="0" cy="0" r="6" />
          <circle className="hero-satellite hero-satellite-two" cx="0" cy="0" r="7" />
        </svg>

        <div className="hero-cat hero-depth" data-depth="1.3" aria-hidden="true">
          <div className="hero-float">
            <Image src="/assets/hero-cat-transparent.png" alt="" fill priority sizes="(max-width: 800px) 65vw, 34vw" className="hero-cat-image" />
          </div>
        </div>

        {cards.map(({ step, label, className }) => (
          <div key={step} className={`hero-card-position ${className} hero-depth`} data-depth={step === "business" ? "2.2" : "1.7"}>
            <div className="hero-float">
              <button type="button" className={`hero-glass-card${active === step ? " is-active" : ""}`} onClick={() => onSelect(step)} aria-pressed={active === step} aria-controls="hero-scene-detail">
                <span className="hero-card-label">{label}</span>
                <span className="hero-card-visual" aria-hidden="true">
                  <span className={`hero-card-glyph glyph-${step}`}>
                    {step === "buyer" ? <svg viewBox="0 0 60 65"><circle cx="30" cy="17" r="14" /><path d="M5 63V54C5 28 55 28 55 54V63Z" /></svg> : <Icon name={step === "business" ? "store" : "doc"} />}
                  </span>
                  <span className="hero-card-check"><Icon name="check" /></span>
                  <span className="hero-card-lines"><i /><i /><i /></span>
                </span>
              </button>
            </div>
          </div>
        ))}

        <div className="hero-core hero-depth" data-depth="2.6">
          <a className="hero-core-link hero-float" href="#flow" aria-label={t.nav.flow}>
            <Image src="/brand/tilcai-mark-white.png" alt="TilcAI" width={76} height={76} />
          </a>
        </div>
        <div className="hero-development hero-depth" data-depth=".8">
          <a href={`/${t.locale}/docs#status`} className="hero-scene-badge hero-float"><Icon name="signal" />{v.development}</a>
        </div>
        <div className="hero-permissions hero-depth" data-depth="1.9">
          <a href="#control" className="hero-scene-badge badge-cyan hero-float"><Icon name="shield" />{t.hero.facts[1]}</a>
        </div>
        <div className="hero-terms hero-depth" data-depth="1.4">
          <a href="#control" className="hero-scene-badge hero-float"><Icon name="check" />{t.hero.facts[0]}</a>
        </div>
        {[ [8,11], [82,19], [17,69], [89,72], [33,4], [69,88], [9,89] ].map(([left, top], i) => (
          <span key={i} className="hero-star" style={{ left: `${left}%`, top: `${top}%` }} aria-hidden="true" />
        ))}
      </div>
    </>
  );
}
