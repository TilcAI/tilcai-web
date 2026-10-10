import type { Locale } from "./types";

interface FlowStepCopy { title: string; actor: string; state: string; body: string; detail: string; artifact: string; lines: string[] }
interface PathCopy { key: string; title: string; who: string; body: string }
interface EntranceCopy { id: "whatsapp" | "mcp" | "api"; title: string; body: string; status: string; note?: string }
/** Short labels drawn inside the animated scene. Decorative: every fact is also in the step cards beside it. */
interface FlowSceneCopy {
  agents: { claude: string; codex: string; own: string };
  request: string;
  offer: { price: string; priceValue: string; stock: string; stockValue: string; validity: string; validityValue: string; quote: string };
  core: string; checks: string[]; requires: string; approvedTag: string;
  review: { title: string; you: string; rows: string[]; reject: string; approve: string; approved: string; authorization: string };
  rail: string; stops: string[]; settled: string;
  receipts: { payment: string; delivery: string; paid: string; pending: string; confirmed: string; sameOrder: string; notDelivery: string };
}
interface RouteCopy { id: "direct" | "cctp"; title: string; tag: string; body: string; status: string; tone: "verified" | "lab"; note?: string }

interface NarrativeCopy {
  business: {
    title: string; lead: string; label: string;
    tabs: { title: string; body: string; artifact: string; lines: string[] }[];
    paths: {
      eyebrow: string; title: string; lead: string; items: PathCopy[];
      /** The three floating notes around the TilcAI node, and its accessible name. */
      hud: { connected: string; identity: string; data: string }; node: string;
    };
    keep: { title: string; yours: { title: string; lines: string[] }; ours: { title: string; lines: string[] }; note?: string };
  };
  flow: { title: string; lead: string; label: string; agent: string; business: string; actor: string; state: string; steps: FlowStepCopy[]; scene: FlowSceneCopy };
  control: { title: string; lead: string; recipient: string; recipientValue: string; expiry: string; expiryValue: string; review: string; docs: string };
  stack: { title: string; note?: string };
  cta: { title: string; body: string; primary: string; secondary: string; tertiary: string };
  rails: {
    eyebrow: string; title: string; lead: string; routes: RouteCopy[];
    /** Plain-language definition of paying across networks, with the term people may search for. */
    explainer: { term: string; title: string; body: string; note?: string };
    mapTitle: string; mapLead: string; origin: string; pipeline: string; destination: string;
    /** `plain` says what happens; `term` is the technical word, shown next to it. */
    pipelineSteps: { plain: string; term: string }[]; gasless: string; destinationName: string; destinationNote: string;
    legend: { verified: string; lab: string; vision: string }; visionNote: string; statuses: { verified: string; lab: string };
    limits: { title: string; items: string[] };
  };
  evidence: {
    eyebrow: string; title: string; lead: string; rows: { id: "gasless" | "external"; label: string; detail: string }[];
    burn: string; mint: string; open: string; note?: string; dateLabel: string; amount: string;
  };
  /** `shared`: the stretch every entrance ends in, named with the words of the lead ("identity, quote, approval, payment and receipts"). */
  entrances: { eyebrow: string; title: string; lead: string; items: EntranceCopy[]; shared: { label: string; steps: string[] }; footnote: string };
}

const es: NarrativeCopy = {
  business: {
    title: "Tu negocio, listo para conversar con agentes.",
    lead: "No necesitas un agente de IA ni un sitio web para empezar. Tú sigues decidiendo precio, disponibilidad, destino de cobro y entrega.",
    label: "Así se conectaría tu negocio",
    tabs: [
      { title: "Publica tus servicios", body: "Conecta tu catálogo y disponibilidad para que un agente pueda consultar lo que realmente ofreces.", artifact: "Catálogo", lines: ["Servicios y disponibilidad", "Condiciones de tu negocio", "Datos desde tu sistema"] },
      { title: "Responde con condiciones", body: "Cada solicitud recibe una cotización con precio, destinatario y vigencia. La persona decide si autoriza.", artifact: "Cotización", lines: ["Importe y destinatario", "Vigencia de la oferta", "Aprobación por compra"] },
      { title: "Confirma el resultado", body: "Vincula la orden con su pago y confirma la entrega desde tu operación. Cada resultado tiene su propia evidencia.", artifact: "Orden", lines: ["Pago conciliado", "Entrega del negocio", "Comprobantes separados"] },
    ],
    paths: {
      eyebrow: "Cuatro caminos para conectarte",
      title: "Empieza por donde estés hoy.",
      lead: "Un mismo negocio puede pasar de un camino a otro sin perder su identidad, su historial de órdenes ni su destino de cobro.",
      hud: { connected: "Tu negocio siempre conectado", identity: "Misma identidad en todos los caminos", data: "Datos, órdenes y pagos unificados" },
      node: "Núcleo de TilcAI: los cuatro caminos terminan aquí",
      items: [
        { key: "A", title: "Consola gestionada", who: "Sin software ni agente", body: "Un portal privado para publicar un catálogo pequeño, confirmar disponibilidad, recibir solicitudes, cotizar y ver órdenes y pagos." },
        { key: "B", title: "Archivo o planilla", who: "Con una hoja de cálculo o un sistema cerrado", body: "Importas tu catálogo desde un archivo; se valida y se publica con versión. El stock depende de que lo actualices o lo confirmes." },
        { key: "C", title: "API o conector de POS", who: "Con un sistema de ventas o inventario", body: "Un adaptador conecta precio y stock en tiempo real, con eventos y pruebas. Retener stock depende de lo que permita tu sistema." },
        { key: "D", title: "Agente propio", who: "Con un equipo técnico", body: "Tu servidor responde por API y, más adelante, por A2A. TilcAI conserva las verificaciones, la orden y el riel de pago." },
      ],
    },
    keep: {
      title: "Qué conservas y qué coordina TilcAI",
      yours: { title: "Tú conservas", lines: ["Precios y condiciones", "Disponibilidad y cupos", "El destino de cobro, verificado", "La confirmación de entrega"] },
      ours: { title: "TilcAI coordina", lines: ["La identidad y las reglas del comprador", "Cotización y orden con identificadores comunes", "El pago por un riel soportado y su conciliación", "Recibos para ambas partes"] },
    },
  },
  flow: {
    title: "Una operación. Seis pasos. Dos recibos.", lead: "Sigue un pedido desde la intención hasta sus comprobantes. Cada paso tiene un responsable y un estado, y el pago nunca se confunde con la entrega.",
    label: "Recorrido ilustrativo · importes de prueba, sin movimientos de fondos", agent: "Tu agente", business: "El negocio", actor: "Responsable", state: "Estado",
    steps: [
      { title: "Pedido", actor: "Tu agente", state: "Solicitud", body: "Pides «20 bolsas de cemento, retiro en tienda» y fijas un límite. Tu agente aclara lo que falta antes de consultar a nadie.", detail: "El control empieza con una instrucción concreta.", artifact: "Tu solicitud", lines: ["20 bolsas de cemento", "Retiro en tienda", "Hasta 1 USDC · solo esta compra"] },
      { title: "Oferta", actor: "El negocio", state: "Cotizada", body: "La ferretería responde desde su propio sistema: precio, disponibilidad con su fecha, vigencia y destino de cobro. Si el stock se cargó a mano, queda pendiente de confirmación.", detail: "TilcAI no inventa el precio: reproduce lo que el negocio publicó.", artifact: "Cotización", lines: ["20 bolsas · 0,10 USDC (importe de prueba)", "Vigente 15 minutos", "Cobro en una cuenta Stellar verificada"] },
      { title: "Reglas", actor: "TilcAI", state: "Evaluada", body: "TilcAI comprueba identidad, oferta, destinatario, activo, red y presupuesto. El resultado es permitir, bloquear o pedir aprobación.", detail: "«Permitir» es elegibilidad: no firma ni paga.", artifact: "Evaluación", lines: ["Negocio y destino verificados", "Dentro de tu límite", "Resultado: pide tu aprobación"] },
      { title: "Aprobación", actor: "Tú", state: "Aprobada", body: "Revisas los términos exactos en una pantalla segura y autorizas. Conectar una cuenta, o escribir «sí» en un chat, no es una autorización de gasto.", detail: "Cambiar el importe o el destinatario exige aprobar de nuevo.", artifact: "Revisión de la compra", lines: ["Importe: 0,10 USDC", "Destino: la ferretería, verificado", "Vence con la cotización"] },
      { title: "Pago", actor: "Riel de pago", state: "Liquidado", body: "TilcAI crea una orden con clave de idempotencia y ejecuta un solo intento por la ruta elegida. Después comprueba en la red el activo, el importe, el destinatario y el resultado.", detail: "Un resultado incierto se concilia; el pago no se repite a ciegas.", artifact: "Intento de pago", lines: ["Una orden · un intento", "Ruta: USDC de Fuji a Stellar (CCTP)", "Evidencia: hash de origen y de destino"] },
      { title: "Dos recibos", actor: "Negocio y TilcAI", state: "Cerrada o en seguimiento", body: "Comprador y negocio ven el mismo estado de la orden. El recibo de pago llega al liquidarse; la confirmación del retiro la registra el negocio aparte.", detail: "Pagado no significa entregado.", artifact: "Evidencias de la operación", lines: ["Recibo de pago con enlaces de testnet", "Confirmación de retiro del negocio", "El mismo orderId para ambos"] },
    ],
    scene: {
      agents: { claude: "Claude", codex: "Codex", own: "Agente propio" },
      request: "SOLICITUD",
      offer: { price: "PRECIO", priceValue: "0,10 USDC", stock: "STOCK", stockValue: "20 unidades", validity: "VIGENCIA", validityValue: "15 min", quote: "COTIZACIÓN" },
      core: "TilcAI", checks: ["IDENTIDAD", "OFERTA", "DESTINO", "PRESUPUESTO", "ACTIVO", "RED"], requires: "REQUIERE APROBACIÓN", approvedTag: "APROBADO",
      review: { title: "REVISIÓN DE COMPRA", you: "TÚ", rows: ["20 bolsas", "0,10 USDC", "Ferretería verificada", "15 min"], reject: "RECHAZAR", approve: "APROBAR", approved: "APROBADO", authorization: "AUTORIZACIÓN" },
      rail: "RIEL DE PAGO", stops: ["ORDEN", "FIRMA", "RED", "LIQUIDACIÓN"], settled: "LIQUIDADO",
      receipts: { payment: "RECIBO DE PAGO", delivery: "RECIBO DE ENTREGA", paid: "Liquidado", pending: "Pendiente", confirmed: "Confirmado", sameOrder: "MISMO orderId", notDelivery: "PAGO ≠ ENTREGA" },
    },
  },
  control: { title: "Una tarea concreta. Un permiso limitado.", lead: "Tú decides qué se autoriza, cuánto puede gastar y cuándo deja de ser válido.", recipient: "Destinatario", recipientValue: "Negocio autorizado", expiry: "Vigencia", expiryValue: "Solo esta compra", review: "Condiciones para revisar", docs: "Entender los permisos" },
  stack: { title: "Las piezas detrás de cada operación." },
  cta: { title: "Explora cómo comprarían tus agentes.", body: "Prueba las decisiones en la simulación, mira qué funciona hoy o conoce cómo preparar tu negocio para un piloto.", primary: "Explorar la simulación", secondary: "Explorar para mi empresa", tertiary: "Ver qué funciona hoy" },
  rails: {
    eyebrow: "Rutas de pago",
    title: "El negocio cobra en USDC sobre Stellar. Hay dos formas de llegar.",
    lead: "TilcAI elige una ruta por orden y nunca cobra dos veces. Sirven para situaciones distintas: tener ya USDC en Stellar o tenerlo en otra red.",
    explainer: {
      term: "crosschain", title: "Qué significa pagar entre redes",
      body: "Tú tienes USDC en una blockchain y el negocio lo recibe en otra. No es un cambio de moneda: el mismo USDC se retira en un lado y se emite en el otro, y TilcAI comprueba que ambos pasos ocurrieron. El USDC que llega a Stellar es nativo de Circle, no un token envuelto.",
    },
    routes: [
      { id: "direct", title: "Stellar directo", tag: "x402", body: "Si el comprador ya tiene USDC en Stellar, paga el servicio con el protocolo x402: un relayer verifica y liquida el pago.", status: "Prueba aislada", tone: "lab" },
      { id: "cctp", title: "USDC de otra red", tag: "CCTP · crosschain", body: "El USDC se retira (burn) en la red de origen, Circle lo confirma y se emite (mint) en Stellar. El relayer paga las comisiones: el comprador no necesita la moneda de gas.", status: "Verificado en testnet", tone: "verified" },
    ],
    mapTitle: "Redes del laboratorio de CCTP",
    mapLead: "Ocho redes de testnet: Fuji y seis más como origen, y Stellar como destino. Solo Fuji está verificada de punta a punta en TilcAI.",
    origin: "USDC de origen", pipeline: "TilcAI + CCTP", destination: "Destino",
    pipelineSteps: [
      { plain: "Se retira el USDC en la red de origen", term: "burn" },
      { plain: "Circle confirma que se retiró", term: "atestación" },
      { plain: "Se emite el mismo USDC en Stellar", term: "mint" },
    ],
    gasless: "Sin gas para el comprador: el relayer paga las comisiones.",
    destinationName: "Stellar Testnet", destinationNote: "USDC del negocio",
    legend: { verified: "Verificado en TilcAI", lab: "Preparado en laboratorio", vision: "Visión" },
    visionNote: "Más redes compatibles con Circle, solo después de su incorporación y de sus pruebas propias.",
    statuses: { verified: "Verificado", lab: "Laboratorio" },
    limits: {
      title: "Lo que esta ruta no promete",
      items: [
        "Mueve USDC nativo. No cualquier token ni «cualquier dinero».",
        "Que Circle soporte una red no la habilita en TilcAI: antes se prueba su ruta de punta a punta.",
        "No convierte bolivianos. Entrar o salir de moneda local requiere un proveedor aparte.",
        "Un tiempo de espera es un resultado incierto: se concilia, no se repite el pago.",
      ],
    },
  },
  evidence: {
    eyebrow: "Evidencia", title: "Pago de prueba verificable.",
    lead: "Dos pagos técnicos de 0,1 USDC de Avalanche Fuji a Stellar Testnet, reproducidos de forma independiente; no son órdenes comerciales. Compruébalos tú mismo en el explorador.",
    rows: [
      { id: "gasless", label: "Con relayer", detail: "El relayer paga el gas; el pagador firma una autorización." },
      { id: "external", label: "Con wallet externa", detail: "La wallet del pagador difunde el burn y paga su gas." },
    ],
    burn: "Retiro en Fuji (burn)", mint: "Emisión en Stellar (mint)", open: "Ver en el explorador", dateLabel: "Ejecutados el", amount: "0,1 USDC · de Avalanche Fuji a Stellar Testnet",
  },
  entrances: {
    eyebrow: "Entradas del comprador", title: "Tres formas de llegar a la misma infraestructura.",
    lead: "Cambia el canal, no las reglas: todas terminan en la misma identidad, cotización, aprobación, pago y recibos.",
    items: [
      { id: "whatsapp", title: "Persona nueva · WhatsApp", body: "Una conversación guiada. Para comprar, un enlace seguro abre la pantalla donde creas tu credencial y apruebas. WhatsApp inicia el proceso; no es una firma.", status: "Reportado por el equipo" },
      { id: "mcp", title: "Asistente propio · MCP", body: "Conectas las herramientas de TilcAI a tu asistente: buscar un servicio, pedir una cotización, solicitar aprobación, consultar una orden. Permitir una herramienta no concede permiso de gasto.", status: "Contrato definido" },
      { id: "api", title: "Aplicación propia · API", body: "Un backend autenticado usa la API REST. Un SDK futuro empaquetaría autenticación, tipos e idempotencia, pero no reemplaza a la API.", status: "Disponible en testnet" },
    ],
    shared: { label: "La misma infraestructura", steps: ["Identidad", "Cotización", "Aprobación", "Pago", "Recibos"] },
    footnote: "A2A, la conversación entre agentes de organizaciones distintas, es una evolución prevista y no hace falta para empezar.",
  },
};

const en: NarrativeCopy = {
  business: {
    title: "Your business, ready to talk to agents.",
    lead: "You do not need an AI agent or a website to start. You keep deciding price, availability, payout destination and delivery.",
    label: "How your business would connect",
    tabs: [
      { title: "Publish your services", body: "Connect your catalog and availability so an agent can inquire about what you actually offer.", artifact: "Catalog", lines: ["Services and availability", "Your business terms", "Data from your system"] },
      { title: "Respond with terms", body: "Each request receives a quote with a price, payee and expiry. The person decides whether to authorize it.", artifact: "Quote", lines: ["Amount and payee", "Offer validity", "Approval per purchase"] },
      { title: "Confirm the outcome", body: "Link the order to its payment and confirm delivery from your operation. Each outcome has its own evidence.", artifact: "Order", lines: ["Reconciled payment", "Business fulfillment", "Separate receipts"] },
    ],
    paths: {
      eyebrow: "Four ways to connect",
      title: "Start from where you are today.",
      lead: "The same business can move from one path to another without losing its identity, its order history or its payout destination.",
      hud: { connected: "Your business, always connected", identity: "Same identity on every path", data: "Data, orders and payments unified" },
      node: "TilcAI core: the four paths end here",
      items: [
        { key: "A", title: "Managed console", who: "No software and no agent", body: "A private portal to publish a small catalog, confirm availability, receive requests, quote, and see orders and payments." },
        { key: "B", title: "File or spreadsheet", who: "With a spreadsheet or a closed system", body: "You import your catalog from a file; it is validated and published with a version. Stock depends on you updating or confirming it." },
        { key: "C", title: "API or POS connector", who: "With a sales or inventory system", body: "An adapter connects price and stock in real time, with events and tests. Holding stock depends on what your system allows." },
        { key: "D", title: "Your own agent", who: "With a technical team", body: "Your server responds over an API and, later, over A2A. TilcAI keeps the checks, the order and the payment rail." },
      ],
    },
    keep: {
      title: "What you keep and what TilcAI coordinates",
      yours: { title: "You keep", lines: ["Prices and terms", "Availability and capacity", "The payout destination, verified", "The delivery confirmation"] },
      ours: { title: "TilcAI coordinates", lines: ["The buyer's identity and rules", "Quote and order with shared identifiers", "Payment over a supported rail and its reconciliation", "Receipts for both parties"] },
    },
  },
  flow: {
    title: "One operation. Six steps. Two receipts.", lead: "Follow an order from intent to its supporting evidence. Every step has an owner and a state, and payment is never confused with delivery.",
    label: "Illustrative journey · test amounts, no funds move", agent: "Your agent", business: "The business", actor: "Owner", state: "State",
    steps: [
      { title: "Request", actor: "Your agent", state: "Requested", body: "You ask for “20 bags of cement, pick-up in store” and set a limit. Your agent clarifies what is missing before asking anyone.", detail: "Control starts with a specific instruction.", artifact: "Your request", lines: ["20 bags of cement", "Pick-up in store", "Up to 1 USDC · this purchase only"] },
      { title: "Offer", actor: "The business", state: "Quoted", body: "The hardware store answers from its own system: price, availability with its date, expiry and payout destination. If stock was entered by hand, it stays pending confirmation.", detail: "TilcAI does not invent the price: it reproduces what the business published.", artifact: "Quote", lines: ["20 bags · 0.10 USDC (test amount)", "Valid for 15 minutes", "Payout to a verified Stellar account"] },
      { title: "Rules", actor: "TilcAI", state: "Evaluated", body: "TilcAI checks identity, offer, payee, asset, network and budget. The result is allow, block or ask for approval.", detail: "“Allow” is eligibility: it neither signs nor pays.", artifact: "Evaluation", lines: ["Business and destination verified", "Within your limit", "Result: asks for your approval"] },
      { title: "Approval", actor: "You", state: "Approved", body: "You review the exact terms on a secure screen and authorize. Connecting an account, or typing “yes” in a chat, is not a spending authorization.", detail: "Changing the amount or the payee requires approving again.", artifact: "Purchase review", lines: ["Amount: 0.10 USDC", "Destination: the hardware store, verified", "Expires with the quote"] },
      { title: "Payment", actor: "Payment rail", state: "Settled", body: "TilcAI creates an order with an idempotency key and runs a single attempt over the chosen route. Then it checks the asset, amount, payee and result on the network.", detail: "An uncertain result is reconciled; the payment is not blindly repeated.", artifact: "Payment attempt", lines: ["One order · one attempt", "Route: USDC from Fuji to Stellar (CCTP)", "Evidence: source and destination hash"] },
      { title: "Two receipts", actor: "Business and TilcAI", state: "Closed or being followed", body: "Buyer and business see the same order state. The payment receipt arrives when it settles; the business records the pick-up confirmation separately.", detail: "Paid does not mean delivered.", artifact: "Operation evidence", lines: ["Payment receipt with testnet links", "Pick-up confirmation from the business", "The same orderId for both"] },
    ],
    scene: {
      agents: { claude: "Claude", codex: "Codex", own: "Your own agent" },
      request: "REQUEST",
      offer: { price: "PRICE", priceValue: "0.10 USDC", stock: "STOCK", stockValue: "20 units", validity: "VALIDITY", validityValue: "15 min", quote: "QUOTE" },
      core: "TilcAI", checks: ["IDENTITY", "OFFER", "DESTINATION", "BUDGET", "ASSET", "NETWORK"], requires: "APPROVAL REQUIRED", approvedTag: "APPROVED",
      review: { title: "PURCHASE REVIEW", you: "YOU", rows: ["20 bags", "0.10 USDC", "Hardware store verified", "15 min"], reject: "REJECT", approve: "APPROVE", approved: "APPROVED", authorization: "AUTHORIZATION" },
      rail: "PAYMENT RAIL", stops: ["ORDER", "SIGN", "NETWORK", "SETTLEMENT"], settled: "SETTLED",
      receipts: { payment: "PAYMENT RECEIPT", delivery: "DELIVERY RECEIPT", paid: "Settled", pending: "Pending", confirmed: "Confirmed", sameOrder: "SAME orderId", notDelivery: "PAID ≠ DELIVERED" },
    },
  },
  control: { title: "A specific task. A limited permission.", lead: "You decide what is authorized, how much it can spend and when it expires.", recipient: "Payee", recipientValue: "Authorized business", expiry: "Validity", expiryValue: "This purchase only", review: "Terms to review", docs: "Understand permissions" },
  stack: { title: "The pieces behind each operation." },
  cta: { title: "Explore how your agents would buy.", body: "Try the decisions in the simulation, see what works today, or learn how to prepare your business for a pilot.", primary: "Explore the simulation", secondary: "Explore for my business", tertiary: "See what works today" },
  rails: {
    eyebrow: "Payment routes",
    title: "The business is paid in USDC on Stellar. There are two ways to get there.",
    lead: "TilcAI picks one route per order and never charges twice. They serve different situations: already holding USDC on Stellar, or holding it on another network.",
    explainer: {
      term: "crosschain", title: "What paying across networks means",
      body: "You hold USDC on one blockchain and the business receives it on another. It is not a currency swap: the same USDC is retired on one side and issued on the other, and TilcAI checks that both steps happened. The USDC arriving on Stellar is native Circle USDC, not a wrapped token.",
    },
    routes: [
      { id: "direct", title: "Direct on Stellar", tag: "x402", body: "If the buyer already holds USDC on Stellar, they pay for the service with the x402 protocol: a relayer verifies and settles the payment.", status: "Isolated test", tone: "lab" },
      { id: "cctp", title: "USDC from another network", tag: "CCTP · crosschain", body: "The USDC is retired (burn) on the source network, Circle confirms it and it is issued (mint) on Stellar. The relayer pays the fees: the buyer does not need the gas token.", status: "Verified on testnet", tone: "verified" },
    ],
    mapTitle: "Networks in the CCTP lab",
    mapLead: "Eight testnets: Fuji and six more as sources, and Stellar as the destination. Only Fuji is verified end to end in TilcAI.",
    origin: "Source USDC", pipeline: "TilcAI + CCTP", destination: "Destination",
    pipelineSteps: [
      { plain: "The USDC is retired on the source network", term: "burn" },
      { plain: "Circle confirms it was retired", term: "attestation" },
      { plain: "The same USDC is issued on Stellar", term: "mint" },
    ],
    gasless: "No gas for the buyer: the relayer pays the fees.",
    destinationName: "Stellar Testnet", destinationNote: "The business's USDC",
    legend: { verified: "Verified in TilcAI", lab: "Ready in the lab", vision: "Vision" },
    visionNote: "More Circle-compatible networks, only after their onboarding and our own tests.",
    statuses: { verified: "Verified", lab: "Lab" },
    limits: {
      title: "What this route does not promise",
      items: [
        "It moves native USDC. Not any token and not “any money”.",
        "Circle supporting a network does not enable it in TilcAI: its route is tested end to end first.",
        "It does not convert bolivianos. Entering or leaving local currency needs a separate provider.",
        "A timeout is an uncertain result: it is reconciled, the payment is not repeated.",
      ],
    },
  },
  evidence: {
    eyebrow: "Evidence", title: "A verifiable test payment.",
    lead: "Two technical payments of 0.1 USDC from Avalanche Fuji to Stellar Testnet, independently reproduced; these are not commercial orders. Check them yourself in the explorer.",
    rows: [
      { id: "gasless", label: "Through the relayer", detail: "The relayer pays the gas; the payer signs an authorization." },
      { id: "external", label: "With an external wallet", detail: "The payer's wallet broadcasts the burn and pays its own gas." },
    ],
    burn: "Burn on Fuji", mint: "Mint on Stellar", open: "View in the explorer", dateLabel: "Executed on", amount: "0.1 USDC · Avalanche Fuji to Stellar Testnet",
  },
  entrances: {
    eyebrow: "Buyer entrances", title: "Three ways into the same infrastructure.",
    lead: "The channel changes, the rules do not: all of them end in the same identity, quote, approval, payment and receipts.",
    items: [
      { id: "whatsapp", title: "New person · WhatsApp", body: "A guided conversation. To buy, a secure link opens the screen where you create your credential and approve. WhatsApp starts the process; it is not a signature.", status: "Reported by the team" },
      { id: "mcp", title: "Your own assistant · MCP", body: "You connect TilcAI's tools to your assistant: find a service, ask for a quote, request approval, check an order. Allowing a tool does not grant permission to spend.", status: "Contract defined" },
      { id: "api", title: "Your own application · API", body: "An authenticated backend uses the REST API. A future SDK would package authentication, types and idempotency, but would not replace the API.", status: "Available on testnet" },
    ],
    shared: { label: "The same infrastructure", steps: ["Identity", "Quote", "Approval", "Payment", "Receipts"] },
    footnote: "A2A, conversation between agents from different organizations, is a planned evolution and is not needed to start.",
  },
};

export const narrative = (locale: Locale): NarrativeCopy => locale === "es" ? es : en;
