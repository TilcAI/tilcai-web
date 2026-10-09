import Link from "next/link";
import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { paths } from "@/lib/site";
import { Icon } from "../Icon";
import styles from "./Narrative.module.css";

export function CtaSection({ t }: { t: Copy }) {
  const c = narrative(t.locale).cta;
  return <section className={styles.closing} aria-labelledby="cta-title">
    <div className={`${styles.inner} ${styles.closingInner}`}>
      <div><h2 id="cta-title">{c.title}</h2><p>{c.body}</p></div>
      <div className={styles.actions}>
        <a className="btn btn-primary" href="#demo">{c.primary}<Icon name="arrow" /></a>
        <a className="btn btn-ghost" href="#businesses">{c.secondary}<Icon name="store" /></a>
        <Link className={styles.link} href={paths.roadmap(t.locale)}>{c.tertiary}<Icon name="arrow" /></Link>
      </div>
    </div>
  </section>;
}
