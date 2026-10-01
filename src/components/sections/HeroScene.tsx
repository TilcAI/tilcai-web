import type { Copy } from "@/lib/i18n";
import { CommerceScene } from "../CommerceScene";

/** Keep the section entry point while preserving the holographic presentation. */
export function HeroScene({ t }: { t: Copy }) {
  return <CommerceScene t={t} />;
}
