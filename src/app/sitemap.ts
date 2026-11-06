import type { MetadataRoute } from "next";
import { getCopy, locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";

/** Only public, indexable routes. Both language versions share the same doc IDs. */
export default function sitemap(): MetadataRoute.Sitemap {
  const docIds = getCopy("en").docs.sections.map((section) => section.id);
  const routes = ["", "/docs", "/roadmap", ...docIds.map((id) => `/docs/${id}`)];

  return routes.flatMap((route) => {
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
}
