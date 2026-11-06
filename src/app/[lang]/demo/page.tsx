import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { getCopy, isLocale } from "@/lib/i18n";
import styles from "./demo.module.css";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = getCopy(lang).demoPage;
  return {
    title: `${copy.title} | TilcAI`,
    description: copy.description,
    robots: { index: false, follow: true },
  };
}

export default async function DemoPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getCopy(lang);
  const copy = t.demoPage;

  return (
    <PageShell t={t} page="demo">
      <section className={styles.section} aria-labelledby="demo-title">
        <div className={styles.inner}>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h1 id="demo-title" className={styles.title}>{copy.title}</h1>
          <p className={styles.description}>{copy.description}</p>
          <span className={styles.status}>{copy.status}</span>
        </div>
      </section>
    </PageShell>
  );
}
