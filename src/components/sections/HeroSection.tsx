import type { Copy } from "@/lib/i18n";
import { HeroExperience } from "./HeroExperience";

/** Brand-led opening screen. The office simulation follows immediately below. */
export function HeroSection({ t }: { t: Copy }) {
  return <HeroExperience t={t} />;
}
