import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@base-ui-masterclass/database",
    "@base-ui-masterclass/content",
  ],
};

export default nextConfig;
