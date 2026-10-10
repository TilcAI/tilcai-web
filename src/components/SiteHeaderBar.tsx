"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type AnchorHTMLAttributes } from "react";
import type { Copy, Locale } from "@/lib/i18n";
import { paths } from "@/lib/site";
import { Icon } from "./Icon";
import styles from "./SiteHeader.module.css";

export type HeaderPage = "home" | "docs" | "roadmap" | "monitor";
/** The only labels the bar renders. The server wrapper passes this slice, not the whole page copy. */
export type HeaderCopy = Pick<Copy, "locale" | "nav" | "a11y">;

const subscribeScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

/** `#id` stays a plain anchor (same-page scroll on the home page); anything else is a client navigation. */
function NavLink({ href, ...rest }: { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return href.startsWith("#") ? <a href={href} {...rest} /> : <Link href={href} {...rest} />;
}

export function SiteHeaderBar({ t, page }: { t: HeaderCopy; page: HeaderPage }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const lang = t.locale;

  // Section links are `#id` on the home page and `/{lang}#id` from every other page: same links, same order.
  const anchor = (id: string) => (page === "home" ? `#${id}` : paths.section(lang, id));
  const localeHref = (loc: Locale) =>
    page === "home" ? paths.home(loc) : page === "docs" ? paths.docs(loc) : page === "roadmap" ? paths.roadmap(loc) : paths.monitor(loc);

  useEffect(() => {
    if (!open) return;
    navRef.current?.querySelector<HTMLAnchorElement>("a[href]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    // The panel only exists below the desktop breakpoint: growing the window closes it instead of leaving it stuck.
    const wide = window.matchMedia("(min-width: 1181px)");
    const onWide = () => wide.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  // The bar floats over the page's opening screen until it scrolls, then turns to frosted glass.
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 24, () => false);

  const close = () => setOpen(false);
  const links: [string, string][] = [
    [t.nav.capabilities, anchor("businesses")],
    [t.nav.flow, anchor("flow")],
    [t.nav.rails, anchor("rails")],
    [t.nav.agents, anchor("agents")],
    [t.nav.roadmap, paths.roadmap(lang)],
  ];
  const current = (href: string) => (href === paths.roadmap(lang) && page === "roadmap" ? "page" : undefined);

  return (
    <header className={cx(styles.header, scrolled && styles.scrolled, open && styles.open)}>
      <div className={styles.inner}>
        <Link className={styles.brand} href={paths.home(lang)} aria-label={`TilcAI — ${t.nav.home}`}>
          <Image src="/brand/tilcai-logo@2x.webp" width={720} height={276} alt="" loading="eager" fetchPriority="high" sizes="150px" />
        </Link>

        <nav ref={navRef} className={cx(styles.nav, open && styles.navOpen)} id="main-nav" aria-label={t.a11y.mainNav}>
          {links.map(([label, href]) => (
            <NavLink key={href} href={href} className={styles.link} aria-current={current(href)} onClick={close}>
              {label}
            </NavLink>
          ))}
          <Link
            className={cx(styles.link, styles.docs)}
            href={paths.docs(lang)}
            aria-current={page === "docs" ? "page" : undefined}
            onClick={close}
          >
            <Icon name="doc" />
            {t.nav.docs}
          </Link>
        </nav>

        <div className={styles.tools}>
          <div className={styles.lang} role="group" aria-label={t.a11y.langSwitch}>
            {([lang, lang === "es" ? "en" : "es"] as const).map((loc, i) => (
              <span key={loc} className={styles.langItem}>
                {i > 0 && (
                  <span aria-hidden="true" className={styles.sep}>
                    /
                  </span>
                )}
                {loc === lang ? (
                  <span className={styles.langCurrent} aria-current="true" lang={loc}>
                    {loc.toUpperCase()}
                  </span>
                ) : (
                  <Link href={localeHref(loc)} hrefLang={loc} lang={loc}>
                    {loc.toUpperCase()}
                  </Link>
                )}
              </span>
            ))}
          </div>
          <NavLink className={styles.cta} href={anchor("simulation")} aria-label={t.nav.demo} title={t.nav.demo} onClick={close}>
            <Icon name="upright" />
          </NavLink>
          <button
            ref={btnRef}
            className={styles.menuBtn}
            type="button"
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "x" : "menu"} />
            <span className="sr-only">{t.a11y.menu}</span>
          </button>
        </div>
      </div>
      {open && <div className={styles.dim} onClick={close} aria-hidden="true" />}
    </header>
  );
}
