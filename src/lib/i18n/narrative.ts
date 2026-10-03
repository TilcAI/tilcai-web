import type { Locale } from "./types";

interface NarrativeCopy {
  business: { title: string; lead: string; label: string; status: string; pilot: string; tabs: { title: string; body: string; artifact: string; lines: string[] }[] };
  flow: { title: string; lead: string; label: string; agent: string; business: string; steps: { title: string; body: string; detail: string; artifact: string; lines: string[] }[] };
  control: { title: string; lead: string; recipient: string; recipientValue: string; expiry: string; expiryValue: string; review: string; docs: string };
  stack: { title: string; note: string; roles: string[] };
  cta: { title: string; body: string; primary: string; secondary: string };
}

const es: NarrativeCopy = {
  business: {
    title: "Tu negocio, listo para conversar con agentes.",
    lead: "Tus servicios y condiciones. Una nueva forma de recibir solicitudes.",
    label: "Así se conectaría tu negocio", status: "Integración en preparación", pilot: "Explorar un piloto",
    tabs: [
      { title: "Publica tus servicios", body: "Conecta tu catálogo y disponibilidad para que un agente pueda consultar lo que realmente ofreces.", artifact: "Catálogo", lines: ["Servicios y disponibilidad", "Condiciones de tu negocio", "Datos desde tu sistema"] },
      { title: "Responde con condiciones", body: "Cada solicitud recibe una cotización con precio, destinatario y vigencia. La persona decide si autoriza.", artifact: "Cotización", lines: ["Importe y destinatario", "Vigencia de la oferta", "Aprobación por compra"] },
      { title: "Confirma el resultado", body: "Vincula la orden con su pago y confirma la entrega desde tu operación. Cada resultado tiene su propia evidencia.", artifact: "Orden", lines: ["Pago conciliado", "Entrega del negocio", "Comprobantes separados"] },
    ],
  },
  flow: {
    title: "Una solicitud. Cuatro momentos claros.", lead: "Sigue una compra desde la intención hasta sus comprobantes.",
    label: "Recorrido ilustrativo · sin movimientos de fondos", agent: "Tu agente", business: "El negocio",
    steps: [
      { title: "Solicita", body: "Tú defines la tarea y el límite. Tu agente aclara lo que falta antes de consultar al negocio.", detail: "El control empieza con una instrucción concreta.", artifact: "Tu solicitud", lines: ["Un reporte digital", "Hasta 1 USDC", "Solo para esta compra"] },
      { title: "Cotiza", body: "El negocio responde desde su sistema. TilcAI comprueba las condiciones, el destinatario y tu presupuesto.", detail: "Si una condición no coincide, el flujo se detiene.", artifact: "Oferta del negocio", lines: ["Reporte digital · 0,10 USDC", "Destino: Stellar Testnet", "Cotización con vencimiento"] },
      { title: "Autoriza", body: "Revisas los términos exactos y autorizas con tu wallet. Conectar una cuenta, por sí solo, no da permiso de gasto.", detail: "Cambiar importe o destinatario exige revisar la autorización.", artifact: "Revisión de la compra", lines: ["Importe: 0,10 USDC", "Límite: 1,00 USDC", "Requiere tu aprobación"] },
      { title: "Confirma", body: "El pago se concilia y el negocio confirma la entrega. Un recibo de pago y una evidencia de entrega cierran partes distintas de la operación.", detail: "Un resultado incierto se revisa antes de repetir el pago.", artifact: "Evidencias de la operación", lines: ["Decisión y autorización", "Comprobante de pago", "Confirmación de entrega"] },
    ],
  },
  control: { title: "Una tarea concreta. Un permiso limitado.", lead: "Tú decides qué se autoriza, cuánto puede gastar y cuándo deja de ser válido.", recipient: "Destinatario", recipientValue: "Negocio autorizado", expiry: "Vigencia", expiryValue: "Solo esta compra", review: "Condiciones para revisar", docs: "Entender los permisos" },
  stack: { title: "Las piezas detrás de cada operación.", note: "Componentes y protocolos del diseño · disponibilidad por integración", roles: ["Herramientas", "Liquidación", "Reglas de cuenta", "Activo", "Pagos HTTP", "Ejecución"] },
  cta: { title: "Explora cómo comprarían tus agentes.", body: "Prueba las decisiones en la demo o conoce cómo preparar tu negocio para un piloto.", primary: "Explorar la simulación", secondary: "Explorar para mi empresa" },
};

const en: NarrativeCopy = {
  business: {
    title: "Your business, ready to talk to agents.", lead: "Your services and terms. A new way to receive requests.",
    label: "How your business would connect", status: "Integration in preparation", pilot: "Explore a pilot",
    tabs: [
      { title: "Publish your services", body: "Connect your catalog and availability so an agent can inquire about what you actually offer.", artifact: "Catalog", lines: ["Services and availability", "Your business terms", "Data from your system"] },
      { title: "Respond with terms", body: "Each request receives a quote with a price, payee and expiry. The person decides whether to authorize it.", artifact: "Quote", lines: ["Amount and payee", "Offer validity", "Approval per purchase"] },
      { title: "Confirm the outcome", body: "Link the order to its payment and confirm delivery from your operation. Each outcome has its own evidence.", artifact: "Order", lines: ["Reconciled payment", "Business fulfillment", "Separate receipts"] },
    ],
  },
  flow: {
    title: "One request. Four clear moments.", lead: "Follow a purchase from intent to its supporting evidence.",
    label: "Illustrative journey · no funds move", agent: "Your agent", business: "The business",
    steps: [
      { title: "Request", body: "You define the task and the spending limit. Your agent clarifies missing details before asking the business.", detail: "Control starts with a specific instruction.", artifact: "Your request", lines: ["One digital report", "Up to 1 USDC", "For this purchase only"] },
      { title: "Get a quote", body: "The business responds from its own system. TilcAI checks the terms, payee and your budget.", detail: "If a condition does not match, the flow stops.", artifact: "Business offer", lines: ["Digital report · 0.10 USDC", "Destination: Stellar Testnet", "Quote with an expiry"] },
      { title: "Authorize", body: "You review the exact terms and authorize with your wallet. Connecting an account alone does not grant spending permission.", detail: "Changing the amount or payee requires reviewing authorization.", artifact: "Purchase review", lines: ["Amount: 0.10 USDC", "Limit: 1.00 USDC", "Requires your approval"] },
      { title: "Confirm", body: "The payment is reconciled and the business confirms fulfillment. A payment receipt and delivery evidence close distinct parts of the operation.", detail: "An uncertain outcome is reconciled before retrying a payment.", artifact: "Operation evidence", lines: ["Decision and authorization", "Payment receipt", "Delivery confirmation"] },
    ],
  },
  control: { title: "A specific task. A limited permission.", lead: "You decide what is authorized, how much it can spend and when it expires.", recipient: "Payee", recipientValue: "Authorized business", expiry: "Validity", expiryValue: "This purchase only", review: "Terms to review", docs: "Understand permissions" },
  stack: { title: "The pieces behind each operation.", note: "Design components and protocols · availability varies by integration", roles: ["Tools", "Settlement", "Account rules", "Asset", "HTTP payments", "Execution"] },
  cta: { title: "Explore how your agents would buy.", body: "Try the decisions in the demo or learn how to prepare your business for a pilot.", primary: "Explore the simulation", secondary: "Explore for my business" },
};

export const narrative = (locale: Locale): NarrativeCopy => locale === "es" ? es : en;
