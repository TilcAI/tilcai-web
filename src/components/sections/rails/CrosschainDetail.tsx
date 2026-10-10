"use client";

import Image from "next/image";
import { useState } from "react";
import type { Copy } from "@/lib/i18n";
import { destinationNetwork, originNetworks } from "@/lib/content/rails";
import { NetworkIcon, StellarIcon } from "./ChainIcons";
import { EvidenceLedger } from "./EvidenceLedger";
import s from "./CctpDetail.module.css";

const art = "/assets/img/rutas";

const steps = [
  { image: `${art}/ruta-p2-img1.png`, es: ["Burn en origen", "Se retira el USDC en la red de origen."], en: ["Burn on origin", "USDC is retired on the source network."] },
  { image: `${art}/ruta-p2-img2.png`, es: ["Circle confirma", "Se confirma que se retiró."], en: ["Circle confirms", "The burn is attested."], tag: "ATTESTATION" },
  { image: `${art}/ruta-p2-img3.png`, es: ["Mint en Stellar", "Se emite el mismo USDC en Stellar."], en: ["Mint on Stellar", "The same USDC is issued on Stellar."] },
] as const;

function BenefitIcon({ kind }: { kind: "shield" | "clock" | "wallet" }) {
  const path = kind === "shield"
    ? <path d="M12 2.5 20 6v5.7c0 4.9-3.1 8.4-8 10.3-4.9-1.9-8-5.4-8-10.3V6l8-3.5Z" />
    : kind === "clock"
      ? <><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" /></>
      : <><rect x="3" y="5" width="18" height="15" rx="3" /><path d="M3 9h18M15 15h3" /></>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg>;
}

export function CrosschainDetail({ t }: { t: Copy }) {
  const isEs = t.locale === "es";
  const [selectedNetwork, setSelectedNetwork] = useState("avalanche-fuji");
  const [showLedger, setShowLedger] = useState(false);
  const network = originNetworks.find((item) => item.id === selectedNetwork) ?? originNetworks[0];
  const verified = network.status === "verified";

  return (
    <section className={s.detail} id="cctp-detail" aria-labelledby="cctp-detail-title" data-detail data-verified={verified}>
      <header className={s.header}>
        <div className={s.intro}>
          <p className={s.eyebrow}><span className={s.eyebrowDot} />{isEs ? "DETALLE DE RUTA" : "ROUTE DETAIL"}</p>
          <h3 id="cctp-detail-title" className={s.title}>USDC <span>{isEs ? "de otra red" : "from another network"}</span></h3>
          <p className={s.subtitle}>{isEs ? "Tú pagas en tu red. TilcAI se encarga del resto." : "Pay on your network. TilcAI handles the rest."}</p>
        </div>
        <div className={s.badges} aria-label={isEs ? "Estado de la ruta" : "Route status"}>
          <span className={`${s.badge} ${s.cyan}`}>CCTP · Crosschain</span>
          <span className={`${s.badge} ${verified ? s.green : s.amber}`}>{verified ? (isEs ? "Fuji verificado en testnet" : "Fuji verified on testnet") : (isEs ? "Red en laboratorio" : "Network in lab")}</span>
          <span className={`${s.badge} ${s.purple}`}><span aria-hidden="true">ϟ</span>{verified ? (isEs ? "Sin gas para el comprador" : "No gas for the buyer") : (isEs ? "Modo sin gas pendiente" : "Gasless mode pending")}</span>
        </div>
      </header>

      <div className={s.grid}>
        <div className={`${s.panel} ${s.origin}`}>
          <div className={s.panelHead}>
            <h4><span>1.</span> {isEs ? "RED DE ORIGEN" : "SOURCE NETWORK"}</h4>
            <p>{isEs ? "Selecciona la red donde tienes USDC." : "Choose the network holding your USDC."}</p>
          </div>
          <div className={s.networks} role="radiogroup" aria-label={isEs ? "Redes de origen" : "Source networks"}>
            {originNetworks.map((item) => (
              <label key={item.id} className={s.network} data-selected={selectedNetwork === item.id}>
                <input type="radio" name="cctp-origin" value={item.id} checked={selectedNetwork === item.id} onChange={() => setSelectedNetwork(item.id)} />
                <NetworkIcon id={item.id} className={s.networkIcon} />
                <span className={s.networkName}>{item.name}</span>
                <span className={`${s.networkStatus} ${item.status === "verified" ? s.networkVerified : s.networkLab}`}>{item.status === "verified" ? (isEs ? "Verificado" : "Verified") : (isEs ? "Laboratorio" : "Lab")}</span>
                <span className={s.radio} aria-hidden="true" />
              </label>
            ))}
          </div>
          <p className={s.originNote} role="status">
            {verified
              ? (isEs ? "Fuji → Stellar: pago técnico verificado en testnet." : "Fuji → Stellar: technical payment verified on testnet.")
              : (isEs ? `${network.name} sigue en laboratorio; el flujo mostrado es ilustrativo.` : `${network.name} is still in the lab; the flow shown is illustrative.`)}
          </p>
        </div>

        <div className={`${s.panel} ${s.pipeline}`}>
          <div className={s.panelHead}>
            <h4><span>2.</span> {isEs ? "CÓMO FUNCIONA" : "HOW IT WORKS"}</h4>
            <p>{isEs ? "CCTP mueve tu USDC a Stellar en 3 pasos." : "CCTP moves your USDC to Stellar in 3 steps."}</p>
          </div>
          <div className={s.pipelineScene} aria-label={isEs ? "Burn, atestación de Circle y mint en Stellar" : "Burn, Circle attestation and mint on Stellar"}>
            <div className={`${s.connectorArt} ${s.connectorBurn}`} aria-hidden="true"><Image src={`${art}/ruta-p2-img7.png`} alt="" fill sizes="(max-width: 800px) 100vw, 380px" /></div>
            <div className={`${s.connectorArt} ${s.connectorMint}`} aria-hidden="true"><Image src={`${art}/ruta-p2-img8.png`} alt="" fill sizes="(max-width: 800px) 100vw, 380px" /></div>
            <ol className={s.steps}>
              {steps.map((step, index) => (
                <li key={step.image} className={s.step} data-step={index}>
                  <div className={s.stepArt}><Image src={step.image} alt="" fill sizes="(max-width: 560px) 130px, (max-width: 1100px) 180px, 220px" /></div>
                  <div className={s.stepCopy}>
                    <span className={s.stepNumber}>0{index + 1}</span>
                    {"tag" in step && <span className={s.attestation}>{step.tag}</span>}
                    <h5>{isEs ? step.es[0] : step.en[0]}</h5>
                    <p>{isEs ? step.es[1] : step.en[1]}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className={`${s.panel} ${s.destination}`}>
          <div className={s.panelHead}>
            <h4><span>3.</span> {isEs ? "DESTINO" : "DESTINATION"}</h4>
            <p>{isEs ? "Destino final de esta ruta." : "Final destination for this route."}</p>
          </div>
          <div className={s.destinationCard}>
            <span className={s.destinationBadge}><span aria-hidden="true">✓</span>{isEs ? "Destino definido" : "Defined destination"}</span>
            <div className={s.destinationArt}><Image src={`${art}/ruta-p2-img4.png`} alt="" fill sizes="(max-width: 1100px) 250px, 290px" /></div>
            <h5><StellarIcon className={s.destinationLogo} />{destinationNetwork.name}</h5>
            <p>{isEs ? "USDC del negocio" : "Business USDC"}</p>
          </div>
          <dl className={s.destinationFacts}>
            <div><dt>{isEs ? "Misma moneda" : "Same currency"}</dt><dd>USDC</dd></div>
            <div><dt>{isEs ? "Misma cantidad" : "Same amount"}</dt><dd>1:1</dd></div>
            <div><dt>{isEs ? "Destino" : "Destination"}</dt><dd><StellarIcon /> Stellar</dd></div>
          </dl>
        </div>
      </div>

      <div className={s.feeStrip}>
        <div className={s.feeMain}>
          <span className={s.feeBolt} aria-hidden="true">ϟ</span>
          <div><strong>{verified ? (isEs ? "TilcAI paga las comisiones." : "TilcAI covers the fees.") : (isEs ? "El modo sin gas se valida por red." : "Gasless mode is verified per network.")}</strong><p>{verified ? (isEs ? "Tú solo envías el USDC desde tu wallet." : "You only send USDC from your wallet.") : (isEs ? "Esta red aún no tiene un pago verificado en TilcAI." : "This network has no verified TilcAI payment yet.")}</p></div>
        </div>
        <div className={s.benefit}><BenefitIcon kind="shield" /><span><strong>{verified ? (isEs ? "Sin gas para el comprador" : "No gas for the buyer") : (isEs ? "Pendiente de validar" : "Pending verification")}</strong><small>{verified ? (isEs ? "TilcAI asume las comisiones." : "TilcAI covers network fees.") : (isEs ? "Solo Fuji tiene esa prueba." : "Only Fuji has that test.")}</small></span></div>
        <div className={s.benefit}><BenefitIcon kind="clock" /><span><strong>{verified ? (isEs ? "Con evidencia" : "With evidence") : (isEs ? "Evidencia pendiente" : "Evidence pending")}</strong><small>{isEs ? "Burn, atestación y mint." : "Burn, attestation and mint."}</small></span></div>
        <div className={s.benefit}><BenefitIcon kind="wallet" /><span><strong>{isEs ? "Mismas condiciones" : "Same terms"}</strong><small>{isEs ? "Mismo importe, misma moneda." : "Same amount, same currency."}</small></span></div>
      </div>

      <div className={s.labCard}>
        <div className={s.labArt} aria-hidden="true"><Image src={`${art}/ruta-p2-img5.png`} alt="" fill sizes="86px" /></div>
        <div className={s.labCopy}><h4>{isEs ? "Redes del laboratorio de CCTP" : "CCTP lab networks"}</h4><p>{isEs ? "Solo Avalanche Fuji está verificada de punta a punta en TilcAI. Las otras redes se habilitan tras probar cada ruta." : "Only Avalanche Fuji is verified end to end in TilcAI. Other networks require their own route test."}</p></div>
        <button type="button" className={s.labButton} onClick={() => setShowLedger((value) => !value)} aria-expanded={showLedger}>
          {showLedger ? (isEs ? "Ocultar pagos de prueba" : "Hide test payments") : (isEs ? "Ver pagos de prueba" : "View test payments")} <span aria-hidden="true">↗</span>
        </button>
      </div>
      {showLedger && <div className={s.ledger}><EvidenceLedger t={t} /></div>}
    </section>
  );
}
