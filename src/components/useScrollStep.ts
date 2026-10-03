"use client";

import { useEffect, useRef, useState } from "react";

/** Follow the nearest card without taking control of native scrolling or focus. */
export function useScrollStep<T extends HTMLElement>() {
  const list = useRef<T>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const cards = Array.from(list.current?.children ?? []);
    if (!cards.length) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const center = window.innerHeight * .5;
      let nearest = 0;
      let distance = Infinity;
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const next = Math.abs(rect.top + rect.height / 2 - center);
        if (next < distance) { distance = next; nearest = index; }
      });
      setActive(nearest);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    cards.forEach(card => observer.observe(card));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return { list, active };
}
