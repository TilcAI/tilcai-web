import Image from "next/image";
import type { Copy } from "@/lib/i18n";
import { Icon, type IconName } from "../Icon";
import { TilcAIParallax } from "./TilcAIParallax";
import styles from "./ProductOverview.module.css";

// Same order as `problem.cards`: buyer's agent, TilcAI, the business.
const blockIcons: IconName[] = ["agent", "link", "store"];
const blockArt = ["/assets/img/description/p3-c1.png", "/assets/img/description/p3-c2.png", "/assets/img/description/p3-c3.png"];

/** "What TilcAI is". Keeps the public `#problem` anchor and the `problem` copy key. */
export function ProductOverview({ t }: { t: Copy }) {
  const { problem } = t;

  // The title is one string in the dictionary; `titleAccent` marks the word to highlight.
  const at = problem.titleAccent ? problem.title.indexOf(problem.titleAccent) : -1;
  const [before, accent, after] =
    at < 0 || !problem.titleAccent
      ? [problem.title, "", ""]
      : [problem.title.slice(0, at), problem.titleAccent, problem.title.slice(at + problem.titleAccent.length)];

  return (
    <TilcAIParallax id="problem" labelledBy="problem-title">
      <div className={styles.wrap}>
        <header className={`section-head reveal ${styles.head}`}>
          <p className={`eyebrow ${styles.eyebrow}`}>{problem.eyebrow}</p>
          <h2 id="problem-title" className={styles.title}>
            {before}
            {accent && <span className={styles.accent}>{accent}</span>}
            {after}
          </h2>
          <p className={`section-lead ${styles.lead}`}>{problem.lead}</p>
        </header>

        <ol className={styles.cards} role="list">
          {problem.cards.map((c, i) => (
            <li key={c.title} className={`${styles.card} reveal`}>
              <div className={styles.art} aria-hidden="true">
                <Image src={blockArt[i]} alt="" fill sizes="(min-width: 1024px) 33vw, 90vw" quality={85} draggable={false} />
              </div>
              <div className={styles.body}>
                <Icon name={blockIcons[i]} className={`icon ${styles.icon}`} />
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

      </div>
    </TilcAIParallax>
  );
}
