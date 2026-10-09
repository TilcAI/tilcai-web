"use client";

import React from "react";
import type { Copy } from "@/lib/i18n";
import { UsdcIcon } from "./ChainIcons";
import styles from "./PaymentRoutes.module.css";

interface PaymentTimelineProps {
  t: Copy;
  activeStep?: number;
}

export function PaymentTimeline({ t, activeStep = 3 }: PaymentTimelineProps) {
  const isEs = t.locale === "es";

  const steps = [
    {
      num: "01",
      title: isEs ? "Pagas en USDC" : "Pay in USDC",
      sub: isEs ? "Desde tu red preferida" : "From your preferred network",
      icon: <UsdcIcon className="w-5 h-5 text-cyan-400" />,
    },
    {
      num: "02",
      title: isEs ? "TilcAI elige" : "TilcAI routes",
      sub: isEs ? "La mejor ruta por orden" : "Best path per order",
      icon: (
        <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8" y2="16" />
          <line x1="16" y1="16" x2="16" y2="16" />
        </svg>
      ),
    },
    {
      num: "03",
      title: isEs ? "Se confirma" : "Confirmed",
      sub: isEs ? "En la blockchain" : "On the blockchain",
      icon: (
        <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      num: "04",
      title: isEs ? "El negocio cobra" : "Business paid",
      sub: isEs ? "USDC en Stellar" : "USDC on Stellar",
      icon: (
        <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.timeline} role="list" aria-label={isEs ? "Pasos de pago" : "Payment steps"}>
      {steps.map((step, index) => {
        const isActive = activeStep >= index;
        return (
          <div key={step.num} className={styles.timelineCard} data-active={isActive} role="listitem">
            <div className={styles.timelineIconBox}>
              {step.icon}
            </div>
            <div className={styles.timelineContent}>
              <div className={styles.timelineStepNum}>{step.num}</div>
              <h4 className={styles.timelineTitle}>{step.title}</h4>
              <p className={styles.timelineSub}>{step.sub}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={styles.timelineArrow} aria-hidden="true">
                →
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
