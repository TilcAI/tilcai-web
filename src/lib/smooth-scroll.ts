import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * One shared Lenis instance, driven by GSAP's ticker so ScrollTrigger and smooth scrolling stay in sync.
 * Components call `acquireSmoothScroll()` while they need it; the instance is created by the first
 * caller and destroyed when the last one releases it (also safe under React Strict Mode remounts).
 */
let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;
let holders = 0;

/** Navigation and wheel input use the same controller. */
export function scrollPageTo(top: number) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis) lenis.scrollTo(top, { immediate: reduced, duration: .8 });
  else window.scrollTo({ top, behavior: reduced ? "instant" : "smooth" });
}

export function acquireSmoothScroll(): () => void {
  gsap.registerPlugin(ScrollTrigger);

  if (holders++ === 0) {
    const instance = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      anchors: true, // `#section` links keep working; Lenis already honours the page's scroll-padding-top
      allowNestedScroll: true, // keeps the agent <dialog> and other nested scrollers working
    });
    instance.on("scroll", ScrollTrigger.update);
    tick = (time) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis = instance;
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--holders > 0) return;
    if (tick) gsap.ticker.remove(tick);
    gsap.ticker.lagSmoothing(500, 33); // GSAP defaults
    lenis?.destroy();
    lenis = null;
    tick = null;
  };
}
