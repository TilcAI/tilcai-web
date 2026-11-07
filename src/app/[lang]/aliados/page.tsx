import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { getCopy, isLocale } from "@/lib/i18n";
import { solutions } from "@/lib/i18n/solutions";
import { localizedPageMetadata } from "@/lib/metadata";
import { paths } from "@/lib/site";
import styles from "./aliados.module.css";

type Props = { params: Promise<{ lang: string }> };
const assets = "/assets/img/logos%20empresas/";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const title = lang === "es" ? "Aliados e implementaciones | TilcAI" : "Partners and implementations | TilcAI";
  const description = lang === "es"
    ? "Conoce a Optipagos y Baral y el estado de sus implementaciones con TilcAI."
    : "Meet Optipagos and Baral and see the status of their TilcAI implementations.";
  return localizedPageMetadata({ lang, title, description, pathForLocale: paths.allies });
}

export default async function AlliesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getCopy(lang);
  const c = solutions(lang);
  const es = lang === "es";

  return (
    <PageShell t={t} page="allies">
      <div className={styles.page}>
        <div className={styles.inner}>
          <header className={styles.intro}>
            <p className={`${styles.eyebrow} reveal`} suppressHydrationWarning><span>TILCAI /</span> {es ? "ALIANZAS" : "PARTNERSHIPS"}</p>
            <h1>
              <span className={`${styles.titleLine} reveal`} suppressHydrationWarning>{es ? "ALIADOS QUE" : "PARTNERS BUILDING"}</span>
              <span className={`${styles.titleLine} ${styles.accent} reveal`} suppressHydrationWarning>{es ? "CONSTRUYEN CON TILCAI." : "WITH TILCAI."}</span>
            </h1>
            <p className={`${styles.textReveal} reveal`} suppressHydrationWarning>{es
              ? "Conoce el estado de cada implementación y cómo TilcAI se conecta a sus pagos."
              : "Explore each implementation and how TilcAI connects to its payments."}</p>
          </header>

          <div className={styles.grid}>
            <article className={`${styles.card} ${styles.optipagos} reveal`} suppressHydrationWarning aria-labelledby="optipagos-title">
              <div className={styles.cardTop}>
                <div className={styles.brand}>
                  <span className={styles.optipagosMark}><Image src={`${assets}optipago_logo_vec.svg`} width={156} height={155} alt="" /></span>
                  <span className={`${styles.textReveal} reveal`} suppressHydrationWarning>{c.optipagos.name}</span>
                </div>
                <span className={`${styles.status} ${styles.textReveal} reveal`} suppressHydrationWarning><span className={styles.statusDot} />{c.status.implementing}</span>
              </div>
              <div className={styles.optipagosBody}>
                <div className={styles.optipagosCopy}>
                  <p className={`${styles.kicker} ${styles.textReveal} reveal`} suppressHydrationWarning>{c.optipagos.kicker}</p>
                  <h2 id="optipagos-title" className={`${styles.textReveal} reveal`} suppressHydrationWarning>{c.optipagos.title}</h2>
                  <p className={`${styles.body} ${styles.textReveal} reveal`} suppressHydrationWarning>{c.optipagos.body}</p>
                  <div className={styles.route}>
                    <h3 className={`${styles.textReveal} reveal`} suppressHydrationWarning>{c.optipagos.route.label}</h3>
                    <ol>
                      {c.optipagos.route.items.map((item, i) => (
                        <li key={item.title} className="reveal" suppressHydrationWarning><span>{String(i + 1).padStart(2, "0")}</span><strong>{item.title}</strong><small>{item.text}</small></li>
                      ))}
                    </ol>
                  </div>
                </div>
                <figure className={styles.phoneFigure}>
                  <div className={styles.phone}><Image src={`${assets}pago%20optipago.jpg`} width={720} height={1612} alt={c.optipagos.phone.alt} sizes="(max-width: 680px) 220px, 150px" /></div>
                  <figcaption className={`${styles.textReveal} reveal`} suppressHydrationWarning>{c.optipagos.phone.caption}</figcaption>
                </figure>
              </div>
            </article>

            <article className={`${styles.card} ${styles.baral} reveal`} suppressHydrationWarning aria-labelledby="baral-title">
              <div className={styles.cardTop}>
                <span className={`${styles.status} ${styles.next} ${styles.textReveal} reveal`} suppressHydrationWarning><span className={styles.statusDot} />{c.status.next}</span>
              </div>
              <div className={styles.baralVisual}>
                <Image src={`${assets}baral.webp`} width={1080} height={1080} alt={c.baral.logoAlt} sizes="(max-width: 680px) 180px, 200px" />
              </div>
              <p className={`${styles.kicker} ${styles.textReveal} reveal`} suppressHydrationWarning>{c.baral.kicker}</p>
              <h2 id="baral-title" className={`${styles.textReveal} reveal`} suppressHydrationWarning>{c.baral.title}</h2>
              <p className={`${styles.body} ${styles.textReveal} reveal`} suppressHydrationWarning>{c.baral.body}</p>
              <p className={`${styles.scope} ${styles.textReveal} reveal`} suppressHydrationWarning><span>{c.baral.scopeLabel}</span>{c.baral.scope}</p>
            </article>
          </div>

          <aside className={`${styles.invite} reveal`} suppressHydrationWarning>
            <div>
              <p className={`${styles.kicker} ${styles.textReveal} reveal`} suppressHydrationWarning>{es ? "SIGUIENTE PASO" : "NEXT STEP"}</p>
              <h2 className={`${styles.textReveal} reveal`} suppressHydrationWarning>{c.invite.title}</h2>
              <p className={`${styles.textReveal} reveal`} suppressHydrationWarning>{c.invite.body}</p>
            </div>
            <Link className={`${styles.textReveal} reveal`} suppressHydrationWarning href={`${paths.docs(lang)}/business`}>{c.invite.link}<span aria-hidden="true">↗</span></Link>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
