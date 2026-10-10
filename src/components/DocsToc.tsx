"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export interface DocsTocGroup {
  id: string;
  label: string;
  items: { id: string; title: string }[];
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * The index of the page. On wide screens it is a sticky column grouped by topic, with one plate that slides to the
 * section being read; on narrow screens it is a single row of chips that stays under the site header and keeps the
 * current chip in view. It only follows the reader: it never moves the page on its own.
 */
export function DocsToc({ groups, title }: { groups: DocsTocGroup[]; title: string }) {
  const [current, setCurrent] = useState<string | null>(null);
  const nav = useRef<HTMLElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const links = useRef(new Map<string, HTMLAnchorElement>());
  const ids = groups.flatMap((group) => group.items.map((item) => item.id));
  const idsKey = ids.join("|");

  // Scroll spy: the section crossing a band near the top of the viewport is the one being read.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setCurrent(entry.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    idsKey.split("|").forEach((id) => {
      const section = document.getElementById(id);
      if (section) spy.observe(section);
    });
    return () => spy.disconnect();
  }, [idsKey]);

  // The plate behind the current link. Only its offset and height are measured; transform does the moving.
  useIsoLayoutEffect(() => {
    const container = list.current;
    if (!container) return;
    const place = () => {
      const link = current ? links.current.get(current) : undefined;
      if (!link || link.offsetParent !== container) {
        delete container.dataset.plate;
        return;
      }
      // The first placement must not slide in from the top of the list.
      if (!container.dataset.plate) {
        container.dataset.instant = "";
        requestAnimationFrame(() => requestAnimationFrame(() => delete container.dataset.instant));
      }
      container.style.setProperty("--plate-y", `${link.offsetTop}px`);
      container.style.setProperty("--plate-h", `${link.offsetHeight}px`);
      container.dataset.plate = "on";
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(container);
    return () => observer.disconnect();
  }, [current]);

  // Keep the current link inside whichever box scrolls: the chip row on narrow screens, the column on wide ones.
  useEffect(() => {
    const link = current ? links.current.get(current) : undefined;
    const row = list.current;
    const column = nav.current;
    if (!link || !row || !column) return;
    const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    const margin = 16;
    const l = link.getBoundingClientRect();
    if (row.scrollWidth > row.clientWidth + 1) {
      const r = row.getBoundingClientRect();
      const delta = l.left < r.left + margin ? l.left - r.left - margin : l.right > r.right - margin ? l.right - r.right + margin : 0;
      if (delta) row.scrollBy({ left: delta, behavior });
    } else if (column.scrollHeight > column.clientHeight + 1) {
      const c = column.getBoundingClientRect();
      const delta = l.top < c.top + margin ? l.top - c.top - margin : l.bottom > c.bottom - margin ? l.bottom - c.bottom + margin : 0;
      if (delta) column.scrollBy({ top: delta, behavior });
    }
  }, [current]);

  return (
    <nav ref={nav} className="docs-toc" aria-labelledby="toc-title">
      <p id="toc-title" className="toc-title">
        {title}
      </p>
      <div ref={list} className="docs-toc-list">
        <span className="docs-toc-plate" aria-hidden="true" />
        {groups.map((group) => (
          <section key={group.id} className="docs-toc-group" aria-labelledby={`toc-group-${group.id}`}>
            <p id={`toc-group-${group.id}`} className="docs-toc-group-label">
              {group.label}
            </p>
            <ul role="list">
              {group.items.map((item) => (
                <li key={item.id}>
                  <a
                    ref={(element) => {
                      if (element) links.current.set(item.id, element);
                      else links.current.delete(item.id);
                    }}
                    href={`#${item.id}`}
                    className={current === item.id ? "is-current" : undefined}
                    aria-current={current === item.id ? "location" : undefined}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </nav>
  );
}
