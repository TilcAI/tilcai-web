import { AGENT_AT } from "./geometry";
import s from "./scene.module.css";

/**
 * `#agent`: the buyer's agent, a small robot-cat drawn from the TilcAI mascot. The groups are separate so each one can move on
 * its own: the timeline leans the whole figure when it sends something, the idle loop blinks, nods and floats the parts.
 */
export function Agent({ label }: { label: string }) {
  return (
    <g id="agent" data-k="agent"><g transform={`translate(${AGENT_AT.x} ${AGENT_AT.y})`}>
      <g data-k="agent-pad">
        <ellipse cx="0" cy="8" rx="92" ry="40" fill="url(#op-halo-violet)" />
        <path d="M-72 0 0 -36 72 0 0 36Z" fill="#25334e" stroke="#57d2f9" strokeOpacity=".6" />
        <path d="M-72 0v10L0 46 72 10V0M0 36v10" fill="none" stroke="#576f99" />
      </g>
      <g data-k="agent-lean">
        <g id="agent-body" data-k="agent-body">
          <path d="M20 -18c30 6 34-26 14-36" fill="none" stroke="#9ca4cf" strokeWidth="6" strokeLinecap="round" />
          <path d="M-14 -22v18M14 -22v18M-14 -4h-8M14 -4h8" stroke="#babdd7" strokeWidth="9" strokeLinecap="round" />
          <rect x="-27" y="-66" width="54" height="52" rx="22" fill="#dadbea" stroke="#b0b4d4" strokeWidth="2" />
          <rect x="-13" y="-48" width="26" height="17" rx="7" fill="#14172e" />
          <circle cx="-5" cy="-40" r="2.6" fill="#48d9ff" /><circle cx="5" cy="-40" r="2.6" fill="#ac76ff" />
        </g>
        <g id="agent-left-arm" data-k="agent-left-arm">
          <path d="M-26 -52C-44 -48 -46 -32 -41 -23" fill="none" stroke="#babdd7" strokeWidth="9" strokeLinecap="round" />
        </g>
        <g id="agent-right-arm" data-k="agent-right-arm">
          <path d="M26 -52C44 -52 52 -42 50 -33" fill="none" stroke="#babdd7" strokeWidth="9" strokeLinecap="round" />
        </g>
        <g id="agent-head" data-k="agent-head">
          <path d="M-30 -112 -35 -142 -9 -122Z" fill="#dadbea" stroke="#b0b4d4" strokeWidth="2" strokeLinejoin="round" />
          <path d="M30 -112 35 -142 9 -122Z" fill="#dadbea" stroke="#b0b4d4" strokeWidth="2" strokeLinejoin="round" />
          <path d="M-27 -117 -29 -131 -17 -123Z M27 -117 29 -131 17 -123Z" fill="#ac76ff" opacity=".7" />
          <rect x="-36" y="-124" width="72" height="62" rx="26" fill="#dadbea" stroke="#b0b4d4" strokeWidth="2" />
          <rect x="-28" y="-116" width="56" height="42" rx="18" fill="#14172e" />
          <g id="agent-eyes" data-k="agent-eyes">
            <ellipse cx="-12" cy="-95" rx="4.8" ry="8" fill="#48d9ff" />
            <ellipse cx="12" cy="-95" rx="4.8" ry="8" fill="#ac76ff" />
          </g>
        </g>
      </g>
      <text className={`${s.label} ${s.center}`} x="0" y="66">{label}</text>
    </g></g>
  );
}
