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
        <linearGradient id="problem-hill" x1="320" y1="335" x2="320" y2="455" gradientUnits="userSpaceOnUse"><stop stopColor="#7135ae" /><stop offset="1" stopColor="#180d30" /></linearGradient>
        <linearGradient id="problem-ear" x1="160" y1="210" x2="430" y2="330" gradientUnits="userSpaceOnUse"><stop stopColor="#fff" /><stop offset="1" stopColor="#dbb8f5" /></linearGradient>
      </defs>
      <path d="M95 335C135 190 250 94 323 94c92 0 189 101 223 241" stroke="#ad70ed" strokeWidth="6" strokeDasharray="10 18" strokeLinecap="round" />
      <path d="M274 100V67M398 134l18-27M157 150l-24-24" stroke="#b66ff3" strokeWidth="6" strokeDasharray="10 17" strokeLinecap="round" />
      <g transform="rotate(-29 135 145)"><rect x="70" y="77" width="128" height="128" rx="31" fill="#100a25" stroke="#fff" strokeWidth="6" /><path d="M106 129v-14a28 28 0 0 1 56 0v14" stroke="#fff" strokeWidth="7" strokeLinecap="round" /><rect x="99" y="128" width="70" height="56" rx="9" fill="#fff" /><rect x="105" y="136" width="58" height="40" rx="5" fill="#aa55ed" /><circle cx="134" cy="154" r="5" fill="#1a1034" /><path d="M134 157v8" stroke="#1a1034" strokeWidth="5" /></g>
      <g><rect x="270" y="10" width="137" height="126" rx="32" fill="#100a25" stroke="#fff" strokeWidth="6" /><ellipse cx="338" cy="53" rx="27" ry="10" stroke="#fff" strokeWidth="6" /><path d="M311 53v27c0 6 12 10 27 10s27-4 27-10V53M311 70c0 6 12 10 27 10s27-4 27-10" stroke="#fff" strokeWidth="6" /><ellipse cx="322" cy="88" rx="27" ry="10" stroke="#fff" strokeWidth="6" /><path d="M295 88v26c0 6 12 10 27 10s27-4 27-10V88M295 103c0 6 12 10 27 10s27-4 27-10" stroke="#bb72ff" strokeWidth="6" /></g>
      <g transform="rotate(27 515 146)"><rect x="450" y="81" width="130" height="130" rx="31" fill="#100a25" stroke="#fff" strokeWidth="6" /><path d="M475 143a37 37 0 0 1 64-20l9 11M550 151a37 37 0 0 1-65 19l-9-11" stroke="#fff" strokeWidth="7" strokeLinecap="round" /><path d="M548 117v17h-17M476 176v-17h17" stroke="#b66ff3" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" /></g>
      <path d="M87 303l-28-19M75 324l-33-8M77 346l-34 3M549 303l28-19M561 324l33-8M559 346l34 3" stroke="#b56af5" strokeWidth="12" strokeLinecap="round" />
      <path d="M180 378c-15-78-11-161-4-205 3-18 14-24 26-13l66 57c36-17 87-20 125-8l68-65c12-11 23-5 26 13 10 60 15 146-3 221H180Z" fill="url(#problem-ear)" stroke="#fff" strokeWidth="7" strokeLinejoin="round" />
      <path d="m196 184 15 70 41-32-56-38ZM467 172l-9 75-47-31 56-44Z" fill="#120b28" />
      <path d="M178 381c-4-105 54-163 143-168 99-5 165 52 166 168" fill="#fff" />
      <path d="M178 381c-4-105 54-163 143-168 99-5 165 52 166 168" stroke="#fff" strokeWidth="6" />
      <rect x="256" y="270" width="23" height="63" rx="11" transform="rotate(-11 256 270)" fill="#150b2c" /><rect x="369" y="268" width="23" height="63" rx="11" transform="rotate(-11 369 268)" fill="#150b2c" />
      <path d="M0 393C143 335 266 336 347 351c119-24 227-1 293 43v61H0v-62Z" fill="url(#problem-hill)" stroke="#b36df4" strokeWidth="5" />
      <path d="M156 366c-18-25-53-13-60 17-6 25 3 42 22 43 9 1 16-3 20-9 5 10 20 14 30 8 6 3 12 4 18 2 24-7 25-40 3-56-10-8-23-9-33-5ZM480 366c18-25 53-13 60 17 6 25-3 42-22 43-9 1-16-3-20-9-5 10-20 14-30 8-6 3-12 4-18 2-24-7-25-40-3-56 10-8 23-9 33-5Z" fill="#fff" stroke="#120b29" strokeWidth="6" />
      <path d="M138 396c-1 10 1 18 7 23M161 392c-2 15 1 24 7 32M502 396c1 10-1 18-7 23M479 392c2 15-1 24-7 32" stroke="#120b29" strokeWidth="5" strokeLinecap="round" />
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
