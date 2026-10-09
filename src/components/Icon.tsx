import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  doc: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  layers: (
    <>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 13l9 5 9-5" />
      <path d="M3 17.5l9 5 9-5" opacity=".55" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  shield: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />,
  receipt: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  cafe: (
    <>
      <path d="M4 8h12v6a6 6 0 0 1-12 0zM16 9h2a3 3 0 0 1 0 6h-2M3 21h15" />
      <path d="M8 5c-2-2 1-3 0-5M12 5c-2-2 1-3 0-5" />
    </>
  ),
  tree: (
    <>
      <circle cx="12" cy="5" r="2" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
      <path d="M12 7v5M12 12l-6 5M12 12l6 5" />
    </>
  ),
  rules: (
    <>
      <path d="M4 6h10M4 12h16M4 18h7" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="15" cy="18" r="2" />
    </>
  ),
  signal: <path d="M12 20v-6M7 20v-3M17 20v-9M4 9l5-4 4 3 7-5" />,
  pen: (
    <>
      <path d="M4 20l4-1 11-11-3-3L5 16z" />
      <path d="M14 6l3 3" />
    </>
  ),
  store: <path d="M4 9l2-5h12l2 5M4 9v11h16V9M4 9h16M9 20v-6h6v6" />,
  agent: (
    <>
      <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
      <path d="M8 10h8M8 13h5" />
    </>
  ),
  link: (
    <>
      <circle cx="5" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M7 12h2.5M14.5 12H17" />
    </>
  ),
  chain: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </>
  ),
  check: <path d="M5 12l4 4 10-10" />,
  bolt: <path d="M13 3L5 13.5h6L10 21l8-10.5h-6z" />,
  upright: <path d="M7 17L17 7M9 7h8v8" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
    </>
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.7 9.6c-.4-1-1.4-1.6-2.7-1.6-1.4 0-2.5.7-2.5 1.9 0 2.6 5.1 1.2 5.1 3.9 0 1.2-1.1 1.9-2.6 1.9-1.4 0-2.4-.6-2.8-1.7M12 6.4V8m0 8v1.6" />
    </>
  ),
  verified: (
    <>
      <path d="M12 3l8 9-8 9-8-9z" />
      <path d="M8.6 12l2.5 2.5 4.3-4.6" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="20" r="2" />
      <path d="M8 6h6.5a3.5 3.5 0 0 1 0 7h-5a3.5 3.5 0 0 0 0 7H16" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6L6 18" />,
  play: <path d="M8 5l11 7-11 7z" />,
  pause: <path d="M9 5v14M15 5v14" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  expand: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  power: (
    <>
      <path d="M12 3v8" />
      <path d="M6.3 7.5a8 8 0 1 0 11.4 0" />
    </>
  ),
  repeat: (
    <>
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4" />
      <path d="M21 13v2a3 3 0 0 1-3 3H3" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3l10 18H2z" />
      <path d="M12 10v5M12 18v.5" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2l2.5 11h11L21 8H6.5" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </>
  ),
  chevron: <path d="M6 9l6 6 6-6" />,
  panel: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M15 4v16" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
};

export type IconName = keyof typeof paths;

export function Icon({ name, className = "icon" }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
