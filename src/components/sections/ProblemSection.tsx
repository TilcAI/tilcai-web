import type { Copy } from "@/lib/i18n";
import localFont from "next/font/local";
import styles from "./ProblemSection.module.css";

const problemSans = localFont({
  src: [
    { path: "../../fonts/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../fonts/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-problem",
});

function LockIcon() {
  return <svg viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M28 42V31a20 20 0 0 1 40 0v11" /><rect x="20" y="42" width="56" height="45" rx="9" /><circle cx="48" cy="63" r="4" fill="#b969f8" stroke="none" /><path d="M48 67v9" stroke="#b969f8" /></svg>;
}

function CoinsIcon() {
  return <svg viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" aria-hidden="true"><ellipse cx="55" cy="21" rx="28" ry="10" /><path d="M27 21v17c0 6 13 11 28 11s28-5 28-11V21M27 37c0 6 13 11 28 11s28-5 28-11" /><ellipse cx="37" cy="55" rx="28" ry="10" /><path d="M9 55v18c0 6 12 11 28 11s28-5 28-11V55M9 72c0 6 12 11 28 11s28-5 28-11" /><path d="M28 39v10M82 39v16" stroke="#b969f8" /></svg>;
}

function RepeatIcon() {
  return <svg viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 44a30 30 0 0 1 53-13l8 10M77 52a30 30 0 0 1-53 13L16 55" /><path d="M80 22v19H61M16 74V55h19" stroke="#b969f8" /></svg>;
}

const icons = [LockIcon, CoinsIcon, RepeatIcon];

function ProblemCat() {
  return (
    <svg className={styles.cat} viewBox="0 0 640 455" fill="none" aria-hidden="true">
      <defs>
        <pattern id="problem-hill-dots" width="19" height="19" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#bd75f8" /></pattern>
      </defs>
      <path d="M87 303l-28-19M75 324l-33-8M77 346l-34 3M549 303l28-19M561 324l33-8M559 346l34 3" stroke="#b56af5" strokeWidth="12" strokeLinecap="round" />
      <image href="/assets/img/section_problema/cabeza%20gato.webp" x="70" y="80" width="510" height="340" />
      <image href="/assets/img/section_problema/nube.svg" x="235" y="-35" width="240" height="240" />
      <path d="M0 450C110 392 220 372 320 374C430 376 530 402 640 450V455H0Z" fill="#180e2e" />
      <path d="M0 450C110 392 220 372 320 374C430 376 530 402 640 450V455H0Z" fill="url(#problem-hill-dots)" />
      <path d="M0 450C110 392 220 372 320 374C430 376 530 402 640 450" fill="none" stroke="#b566fa" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <image href="/assets/img/section_problema/patitas.webp" x="82" y="342" width="145" height="97" />
      <image href="/assets/img/section_problema/patitas.webp" x="413" y="342" width="145" height="97" />
    </svg>
  );
}

export function ProblemSection({ t }: { t: Copy }) {
  const copy = t.problemIntro;
  return (
    <section id="problem" className={`${styles.section} ${problemSans.variable}`} aria-labelledby="problem-intro-title">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}><span>02 /</span> {copy.eyebrow}<i aria-hidden="true" /></p>
            <h2 id="problem-intro-title" className={styles.title}><span>{copy.titleTop}</span><span className={styles.accent}>{copy.titleBottom}</span></h2>
            <p className={styles.lead}>{copy.lead}</p>
          </div>
          <ProblemCat />
        </div>
        <ul className={styles.cards}>
          {copy.cards.map((card, index) => {
            const CardIcon = icons[index];
            return <li className={styles.card} key={card.title}><div className={styles.cardIcon}><CardIcon /></div><div className={styles.cardCopy}><h3>{card.title}</h3><p>{card.body}</p></div></li>;
          })}
        </ul>
        <p className={styles.conclusion}>{copy.conclusion}</p>
      </div>
      <svg className={styles.wave} viewBox="0 0 1600 110" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="problem-wave-dots" width="19" height="19" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#bd75f8" /></pattern></defs><path d="M0 34C210 91 379 0 585 26c235 25 301 77 540 47 185-23 344-57 475-34v71H0Z" fill="#180e2e" /><path d="M0 34C210 91 379 0 585 26c235 25 301 77 540 47 185-23 344-57 475-34v71H0Z" fill="url(#problem-wave-dots)" /><path d="M0 34C210 91 379 0 585 26c235 25 301 77 540 47 185-23 344-57 475-34" stroke="#b566fa" strokeWidth="3" /></svg>
    </section>
  );
}
