"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Copy, Locale } from "@/lib/i18n";
import { paths } from "@/lib/site";
import { Icon } from "./Icon";

type Page = "home" | "docs";

const subscribeScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};

export function SiteHeader({ t, page }: { t: Copy; page: Page }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const lang = t.locale;
  const anchor = (id: string) => (page === "home" ? `#${id}` : paths.section(lang, id));
  const localeHref = (loc: Locale) => (page === "home" ? paths.home(loc) : paths.docs(loc));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // On the home page the header floats over the office hero until the page scrolls.
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 24, () => false);

  const close = () => setOpen(false);
  const links: [string, string][] = [
    [t.nav.problem, anchor("problem")],
    [t.nav.flow, anchor("flow")],
    [t.nav.demo, anchor("demo")],
    [t.nav.capabilities, anchor("businesses")],
    [t.nav.agents, anchor("agents")],
    [t.nav.roadmap, anchor("roadmap")],
  ];

  return (
    <header className={`site-header${page === "home" ? " is-overlay" : ""}${scrolled ? " is-scrolled" : ""}${open ? " menu-open" : ""}`}>
      <div className="container header-inner">
        <Link className="brand" href={paths.home(lang)} aria-label={`TilcAI — ${t.nav.home}`}>
          <Image src="/brand/tilcai-logo@2x.webp" width={720} height={276} alt="" loading="eager" fetchPriority="high" sizes="80px" />
        </Link>

        <nav className={`main-nav${open ? " is-open" : ""}`} id="main-nav" aria-label={t.a11y.mainNav}>
          {links.map(([label, href]) => (
            page === "home" ? <a key={href} href={href} onClick={close}>{label}</a> :
              <Link key={href} href={href} onClick={close}>{label}</Link>
          ))}
          <Link
            className={`nav-docs${page === "docs" ? " is-active" : ""}`}
            href={paths.docs(lang)}
            aria-current={page === "docs" ? "page" : undefined}
            onClick={close}
          >
            <Icon name="doc" />
            {t.nav.docs}
          </Link>
        </nav>

        <div className="header-tools">
          <div className="lang" role="group" aria-label={t.a11y.langSwitch}>
            <Icon name="globe" />
            {(["en", "es"] as const).map((loc, i) => (
              <span key={loc} className="lang-item">
                {i > 0 && (
                  <span aria-hidden="true" className="sep">
                    /
                  </span>
                )}
                {loc === lang ? (
                  <span className="lang-current" aria-current="true" lang={loc}>
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
          <button
            ref={btnRef}
            className="menu-btn"
            type="button"
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name="menu" />
            <span className="sr-only">{t.a11y.menu}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
