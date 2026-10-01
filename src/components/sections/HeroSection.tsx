import type { Copy } from "@/lib/i18n";
import { Icon } from "../Icon";
import { HeroScene } from "./HeroScene";

/** Compact headline and holographic scene. */
export function HeroSection({ t }: { t: Copy }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-copy reveal">
            <p className="status-pill">
              <span className="dot" aria-hidden="true" />
              {t.hero.eyebrow}
            </p>
            <h1 id="hero-title">{t.hero.title.split(/(?<=\.)\s+/).map((line, index) => <span key={line} className={index === 2 ? "hero-accent" : undefined}>{line} </span>)}</h1>
            <p className="lead">{t.hero.lead}</p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#flow">
                {t.hero.ctaPrimary}
                <Icon name="arrow" />
              </a>
              <a className="btn btn-ghost" href="#capabilities">
                {t.hero.ctaSecondary}
              </a>
            </div>
            <ul className="facts" role="list">
              {t.hero.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <HeroScene t={t} />
        </div>
      </section>
  );
}
