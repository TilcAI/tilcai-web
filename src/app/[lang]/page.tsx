import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
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
  return pageMetadata({ lang, page: "home", title: t.meta.title, description: t.meta.description });
}

export default async function Page({ params }: Props) {
  const t = getCopy(await locale(params));
  return (
    <PageShell t={t} page="home">
      <HomePage t={t} />
    </PageShell>
  );
}
