import type { Locale } from "./types";

/**
 * "Soluciones para empresas": the companies that are already implementing TilcAI, and the ones that come next.
 *
 * What may be said here is bounded by the official context (documentation/0-OFICIAL): everything runs on a test network
 * and nothing is audited. Optipagos is "en implementación": its backend talks to tilcai-infrastructure, and the section
 * shows a real capture of its WhatsApp chat inside a phone (the figures and the verification note are no longer shown).
 * What Optipagos does, as its team states it: it charges in bolivianos with a QR, credits USDC to a WhatsApp wallet and
 * its payments run on Avalanche.
 * Baral is a next implementation: no technical integration is claimed for it.
 */
export type SolutionStatus = "implementing" | "next";

interface Step { title: string; text: string }

interface SolutionsCopy {
  eyebrow: string;
  title: string;
  lead: string;
  /** The word on each card's status pill. The colour is never the only signal. */
  status: Record<SolutionStatus, string>;
  optipagos: {
    name: string; kicker: string; title: string; body: string;
    /** How the money moves, in three marks: what is paid with, what is received, and the network. */
    route: { label: string; items: Step[] };
    /** What the capture shows, in the order it happens; the hint says the steps can be touched. */
    stepsLabel: string; stepsHint: string; steps: Step[];
    /** The real capture of the chat, shown inside a phone. */
    phone: { alt: string; caption: string };
  };
  baral: {
    name: string; kicker: string; title: string; body: string; scopeLabel: string; scope: string; logoAlt: string;
    /** The journey every implementation follows, drawn as pending: nothing of it is claimed for Baral yet. */
    journey: { label: string; steps: string[] };
  };
  invite: { title: string; body: string; link: string };
}

const es: SolutionsCopy = {
  eyebrow: "Soluciones para empresas",
  title: "Empresas que ya implementan TilcAI.",
  lead: "Cada empresa conserva su sistema, su cliente y su cobro. TilcAI se suma por detrás: la orden, la aprobación, el pago y un recibo para cada lado.",
  status: { implementing: "En implementación", next: "Próxima implementación" },
  optipagos: {
    name: "Optipagos",
    kicker: "Pagos para wallet de WhatsApp",
    title: "Paga en bolivianos con QR y recibe USDC en WhatsApp.",
    body: "Optipagos cobra en bolivianos con QR y acredita USDC en una wallet de WhatsApp. Sus pagos corren sobre Avalanche con TilcAI: la orden, el desembolso y el recibo.",
    route: {
      label: "Cómo se mueve el dinero",
      items: [
        { title: "Bolivianos", text: "Pagas con QR en Bs" },
        { title: "USDC", text: "Lo recibes en tu wallet de WhatsApp" },
        { title: "Avalanche", text: "La red sobre la que corren los pagos" },
      ],
    },
    stepsLabel: "Lo que muestra la captura",
    stepsHint: "Toca un paso para ver dónde está",
    steps: [
      { title: "Confirmas con tu huella o rostro", text: "Antes de enviar, el chat muestra el monto, el destino y la comisión, y pide tu confirmación." },
      { title: "Recibes el comprobante", text: "Cuando el pago se completa, el comprobante llega al mismo chat." },
    ],
    phone: {
      alt: "Captura de WhatsApp del chat de Optipagos: un mensaje pide confirmar con huella o rostro el envío de 10.00 USDC y, debajo, el comprobante «Pago completado».",
      caption: "Captura real · chat de Optipagos en WhatsApp",
    },
  },
  baral: {
    name: "Baral",
    kicker: "Pagos para Baral",
    title: "La siguiente en la lista.",
    body: "Agencia de estrategia integral creativa. Sus pagos entran en las próximas implementaciones de TilcAI.",
    scopeLabel: "Alcance",
    scope: "Por confirmar con la empresa",
    logoAlt: "Baral, estrategia integral creativa",
    journey: { label: "El mismo recorrido", steps: ["Orden", "Aprobación", "Pago", "Recibo"] },
  },
  invite: {
    title: "¿Tu empresa es la siguiente?",
    body: "Empieza por un solo caso: una orden con precio, aprobación y recibo. Tú sigues decidiendo precio, destino de cobro y entrega.",
    link: "Ver cómo se conecta",
  },
};

const en: SolutionsCopy = {
  eyebrow: "Solutions for businesses",
  title: "Businesses already implementing TilcAI.",
  lead: "Each business keeps its system, its customer and its charge. TilcAI joins from behind: the order, the approval, the payment and a receipt for each side.",
  status: { implementing: "Being implemented", next: "Next implementation" },
  optipagos: {
    name: "Optipagos",
    kicker: "Payments for WhatsApp wallets",
    title: "Pay in bolivianos with a QR and receive USDC in WhatsApp.",
    body: "Optipagos charges in bolivianos with a QR and credits USDC to a WhatsApp wallet. Its payments run on Avalanche with TilcAI: the order, the disbursement and the receipt.",
    route: {
      label: "How the money moves",
      items: [
        { title: "Bolivianos", text: "You pay with a QR in Bs" },
        { title: "USDC", text: "You receive it in your WhatsApp wallet" },
        { title: "Avalanche", text: "The network the payments run on" },
      ],
    },
    stepsLabel: "What the capture shows",
    stepsHint: "Tap a step to see where it is",
    steps: [
      { title: "You confirm with your fingerprint or face", text: "Before sending, the chat shows the amount, the destination and the fee, and asks for your confirmation." },
      { title: "You get the receipt", text: "When the payment completes, the receipt arrives in the same chat." },
    ],
    phone: {
      alt: "WhatsApp screenshot of the Optipagos chat: a message asks to confirm the 10.00 USDC transfer with a fingerprint or face and, below it, the \u201CPayment completed\u201D receipt.",
      caption: "Real screenshot · Optipagos chat on WhatsApp",
    },
  },
  baral: {
    name: "Baral",
    kicker: "Payments for Baral",
    title: "Next on the list.",
    body: "An integrated creative strategy agency. Its payments join the next TilcAI implementations.",
    scopeLabel: "Scope",
    scope: "To be confirmed with the business",
    logoAlt: "Baral, integrated creative strategy",
    journey: { label: "The same journey", steps: ["Order", "Approval", "Payment", "Receipt"] },
  },
  invite: {
    title: "Is your business next?",
    body: "Start with a single case: an order with a price, an approval and a receipt. You keep deciding price, payout destination and delivery.",
    link: "See how it connects",
  },
};

export function solutions(locale: Locale): SolutionsCopy {
  return locale === "es" ? es : en;
}

export type { SolutionsCopy };
