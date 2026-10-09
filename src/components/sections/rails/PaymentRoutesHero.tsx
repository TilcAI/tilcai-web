"use client";

import React, { useState } from "react";
import type { Copy } from "@/lib/i18n";
import { PaymentRoutesScene } from "./PaymentRoutesScene";
import { RouteCards } from "./RouteCards";
import { PaymentTimeline } from "./PaymentTimeline";
import { StellarIcon } from "./ChainIcons";
import styles from "./PaymentRoutes.module.css";

interface PaymentRoutesHeroProps {
  t: Copy;
}

export function PaymentRoutesHero({ t }: { t: Copy }) {
  const isEs = t.locale === "es";
  const [focusedRoute, setFocusedRoute] = useState<"x402" | "cctp" | null>(null);

  return (
    <div className={styles.heroBlock}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          {isEs ? "RUTAS DE PAGO" : "PAYMENT ROUTES"}
        </div>

        <h2 className={styles.title}>
          {isEs ? (
            <>
              El negocio cobra en<br />
              USDC sobre <span className={styles.stellarGradient}>Stellar.</span>
            </>
          ) : (
            <>
              The business is paid in<br />
              USDC on <span className={styles.stellarGradient}>Stellar.</span>
            </>
          )}
        </h2>

        <p className={styles.subtitle}>
          {isEs ? (
            <>TilcAI elige la mejor ruta por orden. Dos caminos, un mismo resultado.</>
          ) : (
            <>TilcAI picks the best route per order. Two paths, one outcome.</>
          )}
        </p>

        {/* 3 Indicators */}
        <div className={styles.indicators}>
          <div className={styles.indicator} data-type="auto">
            <span>⚡</span>
            <span>{isEs ? "Automático" : "Automatic"}</span>
          </div>
          <div className={styles.indicator} data-type="verified">
            <span>◈</span>
            <span>{isEs ? "Verificado" : "Verified"}</span>
          </div>
          <div className={styles.indicator} data-type="nodouble">
            <span>↗</span>
            <span>{isEs ? "Sin doble cobro" : "No double charge"}</span>
          </div>
        </div>
      </header>

      {/* Main Composition: Scene 65% / Cards 35% */}
      <div className={styles.composition}>
        <PaymentRoutesScene
          t={t}
          focusedRoute={focusedRoute}
          onSelectRoute={(route) => setFocusedRoute(route)}
        />

        <RouteCards
          t={t}
          focusedRoute={focusedRoute}
          onHoverRoute={(route) => setFocusedRoute(route)}
          onSelectRoute={(route) => setFocusedRoute(route)}
        />
      </div>

      {/* Timeline with 4 Steps */}
      <PaymentTimeline t={t} activeStep={focusedRoute === "cctp" ? 2 : 3} />

      {/* Result Glow Banner */}
      <div className={styles.resultBanner} role="status">
        <span className={styles.resultCheck}>✓</span>
        <span className={styles.resultText}>
          {isEs ? (
            <>
              <strong>Mismo resultado:</strong> el negocio recibe USDC en Stellar.
            </>
          ) : (
            <>
              <strong>Same outcome:</strong> the business receives USDC on Stellar.
            </>
          )}
        </span>
        <StellarIcon className="w-5 h-5 text-purple-300 ml-1" />
      </div>
    </div>
  );
}
