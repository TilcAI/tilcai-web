import type { ScenarioId } from "@/lib/demo/scenarios";
import styles from "./CaseArt.module.css";

/**
 * One small drawing per commercial case, in the same line weight as the rest of the icons.
 * The parts that move on hover are separate groups so the whole tile can react without a library.
 */
export function CaseArt({ id }: { id: ScenarioId }) {
  return (
    <svg className={styles.art} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" data-case={id}>
      {id === "cinema" && (
        <g className={styles.ticket}>
          <path d="M9 19h46a3 3 0 0 1 3 3v5.5a4.5 4.5 0 0 0 0 9V42a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-5.5a4.5 4.5 0 0 0 0-9V22a3 3 0 0 1 3-3z" className={styles.body} />
          <path d="M43 21.5v21" strokeDasharray="2 3.6" className={styles.perf} />
          <path d="M19 26.5l9.5 5.5-9.5 5.5z" className={`${styles.mark} ${styles.solid}`} />
          <path d="M48.5 28.5h3M48.5 32h3M48.5 35.5h3" opacity=".6" />
        </g>
      )}
      {id === "digital-service" && (
        <g className={styles.pass}>
          <rect x="8" y="15" width="48" height="34" rx="7" className={styles.body} />
          <g className={styles.key}>
            <circle cx="23" cy="32" r="6.5" className={styles.mark} />
            <path d="M29.5 32H47M40.5 32v5.5M46.5 32v4" />
          </g>
          <circle cx="47.5" cy="22.5" r="1.9" className={styles.dot} />
        </g>
      )}
      {id === "scheduled-purchase" && (
        <g className={styles.calendar}>
          <rect x="9" y="14" width="46" height="38" rx="7" className={styles.body} />
          <path d="M9 25.5h46M22 10v8M42 10v8" />
          <g className={styles.loop}>
            <path d="M23.5 39.5a8.5 8.5 0 0 1 14.2-5.6M40.5 40.5a8.5 8.5 0 0 1-14.2 5.6" className={styles.mark} />
            <path d="M38.5 29.5v5h-5M25.5 50.5v-5h5" className={styles.mark} />
          </g>
        </g>
      )}
    </svg>
  );
}
