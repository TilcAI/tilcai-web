import s from "./scene.module.css";

/** `#particles`: seven quiet marks (dots and crosses) so the room is not empty. With the five travelling dots, never more than twelve. */
const MARKS = [
  { x: 70, y: 96, k: "dot", c: "#48d9ff" }, { x: 332, y: 74, k: "cross", c: "#ac76ff" }, { x: 566, y: 62, k: "dot", c: "#f7f5ff" },
  { x: 846, y: 92, k: "cross", c: "#48d9ff" }, { x: 52, y: 330, k: "cross", c: "#925fff" }, { x: 860, y: 520, k: "dot", c: "#ac76ff" },
  { x: 300, y: 590, k: "dot", c: "#48d9ff" },
] as const;

export function Particles() {
  return (
    <g id="particles" data-k="particles">
      {MARKS.map((m, i) => (
        <g key={i} className={s.twinkle} style={{ animationDelay: `${-i * 0.9}s` }} transform={`translate(${m.x} ${m.y})`}>
          {m.k === "dot" ? <circle r="2.4" fill={m.c} /> : <path d="M-5 0H5M0 -5V5" stroke={m.c} strokeWidth="1.5" strokeLinecap="round" />}
        </g>
      ))}
    </g>
  );
}
