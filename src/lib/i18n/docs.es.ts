import type { Copy } from "./types";
import { networkLogos } from "../content/network-logos.ts";

// El cuerpo de cada sección es HTML de confianza escrito en este repositorio y
// se renderiza con dangerouslySetInnerHTML. Nunca interpolar datos de formularios,
// parámetros de URL ni ningún valor aportado por usuarios.
//
// Fuente: el contexto oficial del equipo (corte del 8 y 9 de octubre de 2026) y el código de
// tilcai-core, tilcai-infrastructure y tilcai-cctp-engine. Si un documento anterior afirma otro
// estado, mandan el código y sus pruebas. Mantener alineado con src/lib/content/roadmap.ts.
export const docsEs: Copy["docs"] = {
  status: "Arquitectura propuesta · en desarrollo · sujeta a cambios",
  title: "Documentación de TilcAI",
  lead:
    "Cómo está diseñada la infraestructura, qué se puede comprobar hoy y qué sigue en integración. Está escrita para quienes construyen y revisan: no es la referencia de una API pública.",
  breadcrumb: "Ruta de navegación",
  meta: [
    { label: "Actualizada", value: "9 de octubre de 2026" },
    { label: "Entorno", value: "Solo testnet" },
    { label: "Fondos y auditoría", value: "Sin fondos reales · sin auditar" },
  ],
  pathsTitle: "Empieza por donde te corresponda",
  paths: [
    { id: "status", title: "Quiero entender qué es TilcAI", text: "Qué hace, qué funciona hoy y qué todavía no." },
    { id: "business", title: "Represento a un negocio", text: "Cómo entra un negocio y qué conserva." },
    { id: "mcp", title: "Construyo un asistente o una aplicación", text: "Las herramientas MCP y las puertas de entrada." },
  ],
  tocTitle: "En esta página",
  groups: { overview: "Panorama", design: "Diseño", payments: "Pagos y control", reference: "Referencia" },
  sections: [
    {
      id: "status",
      title: "Qué es TilcAI y en qué punto está",
      group: "overview",
      html: `
<p class="lede">TilcAI es infraestructura de comercio entre agentes: el asistente de una persona u organización consulta, cotiza y compra a un negocio con autoridad limitada, condiciones verificables y pagos sobre Stellar.</p>
<p>Recibe una intención de compra o reserva, obtiene del negocio una oferta con precio, disponibilidad y destino de cobro verificables, aplica identidad, límites y aprobación, coordina un pago por un riel soportado y vincula el resultado financiero con la orden y con la confirmación comercial. Se construye por etapas y los nombres pueden cambiar. <strong>El flujo de compra completo no está habilitado.</strong></p>
<ul class="checklist">
  <li><span class="tag tag-available">Base disponible</span> Un pago técnico de USDC de Avalanche Fuji a Stellar Testnet con CCTP, también sin gas para el comprador; un riel x402 con OpenZeppelin Relayer probado de forma aislada; un evaluador determinista de políticas y contratos compartidos versionados.</li>
  <li><span class="tag tag-integration">En integración</span> Conector MCP, cotizaciones y órdenes, aprobación por compra, unión de orden, pago y entrega, canal de WhatsApp y emisión de cuentas.</li>
  <li><span class="tag tag-next">Siguientes pasos</span> Smart accounts con permisos limitados, presupuesto compartido entre agentes, tareas programadas y más rutas de CCTP.</li>
</ul>
<p class="callout">Que un componente esté disponible no equivale a que el flujo de compra esté habilitado. Nada de esto ha sido auditado y nada opera con fondos reales. Cada capacidad, con su evidencia y quién la mantiene, está en el <a href="/es/roadmap">estado de construcción</a>.</p>
<h3>Qué construye TilcAI y qué es externo</h3>
<div class="table-wrap"><table>
<caption>Límites de la infraestructura</caption>
<thead><tr><th scope="col">TilcAI construye y opera</th><th scope="col">Se conecta, pero es externo</th></tr></thead>
<tbody>
<tr><td>API y gateway, contratos compartidos, adaptadores de canal, directorio comercial, cotización y orden, reglas, aprobación, router de pago, conciliación, recibos y eventos</td><td>WhatsApp Business Platform, asistentes y modelos de IA, el POS, el inventario y la agenda del negocio, Circle Iris y CCTP, las redes Stellar y EVM, los exploradores y cualquier proveedor de conversión fiat</td></tr>
<tr><td>Registro de cuentas emitidas, delegaciones y cuotas, cuando la fase de cuentas esté operativa</td><td>La credencial privada del dueño de la cuenta, los fondos del usuario y los precios originales del negocio</td></tr>
</tbody></table></div>
<p>El primer flujo apunta a un negocio, un servicio, un asistente, un usuario y un activo en <code>stellar:testnet</code>.</p>`,
    },
    {
      id: "operation",
      title: "Una compra, de punta a punta",
      group: "overview",
      html: `
<p class="lede">Una sola operación une al comprador y al negocio. Cada paso tiene un responsable, un estado y su propia evidencia: el pago nunca se confunde con la entrega.</p>
<ol class="doc-steps">
  <li>
    <h3>Intención</h3>
    <p>El comprador pide un producto o servicio, la cantidad y las condiciones. TilcAI estructura la intención y registra al principal autenticado.</p>
    <dl class="doc-meta"><div><dt>Estado</dt><dd>Solicitud</dd></div><div><dt>Evidencia</dt><dd>Mensaje y principal autenticado</dd></div></dl>
  </li>
  <li>
    <h3>Oferta</h3>
    <p>El negocio consulta su fuente de verdad y devuelve una cotización identificada, con vigencia, activo, importe, costes, disponibilidad y el destino de cobro (<code>payTo</code>) registrado. Si no puede garantizar stock o cupo, lo confirma antes de prometerlo.</p>
    <dl class="doc-meta"><div><dt>Estado</dt><dd>Cotizada, o pendiente de confirmación</dd></div><div><dt>Evidencia</dt><dd><code>quoteId</code>, versión, fuente y hora de la disponibilidad</dd></div></dl>
  </li>
  <li>
    <h3>Verificación</h3>
    <p>TilcAI verifica la identidad del negocio, el destino de cobro, la versión de la oferta, los límites y la política. Un rechazo o una aprobación pendiente no inicia el pago. <code>ALLOW</code> es elegibilidad: no firma ni paga.</p>
    <dl class="doc-meta"><div><dt>Estado</dt><dd>Evaluada</dd></div><div><dt>Evidencia</dt><dd>Decisión y código de motivo</dd></div></dl>
  </li>
  <li>
    <h3>Aprobación</h3>
    <p>La persona revisa las condiciones exactas en una superficie confiable y las aprueba. La aprobación compromete importe, activo, red, destinatario, <code>quoteId</code>, vencimiento y <code>orderId</code>. Un «sí» escrito en un chat no sustituye la autorización.</p>
    <dl class="doc-meta"><div><dt>Estado</dt><dd>Aprobada</dd></div><div><dt>Evidencia</dt><dd>Aprobación vinculada a la orden</dd></div></dl>
  </li>
  <li>
    <h3>Pago</h3>
    <p>El router elige una sola ruta, el pago directo en Stellar con x402 o USDC desde otra red con CCTP. Cada intento lleva una clave de idempotencia.</p>
    <dl class="doc-meta"><div><dt>Estado</dt><dd>Preparada, enviada</dd></div><div><dt>Evidencia</dt><dd><code>paymentAttemptId</code> y ruta elegida</dd></div></dl>
  </li>
  <li>
    <h3>Conciliación</h3>
    <p>TilcAI comprueba la evidencia en la cadena y relaciona <code>orderId</code>, <code>quoteId</code>, <code>paymentAttemptId</code>, hash de origen, atestación y hash de destino. Un tiempo agotado es <code>UNCERTAIN</code> hasta conciliar: no es permiso para repetir el pago.</p>
    <dl class="doc-meta"><div><dt>Estado</dt><dd>Liquidada</dd></div><div><dt>Evidencia</dt><dd>Recibo financiero con enlaces de testnet</dd></div></dl>
  </li>
  <li>
    <h3>Cumplimiento</h3>
    <p>El negocio confirma por separado la reserva, el retiro o la entrega. Comprador y negocio ven el mismo estado de la orden, cada uno con su recibo.</p>
    <dl class="doc-meta"><div><dt>Estado</dt><dd>Cerrada o en seguimiento</dd></div><div><dt>Evidencia</dt><dd>Confirmación del negocio, distinta del recibo de pago</dd></div></dl>
  </li>
</ol>
<h3>Contrato común mínimo</h3>
<p>Los canales, la API y los rieles comparten los mismos identificadores:</p>
<ul class="doc-chips" role="list"><li><code>principalId</code></li><li><code>agentId</code></li><li><code>businessId</code></li><li><code>serviceId</code></li><li><code>quoteId</code></li><li><code>orderId</code></li><li><code>paymentAttemptId</code></li></ul>
<p>A ellos se suman los estados de comercio, pago y presupuesto de <code>tilcai-shared-v1</code>, un <code>Idempotency-Key</code> en cada escritura, montos en unidades atómicas, una red inequívoca y un <code>payTo</code> versionado. Los contratos compartidos son una propuesta: el equipo debe revisarlos antes de fijarlos como API definitiva.</p>
<p class="callout">Pagado no significa entregado. Si la entrega falla después del pago, el resultado es una excepción comercial visible, no una conversión automática. La cancelación y la devolución necesitan sus propias reglas y todavía no existen.</p>`,
    },
    {
      id: "architecture",
      title: "Arquitectura y planos",
      group: "design",
      html: `
<p class="lede">Una solicitud recorre tres planos que permanecen separados, de modo que puede avanzar en el primero sin tener permisos en el tercero. El modelo de lenguaje ayuda con la tarea; la infraestructura decide qué acciones pueden ejecutarse y bajo qué condiciones.</p>
<div class="doc-lanes">
  <section class="doc-lane" aria-labelledby="lane-communication">
    <h3 id="lane-communication">Comunicación</h3>
    <ul role="list"><li>WhatsApp guiado</li><li>Asistente con MCP</li><li>Aplicación con API</li></ul>
  </section>
  <section class="doc-lane is-control" aria-labelledby="lane-control">
    <h3 id="lane-control">Comercio y control</h3>
    <ul role="list"><li>Gateway y tenant</li><li>Directorio y adaptador comercial</li><li>Cotización, orden y estados</li><li>Política, presupuesto y aprobación</li></ul>
  </section>
  <section class="doc-lane is-financial" aria-labelledby="lane-financial">
    <h3 id="lane-financial">Financiero</h3>
    <ul role="list"><li>Router de pago</li><li>x402 con Relayer</li><li>CCTP, de Fuji a Stellar</li><li>Conciliador y recibos</li></ul>
  </section>
  <section class="doc-lane is-external" aria-labelledby="lane-external">
    <h3 id="lane-external">Externo</h3>
    <ul role="list"><li>Negocio: agente, POS o consola</li><li>Circle Iris</li><li>Stellar y Avalanche</li><li>WhatsApp Business</li></ul>
  </section>
</div>
<p>Las órdenes, los mandatos y los estados se guardan en almacenamiento durable: el historial de un chat no es un registro de compras. Los módulos son responsabilidades lógicas, no un servicio por caja.</p>
<div class="table-wrap"><table>
<caption>Módulos principales y el control que conserva cada uno</caption>
<thead><tr><th scope="col">Módulo</th><th scope="col">Responsabilidad</th><th scope="col">Control esencial</th></tr></thead>
<tbody>
<tr><td>Canales (WhatsApp, MCP y API)</td><td>Recibir intenciones y devolver estados</td><td>El canal nunca es la autoridad financiera</td></tr>
<tr><td>Servidor MCP</td><td>Exponer herramientas a los asistentes</td><td>Permisos y contexto del principal</td></tr>
<tr><td>Gateway</td><td>Coordinar el ciclo de compra</td><td>Idempotencia y una máquina de estados</td></tr>
<tr><td>Adaptador comercial</td><td>Conectar las capacidades del negocio</td><td>El negocio es la fuente de verdad</td></tr>
<tr><td>Identidad y verificador de oferta</td><td>Comprobar quién ofrece y que las condiciones estén íntegras</td><td>Claves de una fuente de confianza independiente</td></tr>
<tr><td>Política y presupuesto</td><td>Evaluar proveedor, servicio, monto y límites</td><td>Rechazo por defecto</td></tr>
<tr><td>Autorización y firmante</td><td>Vincular la acción exacta a un consentimiento o mandato</td><td>Secretos fuera del alcance del modelo</td></tr>
<tr><td>Router de pago</td><td>Elegir una ruta para cada orden</td><td>Un intento por clave de idempotencia</td></tr>
<tr><td>Adaptador Stellar, facilitador y Relayer</td><td>Construir, verificar y presentar el pago</td><td>Activo, red e invocación exactos</td></tr>
<tr><td>Conciliador y recibos</td><td>Establecer el resultado real y conservar evidencia</td><td>No repetir un pago incierto</td></tr>
</tbody></table></div>`,
    },
    {
      id: "business",
      title: "Negocios y ofertas verificables",
      group: "design",
      html: `
<p class="lede">El negocio conserva la autoridad sobre sus servicios, precios, disponibilidad, destino de cobro y confirmación de entrega. TilcAI no inventa stock, descuentos ni confirmaciones.</p>
<h3>Cuatro caminos de integración</h3>
<div class="table-wrap"><table>
<caption>Un mismo negocio puede pasar de un camino a otro sin perder su identidad, su historial de órdenes ni su destino de cobro</caption>
<thead><tr><th scope="col">Camino</th><th scope="col">Para quién</th><th scope="col">Qué administra el negocio</th><th scope="col">Primera capacidad segura</th></tr></thead>
<tbody>
<tr><td>A · Consola gestionada</td><td>Un negocio sin software ni agente</td><td>Un operador, el catálogo y la disponibilidad manual</td><td>Consultar y cotizar, con confirmación a mano</td></tr>
<tr><td>B · Archivo o planilla</td><td>Un negocio con hoja de cálculo o sistema cerrado</td><td>Exportar un archivo y revisar los cambios</td><td>Catálogo versionado; el stock queda sujeto a confirmación</td></tr>
<tr><td>C · API, webhooks o conector de POS</td><td>Un negocio con sistema de ventas o inventario</td><td>Credenciales, endpoints y mapeo de productos</td><td>Precio y stock en tiempo real; retención si el sistema lo permite</td></tr>
<tr><td>D · Agente propio</td><td>Una empresa con equipo técnico</td><td>Su servidor, sus credenciales y sus reglas</td><td>Una capacidad certificada por operación, no acceso irrestricto</td></tr>
</tbody></table></div>
<p class="callout is-note">Son propuestas de incorporación, no un producto lanzado. Todavía no hay un portal de comercio, un catálogo real conectado ni un agente vendedor operativo; se prueban primero con un negocio piloto acotado, en testnet. Para empezar no se necesita un agente de IA ni un sitio web.</p>
<h3>Qué conserva el negocio</h3>
<ul class="plain">
  <li><strong>Capacidades explícitas.</strong> Cada negocio expone solo las operaciones que admite, por ejemplo consultar disponibilidad, retener un recurso o confirmar una orden. Los permisos las distinguen.</li>
  <li><strong>Contexto desde la autenticación.</strong> Negocio, usuario y rol provienen de la sesión autenticada, nunca de un argumento libre propuesto por el modelo.</li>
  <li><strong>Identidad de alcance limitado.</strong> Un negocio registra su operador, origen, claves y destino de cobro. Controlar una clave o un dominio no demuestra identidad legal ni calidad comercial.</li>
  <li><strong>Cotizaciones firmadas.</strong> Una cotización vincula negocio, servicio, cantidad, precio total, red, activo, destinatario, vencimiento y un hash de las condiciones.</li>
</ul>
<p>Un comprador acepta una cotización solo cuando:</p>
<ol class="numbered">
  <li>la clave de firma la reconoce una fuente independiente (el alta del negocio, un registro aceptado o la configuración confiable del principal), nunca se toma de la propia cotización;</li>
  <li>servicio, red, activo, monto y destinatario coinciden exactamente con los requisitos de pago, y la cotización no ha vencido;</li>
  <li>la política, el presupuesto y la aprobación siguen permitiendo la operación.</li>
</ol>
<p class="callout">Una firma protege las condiciones después de firmadas. No protege frente a una clave comprometida, un origen de phishing o una política mal configurada, y nunca concede autoridad de gasto.</p>
<h3>Quién responde por el negocio</h3>
<p>El agente vendedor es la interfaz operativa que atiende las solicitudes mediante capacidades autorizadas. Puede ser un servicio de reglas con un operador humano de respaldo (el modo recomendado para el piloto, porque es el más comprobable), un asistente gestionado por TilcAI o un agente propio de la empresa conectado por API. En todos los casos el modelo no fija por sí solo precio, stock, cobro ni autoridad.</p>
<p><strong>La entrega la aporta el negocio.</strong> La orden la confirma y cumple el sistema propio del negocio, y esa evidencia se mantiene separada del recibo de pago. Publicar el perfil de un negocio requiere su aprobación; agregar un perfil o explorar un caso de uso no habilita ventas. Un negocio se presenta como habilitado solo cuando su flujo operativo ha sido verificado.</p>`,
    },
    {
      id: "mcp",
      title: "Compradores y asistentes",
      group: "design",
      html: `
<p class="lede">Hay tres puertas de entrada a la misma infraestructura. Todas terminan en los mismos servicios de identidad, oferta, política, autorización, orden, pago y recibos: el canal no es la autoridad financiera.</p>
<div class="table-wrap"><table>
<caption>Puertas de entrada de un comprador</caption>
<thead><tr><th scope="col">Puerta</th><th scope="col">Para quién</th><th scope="col">Cómo entra</th><th scope="col">Estado</th></tr></thead>
<tbody>
<tr><td>WhatsApp guiado</td><td>Una persona sin agente ni wallet</td><td>Una conversación y un enlace web seguro para identidad y firma. Nunca pide frases semilla ni claves por chat</td><td><span class="tag tag-integration">En integración</span> El equipo hizo una demostración externa; falta la integración propia</td></tr>
<tr><td>Asistente con MCP</td><td>Quien ya usa un asistente compatible</td><td>Configura el servidor MCP de TilcAI y se autentica con permisos limitados</td><td><span class="tag tag-integration">En integración</span> Contrato de 12 herramientas definido; el servidor está pendiente</td></tr>
<tr><td>API y SDK futuro</td><td>Una aplicación o un backend propio</td><td>API REST autenticada. El SDK, cuando exista, empaqueta autenticación, tipos, idempotencia y errores</td><td><span class="tag tag-integration">En integración</span> La API de pagos entre redes está verificada en testnet; la API comercial está pendiente</td></tr>
</tbody></table></div>
<h3>Herramientas MCP</h3>
<p><strong>MCP</strong> (Model Context Protocol) es la interfaz de herramientas para asistentes compatibles. TilcAI está diseñado para publicar un servidor MCP con operaciones específicas, autenticado según la especificación de autorización de MCP. <strong>Todavía no hay un servidor MCP expuesto.</strong> Los nombres siguientes son el contrato diseñado en <code>tilcai-core</code>, no un paquete publicado.</p>
<div class="table-wrap"><table>
<caption>Superficie de herramientas diseñada</caption>
<thead><tr><th scope="col">Herramienta</th><th scope="col">Función</th><th scope="col">Permiso</th></tr></thead>
<tbody>
<tr><td><code>list_businesses</code></td><td>Descubrir negocios incorporados</td><td><code>catalog:read</code></td></tr>
<tr><td><code>get_service</code></td><td>Consultar un servicio y sus condiciones</td><td><code>catalog:read</code></td></tr>
<tr><td><code>get_availability</code></td><td>Consultar disponibilidad en un instante comprobado; no reserva</td><td><code>catalog:read</code></td></tr>
<tr><td><code>request_quote</code></td><td>Obtener una cotización identificable</td><td><code>quotes:write</code></td></tr>
<tr><td><code>create_intent</code></td><td>Crear una intención a partir de una cotización</td><td><code>intents:write</code></td></tr>
<tr><td><code>prepare_purchase</code></td><td>Verificar y preparar la compra; no firma ni paga</td><td><code>intents:write</code></td></tr>
<tr><td><code>request_approval</code></td><td>Solicitar la aprobación de la persona; no la concede</td><td><code>approvals:request</code></td></tr>
<tr><td><code>request_purchase</code></td><td>Solicitar la ejecución de una compra preparada</td><td><code>purchases:request</code> con autoridad exacta</td></tr>
<tr><td><code>get_order_status</code></td><td>Consultar el estado de una orden propia</td><td><code>orders:read</code></td></tr>
<tr><td><code>request_cancellation</code></td><td>Pedir una cancelación; no implica devolución</td><td><code>orders:cancel</code></td></tr>
<tr><td><code>get_budget_status</code></td><td>Consultar límites y retenciones</td><td><code>budgets:read</code></td></tr>
<tr><td><code>get_receipts</code></td><td>Consultar los recibos de una orden</td><td><code>receipts:read</code></td></tr>
</tbody></table></div>
<p>El modelo trabaja con identificadores de cotización, intención y orden. No existe una herramienta irrestricta para enviar dinero a una dirección cualquiera. Precio, destinatario, cantidad, red y activo viajan como datos versionados; la conversación explica esos datos pero no los redefine.</p>
<ul class="plain">
  <li><strong>Conectar no es gastar.</strong> Conexión, acceso a datos y autoridad de compra son cosas distintas. Seleccionar un asistente o permitir una herramienta nunca concede permiso de gasto.</li>
  <li><strong>Una skill es guía, no permiso.</strong> Explica cómo consultar, aclarar, preparar y comunicar estados. El servidor aplica las reglas aunque un agente ignore la skill.</li>
  <li><strong>El soporte es por capacidad.</strong> El catálogo de clientes distingue lectura, cotización, preparación y ejecución. Soportar MCP no implica pagos autónomos. Cada cliente se prueba con su propia versión y autenticación.</li>
  <li><strong>Estado hoy.</strong> Todos los clientes del catálogo están en preparación. Se publica una guía para un cliente solo después de probarlo, y ninguna guía pide una frase semilla, una clave privada ni un token.</li>
</ul>`,
    },
    {
      id: "payments",
      title: "Permisos y pagos",
      group: "payments",
      html: `
<p class="lede">Un pago es elegible solo cuando se cumplen a la vez cuatro condiciones. Una firma válida no basta para autorizarlo, y la reputación puede informar una decisión pero nunca se salta un límite.</p>
<ol class="numbered">
  <li>una identidad reconocida y una oferta auténtica y vigente;</li>
  <li>una intención vinculada a una orden y un mandato aplicable;</li>
  <li>presupuesto disponible y retenido;</li>
  <li>aprobación exacta o una delegación verificable.</li>
</ol>
<h3>Decisiones y estados son cosas distintas</h3>
<div class="table-wrap"><table>
<caption>Cinco palabras que no deben confundirse</caption>
<thead><tr><th scope="col">Estado</th><th scope="col">Significa</th><th scope="col">No significa</th></tr></thead>
<tbody>
<tr><td>Permitido (<code>ALLOW</code>)</td><td>La política se cumple para esta intención</td><td>Permiso para firmar, un pago o una entrega</td></tr>
<tr><td>Aprobado</td><td>La persona autorizó las condiciones exactas, o aplica un mandato válido</td><td>Que se haya movido algún fondo</td></tr>
<tr><td>Enviado</td><td>Se presentó un intento de pago al riel</td><td>Que se haya liquidado; el resultado aún puede ser incierto</td></tr>
<tr><td>Liquidado</td><td>El riel confirmó el pago</td><td>Que el servicio se haya entregado</td></tr>
<tr><td>Entregado</td><td>El negocio aportó evidencia de cumplimiento</td><td>Evidencia del pago en sí</td></tr>
</tbody></table></div>
<p>El motor de políticas devuelve <code>ALLOW</code>, <code>DENY</code> o <code>REQUIRE_APPROVAL</code>. El prototipo actual devuelve <code>ALLOW</code> o <code>DENY</code>; la aprobación humana forma parte del flujo de autorización. Una orden mantiene estados de comercio, pago y presupuesto por separado, así que una orden pagada aún puede estar pendiente de entrega.</p>
<h3>Dos formas de autorizar</h3>
<ul class="plain">
  <li><strong>Aprobación por compra (primera ruta).</strong> La persona conecta una cuenta compatible y revisa servicio, monto, activo, red, destinatario y condiciones. La wallet firma una autorización compatible con el riel, que en x402 sobre Stellar es una entrada de autorización Soroban. Una firma de inicio de sesión o conectar la wallet no basta. Si cambian la oferta o la invocación, se exige una nueva aprobación.</li>
  <li><strong>Delegación limitada (ruta objetivo).</strong> Una smart account Soroban de la persona acepta un firmante restringido dentro de un mandato: red y activo exactos, contratos permitidos, destinatarios, montos por operación y por periodo, proveedores, vigencia y revocación. Se habilita solo después de probar juntas la cuenta, el firmante y el riel.</li>
</ul>
<h3>Cuando algo falla</h3>
<ul class="plain">
  <li><strong>Pago incierto.</strong> Un tiempo agotado después de enviar no es un fallo. Se mantiene la retención de presupuesto y se concilia el mismo intento antes de firmar de nuevo. Repetir una consulta puede ser seguro; repetir una ejecución financiera exige conocer el estado del intento anterior.</li>
  <li><strong>Pago sin entrega.</strong> La orden no se marca como entregada. El problema se resuelve según las condiciones comerciales, y repetir la compra no es una solución automática.</li>
  <li><strong>Revocación.</strong> Revocar un mandato bloquea nuevas firmas. No revierte un pago que ya se liquidó.</li>
  <li><strong>Condiciones cambiadas.</strong> Un precio, proveedor o servicio distinto detiene la operación hasta una nueva aprobación. El agente no puede subir su propio límite ni aprobar su propia excepción.</li>
</ul>`,
    },
    {
      id: "rails",
      title: "Rieles de pago y redes",
      group: "payments",
      html: `
<p class="lede">TilcAI escoge una sola ruta para cada orden. El pago directo en Stellar y el pago entre redes con CCTP son alternativas, no dos cobros de la misma orden, y todavía no forman un checkout comercial integrado.</p>
<div class="table-wrap"><table>
<caption>Dos rieles que no deben confundirse</caption>
<thead><tr><th scope="col"><span class="sr-only">Aspecto</span></th><th scope="col">Pago directo en Stellar (x402)</th><th scope="col">USDC entre redes (CCTP V2)</th></tr></thead>
<tbody>
<tr>
<th scope="row">Cómo funciona</th>
<td>Un servicio responde <code>402 Payment Required</code> con las condiciones; el pagador firma una autorización y un facilitador, que corre como plugin dentro de un OpenZeppelin Relayer, la verifica y la liquida. Expone <code>verify</code>, <code>settle</code> y <code>supported</code>.</td>
<td>Quema USDC nativo en la red de origen, espera la atestación de Circle y emite USDC nativo en Stellar. El destinatario del burn es siempre un forwarder, y la cuenta final viaja en <code>hookData</code>.</td>
</tr>
<tr>
<th scope="row">Estado hoy</th>
<td><span class="tag tag-integration">Prueba aislada</span> Se confirmó un pago en Stellar Testnet con el activo nativo, se rechazaron payloads alterados antes de mover fondos y repetir uno ya liquidado no pagó dos veces.</td>
<td><span class="tag tag-available">Verificado en testnet</span> Transferencias reales de Avalanche Fuji a Stellar Testnet, con un modo sin gas: el pagador firma una autorización exacta y el Relayer paga el gas de las dos redes.</td>
</tr>
<tr>
<th scope="row">Falta</th>
<td>Repetirlo con USDC y con la cuenta prevista, y conectarlo a cotizaciones, aprobaciones y órdenes.</td>
<td>Unirlo a cotizaciones, órdenes y aprobación, y habilitar cada red adicional con su prueba de punta a punta.</td>
</tr>
</tbody></table></div>
<h3>Ciclo de vida de un pago entre redes</h3>
<p>Un pago avanza por estados guardados: un reintento retoma desde el último y nunca repite el burn.</p>
<ol class="doc-states">
  <li><code>AWAITING_BURN</code><span>Pago creado, a la espera del burn firmado</span></li>
  <li><code>BURN_SUBMITTED</code><span>Burn enviado; su hash queda guardado</span></li>
  <li><code>BURN_CONFIRMED</code><span>El recibo y el evento coinciden con la cotización</span></li>
  <li><code>ATTESTED</code><span>Circle atestó y el mensaje se verificó de nuevo</span></li>
  <li><code>MINT_SUBMITTED</code><span>El Relayer envió el mint</span></li>
  <li><code>SETTLED</code><span>Mint confirmado; USDC en destino y recibo de pago</span></li>
</ol>
<ul class="plain">
  <li><strong>Un burn respalda un solo pago</strong> y un nonce de CCTP una sola liquidación.</li>
  <li><strong>El mint es idempotente.</strong> Se reintenta sin riesgo, y nunca se crea un segundo burn para un pago existente.</li>
  <li><strong>La firma compromete lo exacto.</strong> En el modo sin gas el Relayer solo puede enviar lo que el pagador firmó.</li>
  <li><strong>La incertidumbre se concilia.</strong> Un burn no encontrado o una atestación que no coincide pasan a <code>UNCERTAIN</code> y no se emiten; nunca se marcan como fallidos sin evidencia.</li>
</ul>
<h3>Cobertura de redes</h3>
<p>El laboratorio <code>tilcai-cctp-engine</code> modela ocho redes de prueba. El backend de TilcAI acredita un solo corredor completo.</p>
<ul class="doc-nets" role="list">
  <li data-state="verified"><span class="doc-net-label"><img src="${networkLogos["avalanche-fuji"]}" alt="" width="30" height="30" loading="lazy" decoding="async"><span class="doc-net-name">Avalanche Fuji</span></span><span class="tag tag-available">Verificado en TilcAI</span></li>
  <li data-state="lab"><span class="doc-net-label"><img src="${networkLogos["ethereum-sepolia"]}" alt="" width="30" height="30" loading="lazy" decoding="async"><span class="doc-net-name">Ethereum Sepolia</span></span><span class="tag tag-next">Laboratorio</span></li>
  <li data-state="lab"><span class="doc-net-label"><img src="${networkLogos["arbitrum-sepolia"]}" alt="" width="30" height="30" loading="lazy" decoding="async"><span class="doc-net-name">Arbitrum Sepolia</span></span><span class="tag tag-next">Laboratorio</span></li>
  <li data-state="lab"><span class="doc-net-label"><img src="${networkLogos["base-sepolia"]}" alt="" width="30" height="30" loading="lazy" decoding="async"><span class="doc-net-name">Base Sepolia</span></span><span class="tag tag-next">Laboratorio</span></li>
  <li data-state="lab"><span class="doc-net-label"><img src="${networkLogos["arc-testnet"]}" alt="" width="30" height="30" loading="lazy" decoding="async"><span class="doc-net-name">Arc Testnet</span></span><span class="tag tag-next">Laboratorio</span></li>
  <li data-state="lab"><span class="doc-net-label"><img src="${networkLogos["solana-devnet"]}" alt="" width="30" height="30" loading="lazy" decoding="async"><span class="doc-net-name">Solana Devnet</span></span><span class="tag tag-next">Laboratorio</span></li>
  <li data-state="lab"><span class="doc-net-label"><img src="${networkLogos["sui-testnet"]}" alt="" width="30" height="30" loading="lazy" decoding="async"><span class="doc-net-name">Sui Testnet</span></span><span class="tag tag-next">Laboratorio</span></li>
  <li data-state="destination"><span class="doc-net-label"><img src="${networkLogos["stellar-testnet"]}" alt="" width="30" height="30" loading="lazy" decoding="async"><span class="doc-net-name">Stellar Testnet</span></span><span class="tag tag-dest">Destino · USDC del negocio</span></li>
</ul>
<p>«Laboratorio» significa código, matriz de rutas y verificación de contratos; falta la transferencia y la conciliación de punta a punta de cada ruta. Que Circle admita una red no la habilita en TilcAI: se habilita una por una, cuando supera su prueba. CCTP mueve USDC nativo: no convierte bolivianos ni otros tokens, y quien ya tiene USDC en Stellar no lo necesita.</p>
<p>El detalle técnico, los payloads y el contrato de errores del riel x402 están en la <a href="https://github.com/TilcAI/tilcai-core/blob/main/docs/payment-rail-environment.md" rel="noopener">documentación del riel de pago</a> del repositorio abierto <code>tilcai-core</code>.</p>`,
    },
    {
      id: "accounts",
      title: "Cuentas y fondos",
      group: "payments",
      html: `
<p class="lede">La cuenta es de la persona o de la organización, no una «wallet del bot». El agente es software autorizado para pedir acciones; no es dueño de los fondos.</p>
<p class="callout is-note">La emisión de cuentas está en preparación: hay plan, contratos base y puertos definidos. La API que emite cuentas, la recuperación probada y los despliegues siguen pendientes.</p>
<h3>Crear una cuenta desde un chat</h3>
<p>El chat solo inicia el proceso y muestra estados. Una pantalla web segura, ligada a una sesión corta, es la frontera para identidad, credenciales y firmas.</p>
<ol class="numbered">
  <li>El canal genera un enlace de un solo uso, con expiración. No se envían semillas ni claves por el chat.</li>
  <li>El navegador abre un origen HTTPS de TilcAI y la persona crea su credencial de propietario, preferentemente una passkey; si no, una clave propia o la conexión de una wallet existente.</li>
  <li>TilcAI asocia la clave pública al principal autenticado y solicita la cuenta con una clave de idempotencia. Las credenciales técnicas se quedan en el servidor.</li>
  <li>El proveedor de cuentas calcula la dirección y despliega la smart account; solo la marca activa al comprobar el despliegue en la cadena. El Relayer paga la comisión y no se convierte en dueño.</li>
  <li>La persona ve su dirección, la red, el activo y cómo fondear. Crear una cuenta no la fondea.</li>
  <li>Para comprar se prepara una aprobación exacta del dueño. La delegación posterior es opcional, limitada y revocable.</li>
</ol>
<h3>Cómo se fondea</h3>
<div class="table-wrap"><table>
<caption>Vías de fondeo y su estado</caption>
<thead><tr><th scope="col">Vía</th><th scope="col">Cómo funciona</th><th scope="col">Estado</th></tr></thead>
<tbody>
<tr><td>USDC en Stellar</td><td>Desde una wallet compatible; es el camino más corto y no necesita CCTP</td><td>Depende de verificar el riel directo con USDC</td></tr>
<tr><td>USDC desde otra red</td><td>Con CCTP, por una ruta habilitada</td><td>Solo Avalanche Fuji a Stellar Testnet está verificada</td></tr>
<tr><td>Bolivianos</td><td>Un proveedor de rampa fiat que cotice, confirme el depósito y entregue USDC</td><td>Sin proveedor ni corredor verificados; el cobro con QR que existe hoy es un mock, sin banco</td></tr>
</tbody></table></div>
<p>TilcAI no acredita saldo por la captura de un QR ni por un aviso sin autenticar: un depósito se acredita solo con la confirmación verificable del proveedor.</p>
<h3>Recuperación</h3>
<p>Perder el teléfono, cambiar el número de WhatsApp y recuperar una cuenta son problemas distintos. El número de un chat identifica una conversación, no demuestra por sí solo la propiedad de los fondos, y nadie debería poder reasignar una cuenta porque controle ese número. El diseño de recuperación debe revisarse antes de usar fondos reales.</p>`,
    },
    {
      id: "monitoring",
      title: "Monitorización: del backend al tablero",
      group: "payments",
      html: `
<p class="lede">Lo que ocurre en el backend se registra como eventos con un orden que solo crece, llega firmado al sitio y se interpreta en español e inglés. Mirar no puede romper lo que se mira.</p>
<ul class="plain">
  <li><strong>El backend es la fuente de verdad.</strong> Anota cada evento con una posición que solo crece; el sitio guarda una copia reciente y nada más.</li>
  <li><strong>El backend empuja.</strong> Puede vivir detrás de una red privada, así que quien inicia la conexión es él, con un envío firmado.</li>
  <li><strong>Al menos una vez y en orden.</strong> Si el sitio estuvo caído, recibe después lo que se perdió; lo repetido se descarta por identificador.</li>
  <li><strong>Monitorizar no rompe lo monitorizado.</strong> Emitir un evento nunca falla ni espera a la red.</li>
</ul>
<div class="table-wrap"><table>
<caption>Qué se registra, bajo el contrato <code>tilcai-monitor-v1</code></caption>
<thead><tr><th scope="col">Origen</th><th scope="col">Eventos</th><th scope="col">Para qué sirve</th></tr></thead>
<tbody>
<tr><td>Pagos entre redes</td><td>Creación, cada cambio de estado y pagos inciertos</td><td>Seguir un pago desde el burn hasta la liquidación</td></tr>
<tr><td>Vault de desembolsos</td><td>Transiciones, inciertos y rechazos por presupuesto, pausa o límite</td><td>Ver cada desembolso y por qué se rechazó uno</td></tr>
<tr><td>Avisos del Relayer</td><td>Cambios de estado de transacciones y del propio relayer</td><td>Contrastar lo que el relayer informa con lo que TilcAI concilia</td></tr>
<tr><td>Cobro con QR (mock)</td><td>Emisión, pago simulado, vencimiento y aviso entregado</td><td>Ensayar el recorrido sin banco ni dinero</td></tr>
<tr><td>Recursos y alertas</td><td>Una foto de recursos cada 30 segundos; alertas que se levantan y se limpian</td><td>Saber si el sistema está sano</td></tr>
<tr><td>API</td><td>Respuestas 5xx, agrupadas por minuto</td><td>Detectar fallos del servicio</td></tr>
</tbody></table></div>
<p>Los avisos sirven para ver, no para decidir: un pago o un desembolso solo se da por liquidado cuando TilcAI comprobó la cadena por su cuenta.</p>
<h3>Seguridad del canal</h3>
<ul class="plain">
  <li><strong>Un secreto por dirección.</strong> Uno protege la escritura (del backend al sitio) y otro la lectura (de la persona al sitio). Ninguno llega al navegador.</li>
  <li><strong>El envío caduca.</strong> La firma cubre la hora, y el sitio rechaza lo que tenga más de cinco minutos.</li>
  <li><strong>Sin secretos en los eventos.</strong> Sí llevan direcciones públicas, saldos, montos y hashes, y por eso la lectura exige credencial.</li>
  <li><strong>El navegador nunca habla con el backend</strong> ni conoce su dirección.</li>
</ul>
<p class="callout is-note">El recorrido completo está implementado y verificado en local contra servicios de testnet. La vista <code>/es/monitor</code> es una base funcional sin diseño final. Faltan el tablero, un almacén duradero en el sitio (hoy es memoria y no sirve con varias instancias) y apuntar el relayer real a TilcAI.</p>`,
    },
    {
      id: "limits",
      title: "Modelo de seguridad y límites conocidos",
      group: "reference",
      html: `
<ul class="plain">
  <li><strong>El modelo propone; las reglas deciden.</strong> La salida del modelo nunca se acepta para precio, destinatario ni aprobación. Una condición que no se puede verificar bloquea la operación o pide revisión humana.</li>
  <li><strong>El firmante es una frontera separada.</strong> Las claves quedan fuera del alcance del modelo y de los datos del negocio. Este sitio web no almacena claves privadas, tokens financieros ni mandatos de gasto.</li>
  <li><strong>Dependencia del facilitador y del Relayer.</strong> La liquidación depende de un facilitador x402 y de un OpenZeppelin Relayer. Si no están disponibles, los pagos se detienen.</li>
  <li><strong>Solo testnet.</strong> El backend rechaza cualquier entorno distinto de testnet, y testnet y mainnet tendrán configuración y habilitación separadas. No hay fondos reales.</li>
  <li><strong>Laboratorio no es producto.</strong> Ocho redes modeladas no son ocho corredores comerciales: hoy una está verificada de punta a punta.</li>
  <li><strong>Sin auditar.</strong> Nada de lo descrito aquí ha sido auditado.</li>
</ul>
<p>Fuera del alcance por ahora: un marketplace de agentes, trading o DeFi, puentes de activos envueltos entre cadenas (el pago entre redes con CCTP, que retira y emite USDC nativo, sí está previsto y hoy solo Avalanche Fuji a Stellar está verificado), negociación libre de precios, compras a cualquier negocio sin adaptador, servicios regulados, conversión de bolivianos sin un proveedor verificado y autonomía ilimitada de los agentes.</p>`,
    },
    {
      id: "extensions",
      title: "Extensiones previstas",
      group: "reference",
      html: `
<p>Son extensiones previstas, no activas. Se añaden detrás de las mismas operaciones y estados.</p>
<ul class="checklist">
  <li><span class="tag tag-next">Extensión prevista</span> <strong>A2A.</strong> Un estándar de comunicación entre agentes, con capacidades descritas mediante Agent Cards. Conectaría la solicitud del comprador con las capacidades del agente de la empresa. No sustituye inventario, mandato ni firma financiera. El primer flujo puede funcionar con MCP y una API comercial.</li>
  <li><span class="tag tag-next">Extensión prevista</span> <strong>ERC-8004.</strong> Un estándar en borrador para registros de identidad, reputación y validación en Ethereum/EVM. No es un contrato nativo de Stellar ni garantiza confianza. TilcAI prevé una identidad operativa nativa en Stellar y, por separado, un adaptador para resolver un registro EVM. Consultar una identidad EVM nunca mueve fondos entre redes ni construye un bridge.</li>
  <li><span class="tag tag-next">Siguientes pasos</span> <strong>Smart accounts, presupuesto compartido y tareas programadas.</strong> Consulta el <a href="/es/roadmap">estado de construcción</a>.</li>
</ul>`,
    },
    {
      id: "glossary",
      title: "Glosario",
      group: "reference",
      html: `
<dl class="glossary">
  <dt>Principal</dt><dd>La persona u organización que posee los fondos y otorga la autoridad.</dd>
  <dt>Mandato</dt><dd>Autoridad delegada a un agente, con alcance, límites, periodo y revocación.</dd>
  <dt>Cotización</dt><dd>Condiciones comerciales exactas de un negocio: servicio, precio, activo, red, destinatario y vencimiento.</dd>
  <dt>Intención</dt><dd>La compra que una persona quiere hacer, vinculada a una cotización e inmutable una vez creada.</dd>
  <dt>Orden</dt><dd>La operación comercial que vincula al principal, el negocio y la cotización, con estados propios.</dd>
  <dt>MCP</dt><dd>Model Context Protocol: la interfaz de herramientas para asistentes compatibles.</dd>
  <dt>A2A</dt><dd>Un estándar de comunicación entre agentes. Es una extensión prevista, no un requisito del primer flujo.</dd>
  <dt>x402</dt><dd>Un protocolo de pago HTTP: un servidor responde <code>402 Payment Required</code> con las condiciones de pago y el cliente paga para obtener el recurso.</dd>
  <dt>Facilitador</dt><dd>El componente que verifica y presenta un pago x402. Aquí, un plugin que corre en un OpenZeppelin Relayer.</dd>
  <dt>OpenZeppelin Relayer</dt><dd>Un servicio que envía transacciones con las redes, los firmantes y las políticas que se le configuran. Puede pagar la comisión de red sin convertirse en dueño de los fondos.</dd>
  <dt>CCTP</dt><dd>Protocolo de Circle que mueve USDC nativo entre redes: lo quema en el origen, espera una atestación y lo emite en el destino.</dd>
  <dt>Atestación</dt><dd>La firma de Circle (servicio Iris) que prueba que el burn ocurrió y permite emitir en el destino.</dd>
  <dt>Soroban</dt><dd>La plataforma de contratos inteligentes de Stellar.</dd>
  <dt>Smart account</dt><dd>Una cuenta programable cuyas reglas, firmantes y límites los define un contrato.</dd>
  <dt>Idempotencia</dt><dd>Repetir una operación con la misma clave produce el mismo resultado y no la ejecuta dos veces.</dd>
  <dt>Tenant</dt><dd>El espacio aislado de un negocio o integrador, con su identidad, sus cuotas y sus roles.</dd>
  <dt>Vault</dt><dd>Contrato de TilcAI en Avalanche Fuji que ejecuta desembolsos sujetos a presupuesto, límite por pago y pausa.</dd>
  <dt>Conciliación</dt><dd>Establecer el resultado real de un intento de pago, incluso cuando una llamada falló a mitad de camino.</dd>
  <dt>Código de motivo</dt><dd>Una explicación legible por máquina de una decisión.</dd>
</dl>`,
    },
    {
      id: "sources",
      title: "Fuentes y actualización",
      group: "reference",
      html: `
<p class="lede">Esta página resume el contexto oficial del equipo, con corte al 8 y 9 de octubre de 2026, y el código de los repositorios. El código y sus pruebas determinan qué está implementado; una prueba en testnet acredita la ruta reproducida, no todas las rutas previstas.</p>
<div class="table-wrap"><table>
<caption>De dónde sale cada afirmación</caption>
<thead><tr><th scope="col">Repositorio</th><th scope="col">Qué contiene</th></tr></thead>
<tbody>
<tr><td><code>tilcai-core</code></td><td>Contratos compartidos, herramientas MCP, evaluador de políticas y la guía reproducible del riel x402</td></tr>
<tr><td><code>tilcai-infrastructure</code></td><td>El backend: API y worker de pagos entre redes, vault, monitorización y contratos</td></tr>
<tr><td><code>tilcai-cctp-engine</code></td><td>El laboratorio de ocho redes: matriz de rutas, verificación de contratos y transferencias de prueba</td></tr>
<tr><td><code>tilcai-web</code></td><td>Este sitio, sus simulaciones y la vista de monitorización</td></tr>
</tbody></table></div>
<ul class="plain">
  <li>Del repositorio abierto <code>tilcai-core</code>: <a href="https://github.com/TilcAI/tilcai-core/blob/main/docs/shared-contracts.md" rel="noopener">contratos compartidos</a>, <a href="https://github.com/TilcAI/tilcai-core/blob/main/docs/mcp-intent-mandate.md" rel="noopener">herramientas MCP, intención y mandato</a>, <a href="https://github.com/TilcAI/tilcai-core/blob/main/docs/payment-rail-environment.md" rel="noopener">riel de pago en testnet</a> y <a href="https://github.com/TilcAI/tilcai-core/blob/main/docs/payment-rail-reproducibility.md" rel="noopener">reproducibilidad del riel</a>.</li>
  <li>Referencias externas: <a href="https://docs.openzeppelin.com/relayer/quickstart" rel="noopener">OpenZeppelin Relayer</a>, <a href="https://docs.openzeppelin.com/stellar-contracts/accounts/smart-account" rel="noopener">smart accounts en Stellar</a>, <a href="https://developers.circle.com/cctp/concepts/supported-chains-and-domains" rel="noopener">redes y dominios de CCTP</a> y <a href="https://modelcontextprotocol.io/specification/latest/server/tools" rel="noopener">herramientas de MCP</a>.</li>
</ul>`,
    },
  ],
};
