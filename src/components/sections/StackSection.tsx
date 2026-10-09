import Link from "next/link";
import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { Icon } from "../Icon";
import styles from "./Narrative.module.css";

export function StackSection({ t }: { t: Copy }) {
  const c = narrative(t.locale).stack;
  return <section id="stack" className={styles.stack} aria-labelledby="stack-title">
    <div className={styles.inner}>
      <div className={styles.stackHeader}><h2 id="stack-title">{c.title}</h2><Link className={styles.link} href={`/${t.locale}/docs#architecture`}>{t.stack.docsLink}<Icon name="arrow" /></Link></div>
      <ul className={styles.technologies}>{t.stack.badges.map(badge => <li key={badge.name}><strong>{badge.name}</strong><span>{badge.role}</span></li>)}</ul>
      <p className={styles.caption}>{c.note}</p>
    </div>
  </section>;
}
