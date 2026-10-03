import type { Copy } from "@/lib/i18n";
import { paths } from "@/lib/site";
import { DocsToc } from "./DocsToc";
import { InterfaceSection } from "./sections/InterfaceSection";
import { CompareSection } from "./sections/CompareSection";

/**
 * Proposed-architecture page. Section bodies are HTML strings authored in
 * src/lib/i18n/docs.*.ts (trusted repository content, never user input).
 */
export function DocsPage({ t }: { t: Copy }) {
  const d = t.docs;
  return (
    <>
      <div className="docs-hero">
        <div className="container">
          <p className="status-pill status-warn">
            <span className="dot" aria-hidden="true" />
            {d.status}
          </p>
          <h1>{d.title}</h1>
          <p className="lead">{d.lead}</p>
        </div>
      </div>
      <div className="container docs-layout">
        <DocsToc
          items={[
            ...d.sections.map(({ id, title }) => ({ id, title })),
            { id: "interface", title: t.code.eyebrow },
            { id: "compare", title: t.compare.eyebrow },
          ]}
          title={d.tocTitle}
          backHref={paths.home(t.locale)}
          backLabel={d.backHome}
        />
        <article className="prose">
          {d.sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`h-${s.id}`}>
              <h2 id={`h-${s.id}`}>
                <a className="anchor" href={`#${s.id}`} aria-hidden="true" tabIndex={-1}>
                  #
                </a>
                {s.title}
              </h2>
              <div dangerouslySetInnerHTML={{ __html: s.html }} />
            </section>
          ))}
        </article>
      </div>
      <InterfaceSection t={t} />
      <CompareSection t={t} />
    </>
  );
}
