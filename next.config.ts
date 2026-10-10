import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Parallax layers use quality 85; the office tower uses 88.
  images: { qualities: [75, 85, 88] },
  // English is the default language: "/" goes to "/en".
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: false },
      { source: "/:lang/estado-construccion", destination: "/:lang/roadmap", permanent: false },
      { source: "/estado-construccion", destination: "/es/roadmap", permanent: false },
      { source: "/roadmap", destination: "/en/roadmap", permanent: false },
    ];
  },
};

export default nextConfig;
