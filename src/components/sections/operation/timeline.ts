import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { CAMERA, PHASES, STEPS } from "./phases";
import { AGENT_AT, BADGES, BUSINESS_AT, CORE_FINAL, CORE_PIVOT, OFFER_AT, QUOTE_AT, STOP_AT, CORE_AT } from "./scene/geometry";

type Options = {
  /** Also animate the cards on the right (not needed on a phone, where the cards scroll by themselves). */
  panel: boolean;
  /** Smaller zoom and shorter moves on small screens. */
  compact: boolean;
};

export type Built = { tl: gsap.core.Timeline; idle: gsap.core.Animation[] };

const P = PHASES;
const CYAN = "#48d9ff";
const VIOLET = "#ac76ff";

/**
 * The whole operation as ONE timeline of length 1, positioned in absolute fractions (see PHASES). Scrolling scrubs it; nothing
 * restarts, nothing is swapped: every step adds to what the previous one left on the stage. Elements are found by `data-k`.
 */
export function buildOperationTimeline(root: HTMLElement, { panel, compact }: Options): Built {
  gsap.registerPlugin(MotionPathPlugin);
  const el = <T extends Element = SVGGElement>(key: string) => root.querySelector<T>(`[data-k="${key}"]`)!;
  const list = <T extends Element = SVGGElement>(prefix: string, n: number) => Array.from({ length: n }, (_, i) => el<T>(`${prefix}-${i}`));
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
  const idle: gsap.core.Animation[] = [];
  const zoom = compact ? 0.5 : 1;

  // ── Elements ───────────────────────────────────────────────────────────────────────────────────────────
  const camera = el("camera");
  const lean = el("agent-lean"), head = el("agent-head"), eyes = el("agent-eyes"), body = el("agent-body"), arm = el("agent-right-arm");
  const biz = el("business"), bizLight = el<SVGPathElement>("biz-light");
  const mainGlow = el<SVGPathElement>("main-glow"), mainLine = el<SVGPathElement>("main-path");
  const doc = el("doc"), dotRequest = el("dot-request");
  const panels = list("offer-panel", 3), offerLines = list<SVGPathElement>("offer-line", 3), quote = el("quote"), dotOffer = el("dot-offer");
  const core = el("core"), coreInner = el("core-inner"), halo = el("core-halo"), haloCyan = el("core-halo-cyan");
  const checks = list("check", 6), boxes = list<SVGRectElement>("check-box", 6), ticks = list<SVGPathElement>("check-tick", 6);
  const requires = el("requires"), requiresBox = el<SVGRectElement>("requires-box"), requiresText = el("requires-text"), approvedText = el("approved-text");
  const approval = el("approval-panel"), approveFill = el<SVGRectElement>("approve-fill"), approveButton = el("approve-button"), approveText = el("approve-text");
  const approveDone = el("approve-done"), approveTick = el<SVGPathElement>("approve-tick"), authToken = el("auth-token"), authPath = el<SVGPathElement>("auth-path");
  const payGlow = el<SVGPathElement>("pay-glow"), payLine = el<SVGPathElement>("pay-line"), lane = el("rail-lane"), laneChevrons = Array.from(root.querySelectorAll<SVGPathElement>('[data-k="rail-chevron"]'));
  const stopRings = list<SVGCircleElement>("stop-ring", 4), stopFills = list<SVGCircleElement>("stop-fill", 4), stopTicks = list<SVGPathElement>("stop-tick", 4), stops = list("stop", 4);
  const coin = el("coin"), settled = el("settled");
  const receiptPay = el("receipt-pay"), receiptDelivery = el("receipt-delivery"), payTick = el<SVGPathElement>("pay-tick");
  const branchPay = el<SVGPathElement>("branch-pay"), branchDelivery = el<SVGPathElement>("branch-delivery");
  const sameLine = el<SVGPathElement>("same-line"), sameOrder = el("same-order"), notDelivery = el("not-delivery");
  const deliveryRing = el<SVGCircleElement>("delivery-ring"), deliveryTick = el<SVGPathElement>("delivery-tick"), deliveryPending = el("delivery-pending"), deliveryConfirmed = el("delivery-confirmed");
  const gridLines = Array.from(root.querySelectorAll<SVGPathElement>('[data-k="grid-line"]'));
  const badges = BADGES.map((b) => el(`badge-${b.id}`));

  // ── Helpers ────────────────────────────────────────────────────────────────────────────────────────────
  const prep = (path: SVGGeometryElement, drawn = 0) => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length * (1 - drawn) });
    return length;
  };
  const draw = (paths: SVGGeometryElement[], at: number, duration: number, to = 1, ease = "power2.inOut") =>
    tl.to(paths, { strokeDashoffset: (_i: number, target: SVGGeometryElement) => Number.parseFloat(String(target.style.strokeDasharray)) * (1 - to), duration, ease }, at);
  const travel = (target: Element, path: SVGPathElement, at: number, duration: number, start = 0, end = 1, vars: gsap.TweenVars = {}) =>
    tl.to(target, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start, end }, duration, ease: "none", ...vars }, at);
  const coreState = { x: 0, y: 0, scale: 0.5, rotation: -8 };
  const paintCore = () => {
    const { x, y, scale, rotation } = coreState;
    core.setAttribute("transform", `translate(${x} ${y}) translate(${CORE_PIVOT.x} ${CORE_PIVOT.y}) rotate(${rotation}) scale(${scale}) translate(${-CORE_PIVOT.x} ${-CORE_PIVOT.y})`);
  };
  const pulse = (target: Element, at: number, amount = 1.025, duration = 0.012) => {
    tl.to(target, { scale: amount, duration, ease: "sine.out" }, at).to(target, { scale: 1, duration: duration * 1.4, ease: "sine.inOut" }, at + duration);
  };
  const glowTo = (color: string, at: number, duration = 0.01) => tl.to(bizLight, { fill: color, opacity: color === CYAN ? 0.95 : 0.7, duration }, at);
  /** Fraction of a path closest to a point (used to time the token against the checkpoints on the rail). */
  const fractionNear = (path: SVGGeometryElement, point: { x: number; y: number }) => {
    const length = path.getTotalLength();
    let best = 0, bestDistance = Infinity;
    for (let i = 0; i <= 240; i += 1) {
      const p = path.getPointAtLength((length * i) / 240);
      const distance = (p.x - point.x) ** 2 + (p.y - point.y) ** 2;
      if (distance < bestDistance) { bestDistance = distance; best = i / 240; }
    }
    return best;
  };

  // ── Initial stage: agent and business on screen, everything else waiting ─────────────────────────────────
  gsap.set([doc, quote, ...panels, requires, approval, authToken, coin, settled, receiptPay, receiptDelivery, ...checks, sameOrder, notDelivery, lane, ...stops, ...laneChevrons, approvedText], { transformOrigin: "50% 50%" });
  gsap.set(camera, { svgOrigin: "450 310", scale: 1, x: 0, y: 0 });
  gsap.set(lean, { svgOrigin: "0 0" }); // pivot at the feet (the origin of the agent's own space)
  gsap.set(biz, { svgOrigin: `${BUSINESS_AT.x} ${BUSINESS_AT.y}` });
  gsap.set(head, { transformOrigin: "50% 100%" });
  gsap.set(arm, { svgOrigin: "26 -52" }); // the shoulder
  gsap.set(eyes, { transformOrigin: "50% 50%" });
  gsap.set([doc, quote, ...panels, ...checks, requires, approval, receiptPay, receiptDelivery, sameOrder, notDelivery, authToken, coin, settled, ...stops, ...laneChevrons, approvedText, dotRequest, dotOffer], { opacity: 0 });
  gsap.set(doc, { scale: 0.6, rotation: -5 });
  gsap.set(panels, { scale: 0.6 });
  OFFER_AT.forEach((p, i) => gsap.set(panels[i], { x: BUSINESS_AT.x - p.x, y: 300 - p.y }));
  gsap.set(quote, { scale: 0.7 });
  gsap.set(core, { opacity: 0 });
  paintCore();
  gsap.set(checks, { scale: 0.7 });
  gsap.set(approval, { scale: 0.8, y: 24 });
  gsap.set(lane, { scaleX: 0 });
  gsap.set(receiptPay, { scale: 0.7, y: 10 });
  gsap.set(receiptDelivery, { scale: 0.7, y: 10 });
  gsap.set(approveDone, { opacity: 0 });
  gsap.set(gridLines, { opacity: 0 });
  gsap.set(bizLight, { fill: VIOLET, opacity: 0.7 });
  gsap.set(boxes, { stroke: VIOLET });
  gsap.set(ticks, { stroke: VIOLET });
  gsap.set(stopRings, { stroke: VIOLET });
  const mainLength = prep(mainLine); prep(mainGlow);
  offerLines.forEach((p) => prep(p));
  ticks.forEach((p) => prep(p)); prep(approveTick); stopTicks.forEach((p) => prep(p)); prep(payTick); prep(deliveryTick);
  prep(payLine); prep(payGlow); prep(branchPay); prep(branchDelivery); prep(sameLine);
  void mainLength;

  // ── 00 · Any agent can start: three badges arrive and fold into the agent ────────────────────────────────
  badges.forEach((badge, i) => {
    const b = BADGES[i];
    tl.to(badge, { x: AGENT_AT.x - b.x, y: AGENT_AT.y - 100 - b.y, scale: 0.25, opacity: 0, svgOrigin: `${b.x} ${b.y}`, duration: 0.03, ease: "power2.in" }, 0.006 + i * 0.006);
  });
  tl.to(lean, { rotation: 2, scale: 1.02, duration: 0.02 }, 0.034).to(arm, { rotation: -16, duration: 0.02 }, 0.044);

  // ── 01 · Pedido: the document, the route, the packet, the store reacts ───────────────────────────────────
  tl.to(doc, { opacity: 1, scale: 1, rotation: 0, duration: 0.022, ease: "power2.out" }, 0.04);
  tl.to(gridLines[0], { opacity: 0.6, duration: 0.02 }, 0.05);
  draw([mainGlow, mainLine], 0.062, 0.03);
  tl.to(dotRequest, { opacity: 1, duration: 0.004 }, 0.088);
  travel(dotRequest, mainLine, 0.088, 0.04, 0, 0.98);
  travel(doc, mainLine, 0.09, 0.044, 0, 0.94);
  tl.to(dotRequest, { opacity: 0, duration: 0.006 }, 0.13);
  tl.to(lean, { rotation: 0, scale: 1, duration: 0.02 }, 0.1).to(arm, { rotation: 0, duration: 0.03 }, 0.1);
  pulse(biz, 0.132);
  glowTo(CYAN, 0.132);
  tl.to(doc, { scale: 0.3, opacity: 0, duration: 0.014, ease: "power2.in" }, 0.136);
  glowTo(VIOLET, 0.146, 0.012);

  // ── 02 · Oferta: the store answers; three panels become one quote ────────────────────────────────────────
  glowTo(CYAN, 0.162, 0.008);
  panels.forEach((p, i) => tl.to(p, { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.03, ease: "power3.out" }, 0.172 + i * 0.012));
  glowTo(VIOLET, 0.19, 0.012);
  tl.to(gridLines[2], { opacity: 0.5, duration: 0.02 }, 0.19);
  tl.to(dotOffer, { opacity: 1, duration: 0.004 }, 0.2);
  travel(dotOffer, mainLine, 0.2, 0.05, 1, 0.5);
  tl.to(dotOffer, { opacity: 0, duration: 0.008 }, 0.246);
  panels.forEach((p, i) => tl.to(p, { x: (QUOTE_AT.x - OFFER_AT[i].x) * 0.12, y: (QUOTE_AT.y - OFFER_AT[i].y) * 0.12, duration: 0.04 }, 0.23));
  offerLines.forEach((line, i) => draw([line], 0.238 + i * 0.008, 0.026));
  tl.to(quote, { opacity: 1, scale: 1, duration: 0.026, ease: "power3.out" }, 0.25);
  tl.to(quote, { x: -24, duration: 0.03 }, 0.284);
  tl.to(panels, { opacity: 0.25, duration: 0.02 }, 0.3);
  tl.to(offerLines, { opacity: 0.3, duration: 0.02 }, 0.3);

  // ── 03 · Reglas: TilcAI appears between agent and business and looks at everything ──────────────────────
  tl.to(core, { opacity: 1, duration: 0.04, ease: "power3.out" }, 0.332);
  tl.to(coreState, { scale: 1, rotation: 0, duration: 0.04, ease: "power3.out", onUpdate: paintCore }, 0.332);
  tl.to(gridLines[1], { opacity: 0.6, duration: 0.03 }, 0.34);
  tl.to(quote, { x: CORE_AT.x - QUOTE_AT.x, y: CORE_AT.y - 40 - QUOTE_AT.y, scale: 0.35, opacity: 0, duration: 0.03, ease: "power2.in" }, 0.372);
  pulse(coreInner, 0.398, 1.04, 0.012);
  checks.forEach((c, i) => {
    tl.to(c, { opacity: 1, scale: 1, duration: 0.02, ease: "power3.out" }, 0.404 + i * 0.008);
    draw([ticks[i]], 0.416 + i * 0.008, 0.014);
  });
  tl.to(requires, { opacity: 1, duration: 0.014 }, 0.46);
  tl.fromTo(requires, { y: 8 }, { y: 0, duration: 0.016, ease: "power2.out", immediateRender: false }, 0.46);
  draw([payGlow, payLine], 0.472, 0.016, 0.42);

  // ── 04 · Aprobación: the camera comes in, a panel floats up, the person approves, an authorization travels ─
  tl.to(coreState, { scale: 0.88, y: -22, duration: 0.04, onUpdate: paintCore }, 0.49);
  tl.to(checks, { opacity: 0.4, duration: 0.03 }, 0.5);
  tl.to(approval, { opacity: 1, scale: 1, y: 0, duration: 0.04, ease: "power3.out" }, 0.52);
  tl.to(approveFill, { fill: "#8b5cff", stroke: "#60e4ff", duration: 0.02 }, 0.57);
  tl.to(approveButton, { scale: 0.96, duration: 0.01, ease: "power1.in", transformOrigin: "50% 50%" }, 0.592).to(approveButton, { scale: 1, duration: 0.014, ease: "power2.out" }, 0.602);
  tl.to(approveText, { opacity: 0, duration: 0.01 }, 0.6);
  tl.to(approveDone, { opacity: 1, duration: 0.01 }, 0.606);
  draw([approveTick], 0.608, 0.016);
  tl.to(approveFill, { fill: "#0d4660", duration: 0.016 }, 0.606);
  tl.to(authToken, { opacity: 1, duration: 0.006 }, 0.626);
  travel(authToken, authPath, 0.626, 0.03);
  tl.to(authToken, { opacity: 0, scale: 0.6, duration: 0.01 }, 0.652);
  pulse(coreInner, 0.652, 1.05, 0.012);
  tl.to(checks, { opacity: 1, duration: 0.012 }, 0.652);
  tl.to(boxes, { stroke: CYAN, duration: 0.016 }, 0.656);
  tl.to(ticks, { stroke: CYAN, duration: 0.016 }, 0.656);
  tl.to(requiresBox, { stroke: CYAN, fill: "#0b2b3a", duration: 0.016 }, 0.652);
  tl.to(requiresText, { opacity: 0, duration: 0.01 }, 0.652).to(approvedText, { opacity: 1, duration: 0.012 }, 0.656);

  // ── 05 · Pago: the panel steps away, a lane opens, a token crosses four checkpoints into the store ──────
  tl.to(approval, { scale: 0.35, y: -70, x: 0, opacity: 0, duration: 0.036, ease: "power2.in" }, 0.664);
  tl.to(checks, { opacity: 0.22, duration: 0.03 }, 0.68);
  tl.to([...panels, ...offerLines], { opacity: 0.1, duration: 0.03 }, 0.68);
  tl.to(gridLines[3], { opacity: 0.55, duration: 0.03 }, 0.69);
  tl.to(lane, { opacity: 1, scaleX: 1, duration: 0.036, ease: "power3.out" }, 0.69);
  draw([payGlow, payLine], 0.7, 0.04, 1, "power2.inOut");
  tl.to([...stops, ...laneChevrons], { opacity: 1, duration: 0.014, stagger: 0.004 }, 0.72);
  tl.to(coin, { opacity: 1, duration: 0.008 }, 0.738);
  const coinStart = 0.742, coinEnd = 0.826;
  travel(coin, payLine, coinStart, coinEnd - coinStart, 0, 1);
  STOP_AT.forEach((point, i) => {
    const at = coinStart + fractionNear(payLine, point) * (coinEnd - coinStart);
    tl.to(stopRings[i], { stroke: CYAN, duration: 0.008 }, at - 0.006);
    tl.to(stopFills[i], { opacity: 1, duration: 0.008 }, at - 0.002);
    draw([stopTicks[i]], at + 0.004, 0.012);
  });
  pulse(biz, coinEnd - 0.004, 1.03, 0.012);
  glowTo(CYAN, coinEnd - 0.004, 0.01);
  tl.to(coin, { opacity: 0, scale: 0.4, duration: 0.01 }, coinEnd);
  tl.to(settled, { opacity: 1, duration: 0.012 }, coinEnd - 0.002);
  tl.fromTo(settled, { y: 6 }, { y: 0, duration: 0.016, ease: "power2.out", immediateRender: false }, coinEnd - 0.002);

  // ── 06 · Dos recibos: the core steps back, two documents appear, bound by the same orderId ───────────────
  tl.to(coreState, { y: CORE_FINAL.y, scale: CORE_FINAL.scale, duration: 0.04, onUpdate: paintCore }, 0.836);
  tl.to(core, { opacity: 0.85, duration: 0.04 }, 0.836);
  tl.to(checks, { opacity: 0.06, duration: 0.03 }, 0.84);
  tl.to([payGlow, payLine], { opacity: 0.22, duration: 0.03 }, 0.856);
  tl.to([requires], { opacity: 0, duration: 0.02 }, 0.84);
  glowTo(VIOLET, 0.846, 0.02);
  draw([branchPay, branchDelivery], 0.858, 0.024);
  tl.to(receiptPay, { opacity: 1, scale: 1, y: 0, duration: 0.03, ease: "power3.out" }, 0.866);
  draw([payTick], 0.892, 0.014);
  tl.to(receiptDelivery, { opacity: 1, scale: 1, y: 0, duration: 0.03, ease: "power3.out" }, 0.9);
  tl.to(sameOrder, { opacity: 1, duration: 0.014 }, 0.928);
  draw([sameLine], 0.926, 0.022);
  tl.to(notDelivery, { opacity: 1, duration: 0.014 }, 0.948);
  tl.to(deliveryPending, { opacity: 0, duration: 0.01 }, 0.962).to(deliveryConfirmed, { opacity: 1, duration: 0.012 }, 0.966);
  tl.to(deliveryRing, { stroke: CYAN, duration: 0.012 }, 0.966);
  draw([deliveryTick], 0.97, 0.014);
  glowTo(CYAN, 0.972, 0.012);
  tl.add(() => {}, 1); // the timeline is exactly 1 long, so a scroll position and a phase mean the same thing

  // ── Camera: in towards the approval, then back out ────────────────────────────────────────────────────
  CAMERA.forEach((c, i) => {
    const start = P[i], length = P[i + 1] - P[i];
    if (i === 0) return;
    tl.to(camera, { scale: 1 + (c.scale - 1) * zoom, x: c.x * zoom, y: c.y * zoom, duration: length * 0.65, ease: "sine.inOut" }, start);
  });

  // ── Right panel: each step leaves upward and the next one arrives from below ─────────────────────────────
  if (panel) {
    const cards = list<HTMLElement>("step", STEPS);
    const part = (i: number, name: string) => cards[i].querySelector<HTMLElement>(`[data-p="${name}"]`)!;
    const bar = el<HTMLElement>("bar");
    gsap.set(bar, { scaleX: 0, transformOrigin: "0% 50%" });
    cards.forEach((card, i) => {
      if (i === 0) return;
      gsap.set(card, { opacity: 0, y: 35, scale: 0.97 });
      gsap.set(part(i, "title"), { opacity: 0, y: 18 });
      gsap.set(part(i, "body"), { opacity: 0 });
      gsap.set(part(i, "artifact"), { opacity: 0, scale: 0.97 });
      gsap.set(part(i, "detail"), { clipPath: "inset(0 100% 0 0)" });
    });
    gsap.set(part(0, "detail"), { clipPath: "inset(0 0% 0 0)" });
    for (let i = 0; i < STEPS; i += 1) {
      const start = P[i], end = P[i + 1];
      tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: end - start, ease: "none", immediateRender: false }, start);
      if (i === 0) continue;
      tl.to(cards[i - 1], { opacity: 0, y: -30, scale: 0.97, duration: 0.016, ease: "power2.in" }, start - 0.02);
      tl.to(cards[i], { opacity: 1, y: 0, scale: 1, duration: 0.03, ease: "power2.out" }, start - 0.002);
      tl.to(part(i, "title"), { opacity: 1, y: 0, duration: 0.02, ease: "power2.out" }, start + 0.004);
      tl.to(part(i, "body"), { opacity: 1, duration: 0.022, ease: "power1.out" }, start + 0.01);
      tl.to(part(i, "artifact"), { opacity: 1, scale: 1, duration: 0.022, ease: "power2.out" }, start + 0.014);
      tl.to(part(i, "detail"), { clipPath: "inset(0 0% 0 0)", duration: 0.026, ease: "power2.out" }, start + 0.022);
    }
  }

  // ── Idle: small, slow, and only while the section is on screen (the section pauses these) ─────────────────
  idle.push(
    gsap.fromTo(body, { y: -2 }, { y: 2, duration: 3, ease: "sine.inOut", repeat: -1, yoyo: true, paused: true }),
    gsap.fromTo(head, { rotation: -1.5 }, { rotation: 1.5, duration: 4.6, ease: "sine.inOut", repeat: -1, yoyo: true, paused: true }),
    gsap.timeline({ repeat: -1, paused: true })
      .to(eyes, { scaleY: 0.15, duration: 0.07, yoyo: true, repeat: 1 }, 3.9)
      .to(eyes, { scaleY: 0.15, duration: 0.07, yoyo: true, repeat: 1 }, 8.7)
      .to(eyes, { scaleY: 0.15, duration: 0.07, yoyo: true, repeat: 1 }, 14.2)
      .to({}, { duration: 0.4 }, 14.5),
    gsap.fromTo([halo, haloCyan], { opacity: 0.75 }, { opacity: 1, duration: 3.4, ease: "sine.inOut", repeat: -1, yoyo: true, paused: true }),
  );
  // The idle loops move parts the timeline never touches (body, head, eyes, halos); the timeline only leans the whole figure.
  return { tl, idle };
}
