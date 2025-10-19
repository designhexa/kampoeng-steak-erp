'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Warehouse, CheckCircle, Clock, Truck
} from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';

type Distribution = {
  id: number;
  from_outlet_id: number;
  to_outlet_id: number;
  quantity: number;
  status: 'Pending' | 'InTransit' | 'Delivered';
  created_at: string;
};

export default function DistribusiDashboard() {
  const router = useRouter();
  const { distributions = [] } = useSupabase() as { distributions: Distribution[] };

  const pendingDist = distributions.filter(d => d.status === 'Pending');
  const inTransitDist = distributions.filter(d => d.status === 'InTransit');
  const deliveredDist = distributions.filter(d => d.status === 'Delivered');

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 border-b bg-white px-4 md:px-6 py-4 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">Dashboard Distribusi</h1>
            <p className="text-xs md:text-sm text-gray-600">Logistik & Transfer Stok Antar Outlet</p>
          </div>
          <Button onClick={() => router.push('/distribusi')} size="sm">
            Kelola Distribusi
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Distribusi</CardTitle>
                  <Warehouse className="h-4 w-4 text-cyan-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{distributions.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Transfer request</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{pendingDist.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Belum dikirim</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Dalam Perjalanan</CardTitle>
                  <Truck className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{inTransitDist.length}</div>
                  <p className="text-xs text-gray-600 mt-1">In transit</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Terkirim</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{deliveredDist.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Distributions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-bold">Distribusi Terbaru</h2>
                <Button onClick={() => router.push('/distribusi')} variant="outline" size="sm">
                  Lihat Semua
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Dari</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Ke</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Item</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Tanggal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {distributions.slice(0, 10).map((dist) => (
                          <tr key={dist.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium">DIST-{dist.id}</td>
                            <td className="px-4 py-3 text-sm">Outlet #{dist.from_outlet_id}</td>
                            <td className="px-4 py-3 text-sm">Outlet #{dist.to_outlet_id}</td>
                            <td className="px-4 py-3 text-sm">{dist.quantity} unit</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge 
                                variant={dist.status === 'Delivered' ? 'default' : 'secondary'}
                                className={
                                  dist.status === 'Delivered' 
                                    ? 'bg-green-100 text-green-700' 
                                    : dist.status === 'InTransit'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }
                              >
                                {dist.status === 'InTransit' ? 'In Transit' : dist.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {new Date(dist.created_at).toLocaleDateString('id-ID')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
