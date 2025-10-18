'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  TruckIcon,
  Warehouse,
  ClipboardList,
  Users,
  UserPlus,
  DollarSign,
  Gift,
  Wrench,
  Settings,
  Store,
} from 'lucide-react';
import { cn } from '../lib/utils';

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, url: '/' },
  { title: 'POS', icon: ShoppingCart, url: '/pos' },
  { title: 'Inventory', icon: Package, url: '/inventory' },
  { title: 'Pembelian', icon: TruckIcon, url: '/pembelian' },
  { title: 'Distribusi', icon: Warehouse, url: '/distribusi' },
  { title: 'Operasional', icon: ClipboardList, url: '/operasional' },
  { title: 'HR & Payroll', icon: Users, url: '/hr' },
  { title: 'Rekrutmen', icon: UserPlus, url: '/rekrutmen' },
  { title: 'Keuangan', icon: DollarSign, url: '/keuangan' },
  { title: 'Promo & Loyalty', icon: Gift, url: '/promo' },
  { title: 'Maintenance', icon: Wrench, url: '/maintenance' },
  { title: 'User Access', icon: Settings, url: '/access' },
  { title: 'Outlets', icon: Store, url: '/outlets' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full w-64 border-r bg-white">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Kampoeng Steak</h1>
        <p className="text-sm text-gray-500 mt-1">ERP System</p>
      </div>

      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.url;

          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
