"use client";

import { useEffect, useRef, useState } from "react";
import type { StrategyCopy } from "@/lib/content/strategy";
import styles from "./strategy.module.css";

const MIN = 30;
const TARGET = 90;
// Payment sizes cycle through a fixed sequence, as % of the target balance, so the explainer behaves the same every time.
const SIZES = [12, 9, 15, 11, 14, 8, 13];
const REFILL_MS = 1700;

/**
 * Interactive explainer of the post-v1 liquidity model: payments leave the destination vault at once;
 * when the balance crosses the minimum, one CCTP batch tops it up to the target.
 */
export function LiquiditySim({ c }: { c: StrategyCopy["roadmap"]["liquidity"]["sim"] }) {
  const [balance, setBalance] = useState(TARGET);
  const [payments, setPayments] = useState(0);
  const [refills, setRefills] = useState(0);
  const [refilling, setRefilling] = useState(false);
  const [pulse, setPulse] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pay = () => {
    if (refilling) return;
    const size = SIZES[payments % SIZES.length]!;
    const next = balance - size;
    setBalance(next);
    setPayments((n) => n + 1);
    setPulse((n) => n + 1);
    if (next < MIN) {
      setRefilling(true);
      timer.current = window.setTimeout(() => {
        setBalance(TARGET);
        setRefills((n) => n + 1);
        setRefilling(false);
      }, REFILL_MS);
    }
  };

  const reset = () => {
    window.clearTimeout(timer.current);
    setBalance(TARGET);
    setPayments(0);
    setRefills(0);
    setRefilling(false);
    setPulse(0);
  };

  const status = refilling ? c.refilling : payments ? c.paid : c.idle;

  return (
    <div className={styles.sim}>
      <h4 className={styles.panelTitle}>{c.title}</h4>
      <div className={styles.simStage}>
        <div className={`${styles.simChain} ${refilling ? styles.simActive : ""}`}>
          <span className={styles.simLogo} aria-hidden="true">A</span>
          <strong>{c.origin}</strong>
          <small>CCTP</small>
        </div>
        <div className={`${styles.simPipe} ${refilling ? styles.simFlowing : ""}`} aria-hidden="true">
          <i /><i /><i />
        </div>
        <div className={styles.simVault}>
          <strong>{c.destination}</strong>
          <div
            className={styles.tank}
            role="meter"
            aria-label={c.balance}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={balance}
          >
            <span className={`${styles.tankFill} ${balance < MIN ? styles.tankLow : ""}`} style={{ height: `${balance}%` }} />
            <span className={styles.tankLine} style={{ bottom: `${TARGET}%` }}><em>{c.target}</em></span>
            <span className={`${styles.tankLine} ${styles.tankMin}`} style={{ bottom: `${MIN}%` }}><em>{c.min}</em></span>
          </div>
          {pulse > 0 && <span key={pulse} className={styles.payout} aria-hidden="true">USDC →</span>}
        </div>
      </div>
      <div className={styles.simControls}>
        <button type="button" className={styles.primary} onClick={pay} disabled={refilling}>{c.pay}</button>
        <button type="button" className={styles.ghost} onClick={reset}>{c.reset}</button>
        <dl>
          <div><dt>{c.payments}</dt><dd>{payments}</dd></div>
          <div><dt>{c.refills}</dt><dd>{refills}</dd></div>
        </dl>
      </div>
      <p className={styles.simStatus} aria-live="polite">{status}</p>
    </div>
  );
}
