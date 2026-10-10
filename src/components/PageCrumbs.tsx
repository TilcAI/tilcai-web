import Link from "next/link";
import { Icon } from "./Icon";
import styles from "./PageCrumbs.module.css";

/** Where the person is, one step below the home page. Shared by the pages that open with a docs-style hero. */
export function PageCrumbs({
  label,
  homeHref,
  homeLabel,
  current,
}: {
  label: string;
  homeHref: string;
  homeLabel: string;
  current: string;
}) {
  return (
    <nav className={styles.crumbs} aria-label={label}>
      <Link href={homeHref}>
        <Icon name="arrow" className="icon flip" />
        {homeLabel}
      </Link>
      <span className={styles.sep} aria-hidden="true">
        /
      </span>
      <span className={styles.here} aria-current="page">
        {current}
      </span>
    </nav>
  );
}
