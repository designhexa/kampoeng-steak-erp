'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Store, MapPin, CheckCircle2, XCircle, Clock, Users
} from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';

export default function OutletsDashboard() {
  const router = useRouter();
  const { outlets = [] } = useSupabase();

  const openOutlets = outlets.filter(o => o.status === 'Open');
  const closedOutlets = outlets.filter(o => o.status === 'Closed');
  const underMaintenanceOutlets = outlets.filter(o => o.status === 'Under Maintenance');

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 border-b bg-white px-4 md:px-6 py-4 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">Dashboard Outlets</h1>
            <p className="text-xs md:text-sm text-gray-600">Overview semua outlet Kampoeng Steak</p>
          </div>
          <Button onClick={() => router.push('/outlets')} size="sm">
            Kelola Outlets
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Outlets</CardTitle>
                  <Store className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{outlets.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Seluruh jaringan</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Outlets Aktif</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{openOutlets.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Sedang beroperasi</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Outlets Tutup</CardTitle>
                  <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{closedOutlets.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Tidak beroperasi</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Maintenance</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{underMaintenanceOutlets.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Dalam perawatan</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Outlets */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-bold">Daftar Outlets</h2>
                <Button onClick={() => router.push('/outlets')} variant="outline" size="sm">
                  Lihat Semua
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {outlets.slice(0, 6).map((outlet) => (
                  <Card key={outlet.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base flex items-center gap-2">
                            {outlet.name}
                          </CardTitle>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <MapPin className="h-3 w-3" />
                            {outlet.city}
                          </div>
                        </div>
                        <Badge 
                          variant={outlet.status === 'Open' ? 'default' : 'secondary'}
                          className={
                            outlet.status === 'Open' 
                              ? 'bg-green-100 text-green-700' 
                              : outlet.status === 'Closed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }
                        >
                          {outlet.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{outlet.manager_name || 'No Manager'}</span>
                        </div>
                        <div className="text-xs text-gray-500">{outlet.address}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
