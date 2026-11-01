import Link from "next/link";
import Image from "next/image";
import type { Copy } from "@/lib/i18n";
import { prepareDocArticle } from "@/lib/docs-html";
import { DocsNavigation } from "./docs/DocsNavigation";
import { DocsSearch } from "./docs/DocsSearch";
import { DocsArticleTools, DocsLegacyLinks, DocsOnThisPage } from "./docs/DocsArticleTools";
import { DocsArchitectureDiagram, DocsNetworkDiagram } from "./docs/DocsDiagrams";
import { Icon } from "./Icon";
import "@/app/docs.css";

export function DocsPage({ t, slug }: { t: Copy; slug?: string }) {
  const d = t.docs, es = t.locale === "es", root = "/" + t.locale + "/docs";
  const selected = d.sections.find(s => s.id === slug);
  const article = selected ? prepareDocArticle(selected.html, t.locale) : null;
  const index = d.sections.findIndex(s => s.id === slug);
  const previous = index > 0 ? d.sections[index - 1] : null;
  const next = selected ? d.sections[index + 1] : d.sections[1];
  const searchItems = d.sections.map(s => ({ id: s.id, title: s.title, group: d.groups[s.group],
    text: s.html.replace(/<[^>]+>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim() }));
  const titles = (id: string) => d.sections.find(s => s.id === id)?.title ?? id;
  const directory = [
    { title: es ? "Integra a tu manera" : "Integrate your way", ids: ["sdk", "mcp", "api"], icon: "bolt" },
    { title: es ? "Entiende la infraestructura" : "Understand the infrastructure", ids: ["architecture", "accounts", "business"], icon: "layers" },
    { title: es ? "Conoce los rieles" : "Explore the rails", ids: ["rails", "x402", "fiat"], icon: "chain" },
    { title: es ? "Opera con contexto" : "Operate with context", ids: ["mainnet", "monitoring", "limits"], icon: "shield" },
  ];
  return <div className={"docs-page" + (!selected ? " docs-index" : "")}>
    <div className="docs-topbar">
      <div className="docs-topbar-brand"><span>DOCS</span><span className="docs-version">2026.10</span></div>
      <DocsSearch items={searchItems} locale={t.locale} />
      <a className="docs-topbar-github" href="https://github.com/TilcAI" rel="noopener">GitHub <Icon name="upright" /></a>
    </div>
    <div className="docs-workspace">
      <DocsNavigation sections={d.sections.map(({id,title,group}) => ({id,title,group}))} groups={d.groups} active={slug ?? "index"} locale={t.locale} />
      <div className="docs-reading">
        <article className="docs-article" aria-labelledby="docs-title">
          <nav className="docs-breadcrumb" aria-label={d.breadcrumb}>
            <Link href={root}>{es ? "Documentación" : "Documentation"}</Link>
            <span aria-hidden="true">/</span><span>{selected ? d.groups[selected.group] : (es ? "Introducción" : "Introduction")}</span>
          </nav>
          {selected && article ? <>
            <header className="docs-article-header">
              <div className="docs-eyebrow">{d.groups[selected.group]}</div>
              <h1 id="docs-title">{selected.title}</h1>
              <div className="docs-article-meta"><span>{es ? "Revisado el 20 oct 2026" : "Reviewed 20 Oct 2026"}</span><span>·</span><span>{Math.max(2, Math.ceil(searchItems[index].text.split(" ").length / 200))} min</span></div>
            </header>
            {(slug === "rails" || slug === "mainnet") && <DocsNetworkDiagram locale={t.locale} />}
            {slug === "architecture" && <DocsArchitectureDiagram locale={t.locale} />}
            <div className="prose" dangerouslySetInnerHTML={{ __html: article.html }} />
            <DocsArticleTools locale={t.locale} articleId={selected.id} />
            <div className="docs-article-note"><Icon name="signal" /><p>{es ? "La disponibilidad depende de tu instancia. Consulta /health y /v1/routes antes de integrar." : "Availability depends on your instance. Check /health and /v1/routes before integrating."}</p></div>
          </> : <>
            <DocsLegacyLinks ids={d.sections.map(s => s.id)} locale={t.locale} />
            <div className="docs-intro">
              <div className="docs-intro-copy"><p className="docs-eyebrow">{es ? "DOCUMENTACIÓN PARA CONSTRUIR" : "DOCUMENTATION FOR BUILDERS"}</p>
                <h1 id="docs-title">{es ? <>Construye<br />con <span>TilcAI.</span></> : <>Build<br />with <span>TilcAI.</span></>}</h1>
                <p className="docs-intro-lead">{d.lead}</p>
                <Link className="docs-primary" href={root + "/quickstart"}>{es ? "Ir al inicio rápido" : "Start building"}<Icon name="arrow" /></Link>
              </div>
              <div className="docs-intro-art"><Image src="/docs/infrastructure-editorial.webp" alt={es ? "Ilustración conceptual de infraestructura modular con tres planos conectados" : "Conceptual illustration of modular infrastructure with three connected planes"} width={960} height={640} sizes="(max-width: 700px) 90vw, 400px" priority /><span>{es ? "Una infraestructura. Múltiples puntos de entrada." : "One infrastructure. Multiple entry points."}</span></div>
            </div>
            <div className="docs-proof-strip"><span className="docs-live-dot" /><strong>{es ? "Probado en MAINNET" : "Tested on MAINNET"}</strong><span>Avalanche → Stellar · USDC</span><Link href={root + "/mainnet"}>{es ? "Ver evidencia" : "View evidence"}<Icon name="arrow" /></Link></div>
            <section className="docs-entry-section" aria-labelledby="docs-start-title"><div className="docs-section-heading"><h2 id="docs-start-title">{d.pathsTitle}</h2><span>01 / {es ? "CONECTAR" : "CONNECT"}</span></div>
              <div className="docs-entry-grid">{d.paths.map((p,i) => <Link className="docs-entry" key={p.id} href={root + "/" + p.id}>
                <span className="docs-entry-icon"><Icon name={["bolt","doc","agent"][i]} /></span><strong>{p.title}</strong><p>{p.text}</p><Icon name="upright" />
              </Link>)}</div>
            </section>
            <section className="docs-explore" aria-labelledby="docs-explore-title"><div className="docs-section-heading"><h2 id="docs-explore-title">{es ? "De la integración a la operación" : "From integration to operations"}</h2><span>02 / {es ? "EXPLORAR" : "EXPLORE"}</span></div>
              <div className="docs-directory">{directory.map(g => <div className="docs-directory-group" key={g.title}><h3><Icon name={g.icon} />{g.title}</h3>{g.ids.map(id=><Link key={id} href={root + "/" + id}>{titles(id)}<span aria-hidden="true">→</span></Link>)}</div>)}</div>
            </section>
            <DocsNetworkDiagram locale={t.locale} />
            <aside className="docs-status-note"><Icon name="shield" /><div><strong>{es ? "Construye con el estado real del proyecto." : "Build with the project's actual status."}</strong><p>{es ? "Rutas probadas, contratos confirmados por el equipo e integraciones pendientes se documentan por separado. Sin auditoría independiente." : "Tested routes, team-confirmed contracts and pending integrations are documented separately. Not independently audited."}</p><Link href={root + "/status"}>{es ? "Leer estado y alcance →" : "Read status and scope →"}</Link></div></aside>
          </>}
          <nav className="docs-pagination" aria-label={es ? "Continuar leyendo" : "Continue reading"}>
            {previous ? <Link href={root + "/" + previous.id}><small>← {es ? "Anterior" : "Previous"}</small><strong>{previous.title}</strong></Link> : <Link href={root + (selected ? "" : "/status")}><small>{es ? "Explorar" : "Explore"}</small><strong>{selected ? (es ? "Introducción" : "Introduction") : titles("status")}</strong></Link>}
            {next && <Link href={root + "/" + next.id}><small>{es ? "Siguiente" : "Next"} →</small><strong>{next.title}</strong></Link>}
          </nav>
          <div className="docs-bottom"><span>TilcAI Docs · {es ? "20 oct 2026" : "20 Oct 2026"}</span><Link href={root + "/sources"}>{es ? "Fuentes y versiones" : "Sources and versions"} ↗</Link></div>
        </article>
        {selected && article ? <DocsOnThisPage headings={article.headings} locale={t.locale} /> : <aside className="docs-index-aside"><p>{es ? "EN ESTA GUÍA" : "IN THIS GUIDE"}</p><a href="#docs-start-title">{d.pathsTitle}</a><a href="#docs-explore-title">{es ? "Explorar documentación" : "Explore documentation"}</a><hr /><span className="docs-aside-label">{es ? "PAQUETES" : "PACKAGES"}</span><a href="https://www.npmjs.com/package/tilcai-sdk" rel="noopener">tilcai-sdk <code>0.1.0</code></a><a href="https://www.npmjs.com/package/tilcai-mcp" rel="noopener">tilcai-mcp <code>0.2.0</code></a></aside>}
      </div>
    </div>
  </div>;
}
