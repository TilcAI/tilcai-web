import type { DocsSection, Locale } from "../i18n/types";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const external = (url: string, label: string) => '<a href="' + url + '" rel="noopener">' + label + "</a>";

/** Repository-authored HTML only. Never pass request, wallet or user input here. */
export function getDocsSections(locale: Locale): DocsSection[] {
  const es = locale === "es";
  const l = (a: string, b: string) => es ? a : b;
  const link = (id: string, label: string) => '<a href="/' + locale + '/docs/' + id + '">' + label + "</a>";
  const code = (language: string, source: string, file = language) =>
    '<div class="doc-code"><div class="doc-code-bar"><span>' + escape(file) + '</span><button type="button" data-doc-copy>' + l("Copiar", "Copy") + '</button></div><pre tabindex="0" aria-label="' + escape(file) + '"><code>' + escape(source) + "</code></pre></div>";
  const note = (s: string) => '<aside class="callout is-note">' + s + "</aside>";
  const table = (caption: string, head: string[], rows: string[][]) => '<div class="table-wrap"><table><caption>' + caption + '</caption><thead><tr>' + head.map(h => '<th scope="col">' + h + "</th>").join("") + "</tr></thead><tbody>" + rows.map(row => "<tr>" + row.map(v => "<td>" + v + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>";
  const section = (id: string, title: string, group: DocsSection["group"], html: string): DocsSection => ({ id, title, group, html });
  const repo = (name: string, file: string, label: string) => external("https://github.com/TilcAI/" + name + "/blob/main/" + file, label);
  const proof = external("https://explorer.avax.network/c-chain/tx/0x2c41bfa7ef3dc62cf00041b08bafc9d39767f1b480101d2b7f5a421d83e25449", "Avalanche burn") + " · " + external("https://stellar.expert/explorer/public/tx/8cc98539c002d12450035a353e16058a173763b58d242a9c435beca4bd4b4cf1", "Stellar mint");

  return [
    section("status", l("Qué es TilcAI", "What is TilcAI"), "overview", l(
      '<p class="lede">Infraestructura para el comercio entre agentes de IA, personas y negocios. Conecta una intención con reglas, autorización y pagos verificables.</p><p>TilcAI construye las piezas para que un asistente pueda consultar, cotizar y comprar con autoridad limitada. Los rieles financieros ya tienen pruebas funcionales; unir catálogo, oferta, aprobación, pago y cumplimiento comercial sigue en integración. <strong>El flujo de compra completo no está habilitado.</strong></p>',
      '<p class="lede">Infrastructure for commerce between AI agents, people and businesses. Connect an intent to rules, authorization and verifiable payments.</p><p>TilcAI is building the components an assistant needs to discover, quote and purchase with limited authority. Financial rails have functional evidence; connecting catalog, offer, approval, payment and fulfillment remains in integration. <strong>The complete purchase flow is not enabled.</strong></p>'
    ) + '<h3>' + l("Estado de las capacidades", "Capability status") + "</h3>" + table(l("Evidencia disponible al 20 de octubre de 2026", "Evidence available as of 20 October 2026"), [l("Capacidad", "Capability"), l("Estado y alcance", "Status and scope")], [
      ["CCTP · Avalanche → Stellar", l("Probado en testnet y mainnet. El 10 de octubre se documentó además un pago de 1 USDC y posterior fondeo en Vaquita.", "Tested on testnet and mainnet. A 1 USDC payment and subsequent Vaquita funding were also recorded on 10 October.")],
      ["Monad Testnet", l("Integrado en API, worker, cuentas y vault. Pagos de 0.01 USDC y desembolso de 0.5 USDC registrados en el historial del equipo.", "Integrated into the API, worker, accounts and vault. The team log records 0.01 USDC payments and a 0.5 USDC disbursement.")],
      ["SDK · MCP · API", l("SDK Node.js 0.1.0 y MCP 0.2.0. El SDK admite Monad; el MCP publicado mantiene la ruta Avalanche → Stellar.", "Node.js SDK 0.1.0 and MCP 0.2.0. The SDK supports Monad; the published MCP retains the Avalanche → Stellar route.")],
      [l("Smart accounts", "Smart accounts"), l("Passkeys verificadas en testnet. Despliegues adicionales de mainnet confirmados por el equipo; faltan direcciones y verificación pública.", "Passkeys verified on testnet. Additional mainnet deployments are team-confirmed; public addresses and verification remain pending.")],
      ["QR · Bs", l("Acceso a APIs bancarias reportado por el equipo; generación de QR en pruebas. El backend conserva un mock. Conversión fiat → USDC aún en integración.", "Bank API access reported by the team; QR generation under testing. The backend retains a mock. Fiat → USDC conversion remains in integration.")],
      [l("Identidad y reputación", "Identity and reputation"), l("Identidad y validación forman parte del diseño de control. Reputación y delegación con presupuesto siguen en desarrollo.", "Identity and validation are part of the control design. Reputation and budgeted delegation remain in development.")],
    ]) + note(l("Sin auditar. Una prueba funcional no acredita seguridad de producción, todos los contratos ni todas las rutas. Consulta ", "Not audited. A functional test does not establish production security, all contracts or all routes. See ") + link("mainnet", l("evidencia mainnet", "mainnet evidence")) + " · " + link("limits", l("seguridad y límites", "security and limits")) + ".") +
    '<h3>' + l("Elige tu integración", "Choose your integration") + "</h3><p>" + link("sdk", l("SDK para aplicaciones", "SDK for applications")) + " · " + link("mcp", l("MCP para agentes", "MCP for agents")) + " · " + link("api", "HTTP API") + "</p>"),

    section("quickstart", l("Inicio rápido", "Quickstart"), "overview",
      '<p class="lede">' + l("Conecta tu backend y descubre sus rutas antes de preparar un pago.", "Connect your backend and discover its routes before preparing a payment.") + "</p>" +
      note(l("Este ejemplo solo consulta salud y rutas. No crea cuentas, firma autorizaciones ni envía fondos.", "This example only reads health and routes. It does not create accounts, sign authorizations or send funds.")) +
      '<h3>' + l("1. Prepara el entorno", "1. Prepare your environment") + "</h3><p>" + l("Necesitas Node.js 20 o superior, una instancia accesible de tilcai-infrastructure y una clave de tenant con permiso ", "You need Node.js 20 or later, a reachable tilcai-infrastructure instance and a tenant key with the ") + '<code>payments</code>' + l(". No existe una URL pública universal de API: usa la de tu despliegue o la que te facilite el operador.", " scope. There is no universal public API URL: use your deployment URL or one supplied by its operator.") + "</p>" +
      code("bash", "npm install tilcai-sdk", "Terminal") +
      code("dotenv", 'TILCAI_API_URL=https://YOUR_INSTANCE\nTILCAI_API_KEY=YOUR_SERVER_SIDE_KEY\nTILCAI_NETWORK=testnet', ".env · " + l("solo servidor", "server only")) +
      '<h3>' + l("2. Comprueba la instancia", "2. Check the instance") + "</h3>" + code("typescript", 'import { Tilcai } from "tilcai-sdk";\n\nconst tilcai = Tilcai.fromEnv();\nconst health = await tilcai.verifyEnvironment();\nconst routes = await tilcai.routes();\n\nconsole.log(health.env, health.transactionsEnabled);\nconsole.log(routes);', "check.ts") +
      '<h3>' + l("3. Escoge el siguiente paso", "3. Choose the next step") + "</h3><p>" + l("La red anunciada, los modos de la ruta y el estado de la instancia deciden qué puedes hacer. ", "The advertised network, route modes and instance status determine what you can do. ") + link("sdk", l("Prepara una cotización con el SDK", "Prepare a quote with the SDK")) + " · " + link("rails", l("Revisa la cobertura", "Review network coverage")) + ".</p>" +
      note(l("Guarda la clave en el servidor. No uses NEXT_PUBLIC_, no la pegues en un chat y no la incluyas en el frontend.", "Keep the key on the server. Do not use NEXT_PUBLIC_, paste it in a chat or include it in frontend code."))),

    section("operation", l("De la intención al recibo", "From intent to receipt"), "overview",
      '<p class="lede">' + l("Una compra y un pago tienen ciclos de vida distintos. TilcAI busca conectarlos sin confundir autorización, liquidación y entrega.", "A purchase and a payment have different lifecycles. TilcAI aims to connect them while distinguishing authorization, settlement and fulfillment.") + "</p>" +
      note(l("El siguiente flujo describe el producto que se está integrando; no es un checkout comercial completo ya disponible.", "The following flow describes the product being integrated; it is not a complete commercial checkout available today.")) +
      '<ol class="doc-steps">' + [
        [l("Intención", "Intent"), l("La persona solicita un producto o servicio. Se identifica al principal y al agente que actúa.", "The person requests a product or service. The principal and acting agent are identified.")],
        [l("Oferta verificable", "Verifiable offer"), l("El negocio confirma precio, disponibilidad, vigencia y destino de cobro. El modelo no inventa condiciones.", "The business confirms price, availability, expiry and payment destination. The model does not invent terms.")],
        [l("Validación y política", "Validation and policy"), l("Se comprueban identidad, destinatario, límites y versión de la oferta. ALLOW no es una firma.", "Identity, recipient, limits and offer version are checked. ALLOW is not a signature.")],
        [l("Autorización exacta", "Exact authorization"), l("El dueño aprueba el importe, activo, red, destinatario y vencimiento mediante un firmante confiable.", "The owner approves amount, asset, network, recipient and expiry through a trusted signer.")],
        [l("Pago y conciliación", "Payment and reconciliation"), l("Un intento idempotente sigue la ruta habilitada. Un timeout se investiga antes de repetir.", "An idempotent attempt follows an enabled route. A timeout is investigated before retrying.")],
        [l("Recibo y cumplimiento", "Receipt and fulfillment"), l("El recibo financiero prueba la liquidación. La confirmación del negocio prueba la reserva o entrega.", "The financial receipt proves settlement. Business confirmation proves booking or delivery.")],
      ].map(([h,p]) => "<li><h3>" + h + "</h3><p>" + p + "</p></li>").join("") + "</ol>" +
      '<h3>' + l("Identificadores compartidos", "Shared identifiers") + '</h3><p><code>principalId</code> · <code>agentId</code> · <code>businessId</code> · <code>quoteId</code> · <code>orderId</code> · <code>paymentAttemptId</code>.</p><p>' +
      l("Pagado no significa entregado. Cancelación, devolución y resolución de disputas necesitan reglas comerciales propias.", "Paid does not mean delivered. Cancellation, refund and dispute resolution need their own commercial rules.") + "</p>"),

    section("sdk", "SDK · TypeScript", "integrate",
      '<p class="lede">' + l("Un cliente Node.js para pagos, cuentas, vault, monitorización y x402. ESM y CommonJS, con tipos y sin dependencias de runtime obligatorias.", "A Node.js client for payments, accounts, vault, monitoring and x402. ESM and CommonJS, typed, with no required runtime dependencies.") + "</p><p>" +
      external("https://www.npmjs.com/package/tilcai-sdk", "tilcai-sdk") + " · v0.1.0 · Node.js ≥ 20 · " + repo("tilcai-sdk", "README.md", "README") + "</p>" +
      '<h3>' + l("Cotizar sin mover fondos", "Quote without moving funds") + "</h3><p>" + l("Configura una dirección Stellar válida con trustline de USDC. La cotización consulta la disponibilidad del destinatario; no autoriza ni paga.", "Configure a valid Stellar address with a USDC trustline. A quote checks recipient readiness; it does not authorize or pay.") + "</p>" +
      code("typescript", 'import { Tilcai } from "tilcai-sdk";\n\nconst tilcai = Tilcai.fromEnv();\nawait tilcai.verifyEnvironment();\n\nconst quote = await tilcai.payments.quote({\n  source: "monad", // testnet only\n  amount: "1.25",\n  payTo: process.env.STELLAR_RECIPIENT!,\n});\nconsole.log(quote);', "quote.ts") +
      '<h3>' + l("Elegir quién firma", "Choose who signs") + "</h3>" + table(l("Modos de pago", "Payment modes"), ["mode", l("Autorización", "Authorization"), l("Gas", "Gas")], [
        ["gasless", l("Wallet EVM · EIP-3009 / EIP-712", "EVM wallet · EIP-3009 / EIP-712"), "Relayer"],
        ["account", l("Passkey de la smart account · ERC-1271", "Smart account passkey · ERC-1271"), "Relayer"],
        ["external", l("Wallet difunde approve + burn", "Wallet broadcasts approve + burn"), l("Origen: pagador · destino: relayer", "Source: payer · destination: relayer")],
      ]) +
      '<p>' + l("El flujo transaccional usa ", "The transaction flow uses ") + '<code>payments.pay({ from, amount, payTo, signer, idempotencyKey, approve })</code>. ' +
      l("No lo ejecutes hasta revisar la cotización y aprobar el movimiento de fondos. viem y @stellar/stellar-sdk son dependencias opcionales para sus respectivos firmantes.", "Do not execute it until you review the quote and approve the movement of funds. viem and @stellar/stellar-sdk are optional dependencies for their respective signers.") + "</p>" +
      '<h3>' + l("Reintentos y errores", "Retries and errors") + "</h3><p>" + l("Conserva la clave de idempotencia y el paymentId. Si PaymentError tiene uncertain: true, consulta payments.get(id) o concilia el intento existente; no crees otro pago.", "Keep the idempotency key and paymentId. If PaymentError has uncertain: true, call payments.get(id) or reconcile the existing attempt; do not create another payment.") + "</p>" +
      note(l("El SDK admite Avalanche y Monad Testnet. Su entorno resuelve los alias. El soporte de una librería no activa una red ni un contrato en tu instancia.", "The SDK supports Avalanche and Monad Testnet. Its environment resolves aliases. Library support does not activate a network or contract in your instance."))),

    section("mcp", l("MCP para agentes", "MCP for agents"), "integrate",
      '<p class="lede">' + l("Expón los pagos de TilcAI a un cliente MCP. El servidor stdio habla con la API; la wallet firma fuera de TilcAI MCP.", "Expose TilcAI payments to an MCP client. The stdio server talks to the API; the wallet signs outside TilcAI MCP.") + "</p><p>" +
      external("https://www.npmjs.com/package/tilcai-mcp", "tilcai-mcp") + " · v0.2.0 · Node.js ≥ 22.16 · " + repo("tilcai-mcp", "README.md", "README") + "</p>" +
      '<h3>' + l("Configurar el cliente", "Configure the client") + "</h3>" +
      code("json", '{\n  "mcpServers": {\n    "tilcai": {\n      "command": "npx",\n      "args": ["-y", "tilcai-mcp@0.2.0"],\n      "env": {\n        "TILCAI_API_URL": "https://YOUR_INSTANCE",\n        "TILCAI_NETWORK": "testnet"\n      }\n    }\n  }\n}', "mcp.json") +
      '<p>' + l("Inyecta TILCAI_API_KEY desde el gestor de secretos o el entorno del cliente, según su formato. No incluyas la clave real en un archivo compartido. Consulta la documentación de tu cliente para la interpolación de variables.", "Inject TILCAI_API_KEY through your client's secret manager or environment, using its supported format. Do not include the real key in a shared file. Refer to your client's documentation for variable interpolation.") + "</p>" +
      '<h3>' + l("Herramientas disponibles", "Available tools") + "</h3>" + table("MCP", [l("Herramienta", "Tool"), l("Función", "Purpose")], [
        ["<code>tilcai_status</code>", l("Salud, entorno y rutas; úsala primero.", "Health, environment and routes; use this first.")],
        ["<code>tilcai_quote</code>", l("Cotización y preflight de USDC hacia Stellar.", "USDC quote and recipient preflight for Stellar.")],
        ["<code>tilcai_create_payment</code>", l("Crea el intento y devuelve lo que la wallet debe firmar.", "Creates the attempt and returns what the wallet must sign.")],
        ["<code>tilcai_submit_authorization</code>", l("Entrega la firma gasless a la API.", "Submits the gasless signature to the API.")],
        ["<code>tilcai_submit_burn</code>", l("Registra el hash del modo external.", "Records the external-mode transaction hash.")],
        ["<code>tilcai_payment_status</code>", l("Consulta y concilia hasta SETTLED.", "Reads and reconciles up to SETTLED.")],
      ]) +
      '<h3>' + l("La frontera de la wallet", "The wallet boundary") + "</h3><p>" +
      l("La wallet EVM, por ejemplo evm-mcp-server, firma EIP-712. TilcAI MCP no recibe claves privadas. La versión actual fija Avalanche Fuji → Stellar Testnet o C-Chain → Stellar Public Network según TILCAI_NETWORK. Para Monad utiliza SDK/API; no asumas que el MCP ya lo selecciona.", "The EVM wallet, for example evm-mcp-server, signs EIP-712. TilcAI MCP does not receive private keys. The current version selects Avalanche Fuji → Stellar Testnet or C-Chain → Stellar Public Network using TILCAI_NETWORK. Use the SDK/API for Monad; do not assume the MCP already selects it.") + "</p>" +
      note(l("Tener una herramienta de pago no autoriza gasto autónomo ilimitado. La aprobación, las cuotas y la custodia del firmante siguen siendo responsabilidades explícitas.", "Having a payment tool does not authorize unlimited autonomous spending. Approval, quotas and signer custody remain explicit responsibilities."))),

    section("api", "HTTP API", "integrate",
      '<p class="lede">' + l("Referencia de las rutas implementadas en tilcai-infrastructure. La disponibilidad depende del entorno y de los módulos de tu instancia.", "Reference for routes implemented in tilcai-infrastructure. Availability depends on your instance environment and enabled modules.") + "</p>" +
      '<h3>' + l("Autenticación", "Authentication") + '</h3><p><code>Authorization: Bearer YOUR_KEY</code>. ' + l("Las claves de tenant aíslan recursos y scopes. Vault, monitor y estado del relayer son rutas de operador. /health es pública; el webhook del relayer usa firma propia.", "Tenant keys isolate resources and scopes. Vault, monitor and relayer status are operator routes. /health is public; the relayer webhook uses its own signature.") + "</p>" +
      code("bash", 'curl "$TILCAI_API_URL/v1/routes" \\\n  -H "Authorization: Bearer $TILCAI_API_KEY"', "Terminal · GET") +
      '<h3>' + l("Rutas por recurso", "Resource routes") + "</h3>" + table(l("API v1", "API v1"), [l("Método", "Method"), l("Ruta", "Path"), l("Requisito", "Requirement")], [
        ["GET", "<code>/health</code>", l("Sin Bearer", "No Bearer")],
        ["GET", "<code>/v1/routes</code>", "payments"],
        ["POST", "<code>/v1/crosschain/quotes</code>", "payments"],
        ["POST", "<code>/v1/crosschain/payments</code>", "payments · Idempotency-Key"],
        ["GET", "<code>/v1/crosschain/payments/:id</code>", "payments"],
        ["POST", "<code>/v1/crosschain/payments/:id/authorization</code>", "payments"],
        ["POST", "<code>/v1/crosschain/payments/:id/burn</code>", "payments"],
        ["POST", "<code>/v1/crosschain/payments/:id/reconcile</code>", "payments"],
        ["POST / GET", "<code>/v1/accounts</code>", "accounts:write / accounts:read"],
        ["GET", "<code>/v1/accounts/:id</code>", "accounts:read"],
        ["GET / POST", "<code>/v1/vault</code> / <code>/v1/vault/disbursements</code>", l("Operador", "Operator")],
        ["GET", "<code>/v1/monitor/events</code> · <code>/stream</code> · <code>/resources</code>", l("Operador · prefijo /v1/monitor", "Operator · /v1/monitor prefix")],
      ]) +
      '<h3>' + l("Formato de una cotización", "Quote request shape") + "</h3>" + code("json", '{\n  "sourceNetwork": "eip155:10143",\n  "destinationNetwork": "stellar:testnet",\n  "amount": "1.25",\n  "payTo": "REPLACE_WITH_VALID_STELLAR_ADDRESS"\n}', "POST /v1/crosschain/quotes") +
      '<p>' + l("El destinatario del ejemplo es un marcador. Sustitúyelo por una dirección válida. El importe es una cadena decimal de USDC; las unidades atómicas se gestionan en la infraestructura.", "The example recipient is a placeholder. Replace it with a valid address. Amount is a decimal USDC string; atomic units are managed by the infrastructure.") + "</p>" +
      '<h3>' + l("Idempotencia y respuestas", "Idempotency and responses") + "</h3><p>" +
      l("Usa una clave estable por operación lógica en Idempotency-Key, de 8 a 128 caracteres alfanuméricos, guion o guion bajo. Los errores de dominio incluyen error.code, message y recovery; la API puede añadir detail. Consulta el mismo paymentId después de un timeout.", "Use a stable Idempotency-Key for each logical operation: 8–128 alphanumeric, hyphen or underscore characters. Domain errors include error.code, message and recovery; the API may add detail. Query the same paymentId after a timeout.") + "</p><p>" +
      repo("tilcai-infrastructure", "src/apps/api/server.ts", l("Schemas y rutas en el código", "Schemas and routes in source")) + " · " + repo("tilcai-infrastructure", "src/apps/api/accounts-routes.ts", l("Rutas de cuentas", "Account routes")) + "</p>"),

    section("architecture", l("Arquitectura", "Architecture"), "design",
      '<p class="lede">' + l("Tres planos separan conversación, autoridad y ejecución financiera. El modelo ayuda con la intención; las reglas y el firmante controlan el dinero.", "Three planes separate conversation, authority and financial execution. The model helps with intent; rules and the signer control money.") + "</p>" +
      '<h3>' + l("Responsabilidades y dependencias", "Responsibilities and dependencies") + "</h3>" + table(l("Mapa de componentes", "Component map"), [l("Componente", "Component"), l("Responsabilidad", "Responsibility")], [
        ["MCP / SDK / HTTP", l("Entradas de integración; no sustituyen al firmante.", "Integration entry points; they do not replace the signer.")],
        ["API · tenants", l("Autenticación, scopes, cotización, intentos y cuentas.", "Authentication, scopes, quotes, attempts and accounts.")],
        ["Worker · SQLite", l("Estados persistidos, reanudación y conciliación de pagos y desembolsos.", "Persisted states, resumption and reconciliation of payments and disbursements.")],
        ["OpenZeppelin Relayer · Redis", l("Envío de transacciones y gas patrocinado. Redis pertenece a la operación del relayer.", "Transaction submission and sponsored gas. Redis belongs to relayer operations.")],
        ["Circle CCTP V2 · Iris", l("Burn, atestación y mint de USDC nativo.", "Native USDC burn, attestation and mint.")],
        ["Stellar / EVM", l("Ejecución y evidencia en cadena; no equivalen a confirmación comercial.", "Execution and on-chain evidence; not equivalent to commercial confirmation.")],
        [l("Negocio / proveedor fiat", "Business / fiat provider"), l("Fuente externa de stock, precio, cobro bancario y cumplimiento.", "External source of inventory, price, bank payment and fulfillment.")],
      ]) +
      '<h3>' + l("Repositorios y límites", "Repositories and boundaries") + "</h3><p>" +
      l("tilcai-core define contratos compartidos y políticas; tilcai-infrastructure implementa el backend y adaptadores; tilcai-sdk y tilcai-mcp lo consumen; tilcai-cctp-engine es un laboratorio de rutas; tilcai-web documenta y monitoriza.", "tilcai-core defines shared contracts and policies; tilcai-infrastructure implements the backend and adapters; tilcai-sdk and tilcai-mcp consume it; tilcai-cctp-engine is a route laboratory; tilcai-web documents and monitors.") + "</p>" +
      note(l("Las cajas son responsabilidades lógicas, no un microservicio por caja. La API y los workers pueden vivir en el mismo proceso; desplegar servicios y desplegar contratos son operaciones diferentes.", "Boxes represent logical responsibilities, not one microservice per box. API and workers may share a process; deploying services and deploying contracts are different operations."))),

    section("business", l("Negocios y ofertas", "Businesses and offers"), "design",
      '<p class="lede">' + l("El negocio conserva la autoridad sobre precios, disponibilidad y cumplimiento. El agente del comprador no inventa una oferta.", "The business retains authority over pricing, availability and fulfillment. The buyer agent does not invent an offer.") + "</p>" +
      '<h3>' + l("Una oferta verificable", "A verifiable offer") + "</h3><p>" +
      l("Debe identificar negocio y servicio, importe y activo, red y destinatario, stock o cupo, vencimiento y versión. La fuente puede ser un agente, un POS, una agenda o una consola del negocio, detrás de un adaptador comercial.", "It must identify business and service, amount and asset, network and recipient, inventory or capacity, expiry and version. The source may be an agent, POS, calendar or business console behind a commercial adapter.") + "</p>" +
      '<h3>' + l("Identidad, validación y reputación", "Identity, validation and reputation") + "</h3><ul><li>" +
      l("<strong>Identidad:</strong> quién actúa, para quién y con qué claves.", "<strong>Identity:</strong> who acts, for whom and with which keys.") + "</li><li>" +
      l("<strong>Validación:</strong> integridad de la oferta, destinatario y autorización exacta.", "<strong>Validation:</strong> integrity of the offer, recipient and exact authorization.") + "</li><li>" +
      l("<strong>Reputación:</strong> señales basadas en resultados verificables; todavía en desarrollo, sin un score productivo acreditado.", "<strong>Reputation:</strong> signals based on verifiable outcomes; still in development, with no validated production score.") + "</li></ul>" +
      '<h3>' + l("Unir la compra y el pago", "Connect purchase and payment") + "</h3><p>" +
      l("El orderId relaciona oferta, aprobación y recibo. Un pago liquidado no confirma stock ni entrega. Los adaptadores de catálogo, cotización y orden siguen integrándose; una herramienta comercial no debe anunciarse operativa solo porque exista su contrato compartido.", "orderId connects offer, approval and receipt. A settled payment does not confirm inventory or delivery. Catalog, quote and order adapters remain in integration; a commercial tool should not be described as operational merely because its shared contract exists.") + "</p>"),

    section("accounts", l("Smart accounts y passkeys", "Smart accounts and passkeys"), "design",
      '<p class="lede">' + l("La cuenta pertenece a su dueño; la passkey autoriza. El agente solicita acciones y el relayer patrocina gas.", "The account belongs to its owner; the passkey authorizes. The agent requests actions and the relayer sponsors gas.") + "</p>" +
      '<h3>' + l("Estado por entorno", "Status by environment") + "</h3><p>" +
      l("Se registraron pruebas funcionales de cuentas EVM con passkey en Fuji y Monad Testnet, y emisión de cuentas Soroban en Stellar Testnet. Los despliegues de mainnet están confirmados por el equipo, pero faltan direcciones públicas, hashes y verificación de activación.", "Functional passkey EVM account tests were recorded on Fuji and Monad Testnet, along with Soroban account issuance on Stellar Testnet. Mainnet deployments are team-confirmed, but public addresses, hashes and activation verification remain pending.") + "</p>" +
      '<h3>' + l("Emisión y firma", "Issuance and signing") + "</h3><p>" +
      l("La API requiere accounts:write para emitir y accounts:read para consultar. El SDK acepta passkeyOwner con una clave pública P-256; Stellar también admite ed25519Owner. La cuenta pasa de DEPLOYING a ACTIVE cuando se comprueba en cadena.", "The API requires accounts:write to issue and accounts:read to query. The SDK accepts passkeyOwner with a P-256 public key; Stellar also supports ed25519Owner. An account moves from DEPLOYING to ACTIVE after on-chain verification.") + "</p>" +
      code("typescript", 'import { Tilcai } from "tilcai-sdk";\nconst tilcai = Tilcai.fromEnv();\nawait tilcai.verifyEnvironment();\n\n// Read only: list accounts belonging to this tenant.\nconst accounts = await tilcai.accounts.list({ network: "monad" });\nconsole.log(accounts);', "accounts.ts") +
      '<h3>' + l("Fondeo y recuperación", "Funding and recovery") + "</h3><p>" +
      l("Crear una cuenta no la fondea. Una dirección Stellar C… no recibe activos EVM enviados directamente: usa una ruta habilitada y valida la compatibilidad del destinatario. La delegación presupuestada a agentes, la recuperación probada y la auditoría siguen pendientes.", "Creating an account does not fund it. A Stellar C… address does not receive EVM assets sent directly: use an enabled route and validate recipient compatibility. Budgeted agent delegation, tested recovery and audit remain pending.") + "</p>" +
      note(l("Una passkey no concede autonomía al agente. Una clave API tampoco sustituye la firma del dueño.", "A passkey does not grant agent autonomy. An API key does not replace the owner's signature."))),

    section("rails", l("Crosschain y redes", "Crosschain and networks"), "payments",
      '<p class="lede">' + l("Mueve USDC nativo desde una red de origen habilitada hacia Stellar mediante Circle CCTP V2. No es un swap de cualquier token.", "Move native USDC from an enabled source network to Stellar through Circle CCTP V2. This is not an arbitrary token swap.") + "</p>" +
      '<h3>' + l("Cobertura del backend", "Backend coverage") + "</h3>" + table(l("Redes seleccionadas por entorno", "Environment-specific networks"), [l("Red", "Network"), "CAIP-2", l("Rol y evidencia", "Role and evidence")], [
        ["Avalanche Fuji", "<code>eip155:43113</code>", l("Origen testnet · transferencias documentadas", "Testnet source · documented transfers")],
        ["Monad Testnet", "<code>eip155:10143</code>", l("Origen testnet · gasless, account y vault registrados", "Testnet source · gasless, account and vault recorded")],
        ["Stellar Testnet", "<code>stellar:testnet</code>", l("Destino testnet · dominio CCTP 27", "Testnet destination · CCTP domain 27")],
        ["Avalanche C-Chain", "<code>eip155:43114</code>", l("Origen mainnet · USDC real", "Mainnet source · real USDC")],
        ["Stellar Public Network", "<code>stellar:pubnet</code>", l("Destino mainnet · USDC real", "Mainnet destination · real USDC")],
      ]) +
      '<h3>' + l("Ciclo de vida", "Lifecycle") + '</h3><ol class="doc-states">' +
      ["AWAITING_BURN", "BURN_SUBMITTED", "BURN_CONFIRMED", "ATTESTED", "MINT_SUBMITTED", "SETTLED"].map((s,i) => "<li><code>" + s + "</code><span>" + [
        l("Espera autorización o burn", "Await authorization or burn"), l("Hash de origen persistido", "Source hash persisted"), l("Evento y recibo verificados", "Event and receipt verified"), l("Mensaje y atestación de Circle verificados", "Circle message and attestation verified"), l("Mint enviado por el relayer", "Mint submitted by the relayer"), l("Liquidación comprobada en destino", "Destination settlement verified")
      ][i] + "</span></li>").join("") + "</ol>" +
      '<h3>' + l("Detalles que cambian por red", "Network-specific details") + "</h3><p>" +
      l("Fuji y C-Chain usan el dominio CCTP 1; Monad Testnet usa 15; Stellar usa 27. USDC EVM tiene 6 decimales y su SAC en Stellar 7. El dominio EIP-712 del token de Monad es USDC / 2; no copies el de Avalanche (USD Coin / 2). El SDK resuelve estos valores.", "Fuji and C-Chain use CCTP domain 1; Monad Testnet uses 15; Stellar uses 27. EVM USDC has 6 decimals and its Stellar SAC has 7. Monad's token EIP-712 domain is USDC / 2; do not copy Avalanche's (USD Coin / 2). The SDK resolves these values.") + "</p>" +
      note(l("Ethereum Sepolia, Base Sepolia y Arbitrum Sepolia tienen trabajo y pruebas documentadas en el laboratorio CCTP. No están registradas como orígenes en el backend actual. /v1/routes es la autoridad para la instancia que consumes; no confundas laboratorio con cobertura activa.", "Ethereum Sepolia, Base Sepolia and Arbitrum Sepolia have work and tests documented in the CCTP laboratory. They are not registered as sources in the current backend. /v1/routes is authoritative for your instance; do not confuse laboratory work with active coverage.")) +
      '<p>' + repo("tilcai-infrastructure", "src/config/networks.ts", l("Registro de redes", "Network registry")) + " · " + external("https://developers.circle.com/cctp/concepts/supported-chains-and-domains", "Circle CCTP") + "</p>"),

    section("monad", "Monad Testnet", "payments",
      '<p class="lede">' + l("Una segunda red EVM de origen integrada junto a Fuji, con cuentas, pagos USDC y vault hacia Stellar Testnet.", "A second EVM source network integrated alongside Fuji, with accounts, USDC payments and a vault for Stellar Testnet.") + "</p>" +
      '<h3>' + l("Parámetros de red", "Network parameters") + '</h3><p><code>eip155:10143</code> · CCTP domain <code>15</code> · gas <code>MON</code> · ' + l("destino", "destination") + ' <code>stellar:testnet</code>. ' + l("El dominio EIP-712 de USDC es USDC / 2; no reutilices USD Coin / 2 de Avalanche.", "The USDC EIP-712 domain is USDC / 2; do not reuse Avalanche’s USD Coin / 2.") + "</p>" +
      '<h3>' + l("Pruebas registradas", "Recorded tests") + "</h3><p>" +
      l("El historial del 13 de octubre registra despliegues de Router, RouterV2, AccountFactory y Vault, pagos de 0.01 USDC en modos dev_signer, dev_gasless y account, y un desembolso de 0.5 USDC. Después se comprobó un pago dev_gasless contra el contenedor reconstruido, junto con eventos y recursos de MON en el monitor.", "The 13 October log records Router, RouterV2, AccountFactory and Vault deployments, 0.01 USDC payments in dev_signer, dev_gasless and account modes, and a 0.5 USDC disbursement. A later dev_gasless payment was checked against the rebuilt container, along with events and MON resources in the monitor.") + "</p>" +
      '<h3>' + l("Integrar con SDK o API", "Integrate through SDK or API") + "</h3><p>" +
      l("Usa el alias monad con environment:testnet en el SDK, o sourceNetwork:eip155:10143 en la API. Consulta /v1/routes para comprobar los modos habilitados y /health para confirmar el entorno. El MCP 0.2.0 no selecciona Monad; x402 en Monad necesita su prueba de extremo a extremo.", "Use the monad alias with environment:testnet in the SDK, or sourceNetwork:eip155:10143 in the API. Query /v1/routes to check enabled modes and /health to confirm the environment. MCP 0.2.0 does not select Monad; x402 on Monad requires its own end-to-end test.") + "</p>" +
      '<p>' + link("sdk", l("Ejemplo de cotización", "Quote example")) + " · " + repo("tilcai-infrastructure", "contracts/evm/README.md", l("Direcciones documentadas", "Documented addresses")) + "</p>" +
      note(l("Este soporte corresponde a Monad Testnet. No anuncia soporte de Monad Mainnet ni mueve tokens de producción.", "This support is for Monad Testnet. It does not announce Monad Mainnet support or move production tokens."))),

    section("mainnet", l("Mainnet y evidencia", "Mainnet and evidence"), "payments",
      '<p class="lede">' + l("Avalanche C-Chain → Stellar Public Network, con USDC real y gas patrocinado por TilcAI.", "Avalanche C-Chain → Stellar Public Network, using real USDC and gas sponsored by TilcAI.") + "</p>" +
      '<figure class="doc-evidence"><img src="/docs/vaquita-mainnet-demo.jpg" alt="' + l("Saldo de 1 USDC disponible en Vaquita tras el fondeo de la demo", "1 USDC available in Vaquita following demonstration funding") + '" width="1280" height="720" loading="lazy"><figcaption>' + l("Captura real de la demo · 10 oct 2026 · saldo disponible en Vaquita. El depósito DeFi es una operación posterior y distinta del pago CCTP.", "Actual demo frame · 10 Oct 2026 · available balance in Vaquita. A DeFi deposit is a subsequent operation separate from the CCTP payment.") + '</figcaption></figure>' +
      '<h3>' + l("Prueba del 10 de octubre", "10 October demonstration") + "</h3><p>" +
      l("La grabación aportada por el equipo muestra un pago de 1 USDC, estado SETTLED y acreditación en Stellar, seguido de fondeo en Vaquita. La wallet pagadora tenía 0 AVAX; el relayer cubrió el gas. La evidencia incluye un reintento del mint por expiración de time bounds.", "The team-provided recording shows a 1 USDC payment, SETTLED status and credit on Stellar, followed by Vaquita funding. The payer wallet held 0 AVAX; the relayer covered gas. The evidence includes a mint retry following expired time bounds.") + "</p><p>" + proof + "</p>" +
      note(l("Los hashes proceden de la evidencia de la demo; esta actualización no vuelve a verificar la cadena en vivo. El fondeo posterior en Vaquita es una acción distinta: CCTP liquida USDC en Stellar y no ejecuta por sí solo un depósito DeFi.", "Hashes come from the demonstration evidence; this update does not re-verify the live chain. Subsequent Vaquita funding is a separate action: CCTP settles USDC on Stellar and does not itself execute a DeFi deposit.")) +
      '<h3>' + l("Contratos y activación", "Contracts and activation") + "</h3>" + table(l("Estado documentado", "Documented status"), [l("Componente", "Component"), l("Evidencia y pendiente", "Evidence and remaining work")], [
        ["TilcaiCctpRouter", '<code>0xf6a2EdE00c441863519C6B30A1eb2d04E61847AB</code> · Avalanche C-Chain · ' + l("dirección documentada", "documented address")],
        ["RouterV2 · factories · vaults · " + l("verificadores", "verifiers"), l("Desplegados según confirmación del equipo. Direcciones, hashes y verificación on-chain pendientes de publicar.", "Deployed according to team confirmation. Addresses, hashes and on-chain verification remain to be published.")],
        ["x402 · " + l("delegación", "delegation"), l("La integración de mainnet necesita validación propia. No queda acreditada por una transferencia CCTP.", "Mainnet integration requires its own validation. A CCTP transfer does not establish it.")],
      ]) +
      '<h3>' + l("Aislamiento por entorno", "Environment isolation") + "</h3><p>" +
      l("TILCAI_ENV=mainnet selecciona redes públicas. MAINNET_TRANSACTIONS_ENABLED=false deja el proceso en solo lectura. La instancia requiere base, claves y relayer IDs separados de testnet; rechaza claves de desarrollo y QR_MOCK_ENABLED. Confirma el entorno con /health antes de preparar una firma.", "TILCAI_ENV=mainnet selects public networks. MAINNET_TRANSACTIONS_ENABLED=false makes the process read-only. The instance requires a separate database, keys and relayer IDs from testnet; it rejects development keys and QR_MOCK_ENABLED. Confirm the environment with /health before preparing a signature.") + "</p><p>" +
      repo("tilcai-infrastructure", "deploy/MAINNET_DEPLOYMENT.md", l("Registro de despliegue y operación", "Deployment and operations record")) + "</p>" +
      note(l("No hay auditoría independiente de los contratos propios. Estas pruebas no son una declaración de preparación para operar fondos de terceros a escala.", "There is no independent audit of proprietary contracts. These tests do not establish readiness to handle third-party funds at scale."))),

    section("x402", l("Pagos HTTP · x402", "HTTP payments · x402"), "payments",
      '<p class="lede">' + l("Cobra un recurso HTTP con USDC: el servidor comunica condiciones, el cliente autoriza y el facilitador verifica y liquida.", "Charge USDC for an HTTP resource: the server communicates requirements, the client authorizes, and the facilitator verifies and settles.") + "</p>" +
      '<h3>' + l("Una API distinta", "A separate API") + "</h3><p>" +
      l("El facilitador corre como plugin del OpenZeppelin Relayer. Sus rutas supported, verify y settle y sus credenciales son distintas de las de TilcAI. El SDK expone Paywall, X402Facilitator y x402Fetch en tilcai-sdk/x402.", "The facilitator runs as an OpenZeppelin Relayer plugin. Its supported, verify and settle routes and credentials are separate from TilcAI's. The SDK exposes Paywall, X402Facilitator and x402Fetch under tilcai-sdk/x402.") + "</p>" +
      code("typescript", 'import { Paywall, X402Facilitator, x402Fetch } from "tilcai-sdk/x402";\n\n// Server-side integration building blocks.\n// Configure facilitator credentials and payment requirements\n// before protecting or paying for a real resource.', "x402.ts") +
      '<h3>' + l("Estado y comprobaciones", "Status and checks") + "</h3><p>" +
      l("Existen implementación del SDK, configuración de redes y pruebas aisladas del riel. El historial de Monad confirma que se configuró el plugin, pero no una prueba x402 de extremo a extremo en esa red. Consulta supported del facilitador y valida cada activo, red y modo. No publiques x402 mainnet como acreditado por CCTP.", "The SDK implementation, network configuration and isolated rail tests exist. The Monad log confirms plugin configuration, not an end-to-end x402 test on that network. Query facilitator supported and validate each asset, network and mode. Do not describe x402 mainnet as proven by CCTP.") + "</p>" +
      '<h3>' + l("Respuesta e incertidumbre", "Responses and uncertainty") + "</h3><p>" +
      l("HTTP 200 puede contener isValid:false o success:false: lee el cuerpo. Un 504 de settle puede ocurrir tras el envío; concilia el hash antes de firmar un payload nuevo. CCTP mueve USDC entre redes; x402 paga un recurso HTTP. Son flujos diferentes.", "HTTP 200 may contain isValid:false or success:false: read the body. A settle 504 may occur after submission; reconcile the hash before signing a new payload. CCTP moves USDC across networks; x402 pays for an HTTP resource. These are different flows.") + "</p>"),

    section("fiat", l("QR, bolivianos y vault", "QR, bolivianos and vault"), "payments",
      '<p class="lede">' + l("El objetivo: empezar en Bs y acceder a USDC mediante un flujo comprensible. La confirmación bancaria y el desembolso deben poder verificarse por separado.", "The goal: start in Bs and access USDC through an understandable flow. Bank confirmation and disbursement must be independently verifiable.") + "</p>" +
      '<h3>' + l("Estado de la integración bancaria", "Bank integration status") + "</h3><p>" +
      l("El equipo reportó acceso a APIs de Banco Económico y Diaconía y pruebas de generación de QR. En este corte, las variables BANECO_* de .env.example están declaradas para una integración futura y no las consume el código del backend. No se acredita un corredor de conversión fiat → USDC productivo.", "The team reported access to Banco Económico and Diaconía APIs and QR-generation tests. At this snapshot, .env.example declares BANECO_* variables for a future integration, and backend code does not consume them. A production fiat → USDC conversion corridor is not established.") + "</p>" +
      '<h3>' + l("Lo que ya se puede ensayar", "What can already be exercised") + "</h3><p>" +
      l("QR Simple es un mock de Vendis para ensayar emisión, aviso, vencimiento y depósito simulado. Se documentó una integración con Optipagos en testnet. El vault ejecuta desembolsos con límite por pago, presupuesto diario y pausa; existen pruebas en Fuji, Stellar Testnet y Monad Testnet.", "QR Simple is a Vendis mock for exercising issuance, notification, expiry and simulated deposits. A testnet Optipagos integration was documented. The vault executes disbursements with a per-payment limit, daily budget and pause; tests exist on Fuji, Stellar Testnet and Monad Testnet.") + "</p>" +
      '<h3>' + l("Del QR al desembolso", "From QR to disbursement") + '</h3><ol class="doc-steps">' + [
        l("Cotizar Bs, costes, tipo de cambio y USDC de destino.", "Quote Bs, costs, exchange rate and destination USDC."),
        l("Generar un QR ligado a una referencia y expiración.", "Generate a QR linked to a reference and expiry."),
        l("Verificar el cobro con el proveedor; nunca por una captura.", "Verify collection with the provider; never from a screenshot."),
        l("Solicitar un desembolso idempotente al vault correspondiente.", "Request an idempotent disbursement from the appropriate vault."),
        l("Conciliar la cadena y emitir un recibo con la referencia del cobro.", "Reconcile the chain and issue a receipt linked to collection."),
      ].map(p=>"<li><p>"+p+"</p></li>").join("") + "</ol>" +
      note(l("El mock no mueve dinero bancario y está prohibido en mainnet. Un QR generado no es prueba de pago ni de USDC acreditado. Los requisitos del proveedor y la operación fiat deben resolverse antes de activar dinero real.", "The mock does not move bank money and is prohibited on mainnet. A generated QR does not prove payment or USDC credit. Provider requirements and fiat operations must be resolved before enabling real money."))),

    section("monitoring", l("Monitorización y conciliación", "Monitoring and reconciliation"), "payments",
      '<p class="lede">' + l("Un registro de eventos conecta API, workers, relayer y tablero. Los eventos ayudan a observar; la cadena determina el resultado financiero.", "An event log connects API, workers, relayer and dashboard. Events provide observability; the chain determines the financial result.") + "</p>" +
      '<h3>' + l("Qué observar", "What to observe") + "</h3>" + table(l("Fuentes del monitor", "Monitor sources"), [l("Fuente", "Source"), l("Señales", "Signals")], [
        ["Crosschain", l("Estados, hashes, atestaciones, intentos inciertos.", "States, hashes, attestations, uncertain attempts.")],
        ["Vault", l("Desembolsos, pausas, presupuesto y límites.", "Disbursements, pauses, budget and limits.")],
        ["Relayer", l("Estado transaccional y gas nativo por red, incluido MON.", "Transaction status and native gas by network, including MON.")],
        ["API / worker", l("Errores 5xx, memoria, event loop, colas y persistencia.", "5xx errors, memory, event loop, queues and persistence.")],
        ["QR mock", l("Emisión y confirmación simulada; nunca prueba bancaria.", "Issuance and simulated confirmation; never bank evidence.")],
      ]) +
      '<h3>' + l("Canal y acceso", "Channel and access") + "</h3><p>" +
      l("El backend envía eventos firmados al sitio con secuencia creciente y ventana de validez. Lectura y escritura usan secretos distintos. El navegador no recibe claves del backend. /v1/monitor/stream ofrece SSE con after o Last-Event-ID para reanudar.", "The backend pushes signed events to the site with an increasing sequence and validity window. Reading and writing use separate secrets. The browser does not receive backend keys. /v1/monitor/stream provides SSE with after or Last-Event-ID for resumption.") + "</p>" +
      '<h3>' + l("Estado operativo documentado", "Documented operations status") + "</h3><p>" +
      l("El historial del 13 de octubre registra eventos de monad-testnet-relayer y recursos de Monad en el tablero. La vista separa testnet de mainnet. La caché del monitor web permanece en memoria: reinicios y múltiples instancias requieren persistencia adecuada. La recepción de webhooks de cada relayer mainnet debe verificarse en su despliegue.", "The 13 October log records monad-testnet-relayer events and Monad resources in the dashboard. The view separates testnet and mainnet. The web monitor cache remains in memory: restarts and multiple instances require appropriate persistence. Webhook reception for each mainnet relayer must be verified in its deployment.") + "</p>"),

    section("limits", l("Seguridad y límites", "Security and limits"), "reference",
      '<p class="lede">' + l("La autoridad de gasto necesita una frontera explícita. La conversación no es una firma y una integración técnica no es una auditoría.", "Spending authority needs an explicit boundary. Conversation is not a signature, and technical integration is not an audit.") + "</p>" +
      '<h3>' + l("Controles implementados", "Implemented controls") + "</h3><ul><li>" +
      l("Autenticación por tenant y scopes; recursos y credenciales por entorno.", "Tenant authentication and scopes; environment-specific resources and credentials.") + "</li><li>" +
      l("Idempotencia por intento, hash de burn único, nonce CCTP y conciliación persistida.", "Attempt idempotency, unique burn hash, CCTP nonce and persisted reconciliation.") + "</li><li>" +
      l("Comprobación del mensaje de Circle y de la autorización exacta; límites y pausa del vault.", "Verification of the Circle message and exact authorization; vault limits and pause.") + "</li><li>" +
      l("Guardas de mainnet y separación entre la API de integración y el firmante.", "Mainnet guards and separation between integration API and signer.") + "</li></ul>" +
      '<h3>' + l("Lo que sigue pendiente", "What remains open") + "</h3><p>" +
      l("Nada de lo descrito aquí ha sido auditado. Faltan auditoría independiente, registro completo de contratos mainnet, recuperación de cuentas probada, delegación limitada a agentes, validación de cargas concurrentes, respaldos y restauración operativa. Reputación no es un control productivo acreditado.", "Nothing described here has been audited. Independent audit, a complete mainnet contract registry, tested account recovery, limited agent delegation, concurrent-load validation, and operational backup and recovery remain open. Reputation is not an established production control.") + "</p>" +
      '<h3>' + l("Si una llamada agota el tiempo", "If a request times out") + "</h3><p>" +
      l("Conserva paymentId y hashes; consulta y concilia. No generes un segundo pago para resolver uno incierto. Los avisos del relayer y las capturas de pantalla no sustituyen evidencia en cadena ni confirmación bancaria autenticada.", "Keep paymentId and hashes; query and reconcile. Do not generate a second payment to resolve an uncertain one. Relayer notifications and screenshots do not replace on-chain evidence or authenticated bank confirmation.") + "</p>" +
      note(l("El flujo de compra completo no está habilitado. Las pruebas de mainnet descritas son acotadas; no equivalen a disponibilidad general, garantía de fondos ni permiso de gasto autónomo.", "The complete purchase flow is not enabled. Described mainnet tests are limited; they do not establish general availability, a fund guarantee or autonomous spending permission.")) +
      '<h3>' + l("Fuera del alcance por ahora", "Out of scope for now") + '</h3><p>' + l("Trading autónomo, puentes de activos envueltos, compras sin adaptador comercial y conversión fiat sin proveedor verificado. CCTP mueve USDC nativo y sí tiene rutas documentadas, incluidas Avalanche Fuji y Monad Testnet hacia Stellar Testnet y Avalanche C-Chain hacia Stellar Public Network.", "Autonomous trading, wrapped-asset bridges, purchases without a commercial adapter and fiat conversion without a verified provider. CCTP moves native USDC and does have documented routes, including Avalanche Fuji and Monad Testnet to Stellar Testnet and Avalanche C-Chain to Stellar Public Network.") + '</p>'),

    section("extensions", l("Roadmap y próximos pasos", "Roadmap and next steps"), "reference",
      '<p class="lede">' + l("Las siguientes capacidades amplían la misma frontera de autorización. Son trabajo previsto o en integración, sin fechas comprometidas.", "The following capabilities extend the same authorization boundary. They are planned or in integration, without committed dates.") + "</p>" +
      '<ol class="doc-steps">' + [
        [l("Comercio completo", "Complete commerce"), l("Conectar catálogo, oferta, aprobación, orden, pago y cumplimiento con adaptadores de negocio.", "Connect catalog, offer, approval, order, payment and fulfillment through business adapters.")],
        [l("Identidad y reputación", "Identity and reputation"), l("Validación de participantes y señales verificables de resultados; definir quién las emite y cómo se cuestionan.", "Participant validation and verifiable outcome signals; define who issues them and how they can be challenged.")],
        [l("Delegación limitada", "Limited delegation"), l("Mandatos revocables, presupuesto compartido y claves de agente con alcance verificable.", "Revocable mandates, shared budgets and agent keys with verifiable scope.")],
        [l("Más rieles", "More rails"), l("Cerrar el piloto bancario, validar x402 por red e integrar nuevas rutas del laboratorio con pruebas completas.", "Complete the bank pilot, validate x402 per network and integrate additional laboratory routes with full tests.")],
        [l("Operación de producción", "Production operations"), l("Publicar despliegues, auditar contratos, probar recuperación, monitoreo y continuidad.", "Publish deployment records, audit contracts and test recovery, monitoring and continuity.")],
      ].map(([h,p])=>"<li><h3>"+h+"</h3><p>"+p+"</p></li>").join("") + "</ol><p>" +
      '<a href="/' + locale + '/roadmap">' + l("Ver el estado de construcción del proyecto", "View the project construction status") + "</a></p>"),

    section("glossary", l("Glosario", "Glossary"), "reference",
      '<dl class="glossary">' + [
        ["CCTP", l("Protocolo de Circle: burn de USDC nativo, atestación y mint en otra red.", "Circle protocol: native USDC burn, attestation and mint on another network.")],
        ["Iris", l("Servicio de Circle que publica mensajes y atestaciones.", "Circle service publishing messages and attestations.")],
        ["x402", l("Pago por un recurso HTTP mediante condiciones comunicadas en una respuesta 402.", "Payment for an HTTP resource under requirements communicated in a 402 response.")],
        ["MCP", l("Protocolo para que un agente descubra y llame herramientas de forma estructurada.", "Protocol for an agent to discover and call structured tools.")],
        ["SCA / passkey", l("Cuenta de contrato / credencial del dueño que puede autorizar acciones.", "Contract account / owner credential that can authorize actions.")],
        ["Tenant", l("Espacio aislado de un integrador, con clave, scopes y recursos propios.", "Integrator isolation boundary, with its own key, scopes and resources.")],
        ["Vault", l("Contrato de desembolsos con límites y pausa. Probado en testnet; despliegues mainnet adicionales confirmados por el equipo, pendientes de registro público.", "Disbursement contract with limits and pause. Tested on testnet; additional mainnet deployments team-confirmed, pending public records.")],
        [l("Idempotencia", "Idempotency"), l("Repetir una operación con la misma clave conserva el resultado sin duplicarla.", "Repeating an operation with the same key retains the result without duplicating it.")],
        ["UNCERTAIN", l("No hay evidencia suficiente del resultado; hay que conciliar antes de repetir.", "There is insufficient evidence of the result; reconcile before retrying.")],
        ["SETTLED", l("Pago liquidado según evidencia financiera; no confirma entrega comercial.", "Payment settled according to financial evidence; does not confirm commercial fulfillment.")],
      ].map(([t,d])=>"<dt>"+t+"</dt><dd>"+d+"</dd>").join("") + "</dl>"),

    section("sources", l("Fuentes y versiones", "Sources and versions"), "reference",
      '<p class="lede">' + l("Revisión editorial: 20 de octubre de 2026. Las afirmaciones se separan por evidencia de código, registros del equipo y capacidades todavía en integración.", "Editorial review: 20 October 2026. Claims distinguish code evidence, team records and capabilities still in integration.") + "</p>" +
      '<h3>' + l("Código y registros del equipo", "Code and team records") + "</h3>" + table(l("Fuentes de esta revisión", "Sources for this revision"), [l("Fuente", "Source"), l("Referencia", "Reference")], [
        ["tilcai-infrastructure", repo("tilcai-infrastructure", "src/config/networks.ts", "networks.ts") + " · 58066a7"],
        ["Monad Testnet", repo("tilcai-infrastructure", "AGENT_HISTORY.md", l("Historial del 13 de octubre", "13 October team log"))],
        ["Mainnet", repo("tilcai-infrastructure", "deploy/MAINNET_DEPLOYMENT.md", l("Despliegues y pendientes", "Deployments and open items"))],
        ["SDK · 0.1.0", repo("tilcai-sdk", "README.md", "README") + " · " + repo("tilcai-sdk", "src/client.ts", "client.ts")],
        ["MCP · 0.2.0", repo("tilcai-mcp", "src/main.ts", l("Herramientas y schemas", "Tools and schemas"))],
        ["tilcai-core", repo("tilcai-core", "docs/shared-contracts.md", l("Contratos compartidos", "Shared contracts"))],
        ["tilcai-cctp-engine", external("https://github.com/TilcAI/tilcai-cctp-engine", l("Laboratorio de rutas", "Route laboratory"))],
      ]) +
      '<h3>' + l("Cómo leer los estados", "How to read statuses") + "</h3><p>" +
      l("<strong>Implementado:</strong> existe en código. <strong>Probado:</strong> hay registro de una prueba concreta. <strong>Confirmado por el equipo:</strong> falta evidencia pública completa. <strong>En integración:</strong> no debe tratarse como funcionalidad operativa de extremo a extremo.", "<strong>Implemented:</strong> exists in code. <strong>Tested:</strong> a specific test is recorded. <strong>Team-confirmed:</strong> complete public evidence is missing. <strong>In integration:</strong> must not be treated as an operational end-to-end capability.") + "</p>" +
      '<h3>' + l("Referencias de protocolo", "Protocol references") + "</h3><p>" +
      external("https://developers.circle.com/cctp", "Circle CCTP") + " · " + external("https://developers.stellar.org/docs", "Stellar") + " · " +
      external("https://docs.openzeppelin.com/relayer", "OpenZeppelin Relayer") + " · " +
      external("https://modelcontextprotocol.io/specification/latest", "MCP") + "</p>" +
      note(l("Esta revisión no ejecutó transferencias ni verificó de nuevo los despliegues on-chain. Los ejemplos con marcadores requieren la configuración de tu instancia.", "This review did not execute transfers or re-verify on-chain deployments. Placeholder examples require your instance configuration."))),
  ];
}

