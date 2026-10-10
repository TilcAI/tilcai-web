"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  demoScenarios,
  initialScenarioId,
  initialVariantId,
  variantIds,
  type Decision,
  type ScenarioId,
  type VariantId,
} from "@/lib/demo/scenarios";
import type { Copy } from "@/lib/i18n";
import { acquireSmoothScroll } from "@/lib/smooth-scroll";
import { CaseArt } from "./CaseArt";
import { Icon, type IconName } from "./Icon";
import { PolicyFlowVisualization } from "./PolicyFlowVisualization";
import styles from "./PolicyDemo.module.css";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Each case keeps one colour from the picker to its drawing, so the three are told apart at a glance. */
const caseAccent: Record<ScenarioId, string> = {
  cinema: "255, 121, 198",
  "digital-service": "102, 216, 255",
  "scheduled-purchase": "169, 148, 255",
};

/** The colour of a condition says what it usually leads to; the words still carry the meaning. */
const variantLook: Record<VariantId, { rgb: string; icon: IconName }> = {
  valid: { rgb: "75, 202, 129", icon: "check" },
  "changed-recipient": { rgb: "237, 74, 109", icon: "repeat" },
  "over-limit": { rgb: "237, 74, 109", icon: "alert" },
  "requires-approval": { rgb: "255, 168, 1", icon: "user" },
};

/**
 * A highlight plate that slides behind the chosen option. It is measured from the chosen option's wrapper (a wrapper that
 * is mid-entrance has a transform, which does not change its offsets), and it only starts animating once it has been placed.
 */
function useSelectionPlate(selected: string) {
  const box = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const el = box.current;
    const plate = el?.querySelector<HTMLElement>("[data-plate]");
    if (!el || !plate) return;
    const place = () => {
      const on = el.querySelector<HTMLElement>('[aria-pressed="true"]')?.parentElement;
      if (!on) return;
      plate.style.setProperty("--sel-y", `${on.offsetTop}px`);
      plate.style.setProperty("--sel-h", `${on.offsetHeight}px`);
    };
    place();
    const frame = requestAnimationFrame(() => plate.setAttribute("data-ready", ""));
    const observer = new ResizeObserver(place);
    observer.observe(el);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [selected]);
  return box;
}

export function PolicyDemo({ t }: { t: Copy["demo"] }) {
  const root = useRef<HTMLDivElement>(null);
  const approvedLine = useRef<HTMLParagraphElement>(null);
  const [scenarioId, setScenarioId] = useState<ScenarioId>(initialScenarioId);
  const [variantId, setVariantId] = useState<VariantId>(initialVariantId);
  const [approvalSimulated, setApprovalSimulated] = useState(false);
  const [replay, setReplay] = useState(0);
  const [walking, setWalking] = useState(false);

  const scenario = demoScenarios.find((entry) => entry.id === scenarioId) ?? demoScenarios[0];
  const variant = scenario.variants[variantId];
  const scenarioCopy = t.scenarios[scenario.id];
  const variantCopy = t.variants[variantId];
  const currentRecipient = variant.recipient ? t.fields.alternativeRecipient : scenarioCopy.recipient;
  const currentAmount = variant.amount ?? scenario.quote.amount;
  const needsApproval = variant.decision === "REQUIRE_APPROVAL";
  const displayedDecision: Decision = needsApproval && approvalSimulated ? "ALLOW" : variant.decision;
  const changedRecipient = variantId === "changed-recipient";
  const amountOverLimit = variantId === "over-limit";
  const tone = displayedDecision === "ALLOW" ? "allow" : displayedDecision === "DENY" ? "deny" : "human";
  const verdictIcon: IconName = tone === "allow" ? "check" : tone === "deny" ? "x" : "user";
  const explanation = displayedDecision === "ALLOW" ? t.continuationNote : variantCopy.reason;

  // One sentence is announced per change; the visible blocks repeat it and are hidden from assistive technology.
  const announcement = [
    `${t.fields.result}: ${scenarioCopy.title}.`,
    `${variantCopy.label}.`,
    `${t.outcomes[displayedDecision]}.`,
    explanation,
    needsApproval ? (approvalSimulated ? t.approval.complete : t.approval.pending) : "",
  ].filter(Boolean).join(" ");

  const casePlate = useSelectionPlate(scenarioId);
  const variantPlate = useSelectionPlate(variantId);

  // Choosing what is already chosen walks the same path again.
  const again = () => setReplay((n) => n + 1);
  const chooseScenario = (next: ScenarioId) => {
    if (next === scenarioId) again();
    setScenarioId(next);
    setApprovalSimulated(false);
  };
  const chooseVariant = (next: VariantId) => {
    if (next === variantId) again();
    setVariantId(next);
    setApprovalSimulated(false);
  };
  const reset = () => {
    again();
    setScenarioId(initialScenarioId);
    setVariantId(initialVariantId);
    setApprovalSimulated(false);
  };

  useEffect(() => acquireSmoothScroll(), []);

  // The pressed button is replaced by its outcome; keyboard focus follows it instead of falling back to the page.
  useEffect(() => {
    if (approvalSimulated) approvedLine.current?.focus({ preventScroll: true });
  }, [approvalSimulated]);

  // One entrance for the whole panel, once. Everything is readable before it runs.
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = Array.from(el.querySelectorAll<HTMLElement>("[data-enter]"));
      gsap.set(items, { opacity: 0, y: 16 });
      const tl = gsap.timeline({ paused: true });
      tl.to(items, { opacity: 1, y: 0, duration: 0.8, stagger: 0.045, ease: "expo.out", clearProps: "opacity,transform" });
      const trigger = ScrollTrigger.create({ trigger: el, start: "top 84%", once: true, onEnter: () => tl.play() });
      return () => { trigger.kill(); tl.kill(); };
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={root} className={styles.console} data-decision={tone}>
      <span className={styles.aura} aria-hidden="true" />

      <header className={styles.bar} data-enter>
        <p className={styles.sandbox}>
          <span className={styles.sandboxDot} aria-hidden="true" />
          {t.eyebrow}
        </p>
        <button type="button" className={styles.reset} onClick={reset}>
          <Icon name="repeat" className={styles.resetIcon} />
          {t.reset}
        </button>
      </header>

      <div className={styles.body}>
        <div className={styles.controls}>
          <div className={`${styles.group} ${styles.cases}`} role="group" aria-label={t.scenarioPrompt}>
            <p className={styles.groupLabel} data-enter>
              <span className={styles.step} aria-hidden="true">01</span>
              {t.scenarioPrompt}
            </p>
            <div ref={casePlate} className={styles.options} style={{ "--pt": caseAccent[scenarioId] } as CSSProperties}>
              <span className={styles.plate} data-plate aria-hidden="true" />
              {demoScenarios.map((entry) => {
                const copy = t.scenarios[entry.id];
                const on = scenarioId === entry.id;
                return (
                  <div key={entry.id} data-enter>
                    <button
                      type="button"
                      className={`${styles.option} ${styles.caseOption}`}
                      data-kind="case"
                      data-art-live={on || undefined}
                      aria-pressed={on}
                      aria-controls="demo-result"
                      style={{ "--accent": caseAccent[entry.id] } as CSSProperties}
                      onClick={() => chooseScenario(entry.id)}
                    >
                      <span className={styles.caseArt}><CaseArt id={entry.id} /></span>
                      <span className={styles.optionText}>
                        <strong>{copy.title}</strong>
                        <span>{copy.summary}</span>
                        <small className={styles.quote}>{entry.quote.amount} {entry.quote.currency} · {t.fields.limit} {entry.quote.limit}</small>
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`${styles.group} ${styles.conditions}`} role="group" aria-label={t.variantPrompt}>
            <p className={styles.groupLabel} data-enter>
              <span className={styles.step} aria-hidden="true">02</span>
              {t.variantPrompt}
            </p>
            <div ref={variantPlate} className={styles.options} style={{ "--pt": variantLook[variantId].rgb } as CSSProperties}>
              <span className={styles.plate} data-plate aria-hidden="true" />
              {variantIds.map((id) => {
                const copy = t.variants[id];
                const look = variantLook[id];
                return (
                  <div key={id} data-enter>
                    <button
                      type="button"
                      className={`${styles.option} ${styles.variantOption}`}
                      aria-pressed={variantId === id}
                      aria-controls="demo-result"
                      style={{ "--accent": look.rgb } as CSSProperties}
                      onClick={() => chooseVariant(id)}
                    >
                      <span className={styles.glyph} aria-hidden="true"><Icon name={look.icon} className={styles.glyphIcon} /></span>
                      <span className={styles.optionText}>
                        <strong>{copy.label}</strong>
                        {copy.detail && <span>{copy.detail}</span>}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.stage}>
          <section className={styles.request} aria-labelledby="demo-request-title" data-enter>
            <div key={scenarioId} className={styles.requestBody}>
              <h3 id="demo-request-title" className={styles.requestLabel}>{t.fields.request}</h3>
              <p className={styles.ask}>{scenarioCopy.request}</p>
              <dl className={styles.facts}>
                <div><dt>{t.fields.service}</dt><dd>{scenarioCopy.service}</dd></div>
                <div><dt>{t.fields.quantity}</dt><dd>{scenario.request.quantity}</dd></div>
                <div><dt>{t.fields.timing}</dt><dd>{scenarioCopy.timing}</dd></div>
              </dl>
            </div>
          </section>

          <div className={styles.flow} data-enter>
            <PolicyFlowVisualization
              t={t}
              scenarioTitle={scenarioCopy.title}
              businessName={scenarioCopy.recipient}
              recipient={currentRecipient}
              amount={currentAmount}
              limit={scenario.quote.limit}
              currency={scenario.quote.currency}
              displayedDecision={displayedDecision}
              needsApproval={needsApproval}
              approvalSimulated={approvalSimulated}
              changedRecipient={changedRecipient}
              amountOverLimit={amountOverLimit}
              runKey={`${scenarioId}:${variantId}:${replay}`}
              onWalking={setWalking}
            />
          </div>
        </div>

        <div className={styles.verdict} data-decision={tone} data-walking={walking || undefined} data-enter>
          <span className={styles.badge} aria-hidden="true"><Icon key={verdictIcon} name={verdictIcon} className={styles.badgeIcon} /></span>
          <div className={styles.verdictMain}>
            <div id="demo-result" className={styles.result} role="status" aria-live="polite" aria-atomic="true">
              <span className="sr-only">{announcement}</span>
              <div className={styles.resultVisual} aria-hidden="true">
                <p className={styles.context}>
                  {t.fields.result}
                  <span className={styles.trace}>{scenarioCopy.title} · {variantCopy.label}</span>
                </p>
                <div key={`${scenarioId}:${variantId}:${displayedDecision}`} className={styles.swap}>
                  <strong className={styles.outcome}>{t.outcomes[displayedDecision]}</strong>
                  {explanation && <p className={styles.reason}>{explanation}</p>}
                </div>
              </div>
            </div>

            {needsApproval && (
              <section className={styles.approval} aria-labelledby="demo-approval-title">
                <h3 id="demo-approval-title">{t.approval.title}</h3>
                {approvalSimulated ? (
                  <p ref={approvedLine} tabIndex={-1} className={styles.approved}>
                    <Icon name="check" className={styles.approvedIcon} />{t.approval.complete}
                  </p>
                ) : (
                  <button type="button" className={styles.approve} onClick={() => setApprovalSimulated(true)} aria-controls="demo-result" disabled={walking}>
                    {t.approval.action}
                    <Icon name="arrow" className={styles.approveIcon} />
                  </button>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
