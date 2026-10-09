"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Copy } from "@/lib/i18n";
import { narrative } from "@/lib/i18n/narrative";
import { StellarIcon } from "./ChainIcons";
import { PaymentRouteStage } from "./PaymentRouteStage";
import { routeArt, type Route } from "./routeArt";
import s from "./PaymentRoutesHero.module.css";

const Check = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 19 19 5M8 5h11v11" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export function PaymentRoutesHero({ t }: { t: Copy }) {
  const c = narrative(t.locale).rails;
  const isEs = t.locale === "es";
  const direct = c.routes.find((route) => route.id === "direct")!;
  const cross = c.routes.find((route) => route.id === "cctp")!;
  const hero = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Route | null>(null);
  const [hovered, setHovered] = useState<Route | null>(null);
  const focus = hovered ?? selected;

  useEffect(() => {
    const root = hero.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => root.toggleAttribute("data-run", entry.isIntersecting), { rootMargin: "100px" });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const moveLight = (event: PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    event.currentTarget.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  const cards = [
    {
      id: "x402" as Route,
      data: direct,
      image: routeArt.x402,
      title: isEs ? "Si ya tienes USDC en Stellar" : "When you already hold USDC on Stellar",
      perks: isEs ? ["Una sola red", "Una ruta por orden", "Prueba aislada con XLM"] : ["One network", "One route per order", "Isolated test with XLM"],
    },
    {
      id: "cctp" as Route,
      data: cross,
      image: routeArt.cctp,
      title: isEs ? "Si tienes USDC en otra red" : "When you hold USDC on another network",
      perks: isEs ? ["Fuji → Stellar verificado", "USDC nativo", "Sin gas para el comprador"] : ["Fuji → Stellar verified", "Native USDC", "No gas for the buyer"],
    },
  ];

  const steps = isEs
    ? [
        ["01", "Pagas en USDC", "Desde una red admitida"],
        ["02", "TilcAI elige", "Una ruta por orden"],
        ["03", "Se confirma", "Con evidencia de red"],
        ["04", "El negocio cobra", "USDC en Stellar"],
      ]
    : [
        ["01", "Pay in USDC", "From a supported network"],
        ["02", "TilcAI routes", "One route per order"],
        ["03", "It is confirmed", "With network evidence"],
        ["04", "Business is paid", "USDC on Stellar"],
      ];

  return (
    <div ref={hero} className={s.hero} data-hero>
      <div className={s.main}>
        <header className={s.head}>
          <p className={s.eyebrow}><span className={s.eyebrowDot} />{isEs ? "RUTAS DE PAGO" : "PAYMENT ROUTES"}</p>
          <h2 id="rails-title" className={s.title}>
            {isEs ? <>El negocio cobra en<br />USDC sobre <span className={s.accent}>Stellar.</span></> : <>The business is paid in<br />USDC on <span className={s.accent}>Stellar.</span></>}
          </h2>
          <p className={s.lead}>{c.lead}</p>
          <ul className={s.flags} aria-label={isEs ? "Características del recorrido" : "Journey details"}>
            <li className={s.flag} data-tone="auto"><span aria-hidden="true">✦</span>{isEs ? "Una ruta por orden" : "One route per order"}</li>
            <li className={s.flag} data-tone="verified"><span aria-hidden="true">◈</span>{isEs ? "CCTP verificado en testnet" : "CCTP verified on testnet"}</li>
            <li className={s.flag} data-tone="clean"><span aria-hidden="true">↗</span>{isEs ? "Mismo destino" : "Same destination"}</li>
          </ul>
        </header>

        <PaymentRouteStage t={t} focus={focus} selected={selected} onHover={setHovered} onSelect={setSelected} />

        <ol className={s.timeline} aria-label={isEs ? "Recorrido ilustrativo del pago" : "Illustrative payment journey"}>
          {steps.map(([number, title, description], index) => (
            <li key={number} className={s.step} data-i={index}>
              <span className={s.medal} aria-hidden="true">{index === 0 ? <Check /> : index === 3 ? <StellarIcon /> : index === 1 ? "⌁" : "▤"}</span>
              <span className={s.num}>{number}</span>
              <strong className={s.stepTitle}>{title}</strong>
              <span className={s.stepSub}>{description}</span>
              {index < steps.length - 1 && <svg className={s.flowChevs} viewBox="0 0 26 14" aria-hidden="true"><path d="m1 3 5 4-5 4" /><path d="m9 3 5 4-5 4" /><path d="m17 3 5 4-5 4" /></svg>}
            </li>
          ))}
        </ol>
      </div>

      <ul className={s.cards} aria-label={isEs ? "Dos rutas propuestas" : "Two proposed routes"}>
        {cards.map((card) => (
          <li key={card.id} className={s.card} data-route={card.id} data-on={focus === card.id} onPointerMove={moveLight} onPointerEnter={() => setHovered(card.id)} onPointerLeave={() => setHovered(null)} onFocus={() => setHovered(card.id)} onBlur={() => setHovered(null)}>
            <div className={s.cardArt} aria-hidden="true"><Image src={card.image} alt="" fill sizes="(max-width: 560px) 116px, 168px" quality={85} /></div>
            <div className={s.cardTop}>
              <div className={s.tags}><span className={s.tag}>{card.data.tag}</span><span className={s.tagSoft}>{card.data.title}</span></div>
              <button type="button" className={s.open} aria-label={`${isEs ? "Destacar" : "Highlight"} ${card.data.title}`} aria-pressed={selected === card.id} onClick={() => setSelected(selected === card.id ? null : card.id)}><Arrow /></button>
            </div>
            <h3 className={s.cardTitle}>{card.title}</h3>
            <ul className={s.perks}>{card.perks.map((perk, index) => <li key={perk} style={{ "--i": index } as CSSProperties}><Check />{perk}</li>)}</ul>
            <p className={s.cardNote}>{card.data.note}</p>
            <p className={s.status}><i aria-hidden="true" />{card.data.status}</p>
          </li>
        ))}
      </ul>

      <div className={s.banner} data-run>
        <div className={s.bannerArt} aria-hidden="true"><Image src={routeArt.verified} alt="" fill sizes="64px" quality={85} /></div>
        <p className={s.bannerText}>{isEs ? <><strong>Mismo destino previsto:</strong> el negocio recibe USDC en Stellar.</> : <><strong>Same intended destination:</strong> the business receives USDC on Stellar.</>}</p>
        <StellarIcon className={s.bannerStellar} />
      </div>
    </div>
  );
}
