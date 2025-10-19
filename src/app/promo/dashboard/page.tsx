'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { Database } from '@/lib/supabase/types';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Gift, TrendingUp, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';

type Tables = Database['public']['Tables']
type Promotion = Tables['promotions']['Row'];

export default function PromoDashboard() {
  const router = useRouter();
  const { promotions = [] } = useSupabase();

  const activePromos = promotions.filter(p => p.status === 'Active');
  const scheduledPromos = promotions.filter(p => p.status === 'Upcoming');
  const expiredPromos = promotions.filter(p => p.status === 'Expired');

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 border-b bg-white px-4 md:px-6 py-4 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">Dashboard Promo & Loyalty</h1>
            <p className="text-xs md:text-sm text-gray-600">Campaign Management & Promotional Programs</p>
          </div>
          <Button onClick={() => router.push('/promo')} size="sm">
            Kelola Promo
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Promo</CardTitle>
                  <Gift className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{promotions.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Semua campaign</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Promo Aktif</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{activePromos.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Sedang berjalan</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Dijadwalkan</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{scheduledPromos.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Akan datang</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Expired</CardTitle>
                  <XCircle className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-600">{expiredPromos.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Berakhir</p>
                </CardContent>
              </Card>
            </div>

            {/* Active Promotions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-bold">Promo Aktif</h2>
                <Button onClick={() => router.push('/promo')} variant="outline" size="sm">
                  Lihat Semua
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activePromos.slice(0, 6).map((promo) => (
                  <Card key={promo.id} className="hover:shadow-md transition-shadow border-green-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{promo.name}</CardTitle>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Discount:</span>
                          <span className="font-medium">
                            {promo.discount_type === 'Percentage' 
                              ? `${promo.discount_value}%`
                              : `Rp ${promo.discount_value.toLocaleString('id-ID')}`
                            }
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Berakhir: {new Date(promo.end_date).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Scheduled Promotions */}
            {scheduledPromos.length > 0 && (
              <div>
                <h2 className="text-base md:text-lg font-bold mb-4">Promo Mendatang</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scheduledPromos.slice(0, 3).map((promo) => (
                    <Card key={promo.id} className="hover:shadow-md transition-shadow border-blue-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base">{promo.name}</CardTitle>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700">
                            Upcoming
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Discount:</span>
                            <span className="font-medium">
                              {promo.discount_type === 'Percentage' 
                                ? `${promo.discount_value}%`
                                : `Rp ${promo.discount_value.toLocaleString('id-ID')}`
                              }
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            Mulai: {new Date(promo.start_date).toLocaleDateString('id-ID')}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
