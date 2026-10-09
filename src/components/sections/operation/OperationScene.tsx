import type { ComponentProps } from "react";
import { Agent } from "./scene/Agent";
import { AgentBadges } from "./scene/AgentBadges";
import { Approval } from "./scene/Approval";
import { Business } from "./scene/Business";
import { Connection } from "./scene/Connection";
import { Core } from "./scene/Core";
import { SceneDefs } from "./scene/Defs";
import { VIEW } from "./scene/geometry";
import { SceneGrid } from "./scene/Grid";
import { Offer } from "./scene/Offer";
import { Particles } from "./scene/Particles";
import { Payment } from "./scene/Payment";
import { Receipts } from "./scene/Receipts";
import { Request } from "./scene/Request";
import { Rules } from "./scene/Rules";

type SceneCopy = {
  agents: ComponentProps<typeof AgentBadges>["labels"];
  request: string;
  offer: ComponentProps<typeof Offer>["labels"];
  core: string; checks: string[]; requires: string; approvedTag: string;
  review: ComponentProps<typeof Approval>["review"];
  rail: string; stops: string[]; settled: string;
  receipts: ComponentProps<typeof Receipts>["receipts"];
};

/**
 * One SVG for the whole operation. Objects are added, moved and lit as the scroll advances; nothing is swapped out and the scene
 * never restarts. `data-depth` wraps each layer so the pointer can nudge it by a few pixels (each layer has its own wrapper,
 * so that never fights with the timeline, which moves the groups inside).
 */
export function OperationScene({ copy, agentLabel, businessLabel }: { copy: SceneCopy; agentLabel: string; businessLabel: string }) {
  return (
    <svg className="operation-scene" data-k="scene" viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`} fill="none" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <SceneDefs />
      <g id="svg-camera" data-k="camera">
        <g data-depth="2"><SceneGrid /></g>
        <g data-depth="4"><Business label={businessLabel} /></g>
        <g data-depth="5"><Agent label={agentLabel} /></g>
        <g data-depth="4"><Connection /></g>
        <g data-depth="8"><Request label={copy.request} /></g>
        <g data-depth="8"><Offer labels={copy.offer} /></g>
        <g data-depth="6"><Payment rail={copy.rail} stops={copy.stops} settled={copy.settled} /></g>
        <g data-depth="10"><Core label={copy.core} /></g>
        <g data-depth="8"><Rules checks={copy.checks} requires={copy.requires} approvedTag={copy.approvedTag} /></g>
        <g data-depth="8"><Approval review={copy.review} /></g>
        <g data-depth="8"><Receipts receipts={copy.receipts} /></g>
        <g data-depth="6"><AgentBadges labels={copy.agents} /></g>
        <g data-depth="10"><Particles /></g>
      </g>
    </svg>
  );
}
