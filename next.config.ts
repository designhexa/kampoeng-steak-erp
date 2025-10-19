import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use a custom build directory to avoid issues with a locked `.next` folder
  distDir: '.next',
  output: 'standalone'
};

export default nextConfig;
