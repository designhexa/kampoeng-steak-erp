'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, TrendingUp, TrendingDown, Wallet
} from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';

export default function KeuanganDashboard() {
  const router = useRouter();
  const { cashFlow = [], sales = [] } = useSupabase();

  const cashIn = cashFlow.filter((cf: { type: string }) => cf.type === 'Income');
  const cashOut = cashFlow.filter((cf: { type: string }) => cf.type === 'Expense');
  const totalIncome = cashIn.reduce((sum: number, cf: { amount: number }) => sum + cf.amount, 0);
  const totalExpense = cashOut.reduce((sum: number, cf: { amount: number }) => sum + cf.amount, 0);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const netCashFlow = totalIncome - totalExpense;

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 border-b bg-white px-4 md:px-6 py-4 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">Dashboard Keuangan</h1>
            <p className="text-xs md:text-sm text-gray-600">Akuntansi & Cash Flow Management</p>
          </div>
          <Button onClick={() => router.push('/keuangan')} size="sm">
            Kelola Keuangan
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Financial Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    Rp {totalRevenue.toLocaleString('id-ID')}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Dari transaksi hari ini</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Cash In</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    Rp {totalIncome.toLocaleString('id-ID')}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{cashIn.length} transaksi</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Cash Out</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    Rp {totalExpense.toLocaleString('id-ID')}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{cashOut.length} pengeluaran</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Net Cash Flow</CardTitle>
                  <Wallet className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Rp {netCashFlow.toLocaleString('id-ID')}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Periode saat ini</p>
                </CardContent>
              </Card>
            </div>

            {/* Cash Flow Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Income */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Pemasukan Terbaru
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cashIn.slice(0, 5).map((flow: { id: number; description: string; amount: number; created_at: string }) => (
                      <div key={flow.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{flow.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(flow.created_at).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-green-600">
                          +Rp {flow.amount.toLocaleString('id-ID')}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => router.push('/keuangan')}
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                  >
                    Lihat Semua Pemasukan
                  </Button>
                </CardContent>
              </Card>

              {/* Expenses */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    Pengeluaran Terbaru
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cashOut.slice(0, 5).map((flow: { id: number; description: string; amount: number; created_at: string }) => (
                      <div key={flow.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{flow.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(flow.created_at).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-red-600">
                          -Rp {flow.amount.toLocaleString('id-ID')}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => router.push('/keuangan')}
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                  >
                    Lihat Semua Pengeluaran
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
