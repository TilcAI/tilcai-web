"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { Icon, type IconName } from "../Icon";
import styles from "./ControlExperience.module.css";

const icons: IconName[] = ["rules", "shield", "lock"];
const LIMIT = 50;

export function ControlSection({ t }: { t: Copy }) {
  const c = narrative(t.locale).control;
  const { control } = t;
  const isEs = t.locale === "es";
  const [focus, setFocus] = useState(1);
  const [amount, setAmount] = useState(30);
  const [paused, setPaused] = useState(false);
  const overLimit = amount > LIMIT;
  const stopped = paused || overLimit;
  const progress = (amount / 70) * 100;
  const status = paused
    ? (isEs ? "Pausado" : "Paused")
    : overLimit
      ? (isEs ? "Fuera del límite" : "Over the limit")
      : (isEs ? "Dentro del límite" : "Within the limit");
  const focusDetails = isEs
    ? ["Solo el servicio y el negocio aprobados.", "Cada compra se compara con tu límite.", "Un cambio, vencimiento o pausa detiene lo siguiente."]
    : ["Only the approved service and business.", "Every purchase is checked against your limit.", "A change, expiry or pause stops what comes next."];

  return (
    <section id="control" className={styles.section} aria-labelledby="control-title">
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}><span />{control.eyebrow}</p>
          <h2 id="control-title" className={styles.heading}>{c.title}</h2>
          <p className={styles.lead}>{c.lead}</p>

          <div className={styles.ruleList} role="group" aria-label={isEs ? "Explorar las condiciones" : "Explore the conditions"}>
            {control.panels.map((panel, index) => (
              <button
                className={styles.rule}
                type="button"
                key={panel.title}
                aria-pressed={focus === index}
                onClick={() => setFocus(index)}
              >
                <span className={styles.ruleNumber}>0{index + 1}</span>
                <span className={styles.ruleIcon}><Icon name={icons[index]} /></span>
                <span className={styles.ruleText}><strong>{panel.title}</strong><small>{panel.body}</small></span>
                <Icon name="arrow" />
              </button>
            ))}
          </div>

          <div className={styles.walletNote}>
            <Icon name="lock" />
            <p>{control.account.body}</p>
          </div>
          <Link href={`/${t.locale}/docs#limits`} className={styles.docsLink}>
            {c.docs}<Icon name="arrow" />
          </Link>
        </div>

        <div className={styles.previewWrap}>
          <div className={styles.preview} data-stopped={stopped} data-focus={focus}>
            <div className={styles.previewHeader}>
              <span className={styles.previewKicker}><span className={styles.liveDot} />{isEs ? "VISTA PREVIA DEL PERMISO" : "PERMISSION PREVIEW"}</span>
              <span className={styles.previewIndex}>0{focus + 1} / 03</span>
            </div>

            <div className={styles.visual} aria-hidden="true">
              <span className={styles.orbitOuter} />
              <span className={styles.orbitInner} />
              <span className={styles.orbitDot} />
              <span className={styles.visualLine} />
              <div className={styles.visualCore}><Icon name={stopped ? "lock" : "shield"} /></div>
              <div className={`${styles.satellite} ${styles.satelliteLeft}`}><Icon name="user" /></div>
              <div className={`${styles.satellite} ${styles.satelliteRight}`}><Icon name="agent" /></div>
              <span className={`${styles.visualLabel} ${styles.visualLabelLeft}`}>{isEs ? "TÚ DECIDES" : "YOU DECIDE"}</span>
              <span className={`${styles.visualLabel} ${styles.visualLabelRight}`}>{isEs ? "AGENTE ACTÚA" : "AGENT ACTS"}</span>
            </div>

            <div className={styles.readout}>
              <div>
                <p className={styles.readoutLabel}>{c.review}</p>
                <p className={styles.amount}>{amount}<span> / {LIMIT} USDC</span></p>
              </div>
              <span className={styles.state} data-stopped={stopped}><span />{status}</span>
            </div>

            <label className={styles.sliderLabel} htmlFor="control-amount">
              <span>{isEs ? "Explora un importe" : "Explore an amount"}</span>
              <span>{isEs ? "Límite" : "Limit"}: {LIMIT} USDC</span>
            </label>
            <div className={styles.sliderTrack} style={{ "--fill": `${progress}%` } as CSSProperties}>
              <input
                id="control-amount"
                type="range"
                min="0"
                max="70"
                step="1"
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
                aria-label={isEs ? "Importe de ejemplo en USDC" : "Example amount in USDC"}
                aria-valuetext={`${amount} USDC. ${status}`}
              />
              <span className={styles.limitMark} aria-hidden="true" />
            </div>
            <p className={styles.result} aria-live="polite">
              <Icon name={stopped ? "lock" : "check"} />
              {paused
                ? (isEs ? "La pausa detiene operaciones futuras." : "The pause stops future operations.")
                : overLimit
                  ? (isEs ? "Este importe supera el límite permitido." : "This amount exceeds the allowed limit.")
                  : (isEs ? "Este importe está dentro del límite." : "This amount is within the limit.")}
            </p>

            <div className={styles.detailGrid}>
              <div className={focus === 0 ? styles.detailActive : ""}><span>{c.recipient}</span><strong>{c.recipientValue}</strong></div>
              <div className={focus === 2 ? styles.detailActive : ""}><span>{c.expiry}</span><strong>{c.expiryValue}</strong></div>
            </div>
            <div className={styles.focusLine} aria-live="polite"><span>0{focus + 1}</span>{focusDetails[focus]}</div>

            <div className={styles.previewFooter}>
              <div>
                <span className={styles.footerLabel}>{control.permission.stopLabel}</span>
                <div className={styles.conditions}>{control.permission.stopConditions.map((condition) => <span key={condition}>{condition}</span>)}</div>
              </div>
              <button className={styles.pauseButton} type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
                <Icon name={paused ? "play" : "pause"} />
                {paused ? (isEs ? "Reanudar ejemplo" : "Resume example") : (isEs ? "Simular pausa" : "Simulate pause")}
              </button>
            </div>
          </div>
          <div className={styles.disclaimer}><span>{control.example.label}</span><span>{control.note}</span></div>
        </div>
      </div>
    </section>
  );
}
