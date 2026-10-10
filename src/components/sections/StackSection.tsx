import type { CSSProperties } from "react";
import Link from "next/link";
import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { Icon, type IconName } from "../Icon";
import { StellarIcon } from "./rails/ChainIcons";
import styles from "./StackSection.module.css";

/**
 * One mark per piece, picked for what the piece does in an operation (not its logo: naming a technology here
 * is not an endorsement, and the brand marks are not ours to draw). The names are proper nouns, identical in
 * both locales, so they are the key; an unknown name falls back to a neutral mark.
 */
const MARKS: Record<string, IconName> = {
  MCP: "agent",
  Soroban: "rules",
  USDC: "coin",
  x402: "bolt",
  CCTP: "route",
  "OpenZeppelin Relayer": "link",
};

/**
 * The pieces under every operation. A quiet band, so it reads in one glance: a mark, a name and one line of
 * role per piece. The pieces are not links (there is no page per technology), so they carry no hover state; the
 * only interactive element is the link to the architecture. They enter once, staggered, when the band scrolls in.
 */
export function StackSection({ t }: { t: Copy }) {
  const c = narrative(t.locale).stack;
  return (
    <section id="stack" className={styles.stack} aria-labelledby="stack-title">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 id="stack-title" className={styles.title}>{c.title}</h2>
          <Link className={styles.docs} href={`/${t.locale}/docs#architecture`}>
            {t.stack.docsLink}
            <Icon name="arrow" />
          </Link>
        </div>
        <ul className={`${styles.pieces} reveal`} role="list">
          {t.stack.badges.map((badge, i) => (
            <li key={badge.name} className={styles.piece} style={{ "--i": i } as CSSProperties}>
              <span className={styles.mark} aria-hidden="true">{badge.name === "Stellar" ? <StellarIcon /> : <Icon name={MARKS[badge.name] ?? "layers"} />}</span>
              <strong className={styles.name}>{badge.name}</strong>
              <span className={styles.role}>{badge.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
