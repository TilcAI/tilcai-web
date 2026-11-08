"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A figure that counts up once it enters the viewport. The server renders the final value, so the
 * number is right without JavaScript and with reduced motion.
 */
export function CountUp({ value, decimals = 0, suffix = "", locale }: { value: number; decimals?: number; suffix?: string; locale: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    let frame = 0;
    let started = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return;
        started = true;
        io.disconnect();
        const start = performance.now();
        const duration = 1400;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setShown(value * (1 - Math.pow(1 - t, 3)));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    // Start from zero only when the figure has not been seen yet.
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) setShown(0);
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  const text = shown.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span ref={ref} aria-label={`${value.toLocaleString(locale, { minimumFractionDigits: decimals })}${suffix}`}>
      <span aria-hidden="true">
        {text}
        {suffix}
      </span>
    </span>
  );
}
