import type { CSSProperties } from "react";
import type { Copy } from "@/lib/i18n";
import { labelTableCells } from "@/lib/docs-html";
import type { DocsGroup } from "@/lib/i18n/types";
import { paths } from "@/lib/site";
import { DocsToc, type DocsTocGroup } from "./DocsToc";
import { Icon } from "./Icon";
import { PageCrumbs } from "./PageCrumbs";
import { InterfaceSection } from "./sections/InterfaceSection";
import { CompareSection } from "./sections/CompareSection";
import "@/app/docs.css";

const GROUP_ORDER: readonly DocsGroup[] = ["overview", "design", "payments", "reference"];

/**
 * Architecture and status page. Section bodies are HTML strings authored in src/lib/i18n/docs.*.ts
 * (trusted repository content, never user input); the classes they use are defined in app/docs.css.
 */
export function DocsPage({ t }: { t: Copy }) {
  const d = t.docs;
  // The two technical sections that follow the article belong to the last group of the index.
  const technical = [
    { id: "interface", title: t.code.eyebrow },
    { id: "compare", title: t.compare.eyebrow },
  ];
  const groups: DocsTocGroup[] = GROUP_ORDER.map((group) => ({
    id: group,
    label: d.groups[group],
    items: [
      ...d.sections.filter((section) => section.group === group).map(({ id, title }) => ({ id, title })),
      ...(group === "reference" ? technical : []),
    ],
  }));

  return (
    <div className="docs-page">
      <div className="docs-hero">
        <div className="container">
          <PageCrumbs label={d.breadcrumb} homeHref={paths.home(t.locale)} homeLabel={t.nav.home} current={t.nav.docs} />
          <p className="status-pill status-warn">
            <span className="dot" aria-hidden="true" />
            {d.status}
          </p>
          <h1>{d.title}</h1>
          <p className="lead">{d.lead}</p>
          <dl className="docs-meta">
            {d.meta.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <nav className="docs-paths" aria-labelledby="docs-paths-title">
            <h2 id="docs-paths-title">{d.pathsTitle}</h2>
            <ol role="list">
              {d.paths.map((path, index) => (
                <li key={path.id} style={{ "--i": index } as CSSProperties}>
                  <a href={`#${path.id}`}>
                    <span className="docs-path-n" aria-hidden="true">
                      {index + 1}
                    </span>
                    <span className="docs-path-text">
                      <span className="docs-path-title">{path.title}</span>
                      <span className="docs-path-lede">{path.text}</span>
                    </span>
                    <Icon name="arrow" className="icon docs-path-arrow" />
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
      <div className="container docs-layout">
        <DocsToc groups={groups} title={d.tocTitle} />
        <article className="prose">
          {d.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`h-${section.id}`}>
              <h2 id={`h-${section.id}`}>
                <a className="anchor" href={`#${section.id}`}>
                  {section.title}
                </a>
              </h2>
              <div dangerouslySetInnerHTML={{ __html: labelTableCells(section.html) }} />
            </section>
          ))}
        </article>
      </div>
      <InterfaceSection t={t} />
      <CompareSection t={t} />
    </div>
  );
}
