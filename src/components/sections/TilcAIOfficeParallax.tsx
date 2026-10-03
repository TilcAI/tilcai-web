"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { acquireSmoothScroll } from "@/lib/smooth-scroll";
import styles from "./TilcAIOfficeParallax.module.css";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Eight transparent layers of ONE 16:9 scene, painted far to near. They share one box, one transform origin
 * and one object-position; depth only comes from the transforms below.
 *
 * `y`/`x` are the END value in % of the layer (it starts at 0), `scale` is [start, end], `rotation` is the end
 * angle in degrees and `mouse` the largest pointer offset in px (desktop only).
 * Only the mountains layer touches the edges of its image (it frames the scene), so its travel is capped to
 * what the camera margin can cover. The core rises almost as much as the rooms (its zoom is what sets it apart),
 * so the pedestal never runs into the room in front of it. Order: far (sky) to near (rooms, core).
 */
const LAYERS = [
  { id: "sky", src: "/assets/img/salas/p4-sa1.png", scale: [1, 1.01], y: -1 },
  { id: "stars", src: "/assets/img/salas/p4-sa2.png", scale: [1, 1.015], y: -3, x: 1, rotation: 0.15, mouse: 1 },
  { id: "orbit", src: "/assets/img/salas/p4-sa3.png", scale: [1, 1.015], y: -5, x: 2.5, rotation: 0.3, mouse: 2 },
  { id: "mountains", src: "/assets/img/salas/p4-sa4.png", scale: [1, 1.06], y: -6, mouse: 2 },
  { id: "city", src: "/assets/img/salas/p4-sa5.png", scale: [1, 1.025], y: -7.5, x: -0.7, mouse: 3 },
  { id: "network", src: "/assets/img/salas/p4-sa6.png", scale: [1, 1.035], y: -8.5, mouse: 3, fit: "network" },
  { id: "rooms", src: "/assets/img/salas/p4-sa7.png", scale: [1, 1.045], y: -11, x: 0.5, mouse: 5, fit: "rooms" },
  { id: "core", src: "/assets/img/salas/p4-sa8.png", scale: [1, 1.1], y: -10, rotation: 0.4, mouse: 7, fit: "core" },
] as const;

/**
 * Base placement that reproduces the approved composition. The files stack coherently at 1:1, but the approved
 * render keeps the centre of the scene smaller and lower to leave room for the headline, so the core, the rooms
 * and the network are scaled about the point where the fit was measured (percent of the 1672x941 frame).
 */
const FIT = {
  core: { scale: 0.58, origin: "49.5% 52.7%" },
  rooms: { scale: 0.88, origin: "49.6% 80.6%" },
  network: { scale: 0.94, origin: "48.4% 64.8%" },
} as const;

/** The camera wrapper is 108 % of the stage, so 0.94 shows (almost) the whole frame with a thin safety margin. */
const CAMERA_START = 0.94;

/** Fraction of the full motion per viewport: tablet about 35 % less, phone about 60 % less. */
const INTENSITY = { desktop: 1, tablet: 0.65, mobile: 0.4 } as const;

/** Headline pieces: the title and its second sentence, and the lead split at every sentence/colon. */
const splitLines = (text: string) => text.split(/(?<=[:.])\s+/).filter(Boolean);

type Props = {
  id: string;
  /** id given to the <h2>, used as the section's accessible name. */
  labelledBy: string;
  eyebrow: string;
  title: string;
  titleDim?: string;
  lead: string;
};

/** Cinematic scroll scene for "How to read the office". The headline is real HTML above the illustration. */
export function TilcAIOfficeParallax({ id, labelledBy, eyebrow, title, titleDim, lead }: Props) {
  const root = useRef<HTMLElement>(null);

  // Smooth scrolling only while a parallax section is mounted (the landing page).
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
          if (!k) return; // reduced motion: the eight layers rest perfectly stacked, the text is simply visible

          const q = <T extends Element>(selector: string) => section.querySelector<T>(selector);
          const layer = (name: string) => q<HTMLElement>(`[data-layer="${name}"]`);

          // The headline enters once, as the section comes into view.
          const label = q(`.${styles.eyebrow}`);
          const heading = q(`.${styles.title}`);
          const body = q(`.${styles.lead}`);
          gsap.set([label, heading, body], { opacity: 0 });
          gsap.set(label, { y: 20 });
          gsap.set(heading, { y: 35 });
          gsap.set(body, { y: 25 });
          gsap.timeline({ defaults: { duration: 0.9, ease: "power3.out" }, scrollTrigger: { trigger: section, start: "top 80%", once: true } })
            .to(label, { opacity: 1, y: 0 }, 0)
            .to(heading, { opacity: 1, y: 0 }, 0.08)
            .to(body, { opacity: 1, y: 0 }, 0.16);

          // One master timeline tied to the scroll: every layer shares the same progression.
          const tl = gsap.timeline({
            defaults: { ease: "none", duration: 1 },
            scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 1.2, invalidateOnRefresh: true },
          });

          // Camera push: one wrapper scales the whole scene, so the layers never lose their alignment.
          // It starts at the full frame (the wrapper is 8 % larger than the stage) and grows into that margin.
          tl.fromTo(q(`.${styles.camera}`), { scale: CAMERA_START }, { scale: CAMERA_START + 0.09 * k }, 0);

          for (const l of LAYERS) {
            const el = layer(l.id);
            if (!el) continue;
            const x = "x" in l ? l.x : 0;
            const rotation = "rotation" in l ? l.rotation : 0;
            const scaleEnd = l.scale[0] + (l.scale[1] - l.scale[0]) * k;
            if (l.id === "core") {
              // The core is about getting closer to the camera: it zooms through 85 % of the scroll, then a little more.
              tl.fromTo(el, { yPercent: 0, xPercent: 0, rotation: 0 }, { yPercent: l.y * k, xPercent: x * k, rotation: rotation * k }, 0);
              tl.fromTo(el, { scale: l.scale[0] }, { scale: scaleEnd, duration: 0.85 }, 0);
              tl.to(el, { scale: 1 + 0.13 * k, duration: 0.15 }, 0.85);
              continue;
            }
            tl.fromTo(
              el,
              { scale: l.scale[0], yPercent: 0, xPercent: 0, rotation: 0 },
              { scale: scaleEnd, yPercent: l.y * k, xPercent: x * k, rotation: rotation * k },
              0,
            );
          }

          // The network "switches on" during the first 30 %, then eases back so the next block takes over.
          const network = layer("network");
          if (network) {
            tl.fromTo(network, { opacity: 0.65 }, { opacity: 1, duration: 0.3, ease: "power1.out" }, 0);
            tl.to(network, { opacity: 0.75, duration: 0.15, ease: "power1.in" }, 0.85);
          }
          const rooms = layer("rooms");
          if (rooms) tl.to(rooms, { opacity: 0.92, duration: 0.15, ease: "power1.in" }, 0.85);
          const glow = q(`.${styles.coreGlow}`);
          if (glow) tl.fromTo(glow, { opacity: 0.2 }, { opacity: 0.5 }, 0);

          // Pointer depth, fine pointers on desktop only. It moves a wrapper inside each layer, never the scroll transform.
          if (!desktop || !fine) return;
          const movers = LAYERS.flatMap((l) => {
            const inner = layer(l.id)?.querySelector<HTMLElement>(`.${styles.mouse}`);
            if (!inner || !("mouse" in l)) return [];
            const opts = { duration: 0.9, ease: "power3.out" };
            return [{ amp: l.mouse, x: gsap.quickTo(inner, "x", opts), y: gsap.quickTo(inner, "y", opts) }];
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

  const titleLines = [title, ...(titleDim ? [titleDim] : [])];

  return (
    <section ref={root} id={id} className={styles.root} aria-labelledby={labelledBy}>
      <div className={styles.stage}>
        <div className={styles.camera} aria-hidden="true">
          {LAYERS.map((l, i) => {
            const fit = "fit" in l ? FIT[l.fit] : null;
            return (
              <div key={l.id} data-layer={l.id} className={styles.layer} style={{ zIndex: i + 1 }}>
                <div className={styles.mouse}>
                  <div className={styles.fit} style={fit ? { transform: `translate(-50%, -50%) scale(${fit.scale})`, transformOrigin: fit.origin } : undefined}>
                    {l.id === "core" && <span className={styles.coreGlow} />}
                    <Image src={l.src} alt="" fill sizes={l.id === "core" ? "(max-width: 700px) 100vw, 60vw" : "100vw"} quality={85} draggable={false} className={`${styles.img} ${l.id === "network" ? styles.pulse : ""}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.scrim} aria-hidden="true" />

        <div className={styles.content}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id={labelledBy} className={styles.title}>
            {titleLines.map((line) => <span key={line} className={styles.line}>{line}</span>)}
          </h2>
          <p className={styles.lead}>
            {splitLines(lead).map((line) => <span key={line} className={styles.leadLine}>{line}</span>)}
          </p>
        </div>
      </div>
    </section>
  );
}
