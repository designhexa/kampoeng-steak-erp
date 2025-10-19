'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const AuthProvider = dynamic(() => 
  import('../../contexts/auth-context').then(mod => mod.AuthProvider), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm md:text-base text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }
);

const SupabaseProvider = dynamic(() =>
  import('../../contexts/supabase-context').then(mod => mod.SupabaseProvider), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm md:text-base text-gray-600">Loading database...</p>
        </div>
      </div>
    )
  }
);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SupabaseProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SupabaseProvider>
  );
}