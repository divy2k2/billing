import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    webpackBuildWorker: false
  }
};

export default nextConfig;
