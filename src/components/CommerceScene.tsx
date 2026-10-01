"use client";

import type { Copy } from "@/lib/i18n";
import { Icon, type IconName } from "./Icon";
import { useDepthMotion } from "./useDepthMotion";

export function CommerceScene({ t }: { t: Copy }) {
  const root = useDepthMotion("pointer");
  return (
    <figure className="commerce-figure">
      <div className="commerce-scene" ref={root} aria-hidden="true">
        <div className="scene-grid" />
        <div className="scene-orbit orbit-one" /><div className="scene-orbit orbit-two" />
        <div className="holo-core"><div className="core-face"><Icon name="shield" /><span>Tilc<span>AI</span></span></div></div>
        <div className="scene-node node-agent"><Icon name="target" /><span>{t.problem.cards[0].title}</span><small>MCP</small></div>
        <div className="scene-node node-business"><Icon name="store" /><span>{t.problem.cards[2].title}</span><small>{t.flow.steps[1].label}</small></div>
        <div className="scene-node node-authority"><Icon name="rules" /><span>{t.hero.facts[1]}</span></div>
        <div className="scene-node node-evidence"><Icon name="receipt" /><span>{t.hero.facts[0]}</span><small>Stellar</small></div>
        <span className="scene-coordinate">01 / MCP → TilcAI → Stellar</span>
      </div>
      <figcaption className="vision-note">{t.hero.visionNote}</figcaption>
    </figure>
  );
}

export function FlowLayers({ t }: { t: Copy }) {
  const root = useDepthMotion("scroll");
  const layers = [t.flow.steps[0], t.flow.steps[1], t.flow.steps[2], t.flow.after[1]];
  const icons: IconName[] = ["target", "store", "shield", "receipt"];
  return (
    <div className="flow-layers" ref={root} aria-hidden="true">
      <div className="layer-floor" />
      {layers.map((layer, index) => (
        <div className={`holo-layer layer-${index}`} key={layer.label}>
          <div className="layer-header"><span>0{index + 1}</span><Icon name={icons[index]} /></div>
          <span className="layer-title">{layer.label}</span>
          <div className="layer-glyph"><Icon name={icons[index]} /><i /><i /><i /></div>
          <span className="layer-caption">{index === 3 ? "Stellar / receipt" : "TilcAI / protocol"}</span>
        </div>
      ))}
    </div>
  );
}
