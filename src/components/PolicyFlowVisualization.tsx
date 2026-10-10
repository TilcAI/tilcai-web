"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon } from "./Icon";
import type { Decision } from "@/lib/demo/scenarios";
import type { Copy } from "@/lib/i18n";
import styles from "./PolicyFlowVisualization.module.css";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** The same three characters as «Rutas de pago», so the simulation reads as part of one story. */
const art = {
  user: "/assets/img/rutas/ruta-p1-img1.png",
  agent: "/assets/img/rutas/ruta-p1-img2.png",
  business: "/assets/img/rutas/ruta-p1-img3.png",
} as const;

/** Where, along the stretch between policy and business agent, a pause or a stop is drawn (share of its length). */
const GATE_AT = 0.5;
const STOP_AT = 0.3;

type Props = {
  t: Copy["demo"];
  scenarioTitle: string;
  businessName: string;
  recipient: string;
  amount: string;
  limit: string;
  currency: string;
  displayedDecision: Decision;
  needsApproval: boolean;
  approvalSimulated: boolean;
  changedRecipient: boolean;
  amountOverLimit: boolean;
  /** Changes whenever the simulated request changes (or is asked to run again); the path is walked again. */
  runKey: string;
  /** True from the moment a walk starts until the policy has resolved its checks: the answer is not shown before its cause. */
  onWalking?: (walking: boolean) => void;
};

type Player = { play: (from: "start" | "gate") => void };

const num = (value: string) => Number.parseFloat(value) || 0;

function Station({ id, src, shifted, title, detail, reached }: {
  id: string; src: string; shifted?: boolean; title: string; detail?: string; reached: boolean;
}) {
  return (
    <div className={styles.station} data-st={id} data-reached={reached} aria-hidden="true">
      <span className={styles.medal}>
        <span className={styles.base} />
        <Image className={styles.art} data-shifted={shifted || undefined} src={src} alt="" width={168} height={168} sizes="(min-width: 700px) 80px, 72px" />
        <span className={styles.ring} data-ring />
      </span>
      <span className={styles.caption}>
        <strong>{title}</strong>
        {detail && <small>{detail}</small>}
      </span>
    </div>
  );
}

function Segment({ index, max, tone, children }: { index: number; max: number; tone: "rail" | "allow" | "deny" | "human"; children?: ReactNode }) {
  return (
    <div className={styles.seg} data-seg={index} data-tone={tone} style={{ "--max": max } as CSSProperties} aria-hidden="true">
      <span className={styles.fill} />
      <span className={styles.head} data-head />
      {children}
    </div>
  );
}

/**
 * The simulated path of one request: the user asks, TilcAI's agent checks the policy, and only then does the business side
 * hear about it. A packet walks the line; the policy card resolves its checks as it arrives and the line either goes on,
 * stops with a mark, or waits for a person. Everything is drawn from the props, so without motion it is simply the end state.
 */
export function PolicyFlowVisualization({
  t, scenarioTitle, businessName, recipient, amount, limit, currency,
  displayedDecision, needsApproval, approvalSimulated, changedRecipient, amountOverLimit, runKey, onWalking,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const player = useRef<Player | null>(null);
  const entered = useRef(false);
  const last = useRef({ key: runKey, approved: approvalSimulated });
  const walking = useRef(onWalking);

  const isDenied = displayedDecision === "DENY";
  const isPending = needsApproval && !approvalSimulated;
  const isApproved = needsApproval && approvalSimulated;
  const through = !isDenied && !isPending;
  const decision = isDenied ? "deny" : isPending ? "human" : "allow";
  const marker = isDenied ? "blocked" : isPending ? "pending" : isApproved ? "approved" : "idle";
  const markerAt = isDenied ? STOP_AT : GATE_AT;
  const decisionLabel = isDenied ? t.flow.blocked : isPending ? t.flow.reviewRequired : t.flow.allowed;

  const amountValue = num(amount);
  const limitValue = num(limit);
  const scale = Math.max(amountValue, limitValue) * 1.18 || 1;
  const meter = { "--ratio": amountValue / scale, "--lim": limitValue / scale } as CSSProperties;

  useIsoLayoutEffect(() => { walking.current = onWalking; });

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {}, el);
      const all = (selector: string) => Array.from(el.querySelectorAll<HTMLElement>(selector));
      const stations = all("[data-st]");
      const segs = all("[data-seg]");
      const heads = all("[data-head]");
      const results = all("[data-result]");
      const meterBox = el.querySelector<HTMLElement>("[data-meter]");
      const markerEl = el.querySelector<HTMLElement>("[data-marker]");
      const rings = all("[data-ring]");
      const arrival = el.querySelector<HTMLElement>('[data-st="business"] [data-ring]');
      const ratio = () => Number.parseFloat(meterBox?.style.getPropertyValue("--ratio") ?? "0") || 0;
      let tl: gsap.core.Timeline | null = null;

      const hold = (index: number, on: boolean) => {
        const node = stations[index];
        if (!node) return;
        if (on) node.setAttribute("data-hold", "");
        else node.removeAttribute("data-hold");
      };

      /** Hands the drawing back to the stylesheet: every inline value written during a run is removed. */
      const settle = () => {
        segs.forEach((seg) => seg.style.removeProperty("--p"));
        meterBox?.style.removeProperty("--m");
        stations.forEach((_, index) => hold(index, false));
        gsap.set([...heads, ...results, ...rings, ...(markerEl ? [markerEl] : [])], { clearProps: "opacity,visibility,transform" });
        walking.current?.(false);
      };

      /** The start of a run: nothing travelled yet, checks unresolved. */
      const rewind = (from: "start" | "gate") => {
        const fresh = from === "start";
        stations.forEach((_, index) => hold(index, fresh ? index > 0 : index > 2));
        segs.forEach((seg, index) => {
          if (fresh || index > 2) seg.style.setProperty("--p", "0");
          else if (index === 2) seg.style.setProperty("--p", String(GATE_AT));
        });
        gsap.set(heads, { opacity: 0 });
        gsap.set(rings, { opacity: 0 });
        if (fresh) {
          gsap.set(results, { opacity: 0, y: 6 });
          meterBox?.style.setProperty("--m", "0");
          if (markerEl) gsap.set(markerEl, { opacity: 0, scale: 0.6 });
        }
      };

      const play = (from: "start" | "gate") => {
        ctx.add(() => {
          // Resuming after the approval while the first walk is still going: let that walk land first, so the
          // checks, the meter and the line are drawn before the line continues from the gate.
          if (from === "gate" && tl?.isActive()) tl.progress(1);
          tl?.kill();
          rewind(from);
          const fresh = from === "start";
          const max = segs.map((seg) => Number.parseFloat(seg.style.getPropertyValue("--max")) || 0);
          const outcome = markerEl?.dataset.state ?? "idle";
          const stops = outcome === "blocked" || outcome === "pending";
          const through = stations[3]?.dataset.reached === "true";
          const line = gsap.timeline({ onComplete: settle });
          tl = line;
          let at = 0.08;

          const travel = (index: number, start: number, end: number, duration: number) => {
            line.set(heads[index], { opacity: 1 }, at);
            line.fromTo(segs[index], { "--p": start }, { "--p": end, duration, ease: "power1.inOut" }, at);
            line.set(heads[index], { opacity: 0 }, at + duration);
            at += duration;
          };
          const arrive = (index: number) => { line.add(() => hold(index, false), at); };

          if (fresh) {
            walking.current?.(true);
            travel(0, 0, max[0], 0.2); arrive(1);
            travel(1, 0, max[1], 0.2); arrive(2);
            // the policy resolves its checks while the packet waits at the gate; only then is the answer shown
            line.to(results[0], { opacity: 1, y: 0, duration: 0.26, ease: "power3.out" }, at + 0.04);
            if (meterBox) line.fromTo(meterBox, { "--m": 0 }, { "--m": ratio(), duration: 0.4, ease: "power3.out" }, at + 0.06);
            line.to(results[1], { opacity: 1, y: 0, duration: 0.26, ease: "power3.out" }, at + 0.34);
            line.to(results[2], { opacity: 1, y: 0, duration: 0.26, ease: "power3.out" }, at + 0.62);
            line.add(() => walking.current?.(false), at + 0.72);
            at += 0.85;
            travel(2, 0, max[2], 0.1 + max[2] * 0.3);
            if (markerEl && stops) line.to(markerEl, { opacity: 1, scale: 1, duration: 0.26, ease: "power3.out" }, at);
          } else {
            travel(2, GATE_AT, max[2], 0.24);
          }

          if (through) {
            arrive(3);
            travel(3, 0, max[3], 0.2);
            arrive(4);
            // immediateRender off: a fromTo placed later on the timeline must not draw its first frame now
            if (arrival) line.fromTo(arrival, { opacity: 0.7, scale: 0.8 }, { opacity: 0, scale: 1.55, duration: 0.7, ease: "power2.out", immediateRender: false }, at);
          }
        });
      };

      player.current = { play };
      // Until the simulation is in view it waits at its first step, so the first walk is seen.
      rewind("start");
      ctx.add(() => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 78%",
          once: true,
          onEnter: () => { if (!entered.current) { entered.current = true; play("start"); } },
        });
      });

      return () => {
        tl?.kill();
        ctx.revert();
        settle();
        player.current = null;
        // a rebuilt player (strict-mode remount, motion preference switched back on) must be allowed to walk again
        entered.current = false;
      };
    });

    return () => mm.revert();
    // Built once per motion preference; what the path shows is read from the drawing, state changes are handled below.
  }, []);

  useIsoLayoutEffect(() => {
    const before = last.current;
    if (before.key === runKey && before.approved === approvalSimulated) return;
    const from = approvalSimulated && !before.approved && before.key === runKey ? "gate" : "start";
    last.current = { key: runKey, approved: approvalSimulated };
    entered.current = true;
    player.current?.play(from);
  }, [runKey, approvalSimulated]);

  const recipientOk = !changedRecipient;
  const amountOk = !amountOverLimit;

  return (
    <section ref={root} className={styles.stage} data-decision={decision} aria-label={t.flow.label}>
      <p className={styles.label} aria-hidden="true">{t.flow.label}</p>
      <div className={styles.track}>
        <Station id="user" src={art.user} title={t.flow.user} detail={scenarioTitle} reached />
        <Segment index={0} max={1} tone="rail" />
        <Station id="agent" src={art.agent} title={t.flow.tilcaiAgent} reached />
        <Segment index={1} max={1} tone="rail" />

        <div className={styles.policy} data-st="policy" data-reached="true" data-state={decision}>
          <header className={styles.policyHead}>
            <span className={styles.policyIcon}><Icon name="shield" className={styles.icon} /></span>
            <strong>{t.flow.policy}</strong>
          </header>
          <dl className={styles.rows}>
            <div className={styles.row} data-ok={recipientOk}>
              <dt>{t.fields.recipient}</dt>
              <dd className={styles.value}>{recipient}</dd>
              <dd className={styles.result} data-result>
                <span className={styles.mark} aria-hidden="true"><Icon name={recipientOk ? "check" : "x"} className={styles.markIcon} /></span>
                {recipientOk ? t.flow.allowed : t.flow.recipientNotAllowed}
              </dd>
            </div>
            <div className={styles.row} data-ok={amountOk}>
              <dt>{t.fields.amount}</dt>
              <dd className={styles.value}>{amount} {currency}</dd>
              <dt className={styles.limitKey}>{t.fields.limit}</dt>
              <dd className={`${styles.value} ${styles.limitValue}`}>{limit} {currency}</dd>
              <dd className={styles.meterRow}>
                <span className={styles.meter} data-meter data-over={!amountOk || undefined} style={meter}>
                  <i className={styles.meterFill} />
                  <i className={styles.meterLimit} />
                </span>
              </dd>
              <dd className={styles.result} data-result>
                <span className={styles.mark} aria-hidden="true"><Icon name={amountOk ? "check" : "x"} className={styles.markIcon} /></span>
                {amountOk ? t.flow.allowed : t.flow.overLimit}
              </dd>
            </div>
            {/* What the two checks add up to; it is also what explains a purchase that passes both and still needs a person. */}
            <div className={styles.row} data-tone={decision}>
              <dt>{t.fields.result}</dt>
              <dd className={`${styles.result} ${styles.decisionLine}`} data-result>
                <span className={styles.mark} aria-hidden="true"><Icon name={isDenied ? "x" : isPending ? "user" : "check"} className={styles.markIcon} /></span>
                {decisionLabel}
              </dd>
            </div>
          </dl>
        </div>

        <Segment index={2} max={isDenied ? STOP_AT : isPending ? GATE_AT : 1} tone={isDenied ? "deny" : isPending ? "human" : "allow"}>
          <span className={styles.marker} data-marker data-state={marker} style={{ "--at": markerAt } as CSSProperties}>
            <Icon name={marker === "blocked" ? "x" : marker === "approved" ? "check" : "user"} className={styles.markerIcon} />
          </span>
        </Segment>
        <Station id="bizagent" src={art.agent} shifted title={t.flow.businessAgent} reached={through} />
        <Segment index={3} max={through ? 1 : 0} tone="allow" />
        <Station id="business" src={art.business} title={t.flow.business} detail={businessName} reached={through} />
      </div>
    </section>
  );
}
