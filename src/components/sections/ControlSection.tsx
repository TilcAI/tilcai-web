"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import styles from "./ControlExperience.module.css";

const LIMIT = 50;
const ART = {
  scope: "/office/control/scope.webp",
  within: "/office/control/within-limit.webp",
  valid: "/office/control/valid.webp",
  over: "/office/control/over-limit.webp",
  paused: "/office/control/paused.webp",
  recipient: "/office/control/recipient-changed.webp",
  expired: "/office/control/expired.webp",
} as const;

export function ControlSection({ t }: { t: Copy }) {
  const c = narrative(t.locale).control;
  const { control } = t;
  const isEs = t.locale === "es";
  const [focus, setFocus] = useState(1);
  const [amount, setAmount] = useState(30);
  const [paused, setPaused] = useState(false);
  const [recipientChanged, setRecipientChanged] = useState(false);
  const [expired, setExpired] = useState(false);
  const overLimit = amount > LIMIT;
  const activeConditions = [overLimit, recipientChanged, expired, paused];
  const blockers = control.permission.stopConditions.filter((_, index) => activeConditions[index]);
  const stopped = blockers.length > 0;
  const progress = (amount / 70) * 100;
  const status = stopped ? (isEs ? "No continúa" : "Stopped") : (isEs ? "Lista para revisión" : "Ready for review");
  const scene = paused ? "paused" : expired ? "expired" : recipientChanged ? "recipient" : overLimit ? "over" : focus === 0 ? "scope" : focus === 2 ? "valid" : "within";
  const sceneLabel = isEs
    ? { scope: "Destinatario verificado", within: "Dentro del límite", valid: "Vigencia activa", over: "Límite superado", paused: "Permiso pausado", recipient: "Destinatario cambiado", expired: "Vigencia vencida" }[scene]
    : { scope: "Verified recipient", within: "Within the limit", valid: "Still valid", over: "Limit exceeded", paused: "Permission paused", recipient: "Recipient changed", expired: "Validity expired" }[scene];
  const focusDetails = isEs
    ? ["Solo el servicio y el negocio aprobados.", "Cada compra se compara con tu límite.", "Un cambio, vencimiento o pausa detiene lo siguiente."]
    : ["Only the approved service and business.", "Every purchase is checked against your limit.", "A change, expiry or pause stops what comes next."];
  function toggleCondition(index: number) {
    if (index === 0) setAmount((value) => value > LIMIT ? 30 : 60);
    if (index === 1) setRecipientChanged((value) => !value);
    if (index === 2) setExpired((value) => !value);
    if (index === 3) setPaused((value) => !value);
    setFocus(index === 0 ? 1 : index === 1 ? 0 : 2);
  }
  function resetExample() {
    setAmount(30);
    setPaused(false);
    setRecipientChanged(false);
    setExpired(false);
    setFocus(1);
  }

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
                <span className={styles.ruleIcon}>
                  <Image src={[ART.scope, ART.within, ART.valid][index]} alt="" width={38} height={38} unoptimized />
                </span>
                <span className={styles.ruleText}><strong>{panel.title}</strong><small>{panel.body}</small></span>
                <span className={styles.ruleArrow} aria-hidden="true">→</span>
              </button>
            ))}
          </div>

          <div className={styles.walletNote}>
            <span className={styles.noteMark} aria-hidden="true">•</span>
            <p>{control.account.body}</p>
          </div>
          <Link href={`/${t.locale}/docs#limits`} className={styles.docsLink}>
            {c.docs}<span aria-hidden="true">→</span>
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
              <span className={styles.visualLine} />
              {Object.entries(ART).map(([key, src]) => (
                <div key={key} className={styles.sceneLayer} data-active={scene === key}>
                  <Image src={src} alt="" fill sizes="(max-width: 560px) 240px, 330px" unoptimized />
                </div>
              ))}
            </div>
            <p className={styles.sceneCaption} aria-live="polite"><span />{sceneLabel}</p>

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
            <p className={styles.result} id="control-result" aria-live="polite">
              <span className={styles.resultMark} aria-hidden="true">{stopped ? "×" : "✓"}</span>
              {stopped
                ? `${isEs ? "Se detiene por" : "Stopped by"}: ${blockers.join(", ")}.`
                : (isEs ? "Las condiciones coinciden. Puede seguir a revisión; aún no autoriza ni paga." : "The conditions match. It can go to review; this does not authorize or pay.")}
            </p>

            <div className={styles.detailGrid}>
              <div className={focus === 0 ? styles.detailActive : ""} data-invalid={recipientChanged}>
                <span>{c.recipient}</span><strong>{recipientChanged ? (isEs ? "Destino distinto" : "Different recipient") : c.recipientValue}</strong>
              </div>
              <div className={focus === 2 ? styles.detailActive : ""} data-invalid={expired}>
                <span>{c.expiry}</span><strong>{expired ? (isEs ? "Vencida" : "Expired") : c.expiryValue}</strong>
              </div>
            </div>
            <div className={styles.focusLine} aria-live="polite"><span>0{focus + 1}</span>{focusDetails[focus]}</div>

            <div className={styles.previewFooter}>
              <div>
                <span className={styles.footerLabel}>{control.permission.stopLabel}</span>
                <div className={styles.conditions}>{control.permission.stopConditions.map((condition, index) => (
                  <button key={condition} type="button" aria-pressed={activeConditions[index]} aria-controls="control-result" onClick={() => toggleCondition(index)}>
                    {condition}
                  </button>
                ))}</div>
              </div>
              <button className={styles.pauseButton} type="button" onClick={resetExample}>
                <span aria-hidden="true">↺</span>
                {isEs ? "Restablecer" : "Reset"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
