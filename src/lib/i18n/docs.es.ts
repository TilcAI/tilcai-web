import type { Copy } from "./types";

// El cuerpo de cada sección es HTML de confianza escrito en este repositorio y
// se renderiza con dangerouslySetInnerHTML. Nunca interpolar datos de formularios,
// parámetros de URL ni ningún valor aportado por usuarios.
export const docsEs: Copy["docs"] = {
  status: "Arquitectura propuesta · en desarrollo · sujeta a cambios",
  title: "Cómo está pensado que funcione TilcAI",
  lead:
    "Esta página describe el diseño de TilcAI para quienes construyen y revisan. No es documentación de una API pública. Cada sección indica qué existe hoy y qué todavía se está integrando.",
  tocTitle: "En esta página",
  backHome: "Volver al resumen",
  sections: [
    {
      id: "status",
      title: "Estado y alcance",
      html: `
<p>TilcAI es una infraestructura para que el agente de una persona u organización consulte, cotice, reserve y compre al agente de una empresa con autoridad limitada, condiciones verificables y pagos sobre Stellar. Se construye por etapas. <strong>El flujo de compra completo no está habilitado.</strong> Los nombres pueden cambiar.</p>
<ul class="checklist">
  <li><span class="tag tag-available">Base disponible</span> Un riel de pago x402 con OpenZeppelin Relayer en Stellar Testnet, un evaluador determinista de políticas y contratos compartidos versionados.</li>
  <li><span class="tag tag-integration">En integración</span> Conector MCP, cotizaciones y órdenes, aprobación por compra, conciliación de pagos y confirmación de entrega.</li>
  <li><span class="tag tag-next">Siguientes pasos</span> Smart accounts con permisos limitados, presupuesto compartido entre agentes y tareas programadas.</li>
</ul>
<p>El primer flujo apunta a un negocio, un servicio, un asistente, un usuario y un activo en <code>stellar:testnet</code>. Esta documentación distingue la base disponible, los componentes en integración y los siguientes pasos.</p>
<p class="callout">Que un componente esté disponible no equivale a que el flujo de compra esté habilitado. Nada de esto ha sido auditado y nada opera con fondos reales.</p>`,
    },
    {
      id: "architecture",
      title: "Arquitectura",
      html: `
<p>Una solicitud recorre el camino siguiente. El modelo de lenguaje ayuda con la tarea; la infraestructura decide qué acciones pueden ejecutarse y bajo qué condiciones.</p>
<div class="diagram" role="img" aria-label="Flujo: MCP o adaptador comercial, luego gateway, luego identidad y política, luego autorización, luego x402 en Stellar, luego conciliación.">
  <div class="d-row"><span class="d-node">MCP / adaptador</span><span class="d-arrow">→</span><span class="d-node">Gateway</span><span class="d-arrow">→</span><span class="d-node d-accent">Identidad y política</span><span class="d-arrow">→</span><span class="d-node d-accent">Autorización</span><span class="d-arrow">→</span><span class="d-node">x402 · Stellar</span><span class="d-arrow">→</span><span class="d-node">Conciliación</span></div>
</div>
<p>Tres planos permanecen separados, de modo que una solicitud puede avanzar en el primero sin tener permisos en el tercero:</p>
<ol class="numbered">
  <li><strong>Comunicación.</strong> Asistentes, herramientas MCP y mensajes entre agentes.</li>
  <li><strong>Comercio y control.</strong> Identidad del negocio, cotizaciones, órdenes, mandatos y política.</li>
  <li><strong>Financiero.</strong> Cuenta, autorización, firma, pago y conciliación.</li>
</ol>
<div class="table-wrap"><table>
<caption>Módulos principales y el control que conserva cada uno</caption>
<thead><tr><th scope="col">Módulo</th><th scope="col">Responsabilidad</th><th scope="col">Control esencial</th></tr></thead>
<tbody>
<tr><td>Servidor MCP</td><td>Exponer herramientas a los asistentes</td><td>Permisos y contexto del principal</td></tr>
<tr><td>Gateway</td><td>Coordinar el ciclo de compra</td><td>Idempotencia y una máquina de estados</td></tr>
<tr><td>Adaptador comercial</td><td>Conectar las capacidades del negocio</td><td>El negocio es la fuente de verdad</td></tr>
<tr><td>Identidad y verificador de oferta</td><td>Comprobar quién ofrece y que las condiciones estén íntegras</td><td>Claves de una fuente de confianza independiente</td></tr>
<tr><td>Política y presupuesto</td><td>Evaluar proveedor, servicio, monto y límites</td><td>Rechazo por defecto</td></tr>
<tr><td>Autorización y firmante</td><td>Vincular la acción exacta a un consentimiento o mandato</td><td>Secretos fuera del alcance del modelo</td></tr>
<tr><td>Adaptador Stellar, facilitador y Relayer</td><td>Construir, verificar y presentar el pago x402</td><td>Activo, red e invocación exactos</td></tr>
<tr><td>Conciliador y recibos</td><td>Establecer el resultado real y conservar evidencia</td><td>No repetir un pago incierto</td></tr>
</tbody></table></div>
<p>Los módulos son responsabilidades lógicas, no un servicio por caja. Las órdenes, los mandatos y los estados se guardan en almacenamiento durable: el historial de un chat no es un registro de compras.</p>`,
    },
    {
      id: "business",
      title: "Integración empresarial",
      html: `
<p>El negocio conserva la autoridad sobre sus servicios, precios, disponibilidad y condiciones. Un adaptador comercial conecta al flujo común las capacidades que realmente puede respaldar, y su agente consulta los sistemas propios del negocio. No inventa stock, descuentos ni confirmaciones.</p>
<ul class="plain">
  <li><strong>Capacidades explícitas.</strong> Cada negocio expone solo las operaciones que admite, por ejemplo consultar disponibilidad, retener un recurso o confirmar una orden. Los permisos las distinguen.</li>
  <li><strong>Contexto desde la autenticación.</strong> Negocio, usuario y rol provienen de la sesión autenticada, nunca de un argumento libre propuesto por el modelo.</li>
  <li><strong>Identidad de alcance limitado.</strong> Un negocio registra su operador, origen, claves y destino de cobro. Controlar una clave o un dominio no demuestra identidad legal ni calidad comercial.</li>
  <li><strong>Cotizaciones firmadas.</strong> Una cotización vincula negocio, servicio, cantidad, precio total, red, activo, destinatario, vencimiento y un hash de las condiciones.</li>
</ul>
<p>Un comprador acepta una cotización solo cuando:</p>
<ol class="numbered">
  <li>la clave de firma la reconoce una fuente independiente (onboarding, un registro aceptado o la configuración confiable del principal), nunca se toma de la propia cotización;</li>
  <li>servicio, red, activo, monto y destinatario coinciden exactamente con los requisitos de pago, y la cotización no ha vencido;</li>
  <li>la política, el presupuesto y la aprobación siguen permitiendo la operación.</li>
</ol>
<p class="callout">Una firma protege las condiciones después de firmadas. No protege frente a una clave comprometida, un origen de phishing o una política mal configurada, y nunca concede autoridad de gasto.</p>
<p><strong>La entrega la aporta el negocio.</strong> La orden la confirma y cumple el sistema propio del negocio, y esa evidencia se mantiene separada del recibo de pago. Publicar el perfil de un negocio requiere su aprobación; agregar un perfil o explorar un caso de uso no habilita ventas. Un negocio se presenta como habilitado solo cuando su flujo operativo ha sido verificado.</p>`,
    },
    {
      id: "mcp",
      title: "MCP y asistentes",
      html: `
<p><strong>MCP</strong> (Model Context Protocol) es la interfaz de herramientas para asistentes compatibles. TilcAI está diseñado para publicar un servidor MCP con operaciones específicas, autenticado según la especificación de autorización de MCP. <strong>Todavía no hay un servidor MCP expuesto.</strong> Los nombres siguientes son diseño de interfaz, no un paquete publicado.</p>
<div class="table-wrap"><table>
<caption>Superficie de herramientas diseñada</caption>
<thead><tr><th scope="col">Herramienta</th><th scope="col">Función</th><th scope="col">Permiso</th></tr></thead>
<tbody>
<tr><td><code>list_businesses</code></td><td>Descubrir proveedores incorporados</td><td>Consulta</td></tr>
<tr><td><code>get_service</code></td><td>Consultar servicios y condiciones</td><td>Consulta</td></tr>
<tr><td><code>get_availability</code></td><td>Consultar disponibilidad</td><td>Consulta</td></tr>
<tr><td><code>request_quote</code></td><td>Obtener una cotización identificable</td><td>Preparación</td></tr>
<tr><td><code>prepare_purchase</code></td><td>Verificar y preparar una orden</td><td>Usuario autenticado y política</td></tr>
<tr><td><code>request_purchase</code></td><td>Solicitar la ejecución de una orden preparada</td><td>Confirmación exacta o mandato</td></tr>
<tr><td><code>get_order_status</code></td><td>Consultar el resultado de una orden propia</td><td>Propiedad de la orden</td></tr>
<tr><td><code>request_cancellation</code></td><td>Pedir una cancelación según las condiciones</td><td>Permiso comercial correspondiente</td></tr>
<tr><td><code>get_budget_status</code></td><td>Consultar límites y retenciones</td><td>Acceso al presupuesto propio</td></tr>
</tbody></table></div>
<p>El modelo trabaja con IDs de cotización y de orden. No existe una herramienta irrestricta para enviar dinero a una dirección cualquiera. Precio, destinatario, cantidad, red y activo viajan como datos versionados; la conversación explica esos datos pero no los redefine.</p>
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
      html: `
<p>Un pago es elegible solo cuando se cumplen a la vez:</p>
<ol class="numbered">
  <li>una identidad reconocida y una oferta auténtica y vigente;</li>
  <li>una intención vinculada a una orden y un mandato aplicable;</li>
  <li>presupuesto disponible y retenido;</li>
  <li>aprobación exacta o una delegación verificable.</li>
</ol>
<p><strong>Una firma válida no basta para autorizar un pago.</strong> La reputación puede informar una decisión, pero nunca se salta un límite.</p>
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
  <li><strong>Delegación limitada (ruta objetivo).</strong> Una smart account Soroban de la persona acepta un firmante restringido dentro de un mandato: red y activo exactos, contratos permitidos, destinatarios, montos por operación y por periodo, proveedores, vigencia y revocación. Se habilita solo después de probar juntas la cuenta, el firmante y el riel. Que una smart account funcione no demuestra por sí solo que un payload de pago sea compatible con ella.</li>
</ul>
<h3>El riel de pago hoy</h3>
<p>El riel es un facilitador x402 que se ejecuta como plugin dentro de un OpenZeppelin Relayer, en Stellar Testnet. Expone <code>verify</code>, <code>settle</code> y <code>supported</code>. Comprueba la red, el activo permitido, el destinatario, el monto y la autorización firmada del pagador, simula la transacción, y el Relayer la envía y paga la comisión de red.</p>
<ul class="plain">
  <li><strong>Probado.</strong> Se confirmó un pago en Testnet dentro de la cadena y se comprobó de forma independiente. Se rechazaron payloads alterados antes de mover fondos. Repetir un payload ya liquidado no pagó dos veces. La respuesta de liquidación trae solo evidencia de pago, nunca datos de entrega.</li>
  <li><strong>Todavía no.</strong> Conexión con cotizaciones, aprobaciones, presupuesto y órdenes; una smart account como pagadora; mainnet; y USDC, porque la prueba en Testnet usó el activo nativo de la red.</li>
</ul>
<p>El detalle técnico, los payloads y el contrato de errores están en la <a href="https://github.com/TilcAI/tilcai-core/blob/main/docs/payment-rail-environment.md" rel="noopener">documentación del riel de pago</a> del repositorio abierto <code>tilcai-core</code>.</p>
<h3>Cuando algo falla</h3>
<ul class="plain">
  <li><strong>Pago incierto.</strong> Un timeout después de enviar no es un fallo. Se mantiene la retención de presupuesto y se concilia el mismo intento antes de firmar de nuevo. Repetir una consulta puede ser seguro; repetir una ejecución financiera exige conocer el estado del intento anterior.</li>
  <li><strong>Pago sin entrega.</strong> La orden no se marca como entregada. El problema se resuelve según las condiciones comerciales, y repetir la compra no es una solución automática.</li>
  <li><strong>Revocación.</strong> Revocar un mandato bloquea nuevas firmas. No revierte un pago que ya se liquidó.</li>
  <li><strong>Condiciones cambiadas.</strong> Un precio, proveedor o servicio distinto detiene la operación hasta una nueva aprobación. El agente no puede subir su propio límite ni aprobar su propia excepción.</li>
</ul>`,
    },
    {
      id: "extensions",
      title: "Extensiones previstas",
      html: `
<p>Son extensiones previstas, no activas. Se añaden detrás de las mismas operaciones y estados.</p>
<ul class="checklist">
  <li><span class="tag tag-next">Extensión prevista</span> <strong>A2A.</strong> Un estándar de comunicación entre agentes, con capacidades descritas mediante Agent Cards. Conectaría la solicitud del comprador con las capacidades del agente de la empresa. No sustituye inventario, mandato ni firma financiera. El primer flujo puede funcionar con MCP y una API comercial.</li>
  <li><span class="tag tag-next">Extensión prevista</span> <strong>ERC-8004.</strong> Un estándar en borrador para registros de identidad, reputación y validación en Ethereum/EVM. No es un contrato nativo de Stellar ni garantiza confianza. TilcAI prevé una identidad operativa nativa en Stellar y, por separado, un adaptador para resolver un registro EVM. Consultar una identidad EVM nunca mueve fondos entre redes ni construye un bridge.</li>
  <li><span class="tag tag-next">Siguientes pasos</span> <strong>Smart accounts, presupuesto compartido y tareas programadas.</strong> Consulta el estado de construcción en el resumen.</li>
</ul>`,
    },
    {
      id: "limits",
      title: "Modelo de seguridad y límites conocidos",
      html: `
<ul class="plain">
  <li><strong>El modelo propone; las reglas deciden.</strong> La salida del modelo nunca se acepta para precio, destinatario ni aprobación. Una condición que no se puede verificar bloquea la operación o pide revisión humana.</li>
  <li><strong>El firmante es una frontera separada.</strong> Las claves quedan fuera del alcance del modelo y de los datos del negocio. Este sitio web no almacena claves privadas, tokens financieros ni mandatos de gasto.</li>
  <li><strong>Dependencia del facilitador.</strong> La liquidación depende de un facilitador x402 y de un Relayer en Testnet. Si no están disponibles, los pagos se detienen.</li>
  <li><strong>Solo Testnet.</strong> El primer flujo corre en Stellar Testnet. Testnet y mainnet tienen configuración y habilitación separadas.</li>
  <li><strong>Sin auditar.</strong> Nada de lo descrito aquí ha sido auditado.</li>
</ul>
<p>Fuera del alcance por ahora: un marketplace de agentes, trading o DeFi, puentes de activos envueltos entre cadenas (el pago entre redes con CCTP, que retira y emite USDC nativo, sí está previsto y hoy solo Avalanche Fuji a Stellar está verificado), negociación libre de precios, compras a cualquier negocio sin adaptador, servicios regulados y autonomía ilimitada de los agentes.</p>`,
    },
    {
      id: "glossary",
      title: "Glosario",
      html: `
<dl class="glossary">
  <dt>Principal</dt><dd>La persona u organización que posee los fondos y otorga la autoridad.</dd>
  <dt>Mandato</dt><dd>Autoridad delegada a un agente, con alcance, límites, periodo y revocación.</dd>
  <dt>Cotización</dt><dd>Condiciones comerciales exactas de un negocio: servicio, precio, activo, red, destinatario y vencimiento.</dd>
  <dt>Orden</dt><dd>La operación comercial que vincula al principal, el negocio y la cotización, con estados propios.</dd>
  <dt>MCP</dt><dd>Model Context Protocol: la interfaz de herramientas para asistentes compatibles.</dd>
  <dt>x402</dt><dd>Un protocolo de pago HTTP: un servidor responde <code>402 Payment Required</code> con las condiciones de pago y el cliente paga para obtener el recurso.</dd>
  <dt>Facilitador</dt><dd>El componente que verifica y presenta un pago x402. Aquí, un plugin que corre en un OpenZeppelin Relayer.</dd>
  <dt>Soroban</dt><dd>La plataforma de contratos inteligentes de Stellar.</dd>
  <dt>Conciliación</dt><dd>Establecer el resultado real de un intento de pago, incluso cuando una llamada falló a mitad de camino.</dd>
  <dt>Código de motivo</dt><dd>Una explicación legible por máquina de una decisión.</dd>
</dl>`,
    },
  ],
};
