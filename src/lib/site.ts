import type { Locale } from "./i18n";

/** The public canonical host. Deployment and preview URLs must not enter search metadata. */
export const siteUrl = "https://www.tilcai.com";

export const paths = {
  home: (lang: Locale) => `/${lang}`,
  docs: (lang: Locale) => `/${lang}/docs`,
  roadmap: (lang: Locale) => `/${lang}/roadmap`,
  monitor: (lang: Locale) => `/${lang}/monitor`,
  section: (lang: Locale, id: string) => `/${lang}#${id}`,
};

/** The team's public channels, shown in the footer. */
export const contact = {
  xUrl: "https://x.com/tilcai_ai",
  xHandle: "@tilcai_ai",
  email: "tilcai.ai@gmail.com",
  telegramUrl: "https://t.me/+CfbYnvPNXTo2OGMx",
  telegramName: "Telegram",
} as const;

export const otherLocale = (lang: Locale): Locale => (lang === "en" ? "es" : "en");
