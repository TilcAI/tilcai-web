"use client";

import { useEffect, useState } from "react";
import type { StrategyCopy } from "@/lib/content/strategy";
import styles from "./strategy.module.css";

/** Sticky in-page navigation for /demo with scroll-spy: the pill of the section on screen is marked. */
export function DemoNav({ nav }: { nav: StrategyCopy["nav"] }) {
  const [current, setCurrent] = useState<string>(nav.items[0]?.id ?? "");

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const sections = nav.items.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setCurrent(entry.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((section) => io.observe(section));
    return () => io.disconnect();
  }, [nav.items]);

  return (
    <nav className={styles.nav} aria-label={nav.label}>
      <ul>
        {nav.items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} aria-current={current === item.id ? "location" : undefined} className={current === item.id ? styles.navOn : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
