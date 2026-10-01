import type { Copy } from "@/lib/i18n";
import { businesses, publicBusinesses } from "@/lib/content/businesses";
import { BusinessGrid } from "../BusinessGrid";
import { Icon } from "../Icon";
import { SectionHead } from "./shared";
import "@/app/businesses.css";

export function BusinessesSection({ t }: { t: Copy }) {
  const profiles = publicBusinesses(businesses);

  return (
    <section id="businesses" className="section section-alt" aria-labelledby="businesses-title">
      <div className="container">
        <SectionHead id="businesses-title" eyebrow={t.businesses.eyebrow} title={t.businesses.title} lead={t.businesses.lead} />
        {profiles.length ? (
          <BusinessGrid profiles={profiles} t={t} />
        ) : (
          <div className="business-empty reveal">
            <span className="business-empty-icon" aria-hidden="true"><Icon name="store" /></span>
            <div>
              <p>{t.businesses.empty}</p>
              <a href="#capabilities" className="btn btn-ghost">{t.businesses.actions.pilot}<Icon name="arrow" /></a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
