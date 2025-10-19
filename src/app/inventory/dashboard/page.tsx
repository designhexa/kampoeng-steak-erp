'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, AlertTriangle, CheckCircle2, TrendingDown
} from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';

export default function InventoryDashboard() {
  const router = useRouter();
  const { ingredients = [] } = useSupabase();

  // Helper function to determine stock status
  const getStockStatus = (stock: number) => {
    if (stock <= 10) return 'Critical';
    if (stock <= 30) return 'Low';
    return 'Normal';
  };

  const criticalStock = ingredients.filter(i => getStockStatus(i.stock) === 'Critical');
  const lowStock = ingredients.filter(i => getStockStatus(i.stock) === 'Low');
  const availableStock = ingredients.filter(i => getStockStatus(i.stock) === 'Normal');

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 border-b bg-white px-4 md:px-6 py-4 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">Dashboard Inventory</h1>
            <p className="text-xs md:text-sm text-gray-600">Monitoring stok bahan baku</p>
          </div>
          <Button onClick={() => router.push('/inventory')} size="sm">
            Kelola Inventory
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Item</CardTitle>
                  <Package className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ingredients.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Bahan baku</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Stok Aman</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{availableStock.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Tersedia</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Stok Rendah</CardTitle>
                  <TrendingDown className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{lowStock.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Perlu diisi</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Stok Kritis</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{criticalStock.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Urgent</p>
                </CardContent>
              </Card>
            </div>

            {/* Critical Items Alert */}
            {criticalStock.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Peringatan Stok Kritis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {criticalStock.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.name}</span>
                        <Badge variant="destructive" className="text-xs">
                          {item.stock} {item.unit} tersisa
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => router.push('/inventory')}
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                  >
                    Lihat Semua Item Kritis
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Stock Status Distribution */}
            <div>
              <h2 className="text-base md:text-lg font-bold mb-4">Status Distribusi Stok</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Stok Aman
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {availableStock.slice(0, 5).map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.name}</span>
                          <span className="text-green-600 font-medium">
                            {item.stock} {item.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-yellow-500" />
                      Stok Rendah
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {lowStock.slice(0, 5).map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.name}</span>
                          <span className="text-yellow-600 font-medium">
                            {item.stock} {item.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Stok Kritis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {criticalStock.slice(0, 5).map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.name}</span>
                          <span className="text-red-600 font-medium">
                            {item.stock} {item.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
