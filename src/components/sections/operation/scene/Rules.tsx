import { CHECK_AT, CORE_AT } from "./geometry";
import s from "./scene.module.css";

type Props = { checks: string[]; requires: string; approvedTag: string };

/**
 * `#rules`: what TilcAI looks at before anything moves. Six small checks hover around the core (a few pixels, never an orbit),
 * each draws its tick; a violet tag says the result is "needs approval" and turns cyan once the person authorises.
 */
export function Rules({ checks, requires, approvedTag }: Props) {
  return (
    <g id="rules" data-k="rules">
      {checks.map((text, i) => {
        const at = CHECK_AT[i];
        return (
          <g key={text} data-k={`check-${i}`}>
            <g transform={`translate(${at.x} ${at.y})`}>
              <g className={`${s.float} ${i % 2 ? s.floatLate : ""}`}>
                <rect data-k={`check-box-${i}`} x="-68" y="-18" width="136" height="36" rx="11" fill="url(#op-panel-soft)" stroke="#925fff" strokeOpacity=".7" />
                <text className={s.mono} x="-54" y="4.5" style={{ fontSize: 13 }}>{text}</text>
                <path data-k={`check-tick-${i}`} d="M44 0l5 5 10-11" fill="none" stroke="#ac76ff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </g>
          </g>
        );
      })}
      <g data-k="requires">
        <g transform={`translate(${CORE_AT.x} ${CORE_AT.y - 162})`}>
          <rect data-k="requires-box" x="-104" y="-15" width="208" height="30" rx="15" fill="#2a1a63" stroke="#ac76ff" />
          <text data-k="requires-text" className={`${s.mono} ${s.center} ${s.violet}`} x="0" y="4.5" style={{ fontSize: 12 }}>{requires}</text>
          <text data-k="approved-text" className={`${s.mono} ${s.center} ${s.cyan}`} x="0" y="4.5" opacity="0" style={{ fontSize: 12 }}>{approvedTag} ✓</text>
        </g>
      </g>
    </g>
  );
}
