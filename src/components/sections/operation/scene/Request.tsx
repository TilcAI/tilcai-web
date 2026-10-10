import { MAIN_START } from "./geometry";
import s from "./scene.module.css";

/** `#request`: the request document. Drawn around (0,0) so the timeline can carry it along the route. */
export function Request({ label }: { label: string }) {
  return (
    <g id="request" data-k="request">
      <g transform={`translate(${MAIN_START.x} ${MAIN_START.y})`}>
        <g data-k="doc" >
          <path d="M-24 -30h32l16 16v44a6 6 0 0 1-6 6h-42a6 6 0 0 1-6-6v-54a6 6 0 0 1 6-6Z" fill="url(#op-panel)" stroke="#48d9ff" strokeOpacity=".8" />
          <path d="M8 -30v12a4 4 0 0 0 4 4h12" fill="none" stroke="#48d9ff" strokeOpacity=".8" />
          <path d="M-14 -4h28M-14 6h28M-14 16h16" fill="none" stroke="#ac76ff" strokeWidth="2.4" strokeLinecap="round" />
          <text className={`${s.small} ${s.center}`} x="0" y="46" style={{ fontSize: 11.5 }}>{label}</text>
        </g>
      </g>
      <circle data-k="dot-request" r="9" fill="url(#op-dot-cyan)" opacity="0" />
    </g>
  );
}
