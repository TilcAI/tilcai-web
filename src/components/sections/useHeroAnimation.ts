"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";

/** Separate transform layers keep pointer depth, floating objects and type independent. */
export function useHeroAnimation(root: RefObject<HTMLElement | null>, paused: boolean) {
  const motion = useRef<gsap.core.Timeline | null>(null);
  const pausedRef = useRef(paused);
  const visibleRef = useRef(true);

  useEffect(() => {
    pausedRef.current = paused;
    motion.current?.paused(paused || !visibleRef.current || document.hidden);
  }, [paused]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia();
    const syncPlayback = () => motion.current?.paused(pausedRef.current || !visibleRef.current || document.hidden);

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline();
      motion.current = timeline;
      // A focus pull, not a scroll: everything materializes from a soft blur in place, never translating a full line height.
      const letters = element.querySelectorAll<HTMLElement>(".hero-letter");
      timeline.fromTo(letters, { opacity: 0, scale: .88, filter: "blur(8px)" }, {
        opacity: 1, scale: 1, filter: "blur(0px)", duration: .7, stagger: .022, ease: "expo.out",
      }, .1);
      timeline.fromTo(".hero-scene", { opacity: 0, scale: .92, filter: "blur(10px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: .9, ease: "expo.out" }, .18);
      timeline.fromTo("[data-hero-reveal]", { opacity: 0, scale: .97 },
        { opacity: 1, scale: 1, duration: .6, stagger: .09, ease: "expo.out" }, .45);

      element.querySelectorAll<HTMLElement>(".hero-float").forEach((item, i) => {
        timeline.to(item, { y: i % 2 ? 10 : -12, rotation: i % 2 ? 1.4 : -1.2,
          duration: 2.8 + i * .28, repeat: -1, yoyo: true, ease: "sine.inOut" }, .4 + i * .12);
      });

      const layers = Array.from(element.querySelectorAll<HTMLElement>(".hero-depth"));
      const setters = layers.map((layer) => ({
        depth: Number(layer.dataset.depth ?? 1),
        x: gsap.quickTo(layer, "x", { duration: 1.1, ease: "power3.out" }),
        y: gsap.quickTo(layer, "y", { duration: 1.1, ease: "power3.out" }),
      }));
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" || pausedRef.current) return;
        const bounds = element.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        setters.forEach((set) => { set.x(x * set.depth * -16); set.y(y * set.depth * -12); });
      };
      const reset = () => setters.forEach((set) => { set.x(0); set.y(0); });
      element.addEventListener("pointermove", move);
      element.addEventListener("pointerleave", reset);
      syncPlayback();
      return () => {
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerleave", reset);
        motion.current = null;
      };
    }, element);

    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      syncPlayback();
    }, { threshold: .05 });
    observer.observe(element);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      media.revert();
    };
  }, [root]);
}
