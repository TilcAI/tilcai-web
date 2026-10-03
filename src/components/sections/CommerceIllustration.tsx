/** Decorative vector scene. Visible labels and descriptions live in HTML beside it. */
export function CommerceIllustration({ id, active = 0 }: { id: string; active?: number }) {
  const accent = ["#57D2F9", "#A47AFF", "#F0C47A", "#72DDB9"][active % 4];
  return (
    <svg viewBox="0 0 640 440" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-roof`} x1="220" y1="110" x2="470" y2="250" gradientUnits="userSpaceOnUse"><stop stopColor="#A184F1" /><stop offset="1" stopColor="#38296A" /></linearGradient>
        <linearGradient id={`${id}-glass`} x1="270" y1="185" x2="355" y2="330" gradientUnits="userSpaceOnUse"><stop stopColor="#57D2F9" stopOpacity=".5" /><stop offset="1" stopColor="#6024E8" stopOpacity=".1" /></linearGradient>
        <radialGradient id={`${id}-halo`}><stop stopColor="#6024E8" stopOpacity=".23" /><stop offset="1" stopColor="#6024E8" stopOpacity="0" /></radialGradient>
        <pattern id={`${id}-grid`} width="48" height="24" patternUnits="userSpaceOnUse"><path d="M0 12 24 0 48 12 24 24Z" stroke="#9D81DA" strokeOpacity=".1" /></pattern>
      </defs>
      <ellipse cx="335" cy="305" rx="300" ry="134" fill={`url(#${id}-halo)`} />
      <path d="M18 282 320 129 624 282 322 435Z" fill={`url(#${id}-grid)`} />
      <path d="M182 287 376 192 555 282 360 382Z" fill="#080B1E" stroke="#49426E" />
      <path d="M182 276 376 180 555 270 360 369Z" fill="#241F44" stroke="#726098" />
      <path d="M182 276v11l178 95v-13M360 369l195-99v12" stroke="#706086" />
      <path d="M247 175 363 117 476 174v124l-116 59-113-57Z" fill="#221E3C" stroke="#68568F" />
      <path d="M360 233 476 174v124l-116 59Z" fill="#14132B" />
      <path d="M239 159 363 96 486 158 360 222Z" fill={`url(#${id}-roof)`} stroke="#B79DE7" />
      <path d="M239 159v16l121 63v-16ZM360 222l126-64v16l-126 64Z" fill="#493276" stroke="#8565B7" />
      <path d="M274 156 362 112 450 156 361 200Z" fill="#292141" stroke="#9374B7" />
      <path d="M285 156 362 118 439 156 361 195Z" fill="#58437C" />
      <path d="M256 211 349 258v71l-93-48Z" fill={`url(#${id}-glass)`} stroke="#78B4D7" />
      <path d="M286 226v71M319 243v72M256 248l93 48" stroke="#A0B5D7" strokeOpacity=".65" />
      <path d="M270 220v63M297 235v28" stroke="#CBF0FA" strokeWidth="3" strokeOpacity=".3" />
      <path d="M380 251 416 233v91l-36 18Z" fill="#312553" stroke="#8D74BE" />
      <path d="M386 258 409 246v45l-23 12Z" fill={`url(#${id}-glass)`} stroke="#57D2F9" strokeOpacity=".6" />
      <path d="m405 302 0 7" stroke="#E1DDEB" strokeWidth="3" />
      <path d="M429 225 462 208v69l-33 17Z" fill={`url(#${id}-glass)`} stroke="#806DAF" />
      <path d="M252 194 353 245 370 229 266 178Z" fill="#8D62D5" stroke="#B99BE6" />
      {[0, 1, 2, 3, 4].map(i => <path key={i} d={`M${266+i*20} ${178+i*10}l10 5-14 17-10-5Z`} fill={i % 2 ? "#D7CCEA" : "#7954B7"} />)}
      <path d="M252 194v12l101 51v-12" fill="#644187" stroke="#A481CD" />
      <path d="M377 343 416 323l18 9-40 21Z" fill="#675478" stroke="#AFA0C5" />
      <path d="M377 349 394 358l40-20v-6" stroke="#796488" />
      <path d="m482 305 17-8 17 8v21l-17 9-17-9Z" fill="#3F3557" stroke="#77628F" />
      <path d="M499 307v-39m0 24c-25-2-20-31-20-31 18 5 20 18 20 31Zm0-8c22-1 19-28 19-28-16 4-19 16-19 28Z" fill="#4B8993" stroke="#7CC6C3" />
      <path d="M100 314 151 288 202 314 151 340Z" fill="#25334E" stroke={accent} />
      <path d="M100 314v10l51 26 51-26v-10M151 340v10" stroke="#576F99" />
      <path d="M130 280v-34l-4-27 20 13h14l19-13-4 27v34c-2 19-43 19-45 0Z" fill="#DADBEA" stroke="#B0B4D4" strokeWidth="2" />
      <rect x="132" y="242" width="40" height="32" rx="13" fill="#14172E" />
      <ellipse cx="142" cy="256" rx="3" ry="5" fill={accent} /><ellipse cx="161" cy="256" rx="3" ry="5" fill="#AC7BF4" />
      <path d="M139 291v18m23-18v18m-23 0h-8m31 0h8" stroke="#BABDD7" strokeWidth="8" strokeLinecap="round" />
      <path d="M171 292c27 12 22-11 26-11" stroke="#9CA4CF" strokeWidth="7" strokeLinecap="round" />
      <path d="M205 313 254 338 299 315" stroke={accent} strokeWidth="2" strokeDasharray="5 6" />
      <circle cx="254" cy="338" r="5" fill={accent} /><circle cx="254" cy="338" r="11" stroke={accent} strokeOpacity=".3" />
      <path d="M319 88v-26m-13 13h26M528 179v-14m-7 7h14M123 161v-10m-5 5h10" stroke="#987CBA" strokeLinecap="round" />
      <circle cx="215" cy="107" r="3" fill="#57D2F9" /><circle cx="536" cy="232" r="2" fill="#A47AFF" />
    </svg>
  );
}
