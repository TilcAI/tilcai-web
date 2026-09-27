import type { Locale } from "./i18n";

/**
 * Public URL used for absolute metadata (Open Graph, alternates).
 * Order: NEXT_PUBLIC_SITE_URL → Vercel production domain → Vercel deployment URL → localhost.
 * Empty or invalid values are ignored, so a blank env var can never break the build.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];
  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      return new URL(withProtocol).origin;
    } catch {
      // ignore malformed values and try the next one
    }
  }
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

export const paths = {
  home: (lang: Locale) => `/${lang}`,
  docs: (lang: Locale) => `/${lang}/docs`,
  section: (lang: Locale, id: string) => `/${lang}#${id}`,
};

export const otherLocale = (lang: Locale): Locale => (lang === "en" ? "es" : "en");
