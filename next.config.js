/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enables experimental features in Supabase client
    serverActions: true,
  },
  output: 'standalone', // 🔥 penting untuk Netlify agar SSR jalan
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
