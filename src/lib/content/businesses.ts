// Public website content for the business grid (WEB-06 / WEB-02). Keep this module free of runtime
// imports: the tests load it directly with Node, and the dictionaries are only needed as types.
import type { BusinessCategoryKey, BusinessServiceKey } from "../i18n/types";

/** Internal path, in-page anchor or https URL. `//host` and other schemes are rejected by `businessProblems`. */
export type BusinessDestination = `/${string}` | `#${string}` | `https://${string}`;

export type BusinessRelationship = "participant" | "partner";
export type BusinessConnection = "planned" | "pilot" | "testnet" | "live";
export type BusinessActionKind = "profile" | "scenario" | "inquiry" | "purchase";

/**
 * Proposed in the web plan §8.4. `relationship` (commercial) and `connection` (technical) are
 * independent: an agreement is not a connection, and a connection is not a payment flow.
 */
export type BusinessProfile = {
  id: string;
  slug: string;
  /** Proper name, as the business publishes it. Not translated. */
  name: string;
  category: BusinessCategoryKey;
  locationLabel?: string;
  /** Only used when `mediaApproved` is true. Files live in `public/assets/businesses/`. */
  logoAsset?: string;
  bannerAsset?: string;
  /** Translated in `businesses.services` of both dictionaries. */
  serviceSummaryKey: BusinessServiceKey;
  relationship: BusinessRelationship;
  connection: BusinessConnection;
  /** Explicit approval to publish the profile (name, service, category). */
  publicationApproved: boolean;
  /** Separate permission to use the logo and banner on the web. */
  mediaApproved: boolean;
  /** The strongest action the business wants; `businessAction` never offers more than is operational. */
  action: BusinessActionKind;
  /** The safe fallback. It must exist: a profile page or an approved public page. */
  profileHref: BusinessDestination;
  scenarioHref?: BusinessDestination;
  inquiryHref?: BusinessDestination;
  purchaseHref?: BusinessDestination;
  /** True only when the inquiry really works end to end. */
  inquiryOperational?: boolean;
  /** True only when the full purchase flow is validated (authorization, payment, fulfillment). */
  purchaseFlowOperational?: boolean;
  /** Design fixtures. They never enter the public grid. */
  previewOnly?: boolean;
};

/**
 * The public registry. Add a business only after confirming its public name, service and publication
 * approval in docs/business-inventory.md. A contact is not a partnership, and an example is not a business.
 */
export const businesses: readonly BusinessProfile[] = [];

/** Only approved, non-fixture profiles reach the public grid. */
export function publicBusinesses(profiles: readonly BusinessProfile[]): BusinessProfile[] {
  return profiles.filter((profile) => profile.publicationApproved && !profile.previewOnly);
}

/** From most to least capable. A requested action can only degrade along this list, never upgrade. */
const ACTION_ORDER: readonly BusinessActionKind[] = ["purchase", "inquiry", "scenario", "profile"];

function destinationFor(profile: BusinessProfile, kind: BusinessActionKind): BusinessDestination | undefined {
  switch (kind) {
    // "Buy" needs a live connection, a validated purchase flow and a destination. Nothing less.
    case "purchase":
      return profile.connection === "live" && profile.purchaseFlowOperational === true ? profile.purchaseHref : undefined;
    // An inquiry must really work, and a merely planned connection cannot answer one.
    case "inquiry":
      return profile.connection !== "planned" && profile.inquiryOperational === true ? profile.inquiryHref : undefined;
    case "scenario":
      return profile.scenarioHref;
    case "profile":
      return profile.profileHref;
  }
}

/** The strongest action that is both requested and operational, falling back toward the profile. */
export function businessAction(profile: BusinessProfile): { kind: BusinessActionKind; href: BusinessDestination } {
  for (const kind of ACTION_ORDER.slice(ACTION_ORDER.indexOf(profile.action))) {
    const href = destinationFor(profile, kind);
    if (href) return { kind, href };
  }
  return { kind: "profile", href: profile.profileHref };
}

const SAFE_DESTINATION = /^(\/(?!\/)|#|https:\/\/)/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Data-quality problems of a profile; empty when it is consistent. Used by the tests. */
export function businessProblems(profile: BusinessProfile): string[] {
  const problems: string[] = [];
  if (!SLUG.test(profile.slug)) problems.push("slug must be lowercase letters, digits and hyphens");
  if (!profile.name.trim()) problems.push("name is empty");
  for (const [field, href] of [
    ["profileHref", profile.profileHref], ["scenarioHref", profile.scenarioHref],
    ["inquiryHref", profile.inquiryHref], ["purchaseHref", profile.purchaseHref],
  ] as const) {
    if (href !== undefined && !SAFE_DESTINATION.test(href)) problems.push(`${field} is not an internal path, anchor or https URL`);
  }
  if (profile.mediaApproved && !(profile.logoAsset && profile.bannerAsset)) {
    problems.push("mediaApproved is true but the logo or banner is missing");
  }
  if (!profile.mediaApproved && (profile.logoAsset || profile.bannerAsset)) {
    problems.push("media files are set without mediaApproved");
  }
  for (const asset of [profile.logoAsset, profile.bannerAsset]) {
    if (asset && !asset.startsWith("/assets/businesses/")) problems.push("business media must live in /assets/businesses/");
  }
  if (profile.purchaseFlowOperational && profile.connection !== "live") problems.push("a validated purchase flow requires a live connection");
  if (profile.previewOnly && (profile.publicationApproved || profile.mediaApproved)) problems.push("a design fixture cannot be approved");
  return problems;
}
