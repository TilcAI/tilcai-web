import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Copy } from "@/lib/i18n";
import { solutions, type SolutionStatus } from "@/lib/i18n/solutions";
import { paths } from "@/lib/site";
import { Icon } from "../Icon";
import { OptipagosShowcase } from "./OptipagosShowcase";
import styles from "./SolutionsSection.module.css";

/** The folder and one of the files have a space, hence the %20. */
const DIR = "/assets/img/logos%20empresas/";
const src = (file: string) => DIR + encodeURIComponent(file);
export const solutionAssets = {
  optipagos: { file: "optipago_logo_vec.svg", width: 156, height: 155 },
  /** A real capture of the Optipagos WhatsApp chat (720 × 1612). */
  phone: { file: "pago optipago.jpg", width: 720, height: 1612 },
  baral: { file: "baral.webp", width: 1080, height: 1080 },
} as const;

function Status({ kind, label }: { kind: SolutionStatus; label: string }) {
  return (
    <span className={`${styles.status} ${kind === "implementing" ? styles.implementing : styles.next}`}>
      <span className={styles.dot} aria-hidden="true" />
      {label}
    </span>
  );
}

/**
 * "Soluciones para empresas", below "Empresas": who is already implementing TilcAI (Optipagos) and who is next (Baral).
 * A server component. Its one client piece is the Optipagos showcase: the real capture of the chat inside a phone, with the
 * two steps that spotlight the part of the capture they describe.
 */
export function SolutionsSection({ t }: { t: Copy }) {
  const c = solutions(t.locale);
  const optipagos = solutionAssets.optipagos;
  const baral = solutionAssets.baral;
  const phone = solutionAssets.phone;
  const index = (n: number) => ({ "--i": n }) as CSSProperties;

  return (
    <section id="solutions" className={styles.root} aria-labelledby="solutions-title">
      <div className={styles.inner}>
        <header className={`${styles.head} reveal`}>
          <div>
            <p className={styles.eyebrow}>{c.eyebrow}</p>
            <h2 id="solutions-title" className={styles.title}>{c.title}</h2>
          </div>
          <p className={styles.lead}>{c.lead}</p>
        </header>

        <div className={styles.grid}>
          <article className={`${styles.card} ${styles.featured} reveal`} style={index(0)} aria-labelledby="solution-optipagos">
            <div className={styles.cardHead}>
              <span className={styles.brand}>
                <Image className={styles.glyph} src={src(optipagos.file)} width={optipagos.width} height={optipagos.height} alt="" />
                <span className={styles.wordmark}>{c.optipagos.name}</span>
              </span>
              <Status kind="implementing" label={c.status.implementing} />
            </div>

            <OptipagosShowcase
              kicker={c.optipagos.kicker}
              title={c.optipagos.title}
              body={c.optipagos.body}
              route={c.optipagos.route}
              stepsLabel={c.optipagos.stepsLabel}
              stepsHint={c.optipagos.stepsHint}
              steps={c.optipagos.steps}
              phone={c.optipagos.phone}
              image={{ src: src(phone.file), width: phone.width, height: phone.height }}
            />
          </article>

          <article className={`${styles.card} ${styles.upcoming} reveal`} style={index(1)} aria-labelledby="solution-baral">
            <div className={styles.cardHead}>
              <span className={styles.logoBox}>
                <Image className={styles.baralLogo} src={src(baral.file)} width={baral.width} height={baral.height} alt={c.baral.logoAlt} sizes="(min-width: 1000px) 320px, 70vw" />
              </span>
              <Status kind="next" label={c.status.next} />
            </div>
            <p className={styles.kicker}>{c.baral.kicker}</p>
            <h3 id="solution-baral">{c.baral.title}</h3>
            <p className={styles.body}>{c.baral.body}</p>
            <div className={styles.journey}>
              <p className={styles.journeyLabel}>{c.baral.journey.label}</p>
              <ol className={styles.journeySteps}>
                {c.baral.journey.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
            <p className={styles.scope}><span>{c.baral.scopeLabel}</span>{c.baral.scope}</p>
          </article>

          <aside className={`${styles.invite} reveal`} style={index(2)} aria-labelledby="solution-invite">
            <span className={styles.inviteIcon} aria-hidden="true"><Icon name="store" /></span>
            <h3 id="solution-invite">{c.invite.title}</h3>
            <p>{c.invite.body}</p>
            <Link className={styles.action} href={`${paths.docs(t.locale)}#business`}>
              {c.invite.link}
              <Icon name="arrow" />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
