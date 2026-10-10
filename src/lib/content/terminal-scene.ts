import type { Locale } from "../i18n/types";

/**
 * What the illustrative terminal of a terminal client says while it plays. It is an illustration of how a TilcAI session is
 * meant to go (find, quote, ask a person), never a live connection: the integrations are in preparation, and the window
 * says so on its own title bar. The verbs are the ones the MCP entrance already names; the request and the amount are the
 * cinema case of the policy simulation.
 */
export interface TerminalScene {
  badge: string;
  prompt: string;
  tools: { label: string; detail?: string }[];
  waiting: string;
}

const copy = {
  es: { badge: "Ilustración · sin conexión", tools: ["Buscar un servicio", "Pedir una cotización", "Solicitar aprobación"], waiting: "Esperando aprobación humana" },
  en: { badge: "Illustration · not connected", tools: ["Find a service", "Ask for a quote", "Request approval"], waiting: "Waiting for human approval" },
} as const;

export function terminalScene(locale: Locale, request: string, quote: string): TerminalScene {
  const c = copy[locale];
  return {
    badge: c.badge,
    prompt: request,
    tools: [{ label: c.tools[0] }, { label: c.tools[1], detail: quote }, { label: c.tools[2] }],
    waiting: c.waiting,
  };
}
