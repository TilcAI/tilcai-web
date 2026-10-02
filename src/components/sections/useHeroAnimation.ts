"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

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
    gsap.registerPlugin(MotionPathPlugin);
    const media = gsap.matchMedia();
    const syncPlayback = () => motion.current?.paused(pausedRef.current || !visibleRef.current || document.hidden);

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline();
      motion.current = timeline;
      const letters = element.querySelectorAll<HTMLElement>(".hero-letter");
      timeline.fromTo(letters, { yPercent: 105, opacity: 0, rotateX: -65 }, {
        yPercent: 0, opacity: 1, rotateX: 0, duration: .75, stagger: .025, ease: "power3.out",
      }, .1);
      timeline.fromTo(".hero-scene", { opacity: 0, scale: .94 }, { opacity: 1, scale: 1, duration: 1.4, ease: "power3.out" }, .15);
      timeline.fromTo("[data-hero-reveal]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .8, stagger: .12, ease: "power2.out" }, .5);

      element.querySelectorAll<HTMLElement>(".hero-float").forEach((item, i) => {
        timeline.to(item, { y: i % 2 ? 10 : -12, rotation: i % 2 ? 1.4 : -1.2,
          duration: 2.8 + i * .28, repeat: -1, yoyo: true, ease: "sine.inOut" }, .4 + i * .12);
      });
      // A quiet travelling wave keeps the headline alive without shifting the layout.
      timeline.to(letters, { y: -3, duration: .9, stagger: .045, repeat: -1, repeatDelay: 4,
        yoyo: true, ease: "sine.inOut" }, 2.5);
      timeline.to(".hero-star", { opacity: .2, scale: .45, duration: 1.6, stagger: .2,
        repeat: -1, yoyo: true, ease: "sine.inOut" }, 0);
      timeline.to(".hero-connection-flow", { strokeDashoffset: -120, duration: 5,
        repeat: -1, ease: "none" }, 0);
      ["one", "two"].forEach((orbit, i) => {
        timeline.to(`.hero-satellite-${orbit}`, { duration: 15 + i * 8, repeat: -1, ease: "none",
          motionPath: { path: `#hero-orbit-${orbit}`, align: `#hero-orbit-${orbit}`, alignOrigin: [.5, .5] } }, 0);
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
