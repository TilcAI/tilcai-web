"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { acquireSmoothScroll } from "@/lib/smooth-scroll";
import styles from "./rails.module.css";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * The headline and the margin note. The one authored moment of the header: the title rises line by line out of a mask, once, and
 * the note's rule draws in. Everything is readable without it (the text is real, and nothing is hidden until the effect runs).
 */
export function RailsHeader({ t }: { t: Copy }) {
  const c = narrative(t.locale).rails;
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => acquireSmoothScroll(), []);
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const title = el.querySelector<HTMLElement>("[data-title]")!;
    const parts = Array.from(el.querySelectorAll<HTMLElement>("[data-part]"));
    const rule = el.querySelector<HTMLElement>("[data-rule]")!;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let split: SplitText | undefined;
      let played = false;
      const entrance = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      gsap.set(parts, { opacity: 0, y: 14 });
      gsap.set(rule, { scaleX: 0, transformOrigin: "0 50%" });
      split = SplitText.create(title, {
        type: "lines", mask: "lines", autoSplit: true, linesClass: "rails-line",
        onSplit: (self) => {
          // Runs again if the lines re-flow (resize, fonts): the entrance is rebuilt on the new lines, never doubled.
          entrance.clear();
          entrance.fromTo(self.lines, { yPercent: 108 }, { yPercent: 0, duration: 1.05, stagger: 0.09 }, 0)
            .to(parts, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" }, 0.25)
            .to(rule, { scaleX: 1, duration: 1.1 }, 0.35)
            // The mask only exists to hide the rise; afterwards it must not clip the descenders of the headline.
            .set(self.masks, { overflow: "visible" }, 1.2);
          if (played) entrance.progress(1); // a re-flow after the entrance must not play it again
          return entrance;
        },
      });
      const trigger = ScrollTrigger.create({ trigger: el, start: "top 82%", once: true, onEnter: () => { played = true; entrance.play(); } });
      return () => { trigger.kill(); split?.revert(); entrance.kill(); };
    });
    return () => mm.revert();
  }, []);

  return (
    <header ref={root} className={styles.header}>
      <div>
        <p className={styles.eyebrow} data-part>{c.eyebrow}</p>
        <h2 id="rails-title" className={styles.title} data-title>{c.title}</h2>
        <p className={styles.lead} data-part>{c.lead}</p>
      </div>
      <aside className={styles.note} aria-labelledby="crosschain-title">
        <span className={styles.rule} data-rule aria-hidden="true" />
        <span className={styles.noteTerm} data-part>{c.explainer.term}</span>
        <h3 id="crosschain-title" data-part>{c.explainer.title}</h3>
        <p data-part>{c.explainer.body}</p>
        <p className={styles.noteNote} data-part>{c.explainer.note}</p>
      </aside>
    </header>
  );
}
