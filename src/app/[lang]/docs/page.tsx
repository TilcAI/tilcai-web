import type { Metadata } from "next";
import { DocsPage } from "@/components/DocsPage";
import { PageShell } from "@/components/PageShell";
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
  return pageMetadata({ lang, page: "docs", title: t.meta.docsTitle, description: t.meta.docsDescription });
}

export default async function Page({ params }: Props) {
  const t = getCopy(await locale(params));
  return (
    <PageShell t={t} page="docs">
      <DocsPage t={t} />
    </PageShell>
  );
}
