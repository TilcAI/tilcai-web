"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import type { Copy } from "@/lib/i18n";
import {
  UsdcIcon,
  StellarIcon,
  AvalancheIcon,
  EthereumIcon,
  ArbitrumIcon,
  BaseIcon,
  SolanaIcon,
} from "./ChainIcons";
import styles from "./PaymentRoutes.module.css";

interface PaymentRoutesSceneProps {
  t: Copy;
  focusedRoute: "x402" | "cctp" | null;
  onSelectRoute?: (route: "x402" | "cctp") => void;
}

export function PaymentRoutesScene({
  t,
  focusedRoute,
  onSelectRoute,
}: PaymentRoutesSceneProps) {
  const isEs = t.locale === "es";
  const sceneRef = useRef<HTMLDivElement>(null);
  const buyerRef = useRef<HTMLDivElement>(null);
  const tilcaiRef = useRef<HTMLDivElement>(null);
  const businessRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Animated token refs
  const tokenX402Ref = useRef<SVGCircleElement>(null);
  const tokenCCTPRef = useRef<SVGCircleElement>(null);

  const [svgDimensions, setSvgDimensions] = useState({ width: 700, height: 360 });
  const [pathsD, setPathsD] = useState({
    inlet: "M 180 180 L 250 180",
    x402: "M 440 160 C 490 90, 540 90, 600 160",
    cctp: "M 440 200 C 490 270, 540 270, 600 200",
  });

  const [floatingPos, setFloatingPos] = useState({
    coinX: 200,
    coinY: 180,
    x402X: 520,
    x402Y: 100,
    cctpX: 520,
    cctpY: 260,
  });

  // Calculate real geometry from nodes
  useEffect(() => {
    gsap.registerPlugin(MotionPathPlugin);

    const updateGeometry = () => {
      if (!sceneRef.current || !buyerRef.current || !tilcaiRef.current || !businessRef.current) return;

      const sceneRect = sceneRef.current.getBoundingClientRect();
      const buyerRect = buyerRef.current.getBoundingClientRect();
      const tilcaiRect = tilcaiRef.current.getBoundingClientRect();
      const bizRect = businessRef.current.getBoundingClientRect();

      const w = sceneRect.width;
      const h = sceneRect.height;
      setSvgDimensions({ width: w, height: h });

      // Coordinates relative to scene container
      const buyerRight = {
        x: buyerRect.right - sceneRect.left,
        y: buyerRect.top - sceneRect.top + buyerRect.height / 2,
      };

      const tilcaiLeft = {
        x: tilcaiRect.left - sceneRect.left,
        y: tilcaiRect.top - sceneRect.top + tilcaiRect.height / 2,
      };

      const tilcaiRight = {
        x: tilcaiRect.right - sceneRect.left,
        y: tilcaiRect.top - sceneRect.top + tilcaiRect.height / 2,
      };

      const bizLeft = {
        x: bizRect.left - sceneRect.left,
        y: bizRect.top - sceneRect.top + bizRect.height / 2,
      };

      // Bezier curve calculations
      const inletD = `M ${buyerRight.x} ${buyerRight.y} L ${tilcaiLeft.x} ${tilcaiLeft.y}`;

      const dx = bizLeft.x - tilcaiRight.x;
      const cp1X = tilcaiRight.x + dx * 0.35;
      const cp2X = tilcaiRight.x + dx * 0.65;

      const curveArch = Math.min(80, Math.max(45, h * 0.24));

      const x402D = `M ${tilcaiRight.x} ${tilcaiRight.y - 12} C ${cp1X} ${tilcaiRight.y - curveArch}, ${cp2X} ${bizLeft.y - curveArch}, ${bizLeft.x} ${bizLeft.y - 12}`;
      const cctpD = `M ${tilcaiRight.x} ${tilcaiRight.y + 12} C ${cp1X} ${tilcaiRight.y + curveArch}, ${cp2X} ${bizLeft.y + curveArch}, ${bizLeft.x} ${bizLeft.y + 12}`;

      setPathsD({
        inlet: inletD,
        x402: x402D,
        cctp: cctpD,
      });

      setFloatingPos({
        coinX: (buyerRight.x + tilcaiLeft.x) / 2,
        coinY: (buyerRight.y + tilcaiLeft.y) / 2,
        x402X: (tilcaiRight.x + bizLeft.x) / 2,
        x402Y: tilcaiRight.y - curveArch * 0.75 - 16,
        cctpX: (tilcaiRight.x + bizLeft.x) / 2,
        cctpY: tilcaiRight.y + curveArch * 0.75 + 16,
      });
    };

    updateGeometry();
    window.addEventListener("resize", updateGeometry);

    const ro = new ResizeObserver(updateGeometry);
    if (sceneRef.current) ro.observe(sceneRef.current);

    return () => {
      window.removeEventListener("resize", updateGeometry);
      ro.disconnect();
    };
  }, []);

  // GSAP Path Animations & Particles
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (tokenX402Ref.current && tokenCCTPRef.current) {
        gsap.to(tokenX402Ref.current, {
          motionPath: {
            path: "#route-x402-main",
            align: "#route-x402-main",
            alignOrigin: [0.5, 0.5],
            autoRotate: false,
          },
          duration: focusedRoute === "x402" ? 2.2 : 3.2,
          repeat: -1,
          ease: "power1.inOut",
        });

        gsap.to(tokenCCTPRef.current, {
          motionPath: {
            path: "#route-cctp-main",
            align: "#route-cctp-main",
            alignOrigin: [0.5, 0.5],
            autoRotate: false,
          },
          duration: focusedRoute === "cctp" ? 2.2 : 3.4,
          repeat: -1,
          ease: "power1.inOut",
        });
      }
    }, sceneRef);

    return () => ctx.revert();
  }, [pathsD, focusedRoute]);

  // Subtle Mouse Parallax on Desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    const { currentTarget, clientX, clientY } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;

    if (tilcaiRef.current) {
      gsap.to(tilcaiRef.current, { x: x * 6, y: y * 4, duration: 0.5, ease: "power1.out" });
    }
    if (buyerRef.current) {
      gsap.to(buyerRef.current, { x: x * 4, y: y * 3, duration: 0.5, ease: "power1.out" });
    }
    if (businessRef.current) {
      gsap.to(businessRef.current, { x: x * 5, y: y * 4, duration: 0.5, ease: "power1.out" });
    }
  };

  const handleMouseLeave = () => {
    if (tilcaiRef.current) gsap.to(tilcaiRef.current, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
    if (buyerRef.current) gsap.to(buyerRef.current, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
    if (businessRef.current) gsap.to(businessRef.current, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
  };

  // Route opacity calculations based on active focus
  const x402Opacity = focusedRoute === "x402" ? 1 : focusedRoute === "cctp" ? 0.12 : 0.65;
  const cctpOpacity = focusedRoute === "cctp" ? 1 : focusedRoute === "x402" ? 0.12 : 0.75;
  const x402StrokeWidth = focusedRoute === "x402" ? 3 : 2;
  const cctpStrokeWidth = focusedRoute === "cctp" ? 3 : 2;

  return (
    <div
      ref={sceneRef}
      className={styles.sceneWrapper}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.sceneGridPattern} />

      {/* SVG Connecting Routes */}
      <svg
        ref={svgRef}
        className={styles.svgOverlay}
        viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
      >
        <defs>
          <linearGradient id="routeInletGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#37D2FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#9B72FF" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="routeX402Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9B72FF" />
            <stop offset="50%" stopColor="#FFA801" />
            <stop offset="100%" stopColor="#FFC043" />
          </linearGradient>

          <linearGradient id="routeCCTPGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9B72FF" />
            <stop offset="50%" stopColor="#37D2FF" />
            <stop offset="100%" stopColor="#00F2FE" />
          </linearGradient>

          <filter id="glowPurple" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glowCyan" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Inlet path: Comprador -> TilcAI */}
        <path
          d={pathsD.inlet}
          stroke="url(#routeInletGrad)"
          strokeWidth="2.5"
          strokeDasharray="4 4"
          fill="none"
          strokeLinecap="round"
        />

        {/* 2. Route x402: TilcAI -> Negocio */}
        <path
          id="route-x402-glow"
          className={styles.routeGlow}
          d={pathsD.x402}
          stroke="url(#routeX402Gradient)"
          strokeWidth={x402StrokeWidth * 3}
          opacity={x402Opacity * 0.4}
          filter="url(#glowPurple)"
        />
        <path
          id="route-x402-main"
          className={styles.routeMain}
          d={pathsD.x402}
          stroke="url(#routeX402Gradient)"
          strokeWidth={x402StrokeWidth}
          opacity={x402Opacity}
        />

        {/* 3. Route CCTP: TilcAI -> Negocio */}
        <path
          id="route-cctp-glow"
          className={styles.routeGlow}
          d={pathsD.cctp}
          stroke="url(#routeCCTPGradient)"
          strokeWidth={cctpStrokeWidth * 3}
          opacity={cctpOpacity * 0.4}
          filter="url(#glowCyan)"
        />
        <path
          id="route-cctp-main"
          className={styles.routeMain}
          d={pathsD.cctp}
          stroke="url(#routeCCTPGradient)"
          strokeWidth={cctpStrokeWidth}
          opacity={cctpOpacity}
        />

        {/* Animated traveling particles along the paths */}
        <circle
          ref={tokenX402Ref}
          r="5"
          fill="#FFFFFF"
          stroke="#FFA801"
          strokeWidth="2"
          className={styles.particleDot}
          opacity={x402Opacity > 0.3 ? 1 : 0.2}
        />

        <circle
          ref={tokenCCTPRef}
          r="5"
          fill="#FFFFFF"
          stroke="#37D2FF"
          strokeWidth="2"
          className={styles.particleDot}
          opacity={cctpOpacity > 0.3 ? 1 : 0.2}
        />
      </svg>

      {/* Interactive Nodes Row */}
      <div className={styles.sceneNodesContainer}>
        {/* Node 1: Comprador */}
        <div ref={buyerRef} className={`${styles.nodeCard} ${styles.buyerNode}`}>
          <div className={styles.avatarRing}>
            <svg className="w-6 h-6 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h4 className={styles.nodeTitle}>{isEs ? "Comprador" : "Buyer"}</h4>
          <p className={styles.nodeSub}>{isEs ? "Paga en USDC" : "Pays in USDC"}</p>

          <div className={styles.networkLogosRow}>
            <EthereumIcon />
            <AvalancheIcon />
            <ArbitrumIcon />
            <BaseIcon />
            <SolanaIcon />
            <span className={styles.networkMoreDots}>…</span>
          </div>
        </div>

        {/* Node 2: TilcAI (Center Protagonist) */}
        <div ref={tilcaiRef} className={`${styles.nodeCard} ${styles.tilcaiNode}`}>
          <div className={styles.tilcaiGlowRing} />

          <div className={styles.tilcaiHud}>
            <span className={styles.hudDot} />
            {isEs ? "Elige la mejor ruta" : "Selects optimal route"}
          </div>

          <div className={styles.tilcaiLogoWrap}>
            <Image
              src="/brand/tilcai-mark-white.png"
              width={26}
              height={26}
              alt="TilcAI"
              className={styles.tilcaiLogoImg}
            />
            <span className={styles.tilcaiBrandText}>TilcAI</span>
          </div>

          <p className={styles.tilcaiSub}>
            {isEs ? "Elige la mejor ruta por orden" : "Picks the best route per order"}
          </p>
        </div>

        {/* Node 3: Negocio */}
        <div ref={businessRef} className={`${styles.nodeCard} ${styles.businessNode}`}>
          <div className={styles.storeRing}>
            <svg className="w-6 h-6 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h4 className={styles.nodeTitle}>{isEs ? "Negocio" : "Business"}</h4>
          <p className={styles.nodeSub}>
            {isEs ? "Recibe USDC en Stellar" : "Receives USDC on Stellar"}
          </p>

          <div className={styles.stellarBadgeInNode}>
            <StellarIcon className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Floating USDC coin on inlet line */}
      {floatingPos.coinX > 0 && (
        <div
          className={styles.floatingCoin}
          style={{ left: `${floatingPos.coinX}px`, top: `${floatingPos.coinY}px` }}
          title="USDC"
        >
          <UsdcIcon className="w-5 h-5 text-cyan-400" />
        </div>
      )}

      {/* Floating route curve badges */}
      {floatingPos.x402X > 0 && (
        <>
          <div
            className={`${styles.floatingRouteBadge} ${styles.floatingBadgeX402}`}
            style={{ left: `${floatingPos.x402X}px`, top: `${floatingPos.x402Y}px` }}
            onClick={() => onSelectRoute?.("x402")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectRoute?.("x402");
              }
            }}
          >
            x402
          </div>
          <div
            className={`${styles.floatingRouteBadge} ${styles.floatingBadgeCCTP}`}
            style={{ left: `${floatingPos.cctpX}px`, top: `${floatingPos.cctpY}px` }}
            onClick={() => onSelectRoute?.("cctp")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectRoute?.("cctp");
              }
            }}
          >
            CCTP
          </div>
        </>
      )}
    </div>
  );
}
