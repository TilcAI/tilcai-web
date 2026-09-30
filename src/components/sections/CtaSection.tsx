import Link from "next/link";
import type { Copy } from "@/lib/i18n";
import { paths } from "@/lib/site";
import { Icon } from "../Icon";

export function CtaSection({ t }: { t: Copy }) {
  return (
    <section className="section cta" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-card reveal">
          <h2 id="cta-title">{t.cta.title}</h2>
          <p>{t.cta.body}</p>
          <div className="cta-row">
            <Link className="btn btn-primary" href={paths.docs(t.locale)}>
              {t.cta.primary}
              <Icon name="arrow" />
            </Link>
            <a className="btn btn-ghost" href="#demo">
              {t.cta.secondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
