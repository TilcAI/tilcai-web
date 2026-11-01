"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/types";
import { Icon } from "../Icon";

export function DocsNetworkDiagram({ locale }: { locale: Locale }) {
  const [env, setEnv] = useState<"testnet" | "mainnet">("mainnet");
  const es = locale === "es";
  return <figure className="docs-network-figure">
    <div className="docs-figure-bar"><span>{es ? "Ruta de USDC" : "USDC route"}</span>
      <div className="docs-environments" role="group" aria-label={es ? "Entorno del diagrama" : "Diagram environment"}>
        {(["testnet", "mainnet"] as const).map(e => <button key={e} aria-pressed={env === e} onClick={() => setEnv(e)}>{e === "mainnet" ? "Mainnet" : "Testnet"}</button>)}
      </div>
    </div>
    <div className="docs-network-graph">
      <div className="docs-network-source">
        <div className="docs-network-node"><img className="docs-network-logo" src="/assets/img/logos%20cripto/avalanche.png" alt="" width="30" height="30" /><strong>{env === "mainnet" ? "Avalanche C-Chain" : "Avalanche Fuji"}</strong><code>{env === "mainnet" ? "43114" : "43113"}</code></div>
        {env === "testnet" && <div className="docs-network-node"><span className="docs-token monad">M</span><strong>Monad Testnet</strong><code>10143</code></div>}
      </div>
      <span className="docs-connector" aria-hidden="true">→</span>
      <div className="docs-network-node docs-network-core"><img src="/brand/tilcai-mark-64.png" alt="" width="36" height="36" /><strong>TilcAI</strong><span>CCTP V2 · Iris</span></div>
      <span className="docs-connector" aria-hidden="true">→</span>
      <div className="docs-network-node"><img className="docs-network-logo" src="/assets/img/logos%20cripto/stellar.png" alt="" width="30" height="30" /><strong>Stellar</strong><span>{env === "mainnet" ? "Public Network" : "Testnet"}</span></div>
    </div>
    <figcaption><span className="docs-live-dot" />{env === "mainnet" ? (es ? "USDC real · gas patrocinado · ruta probada" : "Real USDC · sponsored gas · tested route") : (es ? "Tokens de prueba · fuentes registradas en el backend" : "Test tokens · registered backend sources")}</figcaption>
  </figure>;
}

export function DocsArchitectureDiagram({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const rows = [
    { n: "01", title: es ? "Comunicación" : "Communication", items: ["MCP", "SDK", "HTTP API"], icon: "agent" },
    { n: "02", title: es ? "Autoridad y control" : "Authority and control", items: [es ? "Tenant + políticas" : "Tenant + policies", es ? "Autorización" : "Authorization", es ? "Cotización" : "Quote"], icon: "shield" },
    { n: "03", title: es ? "Ejecución financiera" : "Financial execution", items: ["CCTP / x402", "OZ Relayer", "Stellar / EVM"], icon: "chain" },
  ];
  return <figure className="docs-architecture-figure">
    <div className="docs-figure-bar"><span>{es ? "Planos de la infraestructura" : "Infrastructure planes"}</span><span>TilcAI</span></div>
    <ol>{rows.map(row => <li key={row.n}><span className="docs-plane-icon"><Icon name={row.icon} /></span><div><small>{row.n} / {row.title}</small><div className="docs-plane-items">{row.items.map(item => <span key={item}>{item}</span>)}</div></div></li>)}</ol>
    <figcaption><Icon name="receipt" />SQLite · {es ? "Estados persistidos + worker + conciliación" : "Persisted states + worker + reconciliation"}</figcaption>
  </figure>;
}

