import Image from "next/image";
import Link from "next/link";
import type { Copy } from "@/lib/i18n";
import { otherLocale, paths } from "@/lib/site";

export function SiteFooter({ t, page }: { t: Copy; page: "home" | "docs" | "roadmap" }) {
  const other = otherLocale(t.locale);
  const otherHref = page === "home" ? paths.home(other) : page === "docs" ? paths.docs(other) : paths.roadmap(other);
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Image src="/brand/tilcai-logo.webp" width={360} height={138} alt="TilcAI" sizes="74px" />
          <p>{t.footer.status}</p>
        </div>
        <nav className="footer-nav" aria-label={t.a11y.footerNav}>
          <Link href={paths.home(t.locale)}>{t.nav.home}</Link>
          <Link href={paths.roadmap(t.locale)}>{t.nav.roadmap}</Link>
          <Link href={paths.docs(t.locale)}>{t.nav.docs}</Link>
          <Link href={otherHref} hrefLang={other} lang={other}>
            {other === "es" ? "Español" : "English"}
          </Link>
        </nav>
        <div className="footer-meta">
          <span>{t.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}
