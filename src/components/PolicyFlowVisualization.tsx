"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeChange,
  type NodeProps,
} from "@xyflow/react";
import { Icon, type IconName } from "./Icon";
import type { Decision } from "@/lib/demo/scenarios";
import type { Copy } from "@/lib/i18n";
import styles from "./PolicyFlowVisualization.module.css";

type FlowTone = "neutral" | "policy" | "allow" | "deny" | "approval";

type FlowNodeData = {
  title: string;
  detail?: string;
  facts?: { label: string; value: string; tone?: "allow" | "deny" }[];
  actionLabel?: string;
  onAction?: () => void;
  tone: FlowTone;
  icon: IconName;
  input?: boolean;
  output?: boolean;
  approved?: boolean;
  compact?: boolean;
  blocked?: boolean;
};

type PolicyFlowNode = Node<FlowNodeData, "tilcaiNode">;

export type PolicyFlowNodeId = "user" | "agent" | "policy" | "review" | "business-agent" | "business";

type PolicyFlowVisualizationProps = {
  t: Copy["demo"];
  scenarioTitle: string;
  businessName: string;
  requestedRecipient: string;
  amount: string;
  limit: string;
  currency: string;
  displayedDecision: Decision;
  needsApproval: boolean;
  approvalSimulated: boolean;
  selectedNodeId: PolicyFlowNodeId;
  onSelectNode: (nodeId: PolicyFlowNodeId) => void;
  onApprove: () => void;
  changedRecipient: boolean;
  amountOverLimit: boolean;
};

const mobileQuery = "(max-width: 900px)";

function subscribeToLayout(callback: () => void) {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getLayoutSnapshot() {
  return window.matchMedia(mobileQuery).matches;
}

function getServerLayoutSnapshot() {
  return false;
}

function TilcAINode({
  data,
  selected,
  targetPosition = Position.Left,
  sourcePosition = Position.Right,
}: NodeProps<PolicyFlowNode>) {
  return (
    <div
      className={`${styles.node} ${styles[data.tone]}${data.compact ? ` ${styles.compact}` : ""}${data.blocked ? ` ${styles.policyBlocked}` : ""}${selected ? ` ${styles.selected}` : ""}`}
      aria-hidden={data.onAction && selected ? undefined : true}
    >
      {data.input && (
        <Handle type="target" position={targetPosition} isConnectable={false} className={styles.handle} />
      )}
      <span className={styles.nodeIcon}>
        <Icon name={data.icon} className={styles.icon} />
      </span>
      <span className={styles.nodeBody}>
        <strong className={styles.nodeTitle}>
          {data.title}
          {data.approved && <span className={styles.approvedMark}>✓</span>}
        </strong>
        {(selected || data.compact || data.tone === "approval") && data.detail && (
          <span className={styles.nodeDetail}>{data.detail}</span>
        )}
        {selected && data.facts && (
          <dl className={styles.nodeFacts}>
            {data.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd className={fact.tone ? styles[`fact_${fact.tone}`] : undefined}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {selected && data.onAction && (
          <button
            type="button"
            className={`nodrag nopan ${styles.nodeAction}`}
            onClick={(event) => {
              event.stopPropagation();
              data.onAction?.();
            }}
          >
            {data.actionLabel}
          </button>
        )}
      </span>
      {data.output && (
        <Handle type="source" position={sourcePosition} isConnectable={false} className={styles.handle} />
      )}
    </div>
  );
}

const nodeTypes = { tilcaiNode: TilcAINode };

const edgeColors: Record<FlowTone, string> = {
  neutral: "var(--turquoise)",
  policy: "var(--purple-400)",
  allow: "var(--allow)",
  deny: "var(--deny)",
  approval: "var(--human)",
};

function createEdge(
  id: string,
  source: string,
  target: string,
  tone: FlowTone,
  label?: string,
): Edge {
  const color = edgeColors[tone];

  return {
    id,
    source,
    target,
    type: "smoothstep",
    label,
    labelStyle: {
      fill: color,
      fontFamily: "var(--mono)",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: ".04em",
    },
    labelShowBg: true,
    labelBgStyle: {
      fill: "var(--bg-deep)",
      fillOpacity: 0.96,
      stroke: color,
      strokeWidth: 1,
    },
    labelBgPadding: [7, 5],
    labelBgBorderRadius: 5,
    className: styles[`edge_${tone}`],
    markerEnd: { type: MarkerType.ArrowClosed, color, width: 15, height: 15 },
    domAttributes: { "aria-hidden": true },
  };
}

export function PolicyFlowVisualization({
  t,
  scenarioTitle,
  businessName,
  requestedRecipient,
  amount,
  limit,
  currency,
  displayedDecision,
  needsApproval,
  approvalSimulated,
  selectedNodeId,
  onSelectNode,
  onApprove,
  changedRecipient,
  amountOverLimit,
}: PolicyFlowVisualizationProps) {
  const vertical = useSyncExternalStore(subscribeToLayout, getLayoutSnapshot, getServerLayoutSnapshot);
  const isDenied = displayedDecision === "DENY";
  const isPending = needsApproval && !approvalSimulated;
  const isApproved = needsApproval && approvalSimulated;

  const onNodesChange = useCallback((changes: NodeChange<PolicyFlowNode>[]) => {
    for (const change of changes) {
      if (change.type === "select" && change.selected) {
        onSelectNode(change.id as PolicyFlowNodeId);
        break;
      }
    }
  }, [onSelectNode]);

  const { nodes, edges } = useMemo(() => {
    const verticalDirection = { targetPosition: Position.Top, sourcePosition: Position.Bottom };
    const horizontalDirection = { targetPosition: Position.Left, sourcePosition: Position.Right };
    const positions = vertical
      ? {
          user: { x: 20, y: 0 },
          agent: { x: 20, y: 116 },
          policy: { x: 0, y: 232 },
          outcome: { x: 20, y: 420 },
          businessAgent: { x: 20, y: needsApproval ? 540 : 420 },
          business: { x: 20, y: needsApproval ? 656 : 536 },
        }
      : {
          user: { x: 0, y: 54 },
          agent: { x: 215, y: 54 },
          policy: { x: 430, y: 0 },
          outcome: { x: 450, y: 220 },
          businessAgent: { x: 790, y: needsApproval ? 220 : 54 },
          business: { x: 1015, y: needsApproval ? 220 : 54 },
        };
    const baseDirection = vertical ? verticalDirection : horizontalDirection;
    const policyDirection = vertical || isDenied || needsApproval
      ? verticalDirection
      : horizontalDirection;
    const branchDirection = vertical ? verticalDirection : horizontalDirection;
    const selectableNode = (id: PolicyFlowNodeId, title: string, containsAction = false) => ({
      selected: selectedNodeId === id,
      selectable: true,
      focusable: true,
      deletable: false,
      ariaRole: containsAction ? "group" as const : "button" as const,
      ariaLabel: `${t.flow.viewDetails}: ${title}${containsAction && selectedNodeId === id ? `. ${t.flow.selected}` : ""}`,
      domAttributes: {
        "aria-controls": "demo-result",
        ...(containsAction ? {} : { "aria-pressed": selectedNodeId === id }),
      },
    });

    const policyFacts: FlowNodeData["facts"] = changedRecipient
      ? [
          { label: t.flow.requestedDestination, value: requestedRecipient, tone: "deny" },
          { label: t.flow.allowedDestination, value: businessName },
        ]
      : [
          { label: t.fields.request, value: `${amount} ${currency}`, tone: amountOverLimit ? "deny" : undefined },
          { label: t.fields.limit, value: `${limit} ${currency}` },
        ];

    const nextNodes: PolicyFlowNode[] = [
      {
        id: "user",
        type: "tilcaiNode",
        position: positions.user,
        initialWidth: 200,
        initialHeight: selectedNodeId === "user" ? 110 : 96,
        data: { title: t.flow.user, detail: scenarioTitle, tone: "neutral", icon: "target", output: true },
        ...selectableNode("user", t.flow.user),
        ...baseDirection,
      },
      {
        id: "agent",
        type: "tilcaiNode",
        position: positions.agent,
        initialWidth: 200,
        initialHeight: selectedNodeId === "agent" ? 110 : 96,
        data: { title: t.flow.tilcaiAgent, detail: t.flow.tilcaiAgentRole, tone: "neutral", icon: "agent", input: true, output: true },
        ...selectableNode("agent", t.flow.tilcaiAgent),
        ...baseDirection,
      },
      {
        id: "policy",
        type: "tilcaiNode",
        position: positions.policy,
        initialWidth: 240,
        initialHeight: selectedNodeId === "policy" ? 168 : 110,
        data: { title: t.flow.policy, facts: policyFacts, tone: "policy", icon: "shield", input: true, output: true, blocked: isDenied },
        ...selectableNode("policy", t.flow.policy),
        targetPosition: baseDirection.targetPosition,
        sourcePosition: policyDirection.sourcePosition,
      },
    ];

    const nextEdges: Edge[] = [
      createEdge("user-agent", "user", "agent", "neutral"),
      createEdge("agent-policy", "agent", "policy", "neutral"),
    ];

    if (isDenied) {
      nextNodes.push({
        id: "blocked",
        type: "tilcaiNode",
        position: positions.outcome,
        initialWidth: 220,
        initialHeight: 86,
        data: {
          title: t.flow.blocked,
          detail: changedRecipient ? t.flow.recipientNotAllowed : t.flow.overLimit,
          tone: "deny",
          icon: "x",
          input: true,
          compact: true,
        },
        selectable: false,
        focusable: false,
        deletable: false,
        ...verticalDirection,
      });
      nextEdges.push(createEdge("policy-blocked", "policy", "blocked", "deny"));
    } else if (needsApproval) {
      nextNodes.push({
        id: "review",
        type: "tilcaiNode",
        position: positions.outcome,
        initialWidth: 200,
        initialHeight: isPending && selectedNodeId === "review" ? 148 : selectedNodeId === "review" ? 110 : 96,
        data: {
          title: isApproved ? t.approval.complete : t.flow.humanReview,
          detail: isApproved ? undefined : t.flow.pending,
          tone: isApproved ? "allow" : "approval",
          icon: "rules",
          input: true,
          output: isApproved,
          approved: isApproved,
          actionLabel: isPending ? t.approval.action : undefined,
          onAction: isPending ? onApprove : undefined,
        },
        ...selectableNode("review", t.flow.humanReview, isPending),
        targetPosition: Position.Top,
        sourcePosition: branchDirection.sourcePosition,
      });
      nextEdges.push(createEdge("policy-review", "policy", "review", "approval", t.flow.reviewRequired));
    }

    if (!isDenied && !isPending) {
      nextNodes.push(
        {
          id: "business-agent",
          type: "tilcaiNode",
          position: positions.businessAgent,
          initialWidth: 200,
          initialHeight: selectedNodeId === "business-agent" ? 110 : 96,
          data: { title: t.flow.businessAgent, detail: t.flow.businessAgentRole, tone: "neutral", icon: "agent", input: true, output: true },
          ...selectableNode("business-agent", t.flow.businessAgent),
          ...branchDirection,
        },
        {
          id: "business",
          type: "tilcaiNode",
          position: positions.business,
          initialWidth: 200,
          initialHeight: selectedNodeId === "business" ? 110 : 96,
          data: { title: t.flow.business, detail: businessName, tone: "neutral", icon: "store", input: true },
          ...selectableNode("business", t.flow.business),
          ...branchDirection,
        },
      );

      nextEdges.push(
        createEdge(
          isApproved ? "review-business-agent" : "policy-business-agent",
          isApproved ? "review" : "policy",
          "business-agent",
          "allow",
          t.flow.allowed,
        ),
        createEdge("business-agent-business", "business-agent", "business", "neutral"),
      );
    }

    return { nodes: nextNodes, edges: nextEdges };
  }, [
    amount,
    amountOverLimit,
    businessName,
    changedRecipient,
    currency,
    isApproved,
    isDenied,
    isPending,
    limit,
    needsApproval,
    onApprove,
    requestedRecipient,
    scenarioTitle,
    selectedNodeId,
    t,
    vertical,
  ]);

  const canvasStateClass = isDenied
    ? styles.denyCanvas
    : isPending
      ? styles.pendingCanvas
      : isApproved
        ? styles.approvedCanvas
        : styles.allowCanvas;

  return (
    <section className={styles.visualization}>
      <div className={`${styles.canvas} ${canvasStateClass}`}>
        <ReactFlow
          aria-label={t.flow.label}
          proOptions={{ hideAttribution: true }}
          key={`${vertical ? "vertical" : "horizontal"}-${displayedDecision}-${approvalSimulated}`}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          fitView
          fitViewOptions={{ padding: vertical ? 0.06 : 0.1, minZoom: 0.6, maxZoom: 1 }}
          minZoom={0.6}
          maxZoom={1}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable
          edgesFocusable={false}
          elementsSelectable
          panOnDrag={false}
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          autoPanOnNodeFocus={false}
          preventScrolling={false}
          deleteKeyCode={null}
          ariaLabelConfig={{
            "node.a11yDescription.default": t.flow.nodeA11yDescription,
            "node.a11yDescription.keyboardDisabled": t.flow.nodeA11yDescription,
          }}
        />
      </div>
    </section>
  );
}
