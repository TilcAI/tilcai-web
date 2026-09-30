import type { Copy } from "@/lib/i18n";
import { Icon, type IconName } from "../Icon";
import { SectionHead, StageTag } from "./shared";

const capIcons: IconName[] = ["tree", "rules", "signal", "receipt", "pen", "store"];

export function CapabilitiesSection({ t }: { t: Copy }) {
  return (
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
  );
}
