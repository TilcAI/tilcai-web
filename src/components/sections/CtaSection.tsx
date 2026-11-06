import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { contact, paths } from "@/lib/site";
import { Icon, type IconName } from "../Icon";
import { letterCount, RevealLetters, RevealWords } from "./RevealText";
import { sectionSans } from "./sectionFont";
import styles from "./CtaSection.module.css";

const ACTION_ICONS: IconName[] = ["doc", "agent"];

/** Closing moment: the cat peeks over the hill and waves goodbye. The waving paw is HTML so it moves on the compositor. */
function WavingCat() {
  return (
    <div className={`${styles.stage} reveal`} suppressHydrationWarning aria-hidden="true">
      <svg className={styles.stageLayer} viewBox="0 0 640 380" fill="none">
        <path className={styles.sparks} d="M150 168l-24-16M140 198l-32-5M144 228l-31 6M490 168l24-16M500 198l32-5M496 228l31 6" stroke="#b56af5" strokeWidth="11" strokeLinecap="round" />
      </svg>
      <div className={styles.head}>
        <Image src="/assets/img/section_problema/cabeza gato.webp" alt="" fill sizes="(max-width: 1100px) 50vw, 24vw" className={styles.headImage} />
      </div>
      <svg className={styles.stageLayer} viewBox="0 0 640 380" fill="none">
        <path d="M10 380C150 336 250 322 320 322C390 322 490 336 630 380Z" fill="#120a24" />
        <path className={styles.hill} d="M10 380C150 336 250 322 320 322C390 322 490 336 630 380" stroke="#c07bff" strokeWidth="5" strokeLinecap="round" />
        <image href="/assets/img/section_problema/patitas.webp" x="196" y="296" width="96" height="64" />
      </svg>
      <div className={styles.wavePaw}>
        <Image src="/assets/img/section_problema/patitas.webp" alt="" fill sizes="10vw" />
      </div>
    </div>
  );
}

function ActionCard({ href, external, icon, title, body, index, primary }: { href: string; external?: boolean; icon: IconName; title: string; body: string; index: number; primary?: boolean }) {
  const inner: ReactNode = (
    <>
      <span className={styles.actionIcon}><Icon name={icon} /></span>
      <span className={styles.actionCopy}>
        <span className={styles.actionTitle}>{title}</span>
        <span className={styles.actionBody}>{body}</span>
      </span>
      <span className={styles.actionArrow} aria-hidden="true"><Icon name={external ? "upright" : "arrow"} /></span>
    </>
  );
  const className = `${styles.action}${primary ? ` ${styles.primary}` : ""} reveal`;
  const style = { "--i": index } as CSSProperties;
  return (
    <li className={styles.actionItem}>
      {external
        ? <a className={className} style={style} href={href} target="_blank" rel="noopener noreferrer" suppressHydrationWarning>{inner}</a>
        : <Link className={className} style={style} href={href} suppressHydrationWarning>{inner}</Link>}
    </li>
  );
}

export function CtaSection({ t }: { t: Copy }) {
  const c = narrative(t.locale).cta;
  const targets = [
    { href: paths.docs(t.locale) },
    { href: contact.telegramUrl, external: true },
  ];
  return (
    <section id="start" className={`${styles.section} ${sectionSans.variable}`} aria-labelledby="cta-title">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <div className={styles.copy}>
            <p className={`${styles.eyebrow} reveal`} suppressHydrationWarning><span className={styles.eyebrowNumber}><RevealWords text="05 /" stepMs={70} /></span><RevealWords text={c.eyebrow} stepMs={70} baseMs={140} /><i aria-hidden="true" /></p>
            <h2 id="cta-title" className={`${styles.title} reveal`} suppressHydrationWarning aria-label={`${c.titleTop} ${c.titleBottom}`}>
              <span aria-hidden="true"><RevealLetters text={c.titleTop} /></span>
              <span aria-hidden="true"><RevealLetters text={c.titleBottom} startIndex={letterCount(c.titleTop)} accent /></span>
            </h2>
            <p className={`${styles.lead} reveal`} suppressHydrationWarning><RevealWords text={c.body} stepMs={32} baseMs={280} /></p>
          </div>
          <WavingCat />
        </div>
        <ul className={styles.actions}>
          {c.actions.map((action, index) => (
            <ActionCard key={action.title} {...targets[index]} icon={ACTION_ICONS[index]} title={action.title} body={action.body} index={index} primary={index === 0} />
          ))}
        </ul>
      </div>
    </section>
  );
}
