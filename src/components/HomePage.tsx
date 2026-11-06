import type { Copy } from "@/lib/i18n";
import { CtaSection } from "./sections/CtaSection";
import { HeroSection } from "./sections/HeroSection";
import { ProblemSection } from "./sections/ProblemSection";
import { SolutionIntroSection } from "./sections/SolutionIntroSection";
import { TechIntroSection } from "./sections/TechIntroSection";

/** Landing composition. Server component: every section renders on the server. */
export function HomePage({ t }: { t: Copy }) {
  return (
    <>
      <HeroSection t={t} />
      <ProblemSection t={t} />
      <SolutionIntroSection t={t} />
      <TechIntroSection t={t} />
      <CtaSection t={t} />
    </>
  );
}
