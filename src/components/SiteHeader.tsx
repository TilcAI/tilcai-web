"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Copy, Locale } from "@/lib/i18n";
import { paths } from "@/lib/site";
import { Icon } from "./Icon";

type Page = "home" | "docs";

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

  const close = () => setOpen(false);
  const links: [string, string][] = [
    [t.nav.problem, anchor("problem")],
    [t.nav.flow, anchor("flow")],
    [t.nav.demo, anchor("demo")],
    [t.nav.capabilities, anchor("capabilities")],
    [t.nav.roadmap, anchor("roadmap")],
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href={paths.home(lang)} aria-label={`TilcAI — ${t.nav.home}`}>
          <Image src="/assets/tilcai-face-64.png" width={28} height={28} alt="" loading="eager" />
          <span className="wordmark">
            Tilc<span>AI</span>
          </span>
        </Link>

        <nav className={`main-nav${open ? " is-open" : ""}`} id="main-nav" aria-label={t.a11y.mainNav}>
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={close}>
              {label}
            </Link>
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
