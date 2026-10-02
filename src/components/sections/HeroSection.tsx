import type { Copy } from "@/lib/i18n";
import { OfficeHero } from "../office/OfficeHero";

/** Full-screen hero: the live TilcAI office simulation holds the page's only <h1>. */
export function HeroSection({ t }: { t: Copy }) {
  return <OfficeHero t={t} />;
}
