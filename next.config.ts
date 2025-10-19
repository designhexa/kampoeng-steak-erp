import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use a custom build directory to avoid issues with a locked `.next` folder
  distDir: '.next',
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ws: false,
        'utf-8-validate': false,
        'bufferutil': false
      };
    }
    return config;
  }
};

export default nextConfig;
