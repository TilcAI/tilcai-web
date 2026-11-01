import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPage } from "@/components/DocsPage";
import { PageShell } from "@/components/PageShell";
import { getCopy, isLocale, locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";

export const dynamicParams = false;
type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap(lang => getCopy(lang).docs.sections.map(s => ({ lang, slug: s.id })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const section = getCopy(lang).docs.sections.find(s => s.id === slug);
  if (!section) return {};
  const description = section.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
  return { title: section.title + " | TilcAI Docs", description, alternates: {
    canonical: new URL("/" + lang + "/docs/" + slug, siteUrl).href,
    languages: Object.fromEntries(locales.map(l => [l, new URL("/" + l + "/docs/" + slug, siteUrl).href])),
  }};
}

export default async function Page({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const t = getCopy(lang);
  if (!t.docs.sections.some(s => s.id === slug)) notFound();
  return <PageShell t={t} page="docs"><DocsPage t={t} slug={slug} /></PageShell>;
}

