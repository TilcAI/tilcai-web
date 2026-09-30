import { Fragment } from "react";
import type { Copy } from "@/lib/i18n";
import { Icon } from "../Icon";
import { HeroScene } from "./HeroScene";

/**
 * The only <h1> on the landing. On mobile the copy comes first and the compact scene below it.
 */
export function HeroSection({ t }: { t: Copy }) {
  const { hero } = t;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">
            <span className="dot" aria-hidden="true" />
            {hero.eyebrow}
          </p>
          <h1 id="hero-title">
            {/* One unit per sentence so lines break between sentences, not inside them. */}
            {hero.title.split(/(?<=\.)\s+/).map((sentence, i) => (
              <Fragment key={sentence}>
                {i > 0 && " "}
                <span className="h1-sentence">{sentence}</span>
              </Fragment>
            ))}
          </h1>
          <p className="lead">{hero.lead}</p>
          <div className="cta-row">
            <a className="btn btn-primary" href="#flow">
              {hero.ctaPrimary}
              <Icon name="arrow" />
            </a>
            <a className="btn btn-ghost" href="#capabilities">
              {hero.ctaSecondary}
            </a>
          </div>
          <ul className="facts" role="list">
            {hero.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <HeroScene scene={hero.scene} />
      </div>
    </section>
  );
}
