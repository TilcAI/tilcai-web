import type { Copy } from "./types";
import { getDocsSections } from "../content/docs-content.ts";

export const docsEs: Copy["docs"] = {
  status: "Mainnet probado · en desarrollo",
  title: "Construye con TilcAI.",
  lead: "Integra agentes, aplicaciones y pagos sobre Stellar. Guías prácticas, arquitectura y evidencia para construir con claridad.",
  breadcrumb: "Ruta de navegación",
  meta: [
    { label: "Actualizada", value: "20 de octubre de 2026" },
    { label: "Entornos", value: "Testnet / Mainnet" },
    { label: "Estado", value: "Sin auditoría independiente" },
  ],
  pathsTitle: "Empieza a construir",
  paths: [
    { id: "quickstart", title: "Inicio rápido", text: "Conecta y descubre tus rutas." },
    { id: "sdk", title: "SDK · TypeScript", text: "Integra tu aplicación." },
    { id: "mcp", title: "MCP para agentes", text: "Conecta tu asistente." },
  ],
  tocTitle: "Documentación",
  groups: { overview: "Primeros pasos", integrate: "Integrar", design: "Conceptos", payments: "Pagos y redes", reference: "Recursos" },
  sections: getDocsSections("es"),
};
