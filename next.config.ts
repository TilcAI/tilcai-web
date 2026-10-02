import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The parallax scene layers are served at quality 85 (the default allow-list only has 75).
  images: { qualities: [75, 85] },
  // English is the default language: "/" goes to "/en".
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};

export default nextConfig;
