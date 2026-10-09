import { CORE_AT } from "./geometry";
import s from "./scene.module.css";

/**
 * `#tilcai-core`: TilcAI as a small holographic cube with two slow rings. Drawn around (0,0): the timeline scales and
 * moves it, the CSS idle only turns the rings.
 */
export function Core({ label }: { label: string }) {
  return (
    <g id="tilcai-core" data-k="core"><g transform={`translate(${CORE_AT.x} ${CORE_AT.y})`}>
      <g data-k="core-inner">
        <ellipse data-k="core-halo" cx="0" cy="30" rx="150" ry="96" fill="url(#op-halo-violet)" />
        <ellipse data-k="core-halo-cyan" cx="0" cy="62" rx="110" ry="40" fill="url(#op-halo-cyan)" opacity=".6" />
        <g fill="none">
          <ellipse className={s.ring} cx="0" cy="48" rx="104" ry="32" stroke="#925fff" strokeOpacity=".6" strokeDasharray="4 8" />
          <ellipse className={`${s.ring} ${s.ringBack}`} cx="0" cy="48" rx="132" ry="42" stroke="#48d9ff" strokeOpacity=".38" strokeDasharray="2 10" />
        </g>
        <path d="M-66 30 0 62 66 30 0 -2Z" fill="#0b0920" stroke="#48d9ff" strokeOpacity=".35" />
        <path d="M-62 -4 0 28v-70l-62-32Z" fill="url(#op-cube-left)" stroke="#8b67ff" strokeOpacity=".8" strokeLinejoin="round" />
        <path d="M0 28 62 -4v-70L0 -42Z" fill="url(#op-cube-right)" stroke="#8b67ff" strokeOpacity=".8" strokeLinejoin="round" />
        <path d="M-62 -74 0 -106 62 -74 0 -42Z" fill="url(#op-cube-top)" stroke="#d3c3ff" strokeOpacity=".9" strokeLinejoin="round" />
        {/* The TilcAI mark on the front faces: the cat's ears over a T. */}
        <g fill="#f7f5ff" transform="translate(-31 -36) skewY(26)">
          <path d="M-14 -18 -17 -34 -5 -26ZM14 -18 17 -34 5 -26Z" />
          <rect x="-16" y="-24" width="32" height="9" rx="3" />
          <rect x="-4" y="-15" width="8" height="26" rx="3" />
        </g>
        <path d="M-62 -4 0 28 62 -4" fill="none" stroke="#48d9ff" strokeOpacity=".7" />
      </g>
      <text className={`${s.title} ${s.center}`} x="0" y="-120" style={{ fontSize: 22 }}>{label}</text>
    </g></g>
  );
}
