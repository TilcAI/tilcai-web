"use client";

import React, { useState } from "react";
import type { Copy } from "@/lib/i18n";
import { originNetworks, destinationNetwork } from "@/lib/content/rails";
import {
  NetworkIcon,
  FlameIcon,
  CircleCctpIcon,
  StellarIcon,
} from "./ChainIcons";
import { EvidenceLedger } from "./EvidenceLedger";
import styles from "./PaymentRoutes.module.css";

interface CrosschainDetailProps {
  t: Copy;
}

export function CrosschainDetail({ t }: { t: Copy }) {
  const isEs = t.locale === "es";
  const [selectedNetwork, setSelectedNetwork] = useState<string>("avalanche-fuji");
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showLedger, setShowLedger] = useState<boolean>(false);

  const handleSelectNetwork = (id: string) => {
    setSelectedNetwork(id);
    // Trigger step progression animation simulation
    setActiveStep(0);
    setTimeout(() => setActiveStep(1), 600);
    setTimeout(() => setActiveStep(2), 1400);
  };

  return (
    <section className={styles.detailSection} id="cctp-detail" aria-labelledby="cctp-detail-title">
      <header className={styles.detailHeader}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          {isEs ? "DETALLE DE RUTA" : "ROUTE DETAIL"}
        </div>

        <div className={styles.detailTitleRow}>
          <h3 id="cctp-detail-title" className={styles.detailTitle}>
            {isEs ? "USDC de otra red" : "USDC from another network"}
          </h3>

          <div className={styles.detailBadges}>
            <span className={`${styles.badgeDetail} ${styles.badgeDetailCyan}`}>
              CCTP · Crosschain
            </span>
            <span className={`${styles.badgeDetail} ${styles.badgeDetailGreen}`}>
              {isEs ? "Verificado en testnet" : "Verified on testnet"}
            </span>
            <span className={`${styles.badgeDetail} ${styles.badgeDetailPurple}`}>
              ⚡ {isEs ? "Sin gas para el comprador" : "Zero gas for buyer"}
            </span>
          </div>
        </div>

        <p className={styles.subtitle}>
          {isEs
            ? "Así funciona la ruta CCTP. Tú pagas en tu red, TilcAI se encarga del resto."
            : "How the CCTP route works. You pay on your network, TilcAI handles the rest."}
        </p>
      </header>

      {/* 3-Column Glass Panel Layout */}
      <div className={styles.detailGrid}>
        {/* Column 1: Source Networks */}
        <div className={styles.originsCol}>
          <div className={styles.colHeader}>
            <h4 className={styles.colLabel}>
              {isEs ? "1. RED DE ORIGEN" : "1. SOURCE NETWORK"}
            </h4>
            <p className={styles.colSub}>
              {isEs ? "Selecciona la red donde tienes USDC." : "Select where you hold USDC."}
            </p>
          </div>

          <div className={styles.networkList} role="radiogroup" aria-label={isEs ? "Redes de origen" : "Source networks"}>
            {originNetworks.map((net) => {
              const isSelected = selectedNetwork === net.id;
              const isVerified = net.status === "verified";
              return (
                <div
                  key={net.id}
                  className={styles.networkItem}
                  data-active={isSelected}
                  onClick={() => handleSelectNetwork(net.id)}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectNetwork(net.id);
                    }
                  }}
                >
                  <div className={styles.networkLeft}>
                    <NetworkIcon id={net.id} />
                    <span className={styles.networkName}>{net.name}</span>
                  </div>
                  <div className={styles.networkRight}>
                    <span
                      className={`${styles.networkTag} ${
                        isVerified ? styles.tagVerified : styles.tagLab
                      }`}
                    >
                      {isVerified
                        ? isEs ? "Verificado" : "Verified"
                        : isEs ? "Laboratorio" : "Lab"}
                    </span>
                    <span className={styles.radioDot} aria-hidden="true" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: CCTP 3-Step Pipeline */}
        <div className={styles.pipelineCol}>
          <div className={styles.colHeader}>
            <h4 className={styles.colLabel}>
              {isEs ? "2. CÓMO FUNCIONA" : "2. HOW IT WORKS"}
            </h4>
            <p className={styles.colSub}>
              {isEs
                ? "CCTP mueve tu USDC a Stellar en 3 pasos."
                : "CCTP moves your USDC to Stellar in 3 steps."}
            </p>
          </div>

          <div className={styles.pipelineWrap}>
            <svg className={styles.pipelineSvgLine} viewBox="0 0 400 4" fill="none" preserveAspectRatio="none">
              <line x1="0" y1="2" x2="400" y2="2" stroke="url(#pipeGrad)" strokeWidth="2.5" strokeDasharray="5 5" />
              <defs>
                <linearGradient id="pipeGrad" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF4D4D" />
                  <stop offset="0.5" stopColor="#37D2FF" />
                  <stop offset="1" stopColor="#9B72FF" />
                </linearGradient>
              </defs>
            </svg>

            {/* Step 01: Burn */}
            <div className={styles.pipelineNode} data-active={activeStep >= 0}>
              <div className={styles.pipelineCircle}>
                <FlameIcon className="w-7 h-7" />
              </div>
              <div className={styles.pipelineStepNum}>01</div>
              <h5 className={styles.pipelineStepTitle}>
                {isEs ? "Burn en origen" : "Burn on origin"}
              </h5>
              <p className={styles.pipelineStepDesc}>
                {isEs ? "Se retira el USDC en la red de origen." : "USDC is retired on source network."}
              </p>
            </div>

            {/* Step 02: Circle confirms / Attestation */}
            <div className={styles.pipelineNode} data-active={activeStep >= 1}>
              <span className={styles.attestationTag}>ATTESTATION</span>
              <div className={styles.pipelineCircle}>
                <CircleCctpIcon className="w-7 h-7" />
              </div>
              <div className={styles.pipelineStepNum}>02</div>
              <h5 className={styles.pipelineStepTitle}>
                {isEs ? "Circle confirma" : "Circle confirms"}
              </h5>
              <p className={styles.pipelineStepDesc}>
                {isEs ? "Se confirma que se retiró." : "Attestation verifies the burn."}
              </p>
            </div>

            {/* Step 03: Mint in Stellar */}
            <div className={styles.pipelineNode} data-active={activeStep >= 2}>
              <div className={styles.pipelineCircle}>
                <StellarIcon className="w-7 h-7" />
              </div>
              <div className={styles.pipelineStepNum}>03</div>
              <h5 className={styles.pipelineStepTitle}>
                {isEs ? "Mint en Stellar" : "Mint on Stellar"}
              </h5>
              <p className={styles.pipelineStepDesc}>
                {isEs ? "Se emite el mismo USDC en Stellar." : "Native USDC is issued on Stellar."}
              </p>
            </div>
          </div>

          <div className={styles.feeBanner}>
            <span>⚡</span>
            <span>
              <strong>{isEs ? "TilcAI paga las comisiones." : "TilcAI covers transaction fees."}</strong>{" "}
              {isEs ? "Tú solo envías el USDC." : "You only send USDC."}
            </span>
          </div>
        </div>

        {/* Column 3: Destination */}
        <div className={styles.destinationCol}>
          <div className={styles.colHeader}>
            <h4 className={styles.colLabel}>
              {isEs ? "3. DESTINO" : "3. DESTINATION"}
            </h4>
            <p className={styles.colSub}>
              {isEs ? "Destino final verificado." : "Verified final destination."}
            </p>
          </div>

          <div className={styles.destinationCard}>
            <div className={styles.stellarDestIconBox}>
              <StellarIcon className="w-10 h-10" />
            </div>
            <h5 className={styles.destTitle}>{destinationNetwork.name}</h5>
            <p className={styles.destSub}>
              {isEs ? "USDC del negocio" : "Business USDC"}
            </p>
          </div>
        </div>
      </div>

      {/* Lab Networks Footer Card */}
      <div className={styles.labFooterCard}>
        <div className={styles.labFooterLeft}>
          <h4>
            {isEs ? "Redes del laboratorio de CCTP" : "CCTP Lab Networks"}
          </h4>
          <p>
            {isEs
              ? "Ocho redes de testnet. Solo Fuji está verificada de punta a punta en TilcAI."
              : "Eight testnets. Only Fuji is verified end to end in TilcAI."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowLedger((prev) => !prev)}
          className={styles.labFooterBtn}
          aria-expanded={showLedger}
        >
          {showLedger
            ? isEs ? "Ocultar transacciones ↗" : "Hide transactions ↗"
            : isEs ? "Ver todas las redes ↗" : "View all networks ↗"}
        </button>
      </div>

      {/* Verifiable Transactions Ledger Drawer */}
      {showLedger && (
        <div style={{ marginTop: "32px" }}>
          <EvidenceLedger t={t} />
        </div>
      )}
    </section>
  );
}
