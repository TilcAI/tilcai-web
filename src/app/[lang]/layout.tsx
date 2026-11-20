import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { RevealObserver } from "@/components/RevealObserver";
import { isLocale, locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";
import "../globals.css";

// Plus Jakarta Sans stands in for The Graph's licensed Euclid Circular A (see docs/redesign-the-graph.md).
const display = localFont({ src: "../../fonts/PlusJakartaSans-VariableFont_wght.ttf", variable: "--font-jakarta", weight: "400 700", display: "swap" });
// JetBrains Mono is self-hosted (latin, variable weight; OFL in src/fonts) so the build never fetches Google Fonts:
// next/font/google failed on Vercel resolving the downloaded font files (2026-11-08).
const mono = localFont({ src: "../../fonts/JetBrainsMono-latin-wght.woff2", variable: "--font-jetbrains", weight: "400 600", display: "swap" });
const heroDisplay = localFont({ src: "../../fonts/Anton-Regular.ttf", variable: "--font-anton", weight: "400", display: "swap" });

// Only /en and /es exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "TilcAI",
  robots: process.env.VERCEL_ENV === "preview" ? { index: false, follow: false } : undefined,
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  icons: {
    // Google Search only shows a favicon whose side is a multiple of 48px; 32 and 64 alone fall back to the globe.
    icon: [
      { url: "/brand/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/brand/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico", sizes: "64x64", type: "image/x-icon" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0C0A1D",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${display.variable} ${mono.variable} ${heroDisplay.variable} js`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <noscript><style>{".js .reveal { opacity: 1; transform: none; transition: none; }"}</style></noscript>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
