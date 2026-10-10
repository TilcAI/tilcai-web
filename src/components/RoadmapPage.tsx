import type { Copy } from "@/lib/i18n";
import { paths } from "@/lib/site";
import { PageCrumbs } from "./PageCrumbs";
import { RoadmapSection } from "./sections/RoadmapSection";
import styles from "./RoadmapPage.module.css";

export function RoadmapPage({ t }: { t: Copy }) {
  const r = t.roadmap;
  return (
    <div className={`roadmap-page ${styles.page}`}>
      <div className={`docs-hero ${styles.hero}`}>
        <div className="container">
          <PageCrumbs label={r.breadcrumb} homeHref={paths.home(t.locale)} homeLabel={t.nav.home} current={r.eyebrow} />
          <h1 id="road-title">{r.title}</h1>
          <p className="lead">{r.lead}</p>
        </div>
      </div>
      <RoadmapSection t={t} hideHeader />
    </div>
  );
}
