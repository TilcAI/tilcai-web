"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Copy } from "@/lib/i18n";
import { NetworkIcon, StellarIcon } from "./ChainIcons";
import { routeArt, type Route } from "./routeArt";
import s from "./PaymentRoutesHero.module.css";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
type Point = { x: number; y: number };
type Geometry = {
  width: number;
  height: number;
  inlet: string;
  x402: string;
  cctp: string;
  inletMid: Point;
  x402Mid: Point;
  cctpMid: Point;
  inletArrow: string;
  x402Arrow: string;
  cctpArrow: string;
};
const empty: Geometry = {
  width: 1, height: 1, inlet: "M0 0", x402: "M0 0", cctp: "M0 0",
  inletMid: { x: 0, y: 0 }, x402Mid: { x: 0, y: 0 }, cctpMid: { x: 0, y: 0 },
  inletArrow: "", x402Arrow: "", cctpArrow: "",
};

function RouteLine({ name, d, arrow, gradient }: { name: "Inlet" | "X402" | "Cctp"; d: string; arrow: string; gradient: string }) {
  return (
    <g className={s[`route${name}`]} data-route={name.toLowerCase()}>
      <path className={s.glow} d={d} stroke={`url(#${gradient})`} />
      <path className={s.line} d={d} stroke={`url(#${gradient})`} />
      <path className={s.chev} d={arrow} />
    </g>
  );
}

export function PaymentRouteStage({ t, focus, selected, onHover, onSelect }: {
  t: Copy;
  focus: Route | null;
  selected: Route | null;
  onHover: (route: Route | null) => void;
  onSelect: (route: Route) => void;
}) {
  const isEs = t.locale === "es";
  const stage = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geometry>(empty);

  useIsoLayoutEffect(() => {
    const root = stage.current;
    if (!root) return;
    const port = (key: string): Point => {
      const box = root.getBoundingClientRect();
      const rect = root.querySelector<HTMLElement>(`[data-port="${key}"]`)!.getBoundingClientRect();
      return { x: rect.left - box.left, y: rect.top - box.top };
    };
    const measure = () => {
      const box = root.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const vertical = window.matchMedia("(max-width: 1099px)").matches;
      const a = port("buyer-out"), b = port("tilcai-in");
      const x0 = port("tilcai-x402"), x1 = port("biz-x402");
      const c0 = port("tilcai-cctp"), c1 = port("biz-cctp");
      const round = (n: number) => Math.round(n * 10) / 10;
      const p = (a: Point) => `${round(a.x)} ${round(a.y)}`;
      const inlet = vertical
        ? `M${p(a)} C${round(a.x + 26)} ${round((a.y + b.y) / 2)}, ${round(b.x + 26)} ${round((a.y + b.y) / 2)}, ${p(b)}`
        : `M${p(a)} C${round(a.x + 24)} ${round(a.y)}, ${round(b.x - 24)} ${round(b.y)}, ${p(b)}`;
      const bend = Math.min(76, Math.max(38, box.height * 0.18));
      const direct = vertical
        ? `M${p(x0)} C${round(x0.x + bend * 2)} ${round(x0.y + 34)}, ${round(x1.x + bend * 2)} ${round(x1.y - 34)}, ${p(x1)}`
        : `M${p(x0)} C${round(x0.x + 54)} ${round(x0.y - bend)}, ${round(x1.x - 54)} ${round(x1.y - bend)}, ${p(x1)}`;
      const cross = vertical
        ? `M${p(c0)} C${round(c0.x - bend * 2)} ${round(c0.y + 34)}, ${round(c1.x - bend * 2)} ${round(c1.y - 34)}, ${p(c1)}`
        : `M${p(c0)} C${round(c0.x + 54)} ${round(c0.y + bend)}, ${round(c1.x - 54)} ${round(c1.y + bend)}, ${p(c1)}`;
      const mid = (start: Point, end: Point, offsetX: number, offsetY: number): Point => ({ x: (start.x + end.x) / 2 + offsetX, y: (start.y + end.y) / 2 + offsetY });
      const arrow = (end: Point) => vertical
        ? `M${round(end.x - 7)} ${round(end.y - 16)} L${round(end.x)} ${round(end.y - 9)} L${round(end.x + 7)} ${round(end.y - 16)}`
        : `M${round(end.x - 17)} ${round(end.y - 7)} L${round(end.x - 9)} ${round(end.y)} L${round(end.x - 17)} ${round(end.y + 7)}`;
      setGeo({
        width: box.width, height: box.height, inlet, x402: direct, cctp: cross,
        inletMid: mid(a, b, vertical ? 12 : 0, 0),
        x402Mid: mid(x0, x1, vertical ? bend * 1.2 : 0, vertical ? 0 : -bend * 0.75),
        cctpMid: mid(c0, c1, vertical ? -bend * 1.2 : 0, vertical ? 0 : bend * 0.75),
        inletArrow: arrow(b), x402Arrow: arrow(x1), cctpArrow: arrow(c1),
      });
    };
    const resize = new ResizeObserver(measure);
    resize.observe(root);
    measure();
    return () => resize.disconnect();
  }, []);

  useEffect(() => {
    const root = stage.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => { root.toggleAttribute("data-run", entry.isIntersecting); }, { rootMargin: "100px" });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={stage} className={s.stage} data-focus={focus || undefined} aria-label={isEs ? "Comprador, TilcAI y negocio conectados por dos rutas de pago ilustrativas" : "Buyer, TilcAI and business connected by two illustrative payment routes"}>
      <div className={s.floor} aria-hidden="true" />
      <svg className={s.wires} viewBox={`0 0 ${geo.width} ${geo.height}`} aria-hidden="true">
        <defs>
          <linearGradient id="pr-g-in" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#4ab9ff" /><stop offset="1" stopColor="#a17aff" /></linearGradient>
          <linearGradient id="pr-g-x" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#b478ff" /><stop offset="1" stopColor="#ffae32" /></linearGradient>
          <linearGradient id="pr-g-c" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#9c76ff" /><stop offset="1" stopColor="#35dcff" /></linearGradient>
        </defs>
        <RouteLine name="Inlet" d={geo.inlet} arrow={geo.inletArrow} gradient="pr-g-in" />
        <RouteLine name="X402" d={geo.x402} arrow={geo.x402Arrow} gradient="pr-g-x" />
        <RouteLine name="Cctp" d={geo.cctp} arrow={geo.cctpArrow} gradient="pr-g-c" />
      </svg>
      <div className={s.nodes}>
        <div className={`${s.node} ${s.buyer}`}>
          <div className={s.art}><div className={s.float}><Image src={routeArt.buyer} alt="" fill sizes="(max-width: 1099px) 240px, 20vw" quality={85} /></div><i className={s.port} data-port="buyer-out" /></div>
          <div className={s.plate}><strong>{isEs ? "Comprador" : "Buyer"}</strong><span>{isEs ? "Paga en USDC" : "Pays in USDC"}</span></div>
          <div className={s.chains} aria-hidden="true">
            <NetworkIcon id="avalanche-fuji" />
            <NetworkIcon id="ethereum-sepolia" />
            <NetworkIcon id="arbitrum-sepolia" />
            <NetworkIcon id="base-sepolia" />
            <i>···</i>
          </div>
        </div>
        <div className={`${s.node} ${s.tilcai}`}>
          <div className={s.art}><div className={s.float}><Image src={routeArt.tilcai} alt="" fill sizes="(max-width: 1099px) 240px, 20vw" quality={85} /></div>
            <i className={s.port} data-port="tilcai-in" /><i className={s.port} data-port="tilcai-x402" /><i className={s.port} data-port="tilcai-cctp" />
          </div>
          <div className={s.plate}><strong>TilcAI</strong><span>{isEs ? "Elige una ruta por orden" : "Selects one route per order"}</span></div>
          <div className={s.hud}><span>✧ {isEs ? "Analiza la ruta" : "Analyzes the route"}</span><span className={s.eq} aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}</span></div>
        </div>
        <div className={`${s.node} ${s.biz}`}>
          <div className={s.art}><div className={s.float}><Image src={routeArt.business} alt="" fill sizes="(max-width: 1099px) 240px, 20vw" quality={85} /></div>
            <i className={s.port} data-port="biz-x402" /><i className={s.port} data-port="biz-cctp" />
          </div>
          <div className={s.plate}><strong>{isEs ? "Negocio" : "Business"}</strong><span>{isEs ? "Recibe USDC en Stellar" : "Receives USDC on Stellar"}</span><StellarIcon className={s.plateIcon} /></div>
        </div>
      </div>
      <div className={s.pillAt} data-placed={geo.width > 1 ? "" : undefined} style={{ left: geo.x402Mid.x, top: geo.x402Mid.y }}>
        <button type="button" className={s.pill} data-route="x402" aria-pressed={selected === "x402"} onPointerEnter={() => onHover("x402")} onPointerLeave={() => onHover(null)} onFocus={() => onHover("x402")} onBlur={() => onHover(null)} onClick={() => onSelect("x402")}>x402</button>
      </div>
      <div className={s.pillAt} data-placed={geo.width > 1 ? "" : undefined} style={{ left: geo.cctpMid.x, top: geo.cctpMid.y }}>
        <button type="button" className={s.pill} data-route="cctp" aria-pressed={selected === "cctp"} onPointerEnter={() => onHover("cctp")} onPointerLeave={() => onHover(null)} onFocus={() => onHover("cctp")} onBlur={() => onHover(null)} onClick={() => onSelect("cctp")}>CCTP</button>
      </div>
      <div className={s.coin} data-still style={{ left: geo.inletMid.x, top: geo.inletMid.y, translate: "-50% -50%" }} aria-hidden="true"><Image src={routeArt.coin} alt="" fill sizes="66px" quality={85} /></div>
    </div>
  );
}
