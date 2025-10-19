'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Store, Package, Users, TrendingUp, Truck, ShoppingCart, 
  DollarSign, UserPlus, Gift, Wrench, FileText, BarChart3
} from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';

export default function MenuPage() {
  const router = useRouter();
  const { outlets = [], employees = [], sales = [], ingredients = [] } = useSupabase();

  const menuItems = [
    {
      title: 'Outlets',
      description: `${outlets.length} outlet terdaftar`,
      icon: Store,
      color: 'bg-blue-500',
      href: '/outlets',
      stats: `${outlets.filter(o => o.status === 'Open').length} aktif`
    },
    {
      title: 'Inventory',
      description: 'Manajemen stok bahan baku',
      icon: Package,
      color: 'bg-green-500',
      href: '/inventory',
      stats: `${ingredients.filter(i => i.stock <= 10).length} kritis`
    },
    {
      title: 'Point of Sale',
      description: 'Sistem kasir & transaksi',
      icon: ShoppingCart,
      color: 'bg-purple-500',
      href: '/pos',
      stats: `${sales.length} transaksi`
    },
    {
      title: 'HR & Payroll',
      description: 'Manajemen karyawan',
      icon: Users,
      color: 'bg-orange-500',
      href: '/hr',
      stats: `${employees.length} karyawan`
    },
    {
      title: 'Pembelian',
      description: 'Purchase orders & supplier',
      icon: Truck,
      color: 'bg-yellow-500',
      href: '/pembelian',
      stats: 'Kelola PO'
    },
    {
      title: 'Distribusi',
      description: 'Logistik antar outlet',
      icon: TrendingUp,
      color: 'bg-cyan-500',
      href: '/distribusi',
      stats: 'Transfer stok'
    },
    {
      title: 'Keuangan',
      description: 'Akuntansi & cash flow',
      icon: DollarSign,
      color: 'bg-emerald-500',
      href: '/keuangan',
      stats: 'Laporan keuangan'
    },
    {
      title: 'Rekrutmen',
      description: 'Recruitment & onboarding',
      icon: UserPlus,
      color: 'bg-pink-500',
      href: '/rekrutmen',
      stats: 'Kelola kandidat'
    },
    {
      title: 'Promo',
      description: 'Campaign & diskon',
      icon: Gift,
      color: 'bg-red-500',
      href: '/promo',
      stats: 'Kelola promo'
    },
    {
      title: 'Maintenance',
      description: 'Checklist harian',
      icon: Wrench,
      color: 'bg-indigo-500',
      href: '/maintenance',
      stats: 'Daily checks'
    },
    {
      title: 'Operasional',
      description: 'Laporan operasional',
      icon: FileText,
      color: 'bg-violet-500',
      href: '/operasional',
      stats: 'Shift reports'
    },
    {
      title: 'Reports',
      description: 'Analytics & laporan',
      icon: BarChart3,
      color: 'bg-teal-500',
      href: '#',
      stats: 'Coming soon'
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[73px] flex items-center gap-4 border-b bg-white px-4 md:px-6 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-[#163681]">Menu Utama</h1>
            <p className="text-xs md:text-sm text-[#163681]/70">Pilih modul untuk memulai</p>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-bold mb-2 text-[#163681]">Modul Aplikasi</h2>
              <p className="text-sm text-[#163681]/70">Sistem ERP terintegrasi untuk 18 outlet Kampoeng Steak</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.title}
                    className="hover:shadow-lg transition-all cursor-pointer group border-2 border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681]"
                    onClick={() => item.href !== '#' && router.push(item.href)}
                  >
                    <CardHeader className="space-y-3 pb-4">
                      <div className={`h-12 w-12 rounded-lg ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base md:text-lg text-[#163681]">{item.title}</CardTitle>
                        <CardDescription className="text-xs md:text-sm mt-1 text-[#163681]/60">
                          {item.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Badge variant="secondary" className="text-xs">
                        {item.stats}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
