import type { MonitorEventType } from "./contract.ts";

/**
 * What each event and alert means, in words for a person: the interpretation layer of the
 * dashboard. The backend sends facts (`type`, `data`); the reading of them lives here, in
 * both languages of the site.
 */
export type Lang = "en" | "es";
type Text = Record<Lang, string>;

export const MONITOR_CATEGORIES = ["alert", "vault", "crosschain", "account", "qr", "relayer", "api", "resources", "system"] as const;
export type MonitorCategory = (typeof MONITOR_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<MonitorCategory, Text> = {
  alert: { en: "Alerts", es: "Alertas" },
  vault: { en: "Vault payouts", es: "Desembolsos del vault" },
  crosschain: { en: "Crosschain payments", es: "Pagos crosschain" },
  account: { en: "Smart accounts", es: "Cuentas de contrato" },
  qr: { en: "QR Simple", es: "QR Simple" },
  relayer: { en: "Relayer", es: "Relayer" },
  api: { en: "API", es: "API" },
  resources: { en: "Resources", es: "Recursos" },
  system: { en: "System", es: "Sistema" },
};

export function categoryOf(type: string): MonitorCategory | "other" {
  const prefix = type.split(".", 1)[0];
  return (MONITOR_CATEGORIES as readonly string[]).includes(prefix ?? "") ? (prefix as MonitorCategory) : "other";
}

export const EVENT_CATALOG: Record<MonitorEventType, { title: Text; meaning: Text }> = {
  "system.started": {
    title: { en: "Backend started", es: "Backend en marcha" },
    meaning: { en: "A TilcAI process came up. `data` says its role and what is switched on.", es: "Un proceso de TilcAI arrancó. `data` dice su rol y qué tiene encendido." },
  },
  "system.stopping": {
    title: { en: "Backend stopping", es: "Backend deteniéndose" },
    meaning: { en: "A process received a signal and is shutting down in order.", es: "Un proceso recibió una señal y se está cerrando en orden." },
  },
  "resources.snapshot": {
    title: { en: "Resource snapshot", es: "Foto de recursos" },
    meaning: { en: "Periodic picture of the process, database, queues, relayers and vault.", es: "Foto periódica del proceso, la base, las colas, los relayers y el vault." },
  },
  "alert.raised": {
    title: { en: "Alert raised", es: "Alerta activada" },
    meaning: { en: "Something became wrong and stays wrong until an `alert.cleared` with the same code.", es: "Algo empezó a estar mal y sigue así hasta un `alert.cleared` con el mismo código." },
  },
  "alert.cleared": {
    title: { en: "Alert cleared", es: "Alerta resuelta" },
    meaning: { en: "The condition of an earlier alert no longer holds.", es: "La condición de una alerta anterior ya no se cumple." },
  },
  "api.request_rejected": {
    title: { en: "API request failed", es: "Petición a la API fallida" },
    meaning: { en: "The API answered 5xx. Repeats of the same failure are grouped per minute (`repeatedSinceLast`).", es: "La API respondió 5xx. Las repeticiones del mismo fallo se agrupan por minuto (`repeatedSinceLast`)." },
  },
  "crosschain.payment.transition": {
    title: { en: "Crosschain payment moved", es: "Pago crosschain avanzó" },
    meaning: { en: "A CCTP payment changed state (`from` → `to`; `from` is null when it was created). Only SETTLED means the merchant has the funds.", es: "Un pago CCTP cambió de estado (`from` → `to`; `from` es null al crearse). Solo SETTLED significa que el comercio tiene los fondos." },
  },
  "crosschain.payment.uncertain": {
    title: { en: "Crosschain payment uncertain", es: "Pago crosschain incierto" },
    meaning: { en: "The backend cannot yet prove what happened on-chain. It keeps reconciling; it is neither failed nor settled.", es: "El backend aún no puede probar qué pasó en la cadena. Sigue conciliando; no está fallido ni liquidado." },
  },
  "account.transition": {
    title: { en: "Smart account moved", es: "Cuenta de contrato avanzó" },
    meaning: {
      en: "TilcAI issued a smart account for a tenant, or it changed state (`from` → `to`; `from` is null when issued). DEPLOYING: the address is final and can receive funds. ACTIVE: the contract is on-chain and its owner's passkey can sign.",
      es: "TilcAI emitió una cuenta de contrato para un tercero, o cambió de estado (`from` → `to`; `from` es null al emitirse). DEPLOYING: la dirección es definitiva y puede recibir fondos. ACTIVE: el contrato está en la cadena y la passkey de su dueño puede firmar.",
    },
  },
  "account.deploy_delayed": {
    title: { en: "Account deployment delayed", es: "Despliegue de cuenta demorado" },
    meaning: {
      en: "The relayer refused or lost the deployment of an account several times (`lastError`). The account is still retried and its address does not change; check the relayer's balance and status.",
      es: "El relayer rechazó o perdió varias veces el despliegue de una cuenta (`lastError`). La cuenta se sigue reintentando y su dirección no cambia; revisa el saldo y el estado del relayer.",
    },
  },
  "vault.disbursement.transition": {
    title: { en: "Vault payout moved", es: "Desembolso avanzó" },
    meaning: { en: "A payout changed state: REQUESTED → SUBMITTED → CONFIRMED (or FAILED). CONFIRMED means the vault's on-chain event matched.", es: "Un desembolso cambió de estado: REQUESTED → SUBMITTED → CONFIRMED (o FAILED). CONFIRMED significa que el evento del vault en la cadena coincidió." },
  },
  "vault.disbursement.uncertain": {
    title: { en: "Vault payout uncertain", es: "Desembolso incierto" },
    meaning: { en: "A relayer call ended without an answer: a transaction may exist. The vault pays each id once, so retrying is safe.", es: "Una llamada al relayer terminó sin respuesta: puede existir una transacción. El vault paga cada id una vez, así que reintentar es seguro." },
  },
  "vault.disbursement.rejected": {
    title: { en: "Vault payout refused", es: "Desembolso rechazado" },
    meaning: { en: "The vault could not take a payout: no funds (BUDGET), paused (PAUSED) or over its limits (PAYMENT_LIMIT). Nothing was sent; the caller will retry.", es: "El vault no pudo aceptar un desembolso: sin fondos (BUDGET), en pausa (PAUSED) o sobre sus límites (PAYMENT_LIMIT). No se envió nada; quien llama reintentará." },
  },
  "relayer.transaction_update": {
    title: { en: "Relayer transaction update", es: "Transacción del relayer" },
    meaning: { en: "Webhook from the OpenZeppelin Relayer: a transaction changed status. `related` links it to the payment or payout that sent it.", es: "Aviso del OpenZeppelin Relayer: una transacción cambió de estado. `related` la enlaza con el pago o desembolso que la envió." },
  },
  "relayer.state_update": {
    title: { en: "Relayer enabled / disabled", es: "Relayer habilitado / deshabilitado" },
    meaning: { en: "Webhook: a relayer took itself out of service or came back.", es: "Aviso: un relayer se sacó de servicio o volvió." },
  },
  "relayer.notification": {
    title: { en: "Relayer notification", es: "Aviso del relayer" },
    meaning: { en: "Any other webhook from the relayer, kept as it came.", es: "Cualquier otro aviso del relayer, tal como llegó." },
  },
  "qr.token_issued": {
    title: { en: "QR Simple: login", es: "QR Simple: inicio de sesión" },
    meaning: { en: "A caller logged in to QR Simple and got a token.", es: "Alguien inició sesión en QR Simple y obtuvo un token." },
  },
  "qr.created": {
    title: { en: "QR generated", es: "QR generado" },
    meaning: { en: "QR Simple issued a bank QR (amount in bolivianos, description, expiry).", es: "QR Simple emitió un QR bancario (monto en bolivianos, glosa, vencimiento)." },
  },
  "qr.paid": {
    title: { en: "Deposit simulated", es: "Depósito simulado" },
    meaning: { en: "Someone pressed «Simular depósito»: the QR is paid and the caller is being notified. No real money moved.", es: "Alguien pulsó «Simular depósito»: el QR quedó pagado y se avisa a quien cobra. No se movió dinero real." },
  },
  "qr.expired": {
    title: { en: "QR expired", es: "QR vencido" },
    meaning: { en: "A QR ran out of time without being paid.", es: "Un QR venció sin pago." },
  },
  "qr.callback_delivered": {
    title: { en: "Payment notification delivered", es: "Aviso de pago entregado" },
    meaning: { en: "The caller acknowledged the payment notification.", es: "Quien cobra confirmó la recepción del aviso de pago." },
  },
  "qr.callback_failed": {
    title: { en: "Payment notification failed", es: "Aviso de pago fallido" },
    meaning: { en: "The notification was not acknowledged. It is retried three times; `final` says whether it gave up.", es: "El aviso no fue confirmado. Se reintenta tres veces; `final` dice si ya se rindió." },
  },
};

/** Alert codes of the backend (`resources.ts`). Codes with a target come as `CODE:<target>`. */
export const ALERT_CATALOG: Record<string, { title: Text; action: Text }> = {
  VAULT_EMPTY: {
    title: { en: "The vault has no USDC", es: "El vault no tiene USDC" },
    action: { en: "Send USDC of its network (Fuji USDC to the Fuji vault, Stellar USDC to the Stellar one) to the vault contract address (not to the relayer account).", es: "Envía USDC de su red (USDC de Fuji al vault de Fuji, USDC de Stellar al de Stellar) a la dirección del contrato vault (no a la cuenta del relayer)." },
  },
  VAULT_INSUFFICIENT: {
    title: { en: "The vault owes more than it holds", es: "El vault debe más de lo que tiene" },
    action: { en: "Top up the vault: payouts in progress exceed its balance.", es: "Recarga el vault: los desembolsos en curso superan su saldo." },
  },
  VAULT_LOW: {
    title: { en: "The vault is running low", es: "Al vault le queda poco" },
    action: { en: "Top it up before a payout of the maximum size arrives.", es: "Recárgalo antes de que llegue un desembolso del tamaño máximo." },
  },
  VAULT_PAUSED: {
    title: { en: "The vault is paused", es: "El vault está en pausa" },
    action: { en: "Only its owner can unpause it.", es: "Solo su dueño puede reanudarlo." },
  },
  VAULT_OPERATOR_MISMATCH: {
    title: { en: "The vault's operator is not the relayer", es: "El operador del vault no es el relayer" },
    action: { en: "The owner must set the relayer account as operator, or payouts revert.", es: "El dueño debe poner la cuenta del relayer como operador, o los desembolsos revierten." },
  },
  VAULT_DAILY_LIMIT_REACHED: {
    title: { en: "The vault reached its daily limit", es: "El vault agotó su límite diario" },
    action: { en: "Payouts resume at 00:00 UTC, or the owner raises the limit.", es: "Los desembolsos siguen a las 00:00 UTC, o el dueño sube el límite." },
  },
  VAULT_UNREADABLE: {
    title: { en: "The vault could not be read", es: "No se pudo leer el vault" },
    action: { en: "Check the RPC of the vault's network (Avalanche or Stellar).", es: "Revisa el RPC de la red del vault (Avalanche o Stellar)." },
  },
  RELAYER_DOWN: {
    title: { en: "The relayer does not answer", es: "El relayer no responde" },
    action: { en: "No transaction can be sent until it is back.", es: "No se puede enviar ninguna transacción hasta que vuelva." },
  },
  RELAYER_UNAUTHENTICATED: {
    title: { en: "The backend has no relayer key", es: "El backend no tiene la clave del relayer" },
    action: { en: "Set RELAYER_API_KEY.", es: "Define RELAYER_API_KEY." },
  },
  RELAYER_UNREADABLE: {
    title: { en: "A relayer could not be read", es: "No se pudo leer un relayer" },
    action: { en: "Check its id and the relayer's logs.", es: "Revisa su id y los logs del relayer." },
  },
  RELAYER_PAUSED: {
    title: { en: "A relayer is paused", es: "Un relayer está en pausa" },
    action: { en: "Unpause it in the relayer.", es: "Reanúdalo en el relayer." },
  },
  RELAYER_DISABLED: {
    title: { en: "A relayer disabled itself", es: "Un relayer se deshabilitó" },
    action: { en: "Usually its RPC or its balance: see the reason in its `relayer.state_update` event.", es: "Suele ser su RPC o su saldo: mira el motivo en su evento `relayer.state_update`." },
  },
  RELAYER_LOW_GAS: {
    title: { en: "A relayer is low on gas", es: "A un relayer le queda poco gas" },
    action: { en: "Fund its account (AVAX on Fuji, XLM on Stellar).", es: "Fondea su cuenta (AVAX en Fuji, XLM en Stellar)." },
  },
  MONITOR_SINK_FAILING: {
    title: { en: "Events are not reaching a destination", es: "Los eventos no llegan a un destino" },
    action: { en: "Check MONITOR_WEB_URL and that both sides share the same secret.", es: "Revisa MONITOR_WEB_URL y que ambos lados compartan el mismo secreto." },
  },
  PAYMENTS_UNCERTAIN: {
    title: { en: "Payments waiting for proof", es: "Pagos esperando comprobación" },
    action: { en: "They keep reconciling on their own; look at the ones that stay for long.", es: "Siguen conciliando solos; revisa los que lleven mucho tiempo." },
  },
  EVENT_LOOP_SLOW: {
    title: { en: "The backend is answering slowly", es: "El backend responde lento" },
    action: { en: "Look at CPU and at what the process was doing.", es: "Mira la CPU y qué estaba haciendo el proceso." },
  },
};

export function explainEvent(type: string, lang: Lang): { title: string; meaning: string } {
  const known = EVENT_CATALOG[type as MonitorEventType];
  if (known) return { title: known.title[lang], meaning: known.meaning[lang] };
  return { title: type, meaning: lang === "es" ? "Tipo de evento que esta versión del sitio aún no interpreta." : "An event type this version of the site does not interpret yet." };
}

/** `RELAYER_LOW_GAS:avalanche-fuji-relayer` → its explanation and the relayer it is about. */
export function explainAlert(code: string, lang: Lang): { title: string; action: string; target: string | null } {
  const [base, ...rest] = code.split(":");
  const known = ALERT_CATALOG[base ?? ""];
  const target = rest.length ? rest.join(":") : null;
  if (known) return { title: known.title[lang], action: known.action[lang], target };
  return { title: code, action: "", target };
}

/**
 * Events stored before the backend dropped the words "mock" and "demo" from its texts still carry
 * them. They are removed when shown, so the feed reads the same for old and new events.
 */
export function cleanEventText(text: string): string {
  return text.replace(/\s*\((?:mock|demo)\)/gi, "").replace(/BANCO MOCK/g, "BANCO NO INFORMADO");
}
