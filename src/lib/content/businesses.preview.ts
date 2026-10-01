import type { BusinessProfile } from "./businesses";

/**
 * Design fixtures for reviewing layout at `/en/business-preview` and `/es/business-preview`, which
 * answer 404 outside development. They are generic placeholders, never named after a real company,
 * never approved, and `publicBusinesses` always filters them out of the public grid.
 *
 * Each card exercises a different case: a long name and a long service text (equal heights, no
 * clipping), a requested action that degrades to what is operational, and "buy" that stays hidden
 * because no purchase flow is validated.
 */
export const previewBusinesses: readonly BusinessProfile[] = [
  {
    id: "preview-1", slug: "preview-1", name: "Card 1", category: "digital", serviceSummaryKey: "exampleDigital",
    relationship: "participant", connection: "planned", publicationApproved: false, mediaApproved: false,
    action: "profile", profileHref: "#businesses", previewOnly: true,
  },
  {
    id: "preview-2", slug: "preview-2", name: "Card 2 · Lorem ipsum dolor sit amet consectetur", category: "booking",
    locationLabel: "Lorem ipsum", serviceSummaryKey: "exampleBooking",
    relationship: "partner", connection: "pilot", publicationApproved: false, mediaApproved: false,
    action: "scenario", profileHref: "#businesses", scenarioHref: "#demo", previewOnly: true,
  },
  {
    // Asks for an inquiry that is not operational: degrades to the scenario.
    id: "preview-3", slug: "preview-3", name: "Card 3", category: "commerce", serviceSummaryKey: "exampleDigital",
    relationship: "participant", connection: "testnet", publicationApproved: false, mediaApproved: false,
    action: "inquiry", inquiryOperational: false, inquiryHref: "#flow", scenarioHref: "#demo",
    profileHref: "#businesses", previewOnly: true,
  },
  {
    // Asks to buy without a validated flow: degrades to the inquiry that does work.
    id: "preview-4", slug: "preview-4", name: "Card 4", category: "experience", serviceSummaryKey: "exampleBooking",
    relationship: "partner", connection: "testnet", publicationApproved: false, mediaApproved: false,
    action: "purchase", purchaseFlowOperational: false, purchaseHref: "#flow",
    inquiryOperational: true, inquiryHref: "#flow", profileHref: "#businesses", previewOnly: true,
  },
];
