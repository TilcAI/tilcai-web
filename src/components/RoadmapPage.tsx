import Link from "next/link";
import type { Copy } from "@/lib/i18n";
import { paths } from "@/lib/site";
import { Icon } from "./Icon";
import { RoadmapSection } from "./sections/RoadmapSection";

export function RoadmapPage({ t }: { t: Copy }) {
  const r = t.roadmap;
  return (
    <div className="roadmap-page">
      <div className="docs-hero">
        <div className="container">
          <Link className="toc-back" href={paths.home(t.locale)} style={{ marginTop: 0, marginBottom: "20px" }}>
            <Icon name="arrow" className="icon flip" />
            {t.nav.home}
          </Link>
          <p className="eyebrow">{r.eyebrow}</p>
          <h1 id="road-title">{r.title}</h1>
          <p className="lead">{r.lead}</p>
        </div>
      </div>
      <RoadmapSection t={t} hideHeader />
    </div>
  );
}
