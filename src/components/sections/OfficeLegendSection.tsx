import type { Copy } from "@/lib/i18n";
import type { RoomId } from "../office/types";
import { SectionHead } from "./shared";

// Same order a purchase follows through the office.
const ORDER: RoomId[] = ["hub", "business", "core", "approval", "budget", "vault", "receipts", "cafe"];

/** Explains each room of the hero simulation. */
export function OfficeLegendSection({ t }: { t: Copy }) {
  const o = t.office;
  return (
    <section id="office" className="section" aria-labelledby="office-title">
      <div className="container">
        <SectionHead id="office-title" eyebrow={o.legend.eyebrow} title={o.legend.title} dim={o.legend.titleDim} lead={o.legend.lead} />
        <ol className="legend-grid" role="list">
          {ORDER.map((id) => (
            <li key={id} className={`legend-card room-${id} reveal`}>
              <span className="legend-swatch" aria-hidden="true" />
              <h3>{o.rooms[id].name}</h3>
              <p className="legend-who">{o.rooms[id].who}</p>
              <p>{o.rooms[id].body}</p>
            </li>
          ))}
        </ol>
        <p className="legend-note reveal">{o.legend.note}</p>
      </div>
    </section>
  );
}
