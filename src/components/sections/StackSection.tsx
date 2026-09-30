import type { Copy } from "@/lib/i18n";
import { SectionHead } from "./shared";

export function StackSection({ t }: { t: Copy }) {
  return (
    <section id="stack" className="section section-alt" aria-labelledby="stack-title">
      <div className="container">
        <SectionHead id="stack-title" eyebrow={t.stack.eyebrow} title={t.stack.title} lead={t.stack.lead} />
        <ul className="badges reveal" role="list">
          {t.stack.badges.map((b) => (
            <li className="badge" key={b.name}>
              <span className="badge-name">{b.name}</span>
              <span className="badge-role">{b.role}</span>
            </li>
          ))}
        </ul>
        <p className="disclaimer reveal">{t.stack.disclaimer}</p>
      </div>
    </section>
  );
}
