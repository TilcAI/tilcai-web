import type { Copy } from "@/lib/i18n";
import type { FaqId } from "@/lib/i18n/types";
import styles from "./sections/Narrative.module.css";

const landingQuestions: FaqId[] = ["today", "authority", "business", "simulation", "fulfillment"];

export function FaqSection({ t }: { t: Copy["faq"] }) {
  return (
    <section id="faq" className={`section section-alt ${styles.faq}`} aria-labelledby="faq-title">
      <div className={`container ${styles.faqLayout}`}>
        <header className="section-head reveal">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="faq-title">{t.title}</h2>
        </header>
        <div className="faq-list">
          {landingQuestions.map((id) => (
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
