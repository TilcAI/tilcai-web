import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Parallax layers use quality 85 and the office building uses 88 (the default allow-list only has 75).
  images: { qualities: [75, 85, 88] },
  // English is the default language: "/" goes to "/en".
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};

export default nextConfig;
