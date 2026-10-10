import styles from "./EntranceArt.module.css";

/**
 * One small drawing per way in. They carry no words of their own: bars stand where text would be, so nothing is
 * claimed that the copy beside them does not say.
 *  - whatsapp: a guided chat; the last bubble holds the secure link (lock + underlined bar).
 *  - mcp: the assistant, and the twelve specified tools as dashed tiles (the server is pending); the four the copy names are lit.
 *  - api: a backend and the API, a request and its answer, and a once-only mark on the request (idempotency).
 */
export function EntranceArt({ id }: { id: "whatsapp" | "mcp" | "api" }) {
  return (
    <svg className={styles.art} viewBox="0 0 188 112" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" data-art={id}>
      {id === "whatsapp" && (
        <g>
          <path className={styles.line} d="M14 6h86a10 10 0 0 1 10 10v10a10 10 0 0 1-10 10H26l-10 8v-8h-2A10 10 0 0 1 4 26V16A10 10 0 0 1 14 6z" />
          <path className={styles.soft} d="M16 17h60M16 26h36" />
          <path className={`${styles.line} ${styles.tint}`} d="M62 46h112a10 10 0 0 1 10 10v6a10 10 0 0 1-10 10h-4v8l-10-8H62a10 10 0 0 1-10-10v-6a10 10 0 0 1 10-10z" />
          <path className={styles.accent} d="M66 59h88" />
          <path className={styles.line} d="M14 82h104a10 10 0 0 1 10 10v4a10 10 0 0 1-10 10H26l-10 7v-7h-2A10 10 0 0 1 4 96v-4A10 10 0 0 1 14 82z" />
          <rect className={styles.accent} x="16" y="90" width="10" height="8" rx="2" />
          <path className={styles.accent} d="M18.5 90v-2.4a2.5 2.5 0 0 1 5 0V90" />
          <path className={styles.accent} d="M36 94h66" />
        </g>
      )}
      {id === "mcp" && (
        <g>
          <rect className={styles.line} x="4" y="34" width="46" height="46" rx="13" />
          <path className={styles.accent} d="M16 52h22a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H30l-6 5v-5h-8a4 4 0 0 1-4-4v-6a4 4 0 0 1 4-4z" />
          <path className={styles.soft} d="M50 57C68 57 66 24 84 24M50 57H84M50 57C68 57 66 90 84 90" />
          {Array.from({ length: 12 }, (_, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const lit = [1, 4, 6, 11].includes(i);
            return (
              <rect
                key={i}
                className={lit ? `${styles.accent} ${styles.tile}` : `${styles.dashed}`}
                x={86 + col * 24}
                y={27 + row * 24}
                width="18"
                height="18"
                rx="5"
              />
            );
          })}
        </g>
      )}
      {id === "api" && (
        <g>
          <rect className={styles.line} x="4" y="30" width="60" height="52" rx="9" />
          <path className={styles.soft} d="M16 46h28M16 56h36M16 66h22" />
          <rect className={`${styles.line} ${styles.tint}`} x="124" y="30" width="60" height="52" rx="9" />
          <path className={styles.accent} d="M146 46c-5 0-6 3-6 6s-2 4-4 4c2 0 4 1 4 4s1 6 6 6M162 46c5 0 6 3 6 6s2 4 4 4c-2 0-4 1-4 4s-1 6-6 6" />
          <path className={styles.line} d="M72 48h44M110 43l6 5-6 5" />
          <path className={styles.soft} d="M116 66H72M78 61l-6 5 6 5" />
          <circle className={`${styles.accent} ${styles.badge}`} cx="94" cy="48" r="8" />
          <path className={styles.accent} d="M90.5 48.2l2.6 2.6 4.6-5.2" />
        </g>
      )}
    </svg>
  );
}
