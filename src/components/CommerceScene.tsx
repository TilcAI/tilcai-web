"use client";

import type { Copy } from "@/lib/i18n";
import { Icon, type IconName } from "./Icon";
import { useDepthMotion } from "./useDepthMotion";

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
