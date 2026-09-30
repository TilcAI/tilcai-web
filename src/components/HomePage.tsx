import type { Copy } from "@/lib/i18n";
import { CapabilitiesSection } from "./sections/CapabilitiesSection";
import { CompareSection } from "./sections/CompareSection";
import { CtaSection } from "./sections/CtaSection";
import { DemoSection } from "./sections/DemoSection";
import { FlowSection } from "./sections/FlowSection";
import { HeroSection } from "./sections/HeroSection";
import { InterfaceSection } from "./sections/InterfaceSection";
import { ProblemSection } from "./sections/ProblemSection";
import { ProductOverview } from "./sections/ProductOverview";
import { RoadmapSection } from "./sections/RoadmapSection";
import { StackSection } from "./sections/StackSection";

/** Landing composition. Server component: every section renders on the server. */
export function HomePage({ t }: { t: Copy }) {
  return (
    <>
      <HeroSection t={t} />
      <ProductOverview t={t} />
      <ProblemSection t={t} />
      <FlowSection t={t} />
      <DemoSection t={t} />
      <CapabilitiesSection t={t} />
      <InterfaceSection t={t} />
      <CompareSection t={t} />
      <StackSection t={t} />
      <RoadmapSection t={t} />
      <CtaSection t={t} />
    </>
  );
}
