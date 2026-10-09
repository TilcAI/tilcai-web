import { AGENT_AT, BUSINESS_AT, VIEW } from "./geometry";

/** Gradients, the isometric lattice and the two glow filters. Small on purpose: no heavy filter ever covers a whole group. */
export function SceneDefs() {
  return (
    <defs>
      <linearGradient id="op-route" gradientUnits="userSpaceOnUse" x1={AGENT_AT.x + 60} y1="0" x2={BUSINESS_AT.x - 60} y2="0">
        <stop offset="0" stopColor="#7347ff" /><stop offset=".5" stopColor="#925fff" /><stop offset="1" stopColor="#48d9ff" />
      </linearGradient>
      <linearGradient id="op-route-down" gradientUnits="userSpaceOnUse" x1="0" y1="370" x2="0" y2="560">
        <stop offset="0" stopColor="#925fff" /><stop offset="1" stopColor="#48d9ff" />
      </linearGradient>
      <linearGradient id="op-panel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2a2252" /><stop offset="1" stopColor="#120f27" /></linearGradient>
      <linearGradient id="op-panel-soft" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#221b47" /><stop offset="1" stopColor="#100d24" /></linearGradient>
      <linearGradient id="op-roof" x1="220" y1="110" x2="470" y2="250" gradientUnits="userSpaceOnUse"><stop stopColor="#a184f1" /><stop offset="1" stopColor="#38296a" /></linearGradient>
      <linearGradient id="op-glass" x1="270" y1="185" x2="355" y2="330" gradientUnits="userSpaceOnUse"><stop stopColor="#57d2f9" stopOpacity=".5" /><stop offset="1" stopColor="#6024e8" stopOpacity=".1" /></linearGradient>
      <linearGradient id="op-cube-top" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b79bff" /><stop offset="1" stopColor="#6c47f0" /></linearGradient>
      <linearGradient id="op-cube-left" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b2a86" /><stop offset="1" stopColor="#1a1442" /></linearGradient>
      <linearGradient id="op-cube-right" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a1f6a" /><stop offset="1" stopColor="#120e30" /></linearGradient>
      <radialGradient id="op-halo-violet"><stop stopColor="#7347ff" stopOpacity=".42" /><stop offset="1" stopColor="#7347ff" stopOpacity="0" /></radialGradient>
      <radialGradient id="op-halo-cyan"><stop stopColor="#48d9ff" stopOpacity=".4" /><stop offset="1" stopColor="#48d9ff" stopOpacity="0" /></radialGradient>
      <radialGradient id="op-dot-cyan"><stop stopColor="#fff" stopOpacity=".95" /><stop offset=".25" stopColor="#60e4ff" stopOpacity=".7" /><stop offset="1" stopColor="#48d9ff" stopOpacity="0" /></radialGradient>
      <radialGradient id="op-dot-violet"><stop stopColor="#fff" stopOpacity=".95" /><stop offset=".25" stopColor="#ac76ff" stopOpacity=".7" /><stop offset="1" stopColor="#7347ff" stopOpacity="0" /></radialGradient>
      <radialGradient id="op-fade" cx=".5" cy=".5" r=".55"><stop offset=".25" stopColor="#fff" /><stop offset="1" stopColor="#000" /></radialGradient>
      <mask id="op-grid-mask"><rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill="url(#op-fade)" /></mask>
      {/* The isometric lattice: one tile repeated, so it costs nothing. */}
      <pattern id="op-iso" width="60" height="34.64" patternUnits="userSpaceOnUse"><path d="M0 17.32 30 0 60 17.32 30 34.64Z" fill="none" stroke="#9d81da" strokeWidth="1" /></pattern>
      <filter id="glow-purple" x="-40%" y="-60%" width="180%" height="220%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
        <feColorMatrix in="b" type="matrix" values="0 0 0 0 .45  0 0 0 0 .28  0 0 0 0 1  0 0 0 1 0" result="c" />
        <feMerge><feMergeNode in="c" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="glow-cyan" x="-40%" y="-60%" width="180%" height="220%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
        <feColorMatrix in="b" type="matrix" values="0 0 0 0 .28  0 0 0 0 .85  0 0 0 0 1  0 0 0 1 0" result="c" />
        <feMerge><feMergeNode in="c" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
  );
}
