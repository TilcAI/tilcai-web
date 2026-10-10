"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { evidenceDate, evidencePayments, shortHash, snowtraceTx, stellarExpertTx } from "@/lib/content/rails";
import { acquireSmoothScroll } from "@/lib/smooth-scroll";
import { Icon } from "../../Icon";
import styles from "./rails.module.css";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** The hash, one character per span so it can be revealed left to right. The link's own name carries the full value. */
const Hash = ({ value }: { value: string }) => <code aria-hidden="true">{Array.from(shortHash(value)).map((ch, i) => <i key={i} data-ch>{ch}</i>)}</code>;

/**
 * The two test payments as rows of a statement: who paid how, then the burn on Fuji and the mint on Stellar, joined by a line
 * that grows from the burn to the mint. Each row arrives once; the hashes resolve left to right. Plain links to the explorers.
 */
export function EvidenceLedger({ t }: { t: Copy }) {
  const e = narrative(t.locale).evidence;
  const root = useRef<HTMLDivElement>(null);
  const date = new Date(`${evidenceDate}T00:00:00Z`).toLocaleDateString(t.htmlLang, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

  useEffect(() => acquireSmoothScroll(), []);
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const entries = Array.from(el.querySelectorAll<HTMLElement>("[data-entry]"));
      const trailing = Array.from(el.querySelectorAll<HTMLElement>("[data-after]"));
      const stacked = window.matchMedia("(max-width: 700px)").matches;
      gsap.set(entries.map((entry) => entry.querySelector("[data-who]")), { opacity: 0, y: 14 });
      gsap.set(entries.flatMap((entry) => Array.from(entry.querySelectorAll("[data-hash]"))), { opacity: 0, y: 10 });
      gsap.set(entries.flatMap((entry) => Array.from(entry.querySelectorAll("[data-ch]"))), { opacity: 0 });
      gsap.set(entries.map((entry) => entry.querySelector("[data-span]")), stacked ? { scaleY: 0, opacity: 0 } : { scaleX: 0, opacity: 0 });
      gsap.set(trailing, { opacity: 0, y: 10 });
      const triggers = entries.map((entry, index) => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        const [burn, mint] = Array.from(entry.querySelectorAll<HTMLElement>("[data-hash]"));
        tl.to(entry.querySelector("[data-who]"), { opacity: 1, y: 0, duration: 0.7 }, 0)
          .to(burn, { opacity: 1, y: 0, duration: 0.6 }, 0.1)
          .to(burn.querySelectorAll("[data-ch]"), { opacity: 1, duration: 0.01, stagger: 0.022, ease: "none" }, 0.2)
          .to(entry.querySelector("[data-span]"), stacked ? { scaleY: 1, opacity: 1, duration: 0.5, ease: "power2.inOut" } : { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.inOut" }, 0.55)
          .to(mint, { opacity: 1, y: 0, duration: 0.6 }, 1.0)
          .to(mint.querySelectorAll("[data-ch]"), { opacity: 1, duration: 0.01, stagger: 0.022, ease: "none" }, 1.1);
        if (index === entries.length - 1) tl.to(trailing, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 1.3);
        return ScrollTrigger.create({ trigger: entry, start: "top 86%", once: true, onEnter: () => tl.play() });
      });
      return () => triggers.forEach((trigger) => trigger.kill());
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={root} id="evidence" className={styles.ledger} role="group" aria-labelledby="evidence-title">
      <header className={styles.ledgerHead}>
        <div>
          <p className={styles.eyebrow}>{e.eyebrow}</p>
          <h3 id="evidence-title" className={styles.ledgerTitle}>{e.title}</h3>
        </div>
        <p className={styles.ledgerLead}>{e.lead}</p>
      </header>
      <ol className={styles.entries}>
        {evidencePayments.map((payment) => {
          const row = e.rows.find((r) => r.id === payment.id)!;
          return (
            <li key={payment.id} className={styles.entry} data-entry>
              <div className={styles.who} data-who><h4>{row.label}</h4><p>{row.detail}</p></div>
              <div className={styles.tx}>
                <a className={styles.hash} data-hash href={snowtraceTx(payment.burnTxHash)} target="_blank" rel="noopener noreferrer" aria-label={`${e.burn} · Snowtrace · ${payment.burnTxHash} — ${e.open}`}>
                  <span><small>{e.burn} · Snowtrace</small><Hash value={payment.burnTxHash} /></span><Icon name="arrow" />
                </a>
                <span className={styles.span} data-span aria-hidden="true" />
                <a className={styles.hash} data-hash href={stellarExpertTx(payment.mintTxHash)} target="_blank" rel="noopener noreferrer" aria-label={`${e.mint} · Stellar Expert · ${payment.mintTxHash} — ${e.open}`}>
                  <span><small>{e.mint} · Stellar Expert</small><Hash value={payment.mintTxHash} /></span><Icon name="arrow" />
                </a>
              </div>
            </li>
          );
        })}
      </ol>
      <p className={styles.meta} data-after><span>{e.dateLabel} {date}</span><span>{e.amount}</span></p>
    </div>
  );
}
