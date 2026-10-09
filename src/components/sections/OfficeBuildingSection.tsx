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
const FLOOR_ICONS: Record<RoomId, IconName> = {
  hub: "agent", business: "store", core: "shield", approval: "target", budget: "tree",
  vault: "signal", receipts: "receipt", cafe: "cafe",
};
type Props = { legend: OfficeCopy["legend"]; rooms: OfficeCopy["rooms"] };

/** One continuous tower, one camera and one reading panel, from floor 08 down to 01. */
export function OfficeBuildingSection({ legend, rooms }: Props) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const tower = useRef<HTMLDivElement>(null);
  const sky = useRef<HTMLDivElement>(null);
  const orbit = useRef<HTMLDivElement>(null);
  const navigate = useRef<(index: number) => void>(() => {});
  const activeRef = useRef(0);
  const overviewRef = useRef(false);
  const repaint = useRef<() => void>(() => {});
  const [active, setActive] = useState(0);
  const [overview, setOverview] = useState(false);
  const [manual, setManual] = useState(false);
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
        gsap.set(building, { y, scale });
        gsap.set(sky.current, { yPercent: reduce ? 0 : camera.value * (compact ? -.6 : -1.3) });
        gsap.set(orbit.current, { y: reduce ? 0 : camera.value * (compact ? -5 : -12) });
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
    <section ref={root} id="office-rooms" className={styles.root} aria-labelledby="office-building-title" style={{ "--room-accent": PALETTE[room].light } as CSSProperties}>
      <header className={styles.intro}>
        <div><p className={styles.eyebrow}>{legend.buildingEyebrow}</p><h2 id="office-building-title">{legend.buildingTitle}</h2></div>
        <div className={styles.introCopy}><p>{legend.buildingLead}</p><span><Icon name="arrow" />{manual ? legend.buildingSelect : legend.buildingScroll}</span></div>
      </header>
      <div ref={track} className={styles.track}>
        <div ref={frame} className={styles.frame}>
          <div ref={viewport} className={styles.viewport}>
            <div ref={sky} className={styles.sky} aria-hidden="true"><Image src="/office/building/distant-city.webp" alt="" fill sizes="(min-width: 900px) 65vw, 100vw" quality={85} draggable={false} /></div>
            <div ref={orbit} className={styles.orbit} aria-hidden="true"><i /><b /></div>
            <div ref={tower} className={styles.tower} aria-hidden="true">
              <Image className={styles.towerImage} src="/office/building/office-tower.webp" alt="" width={1024} height={1536} sizes="(min-width: 900px) 80vw, 140vw" quality={88} draggable={false} />
              {FLOOR_ORDER.map((id, index) => <div key={id} className={`${styles.floorMarker} ${index === active ? styles.floorActive : ""}`} style={{ top: `${FLOOR_Y[index] * 100}%`, "--floor-accent": PALETTE[id].light } as CSSProperties}><i /><span>{PALETTE[id].number}</span></div>)}
            </div>
            <div className={styles.vignette} aria-hidden="true" />
            <div className={styles.sceneLabel}><i />{legend.buildingEyebrow}</div>
            <button type="button" className={styles.viewToggle} aria-pressed={overview} onClick={() => setOverview(value => !value)}><Icon name={overview ? "target" : "layers"} />{overview ? legend.buildingDetail : legend.buildingOverview}</button>
            <div className={styles.floorBadge} aria-hidden="true"><Icon name={FLOOR_ICONS[room]} /><span>{PALETTE[room].number}</span><b>{rooms[room].name}</b></div>
          </div>
          <div className={styles.panel}>
            <div className={styles.panelHeading}><span>{legend.buildingFloor} {PALETTE[room].number}</span><span>{String(active + 1).padStart(2, "0")} <b>/ 08</b></span></div>
            <div className={styles.copyStack}>
              {FLOOR_ORDER.map((id, index) => <article key={id} className={styles.detail} aria-hidden={active !== index} data-active={active === index} aria-labelledby={`office-floor-${id}`}>
                <span className={styles.detailIcon} aria-hidden="true"><Icon name={FLOOR_ICONS[id]} /></span>
                <h3 id={`office-floor-${id}`}>{rooms[id].name}</h3>
                <p className={styles.who}>{rooms[id].who}</p>
                <p className={styles.body}>{rooms[id].body}</p>
              </article>)}
            </div>
            <nav className={styles.navigation} aria-label={legend.buildingSelect}>
              {FLOOR_ORDER.map((id, index) => <button key={id} type="button" onClick={() => navigate.current(index)} aria-current={active === index ? "step" : undefined} aria-label={`${legend.jumpToFloor} ${PALETTE[id].number}: ${rooms[id].name}`} style={{ "--button-accent": PALETTE[id].light } as CSSProperties}>{PALETTE[id].number}<i /></button>)}
            </nav>
            <div className={styles.panelFooter}><span>{manual ? legend.buildingSelect : legend.buildingScroll}</span><div><button type="button" disabled={active === 0} onClick={() => navigate.current(Math.max(0, active - 1))} aria-label={legend.buildingPrevious}><Icon name="arrow" /></button><button type="button" disabled={active === 7} onClick={() => navigate.current(Math.min(7, active + 1))} aria-label={legend.buildingNext}><Icon name="arrow" /></button></div></div>
          </div>
          <div className={styles.progress} aria-hidden="true"><i style={{ transform: `scaleX(${(active + 1) / 8})` }} /></div>
        </div>
      </div>
      <p className={styles.note}>{legend.note}</p>
    </section>
  );
}
