"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { acquireSmoothScroll, scrollPageTo } from "@/lib/smooth-scroll";
import type { OfficeCopy } from "@/lib/i18n/types";
import type { RoomId } from "../office/types";
import { PALETTE } from "../office/render/palette";
import { Icon, type IconName } from "../Icon";
import styles from "./OfficeBuildingSection.module.css";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
export const FLOOR_ORDER: RoomId[] = ["cafe", "receipts", "vault", "budget", "approval", "core", "business", "hub"];
// Centers measured in the existing, continuous illustration (roof → entrance).
const FLOOR_Y = [.103, .214, .315, .422, .536, .647, .779, .898];
// Half the height of the lit window around the floor being read, as a fraction of the tower.
const LIT_HALF = .052;
const FLOOR_ICONS: Record<RoomId, IconName> = {
  hub: "agent", business: "store", core: "shield", approval: "target", budget: "tree",
  vault: "signal", receipts: "receipt", cafe: "cafe",
};
type Props = { legend: OfficeCopy["legend"]; rooms: OfficeCopy["rooms"] };

/** "Ocho pisos. Un solo recorrido." → ["Ocho pisos.", "Un solo recorrido."], so each sentence gets its own line. */
const sentences = (text: string) => (text.match(/[^.!?]+[.!?]*/g) ?? [text]).map((part) => part.trim()).filter(Boolean);

/** One continuous tower, one camera and one reading panel, from floor 08 down to 01. */
export function OfficeBuildingSection({ legend, rooms }: Props) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const tower = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const shadeTop = useRef<HTMLDivElement>(null);
  const shadeBottom = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLElement>(null);
  const navigate = useRef<(index: number) => void>(() => {});
  const activeRef = useRef(0);
  const overviewRef = useRef(false);
  const repaint = useRef<() => void>(() => {});
  const [active, setActive] = useState(0);
  const [overview, setOverview] = useState(false);
  const [manual, setManual] = useState(false);
  const [ready, setReady] = useState(false);
  const room = FLOOR_ORDER[active];

  useEffect(() => acquireSmoothScroll(), []);
  useIsoLayoutEffect(() => {
    overviewRef.current = overview;
    repaint.current();
  }, [overview]);
  useIsoLayoutEffect(() => {
    if (!root.current || !track.current || !frame.current || !viewport.current || !tower.current) return;
    const section = root.current;
    const stage = viewport.current;
    const building = tower.current;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({
      reduce: "(prefers-reduced-motion: reduce)",
      motion: "(prefers-reduced-motion: no-preference)",
      compact: "(max-width: 899px)",
      short: "(max-height: 650px)",
    }, (context) => {
      const reduce = Boolean(context.conditions?.reduce);
      const compact = Boolean(context.conditions?.compact);
      // Short screens must let the complete text scroll normally.
      const isManual = reduce || Boolean(context.conditions?.short);
      setManual(isManual);
      const camera = { value: isManual ? activeRef.current : 0 };
      const paint = () => {
        const index = Math.min(7, Math.round(camera.value));
        if (index !== activeRef.current) { activeRef.current = index; setActive(index); }
        const start = Math.min(6, Math.floor(camera.value));
        const position = gsap.utils.interpolate(FLOOR_Y[start], FLOOR_Y[start + 1], camera.value - start);
        const scale = overviewRef.current ? Math.min(1, (stage.clientHeight - 36) / building.offsetHeight) : 1;
        const y = overviewRef.current ? (stage.clientHeight - building.offsetHeight * scale) / 2
          : stage.clientHeight * .48 - building.offsetHeight * position;
        // --inv keeps the level marks readable when the whole building is shrunk to fit.
        gsap.set(building, { y, scale, "--inv": 1 / scale });
        // The plan grid sits further back than the tower, so it travels less: that is the depth cue.
        gsap.set(backdrop.current, { y: reduce ? 0 : -building.offsetHeight * position * (compact ? .16 : .22) });
        // Everything outside the floor being read recedes; the window follows the camera continuously.
        gsap.set(shadeTop.current, { yPercent: (position - LIT_HALF) * 100 });
        gsap.set(shadeBottom.current, { yPercent: (position + LIT_HALF) * 100 });
        gsap.set(progress.current, { scaleX: (camera.value + 1) / 8 });
      };
      repaint.current = paint;
      let animation: gsap.core.Tween | undefined;
      let trigger: ScrollTrigger | undefined;
      if (!isManual) {
        animation = gsap.fromTo(camera, { value: 0 }, {
          value: 7, ease: "none", onUpdate: paint,
          scrollTrigger: {
            trigger: track.current,
            start: () => "top top+=" + (parseFloat(getComputedStyle(frame.current!).top) || 0),
            end: () => "+=" + Math.max(1, track.current!.offsetHeight - frame.current!.offsetHeight),
            scrub: compact ? .25 : .65, invalidateOnRefresh: true,
          },
        });
        trigger = animation.scrollTrigger;
      }
      navigate.current = (index) => {
        if (isManual) gsap.to(camera, { value: index, duration: reduce ? 0 : .5, ease: "power2.inOut", overwrite: true, onUpdate: paint });
        else if (trigger) scrollPageTo(trigger.start + (trigger.end - trigger.start) * index / 7);
      };
      paint();
      setReady(true);
      let resizeFrame = 0;
      const observer = new ResizeObserver(() => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => { trigger?.refresh(); paint(); });
      });
      observer.observe(stage);
      return () => {
        observer.disconnect(); cancelAnimationFrame(resizeFrame);
        gsap.killTweensOf(camera); trigger?.kill(); animation?.kill();
      };
    }, section);
    return () => { media.revert(); navigate.current = () => {}; repaint.current = () => {}; };
  }, []);

  return (
    <section ref={root} id="office-rooms" className={styles.root} data-ready={ready} data-overview={overview} aria-labelledby="office-building-title" style={{ "--room-accent": PALETTE[room].light } as CSSProperties}>
      <header className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>{legend.buildingEyebrow}</p>
          <h2 id="office-building-title">{sentences(legend.buildingTitle).map((line, index) => <span key={line} className={index > 0 ? styles.titleRest : styles.titleLine}>{line}{" "}</span>)}</h2>
        </div>
        <div className={styles.introCopy}><p>{legend.buildingLead}</p><span><Icon name="arrow" />{manual ? legend.buildingSelect : legend.buildingScroll}</span></div>
      </header>
      <div ref={track} className={styles.track}>
        <div ref={frame} className={styles.frame}>
          <div ref={viewport} className={styles.viewport}>
            <div ref={backdrop} className={styles.backdrop} aria-hidden="true" />
            <div ref={tower} className={styles.tower} aria-hidden="true">
              <Image className={styles.towerImage} src="/office/building/office-tower.webp" alt="" width={1024} height={1536} sizes="(min-width: 900px) 80vw, 140vw" quality={88} draggable={false} />
              <div ref={shadeTop} className={`${styles.shade} ${styles.shadeTop}`} />
              <div ref={shadeBottom} className={`${styles.shade} ${styles.shadeBottom}`} />
              <div className={styles.ground} />
              {FLOOR_ORDER.map((id, index) => <div key={id} className={`${styles.floorMarker} ${index === active ? styles.floorActive : ""}`} style={{ top: `${FLOOR_Y[index] * 100}%`, "--floor-accent": PALETTE[id].light } as CSSProperties}><i /><span>{PALETTE[id].number}</span></div>)}
            </div>
            <div className={styles.vignette} aria-hidden="true" />
            <button type="button" className={styles.viewToggle} aria-pressed={overview} onClick={() => setOverview(value => !value)}><Icon name={overview ? "target" : "layers"} />{overview ? legend.buildingDetail : legend.buildingOverview}</button>
          </div>
          <div className={styles.panel}>
            <p className={styles.panelFloor}><Icon name={FLOOR_ICONS[room]} />{legend.buildingFloor} {PALETTE[room].number}</p>
            <div className={styles.copyStack}>
              {FLOOR_ORDER.map((id, index) => <article key={id} className={styles.detail} aria-hidden={active !== index} data-active={active === index} aria-labelledby={`office-floor-${id}`}>
                <h3 id={`office-floor-${id}`}>{rooms[id].name}</h3>
                <p className={styles.who}>{rooms[id].who}</p>
                <p className={styles.body}>{rooms[id].body}</p>
              </article>)}
            </div>
            <nav className={styles.floors} aria-label={legend.buildingSelect} style={{ "--i": active } as CSSProperties}>
              <span className={styles.slider} aria-hidden="true" />
              {FLOOR_ORDER.map((id, index) => <button key={id} type="button" onClick={() => navigate.current(index)} aria-current={active === index ? "step" : undefined} aria-label={`${legend.jumpToFloor} ${PALETTE[id].number}: ${rooms[id].name}`} style={{ "--button-accent": PALETTE[id].light } as CSSProperties}><b>{PALETTE[id].number}</b><span>{rooms[id].name}</span></button>)}
            </nav>
            <div className={styles.panelFooter}><span>{manual ? legend.buildingSelect : legend.buildingScroll}</span><div><button type="button" disabled={active === 0} onClick={() => navigate.current(Math.max(0, active - 1))} aria-label={legend.buildingPrevious}><Icon name="arrow" /></button><button type="button" disabled={active === 7} onClick={() => navigate.current(Math.min(7, active + 1))} aria-label={legend.buildingNext}><Icon name="arrow" /></button></div></div>
          </div>
          <div className={styles.progress} aria-hidden="true"><i ref={progress} style={{ transform: "scaleX(.125)" }} /></div>
        </div>
      </div>
    </section>
  );
}
