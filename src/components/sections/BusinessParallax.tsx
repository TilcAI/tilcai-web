"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { acquireSmoothScroll, scrollPageTo } from "@/lib/smooth-scroll";
import { Icon } from "../Icon";
import styles from "./BusinessParallax.module.css";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
type BusinessCopy = ReturnType<typeof narrative>["business"];

const layers = [
  { id: "grid", src: "/assets/img/empresas/emp-img1.png", depth: 2 },
  { id: "connection", src: "/assets/img/empresas/emp-img9.png", depth: 5 },
  { id: "catalog", src: "/assets/img/empresas/emp-img8.png", depth: 7 },
  { id: "business", src: "/assets/img/empresas/emp-img2.png", depth: 4 },
  { id: "service", src: "/assets/img/empresas/emp-img5.png", depth: 9 },
  { id: "availability", src: "/assets/img/empresas/emp-img6.png", depth: 10 },
  { id: "price", src: "/assets/img/empresas/emp-img7.png", depth: 11 },
  { id: "agent", src: "/assets/img/empresas/emp-img3.png", depth: 7 },
  { id: "request", src: "/assets/img/empresas/emp-img4.png", depth: 12 },
] as const;

const phases = {
  es: [
    { kicker: "01 / CATÁLOGO", title: "Publica tus servicios.", body: "Conecta tu catálogo, disponibilidad y condiciones para que los agentes consulten lo que realmente ofreces." },
    { kicker: "02 / CONSULTA", title: "El agente pregunta.", body: "Una solicitud llega a tu negocio. Tu sistema responde con la información que tú publicaste." },
    { kicker: "03 / CONDICIONES", title: "Responde con tus reglas.", body: "Precio, disponibilidad y vigencia siguen bajo el control de tu negocio." },
    { kicker: "04 / RESULTADO", title: "Una respuesta clara.", body: "El agente recibe una cotización ilustrativa para que la persona revise los términos antes de autorizar." },
  ],
  en: [
    { kicker: "01 / CATALOG", title: "Publish your services.", body: "Connect your catalog, availability and terms so agents can ask about what you actually offer." },
    { kicker: "02 / REQUEST", title: "The agent asks.", body: "A request reaches your business. Your system responds with the information you published." },
    { kicker: "03 / TERMS", title: "Answer on your terms.", body: "Price, availability and validity stay under your business's control." },
    { kicker: "04 / RESULT", title: "A clear response.", body: "The agent receives an illustrative quote so the person can review the terms before authorizing." },
  ],
} as const;

export function BusinessParallax({ t, c }: { t: Copy; c: BusinessCopy }) {
  const track = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(0);
  const [phase, setPhase] = useState(0);
  const story = phases[t.locale];

  useEffect(() => acquireSmoothScroll(), []);

  useIsoLayoutEffect(() => {
    const section = track.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add({
        desktop: "(min-width: 1100px) and (prefers-reduced-motion: no-preference)",
        tablet: "(min-width: 768px) and (max-width: 1099px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
      }, (media) => {
        const { desktop, tablet, mobile } = media.conditions as Record<string, boolean>;
        if (!desktop && !tablet && !mobile) return;
        const strength = desktop ? 1 : tablet ? 0.7 : 0.45;
        const layer = (id: string) => section.querySelector<HTMLElement>(`[data-layer="${id}"]`)!;
        const camera = section.querySelector<HTMLElement>(`.${styles.camera}`)!;
        const result = section.querySelector<HTMLElement>(`.${styles.result}`)!;
        const nodes = section.querySelectorAll<HTMLElement>(`.${styles.node}`);

        gsap.set(layer("grid"), { opacity: 0.48, scale: 1 });
        gsap.set(layer("business"), { y: 18 * strength, scale: 0.92 });
        gsap.set(layer("agent"), { x: -36 * strength, y: 14 * strength, opacity: 0.6, scale: 0.94 });
        gsap.set(layer("catalog"), { x: 52 * strength, opacity: 0.4, scale: 0.93 });
        gsap.set(layer("connection"), { opacity: 0.12 });
        gsap.set(layer("request"), { x: -12 * strength, y: 38 * strength, opacity: 0, scale: 0.78, rotation: -3 });
        gsap.set([layer("service"), layer("availability"), layer("price")], { opacity: 0, scale: 0.78 });
        gsap.set(layer("service"), { x: 65 * strength, y: 45 * strength });
        gsap.set(layer("availability"), { x: 85 * strength, y: 12 * strength });
        gsap.set(layer("price"), { x: 75 * strength, y: -25 * strength });
        gsap.set(result, { opacity: 0, y: 12 });
        gsap.set(nodes, { opacity: 0, scale: 0.6 });

        // CSS holds the scene in place; one timeline moves the camera and all nine image layers.
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: desktop ? 0.85 : 0.45,
            invalidateOnRefresh: true,
            onUpdate(self) {
              const next = mobile
                ? self.progress < 0.42 ? 0 : self.progress < 0.82 ? 2 : 3
                : self.progress < 0.25 ? 0 : self.progress < 0.55 ? 1 : self.progress < 0.8 ? 2 : 3;
              if (next !== phaseRef.current) { phaseRef.current = next; setPhase(next); }
            },
          },
        });

        tl.to(layer("catalog"), { x: 0, opacity: 0.85, scale: 1, duration: 0.24 }, 0)
          .to(layer("grid"), { opacity: 0.65, scale: 1.045, y: 12 * strength, duration: 1 }, 0)
          .to(camera, { scale: 1 + 0.055 * strength, x: -11 * strength, y: -7 * strength, duration: 1 }, 0)
          .to(layer("business"), { y: 0, scale: 1, duration: 0.45 }, 0.1)
          .to(layer("agent"), { x: 0, y: -6 * strength, opacity: 1, scale: 1.025, duration: 0.31 }, 0.22)
          .to(layer("request"), { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.26, ease: "power2.out" }, 0.28)
          .to(layer("connection"), { opacity: 0.78, duration: 0.28 }, 0.28)
          .to(nodes, { opacity: 0.9, scale: 1, duration: 0.12, stagger: 0.035 }, 0.32)
          .to(nodes, { x: 75 * strength, y: -22 * strength, duration: 0.38, stagger: 0.045 }, 0.39)
          .to(layer("service"), { x: 0, y: 0, opacity: 1, scale: 0.96, duration: 0.16, ease: "power2.out" }, 0.55)
          .to(layer("availability"), { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.16, ease: "power2.out" }, 0.62)
          .to(layer("price"), { x: 0, y: 0, opacity: 1, scale: 1.035, duration: 0.16, ease: "power2.out" }, 0.69)
          .to(layer("business"), { y: -9 * strength, scale: 1.085, duration: 0.45 }, 0.55)
          .to(layer("connection"), { opacity: 1, duration: 0.18 }, 0.79)
          .to(layer("catalog"), { x: 19 * strength, scale: 1.035, opacity: 1, duration: 0.2 }, 0.8)
          .to(layer("agent"), { x: -15 * strength, y: -11 * strength, duration: 0.2 }, 0.8)
          .to(layer("request"), { y: -7 * strength, duration: 0.2 }, 0.8)
          .to(result, { opacity: 1, y: 0, duration: 0.05 }, 0.74);

        if (!desktop || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        const movers = layers.map(({ id, depth }) => {
          const inner = layer(id).querySelector<HTMLElement>(`.${styles.hover}`)!;
          return { x: gsap.quickTo(inner, "x", { duration: 1, ease: "power3.out" }), y: gsap.quickTo(inner, "y", { duration: 1, ease: "power3.out" }), depth };
        });
        const hoverSurface = section.querySelector<HTMLElement>(`.${styles.visual}`)!;
        const onMove = (event: PointerEvent) => {
          const bounds = hoverSurface.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width * 2 - 1;
          const y = (event.clientY - bounds.top) / bounds.height * 2 - 1;
          movers.forEach((mover) => { mover.x(-x * mover.depth); mover.y(-y * mover.depth); });
        };
        const onLeave = () => movers.forEach((mover) => { mover.x(0); mover.y(0); });
        hoverSurface.addEventListener("pointermove", onMove, { passive: true });
        hoverSurface.addEventListener("pointerleave", onLeave);
        return () => { hoverSurface.removeEventListener("pointermove", onMove); hoverSurface.removeEventListener("pointerleave", onLeave); };
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const goToPhase = (index: number) => {
    const section = track.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPhase(index === 0 ? 0 : index === 1 ? 2 : 3); return; }
    const fraction = index === 0 ? 0.12 : index === 1 ? 0.68 : 0.93;
    scrollPageTo(section.getBoundingClientRect().top + window.scrollY + fraction * (section.offsetHeight - window.innerHeight));
  };

  return (
    <div ref={track} className={styles.track}>
      <div className={styles.sticky}>
        <div className={styles.layout}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>{t.businesses.eyebrow}</p>
            <h2 id="businesses-title" className={styles.heading}>{c.title}</h2>
            <p className={styles.lead}>{c.lead}</p>
            <div className={styles.actions}>
              <Link className="btn btn-primary" href={`/${t.locale}/docs#business`}>{c.pilot}<Icon name="arrow" /></Link>
              <span className={styles.status}>{c.status}</span>
            </div>
            <div className={styles.phaseCopy} key={phase} aria-live="off">
              <span>{story[phase].kicker}</span>
              <h3>{story[phase].title}</h3>
              <p>{story[phase].body}</p>
            </div>
          </div>
          <div className={styles.visual} role="img" aria-label={t.locale === "es" ? "Un agente consulta un negocio; el negocio responde desde su catálogo con servicio, disponibilidad y precio. Escena ilustrativa." : "An agent asks a business; the business responds from its catalog with a service, availability and price. Illustrative scene."}>
            <div className={styles.camera}>
              <div className={styles.businessGlow} /><div className={styles.catalogGlow} />
              {layers.map(({ id, src }) => (
                <div key={id} data-layer={id} className={`${styles.layer} ${styles[id]}`} aria-hidden="true">
                  <div className={styles.hover}>
                    <Image src={src} alt="" fill sizes={id === "grid" || id === "connection" ? "(max-width: 767px) 100vw, 60vw" : "(max-width: 767px) 45vw, 28vw"} quality={85} loading={id === "grid" || id === "business" ? "eager" : "lazy"} draggable={false} />
                  </div>
                </div>
              ))}
              <span className={`${styles.node} ${styles.nodeOne}`} /><span className={`${styles.node} ${styles.nodeTwo}`} /><span className={`${styles.node} ${styles.nodeThree}`} />
              <span className={styles.result}>{t.locale === "es" ? "✓ RESPUESTA ILUSTRATIVA" : "✓ ILLUSTRATIVE RESPONSE"}</span>
            </div>
          </div>
        </div>
        <div id="capabilities" className={styles.steps} role="group" aria-label={t.capabilities.eyebrow}>
          {c.tabs.map((tab, index) => (
            <button key={tab.title} type="button" className={styles.step} data-current={(index === 0 && phase === 0) || (index === 1 && (phase === 1 || phase === 2)) || (index === 2 && phase === 3)} aria-current={(index === 0 && phase === 0) || (index === 1 && (phase === 1 || phase === 2)) || (index === 2 && phase === 3) ? "step" : undefined} onClick={() => goToPhase(index)}>
              <span className={styles.stepNumber}>0{index + 1}</span>
              <span className={styles.stepText}><strong>{tab.title}</strong><small>{tab.body}</small></span>
              <span className={styles.stepIcon} aria-hidden="true">{index === 0 ? "◇" : index === 1 ? "▤" : "✓"}</span>
            </button>
          ))}
        </div>
        <div className={styles.progress} aria-hidden="true"><span style={{ width: `${(phase + 1) * 25}%` }} /></div>
      </div>
    </div>
  );
}
