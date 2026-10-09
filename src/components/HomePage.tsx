import type { Copy } from "@/lib/i18n";
import { AgentCatalog } from "./AgentCatalog";
import { FaqSection } from "./FaqSection";
import { BusinessesSection } from "./sections/BusinessesSection";
import { ControlSection } from "./sections/ControlSection";
import { CtaSection } from "./sections/CtaSection";
import { DemoSection } from "./sections/DemoSection";
import { FlowSection } from "./sections/FlowSection";
import { HeroSection } from "./sections/HeroSection";
import { OfficeHero } from "./office/OfficeHero";
import { OfficeLegendSection, OfficeRoomsSection } from "./sections/OfficeLegendSection";
import { ProductOverview } from "./sections/ProductOverview";
import { BuyerEntrances } from "./sections/BuyerEntrances";
import { RailsSection } from "./sections/RailsSection";
import { StackSection } from "./sections/StackSection";

/** Landing composition. Server component: every section renders on the server. */
export function HomePage({ t }: { t: Copy }) {
  return (
    <>
      <HeroSection t={t} />
      <OfficeHero t={t} />
      <ProductOverview t={t} />
      <OfficeLegendSection t={t} />
      <OfficeRoomsSection t={t} />
      <BusinessesSection t={t} />
      <FlowSection t={t} />
      <RailsSection t={t} />
      <DemoSection t={t} />
      <ControlSection t={t} />
      <BuyerEntrances t={t} />
      <AgentCatalog t={t} />
      <StackSection t={t} />
      <FaqSection t={t.faq} />
      <CtaSection t={t} />
    </>
  );
}
