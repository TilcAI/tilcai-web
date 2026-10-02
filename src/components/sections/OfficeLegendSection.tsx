import type { Copy } from "@/lib/i18n";
import type { RoomId } from "../office/types";
import { TilcAIOfficeParallax } from "./TilcAIOfficeParallax";

// Same order a purchase follows through the office.
const ORDER: RoomId[] = ["hub", "business", "core", "approval", "budget", "vault", "receipts", "cafe"];

/** "How to read the office": the cinematic headline scene. The room cards follow in `OfficeRoomsSection`. */
export function OfficeLegendSection({ t }: { t: Copy }) {
  const { legend } = t.office;
  return (
    <TilcAIOfficeParallax
      id="office"
      labelledBy="office-title"
      eyebrow={legend.eyebrow}
      title={legend.title}
      titleDim={legend.titleDim}
      lead={legend.lead}
    />
  );
}

/** One card per room of the hero simulation, plus the note that the numbers are illustrative. */
export function OfficeRoomsSection({ t }: { t: Copy }) {
  const o = t.office;
  return (
    <section id="office-rooms" className="section" aria-label={o.legend.eyebrow}>
      <div className="container">
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
