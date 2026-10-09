import Link from "next/link";
import type { Copy } from "@/lib/i18n";
import { paths } from "@/lib/site";
import { Icon } from "./Icon";
import { RoadmapSection } from "./sections/RoadmapSection";
import styles from "./RoadmapPage.module.css";

export function RoadmapPage({ t }: { t: Copy }) {
  const r = t.roadmap;
  return (
    <div className={`roadmap-page ${styles.page}`}>
      <div className={`docs-hero ${styles.hero}`}>
        <div className="container">
          <nav className={styles.crumbs} aria-label={r.breadcrumb}>
            <Link href={paths.home(t.locale)}>
              <Icon name="arrow" className="icon flip" />
              {t.nav.home}
            </Link>
            <span className={styles.sep} aria-hidden="true">
              /
            </span>
            <span className={styles.here} aria-current="page">
              {r.eyebrow}
            </span>
          </nav>
          <h1 id="road-title">{r.title}</h1>
          <p className="lead">{r.lead}</p>
        </div>
      </div>
      <RoadmapSection t={t} hideHeader />
    </div>
  );
}
