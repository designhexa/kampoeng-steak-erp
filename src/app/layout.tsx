import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../contexts/auth-context';
import { SupabaseProvider } from '../contexts/supabase-context';
import FarcasterWrapper from "@/components/FarcasterWrapper";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="id">
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <SupabaseProvider>
              <AuthProvider>
                
        <FarcasterWrapper>
          {children}
        </FarcasterWrapper>
        
              </AuthProvider>
            </SupabaseProvider>
          </body>
        </html>
      );
}

export const metadata: Metadata = {
        title: "Kampoeng Steak ERP Hub",
        description: "Centralize operations across 18 outlets with our web-based ERP. Supports multi-role users, sales, inventory, and finance management. Real-time data visibility and standardized processes.",
        other: { "fc:frame": JSON.stringify({"version":"next","imageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_1f2c6de4-c681-48a6-9373-0ccc5142cff7-g8fpfjTJ6bn7vMnrQA1VZJygneRR4k","button":{"title":"Open with Ohara","action":{"type":"launch_frame","name":"Kampoeng Steak ERP Hub","url":"https://sing-whale-112.app.ohara.ai","splashImageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg","splashBackgroundColor":"#ffffff"}}}
        ) }
    };
