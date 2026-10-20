"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { DocsGroup, DocsSection, Locale } from "@/lib/i18n/types";
import { Icon } from "../Icon";

export function DocsNavigation({ sections, groups, active, locale }: {
  sections: Pick<DocsSection, "id" | "title" | "group">[];
  groups: Record<DocsGroup, string>; active: string; locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const es = locale === "es";
  const selected = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const item = selected.current;
    const parent = item?.closest(".docs-sidebar-scroll");
    if (item && parent && window.matchMedia("(min-width: 1024px)").matches) {
      const a = item.getBoundingClientRect(), p = parent.getBoundingClientRect();
      if (a.bottom > p.bottom || a.top < p.top) parent.scrollTop += a.top - p.top - 60;
    }
  }, [active]);
  return <aside className="docs-sidebar">
    <button className="docs-mobile-menu" aria-expanded={open} aria-controls="docs-navigation" onClick={() => setOpen(!open)}>
      <Icon name="menu" /><span>{es ? "Explorar documentación" : "Browse documentation"}</span><span aria-hidden="true">{open ? "−" : "+"}</span>
    </button>
    <nav id="docs-navigation" aria-label={es ? "Guías de documentación" : "Documentation guides"} className={open ? "docs-sidebar-scroll is-open" : "docs-sidebar-scroll"}>
      <Link className="docs-overview-link" href={"/" + locale + "/docs"} aria-current={active === "index" ? "page" : undefined} onClick={() => setOpen(false)}>
        <Icon name="layers" />{es ? "Introducción" : "Introduction"}
      </Link>
      {(Object.keys(groups) as DocsGroup[]).map(group => <div className="docs-nav-group" key={group}>
        <p>{groups[group]}</p>
        {sections.filter(s => s.group === group).map(s => <Link prefetch={false} ref={active === s.id ? selected : undefined} key={s.id}
          href={"/" + locale + "/docs/" + s.id} aria-current={active === s.id ? "page" : undefined} onClick={() => setOpen(false)}>{s.title}
          {s.id === "mainnet" && <span className="docs-nav-dot" aria-label={es ? "Fondos reales" : "Real funds"} />}
        </Link>)}
      </div>)}
      <a className="docs-nav-source" href="https://github.com/TilcAI" rel="noopener">GitHub <Icon name="upright" /></a>
    </nav>
  </aside>;
}

