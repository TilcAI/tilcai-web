import type { Copy } from "@/lib/i18n";
import { TilcAIOfficeParallax } from "./TilcAIOfficeParallax";
import { OfficeBuildingSection } from "./OfficeBuildingSection";

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

/** The same office rooms, now read as eight connected floors of one building. */
export function OfficeRoomsSection({ t }: { t: Copy }) {
  return <OfficeBuildingSection legend={t.office.legend} rooms={t.office.rooms} />;
}
