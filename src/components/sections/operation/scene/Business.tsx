import { BUSINESS_AT, BUSINESS_SCALE } from "./geometry";
import s from "./scene.module.css";

/**
 * `#business`: the hardware store, split into the parts the story lights up: roof, awning, windows (with the interior light),
 * door, base and plant. Drawn in the store's own units (centre 370 × 240) and placed with one transform.
 */
export function Business({ label }: { label: string }) {
  return (
    <g id="business" data-k="business"><g transform={`translate(${BUSINESS_AT.x} ${BUSINESS_AT.y}) scale(${BUSINESS_SCALE}) translate(-370 -240)`}>
      <ellipse cx="370" cy="300" rx="260" ry="130" fill="url(#op-halo-violet)" />
      <g data-k="biz-base">
        <path d="M182 287 376 192 555 282 360 382Z" fill="#080b1e" stroke="#49426e" />
        <path d="M182 276 376 180 555 270 360 369Z" fill="#241f44" stroke="#726098" />
        <path d="M182 276v11l178 95v-13M360 369l195-99v12" fill="none" stroke="#706086" />
      </g>
      <path d="M247 175 363 117 476 174v124l-116 59-113-57Z" fill="#221e3c" stroke="#68568f" />
      <path d="M360 233 476 174v124l-116 59Z" fill="#14132b" />
      <g data-k="biz-roof">
        <path d="M239 159 363 96 486 158 360 222Z" fill="url(#op-roof)" stroke="#b79de7" />
        <path d="M239 159v16l121 63v-16ZM360 222l126-64v16l-126 64Z" fill="#493276" stroke="#8565b7" />
        <path d="M274 156 362 112 450 156 361 200Z" fill="#292141" stroke="#9374b7" />
        <path d="M285 156 362 118 439 156 361 195Z" fill="#58437c" />
      </g>
      <g data-k="biz-windows">
        <path data-k="biz-light" className={s.breathe} d="M256 211 349 258v71l-93-48Z" fill="#8f6bff" opacity=".7" />
        <path d="M256 211 349 258v71l-93-48Z" fill="url(#op-glass)" stroke="#78b4d7" />
        <path d="M286 226v71M319 243v72M256 248l93 48" fill="none" stroke="#a0b5d7" strokeOpacity=".65" />
        <path d="M270 220v63M297 235v28" fill="none" stroke="#cbf0fa" strokeWidth="3" strokeOpacity=".3" />
        <path d="M429 225 462 208v69l-33 17Z" fill="url(#op-glass)" stroke="#806daf" />
      </g>
      <g data-k="biz-door">
        <path d="M380 251 416 233v91l-36 18Z" fill="#312553" stroke="#8d74be" />
        <path d="M386 258 409 246v45l-23 12Z" fill="url(#op-glass)" stroke="#57d2f9" strokeOpacity=".6" />
        <path d="m405 302 0 7" stroke="#e1deeb" strokeWidth="3" />
      </g>
      <g data-k="biz-awning">
        <path d="M252 194 353 245 370 229 266 178Z" fill="#8d62d5" stroke="#b99be6" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${266 + i * 20} ${178 + i * 10}l10 5-14 17-10-5Z`} fill={i % 2 ? "#d7ceea" : "#7954b7"} />)}
        <path d="M252 194v12l101 51v-12" fill="#644187" stroke="#a481cd" />
      </g>
      <g data-k="biz-plant">
        <path d="m482 305 17-8 17 8v21l-17 9-17-9Z" fill="#3f3557" stroke="#77628f" />
        <path d="M499 307v-39m0 24c-25-2-20-31-20-31 18 5 20 18 20 31Zm0-8c22-1 19-28 19-28-16 4-19 16-19 28Z" fill="#4b8993" stroke="#7cc6c3" />
      </g>
      <text className={`${s.label} ${s.center}`} x="372" y="428" style={{ fontSize: 23 }}>{label}</text>
    </g></g>
  );
}
