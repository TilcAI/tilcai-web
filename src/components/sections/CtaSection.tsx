import Link from "next/link";
import type { Copy } from "@/lib/i18n";
import { paths } from "@/lib/site";
import { Icon } from "../Icon";

/** `#pilot` is the target of the hero's "Enable my business" button until WEB-13 adds the contact channel. */
export function CtaSection({ t }: { t: Copy }) {
  return (
    <section id="pilot" className="section cta" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-card reveal">
          <h2 id="cta-title">{t.cta.title}</h2>
          <p>{t.cta.body}</p>
          <div className="cta-row">
            <Link className="btn btn-primary" href={paths.docs(t.locale)}>
              {t.cta.primary}
              <Icon name="arrow" />
            </Link>
            <a className="btn btn-ghost" href="#flow">
              {t.cta.secondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
