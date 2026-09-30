import type { Copy } from "@/lib/i18n";
import { Icon, type IconName } from "../Icon";
import { SectionHead } from "./shared";

// Same order as `overview.blocks`: buyer's agent, TilcAI, the business.
const blockIcons: IconName[] = ["agent", "link", "store"];

export function ProductOverview({ t }: { t: Copy }) {
  const { overview } = t;

  return (
    <section id="overview" className="section" aria-labelledby="overview-title">
      <div className="container">
        <SectionHead id="overview-title" eyebrow={overview.eyebrow} title={overview.title} />
        <ol className="overview-grid" role="list">
          {overview.blocks.map((b, i) => (
            <li key={b.title} className={`card overview-card reveal${i === 1 ? " is-core" : ""}`}>
              <Icon name={blockIcons[i]} className="icon icon-card" />
              <h3>{b.title}</h3>
              <p>{b.body}</p>
              {i < overview.blocks.length - 1 && (
                <span className="overview-arrow" aria-hidden="true">
                  <Icon name="arrow" />
                </span>
              )}
            </li>
          ))}
        </ol>
        <div className="overview-foot reveal">
          <p className="overview-closing">{overview.closing}</p>
          <p className="overview-support">{overview.support}</p>
        </div>
      </div>
    </section>
  );
}
