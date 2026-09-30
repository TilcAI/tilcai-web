import type { Copy } from "@/lib/i18n";
import { Icon, type IconName } from "../Icon";
import { SectionHead } from "./shared";

const problemIcons: IconName[] = ["layers", "target", "shield", "receipt"];

export function ProblemSection({ t }: { t: Copy }) {
  return (
    <section id="problem" className="section" aria-labelledby="problem-title">
      <div className="container">
        <SectionHead id="problem-title" eyebrow={t.problem.eyebrow} title={t.problem.title} lead={t.problem.lead} />
        <ul className="grid grid-4" role="list">
          {t.problem.cards.map((c, i) => (
            <li className="card reveal" key={c.title}>
              <Icon name={problemIcons[i]} className="icon icon-card" />
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </li>
          ))}
        </ul>
        <blockquote className="question reveal">
          <p>{t.problem.question}</p>
        </blockquote>
      </div>
    </section>
  );
}
