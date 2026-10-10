"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { networkLogos } from "@/lib/content/network-logos";
import { Icon } from "../Icon";
import styles from "./SolutionsSection.module.css";

type Props = {
  kicker: string;
  title: string;
  body: string;
  route: { label: string; items: { title: string; text: string }[] };
  stepsLabel: string;
  stepsHint: string;
  steps: { title: string; text: string }[];
  phone: { alt: string; caption: string };
  image: { src: string; width: number; height: number };
};

/**
 * Where each step lives in the capture, as a share of the phone screen (the capture is 720 × 1612 and fills the screen):
 * the confirmation message with its button, and the receipt that follows it.
 */
const REGIONS = [
  { top: 18.5, height: 43.2 },
  { top: 62, height: 30.4 },
] as const;

/** Auto-advance, once, after the showcase has been in view for a moment: it explains the order, then it is the reader's. */
const AUTO_ADVANCE_MS = 3400;
const TILT = { x: 5, y: 3.5 };

/**
 * Optipagos: the copy, the two steps and the real capture inside a phone. The steps are buttons: choosing one (hover with
 * a mouse, tap, focus) puts a spotlight on the part of the capture it describes, and everything else dims. The phone
 * leans a few degrees towards a mouse pointer; touch and reduced motion get neither the lean nor the auto-advance.
 */
export function OptipagosShowcase({ kicker, title, body, route, stepsLabel, stepsHint, steps, phone, image }: Props) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const device = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const leans = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    leans.current = !reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const el = root.current;
    if (!el || reduce || !("IntersectionObserver" in window)) return;
    let timer: number | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => {
          if (!touched.current) setActive(1);
        }, AUTO_ADVANCE_MS);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  const pick = (index: number) => {
    touched.current = true;
    setActive(index);
  };

  const lean = (event: PointerEvent<HTMLElement>) => {
    if (!leans.current || event.pointerType !== "mouse" || !device.current) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width - 0.5) * 2;
    const y = ((event.clientY - box.top) / box.height - 0.5) * 2;
    device.current.style.transform = `perspective(1000px) rotateY(${(x * TILT.x).toFixed(2)}deg) rotateX(${(-y * TILT.y).toFixed(2)}deg)`;
  };
  const level = () => {
    if (device.current) device.current.style.transform = "";
  };

  return (
    <div className={styles.featuredBody} ref={root}>
      <div className={styles.copy}>
        <p className={styles.kicker}>{kicker}</p>
        <h3 id="solution-optipagos">{title}</h3>
        <p className={styles.body}>{body}</p>

        <p className={styles.routeLabel}>{route.label}</p>
        <ul className={styles.route}>
          {route.items.map((item, index) => (
            <li key={item.title}>
              {index === 0 && (
                <span className={styles.mark} aria-hidden="true">
                  <svg viewBox="0 0 7 7" shapeRendering="crispEdges">
                    <path d="M0 0h3v3H0zM4 0h3v3H4zM0 4h3v3H0z" fill="none" stroke="currentColor" strokeWidth=".9" />
                    <path d="M1 1h1v1H1zM5 1h1v1H5zM1 5h1v1H1zM4 4h1v1H4zM6 4h1v1H6zM5 5h1v1H5zM4 6h1v1H4zM6 6h1v1H6z" fill="currentColor" />
                  </svg>
                </span>
              )}
              {index === 1 && <span className={styles.mark} aria-hidden="true"><Icon name="coin" /></span>}
              {index === 2 && <Image className={styles.markImg} src={networkLogos["avalanche-fuji"]} width={64} height={64} alt="" />}
              <span>
                <strong>{item.title}</strong>
                <span className={styles.routeText}>{item.text}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className={styles.stepsHead}>
          <span>{stepsLabel}</span>
          <span className={styles.stepsHint}>{stepsHint}</span>
        </div>
        <ol className={styles.steps} aria-label={stepsLabel}>
          {steps.map((step, index) => (
            <li key={step.title}>
              <button
                type="button"
                className={styles.step}
                aria-pressed={active === index}
                onClick={() => pick(index)}
                onFocus={() => pick(index)}
                onPointerEnter={(event) => event.pointerType === "mouse" && pick(index)}
              >
                <span className={styles.stepNo} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.stepText}>
                  <strong>{step.title}</strong>
                  {step.text}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <figure className={styles.phone} onPointerMove={lean} onPointerLeave={level}>
        <div className={styles.device} ref={device}>
          <span className={styles.camera} aria-hidden="true" />
          <div className={styles.screen}>
            <Image
              src={image.src}
              width={image.width}
              height={image.height}
              alt={phone.alt}
              sizes="(min-width: 640px) 290px, 280px"
              quality={85}
            />
            {REGIONS.map((region, index) => (
              <span
                key={index}
                className={styles.spot}
                data-on={active === index}
                data-n={String(index + 1).padStart(2, "0")}
                style={{ "--top": `${region.top}%`, "--h": `${region.height}%` } as CSSProperties}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
        <figcaption>{phone.caption}</figcaption>
      </figure>
    </div>
  );
}
