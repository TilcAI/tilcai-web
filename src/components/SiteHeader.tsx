import type { Copy } from "@/lib/i18n";
import { SiteHeaderBar, type HeaderPage } from "./SiteHeaderBar";

/**
 * The one site header, for every page. This server seam hands the client bar only the labels it draws:
 * props of a client component travel to the browser, and the whole page copy is not the header's business.
 */
export function SiteHeader({ t, page }: { t: Copy; page: HeaderPage }) {
  return <SiteHeaderBar t={{ locale: t.locale, nav: t.nav, a11y: t.a11y }} page={page} />;
}
