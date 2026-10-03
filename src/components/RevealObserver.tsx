"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Adds `is-visible` to `.reveal` elements as they enter the viewport.
 * The `js` class is added only when this client component runs, so the page
 * stays fully readable without JavaScript.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Enable the enhancement and observe the current route's nodes.
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
