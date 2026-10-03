import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Parallax layers use quality 85; the office tower uses 88.
  images: { qualities: [75, 85, 88] },
  // English is the default language: "/" goes to "/en".
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};

export default nextConfig;
