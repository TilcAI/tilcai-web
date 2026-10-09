"use client";

import React from "react";
import styles from "./PaymentRoutes.module.css";

export function TransitionGrid() {
  return (
    <div className={styles.transitionBridge} aria-hidden="true">
      <div className={styles.perspectiveGrid} />
      <svg className={styles.bridgeLineSvg} viewBox="0 0 40 120" fill="none">
        <path
          d="M20 0 L20 110"
          stroke="url(#bridgeLineGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
        <path
          d="M20 0 L20 110"
          stroke="#37D2FF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <defs>
          <linearGradient id="bridgeLineGrad" x1="20" y1="0" x2="20" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9B72FF" />
            <stop offset="0.5" stopColor="#37D2FF" />
            <stop offset="1" stopColor="#00F2FE" />
          </linearGradient>
        </defs>
      </svg>
      <div className={styles.bridgePulseNode} />
    </div>
  );
}
