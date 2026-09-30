import type { Copy } from "@/lib/i18n";
import { json } from "@/lib/highlight";
import { snippets } from "@/lib/snippets";
import { CodeTabs } from "../CodeTabs";
import { Icon } from "../Icon";

export function InterfaceSection({ t }: { t: Copy }) {
  const code = snippets(t.code.comments);

  return (
    <section id="interface" className="section section-alt" aria-labelledby="code-title">
      <div className="container code-grid">
        <header className="section-head reveal">
          <p className="eyebrow">{t.code.eyebrow}</p>
          <h2 id="code-title">{t.code.title}</h2>
          <p className="section-lead">{t.code.lead}</p>
          <ul className="bullets" role="list">
            {t.code.bullets.map((b) => (
              <li key={b}>
                <Icon name="check" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </header>
        <CodeTabs
          label={t.code.label}
          ariaLabel={t.a11y.codeTabs}
          tabs={t.code.tabs.map((tab) => ({ ...tab, html: json(code[tab.id]) }))}
        />
      </div>
    </section>
  );
}
