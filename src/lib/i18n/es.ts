import type { Copy } from "./types";
import { docsEs } from "./docs.es";

export const es: Copy = {
  locale: "es",
  htmlLang: "es",
  meta: {
    title: "TilcAI — Políticas de gasto y señales de confianza para pagos de agentes (en desarrollo)",
    description:
      "TilcAI es un SDK y gateway en etapa temprana, en desarrollo, que pone políticas de gasto definidas por personas y recibos verificables entre la intención de un agente de IA y el dinero. Empieza en Stellar testnet con USDC y x402.",
    docsTitle: "Arquitectura propuesta — TilcAI (en desarrollo)",
    docsDescription:
      "La arquitectura propuesta de TilcAI: árbol de presupuestos compartido en Soroban, gateway de políticas para pagos x402, recibos de decisión y señales de confianza acotadas. Documento de diseño, no una API pública.",
  },
  a11y: {
    skip: "Saltar al contenido",
    langSwitch: "Idioma",
    menu: "Menú",
    copied: "Copiado",
    copy: "Copiar",
    codeTabs: "Estructuras de datos propuestas",
  },
  nav: {
    problem: "Problema",
    flow: "Flujo",
    demo: "Demo",
    capabilities: "Capacidades",
    code: "Interfaz",
    roadmap: "Hoja de ruta",
    docs: "Arquitectura",
    home: "Inicio",
  },
  stageLabels: {
    elite: "Stellar Elite · en desarrollo",
    meridian: "HackMeridian · planificado",
    vision: "Visión · sin fecha",
  },
  hero: {
    status: "Etapa temprana · En desarrollo",
    title: "Da poder de compra a los agentes. Mantén el control humano.",
    lead:
      "TilcAI es un SDK y gateway en desarrollo para políticas de gasto y señales de confianza en pagos entre agentes. Antes de que un agente pague, TilcAI comprueba a quién se paga, por qué y con qué presupuesto; luego permite, bloquea o escala, y guarda un recibo. Empezamos por Stellar.",
    visionNote:
      "La visión: agentes que actúan por personas y pequeñas empresas, y que descubren, reservan y pagan servicios. El primer caso de uso es mucho más acotado: un agente que compra un servicio digital de prueba en Stellar testnet.",
    ctaPrimary: "Explorar la arquitectura",
    ctaSecondary: "Ver el flujo de pago",
    facts: ["Stellar primero", "Solo testnet", "Sin fondos reales", "Nada está en producción"],
    logoAlt: "Logo de TilcAI: cabeza de un tilcayo (gato andino) junto al nombre TilcAI",
  },
  problem: {
    eyebrow: "El problema",
    title: "Una wallet no es un mandato.",
    lead:
      "Los agentes ya pueden descubrir y pagar APIs y herramientas. Pero un agente con una wallet con fondos no sabe, por sí mismo, cuál es su presupuesto, a quién debe pagar ni bajo qué condiciones.",
    cards: [
      {
        title: "Los presupuestos se multiplican",
        body:
          "Un orquestador lanza subagentes. Tres agentes con un límite de 1 USDC cada uno pueden gastar 3 USDC, no 1. Nada los une a un único presupuesto.",
      },
      {
        title: "El límite no mira la compra",
        body:
          "Un tope por pago no impide un pago pequeño a un endpoint clonado, a un destinatario sustituido o a un servicio que nadie aprobó.",
      },
      {
        title: "Las instrucciones se pueden secuestrar",
        body:
          "Una inyección de prompt o un bucle de reintentos puede cambiar el monto o el destinatario, o repetir una compra que ya se hizo.",
      },
      {
        title: "Nadie puede explicar el pago",
        body:
          "Un hash de transacción prueba una transferencia. No prueba quién la autorizó, bajo qué regla, ni por qué se rechazó otro pago.",
      },
    ],
    question:
      "¿Puede este agente, con fondos de este principal, pagar este monto a este proveedor por este recurso, ahora mismo? ¿Y dónde queda la prueba?",
  },
  flow: {
    eyebrow: "Flujo propuesto",
    title: "El modelo propone. Reglas deterministas deciden.",
    lead:
      "El precio y el destinatario salen del desafío de pago 402 del servicio, nunca de texto libre escrito por el modelo. Todo lo que no se puede verificar se rechaza.",
    steps: [
      { label: "Agente", detail: "Pide un recurso de pago mediante el SDK o una herramienta MCP; nunca una herramienta genérica de «transferir»." },
      { label: "Intención de pago", detail: "Se normaliza el desafío 402: recurso, proveedor, red, activo, monto, destinatario y vencimiento." },
      { label: "Identidad + política", detail: "Perfil del proveedor, servicios permitidos, tope por pago, presupuesto compartido, duplicados y pausa." },
    ],
    decisions: [
      { label: "ALLOW", detail: "Todas las reglas se cumplen.", tone: "allow" },
      { label: "DENY", detail: "Alguna regla falla o no se puede verificar.", tone: "deny" },
      { label: "REQUIRE_HUMAN", detail: "Sobre un umbral: se detiene y pregunta.", tone: "human" },
    ],
    after: [
      { label: "x402 + USDC en Stellar", detail: "Solo con ALLOW: el pago se firma y se liquida en testnet mediante un facilitador x402.", tone: "rail" },
      { label: "Recibo de decisión", detail: "Registro firmado con códigos de motivo, hash de política y transacción, para cada sí y cada no.", tone: "neutral" },
    ],
    receiptNote: "Un pago rechazado no mueve fondos, pero igual genera un recibo que explica por qué.",
    visionTitle: "Visión",
    vision:
      "Una persona pide a su agente reservar una cita o una entrada. El agente de un negocio publica disponibilidad, precio y condiciones. El agente comprador confirma con la autoridad limitada de su dueño. Hacia ahí va TilcAI; no está construido y no se promete para un hackathon.",
    firstCaseTitle: "Primer caso de uso",
    firstCase:
      "Un agente compra un servicio digital de prueba (un pequeño informe que cuesta unos centavos de USDC de testnet) a un vendedor de referencia que operamos nosotros. Una compra se permite; las compras alteradas, repetidas o fuera de presupuesto se bloquean.",
  },
  demo: {
    eyebrow: "Demo conceptual interactiva",
    title: "¿Qué decidiría la política?",
    lead: "Elige una intención de pago de ejemplo. Ilustra una regla propuesta: solo puede pasar el destinatario aprobado con un monto dentro del límite.",
    prompt: "Elige un escenario",
    scenarios: [
      { label: "Compra aprobada", detail: "0,05 USDC · vendedor aprobado", outcome: "ALLOW", reason: "El destinatario y el monto cumplen la política de ejemplo." },
      { label: "Destinatario cambiado", detail: "0,05 USDC · vendedor desconocido", outcome: "DENY", reason: "El destinatario no está en la lista permitida." },
      { label: "Supera el límite", detail: "0,15 USDC · vendedor aprobado", outcome: "DENY", reason: "Supera el límite de 0,10 USDC por pago." },
    ],
    empty: "Selecciona un escenario para ver una decisión de ejemplo.",
    caveat: "Solo simulación visual. Sin wallet, oferta autenticada, petición x402, transacción en Stellar ni fondos reales. ALLOW aquí no efectúa un pago.",
  },
  capabilities: {
    eyebrow: "Capacidades previstas",
    title: "Qué estamos construyendo y cuándo.",
    lead:
      "Cada capacidad indica la etapa en la que está prevista. Ninguna está lanzada. El alcance es deliberadamente acotado para que cada afirmación se pueda demostrar.",
    items: [
      {
        stage: "elite",
        title: "Árbol de presupuestos compartido en Soroban",
        body:
          "Un principal financia un presupuesto raíz en un contrato Soroban y lo reparte en submandatos. Un hijo nunca puede superar a su padre, cada gasto se descuenta hacia arriba en el árbol y un guardián puede pausar o revocar una rama.",
        note: "Contrato aún no desplegado.",
      },
      {
        stage: "elite",
        title: "Políticas de pago deterministas",
        body:
          "Red, activo y esquema permitidos; proveedores y recursos permitidos; tope por pago; presupuesto restante; intenciones duplicadas; vencimiento y pausa. Rechazo por defecto.",
      },
      {
        stage: "elite",
        title: "Señales de confianza v0, acotadas a propósito",
        body:
          "Identidad: un perfil firmado del proveedor, comprobado antes de pagar. Reputación: feedback del comprador ligado a un recibo pagado y entregado. Validación: una comprobación firmada del formato y la frescura de la respuesta, hecha por otra clave.",
        note: "Inspiradas en los conceptos de ERC-8004; no son una implementación del estándar.",
      },
      {
        stage: "elite",
        title: "Recibos de decisión",
        body:
          "Cada decisión, incluidos los rechazos, genera un recibo firmado con códigos de motivo, hashes de intención y de política, y la transacción cuando la hay.",
      },
      {
        stage: "meridian",
        title: "Ofertas firmadas del vendedor",
        body:
          "Un negocio publica una oferta (servicio, precio, activo, red, destinatario y vencimiento) firmada con su clave. El agente comprador la contrasta con una clave en la que su dueño ya confía y con el desafío 402.",
      },
      {
        stage: "vision",
        title: "Comercio entre agentes y negocios",
        body:
          "Reservas, inventario, cancelaciones y reembolsos entre agentes de personas y pequeñas empresas. Primero requiere validación con negocios reales.",
      },
    ],
    disclaimer: "Previsto, no lanzado. Si algo no queda terminado en una etapa, lo diremos en lugar de presentarlo como hecho.",
  },
  code: {
    eyebrow: "Interfaz propuesta",
    title: "Datos legibles, no magia.",
    lead:
      "Estas estructuras conceptuales muestran sobre qué razona el gateway. No son un paquete publicado ni una API pública.",
    label: "Interfaz propuesta — sujeta a cambios",
    tabs: [
      { id: "intent", name: "PaymentIntent", caption: "Se normaliza a partir de un desafío 402, antes de cualquier firma." },
      { id: "receipt", name: "DecisionReceipt", caption: "Un rechazo también genera un recibo firmado. No se movieron fondos." },
      { id: "offer", name: "SignedOffer", caption: "Previsto para HackMeridian: condiciones publicadas y firmadas por el vendedor." },
    ],
    bullets: [
      "El precio y el destinatario se leen del desafío del servicio, nunca de la salida del modelo.",
      "Los códigos de motivo son legibles por máquinas, así un agente puede entender un rechazo.",
      "Los nombres de campos son ilustrativos y cambiarán mientras se construye el MVP.",
    ],
  },
  compare: {
    eyebrow: "Comparación",
    title: "Una wallet con fondos frente al flujo propuesto.",
    lead: "El mismo agente y la misma solicitud de pago, con y sin una capa de políticas en medio.",
    colTopic: "Pregunta",
    colWallet: "Agente solo con una wallet con fondos",
    colTilcai: "Flujo propuesto de TilcAI",
    rows: [
      { topic: "Presupuesto entre subagentes", walletOnly: "Cada clave gasta su propio saldo; los totales se suman.", tilcai: "Un presupuesto raíz; los hijos nunca superan a su padre." },
      { topic: "De dónde salen precio y destinatario", walletOnly: "De lo que el agente decida enviar.", tilcai: "Del desafío 402, contrastado con la política (y, más adelante, con una oferta firmada)." },
      { topic: "Qué proveedores y servicios", walletOnly: "Cualquier dirección que reciba el agente.", tilcai: "Solo los proveedores y recursos permitidos para ese agente." },
      { topic: "Compra repetida", walletOnly: "Paga otra vez.", tilcai: "La misma intención se rechaza." },
      { topic: "Pago grande o inusual", walletOnly: "Se firma como cualquier otro.", tilcai: "Se detiene y pide a una persona sobre un umbral." },
      { topic: "Pago rechazado", walletOnly: "Sin rastro ni explicación.", tilcai: "Recibo firmado con códigos de motivo." },
      { topic: "Si el agente se compromete", walletOnly: "Todo el saldo de la wallet está en riesgo.", tilcai: "Diseñado para limitar la pérdida a un saldo operativo pequeño más su submandato restante." },
    ],
    footnote: "Esto compara un diseño con una configuración genérica. No es una comparación con ningún producto concreto.",
  },
  stack: {
    eyebrow: "Stack previsto",
    title: "Stellar primero, a propósito.",
    lead:
      "El MVP apunta a una sola red, un activo y un esquema, para que cada paso se pueda verificar. Las interfaces son neutrales respecto de la red, pero solo se está construyendo Stellar.",
    badges: [
      { name: "Stellar Testnet", role: "Red del MVP" },
      { name: "Soroban", role: "Contrato del árbol de presupuestos" },
      { name: "USDC (SEP-41)", role: "Activo de pago" },
      { name: "x402 · exact", role: "Desafío de pago HTTP" },
      { name: "TypeScript", role: "Gateway y SDK" },
      { name: "MCP", role: "Herramientas para agentes" },
    ],
    disclaimer:
      "Tecnologías que planeamos usar. Mencionarlas no implica alianza, patrocinio ni una integración terminada. No se afirma soporte para otras redes.",
  },
  roadmap: {
    eyebrow: "Hoja de ruta",
    title: "Un proyecto, dos etapas de construcción.",
    lead: "Comprador y vendedor son dos roles de la misma transacción, no dos productos.",
    stages: [
      {
        stage: "elite",
        when: "Mediados de octubre de 2026",
        title: "Base compradora — bootcamp Stellar Elite",
        items: [
          "Contrato del árbol de presupuestos en Soroban (testnet)",
          "Gateway de políticas para pagos x402, SDK y herramienta MCP",
          "Servicio pagado de referencia operado por nosotros",
          "Recibos de decisión firmados, incluidos los rechazos",
          "Señales de confianza v0: identidad, feedback ligado al recibo, validación de formato y frescura",
          "Casos adversariales: pagos alterados, repetidos y fuera de presupuesto",
        ],
      },
      {
        stage: "meridian",
        when: "HackMeridian · 25–26 de octubre de 2026",
        title: "Ampliación vendedora — ofertas firmadas",
        items: [
          "Kit pequeño para que el vendedor publique una oferta firmada",
          "El comprador verifica la oferta contra una clave fijada de antemano y contra el desafío 402",
          "La oferta auténtica se paga; un precio o destinatario alterado se bloquea",
          "El trabajo previo al evento se etiqueta aparte de lo construido allí",
        ],
        note: "La participación depende de ser aceptados en el evento.",
      },
    ],
    signatureTitle: "Una firma por sí sola nunca autoriza un pago",
    signatureChecks: [
      "El principal ya confiaba en la clave del vendedor; no se toma del mismo archivo que se verifica.",
      "El servicio, el precio, el activo, la red y el destinatario de la oferta coinciden exactamente con el desafío 402.",
      "La política de gasto y el presupuesto compartido restante todavía lo permiten.",
    ],
    signatureNote:
      "Una firma protege contra cambios en las condiciones después de firmar. No protege contra una clave robada, un origen de phishing ni una política mal configurada.",
  },
  cta: {
    title: "Lee cómo debería funcionar.",
    body:
      "La página de arquitectura explica los componentes propuestos, las reglas de decisión, los límites de seguridad y lo que queda fuera del alcance, además de qué partes siguen siendo planes.",
    primary: "Explorar la arquitectura",
    secondary: "Volver al flujo",
  },
  footer: {
    status: "TilcAI es un proyecto en etapa temprana. La demo interactiva es una simulación; no hay servicio de pagos activo ni fondos reales.",
    rights: "© 2026 equipo TilcAI",
  },
  notFound: { title: "Página no encontrada", body: "Esta página no existe. El proyecto está en etapa temprana, así que los enlaces todavía pueden cambiar.", back: "Volver al resumen" },
  docs: docsEs,
};
