import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // English is the default language: "/" goes to "/en".
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};

export default nextConfig;
