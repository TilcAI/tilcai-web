import { CORE_AT, CORE_FINAL, CORE_PIVOT, RECEIPT_AT } from "./geometry";
import s from "./scene.module.css";

type Props = { receipts: { payment: string; delivery: string; paid: string; pending: string; confirmed: string; sameOrder: string; notDelivery: string } };

/**
 * `#receipts`: two separate documents that share one orderId. The payment receipt closes with the settlement; the delivery
 * receipt is the business's own record and starts pending. Paid is not delivered, and the scene says so.
 */
export function Receipts({ receipts }: Props) {
  const { payment, delivery } = RECEIPT_AT;
  const topY = payment.y - 56;
  const coreBottom = CORE_PIVOT.y + (CORE_AT.y + 28 - CORE_PIVOT.y) * CORE_FINAL.scale + CORE_FINAL.y;
  return (
    <g id="receipts" data-k="receipts">
      <g fill="none" stroke="url(#op-route-down)" strokeWidth="1.6" strokeLinecap="round" data-k="receipt-branches">
        <path data-k="branch-pay" d={`M ${CORE_AT.x} ${coreBottom} C ${CORE_AT.x} ${topY - 24}, ${payment.x} ${topY - 34}, ${payment.x} ${topY}`} />
        <path data-k="branch-delivery" d={`M ${CORE_AT.x} ${coreBottom} C ${CORE_AT.x} ${topY - 24}, ${delivery.x} ${topY - 34}, ${delivery.x} ${topY}`} />
      </g>
      <g data-k="receipt-pay">
        <g transform={`translate(${payment.x} ${payment.y})`}>
          <rect x="-80" y="-56" width="160" height="112" rx="14" fill="url(#op-panel)" stroke="#48d9ff" strokeOpacity=".75" />
          <text className={s.label} x="-66" y="-32" style={{ fontSize: 12, letterSpacing: ".08em" }}>{receipts.payment}</text>
          <path d="M-66 -22H66" stroke="#925fff" strokeOpacity=".4" />
          <g transform="translate(-56 -2)">
            <circle r="9" fill="none" stroke="#60e4ff" strokeWidth="1.6" />
            <path data-k="pay-tick" d="M-4.5 0l3.2 3.4L5 -3.5" fill="none" stroke="#60e4ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text className={`${s.value} ${s.cyan}`} x="-38" y="4" style={{ fontSize: 16 }}>{receipts.paid}</text>
          <text className={s.small} x="-66" y="30" style={{ fontSize: 12 }}>hash 0x25…21c3</text>
          <text className={s.small} x="-66" y="45" style={{ fontSize: 12 }}>orderId · 7f2a</text>
        </g>
      </g>
      <g data-k="receipt-delivery">
        <g transform={`translate(${delivery.x} ${delivery.y})`}>
          <rect x="-80" y="-56" width="160" height="112" rx="14" fill="url(#op-panel)" stroke="#ac76ff" strokeOpacity=".75" />
          <text className={s.label} x="-66" y="-32" style={{ fontSize: 12, letterSpacing: ".08em" }}>{receipts.delivery}</text>
          <path d="M-66 -22H66" stroke="#925fff" strokeOpacity=".4" />
          <g transform="translate(-56 -2)">
            <circle data-k="delivery-ring" r="9" fill="none" stroke="#ac76ff" strokeWidth="1.6" />
            <path data-k="delivery-tick" d="M-4.5 0l3.2 3.4L5 -3.5" fill="none" stroke="#60e4ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text data-k="delivery-pending" className={`${s.value} ${s.violet}`} x="-38" y="4" style={{ fontSize: 16 }}>{receipts.pending}</text>
          <text data-k="delivery-confirmed" className={`${s.value} ${s.cyan}`} x="-38" y="4" opacity="0" style={{ fontSize: 16 }}>{receipts.confirmed}</text>
          <text className={s.small} x="-66" y="30" style={{ fontSize: 12 }}>—</text>
          <text className={s.small} x="-66" y="45" style={{ fontSize: 12 }}>orderId · 7f2a</text>
        </g>
      </g>
      <g data-k="same-order">
        <path data-k="same-line" d={`M ${payment.x} ${payment.y + 56} V ${payment.y + 72} H ${delivery.x} V ${delivery.y + 56}`} fill="none" stroke="#ac76ff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x={(payment.x + delivery.x) / 2 - 66} y={payment.y + 62} width="132" height="20" rx="10" fill="#080819" stroke="#ac76ff" strokeOpacity=".7" />
        <text className={`${s.mono} ${s.center} ${s.violet}`} x={(payment.x + delivery.x) / 2} y={payment.y + 76} style={{ fontSize: 12 }}>{receipts.sameOrder}</text>
      </g>
      <g data-k="not-delivery">
        <rect x={(payment.x + delivery.x) / 2 - 70} y={payment.y + 88} width="140" height="20" rx="10" fill="#080819" />
        <text className={`${s.mono} ${s.center} ${s.cyan}`} x={(payment.x + delivery.x) / 2} y={payment.y + 102} style={{ fontSize: 11.5 }}>{receipts.notDelivery}</text>
      </g>
    </g>
  );
}
