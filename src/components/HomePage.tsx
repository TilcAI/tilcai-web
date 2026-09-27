import Image from "next/image";
import Link from "next/link";
import type { Copy } from "@/lib/i18n";
import type { FlowStep, Stage } from "@/lib/i18n/types";
import { json } from "@/lib/highlight";
import { snippets } from "@/lib/snippets";
import { paths } from "@/lib/site";
import { CodeTabs } from "./CodeTabs";
import { Icon, type IconName } from "./Icon";
import { PolicyDemo } from "./PolicyDemo";

const problemIcons: IconName[] = ["layers", "target", "shield", "receipt"];
const capIcons: IconName[] = ["tree", "rules", "signal", "receipt", "pen", "store"];

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

export function HomePage({ t }: { t: Copy }) {
  const docs = paths.docs(t.locale);
  const code = snippets(t.locale);

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
            <h1 id="hero-title">{t.hero.title}</h1>
            <p className="lead">{t.hero.lead}</p>
            <div className="cta-row">
              <Link className="btn btn-primary" href={docs}>
                {t.hero.ctaPrimary}
                <Icon name="arrow" />
              </Link>
              <a className="btn btn-ghost" href="#flow">
                {t.hero.ctaSecondary}
              </a>
            </div>
            <ul className="facts" role="list">
              {t.hero.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <figure className="hero-logo reveal">
            <div className="logo-card">
              <Image
                src="/assets/tilcai-logo@2x.webp"
                width={1280}
                height={887}
                sizes="(min-width: 960px) 440px, 80vw"
                alt={t.hero.logoAlt}
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <figcaption className="vision-note">{t.hero.visionNote}</figcaption>
          </figure>
        </div>
      </section>

      {/* 2. Problem */}
      <section id="problem" className="section" aria-labelledby="problem-title">
        <div className="container">
          <SectionHead id="problem-title" eyebrow={t.problem.eyebrow} title={t.problem.title} lead={t.problem.lead} />
          <ul className="grid grid-4" role="list">
            {t.problem.cards.map((c, i) => (
              <li className="card reveal" key={c.title}>
                <Icon name={problemIcons[i]} className="icon icon-card" />
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </li>
            ))}
          </ul>
          <blockquote className="question reveal">
            <p>{t.problem.question}</p>
          </blockquote>
        </div>
      </section>

      {/* 3. Flow */}
      <section id="flow" className="section section-alt" aria-labelledby="flow-title">
        <div className="container">
          <SectionHead id="flow-title" eyebrow={t.flow.eyebrow} title={t.flow.title} lead={t.flow.lead} />
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

      {/* 5. Proposed interface */}
      <section id="interface" className="section section-alt" aria-labelledby="code-title">
        <div className="container code-grid">
          <header className="section-head reveal">
            <p className="eyebrow">{t.code.eyebrow}</p>
            <h2 id="code-title">{t.code.title}</h2>
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
      </section>

      {/* 6. Comparison */}
      <section id="compare" className="section" aria-labelledby="cmp-title">
        <div className="container">
          <SectionHead id="cmp-title" eyebrow={t.compare.eyebrow} title={t.compare.title} lead={t.compare.lead} />
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
        </div>
      </section>

      {/* 7. Stack */}
      <section id="stack" className="section section-alt" aria-labelledby="stack-title">
        <div className="container">
          <SectionHead id="stack-title" eyebrow={t.stack.eyebrow} title={t.stack.title} lead={t.stack.lead} />
          <ul className="badges reveal" role="list">
            {t.stack.badges.map((b) => (
              <li className="badge" key={b.name}>
                <span className="badge-name">{b.name}</span>
                <span className="badge-role">{b.role}</span>
              </li>
            ))}
          </ul>
          <p className="disclaimer reveal">{t.stack.disclaimer}</p>
        </div>
      </section>

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

      {/* 10. Final CTA */}
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
              <a className="btn btn-ghost" href="#flow">
                {t.cta.secondary}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
