import type { Lang } from "./interpret.ts";

/**
 * Interface copy of the monitoring page. It lives next to the feature, apart from the
 * site's dictionaries, until the dashboard has its final design.
 */
export interface MonitorCopy {
  title: string;
  lead: string;
  connection: { live: string; reconnecting: string; offline: string };
  locked: { title: string; body: string; label: string; submit: string; wrong: string };
  unconfigured: { title: string; body: string };
  empty: { title: string; body: string };
  failed: string;
  retry: string;
  status: { ok: string; warning: string; error: string; unknown: string };
  alerts: { title: string; none: string; since: string; action: string };
  origin: { title: string; lastDelivery: string; snapshot: string; noSnapshot: string; lag: string; upToDate: string };
  /** The environment of a backend. Mainnet is spelled out: what it shows is real money. */
  env: { testnet: string; mainnet: string; filter: string; all: string };
  tiles: {
    vault: string;
    vaultNone: string;
    pending: string;
    availableToday: string;
    maxPerPayout: string;
    paused: string;
    relayerGas: string;
    relayerDown: string;
    memory: string;
    cpu: string;
    loopDelay: string;
    uptime: string;
    database: string;
    payments: string;
    payouts: string;
    qr: string;
    inFlight: string;
    settled: string;
    pendingCallbacks: string;
    events: string;
  };
  feed: {
    title: string;
    count: (shown: number, total: number) => string;
    category: string;
    all: string;
    severity: string;
    severityAll: string;
    severityWarning: string;
    severityError: string;
    search: string;
    time: string;
    event: string;
    subject: string;
    meaning: string;
    data: string;
    none: string;
  };
  signOut: string;
}

export const MONITOR_COPY: Record<Lang, MonitorCopy> = {
  en: {
    title: "Backend monitor",
    lead: "Resources and events of each TilcAI backend, testnet and mainnet, as it reports them.",
    connection: { live: "Live", reconnecting: "Reconnecting…", offline: "Offline" },
    locked: { title: "This page needs the dashboard token", body: "Whoever runs the site has it (MONITOR_DASHBOARD_TOKEN).", label: "Dashboard token", submit: "Open", wrong: "That token is not valid." },
    unconfigured: { title: "The monitor is not configured", body: "Set MONITOR_DASHBOARD_TOKEN and MONITOR_INGEST_SECRET on this site, and MONITOR_WEB_URL and MONITOR_WEB_SECRET on the backend. A mainnet backend has its own pair: MONITOR_INGEST_SECRET_MAINNET here and MONITOR_WEB_SECRET_MAINNET there." },
    empty: { title: "Nothing received yet", body: "No backend has delivered events since this server started. Check MONITOR_WEB_URL on the backend and the shared secret." },
    failed: "The monitor could not be loaded.",
    retry: "Try again",
    status: { ok: "OK", warning: "Attention", error: "Error", unknown: "No data" },
    alerts: { title: "Active alerts", none: "No active alerts.", since: "since", action: "What to do" },
    origin: { title: "Backend", lastDelivery: "Last delivery", snapshot: "Resources as of", noSnapshot: "No resource snapshot yet.", lag: "events still to arrive", upToDate: "Up to date" },
    env: { testnet: "Testnet · test funds", mainnet: "Mainnet · real funds", filter: "Environment", all: "All" },
    tiles: {
      vault: "Vault balance",
      vaultNone: "No vault configured",
      pending: "owed to payouts in progress",
      availableToday: "left of today's limit",
      maxPerPayout: "limit per payout",
      paused: "Paused",
      relayerGas: "gas",
      relayerDown: "The relayer does not answer",
      memory: "Memory",
      cpu: "CPU",
      loopDelay: "Event loop delay (p99)",
      uptime: "Uptime",
      database: "Database",
      payments: "Crosschain payments",
      payouts: "Vault payouts",
      qr: "QR codes",
      inFlight: "in progress",
      settled: "finished",
      pendingCallbacks: "notifications pending",
      events: "Events in the log",
    },
    feed: {
      title: "Events",
      count: (shown, total) => `${shown} of ${total}`,
      category: "Category",
      all: "All but resource snapshots",
      severity: "Severity",
      severityAll: "All",
      severityWarning: "Attention and errors",
      severityError: "Errors only",
      search: "Search",
      time: "Time",
      event: "Event",
      subject: "About",
      meaning: "What it means",
      data: "Data",
      none: "No events match.",
    },
    signOut: "Sign out",
  },
  es: {
    title: "Monitor del backend",
    lead: "Recursos y eventos de cada backend de TilcAI, testnet y mainnet, tal como los reporta.",
    connection: { live: "En vivo", reconnecting: "Reconectando…", offline: "Sin conexión" },
    locked: { title: "Esta página pide el token del tablero", body: "Lo tiene quien administra el sitio (MONITOR_DASHBOARD_TOKEN).", label: "Token del tablero", submit: "Abrir", wrong: "Ese token no es válido." },
    unconfigured: { title: "El monitor no está configurado", body: "Define MONITOR_DASHBOARD_TOKEN y MONITOR_INGEST_SECRET en este sitio, y MONITOR_WEB_URL y MONITOR_WEB_SECRET en el backend. Un backend de mainnet tiene su propio par: MONITOR_INGEST_SECRET_MAINNET aquí y MONITOR_WEB_SECRET_MAINNET allá." },
    empty: { title: "Todavía no llegó nada", body: "Ningún backend entregó eventos desde que arrancó este servidor. Revisa MONITOR_WEB_URL en el backend y el secreto compartido." },
    failed: "No se pudo cargar el monitor.",
    retry: "Reintentar",
    status: { ok: "Bien", warning: "Atención", error: "Error", unknown: "Sin datos" },
    alerts: { title: "Alertas activas", none: "Sin alertas activas.", since: "desde", action: "Qué hacer" },
    origin: { title: "Backend", lastDelivery: "Última entrega", snapshot: "Recursos al", noSnapshot: "Aún no hay foto de recursos.", lag: "eventos por llegar", upToDate: "Al día" },
    env: { testnet: "Testnet · fondos de prueba", mainnet: "Mainnet · fondos reales", filter: "Entorno", all: "Todos" },
    tiles: {
      vault: "Saldo del vault",
      vaultNone: "Sin vault configurado",
      pending: "comprometido en desembolsos en curso",
      availableToday: "disponible del límite de hoy",
      maxPerPayout: "tope por desembolso",
      paused: "En pausa",
      relayerGas: "gas",
      relayerDown: "El relayer no responde",
      memory: "Memoria",
      cpu: "CPU",
      loopDelay: "Retraso del event loop (p99)",
      uptime: "Tiempo en marcha",
      database: "Base de datos",
      payments: "Pagos crosschain",
      payouts: "Desembolsos del vault",
      qr: "Códigos QR",
      inFlight: "en curso",
      settled: "terminados",
      pendingCallbacks: "avisos pendientes",
      events: "Eventos en el registro",
    },
    feed: {
      title: "Eventos",
      count: (shown, total) => `${shown} de ${total}`,
      category: "Categoría",
      all: "Todas, sin fotos de recursos",
      severity: "Severidad",
      severityAll: "Todas",
      severityWarning: "Atención y errores",
      severityError: "Solo errores",
      search: "Buscar",
      time: "Hora",
      event: "Evento",
      subject: "Sobre",
      meaning: "Qué significa",
      data: "Datos",
      none: "Ningún evento coincide.",
    },
    signOut: "Cerrar sesión",
  },
};
