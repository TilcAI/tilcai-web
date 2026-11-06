import type { CSSProperties } from "react";
import styles from "./RevealText.module.css";

/**
 * Text that enters once its `.reveal` ancestor gets `is-visible`.
 * Letters are for display headings; body copy goes word by word so a section never runs hundreds of animations at once.
 */
export function RevealLetters({ text, startIndex = 0, stepMs = 24, baseMs = 0, accent = false }: { text: string; startIndex?: number; stepMs?: number; baseMs?: number; accent?: boolean }) {
  const words = text.split(" ");
  let letterIndex = startIndex;
  return (
    <>
      {words.map((word, index) => (
        <span className={styles.word} key={index}>
          {Array.from(word).map((letter, i) => (
            <span
              className={accent ? `${styles.letter} ${styles.accent}` : styles.letter}
              key={i}
              style={{ "--reveal-delay": `${baseMs + letterIndex++ * stepMs}ms` } as CSSProperties}
            >{letter}</span>
          ))}
          {index < words.length - 1 && <span className={styles.wordSpace}> </span>}
        </span>
      ))}
    </>
  );
}

export function RevealWords({ text, stepMs = 40, baseMs = 0 }: { text: string; stepMs?: number; baseMs?: number }) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={index}>
            <span className={styles.wordIn} style={{ "--reveal-delay": `${baseMs + index * stepMs}ms` } as CSSProperties}>{word}</span>
            {index < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </>
  );
}

/** Letter count without spaces, so a second heading line continues the first line's stagger. */
export function letterCount(text: string) {
  return Array.from(text.replaceAll(" ", "")).length;
}
