import { redirect } from 'next/navigation';
import type { Database } from '@/lib/supabase/types';

type UserRole = Database['public']['Tables']['users']['Row']['role'];

type RouteAccess = {
  [key in UserRole]: string[];
};

// Define which routes each role can access
const routeAccess: RouteAccess = {
  'AdminPusat': [
    '/outlets',
    '/hr',
    '/keuangan',
    '/promo',
    '/menu',
    '/pembelian',
    '/distribusi',
    '/inventory',
    '/rekrutmen',
    '/operasional',
    '/maintenance',
    '/access'
  ],
  'AreaManager': [
    '/outlets',
    '/hr',
    '/keuangan',
    '/menu',
    '/pembelian',
    '/distribusi',
    '/inventory',
    '/rekrutmen',
    '/operasional'
  ],
  'OutletManager': [
    '/hr',
    '/keuangan',
    '/menu',
    '/pembelian',
    '/inventory',
    '/operasional',
    '/maintenance'
  ],
  'Kasir': [
    '/pos',
    '/keuangan',
    '/menu'
  ],
  'HR': [
    '/hr',
    '/rekrutmen'
  ],
  'Gudang': [
    '/inventory',
    '/pembelian',
    '/distribusi'
  ],
  'Finance': [
    '/keuangan'
  ]
};

export function checkRouteAccess(role: UserRole | null, pathname: string) {
  if (!role) {
    redirect('/login');
  }

  // Convert pathname to route pattern by keeping only the first segment
  const routePattern = '/' + pathname.split('/')[1];

  // Check if user role has access to this route pattern
  const hasAccess = routeAccess[role]?.includes(routePattern);

  if (!hasAccess) {
    // Redirect to default page based on role
    redirect(routeAccess[role][0]);
  }
}