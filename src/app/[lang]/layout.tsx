import type { Metadata, Viewport } from "next";
import { Anton, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { RevealObserver } from "@/components/RevealObserver";
import { isLocale, locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";
import "../globals.css";

// Plus Jakarta Sans stands in for The Graph's licensed Euclid Circular A (see docs/redesign-the-graph.md).
const display = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const heroDisplay = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400", display: "swap" });

// Only /en and /es exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
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
    <html lang={lang} className={`${display.variable} ${mono.variable} ${heroDisplay.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
