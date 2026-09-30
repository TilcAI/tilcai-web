import type { Copy } from "@/lib/i18n";
import { FAQ_IDS } from "@/lib/i18n/types";

export function FaqSection({ t }: { t: Copy["faq"] }) {
  return (
    <section id="faq" className="section section-alt" aria-labelledby="faq-title">
      <div className="container">
        <header className="section-head reveal">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="faq-title">{t.title}</h2>
        </header>
        <div className="faq-list">
          {FAQ_IDS.map((id) => (
            <details key={id} className="faq-item reveal">
              <summary>{t.items[id].question}</summary>
              <p>{t.items[id].answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
