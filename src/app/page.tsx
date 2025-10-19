'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Store, Package, Users, TrendingUp, ShoppingCart, 
  DollarSign, AlertTriangle, CheckCircle2, Clock
} from 'lucide-react';
import { LoadingComponent, SetupComponent } from '@/components/ui/loading';
import { useSupabase } from '@/contexts/supabase-context';

export default function Dashboard() {
  const router = useRouter();
  const { outlets = [], employees = [], sales = [], ingredients = [], isConnected, isConfigured, loading } = useSupabase();

  if (!isConfigured) {
    return <SetupComponent />;
  }

  if (loading) {
    return <LoadingComponent />;
  }

  // Helper function to determine stock status
  const getStockStatus = (stock: number) => {
    if (stock <= 10) return 'Critical';
    if (stock <= 30) return 'Low';
    return 'Normal';
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const avgTransactionValue = sales.length > 0 ? totalRevenue / sales.length : 0;
  const criticalStockCount = ingredients.filter(i => getStockStatus(i.stock) === 'Critical').length;
  const activeOutlets = outlets.filter(o => o.status === 'Open').length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[73px] flex items-center gap-4 border-b bg-white px-4 md:px-6 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-[#163681]">Dashboard Utama</h1>
            <p className="text-xs md:text-sm text-[#163681]/70">Overview sistem ERP Kampoeng Steak</p>
          </div>
          {isConnected && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
              ✓ Connected
            </Badge>
          )}
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100/30">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Quick Stats - Main KPIs */}
            <div>
              <h2 className="text-base md:text-lg font-bold mb-4 text-[#163681]">Key Performance Indicators</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow bg-white border-blue-200">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-[#163681]/70">Total Outlets</CardTitle>
                    <Store className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{outlets.length}</div>
                    <p className="text-xs text-[#163681]/60 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      {activeOutlets} outlets aktif
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow bg-white border-blue-200">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-[#163681]/70">Total Karyawan</CardTitle>
                    <Users className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{employees.length}</div>
                    <p className="text-xs text-[#163681]/60 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      {activeEmployees} karyawan aktif
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow bg-white border-blue-200">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-[#163681]/70">Total Transaksi</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sales.length}</div>
                    <p className="text-xs text-[#163681]/60 mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-blue-400" />
                      Hari ini
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow bg-white border-blue-200">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-[#163681]/70">Stok Kritis</CardTitle>
                    <Package className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {criticalStockCount}
                    </div>
                    <p className="text-xs text-[#163681]/60 mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      Perlu perhatian
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Financial Overview */}
            <div>
              <h2 className="text-base md:text-lg font-bold mb-4 text-[#163681]">Financial Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-[#163681]/70">Revenue Hari Ini</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      Rp {totalRevenue.toLocaleString('id-ID')}
                    </div>
                    <p className="text-xs text-[#163681]/60 mt-1">Dari {sales.length} transaksi</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-[#163681]/70">Rata-rata Transaksi</CardTitle>
                    <TrendingUp className="h-4 w-4 text-cyan-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      Rp {Math.round(avgTransactionValue).toLocaleString('id-ID')}
                    </div>
                    <p className="text-xs text-[#163681]/60 mt-1">Per transaksi</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-[#163681]/70">Inventory Value</CardTitle>
                    <Package className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {ingredients.length}
                    </div>
                    <p className="text-xs text-[#163681]/60 mt-1">Total item bahan baku</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-base md:text-lg font-bold mb-4 text-[#163681]">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => router.push('/menu')}
                  className="p-4 bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-lg hover:border-[#163681] hover:shadow-md transition-all text-left"
                >
                  <div className="text-sm font-semibold text-[#163681]">Menu Utama</div>
                  <div className="text-xs text-[#163681]/60 mt-1">Lihat semua modul</div>
                </button>
                <button
                  onClick={() => router.push('/pos')}
                  className="p-4 bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-lg hover:border-[#163681] hover:shadow-md transition-all text-left"
                >
                  <div className="text-sm font-semibold text-[#163681]">POS</div>
                  <div className="text-xs text-[#163681]/60 mt-1">Buka kasir</div>
                </button>
                <button
                  onClick={() => router.push('/inventory')}
                  className="p-4 bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-lg hover:border-[#163681] hover:shadow-md transition-all text-left"
                >
                  <div className="text-sm font-semibold text-[#163681]">Inventory</div>
                  <div className="text-xs text-[#163681]/60 mt-1">Cek stok</div>
                </button>
                <button
                  onClick={() => router.push('/outlets')}
                  className="p-4 bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-lg hover:border-[#163681] hover:shadow-md transition-all text-left"
                >
                  <div className="text-sm font-semibold text-[#163681]">Outlets</div>
                  <div className="text-xs text-[#163681]/60 mt-1">Kelola outlet</div>
                </button>
              </div>
            </div>

            {/* Alerts & Notifications */}
            {criticalStockCount > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Peringatan Stok
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-600">
                    Ada {criticalStockCount} item bahan baku dengan stok kritis yang perlu segera diisi ulang.
                  </p>
                  <button
                    onClick={() => router.push('/inventory')}
                    className="mt-3 text-sm font-medium text-red-700 hover:text-red-800 underline"
                  >
                    Lihat detail inventory →
                  </button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
