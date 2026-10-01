import type { Copy } from "@/lib/i18n";
import { Icon, type IconName } from "../Icon";
import { SectionHead } from "./shared";
import styles from "./ControlSection.module.css";

const panelIcons: IconName[] = ["rules", "shield", "lock"];

export function ControlSection({ t }: { t: Copy }) {
  const { control } = t;

  return (
    <section id="control" className="section section-alt" aria-labelledby="control-title">
      <div className="container">
        <SectionHead
          id="control-title"
          eyebrow={control.eyebrow}
          title={control.title}
          lead={control.lead}
        />

        <ul className="grid grid-3" role="list">
          {control.panels.map((panel, index) => (
            <li key={panel.title} className={`card reveal ${styles.panel}`}>
              <Icon name={panelIcons[index]} className="icon icon-card" />
              <h3>{panel.title}</h3>
              <p>{panel.body}</p>
            </li>
          ))}
        </ul>

        <div className={`reveal ${styles.example}`} role="group" aria-labelledby="control-example-label">
          <p id="control-example-label" className={styles.exampleLabel}>{control.example.label}</p>
          <div className={styles.exampleGrid}>
            <section className={styles.budget} aria-labelledby="control-budget-title">
              <div className={styles.visualHead}>
                <h3 id="control-budget-title">{control.budget.title}</h3>
                <Icon name="rules" className={styles.visualIcon} />
              </div>
              <dl className={styles.budgetValues}>
                <div>
                  <dt>{control.budget.limitLabel}</dt>
                  <dd>{control.budget.limitValue}</dd>
                </div>
                <div>
                  <dt>{control.budget.exampleLabel}</dt>
                  <dd>{control.budget.exampleValue}</dd>
                </div>
              </dl>
              <div
                className={styles.meter}
                role="meter"
                aria-label={control.budget.meterLabel}
                aria-valuemin={0}
                aria-valuemax={50}
                aria-valuenow={30}
                aria-valuetext={control.budget.exampleValue}
              >
                <span />
              </div>
            </section>

            <section className={styles.permission} aria-labelledby="control-permission-title">
              <div className={styles.visualHead}>
                <h3 id="control-permission-title">{control.permission.title}</h3>
                <Icon name="shield" className={styles.visualIcon} />
              </div>
              <dl className={styles.permissionFields}>
                {control.permission.fields.map((field) => (
                  <div key={field.label}>
                    <dt>{field.label}</dt>
                    <dd>{field.value}</dd>
                  </div>
                ))}
              </dl>
              <div className={styles.stopConditions}>
                <h4>{control.permission.stopLabel}</h4>
                <ul>
                  {control.permission.stopConditions.map((condition) => (
                    <li key={condition}>{condition}</li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>

        <aside className={`reveal ${styles.explainer}`} aria-labelledby="control-account-title">
          <div className={styles.explainerIntro}>
            <Icon name="lock" className={styles.explainerIcon} />
            <div>
              <h3 id="control-account-title">{control.account.title}</h3>
              <p>{control.account.body}</p>
            </div>
          </div>
          <div className={styles.stageGrid}>
            <section className={styles.stageCurrent} aria-labelledby="control-current-title">
              <h4 id="control-current-title">{control.account.current.title}</h4>
              <span>{control.account.current.body}</span>
            </section>
            <section className={styles.stageFuture} aria-labelledby="control-future-title">
              <h4 id="control-future-title">{control.account.future.title}</h4>
              <span>{control.account.future.body}</span>
            </section>
          </div>
          <p className={styles.note}>{control.note}</p>
        </aside>
      </div>
    </section>
  );
}
