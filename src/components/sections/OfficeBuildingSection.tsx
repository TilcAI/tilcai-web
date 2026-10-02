"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { acquireSmoothScroll } from "@/lib/smooth-scroll";
import type { OfficeCopy } from "@/lib/i18n/types";
import type { RoomId } from "../office/types";
import { PALETTE } from "../office/render/palette";
import { Icon, type IconName } from "../Icon";
import styles from "./OfficeBuildingSection.module.css";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Tour the illustrated tower from its rooftop down to the entrance. */
export const FLOOR_ORDER: RoomId[] = ["cafe", "receipts", "vault", "budget", "approval", "core", "business", "hub"];
const FLOOR_ICONS: Record<RoomId, IconName> = {
  hub: "agent", business: "store", core: "shield", approval: "target", budget: "tree",
  vault: "signal", receipts: "receipt", cafe: "cafe",
};
const floorPosition = (index: number) => `${9.25 + index * 11.65}%`;

type Props = { legend: OfficeCopy["legend"]; rooms: OfficeCopy["rooms"] };

/** An illustrated cross-section with live HTML for every sign and room description. */
export function OfficeBuildingSection({ legend, rooms }: Props) {
  const root = useRef<HTMLElement>(null);
  const skyLayer = useRef<HTMLDivElement>(null);
  const skyDrift = useRef<HTMLDivElement>(null);
  const towerLayer = useRef<HTMLDivElement>(null);
  const towerDrift = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => acquireSmoothScroll(), []);

  useIsoLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      for (const [index, step] of stepRefs.current.entries()) {
        if (!step) continue;
        ScrollTrigger.create({
          trigger: step,
          start: "top 57%",
          end: "bottom 57%",
          onEnter: () => setActive(index),
          onEnterBack: () => setActive(index),
        });
      }

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.1, invalidateOnRefresh: true },
        });
        timeline.fromTo(skyLayer.current, { yPercent: 6, scale: 1.08 }, { yPercent: -8, scale: 1.16 }, 0);
        timeline.fromTo(towerLayer.current, { yPercent: 2, scale: .96 }, { yPercent: -2, scale: 1.035 }, 0);

        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        if (!fine) return;
        const skyX = gsap.quickTo(skyDrift.current, "x", { duration: 1.2, ease: "power3.out" });
        const skyY = gsap.quickTo(skyDrift.current, "y", { duration: 1.2, ease: "power3.out" });
        const towerX = gsap.quickTo(towerDrift.current, "x", { duration: .9, ease: "power3.out" });
        const towerY = gsap.quickTo(towerDrift.current, "y", { duration: .9, ease: "power3.out" });
        const move = (event: PointerEvent) => {
          const box = section.getBoundingClientRect();
          const x = (event.clientX - box.left) / box.width - .5;
          const y = (event.clientY - box.top) / Math.max(1, window.innerHeight) - .5;
          skyX(x * -20); skyY(y * -14);
          towerX(x * 12); towerY(y * 8);
        };
        const reset = () => { skyX(0); skyY(0); towerX(0); towerY(0); };
        section.addEventListener("pointermove", move, { passive: true });
        section.addEventListener("pointerleave", reset);
        return () => {
          section.removeEventListener("pointermove", move);
          section.removeEventListener("pointerleave", reset);
        };
      });
    }, section);
    return () => context.revert();
  }, []);

  const jump = (index: number) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stepRefs.current[index]?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "center" });
  };

  return (
    <section ref={root} id="office-rooms" className={styles.root} aria-labelledby="office-building-title">
      <header className={styles.intro}>
        <p className={styles.eyebrow}>{legend.buildingEyebrow}</p>
        <h2 id="office-building-title">{legend.buildingTitle}</h2>
        <p>{legend.buildingLead}</p>
      </header>

      <div className={styles.story}>
        <div className={styles.visual}>
          <div className={styles.viewport}>
            <div ref={skyLayer} className={styles.skyLayer} aria-hidden="true">
              <div ref={skyDrift} className={styles.skyDrift}>
                <Image src="/office/building/distant-city.webp" alt="" fill sizes="(min-width: 900px) 60vw, 100vw" quality={85} draggable={false} />
              </div>
            </div>
            <div className={styles.haze} aria-hidden="true" />
            <div ref={towerLayer} className={styles.towerLayer}>
              <div ref={towerDrift} className={styles.towerDrift}>
                <Image
                  className={styles.towerImage}
                  src="/office/building/office-tower.webp"
                  alt=""
                  width={1024}
                  height={1536}
                  sizes="(min-width: 1200px) 42vw, (min-width: 900px) 55vw, 80vw"
                  quality={88}
                  draggable={false}
                />
                <div
                  className={styles.floorAura}
                  style={{ top: floorPosition(active), "--room-accent": PALETTE[FLOOR_ORDER[active]].primary } as CSSProperties}
                  aria-hidden="true"
                />
                {FLOOR_ORDER.map((id, index) => (
                  <button
                    key={id}
                    type="button"
                    className={`${styles.floorSign}${active === index ? ` ${styles.isActive}` : ""}`}
                    style={{ top: floorPosition(index), "--room-accent": PALETTE[id].primary } as CSSProperties}
                    onClick={() => jump(index)}
                    aria-label={`${legend.jumpToFloor} ${PALETTE[id].number}: ${rooms[id].name}`}
                    aria-current={active === index ? "step" : undefined}
                  >
                    <span className={styles.signNumber}>{PALETTE[id].number}</span>
                    <span className={styles.signName}>{rooms[id].name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.stageVignette} aria-hidden="true" />
          </div>
        </div>

        <ol className={styles.steps} aria-label={legend.buildingEyebrow}>
          {FLOOR_ORDER.map((id, index) => (
            <li
              key={id}
              ref={(element) => { stepRefs.current[index] = element; }}
              className={`${styles.step}${active === index ? ` ${styles.stepActive}` : ""}`}
              style={{ "--room-accent": PALETTE[id].primary } as CSSProperties}
              aria-labelledby={`office-floor-${id}`}
            >
              <article className={styles.detail}>
                <div className={styles.detailTop}>
                  <span className={styles.detailIcon} aria-hidden="true"><Icon name={FLOOR_ICONS[id]} /></span>
                  <span className={styles.detailIndex}>{PALETTE[id].number} / 08</span>
                </div>
                <h3 id={`office-floor-${id}`}>{rooms[id].name}</h3>
                <p className={styles.who}>{rooms[id].who}</p>
                <p className={styles.body}>{rooms[id].body}</p>
                <span className={styles.progress} aria-hidden="true"><i style={{ width: `${(index + 1) * 12.5}%` }} /></span>
              </article>
            </li>
          ))}
        </ol>
      </div>
      <p className={styles.note}>{legend.note}</p>
    </section>
  );
}
