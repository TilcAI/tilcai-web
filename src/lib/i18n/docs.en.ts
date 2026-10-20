import type { Copy } from "./types";
import { getDocsSections } from "../content/docs-content.ts";

export const docsEn: Copy["docs"] = {
  status: "Mainnet tested · in development",
  title: "Build with TilcAI.",
  lead: "Connect agents, applications and payments on Stellar. Practical guides, architecture and evidence to build with clarity.",
  breadcrumb: "Breadcrumb",
  meta: [
    { label: "Updated", value: "20 October 2026" },
    { label: "Environments", value: "Testnet / Mainnet" },
    { label: "Status", value: "Not independently audited" },
  ],
  pathsTitle: "Start building",
  paths: [
    { id: "quickstart", title: "Quickstart", text: "Connect and discover your routes." },
    { id: "sdk", title: "SDK · TypeScript", text: "Integrate your application." },
    { id: "mcp", title: "MCP for agents", text: "Connect your assistant." },
  ],
  tocTitle: "Documentation",
  groups: { overview: "Get started", integrate: "Integrate", design: "Concepts", payments: "Payments and networks", reference: "Resources" },
  sections: getDocsSections("en"),
};
