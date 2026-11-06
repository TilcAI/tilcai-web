import type { Copy } from "@/lib/i18n";
import Image from "next/image";
import type { CSSProperties } from "react";
import { Icon, type IconName } from "../Icon";
import { letterCount, RevealLetters, RevealWords } from "./RevealText";
import { sectionSans } from "./sectionFont";
import styles from "./TechIntroSection.module.css";

const PIPELINE_ICONS: IconName[] = ["code", "tools", "shieldCheck", "coins", "bars"];
const CARD_ICONS: IconName[] = ["code", "tools", "shieldCheck", "swap", "bars"];

/** The cat peeks over the hill; the head is an HTML layer between two SVGs so it hides behind the hill fill. */
function TechCat() {
  return (
    <div className={`${styles.stage} reveal`} suppressHydrationWarning aria-hidden="true">
      <svg className={styles.stageLayer} viewBox="0 0 800 220" fill="none">
        <path className={styles.sparks} d="M286 70l-22-16M278 96l-30-6M280 122l-30 4M514 70l22-16M522 96l30-6M520 122l30 4" stroke="#b56af5" strokeWidth="10" strokeLinecap="round" />
      </svg>
      <div className={styles.head}>
        <Image src="/assets/img/section_problema/cabeza gato.webp" alt="" fill sizes="(max-width: 1100px) 34vw, 15vw" className={styles.headImage} />
      </div>
      <svg className={styles.stageLayer} viewBox="0 0 800 220" fill="none">
        <path d="M30 220C190 178 305 166 400 166C495 166 610 178 770 220Z" fill="#120a24" />
        <path className={styles.hill} d="M30 220C190 178 305 166 400 166C495 166 610 178 770 220" stroke="#c07bff" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <div className={`${styles.paw} ${styles.pawLeft}`}>
        <Image src="/assets/img/section_problema/patitas.webp" alt="" fill sizes="(max-width: 1100px) 9vw, 5vw" className={styles.pawImage} />
      </div>
      <div className={`${styles.paw} ${styles.pawRight}`}>
        <Image src="/assets/img/section_problema/patitas.webp" alt="" fill sizes="(max-width: 1100px) 9vw, 5vw" className={styles.pawImage} />
      </div>
    </div>
  );
}

/** Five layers in order; the dashed loop under them returns through the payment rail. */
function Pipeline({ steps, rail, railLabel }: { steps: string[]; rail: string; railLabel: string }) {
  return (
    <div className={`${styles.pipeline} reveal`} suppressHydrationWarning>
      <ol className={styles.nodes}>
        {steps.map((label, index) => (
          <li key={label} className={styles.node} style={{ "--i": index } as CSSProperties}>
            <Icon name={PIPELINE_ICONS[index]} className={styles.nodeIcon} />
            <span>{label}</span>
            {index < steps.length - 1 && <span className={styles.nodeArrow} aria-hidden="true"><Icon name="arrow" /></span>}
          </li>
        ))}
      </ol>
      <div className={styles.railRow}>
        <span className={styles.railLine} aria-hidden="true" />
        <span className={styles.rail}><Icon name="swap" className={styles.railIcon} />{rail}</span>
        <span className={styles.railLabel}>{railLabel}</span>
      </div>
    </div>
  );
}

export function TechIntroSection({ t }: { t: Copy }) {
  const copy = t.techIntro;
  return (
    <section id="technology" className={`${styles.section} ${sectionSans.variable}`} aria-labelledby="tech-intro-title">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <div className={styles.copy}>
            <p className={`${styles.eyebrow} reveal`} suppressHydrationWarning><span className={styles.eyebrowNumber}><RevealWords text="04 /" stepMs={70} /></span><RevealWords text={copy.eyebrow} stepMs={70} baseMs={140} /><i aria-hidden="true" /></p>
            <h2 id="tech-intro-title" className={`${styles.title} reveal`} suppressHydrationWarning aria-label={`${copy.titleTop} ${copy.titleBottom}`}>
              <span aria-hidden="true"><RevealLetters text={copy.titleTop} /></span>
              <span className={styles.accent} aria-hidden="true"><RevealLetters text={copy.titleBottom} startIndex={letterCount(copy.titleTop)} stepMs={16} accent /></span>
            </h2>
            <p className={`${styles.lead} reveal`} suppressHydrationWarning><RevealWords text={copy.lead} stepMs={30} baseMs={300} /></p>
          </div>
          <div className={styles.diagram}>
            <TechCat />
            <Pipeline steps={copy.pipeline} rail={copy.rail} railLabel={copy.railLabel} />
          </div>
        </div>
        <ul className={styles.cards}>
          {copy.cards.map((card, index) => (
            <li key={card.title} className={`${styles.card} reveal`} suppressHydrationWarning style={{ "--i": index } as CSSProperties}>
              <span className={styles.cardIcon}><Icon name={CARD_ICONS[index]} /></span>
              <i className={styles.cardRule} aria-hidden="true" />
              <div className={styles.cardCopy}>
                <h3><RevealWords text={card.title} stepMs={70} baseMs={120 + index * 110} /></h3>
                <p><RevealWords text={card.body} stepMs={34} baseMs={320 + index * 110} /></p>
              </div>
            </li>
          ))}
        </ul>
        <p className={`${styles.conclusion} reveal`} suppressHydrationWarning>
          <Icon name="layers" className={styles.conclusionIcon} />
          <i aria-hidden="true" />
          <span><RevealWords text={copy.conclusion} stepMs={40} baseMs={150} /></span>
        </p>
      </div>
      <svg className={styles.wave} viewBox="0 0 1600 110" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="tech-wave-dots" width="19" height="19" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#bd75f8" /></pattern></defs><path d="M0 22C260 70 470 76 760 46c270-28 470-40 840-6v70H0Z" fill="#180e2e" /><path d="M0 22C260 70 470 76 760 46c270-28 470-40 840-6v70H0Z" fill="url(#tech-wave-dots)" /><path d="M0 22C260 70 470 76 760 46c270-28 470-40 840-6" fill="none" stroke="#b566fa" strokeWidth="3" /></svg>
    </section>
  );
}
