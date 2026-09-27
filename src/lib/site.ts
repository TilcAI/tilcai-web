import type { Locale } from "./i18n";

/** Public URL used for absolute metadata (Open Graph, alternates). Override in .env.local. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const paths = {
  home: (lang: Locale) => `/${lang}`,
  docs: (lang: Locale) => `/${lang}/docs`,
  section: (lang: Locale, id: string) => `/${lang}#${id}`,
};

export const otherLocale = (lang: Locale): Locale => (lang === "en" ? "es" : "en");
