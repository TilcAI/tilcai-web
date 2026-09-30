import Image from "next/image";
import type { HeroScene as SceneCopy } from "@/lib/i18n/types";
import { Icon } from "../Icon";

/**
 * Illustrative three-node scene: buyer's agent → TilcAI → business agent.
 *
 * Server component with no client JavaScript. The entrance sequence is pure CSS and starts when
 * `RevealObserver` (already in the layout) adds `is-visible`, so on mobile — where the scene sits
 * below the text — it plays when it scrolls into view. Without JS or with reduced motion the
 * scene is simply rendered in its final state.
 *
 * It is a drawing, not evidence: the label says so and the figures are sample data.
 */
export function HeroScene({ scene }: { scene: SceneCopy }) {
  const { buyer, core, business } = scene;

  return (
    <figure className="scene reveal">
      <figcaption className="scene-badge">{scene.label}</figcaption>

      <ol className="scene-chain" role="list">
        <li className="scene-node node-buyer">
          <span className="node-icon" aria-hidden="true">
            <Icon name="agent" />
          </span>
          <div className="node-body">
            <p className="node-role">
              {buyer.role}
              <span className="node-action"> · {buyer.action}</span>
            </p>
            <p className="bubble">{buyer.message}</p>
          </div>
        </li>

        <li className="scene-node node-core">
          <span className="node-icon node-icon-brand" aria-hidden="true">
            <Image src="/assets/tilcai-face-64.png" width={40} height={40} alt="" />
          </span>
          <div className="node-body">
            <p className="node-role">{core.role}</p>
            <p className="node-text">{core.detail}</p>
            <p className="scene-chip">
              <span className="chip-dot" aria-hidden="true" />
              <Icon name="lock" />
              {core.control}
            </p>
          </div>
        </li>

        <li className="scene-node node-business">
          <span className="node-icon" aria-hidden="true">
            <Icon name="store" />
          </span>
          <div className="node-body">
            <p className="node-role">{business.role}</p>
            <p className="node-text node-name">
              <strong>{business.name}</strong>
              <span className="node-action"> · {business.service}</span>
            </p>
            <ul className="offer" role="list">
              <li className="offer-ok">
                <Icon name="check" />
                {business.availability}
              </li>
              <li>
                {business.quote.label} <strong className="offer-amount">{business.quote.amount}</strong>
                <span className="node-action"> · {business.quote.note}</span>
              </li>
            </ul>
          </div>
        </li>
      </ol>
    </figure>
  );
}
