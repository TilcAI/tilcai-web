import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { PaymentRoutesSection } from "./rails/PaymentRoutesSection";

/**
 * Redesigned "Rutas de pago" section for TilcAI landing.
 * Seamless fintech / agentic commerce experience with live SVG routes,
 * interactive CCTP pipeline, network selection, and verifiable Stellar settlement.
 */
export function RailsSection({ t }: { t: Copy }) {
  const c = narrative(t.locale).rails;
  return (
    <>
      <PaymentRoutesSection t={t} />
      <div className="sr-only">
        <h3>{c.limits.title}</h3>
        <ul>{c.limits.items.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    </>
  );
}


