import type { Locale } from "../i18n/types";

/**
 * Modelo de negocio, go-to-market y roadmap que muestra /demo (debajo del video).
 *
 * Fuente: la sección de Notion «Instawards · Paso 2 · Borradores TilcAI»
 * (01 Modelo de negocio, 02 GTM y validación comercial, 03 Roadmap de producto y sprint),
 * leída el 2026-11-08. Cómo actualizarla y qué reglas sigue el texto: docs/demo-strategy.md.
 *
 * Es una página pública: el texto se escribe en firme, sin términos de borrador
 * (test/demo-strategy.test.ts lo comprueba), y nunca inventa cifras, clientes ni contratos.
 * Las únicas cifras son las de fuentes externas citadas en `business.signals`.
 */

export type StrategySectionId = "video" | "modelo" | "gtm" | "roadmap";
export type FlowNodeId = "buyer" | "agent" | "tilcai" | "business";
export type DeliverableId = "D1" | "D2" | "D3";

export interface StrategyCopy {
  nav: { label: string; items: { id: StrategySectionId; label: string }[] };
  business: {
    eyebrow: string;
    title: string;
    lead: string;
    flow: {
      label: string;
      nodes: { id: FlowNodeId; title: string; text: string }[];
    };
    segments: {
      label: string;
      hint: string;
      items: { id: string; name: string; role: string; need: string; resolves: string; nodes: FlowNodeId[] }[];
    };
    value: { title: string; items: { title: string; text: string }[] };
    revenue: {
      title: string;
      lead: string;
      modes: { id: string; label: string; summary: string; parts: { label: string; detail: string; weight: number }[] }[];
      note: string;
    };
    economics: { title: string; lead: string; items: { name: string; measure: string }[] };
    signals: {
      title: string;
      lead: string;
      stats: { value: number; decimals: number; suffix: string; label: string; source: { label: string; href: string } }[];
      infra: { label: string; source: { label: string; href: string } }[];
    };
  };
  gtm: {
    eyebrow: string;
    title: string;
    lead: string;
    positioning: { quote: string; audiences: { id: string; label: string; line: string }[] };
    icp: { title: string; items: string[] };
    channels: { title: string; items: { title: string; text: string }[] };
    events: {
      title: string;
      items: { id: string; label: string; audience: string; goal: string; next: string }[];
    };
    alliances: { title: string; items: { partner: string; reaches: string }[]; text: string };
    funnel: {
      title: string;
      lead: string;
      prev: string;
      next: string;
      stages: { id: string; label: string; question: string; evidence: string }[];
      rule: string;
    };
  };
  roadmap: {
    eyebrow: string;
    title: string;
    lead: string;
    base: { title: string; items: { label: string; text: string; href?: string }[] };
    deliverables: {
      title: string;
      items: { id: DeliverableId; title: string; text: string; dependsOn: DeliverableId[] }[];
      dependsLabel: string;
    };
    sprint: {
      title: string;
      dayLabel: string;
      workLabel: string;
      evidenceLabel: string;
      play: string;
      pause: string;
      periods: { id: string; label: string; from: number; to: number; work: string; evidence: string; deliverables: DeliverableId[] }[];
      exit: { title: string; text: string };
    };
    phases: { title: string; conditionLabel: string; items: { title: string; text: string; condition: string }[] };
    liquidity: {
      title: string;
      lead: string;
      steps: { title: string; text: string }[];
      sim: {
        title: string;
        origin: string;
        destination: string;
        balance: string;
        min: string;
        target: string;
        pay: string;
        reset: string;
        payments: string;
        refills: string;
        refilling: string;
        idle: string;
        paid: string;
      };
    };
  };
}

const LINKS = {
  microsoft: "https://blogs.microsoft.com/on-the-issues/2026/09/21/the-continued-state-of-global-ai-diffusion-in-2026/",
  mckinsey: "https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/who-wins-when-ai-does-the-shopping-new-evidence-on-agentic-commerce",
  aws: "https://aws.amazon.com/blogs/machine-learning/amazon-bedrock-agentcore-payments-is-now-generally-available-enabling-agents-to-transact-safely-and-autonomously-at-scale/",
  linuxFoundation: "https://www.linuxfoundation.org/press/linux-foundation-announces-operational-launch-of-x402-foundation-to-standardize-internet-native-payments-for-ai-agents-and-applications",
  stellar: "https://stellar.org/x402",
  mastercard: "https://www.mastercard.com/news/latin-america/en/newsroom/press-releases/pr-en/2026/march/mastercard-advances-agentic-payments-in-latin-america-and-the-caribbean-with-live-transactions-completed-across-the-region/",
  sdk: "https://github.com/TilcAI/tilcai-sdk",
  mcp: "https://github.com/TilcAI/tilcai-mcp",
  deployment: "https://github.com/TilcAI/tilcai-infrastructure/blob/6d322986bb7254f3aaed73db6fffa877088f7b42/deploy/MAINNET_DEPLOYMENT.md",
} as const;

const es: StrategyCopy = {
  nav: {
    label: "Secciones de la demo",
    items: [
      { id: "video", label: "Video" },
      { id: "modelo", label: "Modelo de negocio" },
      { id: "gtm", label: "Go-to-market" },
      { id: "roadmap", label: "Roadmap" },
    ],
  },
  business: {
    eyebrow: "Modelo de negocio",
    title: "Infraestructura B2B para cobrar a agentes de IA",
    lead: "TilcAI permite que una empresa reciba, verifique y gestione cobros de agentes de IA, y que esos agentes ejecuten pagos autorizados. Integra x402, SDK/MCP y liquidación en USDC sobre Stellar. La empresa contrata e integra; el comprador usa su asistente y autoriza el gasto.",
    flow: {
      label: "Recorrido de un cobro",
      nodes: [
        { id: "buyer", title: "Comprador", text: "Usa su asistente y autoriza el gasto dentro de sus permisos y presupuesto." },
        { id: "agent", title: "Agente de IA", text: "Ejecuta el pago autorizado mediante el SDK o el conector MCP de TilcAI." },
        { id: "tilcai", title: "TilcAI", text: "Cobro x402, autorización, comprobante y liquidación en USDC sobre Stellar." },
        { id: "business", title: "Empresa", text: "Recibe el cobro, lo verifica y lo concilia con su orden." },
      ],
    },
    segments: {
      label: "¿Para quién es?",
      hint: "Elige un actor para ver su papel en el recorrido.",
      items: [
        {
          id: "merchant",
          name: "Comercio con checkout",
          role: "Cliente directo",
          need: "Recibir pagos de agentes, asociarlos a pedidos y conciliarlos.",
          resolves: "Una sola integración une cobro, comprobante y conciliación con su orden.",
          nodes: ["tilcai", "business"],
        },
        {
          id: "integrator",
          name: "Integrador de agentes o e-commerce",
          role: "Canal y cliente",
          need: "Reutilizar una integración de pagos para todos sus clientes.",
          resolves: "SDK y MCP para llevar el mismo flujo de cobro a cada comercio que integra.",
          nodes: ["agent", "tilcai"],
        },
        {
          id: "buyer",
          name: "Comprador final",
          role: "Usuario",
          need: "Delegar compras sin perder el control de permisos y presupuesto.",
          resolves: "Su agente paga solo lo que él autorizó; la empresa es quien contrata TilcAI.",
          nodes: ["buyer", "agent"],
        },
      ],
    },
    value: {
      title: "Qué entrega la integración",
      items: [
        { title: "Pago y cobro", text: "El agente paga y la empresa cobra por el mismo flujo x402." },
        { title: "Autorización", text: "Cada pago ocurre dentro de un permiso con límites explícitos." },
        { title: "Comprobantes", text: "Orden, intento, estado y hash público quedan registrados." },
        { title: "Conciliación", text: "La empresa asocia cada cobro confirmado a su orden." },
      ],
    },
    revenue: {
      title: "Cómo genera ingresos",
      lead: "La empresa o el integrador pagan por integración y operación. Comparamos dos modalidades y elegimos con datos de disposición de pago.",
      modes: [
        {
          id: "subscription",
          label: "Implementación + operación",
          summary: "Para empresas que necesitan trabajo específico de integración y una operación continua.",
          parts: [
            { label: "Implementación", detail: "Cuando la integración requiere trabajo específico para la empresa.", weight: 35 },
            { label: "Suscripción de operación", detail: "Mensualidad con un volumen de cobros incluido.", weight: 65 },
          ],
        },
        {
          id: "usage",
          label: "Por uso",
          summary: "Para quien prefiere pagar según la actividad real de cobro.",
          parts: [{ label: "Cobro por operación", detail: "Según el volumen de operaciones procesadas y conciliadas.", weight: 100 }],
        },
      ],
      note: "El precio de TilcAI va separado de las comisiones de red, los costes de terceros y los costes de rampa. Los fondos de los clientes nunca se cuentan como ingresos.",
    },
    economics: {
      title: "Economía unitaria",
      lead: "Las variables con las que fijamos precio y priorizamos segmentos.",
      items: [
        { name: "Ingreso por empresa", measure: "Implementación + mensualidad + uso contratado." },
        { name: "Coste directo", measure: "Horas de integración y soporte, infraestructura, liquidación patrocinada y servicios externos." },
        { name: "Margen de contribución", measure: "Ingresos menos costes directos, sin contar fondos de clientes como ingresos." },
        { name: "Retorno comercial", measure: "Coste de adquisición y tiempo hasta recuperarlo." },
        { name: "Carga operativa", measure: "Incidencias y minutos de soporte por integración." },
      ],
    },
    signals: {
      title: "Señales del mercado · 2026",
      lead: "Las personas ya usan IA a diario y empiezan a comprar con ella; la infraestructura de pagos programáticos está disponible.",
      stats: [
        {
          value: 18.8,
          decimals: 1,
          suffix: "%",
          label: "de la población mundial en edad de trabajar usó IA generativa en junio de 2026.",
          source: { label: "Microsoft", href: LINKS.microsoft },
        },
        {
          value: 53,
          decimals: 0,
          suffix: "%",
          label: "usó IA para alguna tarea de compra en los tres meses previos (11 mercados, incluidos Brasil y México).",
          source: { label: "McKinsey", href: LINKS.mckinsey },
        },
        {
          value: 14,
          decimals: 0,
          suffix: "%",
          label: "de los usuarios de IA completó una compra directamente en una herramienta de IA.",
          source: { label: "McKinsey", href: LINKS.mckinsey },
        },
      ],
      infra: [
        { label: "Fundación x402 en operación (julio de 2026)", source: { label: "Linux Foundation", href: LINKS.linuxFoundation } },
        { label: "Pagos de agentes con x402 y límites de gasto en disponibilidad general (agosto de 2026)", source: { label: "AWS", href: LINKS.aws } },
        { label: "Transacciones agénticas reales en América Latina y el Caribe", source: { label: "Mastercard", href: LINKS.mastercard } },
        { label: "Documentación y facilitación de x402 en Stellar", source: { label: "Stellar", href: LINKS.stellar } },
      ],
    },
  },
  gtm: {
    eyebrow: "Go-to-market",
    title: "Del primer contacto al primer cobro conciliado",
    lead: "Buscamos un segmento con una necesidad concreta de cobros agénticos y capacidad de integrar un piloto. El éxito se mide en decisiones verificables: probar, integrar y pagar.",
    positioning: {
      quote: "TilcAI ayuda a empresas a cobrar a agentes de IA y comprobar esos pagos en Stellar, conectando autorización, cobro y conciliación mediante una integración.",
      audiences: [
        { id: "buyers", label: "Para compradores", line: "Tu agente compra. Tú decides." },
        { id: "business", label: "Para empresas", line: "Prepara tu negocio para recibir pagos de agentes." },
      ],
    },
    icp: {
      title: "Cliente inicial",
      items: [
        "Responsable de tecnología u operaciones de un comercio digital o de un integrador.",
        "Catálogo o API disponible y control de su propio checkout.",
        "Disposición a aceptar USDC y liquidar en Stellar.",
        "Capacidad de reservar tiempo para una prueba técnica.",
        "Empezamos en Bolivia, donde el equipo tiene acceso directo.",
      ],
    },
    channels: {
      title: "Canales, en orden",
      items: [
        { title: "Comunidad y conversaciones existentes", text: "Referencias de la comunidad Stellar: entrevistas sobre el problema real de cobro." },
        { title: "Red del equipo", text: "Contactos directos con comercios y empresas de pagos." },
        { title: "Desarrolladores e integradores", text: "Demo reproducible, SDK, MCP y documentación." },
        { title: "Contenido y pitch", text: "Material de apoyo para cada conversación comercial." },
      ],
    },
    events: {
      title: "Eventos para captar clientes",
      items: [
        {
          id: "hackathon",
          label: "Hackathons",
          audience: "Desarrolladores e integradores",
          goal: "Construyen un prototipo de cobro con SDK/MCP en testnet a partir de retos aportados por comercios.",
          next: "Sesión técnica con los equipos que logren una integración funcional y los comercios interesados.",
        },
        {
          id: "workshop",
          label: "Talleres prácticos",
          audience: "Equipos de tecnología y operaciones de comercios",
          goal: "Recorren la autorización, el cobro y la conciliación de una orden.",
          next: "Identificar un caso de uso y agendar una evaluación de integración.",
        },
        {
          id: "seminar",
          label: "Seminarios y demos",
          audience: "Responsables de negocio",
          goal: "Conocen casos de uso, requisitos y beneficios operativos.",
          next: "Entrevista de diagnóstico con las empresas que tengan un problema concreto.",
        },
      ],
    },
    alliances: {
      title: "Alianzas",
      items: [
        { partner: "Universidades y comunidades tecnológicas", reaches: "Desarrolladores" },
        { partner: "Cámaras empresariales e incubadoras", reaches: "Comercios" },
        { partner: "Integradores de e-commerce", reaches: "Empresas con checkout compatible" },
      ],
      text: "Con cada socio acordamos quién convoca, qué caso se presenta y quién da seguimiento. Medimos empresas calificadas, reuniones técnicas, acuerdos de piloto e integraciones iniciadas por evento y por socio.",
    },
    funnel: {
      title: "Embudo de validación",
      lead: "Contamos personas y empresas únicas en cada paso, con denominadores y causas de abandono.",
      prev: "Paso anterior",
      next: "Paso siguiente",
      stages: [
        { id: "contact", label: "Contacto", question: "¿A quién llegamos y desde qué canal?", evidence: "Empresa, rol, caso de uso y consentimiento de seguimiento." },
        { id: "interview", label: "Entrevista", question: "¿Qué cobro pierde hoy o qué integración no puede resolver?", evidence: "Problema, frecuencia, alternativa y coste actual." },
        { id: "problem", label: "Problema confirmado", question: "¿El problema se repite y tiene un responsable?", evidence: "Problema repetido y comprador identificable." },
        { id: "usdc", label: "Acepta USDC", question: "¿Qué necesita para aceptar USDC y liquidar en Stellar?", evidence: "Requisitos de datos, estados, devoluciones y soporte." },
        { id: "session", label: "Sesión técnica", question: "¿Entiende el flujo y lo puede ejecutar?", evidence: "Resultado observado y dificultades." },
        { id: "pilot", label: "Acuerdo de piloto", question: "¿Quién decide, qué aporta y cuándo probaría?", evidence: "Confirmación escrita del piloto." },
        { id: "integration", label: "Integración", question: "¿Quién paga y por qué modalidad?", evidence: "Tiempo hasta el primer cobro conciliado e incidencias." },
        { id: "payment", label: "Pago comercial", question: "¿Hay un segundo uso útil?", evidence: "Uso repetido documentado, sin contar pruebas internas." },
      ],
      rule: "Seguimos con un segmento cuando aparecen un problema repetido, un comprador identificable y un compromiso de integración.",
    },
  },
  roadmap: {
    eyebrow: "Roadmap",
    title: "Una v1 controlada en Stellar Mainnet en 30 días",
    lead: "Un agente realiza un pago x402 autorizado con USDC real mediante SDK/MCP; la empresa verifica el cobro y lo concilia con su orden. El fondeo por CCTP se demuestra por separado en el corredor Avalanche C-Chain → Stellar Mainnet.",
    base: {
      title: "Punto de partida",
      items: [
        { label: "Mainnet", text: "Transferencia de 1 USDC real de Avalanche C-Chain a Stellar y depósito en Vaquita (demo del 10 de octubre de 2026).", href: LINKS.deployment },
        { label: "Testnet", text: "CCTP configurado desde Avalanche Fuji y Monad Testnet hacia Stellar Testnet." },
        { label: "SDK", text: "Ejemplos de comprador y vendedor x402.", href: LINKS.sdk },
        { label: "MCP", text: "Servidor MCP para pagos cross-chain.", href: LINKS.mcp },
      ],
    },
    deliverables: {
      title: "Tres entregables",
      dependsLabel: "Depende de",
      items: [
        { id: "D1", title: "Cobro x402 en Stellar Mainnet", text: "Endpoint operativo con USDC real: orden, intento, estado y comprobante verificables.", dependsOn: [] },
        { id: "D2", title: "SDK y conector MCP", text: "Pago autorizado y conciliado, con límites, reintentos e idempotencia probados.", dependsOn: ["D1"] },
        { id: "D3", title: "Fondeo CCTP Avalanche → Stellar", text: "Origen, atestación, destino y acreditación registrados; fondeo y cobro trazables por separado.", dependsOn: ["D1", "D2"] },
      ],
    },
    sprint: {
      title: "Sprint de 30 días",
      dayLabel: "Días",
      workLabel: "Trabajo",
      evidenceLabel: "Entrega",
      play: "Reproducir",
      pause: "Pausar",
      periods: [
        {
          id: "w1",
          label: "Semana 1",
          from: 1,
          to: 7,
          work: "Inventario de código y demo; un caso fijo con firmante, destinatario, activo y red; corredor CCTP y facilitador; amenazas y criterios de aceptación.",
          evidence: "Matriz de capacidades, arquitectura y pruebas base reproducibles.",
          deliverables: ["D1", "D2", "D3"],
        },
        {
          id: "w2",
          label: "Semana 2",
          from: 8,
          to: 14,
          work: "Construcción de D1 e integración del flujo comprador SDK/MCP de D2; orden, intento y hash asociados sin mezclar pago con entrega.",
          evidence: "Cobro en testnet, ejemplo ejecutable y comprobante.",
          deliverables: ["D1", "D2"],
        },
        {
          id: "w3",
          label: "Semana 3",
          from: 15,
          to: 21,
          work: "Controles de D2 y ruta CCTP de D3; pruebas de fondos insuficientes, autorizaciones inválidas, expiración, reintentos y conciliación.",
          evidence: "Resultados de pruebas y trazabilidad origen → destino → pago.",
          deliverables: ["D2", "D3"],
        },
        {
          id: "w4",
          label: "Semana 4",
          from: 22,
          to: 28,
          work: "Revisión de salida, preflight y despliegue controlado en mainnet; cobro de importe bajo y conciliación.",
          evidence: "Release, hash público y comprobante asociado.",
          deliverables: ["D1", "D2", "D3"],
        },
        {
          id: "close",
          label: "Días 29–30",
          from: 29,
          to: 30,
          work: "Cierre de errores críticos y publicación de la versión con su paquete de evidencia.",
          evidence: "Matriz D1/D2/D3 completa.",
          deliverables: ["D1", "D2", "D3"],
        },
      ],
      exit: {
        title: "Criterio de salida",
        text: "v1 habilitada para un caso de referencia con acceso limitado, USDC real de importe bajo, credenciales y relayers separados, límites y pausa. Primero, pruebas negativas e idempotencia en testnet; el cierre es un cobro en mainnet con hash público y comprobante conciliado.",
      },
    },
    phases: {
      title: "Después de la v1",
      conditionLabel: "Avanza cuando",
      items: [
        { title: "Piloto comercial", text: "Integración con un negocio, requisitos de pedidos y soporte, precio experimental.", condition: "El problema está validado y la empresa se compromete." },
        { title: "Operación empresarial", text: "Cuentas modulares, recuperación grupal, distribución de fondos y permisos.", condition: "Están definidos el modelo de firma y custodia y las amenazas." },
        { title: "Ampliación de redes", text: "Más corredores CCTP y conectores.", condition: "La primera ruta es confiable y hay demanda específica." },
        { title: "Escalamiento", text: "Más acceso, operación, monitoreo y soporte.", condition: "La v1 opera y el piloto aporta evidencia de seguridad y demanda." },
      ],
    },
    liquidity: {
      title: "Liquidez prefondeada por red",
      lead: "Un vault con USDC en cada red habilitada paga al destinatario al instante; CCTP repone el saldo por lotes, no en cada pago.",
      steps: [
        { title: "Desembolso local", text: "Tras verificar el pago de origen, el vault de destino paga y concilia origen, orden y desembolso con un identificador único." },
        { title: "Reposición por lotes", text: "Al cruzar el saldo mínimo, CCTP repone hasta el objetivo; los fondos en tránsito quedan registrados para no duplicar nada." },
        { title: "Controles", text: "Confirmaciones de origen, límites por orden y por red, alerta y pausa ante saldo insuficiente." },
        { title: "Neteo", text: "Con flujos en ambos sentidos, se rebalancea solo el saldo neto." },
      ],
      sim: {
        title: "Así funciona",
        origin: "Avalanche",
        destination: "Vault · Stellar",
        balance: "Saldo",
        min: "Mínimo",
        target: "Objetivo",
        pay: "Pagar",
        reset: "Reiniciar",
        payments: "Pagos atendidos",
        refills: "Reposiciones CCTP",
        refilling: "Reposición por lotes vía CCTP…",
        idle: "Pulsa «Pagar»: cada pago sale del vault en Stellar.",
        paid: "Pago desembolsado desde el vault en Stellar.",
      },
    },
  },
};

const en: StrategyCopy = {
  nav: {
    label: "Demo sections",
    items: [
      { id: "video", label: "Video" },
      { id: "modelo", label: "Business model" },
      { id: "gtm", label: "Go-to-market" },
      { id: "roadmap", label: "Roadmap" },
    ],
  },
  business: {
    eyebrow: "Business model",
    title: "B2B infrastructure to get paid by AI agents",
    lead: "TilcAI lets a business receive, verify and manage payments from AI agents, and lets those agents make authorized payments. It brings together x402, SDK/MCP and USDC settlement on Stellar. The business subscribes and integrates; the buyer uses their assistant and authorizes the spend.",
    flow: {
      label: "How a payment travels",
      nodes: [
        { id: "buyer", title: "Buyer", text: "Uses their assistant and authorizes the spend within their permissions and budget." },
        { id: "agent", title: "AI agent", text: "Makes the authorized payment through the TilcAI SDK or MCP connector." },
        { id: "tilcai", title: "TilcAI", text: "x402 charge, authorization, receipt and USDC settlement on Stellar." },
        { id: "business", title: "Business", text: "Receives the payment, verifies it and reconciles it with its order." },
      ],
    },
    segments: {
      label: "Who is it for?",
      hint: "Pick an actor to see its role along the way.",
      items: [
        {
          id: "merchant",
          name: "Merchant with a checkout",
          role: "Direct customer",
          need: "Receive payments from agents, match them to orders and reconcile them.",
          resolves: "One integration ties charge, receipt and reconciliation to its order.",
          nodes: ["tilcai", "business"],
        },
        {
          id: "integrator",
          name: "Agent or e-commerce integrator",
          role: "Channel and customer",
          need: "Reuse one payments integration across all of its clients.",
          resolves: "SDK and MCP bring the same payment flow to every merchant it integrates.",
          nodes: ["agent", "tilcai"],
        },
        {
          id: "buyer",
          name: "End buyer",
          role: "User",
          need: "Delegate purchases without losing control of permissions and budget.",
          resolves: "Their agent pays only what they authorized; the business is the one that subscribes to TilcAI.",
          nodes: ["buyer", "agent"],
        },
      ],
    },
    value: {
      title: "What the integration delivers",
      items: [
        { title: "Payment and collection", text: "The agent pays and the business collects through the same x402 flow." },
        { title: "Authorization", text: "Every payment happens inside a permission with explicit limits." },
        { title: "Receipts", text: "Order, attempt, status and public hash are recorded." },
        { title: "Reconciliation", text: "The business matches each confirmed payment to its order." },
      ],
    },
    revenue: {
      title: "How it makes money",
      lead: "The business or integrator pays for integration and operation. We compare two models and choose with willingness-to-pay data.",
      modes: [
        {
          id: "subscription",
          label: "Setup + operation",
          summary: "For businesses that need specific integration work and ongoing operation.",
          parts: [
            { label: "Setup", detail: "When the integration needs work specific to the business.", weight: 35 },
            { label: "Operation subscription", detail: "Monthly fee with an included payment volume.", weight: 65 },
          ],
        },
        {
          id: "usage",
          label: "Usage-based",
          summary: "For those who prefer to pay according to real payment activity.",
          parts: [{ label: "Per-operation fee", detail: "Based on the volume of processed and reconciled operations.", weight: 100 }],
        },
      ],
      note: "TilcAI's price is kept apart from network fees, third-party costs and ramp costs. Customer funds are never counted as revenue.",
    },
    economics: {
      title: "Unit economics",
      lead: "The variables we use to set prices and prioritize segments.",
      items: [
        { name: "Revenue per business", measure: "Setup + monthly fee + contracted usage." },
        { name: "Direct cost", measure: "Integration and support hours, infrastructure, sponsored settlement and external services." },
        { name: "Contribution margin", measure: "Revenue minus direct costs, never counting customer funds as revenue." },
        { name: "Commercial payback", measure: "Acquisition cost and time to recover it." },
        { name: "Operational load", measure: "Incidents and support minutes per integration." },
      ],
    },
    signals: {
      title: "Market signals · 2026",
      lead: "People already use AI every day and are starting to shop with it; programmatic payments infrastructure is available.",
      stats: [
        {
          value: 18.8,
          decimals: 1,
          suffix: "%",
          label: "of the world's working-age population used generative AI in June 2026.",
          source: { label: "Microsoft", href: LINKS.microsoft },
        },
        {
          value: 53,
          decimals: 0,
          suffix: "%",
          label: "used AI for a shopping task in the previous three months (11 markets, including Brazil and Mexico).",
          source: { label: "McKinsey", href: LINKS.mckinsey },
        },
        {
          value: 14,
          decimals: 0,
          suffix: "%",
          label: "of AI users completed a purchase directly inside an AI tool.",
          source: { label: "McKinsey", href: LINKS.mckinsey },
        },
      ],
      infra: [
        { label: "x402 Foundation in operation (July 2026)", source: { label: "Linux Foundation", href: LINKS.linuxFoundation } },
        { label: "Agent payments with x402 and spending limits, generally available (August 2026)", source: { label: "AWS", href: LINKS.aws } },
        { label: "Live agentic transactions in Latin America and the Caribbean", source: { label: "Mastercard", href: LINKS.mastercard } },
        { label: "x402 documentation and facilitation on Stellar", source: { label: "Stellar", href: LINKS.stellar } },
      ],
    },
  },
  gtm: {
    eyebrow: "Go-to-market",
    title: "From first contact to the first reconciled payment",
    lead: "We look for a segment with a concrete need for agentic payments and the capacity to integrate a pilot. Success is measured in verifiable decisions: to test, to integrate and to pay.",
    positioning: {
      quote: "TilcAI helps businesses get paid by AI agents and prove those payments on Stellar, connecting authorization, collection and reconciliation through one integration.",
      audiences: [
        { id: "buyers", label: "For buyers", line: "Your agent buys. You decide." },
        { id: "business", label: "For businesses", line: "Get your business ready to receive payments from agents." },
      ],
    },
    icp: {
      title: "First customer",
      items: [
        "Technology or operations lead at a digital merchant or an integrator.",
        "Catalog or API available and control of its own checkout.",
        "Willing to accept USDC and settle on Stellar.",
        "Able to set aside time for a technical test.",
        "We start in Bolivia, where the team has direct access.",
      ],
    },
    channels: {
      title: "Channels, in order",
      items: [
        { title: "Community and existing conversations", text: "Referrals from the Stellar community: interviews about the real payment problem." },
        { title: "Team network", text: "Direct contacts with merchants and payment companies." },
        { title: "Developers and integrators", text: "Reproducible demo, SDK, MCP and documentation." },
        { title: "Content and pitch", text: "Supporting material for every commercial conversation." },
      ],
    },
    events: {
      title: "Events to win customers",
      items: [
        {
          id: "hackathon",
          label: "Hackathons",
          audience: "Developers and integrators",
          goal: "Build a payment prototype with SDK/MCP on testnet from challenges brought by merchants.",
          next: "Technical session with the teams that reach a working integration and the interested merchants.",
        },
        {
          id: "workshop",
          label: "Hands-on workshops",
          audience: "Merchant technology and operations teams",
          goal: "Walk through authorization, collection and reconciliation of an order.",
          next: "Identify a use case and schedule an integration assessment.",
        },
        {
          id: "seminar",
          label: "Seminars and demos",
          audience: "Business leads",
          goal: "Learn the use cases, requirements and operational benefits.",
          next: "Diagnostic interview with businesses that have a concrete problem.",
        },
      ],
    },
    alliances: {
      title: "Alliances",
      items: [
        { partner: "Universities and tech communities", reaches: "Developers" },
        { partner: "Chambers of commerce and incubators", reaches: "Merchants" },
        { partner: "E-commerce integrators", reaches: "Businesses with a compatible checkout" },
      ],
      text: "With every partner we agree who invites, which case is presented and who follows up. We measure qualified businesses, technical meetings, pilot agreements and started integrations by event and by partner.",
    },
    funnel: {
      title: "Validation funnel",
      lead: "We count unique people and businesses at every step, with denominators and drop-off reasons.",
      prev: "Previous step",
      next: "Next step",
      stages: [
        { id: "contact", label: "Contact", question: "Who did we reach, and through which channel?", evidence: "Business, role, use case and consent to follow up." },
        { id: "interview", label: "Interview", question: "Which payment is lost today, or which integration can't be solved?", evidence: "Problem, frequency, alternative and current cost." },
        { id: "problem", label: "Problem confirmed", question: "Does the problem repeat, and does it have an owner?", evidence: "Repeated problem and an identifiable buyer." },
        { id: "usdc", label: "Accepts USDC", question: "What does it need to accept USDC and settle on Stellar?", evidence: "Data, status, refund and support requirements." },
        { id: "session", label: "Technical session", question: "Does it understand the flow and can it run it?", evidence: "Observed result and difficulties." },
        { id: "pilot", label: "Pilot agreement", question: "Who decides, what do they bring and when would they test?", evidence: "Written pilot confirmation." },
        { id: "integration", label: "Integration", question: "Who pays, and under which model?", evidence: "Time to the first reconciled payment, and incidents." },
        { id: "payment", label: "Commercial payment", question: "Is there a useful second use?", evidence: "Documented repeat use, not counting internal tests." },
      ],
      rule: "We continue with a segment when a repeated problem, an identifiable buyer and an integration commitment show up.",
    },
  },
  roadmap: {
    eyebrow: "Roadmap",
    title: "A controlled v1 on Stellar Mainnet in 30 days",
    lead: "An agent makes an authorized x402 payment with real USDC through SDK/MCP; the business verifies the payment and reconciles it with its order. CCTP funding is shown separately on the Avalanche C-Chain → Stellar Mainnet corridor.",
    base: {
      title: "Starting point",
      items: [
        { label: "Mainnet", text: "Transfer of 1 real USDC from Avalanche C-Chain to Stellar and deposit into Vaquita (October 10, 2026 demo).", href: LINKS.deployment },
        { label: "Testnet", text: "CCTP configured from Avalanche Fuji and Monad Testnet to Stellar Testnet." },
        { label: "SDK", text: "x402 buyer and seller examples.", href: LINKS.sdk },
        { label: "MCP", text: "MCP server for cross-chain payments.", href: LINKS.mcp },
      ],
    },
    deliverables: {
      title: "Three deliverables",
      dependsLabel: "Depends on",
      items: [
        { id: "D1", title: "x402 payments on Stellar Mainnet", text: "Live endpoint with real USDC: verifiable order, attempt, status and receipt.", dependsOn: [] },
        { id: "D2", title: "SDK and MCP connector", text: "Authorized and reconciled payment, with limits, retries and idempotency tested.", dependsOn: ["D1"] },
        { id: "D3", title: "CCTP funding Avalanche → Stellar", text: "Origin, attestation, destination and credit recorded; funding and payment traceable separately.", dependsOn: ["D1", "D2"] },
      ],
    },
    sprint: {
      title: "30-day sprint",
      dayLabel: "Days",
      workLabel: "Work",
      evidenceLabel: "Output",
      play: "Play",
      pause: "Pause",
      periods: [
        {
          id: "w1",
          label: "Week 1",
          from: 1,
          to: 7,
          work: "Code and demo inventory; one fixed case with signer, recipient, asset and network; CCTP corridor and facilitator; threats and acceptance criteria.",
          evidence: "Capability matrix, architecture and reproducible baseline tests.",
          deliverables: ["D1", "D2", "D3"],
        },
        {
          id: "w2",
          label: "Week 2",
          from: 8,
          to: 14,
          work: "Build D1 and wire the SDK/MCP buyer flow of D2; order, attempt and hash linked without mixing payment and delivery.",
          evidence: "Testnet payment, runnable example and receipt.",
          deliverables: ["D1", "D2"],
        },
        {
          id: "w3",
          label: "Week 3",
          from: 15,
          to: 21,
          work: "D2 controls and the D3 CCTP route; tests for insufficient funds, invalid authorizations, expiry, retries and reconciliation.",
          evidence: "Test results and origin → destination → payment traceability.",
          deliverables: ["D2", "D3"],
        },
        {
          id: "w4",
          label: "Week 4",
          from: 22,
          to: 28,
          work: "Release review, preflight and controlled mainnet deployment; a low-amount payment and its reconciliation.",
          evidence: "Release, public hash and linked receipt.",
          deliverables: ["D1", "D2", "D3"],
        },
        {
          id: "close",
          label: "Days 29–30",
          from: 29,
          to: 30,
          work: "Close critical bugs and publish the release with its evidence package.",
          evidence: "Complete D1/D2/D3 matrix.",
          deliverables: ["D1", "D2", "D3"],
        },
      ],
      exit: {
        title: "Exit criterion",
        text: "v1 enabled for one reference case with limited access, low-amount real USDC, separate credentials and relayers, limits and pause. Negative and idempotency tests run on testnet first; the sprint closes with a mainnet payment, a public hash and a reconciled receipt.",
      },
    },
    phases: {
      title: "After v1",
      conditionLabel: "Moves on when",
      items: [
        { title: "Commercial pilot", text: "Integration with a business, order and support requirements, experimental pricing.", condition: "The problem is validated and the business commits." },
        { title: "Enterprise operation", text: "Modular accounts, group recovery, fund distribution and permissions.", condition: "The signing and custody model and the threats are defined." },
        { title: "More networks", text: "More CCTP corridors and connectors.", condition: "The first route is reliable and there is specific demand." },
        { title: "Scaling", text: "Wider access, operation, monitoring and support.", condition: "v1 is running and the pilot brings security and demand evidence." },
      ],
    },
    liquidity: {
      title: "Pre-funded liquidity per network",
      lead: "A USDC vault on every enabled network pays the recipient right away; CCTP tops it up in batches, not on every payment.",
      steps: [
        { title: "Local payout", text: "Once the origin payment is verified, the destination vault pays and reconciles origin, order and payout under one unique ID." },
        { title: "Batch top-up", text: "When the balance crosses the minimum, CCTP refills it to the target; funds in transit are recorded so nothing is duplicated." },
        { title: "Controls", text: "Origin confirmations, per-order and per-network limits, alert and pause on insufficient balance." },
        { title: "Netting", text: "With flows in both directions, only the net balance is rebalanced." },
      ],
      sim: {
        title: "How it works",
        origin: "Avalanche",
        destination: "Vault · Stellar",
        balance: "Balance",
        min: "Minimum",
        target: "Target",
        pay: "Pay",
        reset: "Reset",
        payments: "Payments served",
        refills: "CCTP top-ups",
        refilling: "Batch top-up via CCTP…",
        idle: "Press “Pay”: every payment leaves the vault on Stellar.",
        paid: "Payment paid out from the vault on Stellar.",
      },
    },
  },
};

export const strategy: Record<Locale, StrategyCopy> = { es, en };
