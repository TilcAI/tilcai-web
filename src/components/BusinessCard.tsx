import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { BusinessDestination, BusinessProfile } from "@/lib/content/businesses";
import { businessAction } from "@/lib/content/businesses";
import type { Copy } from "@/lib/i18n";
import { Icon } from "./Icon";

/** Internal paths use client navigation; anchors stay plain; external pages never get the opener. */
function ActionLink({ href, className, children }: { href: BusinessDestination; className: string; children: ReactNode }) {
  if (href.startsWith("https://")) {
    return <a className={className} href={href} rel="noopener noreferrer">{children}</a>;
  }
  if (href.startsWith("/")) return <Link className={className} href={href}>{children}</Link>;
  return <a className={className} href={href}>{children}</a>;
}

/**
 * One premium card. What it shows is bounded by the profile's flags: media only when `mediaApproved`,
 * and the action is the strongest one that is really operational (never "Buy" without a validated flow).
 */
export function BusinessCard({ business, t }: { business: BusinessProfile; t: Copy }) {
  const action = businessAction(business);
  const copy = t.businesses;
  const showMedia = business.mediaApproved;
  const titleId = `business-${business.slug}-title`;

  return (
    <article className="business-card" aria-labelledby={titleId}>
      <div className="business-banner">
        {business.previewOnly && <span className="business-preview-label">{copy.previewOnly}</span>}
        {showMedia && business.bannerAsset ? (
          <Image src={business.bannerAsset} alt="" fill sizes="(min-width: 1200px) 25vw, (min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw" />
        ) : <span className="business-banner-placeholder" aria-hidden="true"><Icon name="store" /></span>}
      </div>
      <div className="business-content">
        <div className="business-identity">
          <span className="business-logo">
            {showMedia && business.logoAsset ? <Image src={business.logoAsset} alt="" fill sizes="56px" /> : <Icon name="store" />}
          </span>
          <span className="business-category">{copy.categories[business.category]}</span>
        </div>
        <h3 id={titleId}>{business.name}</h3>
        <p className="business-service">{copy.services[business.serviceSummaryKey]}</p>
        {business.locationLabel && <p className="business-location">{business.locationLabel}</p>}
        <ul className="business-status" role="list" aria-label={copy.statusLabel}>
          <li>{copy.relationships[business.relationship]}</li>
          <li>{copy.connections[business.connection]}</li>
        </ul>
        <ActionLink className="business-action" href={action.href}>
          <span>
            {copy.actions[action.kind]}
            {/* Several cards share the same action text: the name makes each link distinguishable. */}
            <span className="sr-only"> — {business.name}</span>
          </span>
          <Icon name="arrow" />
        </ActionLink>
      </div>
    </article>
  );
}
