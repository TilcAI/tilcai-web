import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Parallax layers use quality 85; the office tower uses 88.
  images: { qualities: [75, 85, 88] },
  // English is the default language; stable aliases use permanent redirects.
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: true },
      { source: "/:lang/estado-construccion", destination: "/:lang/roadmap", permanent: true },
      { source: "/estado-construccion", destination: "/es/roadmap", permanent: true },
      { source: "/roadmap", destination: "/en/roadmap", permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: "/demo", destination: "/es/demo" },
      { source: "/aliados", destination: "/es/aliados" },
    ];
  },
};

export default nextConfig;
