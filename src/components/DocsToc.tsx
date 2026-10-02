"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

export function DocsToc({
  items,
  title,
  backHref,
  backLabel,
}: {
  items: { id: string; title: string }[];
  title: string;
  backHref: string;
  backLabel: string;
}) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const spy = new IntersectionObserver(
      (entries) => {
        for (const en of entries) if (en.isIntersecting) setCurrent(en.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    document.querySelectorAll(".prose section[id]").forEach((s) => spy.observe(s));
    return () => spy.disconnect();
  }, []);

  return (
    <nav className="docs-toc" aria-labelledby="toc-title">
      <p id="toc-title" className="toc-title">
        {title}
      </p>
      <ol role="list">
        {items.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={current === s.id ? "is-current" : undefined}
              aria-current={current === s.id ? "location" : undefined}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ol>
      <Link className="toc-back" href={backHref}>
        <Icon name="arrow" className="icon flip" />
        {backLabel}
      </Link>
    </nav>
  );
}
