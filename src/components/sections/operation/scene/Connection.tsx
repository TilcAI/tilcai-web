import { MAIN_PATH } from "./geometry";

/** `#connection`: the route between agent and business, as two strokes: a soft glow and a thin line. */
export function Connection() {
  return (
    <g id="connection" data-k="connection" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path data-k="main-glow" d={MAIN_PATH} stroke="url(#op-route)" strokeWidth="10" opacity=".1" filter="url(#glow-purple)" />
      <path id="main-path" data-k="main-path" d={MAIN_PATH} stroke="url(#op-route)" strokeWidth="2" />
    </g>
  );
}
