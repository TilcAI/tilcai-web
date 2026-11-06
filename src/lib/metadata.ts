import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { paths, siteUrl } from "./site";

type LocalizedPath = (locale: Locale) => string;

export function localizedPageMetadata({
  lang,
  title,
  description,
  pathForLocale,
}: {
  lang: Locale;
  title: string;
  description: string;
  pathForLocale: LocalizedPath;
}): Metadata {
  const url = new URL(pathForLocale(lang), siteUrl).href;
  const englishUrl = new URL(pathForLocale("en"), siteUrl).href;
  const spanishUrl = new URL(pathForLocale("es"), siteUrl).href;
  const imageUrl = new URL("/brand/og-image.png", siteUrl).href;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { en: englishUrl, es: spanishUrl, "x-default": englishUrl },
    },
    openGraph: {
      type: "website",
      siteName: "TilcAI",
      title,
      description,
      url,
      locale: lang === "en" ? "en_US" : "es_BO",
      alternateLocale: lang === "en" ? ["es_BO"] : ["en_US"],
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "TilcAI" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [imageUrl] },
  };
}

export function pageMetadata({
  lang,
  page,
  title,
  description,
}: {
  lang: Locale;
  page: "home" | "docs" | "roadmap";
  title: string;
  description: string;
}): Metadata {
  return localizedPageMetadata({ lang, title, description, pathForLocale: paths[page] });
}
