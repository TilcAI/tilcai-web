import type { Copy } from "@/lib/i18n";
import { AgentCatalog } from "./AgentCatalog";
import { FaqSection } from "./FaqSection";
import { CapabilitiesSection } from "./sections/CapabilitiesSection";
import { CompareSection } from "./sections/CompareSection";
import { CtaSection } from "./sections/CtaSection";
import { DemoSection } from "./sections/DemoSection";
import { FlowSection } from "./sections/FlowSection";
import { HeroSection } from "./sections/HeroSection";
import { InterfaceSection } from "./sections/InterfaceSection";
import { OfficeLegendSection } from "./sections/OfficeLegendSection";
import { ProductOverview } from "./sections/ProductOverview";
import { RoadmapSection } from "./sections/RoadmapSection";
import { StackSection } from "./sections/StackSection";

/** Landing composition. Server component: every section renders on the server. */
export function HomePage({ t }: { t: Copy }) {
  return (
    <>
      <HeroSection t={t} />
      <ProductOverview t={t} />
      <OfficeLegendSection t={t} />
      <FlowSection t={t} />
      <DemoSection t={t} />
      <CapabilitiesSection t={t} />
      <AgentCatalog t={t} />
      <InterfaceSection t={t} />
      <CompareSection t={t} />
      <StackSection t={t} />
      <RoadmapSection t={t} />
      <FaqSection t={t.faq} />
      <CtaSection t={t} />
    </>
  );
}
