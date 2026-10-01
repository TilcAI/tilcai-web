import type { Copy } from "@/lib/i18n";
import { Icon, type IconName } from "../Icon";
import { SectionHead } from "./shared";

// Same order as `problem.cards`: buyer's agent, TilcAI, the business.
const blockIcons: IconName[] = ["agent", "link", "store"];

/** "What TilcAI is". Keeps the public `#problem` anchor and the `problem` copy key. */
export function ProductOverview({ t }: { t: Copy }) {
  const { problem } = t;

  return (
    <section id="problem" className="section" aria-labelledby="problem-title">
      <div className="container">
        <SectionHead id="problem-title" eyebrow={problem.eyebrow} title={problem.title} lead={problem.lead} />
        <ol className="grid grid-3" role="list">
          {problem.cards.map((c, i) => (
            <li key={c.title} className="card reveal">
              <Icon name={blockIcons[i]} className="icon icon-card" />
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </li>
          ))}
        </ol>
        <p className="overview-note reveal">{problem.question}</p>
      </div>
    </section>
  );
}
