"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { Icon, type IconName } from "./Icon";
import type { Decision } from "@/lib/demo/scenarios";
import type { Copy } from "@/lib/i18n";
import "@xyflow/react/dist/style.css";
import styles from "./PolicyFlowVisualization.module.css";

type FlowTone = "neutral" | "policy" | "allow" | "deny" | "approval";

type FlowNodeData = {
  title: string;
  detail?: string;
  facts?: { label: string; value: string; tone?: "allow" | "deny" }[];
  tone: FlowTone;
  icon: IconName;
  input?: boolean;
  output?: boolean;
  approved?: boolean;
  compact?: boolean;
  highlighted?: boolean;
};

type PolicyFlowNode = Node<FlowNodeData, "tilcaiNode">;

type PolicyFlowVisualizationProps = {
  t: Copy["demo"];
  activeStep: number;
  scenarioTitle: string;
  businessName: string;
  amount: string;
  limit: string;
  currency: string;
  displayedDecision: Decision;
  needsApproval: boolean;
  approvalSimulated: boolean;
  changedRecipient: boolean;
  amountOverLimit: boolean;
};

function TilcAINode({
  data,
  targetPosition = Position.Left,
  sourcePosition = Position.Right,
}: NodeProps<PolicyFlowNode>) {
  return (
    <div
      className={`${styles.node} ${styles[data.tone]}${data.compact ? ` ${styles.compact}` : ""}`}
      aria-hidden="true"
      data-highlighted={data.highlighted}
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
        {data.detail && <span className={styles.nodeDetail}>{data.detail}</span>}
        {data.facts && (
          <dl className={styles.nodeFacts}>
            {data.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd className={fact.tone ? styles[`fact_${fact.tone}`] : undefined}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </span>
      {data.output && (
        <Handle type="source" position={sourcePosition} isConnectable={false} className={styles.handle} />
      )}
    </div>
  );
}

const nodeTypes = { tilcaiNode: TilcAINode };

function FitDiagram({ container }: { container: RefObject<HTMLDivElement | null> }) {
  const { fitBounds, getNodes, getNodesBounds, viewportInitialized } = useReactFlow();
  useEffect(() => {
    if (!viewportInitialized || !container.current) return;
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        void fitBounds(getNodesBounds(getNodes()), { padding: 0.15, duration: 0 });
      });
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(container.current);
    schedule();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [container, fitBounds, getNodes, getNodesBounds, viewportInitialized]);
  return null;
}

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
  activeStep,
  scenarioTitle,
  businessName,
  amount,
  limit,
  currency,
  displayedDecision,
  needsApproval,
  approvalSimulated,
  changedRecipient,
  amountOverLimit,
}: PolicyFlowVisualizationProps) {
  const canvas = useRef<HTMLDivElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const checkSize = () => {
      if (element.clientWidth > 0 && element.clientHeight > 0) setCanvasReady(true);
    };
    const observer = new ResizeObserver(checkSize);
    observer.observe(element);
    checkSize();
    return () => observer.disconnect();
  }, []);

  const isDenied = displayedDecision === "DENY";
  const isPending = needsApproval && !approvalSimulated;
  const isApproved = needsApproval && approvalSimulated;

  const { nodes, edges } = useMemo(() => {
    const verticalDirection = { targetPosition: Position.Top, sourcePosition: Position.Bottom };
    const horizontalDirection = { targetPosition: Position.Left, sourcePosition: Position.Right };
    // A folded route keeps the original graph readable beside the scroll cards.
    const positions = {
      user: { x: 0, y: 0 },
      agent: { x: 280, y: 0 },
      policy: { x: 260, y: 145 },
      outcome: { x: 0, y: 180 },
      businessAgent: { x: 0, y: needsApproval ? 345 : 180 },
      business: { x: needsApproval ? 280 : 0, y: 345 },
    };

    const policyFacts: FlowNodeData["facts"] = [
      {
        label: amountOverLimit ? t.fields.amount : t.fields.limit,
        value: amountOverLimit ? `${amount} > ${limit} ${currency}` : `${limit} ${currency}`,
        tone: amountOverLimit ? "deny" : undefined,
      },
      {
        label: t.flow.destination,
        value: changedRecipient ? t.flow.recipientNotAllowed : t.flow.allowed,
        tone: changedRecipient ? "deny" : "allow",
      },
    ];

    const nextNodes: PolicyFlowNode[] = [
      {
        id: "user",
        type: "tilcaiNode",
        position: positions.user,
        initialWidth: 200,
        initialHeight: 96,
        data: { title: t.flow.user, detail: scenarioTitle, tone: "neutral", icon: "target", output: true },
        ...horizontalDirection,
      },
      {
        id: "agent",
        type: "tilcaiNode",
        position: positions.agent,
        initialWidth: 200,
        initialHeight: 96,
        data: { title: t.flow.tilcaiAgent, tone: "neutral", icon: "agent", input: true, output: true },
        targetPosition: Position.Left,
        sourcePosition: Position.Bottom,
      },
      {
        id: "policy",
        type: "tilcaiNode",
        position: positions.policy,
        initialWidth: 240,
        initialHeight: 168,
        data: { title: t.flow.policy, facts: policyFacts, tone: "policy", icon: "shield", input: true, output: true },
        targetPosition: Position.Top,
        sourcePosition: Position.Left,
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
        targetPosition: Position.Right,
      });
      nextEdges.push(createEdge("policy-blocked", "policy", "blocked", "deny"));
    } else if (needsApproval) {
      nextNodes.push({
        id: "review",
        type: "tilcaiNode",
        position: positions.outcome,
        initialWidth: 200,
        initialHeight: 96,
        data: {
          title: t.flow.humanReview,
          detail: isApproved ? t.flow.approved : t.flow.pending,
          tone: isApproved ? "allow" : "approval",
          icon: "rules",
          input: true,
          output: isApproved,
          approved: isApproved,
        },
        targetPosition: Position.Right,
        sourcePosition: Position.Bottom,
      });
      nextEdges.push(createEdge("policy-review", "policy", "review", "approval"));
    }

    if (!isDenied && !isPending) {
      nextNodes.push(
        {
          id: "business-agent",
          type: "tilcaiNode",
          position: positions.businessAgent,
          initialWidth: 200,
          initialHeight: 96,
          data: { title: t.flow.businessAgent, tone: "neutral", icon: "agent", input: true, output: true },
          targetPosition: needsApproval ? Position.Top : Position.Right,
          sourcePosition: needsApproval ? Position.Right : Position.Bottom,
        },
        {
          id: "business",
          type: "tilcaiNode",
          position: positions.business,
          initialWidth: 200,
          initialHeight: 96,
          data: { title: t.flow.business, detail: businessName, tone: "neutral", icon: "store", input: true },
          ...(needsApproval ? horizontalDirection : verticalDirection),
        },
      );

      nextEdges.push(
        createEdge(
          isApproved ? "review-business-agent" : "policy-business-agent",
          isApproved ? "review" : "policy",
          "business-agent",
          "allow",
        ),
        createEdge("business-agent-business", "business-agent", "business", "neutral"),
      );
    }

    const highlighted = activeStep === 0 ? ["user", "agent"]
      : activeStep === 1 ? ["policy"] : ["blocked", "review", "business-agent", "business"];
    return {
      nodes: nextNodes.map(node => ({ ...node, data: { ...node.data, highlighted: highlighted.includes(node.id) } })),
      edges: nextEdges,
    };
  }, [
    amount,
    activeStep,
    amountOverLimit,
    businessName,
    changedRecipient,
    currency,
    isApproved,
    isDenied,
    isPending,
    limit,
    needsApproval,
    scenarioTitle,
    t,
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
      <p className={styles.label} aria-hidden="true">{t.flow.label}</p>
      <div ref={canvas} className={`${styles.canvas} ${canvasStateClass}`}>
        {canvasReady && <ReactFlow
          aria-label={t.flow.label}
          key={`${displayedDecision}-${approvalSimulated}`}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          minZoom={0.3}
          maxZoom={1}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          elementsSelectable={false}
          panOnDrag={false}
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          autoPanOnNodeFocus={false}
          preventScrolling={false}
          disableKeyboardA11y
        >
          <FitDiagram container={canvas} />
        </ReactFlow>}
      </div>
    </section>
  );
}
