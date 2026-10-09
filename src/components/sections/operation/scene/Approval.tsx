import { APPROVAL_AT } from "./geometry";
import s from "./scene.module.css";

type Props = { review: { title: string; you: string; rows: string[]; reject: string; approve: string; approved: string; authorization: string } };

/** The route the authorization takes, from the approve button back to the core. */
export const AUTH_PATH = "M 516 470 C 590 440, 560 340, 452 322";

/**
 * `#approval`: a floating review panel in front of the scene. The person (you) sees the exact terms, the approve button takes
 * the press, a tick draws, and a small "authorization" token leaves for TilcAI. Drawn around (0,0).
 */
export function Approval({ review }: Props) {
  return (
    <g id="approval" data-k="approval">
      <g transform={`translate(${APPROVAL_AT.x} ${APPROVAL_AT.y})`}>
        <g data-k="approval-panel">
          <rect x="-130" y="-92" width="260" height="184" rx="18" fill="url(#op-panel)" stroke="#48d9ff" strokeOpacity=".7" />
          <rect x="-130" y="-92" width="260" height="184" rx="18" fill="none" stroke="#ac76ff" strokeOpacity=".25" transform="translate(5 5)" />
          <g transform="translate(-106 -66)">
            <circle r="11" fill="#14172e" stroke="#ac76ff" strokeOpacity=".8" />
            <circle cy="-3" r="3.6" fill="#ac76ff" /><path d="M-6 7a6 5 0 0 1 12 0" fill="#ac76ff" />
          </g>
          <text className={`${s.mono} ${s.violet}`} x="-86" y="-62" style={{ fontSize: 11 }}>{review.you}</text>
          <text className={s.label} x="-52" y="-62" style={{ fontSize: 12 }}>{review.title}</text>
          <path d="M-112 -46H112" stroke="#925fff" strokeOpacity=".4" />
          {review.rows.map((row, i) => (
            <g key={row} transform={`translate(-108 ${-26 + i * 24})`}>
              <rect x="0" y="-7" width="8" height="8" rx="2" fill="none" stroke="#48d9ff" />
              <text className={s.value} x="18" y="2" style={{ fontSize: 15 }}>{row}</text>
            </g>
          ))}
          <g data-k="approve-reject" transform="translate(-62 66)">
            <rect x="-54" y="-16" width="108" height="32" rx="10" fill="none" stroke="#a6a0b8" strokeOpacity=".5" />
            <text className={`${s.mono} ${s.center}`} x="0" y="4.5" style={{ fontSize: 12 }}>{review.reject}</text>
          </g>
          <g data-k="approve-button" transform="translate(62 66)">
            <rect data-k="approve-fill" x="-54" y="-16" width="108" height="32" rx="10" fill="#6a43ee" stroke="#ac76ff" />
            <text data-k="approve-text" className={`${s.mono} ${s.center} ${s.white}`} x="0" y="4.5" style={{ fontSize: 12 }}>{review.approve}</text>
            <g data-k="approve-done" opacity="0">
              <text className={`${s.mono} ${s.center} ${s.white}`} x="8" y="4.5" style={{ fontSize: 12 }}>{review.approved}</text>
              <path data-k="approve-tick" d="M-42 0l5 5 9-10" fill="none" stroke="#60e4ff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        </g>
      </g>
      <g data-k="auth-token" opacity="0">
        <g transform="translate(0 0)">
          <rect x="-58" y="-12" width="116" height="24" rx="12" fill="#14172e" stroke="#60e4ff" />
          <circle cx="-42" cy="0" r="5" fill="none" stroke="#60e4ff" strokeWidth="1.6" /><path d="M-37 0H-26M-30 0v4" stroke="#60e4ff" strokeWidth="1.6" strokeLinecap="round" />
          <text className={`${s.mono} ${s.cyan}`} x="-18" y="4" style={{ fontSize: 9.5 }}>{review.authorization}</text>
        </g>
      </g>
      <path data-k="auth-path" d={AUTH_PATH} fill="none" stroke="none" />
    </g>
  );
}
