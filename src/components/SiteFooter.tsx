import Image from "next/image";
import Link from "next/link";
import type { Copy } from "@/lib/i18n";
import { otherLocale, paths } from "@/lib/site";

export function SiteFooter({ t, page }: { t: Copy; page: "home" | "docs" }) {
  const other = otherLocale(t.locale);
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Image src="/brand/tilcai-logo.webp" width={360} height={138} alt="TilcAI" sizes="74px" />
          <p>{t.footer.status}</p>
        </div>
        <nav className="footer-nav" aria-label={t.a11y.footerNav}>
          <Link href={paths.home(t.locale)}>{t.nav.home}</Link>
          <Link href={paths.docs(t.locale)}>{t.nav.docs}</Link>
          <Link href={page === "home" ? paths.home(other) : paths.docs(other)} hrefLang={other} lang={other}>
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
