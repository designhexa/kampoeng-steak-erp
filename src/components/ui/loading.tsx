'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export function LoadingComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-sm md:text-base text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );
}

export function SetupComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">⚙️ Supabase Setup Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm md:text-base text-gray-600">
            Untuk menggunakan Kampoeng Steak ERP System, Anda perlu setup Supabase database terlebih dahulu.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-sm md:text-base">📋 Quick Setup (5 menit):</h3>
            <ol className="list-decimal list-inside space-y-2 text-xs md:text-sm">
              <li>Buat project gratis di <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">supabase.com</a></li>
              <li>Copy Project URL dan anon key</li>
              <li>Hardcode credentials di file .env.local</li>
              <li>Jalankan SQL schema di Supabase SQL Editor</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ErrorComponent({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
      <Card className="w-full max-w-2xl border-red-200">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-6 w-6" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm md:text-base text-red-600">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}