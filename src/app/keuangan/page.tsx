'use client';

import React, { useMemo, useState } from 'react';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSupabase } from '@/contexts/supabase-context';

interface CashFlow {
  id: number;
  outlet_id: number;
  amount: number;
  ctype: string;
  category: string;
  description: string;
  created_at: string;
}

export default function KeuanganPage() {
  const { sales, outlets, loading } = useSupabase();
  const [cashFlow, setCashFlow] = useState<CashFlow[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Fetch cash flow
  React.useEffect(() => {
    fetchCashFlow();
  }, []);

  const fetchCashFlow = async (): Promise<void> => {
    try {
      const { supabase } = await import('@/lib/supabase/client');
      const { data, error } = await supabase
        .from('cash_flow')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCashFlow(data || []);
    } catch (error) {
      console.error('Error fetching cash flow:', error);
    }
  };

  const filteredCashFlow = useMemo(() => {
    let filtered = cashFlow;

    if (selectedOutlet !== 0) {
      filtered = filtered.filter(cf => cf.outlet_id === selectedOutlet);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(cf => cf.ctype === typeFilter);
    }

    if (search) {
      filtered = filtered.filter(cf =>
        cf.category.toLowerCase().includes(search.toLowerCase()) ||
        cf.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    return filtered;
  }, [cashFlow, selectedOutlet, typeFilter, search]);

  const stats = useMemo(() => {
    const filtered = selectedOutlet === 0 ? cashFlow : cashFlow.filter(cf => cf.outlet_id === selectedOutlet);
    
    const inflow = filtered
      .filter(cf => cf.ctype === 'Inflow')
      .reduce((sum, cf) => sum + Number(cf.amount), 0);
    
    const outflow = filtered
      .filter(cf => cf.ctype === 'Outflow')
      .reduce((sum, cf) => sum + Number(cf.amount), 0);

    const filteredSales = selectedOutlet === 0 
      ? sales 
      : sales.filter(s => s.outlet_id === selectedOutlet);
    
    const totalSales = filteredSales.reduce((sum, s) => sum + Number(s.total), 0);
    
    const netCashFlow = inflow - outflow;

    return { inflow, outflow, totalSales, netCashFlow };
  }, [cashFlow, sales, selectedOutlet]);

  const cashFlowByCategory = useMemo(() => {
    const filtered = selectedOutlet === 0 ? cashFlow : cashFlow.filter(cf => cf.outlet_id === selectedOutlet);
    const categories = new Map<string, { inflow: number; outflow: number }>();

    filtered.forEach(cf => {
      const current = categories.get(cf.category) || { inflow: 0, outflow: 0 };
      if (cf.ctype === 'Inflow') {
        current.inflow += Number(cf.amount);
      } else {
        current.outflow += Number(cf.amount);
      }
      categories.set(cf.category, current);
    });

    return Array.from(categories.entries()).map(([category, data]) => ({
      category,
      ...data,
    }));
  }, [cashFlow, selectedOutlet]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#163681] mx-auto"></div>
          <p className="mt-4 text-[#163681]/70">Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[73px] flex items-center justify-between border-b border-blue-200 bg-white/80 backdrop-blur-sm px-4 md:px-6 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-[#163681]">Akuntansi & Keuangan</h1>
            <p className="text-xs md:text-sm text-[#163681]/60">{cashFlow.length} transaksi keuangan</p>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100/30">
          {/* Outlet Filter */}
          <div className="mb-6">
            <Select value={selectedOutlet.toString()} onValueChange={(value) => setSelectedOutlet(parseInt(value))}>
              <SelectTrigger className="w-[250px] border-blue-200 focus:ring-[#163681]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Semua Outlet</SelectItem>
                {outlets.map((outlet) => (
                  <SelectItem key={outlet.id} value={outlet.id.toString()}>
                    {outlet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-6">
            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Total Penjualan</CardTitle>
                <DollarSign className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">
                  Rp {stats.totalSales.toLocaleString('id-ID')}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Pemasukan</CardTitle>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">
                  Rp {stats.inflow.toLocaleString('id-ID')}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Pengeluaran</CardTitle>
                <TrendingDown className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">
                  Rp {stats.outflow.toLocaleString('id-ID')}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Net Cash Flow</CardTitle>
                <PieChart className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stats.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Rp {stats.netCashFlow.toLocaleString('id-ID')}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card className="mb-6 border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#163681]">Cash Flow by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={cashFlowByCategory}
                  barCategoryGap="20%"
                  barGap={0}
                  maxBarSize={40}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fill: '#163681', fontSize: 12 }}
                    axisLine={{ strokeWidth: 1 }}
                    axisLine={{ stroke: '#e0e7ff' }}
                  />
                  <YAxis 
                    tick={{ fill: '#163681', fontSize: 12 }}
                    axisLine={{ stroke: '#e0e7ff' }}
                    tickFormatter={(value) => `Rp ${Number(value).toLocaleString('id-ID')}`}
                    offset={5}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #bfdbfe', borderRadius: '8px' }}
                    formatter={(value) => `Rp ${Number(value).toLocaleString('id-ID')}`}
                  />
                  <Bar 
                    dataKey="inflow" 
                    fill="#10b981" 
                    name="Pemasukan" 
                    radius={[4, 4, 0, 0]}
                    barSize={30} 
                  />
                  <Bar 
                    dataKey="outflow" 
                    fill="#ef4444" 
                    name="Pengeluaran" 
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Transaction List */}
          <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#163681]">Daftar Transaksi</CardTitle>
              <div className="mt-4 flex gap-4 flex-wrap">
                <Input
                  placeholder="Cari transaksi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm border-blue-200 focus:ring-[#163681]"
                />
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px] border-blue-200 focus:ring-[#163681]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="Inflow">Pemasukan</SelectItem>
                    <SelectItem value="Outflow">Pengeluaran</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCashFlow.map((cf) => {
                  const outlet = outlets.find(o => o.id === cf.outlet_id);
                  return (
                    <div key={cf.id} className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-semibold ${cf.ctype === 'Inflow' ? 'text-green-600' : 'text-red-600'}`}>
                            {cf.ctype === 'Inflow' ? '+' : '-'} Rp {Number(cf.amount).toLocaleString('id-ID')}
                          </span>
                          <span className="text-sm bg-blue-100 text-[#163681] px-2 py-1 rounded">{cf.category}</span>
                        </div>
                        <p className="text-sm text-[#163681]/70 mt-1">{cf.description}</p>
                        <p className="text-xs text-[#163681]/60 mt-1">
                          {outlet?.name} • {new Date(cf.created_at).toLocaleDateString('id-ID', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
