import Link from "next/link";
import type { ReactNode } from "react";
import type { Copy } from "@/lib/i18n";
import type { FlowStep, Stage } from "@/lib/i18n/types";
import { json } from "@/lib/highlight";
import { snippets } from "@/lib/snippets";
import { paths } from "@/lib/site";
import { CodeTabs } from "./CodeTabs";
import { Icon, type IconName } from "./Icon";
import { PolicyDemo } from "./PolicyDemo";
import { FaqSection } from "./FaqSection";
import { AgentCatalog } from "./AgentCatalog";
import { CommerceScene, FlowLayers } from "./CommerceScene";

const problemIcons: IconName[] = ["target", "rules", "store"];
const capIcons: IconName[] = ["rules", "receipt", "store", "pen", "tree", "layers"];

function StageTag({ t, stage }: { t: Copy; stage: Stage }) {
  return <span className={`tag tag-${stage}`}>{t.stageLabels[stage]}</span>;
}

function SectionHead({ id, eyebrow, title, lead }: { id: string; eyebrow: string; title: string; lead: string }) {
  return (
    <header className="section-head reveal">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      <p className="section-lead">{lead}</p>
    </header>
  );
}

function FlowNode({ step, n }: { step: FlowStep; n: number }) {
  return (
    <li className={`flow-node tone-${step.tone ?? "neutral"}`}>
      <span className="flow-n" aria-hidden="true">
        {String(n).padStart(2, "0")}
      </span>
      <span className="flow-label">{step.label}</span>
      <span className="flow-detail">{step.detail}</span>
    </li>
  );
}

function TechnicalSection({ id, titleId, eyebrow, title, children }: {
  id: string; titleId: string; eyebrow: string; title: string; children: ReactNode;
}) {
  return <section id={id} className="section section-alt technical-section" aria-labelledby={titleId}>
    <div className="container"><details className="technical-disclosure">
      <summary><h2 id={titleId}><span className="eyebrow">{eyebrow}</span><span className="technical-label">{title}</span><span className="technical-toggle" aria-hidden="true">+</span></h2></summary>
      <div className="technical-content">{children}</div>
    </details></div>
  </section>;
}

export function HomePage({ t }: { t: Copy }) {
  const docs = paths.docs(t.locale);
  const code = snippets(t.code.comments);

  return (
    <>
      {/* 1. Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-copy reveal">
            <p className="status-pill">
              <span className="dot" aria-hidden="true" />
              {t.hero.status}
            </p>
            <h1 id="hero-title">{t.hero.title.split(/(?<=\.)\s+/).map((line, index) => <span key={line} className={index === 2 ? "hero-accent" : undefined}>{line} </span>)}</h1>
            <p className="lead">{t.hero.lead}</p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#flow">
                {t.hero.ctaPrimary}
                <Icon name="arrow" />
              </a>
              <a className="btn btn-ghost" href="#capabilities">
                {t.hero.ctaSecondary}
              </a>
            </div>
            <ul className="facts" role="list">
              {t.hero.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <CommerceScene t={t} />
        </div>
      </section>

      {/* Overview; retain the public anchor while the landing evolves. */}
      <section id="problem" className="section" aria-labelledby="problem-title">
        <div className="container">
          <SectionHead id="problem-title" eyebrow={t.problem.eyebrow} title={t.problem.title} lead={t.problem.lead} />
          <ul className="grid grid-3" role="list">
            {t.problem.cards.map((c, i) => (
              <li className="card reveal" key={c.title}>
                <Icon name={problemIcons[i]} className="icon icon-card" />
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </li>
            ))}
          </ul>
          <p className="overview-note reveal">{t.problem.question}</p>
        </div>
      </section>

      {/* 3. Flow */}
      <section id="flow" className="section section-alt" aria-labelledby="flow-title">
        <div className="container">
          <SectionHead id="flow-title" eyebrow={t.flow.eyebrow} title={t.flow.title} lead={t.flow.lead} />
          <div className="flow-composition">
          <div className="flow reveal">
            <ol className="flow-track" role="list">
              {t.flow.steps.map((s, i) => (
                <FlowNode key={s.label} step={s} n={i + 1} />
              ))}
            </ol>
            <div className="flow-decide">
              <span className="flow-n" aria-hidden="true">
                04
              </span>
              <ul className="decisions" role="list">
                {t.flow.decisions.map((d) => (
                  <li key={d.label} className={`decision tone-${d.tone}`}>
                    <code>{d.label}</code>
                    <span>{d.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
            <ol className="flow-track flow-after" role="list" start={5}>
              {t.flow.after.map((s, i) => (
                <FlowNode key={s.label} step={s} n={i + 5} />
              ))}
            </ol>
            <p className="flow-note">
              <Icon name="receipt" />
              {t.flow.receiptNote}
            </p>
          </div>
          <FlowLayers t={t} />
          </div>
          <div className="grid grid-2 scope reveal">
            <div className="scope-card scope-vision">
              <p className="scope-kicker">{t.flow.visionTitle}</p>
              <p>{t.flow.vision}</p>
            </div>
            <div className="scope-card scope-first">
              <p className="scope-kicker">{t.flow.firstCaseTitle}</p>
              <p>{t.flow.firstCase}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual policy simulation; no payment or core-package integration. */}
      <section id="demo" className="section" aria-labelledby="demo-title">
        <div className="container">
          <SectionHead id="demo-title" eyebrow={t.demo.eyebrow} title={t.demo.title} lead={t.demo.lead} />
          <PolicyDemo t={t.demo} />
        </div>
      </section>

      {/* 4. Capabilities */}
      <section id="capabilities" className="section" aria-labelledby="cap-title">
        <div className="container">
          <SectionHead id="cap-title" eyebrow={t.capabilities.eyebrow} title={t.capabilities.title} lead={t.capabilities.lead} />
          <ul className="grid grid-3" role="list">
            {t.capabilities.items.map((c, i) => (
              <li key={c.title} className={`card cap reveal stage-${c.stage}`}>
                <div className="cap-top">
                  <Icon name={capIcons[i]} className="icon icon-card" />
                  <StageTag t={t} stage={c.stage} />
                </div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
                {c.note && <p className="cap-note">{c.note}</p>}
              </li>
            ))}
          </ul>
          <p className="disclaimer reveal">{t.capabilities.disclaimer}</p>
        </div>
      </section>

      <AgentCatalog t={t} />

      {/* 5. Proposed interface */}
      <TechnicalSection id="interface" titleId="code-title" eyebrow={t.code.eyebrow} title={t.code.title}>
        <div className="code-grid">
          <header className="section-head reveal">
            <p className="section-lead">{t.code.lead}</p>
            <ul className="bullets" role="list">
              {t.code.bullets.map((b) => (
                <li key={b}>
                  <Icon name="check" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </header>
          <CodeTabs
            label={t.code.label}
            ariaLabel={t.a11y.codeTabs}
            tabs={t.code.tabs.map((tab) => ({ ...tab, html: json(code[tab.id]) }))}
          />
        </div>
      </TechnicalSection>

      {/* 6. Comparison */}
      <TechnicalSection id="compare" titleId="cmp-title" eyebrow={t.compare.eyebrow} title={t.compare.title}>
          <p className="section-lead technical-lead">{t.compare.lead}</p>
          <div className="table-wrap reveal">
            <table className="compare">
              <thead>
                <tr>
                  <th scope="col">{t.compare.colTopic}</th>
                  <th scope="col">{t.compare.colWallet}</th>
                  <th scope="col" className="col-tilcai">
                    {t.compare.colTilcai}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.compare.rows.map((r) => (
                  <tr key={r.topic}>
                    <th scope="row">{r.topic}</th>
                    <td data-label={t.compare.colWallet}>
                      <span className="cmp cmp-no">
                        <Icon name="x" />
                      </span>
                      {r.walletOnly}
                    </td>
                    <td data-label={t.compare.colTilcai} className="col-tilcai">
                      <span className="cmp cmp-yes">
                        <Icon name="check" />
                      </span>
                      {r.tilcai}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="disclaimer reveal">{t.compare.footnote}</p>
      </TechnicalSection>

      {/* 7. Stack */}
      <TechnicalSection id="stack" titleId="stack-title" eyebrow={t.stack.eyebrow} title={t.stack.title}>
          <p className="section-lead technical-lead">{t.stack.lead}</p>
          <ul className="badges reveal" role="list">
            {t.stack.badges.map((b) => (
              <li className="badge" key={b.name}>
                <span className="badge-name">{b.name}</span>
                <span className="badge-role">{b.role}</span>
              </li>
            ))}
          </ul>
          <p className="disclaimer reveal">{t.stack.disclaimer}</p>
      </TechnicalSection>

      {/* 8. Roadmap */}
      <section id="roadmap" className="section" aria-labelledby="road-title">
        <div className="container">
          <SectionHead id="road-title" eyebrow={t.roadmap.eyebrow} title={t.roadmap.title} lead={t.roadmap.lead} />
          <ol className="timeline" role="list">
            {t.roadmap.stages.map((s, i) => (
              <li key={s.title} className={`stage reveal stage-${s.stage}`}>
                <StageTag t={t} stage={s.stage} />
                <div className="stage-head">
                  <span className="stage-n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <p className="stage-when">{s.when}</p>
                    <h3>{s.title}</h3>
                  </div>
                </div>
                <ul className="stage-items" role="list">
                  {s.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                {s.note && <p className="cap-note">{s.note}</p>}
              </li>
            ))}
          </ol>
          <aside className="signature reveal" aria-labelledby="sig-title">
            <h3 id="sig-title">
              <Icon name="shield" />
              {t.roadmap.signatureTitle}
            </h3>
            <ol className="sig-checks">
              {t.roadmap.signatureChecks.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
            <p className="sig-note">{t.roadmap.signatureNote}</p>
          </aside>
        </div>
      </section>

      <FaqSection t={t.faq} />

      {/* Final CTA */}
      <section className="section cta" aria-labelledby="cta-title">
        <div className="container">
          <div className="cta-card reveal">
            <h2 id="cta-title">{t.cta.title}</h2>
            <p>{t.cta.body}</p>
            <div className="cta-row">
              <Link className="btn btn-primary" href={docs}>
                {t.cta.primary}
                <Icon name="arrow" />
              </Link>
              <a className="btn btn-ghost" href="#demo">
                {t.cta.secondary}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
