import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MonitorBoard } from "@/components/monitor/MonitorBoard";
import { isLocale } from "@/lib/i18n";
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
 * from this site's own /api/monitor routes, which decide who may read.
 */
export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <main id="main" tabIndex={-1}>
      <MonitorBoard lang={lang} />
    </main>
  );
}
