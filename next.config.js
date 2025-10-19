/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This enables experimental features in Supabase client
    serverActions: true,
  },
  // Enforce strict type checking and linting during build
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}