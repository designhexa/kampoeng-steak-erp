'use client';

import React, { useState } from 'react';
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
  Menu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../lib/utils';

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, url: '/' },
  { title: 'Menu Utama', icon: Menu, url: '/menu' },
  { title: 'Outlets', icon: Store, url: '/outlets' },
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
];

interface CollapsibleSidebarProps {
  defaultCollapsed?: boolean;
}

export function CollapsibleSidebar({ defaultCollapsed = false }: CollapsibleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'h-full border-r transition-all duration-300 flex flex-col relative',
        'bg-gradient-to-b from-blue-50 to-blue-100/50 border-blue-200',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header with integrated toggle button - Height 73px to match page header */}
      <div className={cn(
        'h-[73px] border-b border-blue-200 flex items-center bg-white/80 backdrop-blur-sm',
        isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
      )}>
        {!isCollapsed && (
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#163681]">Kampoeng Steak</h1>
            <p className="text-xs text-[#163681]/70 mt-1">ERP System</p>
          </div>
        )}
        
        {/* Toggle button integrated in header */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'flex items-center justify-center rounded-md transition-all duration-200',
            'hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400',
            'h-8 w-8'
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-[#163681]" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-[#163681]" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className={cn(
        'p-2 space-y-0.5 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent',
        isCollapsed && 'px-2'
      )}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.url || pathname.startsWith(item.url + '/');

          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative',
                isActive
                  ? 'bg-[#163681] text-[#F8F102] shadow-md'
                  : 'text-[#163681] hover:bg-blue-100 hover:shadow-sm',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium text-sm truncate">{item.title}</span>}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-[#163681] text-[#F8F102] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-blue-200 bg-white/60">
          <p className="text-xs text-[#163681]/70 text-center">v1.0.0</p>
        </div>
      )}
    </div>
  );
}
