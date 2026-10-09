import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { RoadmapPage } from "@/components/RoadmapPage";
import { getCopy, isLocale, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ lang: string }> };

async function locale(params: Props["params"]): Promise<Locale> {
  const { lang } = await params;
  return isLocale(lang) ? lang : "en";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await locale(params);
  const t = getCopy(lang);
  return pageMetadata({
    lang,
    page: "roadmap",
    title: `${t.roadmap.eyebrow} · ${t.roadmap.title} — TilcAI`,
    description: t.roadmap.lead,
  });
}

export default async function Page({ params }: Props) {
  const t = getCopy(await locale(params));
  return (
    <PageShell t={t} page="roadmap">
      <RoadmapPage t={t} />
    </PageShell>
  );
}
