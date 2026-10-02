import type { CSSProperties } from "react";
import type { BusinessProfile } from "@/lib/content/businesses";
import type { Copy } from "@/lib/i18n";
import { BusinessCard } from "./BusinessCard";
import "@/app/businesses.css";

/**
 * The 4/3/2/1 column grid, shared by the public section and the design preview. Each item reveals
 * once with a short stagger; the card inside keeps its own hover and focus elevation.
 */
export function BusinessGrid({ profiles, t }: { profiles: readonly BusinessProfile[]; t: Copy }) {
  return (
    <ul className="business-grid" role="list">
      {profiles.map((business, index) => (
        <li key={business.id} className="reveal" style={{ "--i": index } as CSSProperties}>
          <BusinessCard business={business} t={t} />
        </li>
      ))}
    </ul>
  );
}
