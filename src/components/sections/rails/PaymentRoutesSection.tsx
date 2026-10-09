"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Copy } from "@/lib/i18n";
import { acquireSmoothScroll } from "@/lib/smooth-scroll";
import { PaymentRoutesHero } from "./PaymentRoutesHero";
import { TransitionGrid } from "./TransitionGrid";
import { CrosschainDetail } from "./CrosschainDetail";
import styles from "./PaymentRoutes.module.css";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

interface PaymentRoutesSectionProps {
  t: Copy;
}

export function PaymentRoutesSection({ t }: PaymentRoutesSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return acquireSmoothScroll();
  }, []);

  useIsoLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      // Subtle depth entrance for the main blocks
      const heroBlock = el.querySelector("[data-hero]");
      const detailBlock = el.querySelector(`.${styles.detailSection}`);

      if (heroBlock) {
        gsap.fromTo(
          heroBlock,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heroBlock,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (detailBlock) {
        gsap.fromTo(
          detailBlock,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: detailBlock,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="rails"
      className={styles.root}
      aria-label={t.locale === "es" ? "Rutas de pago" : "Payment routes"}
    >
      <div className={styles.inner}>
        {/* SECCIÓN A: Visión General (Comprador -> TilcAI -> Negocio con x402 & CCTP) */}
        <PaymentRoutesHero t={t} />

        {/* TRANSICIÓN: Red Tecnológica Perspectiva + Conector CCTP hacia abajo */}
        <TransitionGrid />

        {/* SECCIÓN B: Detalle de CCTP (USDC de otra red -> Burn -> Circle -> Mint -> Destino) */}
        <CrosschainDetail t={t} />
      </div>
    </section>
  );
}
