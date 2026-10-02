"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { acquireSmoothScroll } from "@/lib/smooth-scroll";
import styles from "./TilcAIParallax.module.css";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Six transparent layers of ONE 16:9 scene, painted back to front. They share one coordinate system
 * and one transform origin, so they only separate as the scroll progresses.
 *
 * `scale`/`y`/`x` are the START and END of each layer (y/x in % of the layer). Because the layers are
 * scaled about the centre, a layer can rise by at most (scale - 1) / 2 before its bottom edge shows;
 * the values below stay inside that margin (the city and foreground art touch the bottom edge).
 * `mouse` is the maximum pointer offset in px (desktop only).
 */
const LAYERS = [
  { id: "background", src: "/assets/img/description/p3-1.png", scale: [1.04, 1.06], y: -1 },
  { id: "stars", src: "/assets/img/description/p3-2.png", scale: [1.05, 1.08], y: -1.5, x: 1 },
  { id: "planet", src: "/assets/img/description/p3-3.png", scale: [1.04, 1.07], y: -2, x: 2, rotation: 0.5, mouse: 2, fit: "planet" },
  { id: "mountains", src: "/assets/img/description/p3-4.png", scale: [1.1, 1.13], y: -4.5, mouse: 3 },
  { id: "city", src: "/assets/img/description/p3-5.png", scale: [1.1, 1.18], y: -9, mouse: 5, fit: "city" },
  { id: "foreground", src: "/assets/img/description/p3-6.png", scale: [1.1, 1.26], y: -12, mouse: 8 },
] as const;

/**
 * Base placement that reproduces the approved composition. The mountains and foreground files line up 1:1
 * with it, but the planet and the mid-distance city were exported larger, so they are scaled down here
 * (fitted against the reference render: planet 0.49 about the top-right corner, city 0.475 about a point
 * near the bottom). Edges the artwork is cut on fade out instead of ending in a hard line.
 */
const FIT = {
  planet: {
    transform: "translateY(1.5%) scale(0.49)",
    transformOrigin: "97.1% 0%",
    mask: "linear-gradient(180deg, #000 78%, transparent 100%)",
  },
  city: {
    transform: "scale(0.475)",
    transformOrigin: "72% 95.3%",
    mask: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent), linear-gradient(180deg, #000 80%, transparent)",
  },
} as const;

/** Fraction of the full motion applied per viewport: tablet about 30 % less, mobile about 55 % less. */
const INTENSITY = { desktop: 1, tablet: 0.7, mobile: 0.45 } as const;

type Props = {
  id: string;
  /** id of the heading inside `children`, for the section's accessible name. */
  labelledBy: string;
  children: ReactNode;
};

/** Cinematic scroll scene behind a content block. The content itself is rendered untouched. */
export function TilcAIParallax({ id, labelledBy, children }: Props) {
  const root = useRef<HTMLElement>(null);

  // Smooth scrolling only while this section is mounted (the landing page).
  useEffect(() => acquireSmoothScroll(), []);

  useIsoLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          tablet: "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
          fine: "(hover: hover) and (pointer: fine)",
        },
        (context) => {
          const { desktop, tablet, mobile, fine } = context.conditions as Record<string, boolean>;
          const k = desktop ? INTENSITY.desktop : tablet ? INTENSITY.tablet : mobile ? INTENSITY.mobile : 0;
          if (!k) return; // reduced motion: every layer stays at its original CSS position

          const layer = (name: string) => section.querySelector<HTMLElement>(`[data-layer="${name}"]`);

          const tl = gsap.timeline({
            defaults: { ease: "none", duration: 1 }, // every tween spans the whole scroll range
            scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 1.2, invalidateOnRefresh: true },
          });

          // Camera push: one wrapper scales the whole scene, so the layers never lose their alignment.
          tl.fromTo(section.querySelector(`.${styles.camera}`), { scale: 1 }, { scale: 1 + 0.04 * k }, 0);

          for (const l of LAYERS) {
            const el = layer(l.id);
            if (!el) continue;
            const x = "x" in l ? l.x : 0;
            const rotation = "rotation" in l ? l.rotation : 0;
            tl.fromTo(
              el,
              { scale: l.scale[0], yPercent: 0, xPercent: 0, rotation: 0 },
              { scale: l.scale[0] + (l.scale[1] - l.scale[0]) * k, yPercent: l.y * k, xPercent: x * k, rotation: rotation * k },
              0,
            );
          }

          // Hand-off to the next block: the city thins slightly near the end; the scene never fades to black.
          const city = layer("city");
          if (city) tl.fromTo(city, { opacity: 1 }, { opacity: 0.85, ease: "power1.in", duration: 0.15 }, 0.85);

          // Pointer depth, fine pointers only. It moves a wrapper inside each layer, never the scroll transform.
          if (!desktop || !fine) return;
          const movers = LAYERS.flatMap((l) => {
            const inner = layer(l.id)?.querySelector<HTMLElement>(`.${styles.mouse}`);
            return inner && "mouse" in l
              ? [{ amp: l.mouse, x: gsap.quickTo(inner, "x", { duration: 0.9, ease: "power3.out" }), y: gsap.quickTo(inner, "y", { duration: 0.9, ease: "power3.out" }) }]
              : [];
          });
          const onMove = (e: PointerEvent) => {
            const nx = (e.clientX / window.innerWidth) * 2 - 1;
            const ny = (e.clientY / window.innerHeight) * 2 - 1;
            for (const m of movers) {
              m.x(-nx * m.amp);
              m.y(-ny * m.amp);
            }
          };
          const onLeave = () => movers.forEach((m) => { m.x(0); m.y(0); });
          section.addEventListener("pointermove", onMove, { passive: true });
          section.addEventListener("pointerleave", onLeave);
          return () => {
            section.removeEventListener("pointermove", onMove);
            section.removeEventListener("pointerleave", onLeave);
          };
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id={id} className={styles.root} aria-labelledby={labelledBy}>
      <div className={styles.scene} aria-hidden="true">
        <div className={styles.stage}>
          <div className={styles.camera}>
            {LAYERS.map((l, i) => {
              const fit = "fit" in l ? FIT[l.fit] : null;
              return (
                <div key={l.id} data-layer={l.id} className={styles.layer} style={{ zIndex: i + 1, transform: `scale(${l.scale[0]})` }}>
                  <div className={styles.mouse}>
                    <div
                      className={styles.fit}
                      style={
                        fit
                          ? {
                              transform: fit.transform,
                              transformOrigin: fit.transformOrigin,
                              maskImage: fit.mask,
                              WebkitMaskImage: fit.mask,
                              maskComposite: "intersect",
                              WebkitMaskComposite: "source-in",
                            }
                          : undefined
                      }
                    >
                      <Image src={l.src} alt="" fill sizes="100vw" quality={85} draggable={false} className={styles.img} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.scrim} />
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
