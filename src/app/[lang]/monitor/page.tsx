import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MonitorBoard } from "@/components/monitor/MonitorBoard";
import { SiteHeader } from "@/components/SiteHeader";
import { getCopy, isLocale } from "@/lib/i18n";
import { MONITOR_COPY } from "@/lib/monitor/copy";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = MONITOR_COPY[isLocale(lang) ? lang : "en"];
  // An operations page: reachable by its address, not by search engines.
  return { title: `${t.title} · TilcAI`, description: t.lead, robots: { index: false, follow: false } };
}

/**
 * Backend monitor. The page is a static shell; everything it shows is fetched by the browser
 * from this site's own /api/monitor routes, which decide who may read. It carries the site's one header
 * (so the way back to the site and the language switch are the usual ones), and no footer.
 */
export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getCopy(lang);
  return (
    <>
      <a className="skip" href="#main">
        {t.a11y.skip}
      </a>
      <SiteHeader t={t} page="monitor" />
      <main id="main" tabIndex={-1}>
        <MonitorBoard lang={lang} />
      </main>
    </>
  );
}
