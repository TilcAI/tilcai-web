import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { paths } from "./site";

export function pageMetadata({
  lang,
  page,
  title,
  description,
}: {
  lang: Locale;
  page: "home" | "docs";
  title: string;
  description: string;
}): Metadata {
  const url = paths[page](lang);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { en: paths[page]("en"), es: paths[page]("es") },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      locale: lang === "en" ? "en_US" : "es_BO",
      images: [{ url: "/brand/og-image.png", width: 1200, height: 630, alt: "TilcAI" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/brand/og-image.png"] },
  };
}
