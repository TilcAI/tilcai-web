import Image from "next/image";
import { networkLogos } from "@/lib/content/network-logos";

export function UsdcIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="#2775CA" stroke="#3D92EC" strokeWidth="1.5" />
      <path
        d="M19.2 17.5c0-1.7-1-2.3-3.1-2.6-1.5-.2-1.9-.6-1.9-1.3 0-.7.6-1.2 1.8-1.2 1.2 0 1.8.4 2 1.3h2c-.2-1.6-1.3-2.6-3-2.9V9.5h-2v1.3c-1.8.3-3 1.5-3 3 0 1.7 1 2.4 3.1 2.7 1.6.3 1.9.7 1.9 1.4 0 .8-.7 1.3-1.9 1.3-1.4 0-2.1-.5-2.3-1.5h-2.1c.2 1.8 1.4 2.8 3.3 3.1v1.4h2v-1.4c1.8-.3 3.1-1.4 3.1-3.2z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function StellarIcon({ className = "w-6 h-6" }: { className?: string }) {
  return <Image src={networkLogos["stellar-testnet"]} width={32} height={32} alt="" aria-hidden="true" className={className} draggable={false} />;
}

export function CircleCctpIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="#0A192F" stroke="#37D2FF" strokeWidth="1.5" />
      <path
        d="M16 7a9 9 0 1 0 9 9h-3a6 6 0 1 1-6-6V7z"
        fill="#37D2FF"
      />
      <circle cx="16" cy="16" r="3.5" fill="#00F2FE" />
    </svg>
  );
}

export function FlameIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2c-.5 2.5-2 4-3.5 5.5C7 9 5.5 11 5.5 14a6.5 6.5 0 0 0 13 0c0-3.5-2-6-4-8-.5 2-1.5 3-2.5 3.5 0-2.5 0-5.5 0-7.5z"
        fill="url(#flameGrad)"
      />
      <path
        d="M12 11c-.5 1.5-1.5 2.5-2.5 3.5-.5.5-.5 1.5-.5 2.5a3 3 0 0 0 6 0c0-1.5-1-3-3-6z"
        fill="#FFE699"
      />
      <defs>
        <linearGradient id="flameGrad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF4D4D" />
          <stop offset="0.5" stopColor="#FF8C00" />
          <stop offset="1" stopColor="#9B72FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AvalancheIcon({ className = "w-5 h-5" }: { className?: string }) {
  return <NetworkIcon id="avalanche-fuji" className={className} />;
}

export function EthereumIcon({ className = "w-5 h-5" }: { className?: string }) {
  return <NetworkIcon id="ethereum-sepolia" className={className} />;
}

export function ArbitrumIcon({ className = "w-5 h-5" }: { className?: string }) {
  return <NetworkIcon id="arbitrum-sepolia" className={className} />;
}

export function BaseIcon({ className = "w-5 h-5" }: { className?: string }) {
  return <NetworkIcon id="base-sepolia" className={className} />;
}

export function SolanaIcon({ className = "w-5 h-5" }: { className?: string }) {
  return <NetworkIcon id="solana-devnet" className={className} />;
}

export function SuiIcon({ className = "w-5 h-5" }: { className?: string }) {
  return <NetworkIcon id="sui-testnet" className={className} />;
}

export function ArcIcon({ className = "w-5 h-5" }: { className?: string }) {
  return <NetworkIcon id="arc-testnet" className={className} />;
}

export function NetworkIcon({ id, className = "w-5 h-5" }: { id: string; className?: string }) {
  const src = networkLogos[id as keyof typeof networkLogos];
  return src ? <Image src={src} width={32} height={32} alt="" aria-hidden="true" className={className} draggable={false} /> : null;
}
