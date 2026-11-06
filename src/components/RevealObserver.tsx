"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Adds `is-visible` to `.reveal` elements as they enter the viewport.
 * The `js` class is set before paint by the layout. This effect keeps it as a
 * fallback for client navigation, while no-JavaScript pages stay readable.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Observe the current route's nodes, including any already in the viewport.
    document.documentElement.classList.add("js");
    const items = document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        }
      },
      { rootMargin: "0px", threshold: 0.02 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
