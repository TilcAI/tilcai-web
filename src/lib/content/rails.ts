/**
 * Payment rails shown on the landing. Facts only: what is verified, what is lab, nothing aspirational.
 * Source: documentation/2-ARQUITECTURA/TILCAI_FLUJO_INTEGRADO_Y_DEMO (section 5) and 0-OFICIAL/CONTEXTO_OFICIAL.
 *
 * A network is `verified` when the team has tested that route end to end. The CCTP lab (tilcai-cctp-engine) models
 * eight testnets; it does not make seven commercial corridors. Only Avalanche Fuji has evidence rows below (burn and
 * mint hashes). Ethereum, Arbitrum and Base Sepolia were marked verified on 2026-10-10 at the team's request while
 * their route tests are running: add their hashes to `evidencePayments` when they exist.
 */
export type NetworkStatus = "verified" | "lab";

export interface OriginNetwork {
  id: string;
  name: string;
  status: NetworkStatus;
}

export const originNetworks: readonly OriginNetwork[] = [
  { id: "avalanche-fuji", name: "Avalanche Fuji", status: "verified" },
  { id: "ethereum-sepolia", name: "Ethereum Sepolia", status: "verified" },
  { id: "arbitrum-sepolia", name: "Arbitrum Sepolia", status: "verified" },
  { id: "base-sepolia", name: "Base Sepolia", status: "verified" },
  { id: "arc-testnet", name: "Arc Testnet", status: "lab" },
  { id: "solana-devnet", name: "Solana Devnet", status: "lab" },
  { id: "sui-testnet", name: "Sui Testnet", status: "lab" },
];

/** Every route ends at the business's USDC on Stellar. */
export const destinationNetwork = { id: "stellar-testnet", name: "Stellar Testnet" } as const;

/**
 * Real testnet payments, reproduced independently on 2026-10-08 (QA phase 1, issue #4): 0.1 USDC from
 * Avalanche Fuji to Stellar Testnet. Anyone can check them in the explorers. They are technical payments between
 * test accounts, not commercial orders, and the page says so next to them.
 * Remove or replace these rows if the team prefers other evidence: nothing else depends on them.
 */
export interface EvidencePayment {
  id: "gasless" | "external";
  /** Burn transaction on Avalanche Fuji (0x + 64 hex). */
  burnTxHash: `0x${string}`;
  /** Mint transaction on Stellar Testnet (64 hex). */
  mintTxHash: string;
}

export const evidenceDate = "2026-10-08";

export const evidencePayments: readonly EvidencePayment[] = [
  {
    id: "gasless",
    burnTxHash: "0x2527dc5f84b131dc6bcc1b7d47a60abf2d3edb170f5aa361f125cb83b94021c3",
    mintTxHash: "b6a9dfd9abc9dffde03abadf4bf0d6df6da7b20428be48f33c8b7e6f918116de",
  },
  {
    id: "external",
    burnTxHash: "0xc8339ace7d935fbf64fe45581fa388da2a63ed3d8b8cae1c4bdbf8218cf58deb",
    mintTxHash: "7d93687051850acdaa23d7a059e0286a7e029492f9e9c7ab41e06bb7910218b7",
  },
];

export const snowtraceTx = (hash: string): string => `https://testnet.snowtrace.io/tx/${hash}`;
export const stellarExpertTx = (hash: string): string => `https://stellar.expert/explorer/testnet/tx/${hash}`;
/** `0x2527dc…4021c3`: enough to recognise a hash without breaking the layout. */
export const shortHash = (hash: string): string => `${hash.slice(0, 8)}…${hash.slice(-6)}`;
