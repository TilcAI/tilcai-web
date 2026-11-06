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

/** Draws itself in on scroll: strokes trace their outline, then the card fill and dots pop in. */
function ThoughtCloud({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 1254 1254" className={`${styles.cloud} reveal`} aria-hidden="true">
      <g fill="none" stroke="#FFFFFF" strokeWidth="23" strokeLinecap="round" strokeLinejoin="round">
        <path className={styles.cloudStroke} pathLength="1" d="M 447,781 C 432,755 421,733 414,721 C 334,732 259,700 206,646 C 154,592 155,524 176,458 C 203,372 275,325 366,315 C 384,206 470,128 577,136 C 657,134 719,184 754,257 C 797,229 835,218 870,226 C 950,239 993,306 991,389 C 1076,411 1113,480 1108,562 C 1108,661 1037,738 926,751 C 868,833 754,857 672,813 C 644,831 619,839 594,838" />
        <circle className={styles.cloudStroke} pathLength="1" cx="508" cy="876" r="72" />
        <circle className={styles.cloudStroke} pathLength="1" cx="591" cy="1004" r="33" />
      </g>
      <path className={styles.cloudFill} d="M 428,435 H 816 V 491 H 428 Z" fill="#B76AF2" />
      <path className={styles.cloudStroke} pathLength="1" fill="none" stroke="#FFFFFF" strokeWidth="21" strokeLinecap="round" strokeLinejoin="round" d="M 827,490 V 412 Q 827,372 783,372 H 457 Q 414,372 414,415 V 610 Q 414,657 463,657 H 634" />
      <path className={styles.cloudStroke} pathLength="1" fill="none" stroke="#FFFFFF" strokeWidth="20" strokeLinecap="round" d="M 476,557 H 526 M 567,557 H 618" />
      <path className={styles.cloudStroke} pathLength="1" fill="none" stroke="#D89BF6" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" d="M 742,500 C 755,477 780,477 793,500 L 886,649 C 899,674 889,695 857,695 H 675 C 645,695 633,673 649,648 Z" />
      <path className={styles.cloudStroke} pathLength="1" stroke="#FFFFFF" strokeWidth="20" strokeLinecap="round" d="M 766,563 V 609" />
      <circle className={styles.cloudFill} cx="766" cy="644" r="11" fill="#FFFFFF" />
    </svg>
  );
}

function ProblemCat() {
  return (
    <svg className={styles.cat} viewBox="0 0 640 455" fill="none" aria-hidden="true">
      <defs>
        <pattern id="problem-hill-dots" width="19" height="19" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#bd75f8" /></pattern>
      </defs>
      <path d="M87 303l-28-19M75 324l-33-8M77 346l-34 3M549 303l28-19M561 324l33-8M559 346l34 3" stroke="#b56af5" strokeWidth="12" strokeLinecap="round" />
      <image href="/assets/img/section_problema/cabeza%20gato.webp" x="70" y="80" width="510" height="340" />
      <ThoughtCloud x={235} y={-35} size={240} />
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
