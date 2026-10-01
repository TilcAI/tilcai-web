"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (callback: () => void) => {
  const preference = window.matchMedia(motionQuery);
  preference.addEventListener("change", callback);
  return () => preference.removeEventListener("change", callback);
};
export function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => false);
}

/** Event-driven depth: no perpetual animation loop or scroll interception. */
export function useDepthMotion(mode: "pointer" | "scroll") {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;
    let x = 0;
    let y = 0;
    const reset = () => {
      x = y = 0;
      element.style.setProperty("--scene-x", "0");
      element.style.setProperty("--scene-y", "0");
      element.style.setProperty("--scene-scroll", "0");
    };
    const paint = () => {
      frame = 0;
      if (reduced.matches || document.hidden) return;
      if (mode === "scroll") {
        const rect = element.getBoundingClientRect();
        // Spread four layers over the section's natural passage through the viewport.
        const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - rect.top - rect.height / 2) / (window.innerHeight * .65)));
        element.style.setProperty("--scene-scroll", progress.toFixed(3));
      } else {
        element.style.setProperty("--scene-x", x.toFixed(3));
        element.style.setProperty("--scene-y", y.toFixed(3));
      }
    };
    const schedule = () => {
      if (!frame && visible && !reduced.matches && !document.hidden) frame = requestAnimationFrame(paint);
    };
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reduced.matches) return;
      const rect = element.getBoundingClientRect();
      x = (event.clientX - rect.left) / rect.width * 2 - 1;
      y = (event.clientY - rect.top) / rect.height * 2 - 1;
      schedule();
    };
    const preference = () => { reset(); schedule(); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    observer.observe(element);
    if (mode === "scroll") window.addEventListener("scroll", schedule, { passive: true });
    else {
      element.addEventListener("pointermove", pointer, { passive: true });
      element.addEventListener("pointerleave", reset);
    }
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", preference);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      element.removeEventListener("pointermove", pointer);
      element.removeEventListener("pointerleave", reset);
      reduced.removeEventListener("change", preference);
    };
  }, [mode]);
  return root;
}
