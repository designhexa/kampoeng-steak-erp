import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  images: {
    domains: ['localhost', 'supabase.co'],
  },
  // Untuk memastikan aplikasi bisa di-deploy ke Netlify
  output: 'standalone',
  // Mengoptimalkan build
  swcMinify: true,
  reactStrictMode: true,
}

export default nextConfig
