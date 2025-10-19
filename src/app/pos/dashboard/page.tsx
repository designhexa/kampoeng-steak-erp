'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, DollarSign, TrendingUp, CreditCard, Clock
} from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';

export default function POSDashboard() {
  const router = useRouter();
  const { sales = [] } = useSupabase();

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const avgTransaction = sales.length > 0 ? totalRevenue / sales.length : 0;
  const cashPayments = sales.filter(s => s.payment_method === 'Cash').length;
  const digitalPayments = sales.filter(s => s.payment_method !== 'Cash').length;

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 border-b bg-white px-4 md:px-6 py-4 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">Dashboard POS</h1>
            <p className="text-xs md:text-sm text-gray-600">Point of Sale - Monitoring transaksi</p>
          </div>
          <Button onClick={() => router.push('/pos')} size="sm">
            Buka Kasir
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Transaksi</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sales.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Hari ini</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    Rp {totalRevenue.toLocaleString('id-ID')}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Pendapatan hari ini</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Rata-rata</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    Rp {Math.round(avgTransaction).toLocaleString('id-ID')}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Per transaksi</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Payment Mix</CardTitle>
                  <CreditCard className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cashPayments}/{digitalPayments}</div>
                  <p className="text-xs text-gray-600 mt-1">Cash/Digital</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-bold">Transaksi Terbaru</h2>
                <Button onClick={() => router.push('/pos')} variant="outline" size="sm">
                  Lihat Semua
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Waktu</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Outlet</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Kasir</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Payment</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {sales.slice(0, 10).map((sale) => (
                          <tr key={sale.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-gray-400" />
                                {new Date(sale.created_at).toLocaleTimeString('id-ID', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">Outlet #{sale.outlet_id}</td>
                            <td className="px-4 py-3 text-sm">{sale.cashier_name || 'Kasir'}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100">
                                {sale.payment_method}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-medium">
                              Rp {sale.total.toLocaleString('id-ID')}
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
