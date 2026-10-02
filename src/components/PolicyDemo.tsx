"use client";

import { useState } from "react";
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
import styles from "./PolicyDemo.module.css";

export function PolicyDemo({ t }: { t: Copy["demo"] }) {
  const [scenarioId, setScenarioId] = useState<ScenarioId>(initialScenarioId);
  const [variantId, setVariantId] = useState<VariantId>(initialVariantId);
  const [approvalSimulated, setApprovalSimulated] = useState(false);

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

  const chooseScenario = (nextScenario: ScenarioId) => {
    setScenarioId(nextScenario);
    setVariantId(initialVariantId);
    setApprovalSimulated(false);
  };

  const chooseVariant = (nextVariant: VariantId) => {
    setVariantId(nextVariant);
    setApprovalSimulated(false);
  };

  const reset = () => {
    setScenarioId(initialScenarioId);
    setVariantId(initialVariantId);
    setApprovalSimulated(false);
  };

  const decisionClass = displayedDecision === "ALLOW"
    ? "tone-allow"
    : displayedDecision === "DENY"
      ? "tone-deny"
      : styles.approvalOutcome;
  const decisionBadgeClass = displayedDecision === "ALLOW"
    ? styles.badgeAllow
    : displayedDecision === "DENY"
      ? styles.badgeDeny
      : styles.badgeApproval;

  return (
    <div className={`reveal ${styles.explorer}`}>
      <div className={styles.selectors}>
        <div className={`demo-choices ${styles.choiceGroup}`} role="group" aria-label={t.scenarioPrompt}>
          <p className="demo-label">
            <span className={styles.stepNumber} aria-hidden="true">01</span>
            {t.scenarioPrompt}
          </p>
          {demoScenarios.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={`demo-choice${scenarioId === entry.id ? " is-selected" : ""}`}
              aria-pressed={scenarioId === entry.id}
              aria-controls="demo-result"
              onClick={() => chooseScenario(entry.id)}
            >
              <strong>{t.scenarios[entry.id].title}</strong>
              <span>{t.scenarios[entry.id].summary}</span>
            </button>
          ))}
        </div>

        <div className={`demo-choices ${styles.choiceGroup}`} role="group" aria-label={t.variantPrompt}>
          <p className="demo-label">
            <span className={styles.stepNumber} aria-hidden="true">02</span>
            {t.variantPrompt}
          </p>
          {variantIds.map((currentId) => {
            const copy = t.variants[currentId];
            return (
              <button
                key={currentId}
                type="button"
                className={`demo-choice${variantId === currentId ? " is-selected" : ""}`}
                aria-pressed={variantId === currentId}
                aria-controls="demo-result"
                onClick={() => chooseVariant(currentId)}
              >
                <strong>{copy.label}</strong>
                {copy.detail && <span>{copy.detail}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.resultGrid}>
        <div id="demo-result" className="demo-output" role="status" aria-live="polite" aria-atomic="true">
          <p className={styles.decisionContext}>
            <span className={styles.stepNumber} aria-hidden="true">03</span>
            {t.fields.result}
          </p>
          <div className={styles.decisionTrace} aria-hidden="true">
            <span>{variantCopy.label}</span>
            <span className={styles.traceArrow}>→</span>
            <span className={`${styles.decisionBadge} ${decisionBadgeClass}`}>{displayedDecision}</span>
          </div>
          <span className="sr-only">{scenarioCopy.title}. {variantCopy.label}. {displayedDecision}.</span>
          <span className={`demo-outcome ${decisionClass}`}>{t.outcomes[displayedDecision]}</span>
          {variantCopy.reason && displayedDecision !== "ALLOW" && <p>{variantCopy.reason}</p>}
          {displayedDecision === "ALLOW" && <p className={styles.continuationNote}>{t.continuationNote}</p>}
          {needsApproval && (
            <span className="sr-only">
              {approvalSimulated ? t.approval.complete : t.approval.pending}
            </span>
          )}
        </div>

        {needsApproval && (
          <section className={styles.approvalStep} aria-labelledby="demo-approval-title">
            <h3 id="demo-approval-title">
              <span className={styles.stepNumber} aria-hidden="true">04</span>
              {t.approval.title}
            </h3>
            {approvalSimulated ? (
              <p className={styles.approvalComplete}>{t.approval.complete}</p>
            ) : (
              <button
                type="button"
                className={`btn ${styles.approvalAction}`}
                onClick={() => setApprovalSimulated(true)}
                aria-controls="demo-result"
              >
                {t.approval.action}
              </button>
            )}
          </section>
        )}
      </div>

      <div className={styles.resetRow}>
        <button type="button" className={`btn btn-ghost ${styles.reset}`} onClick={reset}>
          {t.reset}
        </button>
      </div>

      <div className={styles.details}>
        <section className={styles.detailCard} aria-labelledby="demo-request-title">
          <h3 id="demo-request-title">{t.fields.request}</h3>
          <p className={styles.scenarioSummary}>{scenarioCopy.request}</p>
          <dl className={styles.facts}>
            <div className={`${styles.primaryFact} ${styles.wideFact}`}><dt>{t.fields.service}</dt><dd>{scenarioCopy.service}</dd></div>
            <div><dt>{t.fields.quantity}</dt><dd>{scenario.request.quantity}</dd></div>
            <div><dt>{t.fields.timing}</dt><dd>{scenarioCopy.timing}</dd></div>
          </dl>
        </section>

        <section className={styles.detailCard} aria-labelledby="demo-quote-title">
          <h3 id="demo-quote-title">{t.fields.quote}</h3>
          <dl className={styles.facts}>
            <div className={`${styles.primaryFact} ${styles.wideFact}${changedRecipient ? ` ${styles.invalidFact}` : ""}`}>
              <dt>{t.fields.recipient}</dt><dd>{currentRecipient}</dd>
            </div>
            <div className={`${styles.primaryFact}${amountOverLimit ? ` ${styles.invalidFact}` : ""}`}>
              <dt>{t.fields.amount}</dt><dd>{currentAmount} {scenario.quote.currency}</dd>
            </div>
            <div className={amountOverLimit ? styles.invalidFact : undefined}>
              <dt>{t.fields.limit}</dt><dd>{scenario.quote.limit} {scenario.quote.currency}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
