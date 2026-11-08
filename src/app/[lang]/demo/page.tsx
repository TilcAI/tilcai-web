import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { BusinessModel } from "@/components/demo/BusinessModel";
import { DemoNav } from "@/components/demo/DemoNav";
import { GoToMarket } from "@/components/demo/GoToMarket";
import { StrategyRoadmap } from "@/components/demo/StrategyRoadmap";
import { strategy } from "@/lib/content/strategy";
import { getCopy, isLocale } from "@/lib/i18n";
import styles from "./demo.module.css";

type Props = { params: Promise<{ lang: string }> };

// youtube-nocookie: no YouTube cookies until the visitor presses play.
const DEMO_VIDEO = "https://www.youtube-nocookie.com/embed/F2DpPsqXMsI?rel=0";

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
  // Business model, GTM and roadmap: src/lib/content/strategy.ts (how to update it: docs/demo-strategy.md).
  const s = strategy[lang];

  return (
    <PageShell t={t} page="demo">
      <section id="video" className={styles.section} aria-labelledby="demo-title">
        <div className={styles.inner}>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h1 id="demo-title" className="sr-only">{copy.title}</h1>
          <p className={styles.description}>{copy.description}</p>
          <div className={styles.player}>
            <iframe
              src={DEMO_VIDEO}
              title={copy.videoTitle}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </section>
      <DemoNav nav={s.nav} />
      <BusinessModel c={s.business} locale={lang} />
      <GoToMarket c={s.gtm} />
      <StrategyRoadmap c={s.roadmap} />
    </PageShell>
  );
}
