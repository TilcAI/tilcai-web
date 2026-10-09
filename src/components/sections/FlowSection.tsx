import type { Copy } from "@/lib/i18n";
import { OperationSection } from "./operation/OperationSection";

/**
 * "Cómo funciona": one operation told in order (request, offer, rules, approval, payment, two receipts). The section lives in
 * `./operation`: a single SVG scene and a single scroll timeline, with the six step cards beside it. Kept here so the page
 * composition and the `#flow` anchor stay where they were.
 */
export function FlowSection({ t }: { t: Copy }) {
  return <OperationSection t={t} />;
}
