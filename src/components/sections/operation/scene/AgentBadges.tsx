import { BADGES } from "./geometry";
import s from "./scene.module.css";

type Props = { labels: { claude: string; codex: string; own: string } };

/**
 * Three generic badges (no official characters) that stand for any agent a person might use. They show up around the agent, then
 * converge into it: TilcAI does not care which agent starts the operation.
 */
export function AgentBadges({ labels }: Props) {
  const glyph = {
    claude: <path d="M0 -7V7M-6.1 -3.5 6.1 3.5M-6.1 3.5 6.1 -3.5" stroke="#ac76ff" strokeWidth="2" strokeLinecap="round" />,
    codex: <path d="M-3 -6-8 0l5 6M3 -6l5 6-5 6" transform="translate(0 0) scale(.85)" fill="none" stroke="#48d9ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
    own: <g fill="none" stroke="#f7f5ff" strokeWidth="1.6"><circle r="2.6" fill="#f7f5ff" /><circle cx="-6.5" cy="-4.5" r="1.8" /><circle cx="6.5" cy="-4.5" r="1.8" /><circle cx="0" cy="7" r="1.8" /><path d="M-1.8-1.6-5-3.4M1.8-1.6 5-3.4M0 2.6V5" /></g>,
  } as const;
  return (
    <g id="agent-badges" data-k="badges">
      {BADGES.map((b) => (
        <g key={b.id} data-k={`badge-${b.id}`} data-x={b.x} data-y={b.y}>
          <g transform={`translate(${b.x} ${b.y})`}>
            <g className={`${s.float} ${b.id === "codex" ? s.floatLate : ""}`}>
              <rect x="-62" y="-17" width="124" height="34" rx="17" fill="url(#op-panel-soft)" stroke="#925fff" strokeOpacity=".55" />
              <circle cx="-42" cy="0" r="12" fill="#14172e" stroke="#925fff" strokeOpacity=".5" />
              <g transform="translate(-42 0)">{glyph[b.id]}</g>
              <text className={s.mono} x="-24" y="4.5">{labels[b.id]}</text>
            </g>
          </g>
        </g>
      ))}
    </g>
  );
}
