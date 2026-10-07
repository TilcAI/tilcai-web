"use client";

import { useCallback, useState } from "react";
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
import { Icon, type IconName } from "./Icon";
import styles from "./PolicyDemo.module.css";
import { PolicyFlowVisualization, type PolicyFlowNodeId } from "./PolicyFlowVisualization";

const scenarioIcons: Record<ScenarioId, IconName> = {
  cinema: "play",
  "digital-service": "panel",
  "scheduled-purchase": "repeat",
};

function defaultNodeForDecision(decision: Decision): PolicyFlowNodeId {
  return decision === "REQUIRE_APPROVAL" ? "review" : "policy";
}

export function PolicyDemo({ t }: { t: Copy["demo"] }) {
  const [scenarioId, setScenarioId] = useState<ScenarioId>(initialScenarioId);
  const [variantId, setVariantId] = useState<VariantId>(initialVariantId);
  const [approvalSimulated, setApprovalSimulated] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<PolicyFlowNodeId>("policy");

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
    const nextScenarioData = demoScenarios.find((entry) => entry.id === nextScenario) ?? demoScenarios[0];
    setScenarioId(nextScenario);
    setVariantId(initialVariantId);
    setApprovalSimulated(false);
    setSelectedNodeId(defaultNodeForDecision(nextScenarioData.variants[initialVariantId].decision));
  };

  const chooseVariant = (nextVariant: VariantId) => {
    setVariantId(nextVariant);
    setApprovalSimulated(false);
    setSelectedNodeId(defaultNodeForDecision(scenario.variants[nextVariant].decision));
  };

  const reset = () => {
    setScenarioId(initialScenarioId);
    setVariantId(initialVariantId);
    setApprovalSimulated(false);
    setSelectedNodeId("policy");
  };

  const simulateApproval = useCallback(() => {
    setApprovalSimulated(true);
    setSelectedNodeId("review");
  }, []);

  return (
    <div className={`reveal ${styles.explorer}`}>
      <div className={styles.selectorStage}>
        <div className={`${styles.step} ${styles.stepComplete}`} aria-hidden="true">
          <span className={styles.stepNumber}>01</span>
          <span className={styles.stepCopy}>
            <strong>{t.scenarioPrompt}</strong>
            <small>{scenarioCopy.title}</small>
          </span>
        </div>

        <span className={`${styles.stepRail} ${styles.railOne}`} aria-hidden="true" />

        <div className={`${styles.step} ${styles.stepCurrent}`} aria-hidden="true">
          <span className={styles.stepNumber}>02</span>
          <span className={styles.stepCopy}>
            <strong>{t.variantPrompt}</strong>
            <small>{variantCopy.label}</small>
          </span>
        </div>

        <div className={`demo-choices ${styles.choiceGroup} ${styles.scenarioChoices}`} role="group" aria-label={t.scenarioPrompt}>
          {demoScenarios.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={`demo-choice${scenarioId === entry.id ? " is-selected" : ""}`}
              aria-pressed={scenarioId === entry.id}
              aria-controls="demo-result"
              onClick={() => chooseScenario(entry.id)}
            >
              <strong className={styles.scenarioTitle}>
                <Icon name={scenarioIcons[entry.id]} className={styles.scenarioIcon} />
                <span>{t.scenarios[entry.id].title}</span>
              </strong>
              <span>{t.scenarios[entry.id].summary}</span>
            </button>
          ))}
        </div>

        <div className={`demo-choices ${styles.choiceGroup} ${styles.variantChoices}`} role="group" aria-label={t.variantPrompt}>
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

      <div className={styles.flowResult}>
        <div className={styles.flowHeader} aria-hidden="true">
          <div className={`${styles.step} ${styles.stepResult} ${styles[`result_${displayedDecision.toLowerCase()}`]}`}>
            <span className={styles.stepNumber}>03</span>
            <span className={styles.stepCopy}>
              <strong>{t.flow.label}</strong>
              <small>{t.outcomes[displayedDecision]}</small>
            </span>
          </div>
        </div>
        <PolicyFlowVisualization
          t={t}
          scenarioTitle={scenarioCopy.title}
          businessName={scenarioCopy.recipient}
          requestedRecipient={currentRecipient}
          amount={currentAmount}
          limit={scenario.quote.limit}
          currency={scenario.quote.currency}
          displayedDecision={displayedDecision}
          needsApproval={needsApproval}
          approvalSimulated={approvalSimulated}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
          onApprove={simulateApproval}
          changedRecipient={changedRecipient}
          amountOverLimit={amountOverLimit}
        />
      </div>

      <div id="demo-result" className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {scenarioCopy.title}. {variantCopy.label}. {t.outcomes[displayedDecision]}.
        {variantCopy.reason && displayedDecision === "DENY" && ` ${variantCopy.reason}`}
        {needsApproval && (
          <span>
            {approvalSimulated ? t.approval.complete : t.approval.pending}
          </span>
        )}
      </div>

      <div className={styles.resetRow}>
        <button type="button" className={`btn btn-ghost ${styles.reset}`} onClick={reset}>
          {t.reset}
        </button>
      </div>

    </div>
  );
}
