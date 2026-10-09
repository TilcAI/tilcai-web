import { PAY_PATH, STOP_AT } from "./geometry";
import s from "./scene.module.css";

type Props = { rail: string; stops: string[]; settled: string };

/**
 * `#payment`: the rail. A lane under the scene with four checkpoints (order, signature, network, settlement); a small token
 * leaves TilcAI, goes through each one and ends at the business. Each checkpoint goes from empty to full to ticked.
 */
export function Payment({ rail, stops, settled }: Props) {
  return (
    <g id="payment" data-k="payment">
      <g data-k="rail-lane">
        <rect x="440" y="535" width="340" height="26" rx="13" fill="#7347ff" opacity=".1" stroke="#925fff" strokeOpacity=".35" />
        <text className={s.small} x="470" y="523" style={{ fontSize: 10.5 }}>{rail}</text>
        <g fill="none" stroke="#60e4ff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity=".65">
          {[500, 586, 674].map((x) => <path key={x} data-k="rail-chevron" d={`M${x} 542l6 6-6 6`} />)}
        </g>
      </g>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path data-k="pay-glow" d={PAY_PATH} stroke="url(#op-route-down)" strokeWidth="10" opacity=".1" filter="url(#glow-cyan)" />
        <path data-k="pay-line" d={PAY_PATH} stroke="url(#op-route-down)" strokeWidth="2" />
      </g>
      {STOP_AT.map((at, i) => (
        <g key={i} data-k={`stop-${i}`}>
          <g transform={`translate(${at.x} ${at.y})`}>
            <circle data-k={`stop-ring-${i}`} r="10" fill="#0c0a1f" stroke="#925fff" strokeWidth="1.6" />
            <circle data-k={`stop-fill-${i}`} r="10" fill="#48d9ff" opacity="0" />
            <path data-k={`stop-tick-${i}`} d="M-5 0l3.5 3.5L6 -4" fill="none" stroke="#070616" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <text className={`${s.small} ${i === 0 ? s.end : s.center}`} x={i === 0 ? -18 : 0} y={i === 0 ? 4 : 30} style={{ fontSize: 10.5 }}>{stops[i]}</text>
          </g>
        </g>
      ))}
      <g data-k="coin" opacity="0">
        <circle r="16" fill="url(#op-dot-cyan)" />
        <circle r="9.5" fill="#0c0a1f" stroke="#60e4ff" strokeWidth="1.8" />
        <circle r="4.2" fill="none" stroke="#f7f5ff" strokeWidth="1.5" /><path d="M-1 -2.2v4.4" stroke="#f7f5ff" strokeWidth="1.4" strokeLinecap="round" />
      </g>
      <g data-k="settled" opacity="0">
        <g transform="translate(680 498)">
          <rect x="-62" y="-14" width="124" height="28" rx="14" fill="#0b2b3a" stroke="#60e4ff" />
          <text className={`${s.mono} ${s.cyan}`} x="-48" y="4.5" style={{ fontSize: 12 }}>{settled}</text>
          <path d="M34 0l5 5 10-11" fill="none" stroke="#60e4ff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </g>
  );
}
