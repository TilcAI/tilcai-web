import React from "react";

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
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="#0E0B25" stroke="#9B72FF" strokeWidth="1.5" />
      <path
        d="M23.5 11.2L9.5 21.8M21.5 8.5L8.5 18.5M24.5 14L11.5 24"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="7.5" stroke="#9B72FF" strokeWidth="1.5" strokeDasharray="3 3" />
    </svg>
  );
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
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#E84142" />
      <path
        d="M12 5.5l5.5 9.5h-3.2L12 11l-2.3 4H6.5L12 5.5z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function EthereumIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#627EEA" />
      <path d="M12 4.5l-4.5 7.5L12 15l4.5-3L12 4.5z" fill="#FFFFFF" fillOpacity="0.9" />
      <path d="M12 15.8l-4.5-2.8L12 19.5l4.5-6.5-4.5 2.8z" fill="#FFFFFF" fillOpacity="0.7" />
    </svg>
  );
}

export function ArbitrumIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#28A0F0" />
      <path
        d="M12 6.5l4 6.5-1.5 2.5-2.5-4-2.5 4-1.5-2.5 4-6.5z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function BaseIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#0052FF" />
      <circle cx="12" cy="12" r="6" fill="#FFFFFF" />
      <rect x="11" y="6" width="6" height="2" fill="#0052FF" />
    </svg>
  );
}

export function SolanaIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#14F195" fillOpacity="0.2" stroke="#14F195" strokeWidth="1.2" />
      <path
        d="M7 8.2h8.5l-2 2H5l2-2zm0 3.8h8.5l-2 2H5l2-2zm2 3.8h8.5l-2 2H7l2-2z"
        fill="#14F195"
      />
    </svg>
  );
}

export function SuiIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#4DA2FF" />
      <path
        d="M12 5.5c-2.5 3-4.5 5.5-4.5 8a4.5 4.5 0 0 0 9 0c0-2.5-2-5-4.5-8z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function ArcIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#8C70FF" />
      <path
        d="M7 15a5 5 0 0 1 10 0M9 15a3 3 0 0 1 6 0"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NetworkIcon({ id, className = "w-5 h-5" }: { id: string; className?: string }) {
  switch (id) {
    case "avalanche-fuji":
      return <AvalancheIcon className={className} />;
    case "ethereum-sepolia":
      return <EthereumIcon className={className} />;
    case "arbitrum-sepolia":
      return <ArbitrumIcon className={className} />;
    case "base-sepolia":
      return <BaseIcon className={className} />;
    case "solana-devnet":
      return <SolanaIcon className={className} />;
    case "sui-testnet":
      return <SuiIcon className={className} />;
    case "arc-testnet":
      return <ArcIcon className={className} />;
    default:
      return <AvalancheIcon className={className} />;
  }
}
