import Link from "next/link";
import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { Icon, type IconName } from "../Icon";
import styles from "./Narrative.module.css";

const icons: IconName[] = ["rules", "shield", "lock"];

export function ControlSection({ t }: { t: Copy }) {
  const c = narrative(t.locale).control;
  const { control } = t;
  return (
    <section id="control" className={styles.section} aria-labelledby="control-title">
      <div className={`${styles.inner} ${styles.split}`}>
        <div>
          <p className={styles.eyebrow}>{control.eyebrow}</p>
          <h2 id="control-title" className={styles.heading}>{c.title}</h2>
          <p className={styles.lead}>{c.lead}</p>
          <ul className={styles.rules}>
            {control.panels.map((panel, index) => <li key={panel.title}><Icon name={icons[index]} /><div><h3>{panel.title}</h3><p>{panel.body}</p></div></li>)}
          </ul>
          <p className={styles.note}>{control.account.body}</p>
          <Link href={`/${t.locale}/docs#limits`} className={styles.link}>{c.docs}<Icon name="arrow" /></Link>
        </div>
        <div>
          <div className={styles.permit}>
            <div className={styles.permitTop}><span>{c.review}</span><Icon name="shield" /></div>
            <p className={styles.amount}>30 <small>/ 50 USDC</small></p>
            <div className={styles.meter} role="meter" aria-label={control.budget.meterLabel} aria-valuemin={0} aria-valuemax={50} aria-valuenow={30}><span /></div>
            <dl className={styles.fields}>
              <div><dt>{c.recipient}</dt><dd>{c.recipientValue}</dd></div>
              <div><dt>{c.expiry}</dt><dd>{c.expiryValue}</dd></div>
              <div><dt>{control.permission.fields[0].label}</dt><dd>{control.permission.fields[0].value}</dd></div>
              <div><dt>{control.permission.fields[3].label}</dt><dd className={styles.status}>{control.permission.fields[3].value}</dd></div>
            </dl>
            <p className={styles.note}>{control.permission.stopLabel}</p>
            <ul className={styles.stop}>{control.permission.stopConditions.map(condition => <li key={condition}>{condition}</li>)}</ul>
          </div>
          <p className={styles.caption}>{control.example.label}</p>
          <p className={styles.note}>{control.note}</p>
        </div>
      </div>
    </section>
  );
}
