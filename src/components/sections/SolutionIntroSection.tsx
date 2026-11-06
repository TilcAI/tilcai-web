import type { Copy } from "@/lib/i18n";
import Image from "next/image";
import type { CSSProperties } from "react";
import { Icon, type IconName } from "../Icon";
import { letterCount, RevealLetters, RevealWords } from "./RevealText";
import { sectionSans } from "./sectionFont";
import styles from "./SolutionIntroSection.module.css";

const STEP_ICONS: IconName[] = ["user", "briefcase", "layers", "shieldCheck", "box"];

/** Laptop links out to what the agent can reach. Box geometry is in the stage's 720×470 units. */
const LINKS: { icon: IconName; d: string; end: [number, number]; box: [number, number] }[] = [
  { icon: "cart", d: "M486 334C548 334 538 58 582 58", end: [582, 58], box: [582, 20] },
  { icon: "coins", d: "M482 352C556 352 552 168 602 168", end: [602, 168], box: [602, 130] },
  { icon: "shieldCheck", d: "M478 370C556 370 552 278 592 278", end: [592, 278], box: [592, 240] },
];
const BOX = { w: 116, h: 76 };
const pct = (value: number, total: number) => `${(value / total) * 100}%`;

/** Layers like the problem cat: the head is HTML so its motion stays on the compositor. */
function SolutionStage() {
  return (
    <div className={`${styles.stage} reveal`} suppressHydrationWarning aria-hidden="true">
      <svg className={styles.stageLayer} viewBox="0 0 720 470" fill="none">
        <path d="M84 150l26 24M58 196l34 8M60 238l34-5" stroke="#b56af5" strokeWidth="11" strokeLinecap="round" />
      </svg>
      <div className={styles.head}>
        <Image src="/assets/img/section_problema/cabeza gato.webp" alt="" fill sizes="(max-width: 1100px) 60vw, 26vw" className={styles.headImage} />
      </div>
      <svg className={styles.stageLayer} viewBox="0 0 720 470" fill="none">
        <defs>
          <pattern id="solution-hill-dots" width="19" height="19" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#bd75f8" /></pattern>
        </defs>
        {LINKS.map((link, index) => (
          <path key={link.icon} className={styles.link} style={{ "--i": index } as CSSProperties} pathLength="1" d={link.d} stroke="#b566fa" strokeWidth="4" strokeLinecap="round" />
        ))}
        <path d="M0 460C120 404 240 386 360 386C480 386 600 404 720 460V470H0Z" fill="#180e2e" />
        <path d="M0 460C120 404 240 386 360 386C480 386 600 404 720 460V470H0Z" fill="url(#solution-hill-dots)" />
        <path d="M0 460C120 404 240 386 360 386C480 386 600 404 720 460" stroke="#b566fa" strokeWidth="5" strokeLinecap="round" />
        <path d="M302 290H500Q512 290 509 302L486 410Q483 422 471 422H286Q274 422 277 410L297 302Q299 290 302 290Z" fill="#1b0f36" stroke="#c99df8" strokeWidth="6" strokeLinejoin="round" />
        <path d="M292 304L310 296" stroke="#ffffff" strokeOpacity=".18" strokeWidth="5" strokeLinecap="round" />
        <image href="/brand/tilcai-mark-white.png" x="352" y="314" width="88" height="88" />
        {LINKS.map((link, index) => (
          <circle key={link.icon} className={styles.linkDot} style={{ "--i": index } as CSSProperties} cx={link.end[0]} cy={link.end[1]} r="6.5" fill="#ffffff" stroke="#b566fa" strokeWidth="3" />
        ))}
      </svg>
      <div className={styles.workingPaw}>
        <Image src="/assets/img/section_problema/patitas.webp" alt="" fill sizes="(max-width: 1100px) 22vw, 10vw" className={styles.workingPawImage} />
      </div>
      {LINKS.map((link, index) => (
        <span
          key={link.icon}
          className={styles.node}
          style={{ "--i": index, left: pct(link.box[0], 720), top: pct(link.box[1], 470), width: pct(BOX.w, 720), height: pct(BOX.h, 470) } as CSSProperties}
        >
          <Icon name={link.icon} className={styles.nodeIcon} />
        </span>
      ))}
    </div>
  );
}

export function SolutionIntroSection({ t }: { t: Copy }) {
  const copy = t.solutionIntro;
  return (
    <section id="solution" className={`${styles.section} ${sectionSans.variable}`} aria-labelledby="solution-intro-title">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <div className={styles.copy}>
            <p className={`${styles.eyebrow} reveal`} suppressHydrationWarning><span className={styles.eyebrowNumber}><RevealWords text="03 /" stepMs={70} /></span><RevealWords text={copy.eyebrow} stepMs={70} baseMs={140} /><i aria-hidden="true" /></p>
            <h2 id="solution-intro-title" className={`${styles.title} reveal`} suppressHydrationWarning aria-label={`${copy.titleTop} ${copy.titleBottom}`}>
              <span aria-hidden="true"><RevealLetters text={copy.titleTop} /></span>
              <span className={styles.accent} aria-hidden="true"><RevealLetters text={copy.titleBottom} startIndex={letterCount(copy.titleTop)} accent /></span>
            </h2>
            <p className={`${styles.lead} reveal`} suppressHydrationWarning><RevealWords text={copy.lead} stepMs={34} baseMs={280} /></p>
          </div>
          <SolutionStage />
        </div>
        <ol className={styles.steps}>
          {copy.steps.map((step, index) => (
            <li key={step.title} className={`${styles.step} reveal`} suppressHydrationWarning style={{ "--i": index } as CSSProperties}>
              <span className={styles.stepIcon}><Icon name={STEP_ICONS[index]} /></span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              {index < copy.steps.length - 1 && <span className={styles.arrow} aria-hidden="true"><Icon name="arrow" /></span>}
            </li>
          ))}
        </ol>
        <p className={`${styles.conclusion} reveal`} suppressHydrationWarning>
          <Icon name="layers" className={styles.conclusionIcon} />
          <i aria-hidden="true" />
          <span><RevealWords text={copy.conclusion} stepMs={42} baseMs={150} /></span>
        </p>
      </div>
      <svg className={styles.wave} viewBox="0 0 1600 110" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="solution-wave-dots" width="19" height="19" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#bd75f8" /></pattern></defs><path d="M0 40C230 8 420 6 640 30c250 28 400 64 620 44 160-15 260-40 340-36v72H0Z" fill="#180e2e" /><path d="M0 40C230 8 420 6 640 30c250 28 400 64 620 44 160-15 260-40 340-36v72H0Z" fill="url(#solution-wave-dots)" /><path d="M0 40C230 8 420 6 640 30c250 28 400 64 620 44 160-15 260-40 340-36" fill="none" stroke="#b566fa" strokeWidth="3" /></svg>
    </section>
  );
}
