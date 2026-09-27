import type { Copy } from "./types";
import { sig } from "../highlight";

// Code identifiers stay in English (they are names, not prose);
// comments inside code are translated.
const contractSurface = sig(`init(principal, guardian, asset)        // USDC mediante SEP-41
deposit(from, amount)                   // financia el presupuesto raíz
create_mandate(parent, agent, wallet, cap, period, expires) -> id
                                        // exige cap <= disponible del padre
top_up(mandate_id, amount)              // recarga la wallet operativa solo si cabe
                                        // en este mandato y en todos sus ancestros
pause(mandate_id) / revoke(mandate_id)  // guardián o principal; lo heredan los hijos
remaining(mandate_id) -> i128`);

const gatewayModel = sig(`PaymentIntent  { resource, providerId, network, asset, amount,
                 payTo, scheme, expiresAt, intentHash }
PolicyEngine.evaluate(intent, mandate)
               -> { decision, reasonCodes[], policyHash }
RailAdapter    // supports, sign, settle, reconcile
  StellarExactAdapter     // el único adaptador en construcción
SignerProvider
  ClassicKeypairSigner    // wallet operativa pequeña`);

export const docsEs: Copy["docs"] = {
  status: "Arquitectura propuesta · en desarrollo · sujeta a cambios",
  title: "Cómo debería funcionar TilcAI",
  lead:
    "Esta página describe el diseño propuesto de TilcAI. Es un documento de diseño para builders y evaluadores; no es documentación de una API pública ni la descripción de un software en funcionamiento.",
  tocTitle: "En esta página",
  backHome: "Volver al resumen",
  sections: [
    {
      id: "status",
      title: "Estado y alcance",
      html: `
<p>TilcAI se está diseñando y construyendo. Al momento de escribir esto <strong>no hay contrato desplegado, ni paquete publicado, ni servicio en producción</strong>. Todo lo que sigue es un plan y los nombres pueden cambiar.</p>
<ul class="checklist">
  <li><span class="tag tag-elite">Stellar Elite</span> Base compradora: árbol de presupuestos, gateway de políticas, recibos y señales de confianza v0.</li>
  <li><span class="tag tag-meridian">HackMeridian</span> Ampliación vendedora: ofertas firmadas que verifica el comprador.</li>
  <li><span class="tag tag-vision">Visión</span> Comercio entre agentes y negocios. Sin fecha.</li>
</ul>
<p>El MVP apunta a una única combinación: <code>stellar:testnet</code>, USDC y el esquema <code>exact</code> de x402. Todo lo demás se rechaza.</p>`,
    },
    {
      id: "overview",
      title: "Panorama",
      html: `
<p>Cinco piezas trabajan juntas. El agente nunca tiene una clave capaz de mover la tesorería.</p>
<ol class="numbered">
  <li><strong>Árbol de presupuestos</strong>: un contrato Soroban con el presupuesto raíz del principal y sus submandatos.</li>
  <li><strong>Gateway de políticas</strong>: convierte un desafío <code>402</code> en una intención de pago y responde <code>ALLOW</code>, <code>DENY</code> o <code>REQUIRE_HUMAN</code>.</li>
  <li><strong>Recibo de decisión</strong>: registro firmado de cada decisión, incluidos los rechazos.</li>
  <li><strong>Señales de confianza v0</strong>: perfil firmado del proveedor, feedback ligado al recibo y una validación acotada.</li>
  <li><strong>Vista del principal</strong>: una página mínima para ver el árbol, las decisiones y las señales, y para pausar.</li>
</ol>
<div class="diagram" role="img" aria-label="El principal financia el árbol de presupuestos. El árbol recarga una wallet operativa pequeña. El agente consulta al gateway, que paga mediante x402 en Stellar solo cuando la política lo permite, y escribe un recibo en ambos casos.">
  <div class="d-row"><span class="d-node">Principal</span><span class="d-arrow">financia →</span><span class="d-node d-accent">Árbol de presupuestos · Soroban</span><span class="d-arrow">recarga →</span><span class="d-node">Wallet operativa</span></div>
  <div class="d-row"><span class="d-node">Agente</span><span class="d-arrow">consulta →</span><span class="d-node d-accent">Gateway de políticas</span><span class="d-arrow">ALLOW →</span><span class="d-node">x402 · USDC · Stellar</span><span class="d-arrow">→</span><span class="d-node">Recibo</span></div>
</div>`,
    },
    {
      id: "budget-tree",
      title: "Árbol de presupuestos compartido (Soroban)",
      html: `
<p>El principal deposita USDC en un contrato y crea mandatos para agentes y subagentes. La regla que importa: <strong>un hijo nunca puede superar lo que le queda a su padre</strong>, y cada gasto se descuenta de todos los ancestros.</p>
<p class="label">Superficie de contrato propuesta — no desplegada</p>
<pre class="code"><code>${contractSurface}</code></pre>
<p>Pruebas previstas del contrato: hijo por encima del padre, recarga por encima del tope, reinicio de periodo, mandato vencido, pausa heredada, revocación y autorización incorrecta.</p>`,
    },
    {
      id: "operating-wallet",
      title: "Por qué una wallet operativa pequeña",
      html: `
<p>Lo ideal sería que el agente pagara directamente desde una smart account con límites on-chain. Al momento del diseño, el cliente oficial de x402 para Stellar solo firma con cuentas clásicas, y el facilitador oficial rechaza pagos cuyos contratos de política emiten eventos adicionales (<a href="https://github.com/x402-foundation/x402/issues/3158" rel="noopener">issue #3158</a>, <a href="https://github.com/x402-foundation/x402/issues/3352" rel="noopener">issue #3352</a>).</p>
<p>Por eso el MVP usa por agente una wallet clásica <code>G…</code> con un saldo muy pequeño, que solo recarga el contrato de presupuestos. Si el agente o el gateway se comprometen, la pérdida máxima prevista es ese saldo más lo que quede de su submandato. Pagar directamente desde una smart account es una opción posterior, detrás de las mismas interfaces.</p>`,
    },
    {
      id: "gateway",
      title: "Gateway de políticas",
      html: `
<p>El agente pide un recurso. El gateway lee el desafío <code>402</code>, lo normaliza y evalúa las reglas. El modelo de lenguaje propone; el motor de reglas decide.</p>
<pre class="code"><code>${gatewayModel}</code></pre>
<div class="table-wrap"><table>
<caption>Reglas propuestas, todas con rechazo por defecto</caption>
<thead><tr><th scope="col">Regla</th><th scope="col">Código de motivo cuando falla</th></tr></thead>
<tbody>
<tr><td>Red, esquema y activo son los permitidos</td><td><code>NETWORK_NOT_ALLOWED</code> · <code>SCHEME_NOT_ALLOWED</code> · <code>ASSET_NOT_ALLOWED</code></td></tr>
<tr><td>Proveedor y destinatario permitidos para este agente</td><td><code>PAYEE_NOT_ALLOWED</code></td></tr>
<tr><td>Servicio o recurso permitido</td><td><code>SERVICE_NOT_ALLOWED</code></td></tr>
<tr><td>Monto dentro del tope por pago</td><td><code>PER_PAYMENT_LIMIT_EXCEEDED</code></td></tr>
<tr><td>Monto dentro del submandato restante</td><td><code>BUDGET_EXCEEDED</code></td></tr>
<tr><td>La misma intención no se pagó antes</td><td><code>DUPLICATE_PAYMENT_INTENT</code></td></tr>
<tr><td>Mandato activo, sin pausa ni vencimiento</td><td><code>MANDATE_PAUSED</code> · <code>MANDATE_EXPIRED</code></td></tr>
<tr><td>Monto sobre el umbral humano</td><td><code>REQUIRE_HUMAN</code></td></tr>
</tbody></table></div>
<p>La herramienta para el agente obtiene una URL y paga solo si las reglas lo permiten. No ofrece una capacidad genérica de «enviar dinero a una dirección».</p>`,
    },
    {
      id: "receipts",
      title: "Recibos de decisión",
      html: `
<p>Cada decisión genera un recibo firmado: hash de la intención, mandato, proveedor, recurso, decisión, códigos de motivo, hash de la política y, si hubo pago, red, activo, monto y hash de la transacción, más un hash de la respuesta.</p>
<p>Un pago prueba que se movió valor. No prueba que el servicio fuera bueno. Los recibos mantienen separadas la autorización, el pago, la entrega y las señales posteriores. Anclar por lotes los hashes de recibos en Stellar es opcional en el MVP.</p>`,
    },
    {
      id: "trust-signals",
      title: "Señales de confianza v0",
      html: `
<p>Inspiradas en los conceptos de identidad, reputación y validación de <a href="https://eips.ethereum.org/EIPS/eip-8004" rel="noopener">ERC-8004</a> (un estándar de Ethereum en borrador). <strong>No</strong> son una implementación de sus registros en Stellar. Cada señal es deliberadamente acotada.</p>
<div class="table-wrap"><table>
<thead><tr><th scope="col">Señal</th><th scope="col">Versión mínima</th><th scope="col">Lo que no demuestra</th></tr></thead>
<tbody>
<tr><td>Identidad</td><td>Perfil firmado del proveedor que vincula una clave Stellar, un endpoint HTTPS y un destinatario. Se comprueba antes de pagar; la política fija qué clave y origen se aceptan.</td><td>Identidad legal, KYC ni unicidad global.</td></tr>
<tr><td>Reputación</td><td>Feedback firmado por un comprador y ligado a un recibo pagado y entregado. Una entrada por recibo. Se muestra como historial, no como puntaje.</td><td>Que una reseña sea verdadera, imparcial o resistente a Sybil.</td></tr>
<tr><td>Validación</td><td>Atestación, hecha por una clave distinta de la del vendedor, de que la respuesta tiene el formato esperado y un <code>asOf</code> reciente.</td><td>Que el contenido sea correcto, ni que el validador sea independiente. Si el equipo opera el validador en la demo, lo dirá.</td></tr>
</tbody></table></div>`,
    },
    {
      id: "signed-offers",
      title: "Ofertas firmadas (previstas para HackMeridian)",
      html: `
<p>El perfil del proveedor responde <em>quién</em> cobra. Una oferta firmada responde <em>qué</em> se vende, <em>cuánto</em> cuesta y <em>hasta cuándo</em> vale. Un kit pequeño para el vendedor publicaría la oferta; el gateway del comprador la verificaría antes de pagar.</p>
<p>El comprador acepta una oferta solo cuando:</p>
<ol class="numbered">
  <li>el principal ya confiaba en la clave firmante y estaba vinculada al perfil del vendedor; nunca se toma de la propia oferta;</li>
  <li>servicio, red, activo, monto y destinatario coinciden exactamente con el desafío <code>402</code>, y la oferta no venció;</li>
  <li>la política de gasto y el presupuesto compartido todavía permiten el pago.</li>
</ol>
<p class="callout">Una firma protege contra cambios en las condiciones después de firmar. No protege contra una clave comprometida, un origen de phishing ni una política mal configurada. La rotación y revocación de claves y un registro interoperable vendrán después.</p>`,
    },
    {
      id: "limits",
      title: "Modelo de seguridad y límites conocidos",
      html: `
<ul class="plain">
  <li><strong>Custodia.</strong> El gateway solo tiene la clave de una wallet operativa pequeña; no puede mover la tesorería.</li>
  <li><strong>Dependencia del facilitador.</strong> La liquidación depende de un facilitador x402 externo en testnet. Si no está disponible, los pagos se detienen; las decisiones y los recibos siguen funcionando.</li>
  <li><strong>Decisiones deterministas.</strong> Nunca se confía en la salida del modelo para el precio, el destinatario o la aprobación.</li>
  <li><strong>Pruebas.</strong> El plan incluye casos adversariales: monto o destinatario alterados, intención repetida, mandato vencido o pausado, hijo fuera de presupuesto.</li>
  <li><strong>Sin auditoría.</strong> Nada de esto ha sido auditado. Nada funcionará con fondos reales como parte de este MVP.</li>
</ul>`,
    },
    {
      id: "out-of-scope",
      title: "Fuera del alcance por ahora",
      html: `
<ul class="plain two-col">
  <li>Mainnet y fondos reales</li>
  <li>Un facilitador x402 propio</li>
  <li>Otras blockchains (solo interfaces)</li>
  <li>Bridges o transferencias entre cadenas</li>
  <li>Rampas fiat y KYC</li>
  <li>Líneas de crédito</li>
  <li>Tokens propios</li>
  <li>Puntajes universales de reputación</li>
  <li>Reservas, inventario o reembolsos reales</li>
  <li>Registros ERC-8004 completos</li>
</ul>`,
    },
    {
      id: "glossary",
      title: "Glosario",
      html: `
<dl class="glossary">
  <dt>Principal</dt><dd>La persona u organización dueña de los fondos, que define las reglas.</dd>
  <dt>Mandato</dt><dd>Un presupuesto con límites delegado a un agente, como nodo del árbol de presupuestos.</dd>
  <dt>x402</dt><dd>Un protocolo de pago sobre HTTP: el servidor responde <code>402 Payment Required</code> con las condiciones de pago y el cliente paga para obtener el recurso.</dd>
  <dt>Soroban</dt><dd>La plataforma de contratos inteligentes de Stellar.</dd>
  <dt>SEP-41</dt><dd>El estándar de interfaz de tokens de Stellar, que usa USDC.</dd>
  <dt>Código de motivo</dt><dd>Una explicación legible por máquinas de una decisión, como <code>BUDGET_EXCEEDED</code>.</dd>
</dl>`,
    },
  ],
};
