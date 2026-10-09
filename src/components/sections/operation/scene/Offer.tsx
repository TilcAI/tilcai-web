import { OFFER_AT, QUOTE_AT } from "./geometry";
import s from "./scene.module.css";

type Props = { labels: { price: string; priceValue: string; stock: string; stockValue: string; validity: string; validityValue: string; quote: string } };

/**
 * `#offer`: what the business answers. Three small panels come out of the store, thin lines gather them into one quote, and the
 * quote is the object that later travels to TilcAI.
 */
export function Offer({ labels }: Props) {
  const panels = [
    { k: labels.price, v: labels.priceValue },
    { k: labels.stock, v: labels.stockValue },
    { k: labels.validity, v: labels.validityValue },
  ];
  return (
    <g id="offer" data-k="offer">
      <g fill="none" stroke="url(#op-route)" strokeWidth="1.4" strokeLinecap="round" opacity=".9">
        {OFFER_AT.map((p, i) => (
          <path key={i} data-k={`offer-line-${i}`} d={`M ${p.x} ${p.y + 28} C ${p.x} ${p.y + 56}, ${QUOTE_AT.x + (i - 1) * 24} ${QUOTE_AT.y - 52}, ${QUOTE_AT.x + (i - 1) * 24} ${QUOTE_AT.y - 36}`} />
        ))}
      </g>
      {panels.map((p, i) => (
        <g key={i} data-k={`offer-panel-${i}`}>
          <g transform={`translate(${OFFER_AT[i].x} ${OFFER_AT[i].y}) rotate(${[-2, 1.5, -1][i]})`}>
            <g className={`${s.float} ${i === 1 ? s.floatLate : ""}`}>
              <rect x="-62" y="-28" width="124" height="56" rx="12" fill="url(#op-panel)" stroke="#925fff" strokeOpacity=".6" />
              <text className={s.small} x="-48" y="-7">{p.k}</text>
              <text className={s.value} x="-48" y="16">{p.v}</text>
            </g>
          </g>
        </g>
      ))}
      <g data-k="quote">
        <g transform={`translate(${QUOTE_AT.x} ${QUOTE_AT.y})`}>
          <rect x="-78" y="-38" width="156" height="76" rx="14" fill="url(#op-panel)" stroke="#48d9ff" strokeOpacity=".75" />
          <text className={s.label} x="-62" y="-14" style={{ fontSize: 12 }}>{labels.quote}</text>
          <path d="M-62 -4H62" stroke="#925fff" strokeOpacity=".4" />
          <text className={s.value} x="-62" y="22">{labels.priceValue}</text>
          <circle cx="58" cy="19" r="9" fill="none" stroke="#48d9ff" strokeWidth="1.6" />
          <path d="m53 19 4 4 7-8" fill="none" stroke="#48d9ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
      <circle data-k="dot-offer" r="9" fill="url(#op-dot-violet)" opacity="0" />
    </g>
  );
}
