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

        <ol className={styles.controlRail}>
          {control.panels.map((panel, index) => (
            <li key={panel.title} className={`reveal ${styles.panel}`}>
              <span className={styles.railNumber} aria-hidden="true">0{index + 1}</span>
              <Icon name={panelIcons[index]} className="icon icon-card" />
              <div>
                <h3>{panel.title}</h3>
                <p>{panel.body}</p>
              </div>
            </li>
          ))}
        </ol>

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
                {control.permission.fields.map((field, index) => (
                  <div key={field.label} className={index === control.permission.fields.length - 1 ? styles.statusField : undefined}>
                    <dt>{field.label}</dt>
                    <dd>
                      {index === control.permission.fields.length - 1 && <span className={styles.statusDot} aria-hidden="true" />}
                      {field.value}
                    </dd>
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
          <ol className={styles.authorizationFlow}>
            <li className={styles.authorizationStage}>
              <span className={styles.stageNumber} aria-hidden="true">01</span>
              <Icon name="lock" className={styles.explainerIcon} />
              <div>
                <h3 id="control-account-title">{control.account.title}</h3>
                <p>{control.account.body}</p>
              </div>
            </li>
            <li className={`${styles.authorizationStage} ${styles.stageCurrent}`}>
              <span className={styles.stageNumber} aria-hidden="true">02</span>
              <div>
                <h4 id="control-current-title">{control.account.current.title}</h4>
                <span>{control.account.current.body}</span>
              </div>
            </li>
            <li className={`${styles.authorizationStage} ${styles.stageFuture}`}>
              <span className={styles.stageNumber} aria-hidden="true">03</span>
              <div>
                <h4 id="control-future-title">{control.account.future.title}</h4>
                <span>{control.account.future.body}</span>
              </div>
            </li>
          </ol>
          <p className={styles.note}>{control.note}</p>
        </aside>
      </div>
    </section>
  );
}
