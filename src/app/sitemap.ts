import type { MetadataRoute } from "next";
import { getCopy, locales } from "@/lib/i18n";
import { paths, siteUrl } from "@/lib/site";

/** Only public, indexable routes. Both language versions share the same doc IDs. */
export default function sitemap(): MetadataRoute.Sitemap {
  const docIds = getCopy("en").docs.sections.map((section) => section.id);
  const routes = ["", "/docs", "/roadmap", ...docIds.map((id) => `/docs/${id}`)];

  const localizedRoutes = routes.flatMap((route) => {
    const languages = {
      en: `${siteUrl}/en${route}`,
      es: `${siteUrl}/es${route}`,
      "x-default": `${siteUrl}/en${route}`,
    };
    return locales.map((locale) => ({
      url: languages[locale],
      alternates: { languages },
    }));
  });
  const allyLanguages = {
    en: `${siteUrl}${paths.allies("en")}`,
    es: `${siteUrl}${paths.allies("es")}`,
    "x-default": `${siteUrl}${paths.allies("en")}`,
  };
  return [...localizedRoutes, ...locales.map((locale) => ({
    url: allyLanguages[locale],
    alternates: { languages: allyLanguages },
  }))];
}
