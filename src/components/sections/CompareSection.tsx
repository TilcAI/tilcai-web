import type { Copy } from "@/lib/i18n";
import { Icon } from "../Icon";
import { TechnicalSection } from "./shared";

export function CompareSection({ t }: { t: Copy }) {
  return (
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
  );
}
