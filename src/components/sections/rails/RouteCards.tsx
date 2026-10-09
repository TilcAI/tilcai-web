"use client";

import React from "react";
import type { Copy } from "@/lib/i18n";
import styles from "./PaymentRoutes.module.css";

interface RouteCardsProps {
  t: Copy;
  focusedRoute: "x402" | "cctp" | null;
  onHoverRoute: (route: "x402" | "cctp" | null) => void;
  onSelectRoute: (route: "x402" | "cctp") => void;
}

export function RouteCards({
  t,
  focusedRoute,
  onHoverRoute,
  onSelectRoute,
}: RouteCardsProps) {
  const isEs = t.locale === "es";

  return (
    <div className={styles.cardsPanel} role="group" aria-label={isEs ? "Rutas de pago disponibles" : "Available payment routes"}>
      {/* Card 1: x402 */}
      <div
        className={styles.routeCard}
        data-route="x402"
        data-active={focusedRoute === "x402"}
        onMouseEnter={() => onHoverRoute("x402")}
        onMouseLeave={() => onHoverRoute(null)}
        onClick={() => onSelectRoute("x402")}
        tabIndex={0}
        role="button"
        aria-pressed={focusedRoute === "x402"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectRoute("x402");
          }
        }}
      >
        <div className={styles.cardTop}>
          <div className={styles.badgesGroup}>
            <span className={`${styles.badgeMono} ${styles.badgeMonoX402}`}>x402</span>
            <span className={styles.badgePill}>
              {isEs ? "Stellar directo" : "Direct on Stellar"}
            </span>
          </div>
          <span className={styles.arrowBtn} aria-hidden="true">↗</span>
        </div>

        <h4 className={styles.cardTitle}>
          {isEs ? "Para cuando ya tienes USDC en Stellar" : "When you already have USDC on Stellar"}
        </h4>

        <ul className={styles.benefitsList} role="list">
          <li className={styles.benefitItem}>
            <span className={`${styles.checkCircle} ${styles.checkCircleX402}`}>✓</span>
            <span>{isEs ? "Más simple y rápido" : "Simpler and faster"}</span>
          </li>
          <li className={styles.benefitItem}>
            <span className={`${styles.checkCircle} ${styles.checkCircleX402}`}>✓</span>
            <span>{isEs ? "Sin cambio de red" : "No network switch"}</span>
          </li>
          <li className={styles.benefitItem}>
            <span className={`${styles.checkCircle} ${styles.checkCircleX402}`}>✓</span>
            <span>{isEs ? "Pago directo al negocio" : "Direct payment to business"}</span>
          </li>
        </ul>

        <div className={styles.cardFooterStatus}>
          {isEs ? "Seleccionada automáticamente" : "Automatically selected"}
        </div>
      </div>

      {/* Card 2: CCTP */}
      <div
        className={styles.routeCard}
        data-route="cctp"
        data-active={focusedRoute === "cctp"}
        onMouseEnter={() => onHoverRoute("cctp")}
        onMouseLeave={() => onHoverRoute(null)}
        onClick={() => onSelectRoute("cctp")}
        tabIndex={0}
        role="button"
        aria-pressed={focusedRoute === "cctp"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectRoute("cctp");
          }
        }}
      >
        <div className={styles.cardTop}>
          <div className={styles.badgesGroup}>
            <span className={`${styles.badgeMono} ${styles.badgeMonoCCTP}`}>CCTP</span>
            <span className={styles.badgePill}>
              {isEs ? "Crosschain" : "Crosschain"}
            </span>
          </div>
          <span className={styles.arrowBtn} aria-hidden="true">↗</span>
        </div>

        <h4 className={styles.cardTitle}>
          {isEs ? "Para cuando tienes USDC en otra red" : "When you have USDC on another network"}
        </h4>

        <ul className={styles.benefitsList} role="list">
          <li className={styles.benefitItem}>
            <span className={`${styles.checkCircle} ${styles.checkCircleCCTP}`}>✓</span>
            <span>{isEs ? "Funciona desde varias redes" : "Works across multiple networks"}</span>
          </li>
          <li className={styles.benefitItem}>
            <span className={`${styles.checkCircle} ${styles.checkCircleCCTP}`}>✓</span>
            <span>{isEs ? "Sin gas para el comprador" : "Zero gas for the buyer"}</span>
          </li>
          <li className={styles.benefitItem}>
            <span className={`${styles.checkCircle} ${styles.checkCircleCCTP}`}>✓</span>
            <span>{isEs ? "TilcAI paga las comisiones" : "TilcAI covers transaction fees"}</span>
          </li>
        </ul>

        <div className={styles.cardFooterStatus}>
          {isEs ? "Se activa cuando aplica" : "Activates when applicable"}
        </div>
      </div>
    </div>
  );
}
