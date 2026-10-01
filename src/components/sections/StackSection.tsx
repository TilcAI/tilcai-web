import type { Copy } from "@/lib/i18n";
import { TechnicalSection } from "./shared";

export function StackSection({ t }: { t: Copy }) {
  return (
    <TechnicalSection id="stack" titleId="stack-title" eyebrow={t.stack.eyebrow} title={t.stack.title}>
          <p className="section-lead technical-lead">{t.stack.lead}</p>
          <ul className="badges reveal" role="list">
            {t.stack.badges.map((b) => (
              <li className="badge" key={b.name}>
                <span className="badge-name">{b.name}</span>
                <span className="badge-role">{b.role}</span>
              </li>
            ))}
          </ul>
          <p className="disclaimer reveal">{t.stack.disclaimer}</p>
      </TechnicalSection>
  );
}
