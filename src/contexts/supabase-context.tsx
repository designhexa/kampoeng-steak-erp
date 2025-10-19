'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/db.types';

type Tables = Database['public']['Tables'];

interface SupabaseContextType {
  // Supabase client instance
  supabase: typeof supabase;
  
  // Connection status
  isConnected: boolean;
  isConfigured: boolean;
  
  // Data from all tables
  outlets: Tables['outlets']['Row'][];
  employees: Tables['employees']['Row'][];
  products: Tables['products']['Row'][];
  ingredients: Tables['ingredients']['Row'][];
  sales: Tables['sales']['Row'][];
  suppliers: Tables['suppliers']['Row'][];
  purchaseOrders: Tables['purchase_orders']['Row'][];
  distributions: Tables['distributions']['Row'][];
  dailyChecklists: Tables['daily_checklists']['Row'][];
  shiftReports: Tables['shift_reports']['Row'][];
  candidates: Tables['candidates']['Row'][];
  promotions: Tables['promotions']['Row'][];
  assets: Tables['assets']['Row'][];
  cashFlow: Tables['cash_flow']['Row'][];
  users: Tables['users']['Row'][];
  
  // Loading states
  loading: boolean;
  error: string | null;
  
  // Refresh function
  refreshData: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [outlets, setOutlets] = useState<Tables['outlets']['Row'][]>([]);
  const [employees, setEmployees] = useState<Tables['employees']['Row'][]>([]);
  const [products, setProducts] = useState<Tables['products']['Row'][]>([]);
  const [ingredients, setIngredients] = useState<Tables['ingredients']['Row'][]>([]);
  const [sales, setSales] = useState<Tables['sales']['Row'][]>([]);
  const [suppliers, setSuppliers] = useState<Tables['suppliers']['Row'][]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<Tables['purchase_orders']['Row'][]>([]);
  const [distributions, setDistributions] = useState<Tables['distributions']['Row'][]>([]);
  const [dailyChecklists, setDailyChecklists] = useState<Tables['daily_checklists']['Row'][]>([]);
  const [shiftReports, setShiftReports] = useState<Tables['shift_reports']['Row'][]>([]);
  const [candidates, setCandidates] = useState<Tables['candidates']['Row'][]>([]);
  const [promotions, setPromotions] = useState<Tables['promotions']['Row'][]>([]);
  const [assets, setAssets] = useState<Tables['assets']['Row'][]>([]);
  const [cashFlow, setCashFlow] = useState<Tables['cash_flow']['Row'][]>([]);
  const [users, setUsers] = useState<Tables['users']['Row'][]>([]);

  const isConfigured = isSupabaseConfigured();

  // Fetch all data
  const fetchData = async (): Promise<void> => {
    if (!isConfigured) {
      setError('Supabase not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all tables in parallel
      const [
        outletsRes,
        employeesRes,
        productsRes,
        ingredientsRes,
        salesRes,
        suppliersRes,
        purchaseOrdersRes,
        distributionsRes,
        dailyChecklistsRes,
        shiftReportsRes,
        candidatesRes,
        promotionsRes,
        assetsRes,
        cashFlowRes,
        usersRes,
      ] = await Promise.all([
        supabase.from('outlets').select('*').order('id', { ascending: true }),
        supabase.from('employees').select('*').order('id', { ascending: true }),
        supabase.from('products').select('*').order('id', { ascending: true }),
        supabase.from('ingredients').select('*').order('id', { ascending: true }),
        supabase.from('sales').select('*').order('created_at', { ascending: false }),
        supabase.from('suppliers').select('*').order('id', { ascending: true }),
        supabase.from('purchase_orders').select('*').order('created_at', { ascending: false }),
        supabase.from('distributions').select('*').order('created_at', { ascending: false }),
        supabase.from('daily_checklists').select('*').order('created_at', { ascending: false }),
        supabase.from('shift_reports').select('*').order('created_at', { ascending: false }),
        supabase.from('candidates').select('*').order('created_at', { ascending: false }),
        supabase.from('promotions').select('*').order('created_at', { ascending: false }),
        supabase.from('assets').select('*').order('id', { ascending: true }),
        supabase.from('cash_flow').select('*').order('created_at', { ascending: false }),
        supabase.from('users').select('*').order('id', { ascending: true }),
      ]);

      // Check for errors
      if (outletsRes.error) throw outletsRes.error;
      if (employeesRes.error) throw employeesRes.error;
      if (productsRes.error) throw productsRes.error;
      if (ingredientsRes.error) throw ingredientsRes.error;
      if (salesRes.error) throw salesRes.error;
      if (suppliersRes.error) throw suppliersRes.error;
      if (purchaseOrdersRes.error) throw purchaseOrdersRes.error;
      if (distributionsRes.error) throw distributionsRes.error;
      if (dailyChecklistsRes.error) throw dailyChecklistsRes.error;
      if (shiftReportsRes.error) throw shiftReportsRes.error;
      if (candidatesRes.error) throw candidatesRes.error;
      if (promotionsRes.error) throw promotionsRes.error;
      if (assetsRes.error) throw assetsRes.error;
      if (cashFlowRes.error) throw cashFlowRes.error;
      if (usersRes.error) throw usersRes.error;

      // Set data
      setOutlets(outletsRes.data || []);
      setEmployees(employeesRes.data || []);
      setProducts(productsRes.data || []);
      setIngredients(ingredientsRes.data || []);
      setSales(salesRes.data || []);
      setSuppliers(suppliersRes.data || []);
      setPurchaseOrders(purchaseOrdersRes.data || []);
      setDistributions(distributionsRes.data || []);
      setDailyChecklists(dailyChecklistsRes.data || []);
      setShiftReports(shiftReportsRes.data || []);
      setCandidates(candidatesRes.data || []);
      setPromotions(promotionsRes.data || []);
      setAssets(assetsRes.data || []);
      setCashFlow(cashFlowRes.data || []);
      setUsers(usersRes.data || []);

      setIsConnected(true);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Setup real-time subscriptions for all tables
  useEffect(() => {
    if (!isConfigured || !isConnected) return;

    const channels = [
      supabase.channel('outlets-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'outlets' }, () => fetchData()).subscribe(),
      supabase.channel('employees-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'employees' }, () => fetchData()).subscribe(),
      supabase.channel('products-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchData()).subscribe(),
      supabase.channel('ingredients-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'ingredients' }, () => fetchData()).subscribe(),
      supabase.channel('sales-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'sales' }, () => fetchData()).subscribe(),
      supabase.channel('suppliers-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'suppliers' }, () => fetchData()).subscribe(),
      supabase.channel('purchase_orders-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'purchase_orders' }, () => fetchData()).subscribe(),
      supabase.channel('distributions-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'distributions' }, () => fetchData()).subscribe(),
      supabase.channel('daily_checklists-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'daily_checklists' }, () => fetchData()).subscribe(),
      supabase.channel('shift_reports-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'shift_reports' }, () => fetchData()).subscribe(),
      supabase.channel('candidates-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'candidates' }, () => fetchData()).subscribe(),
      supabase.channel('promotions-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'promotions' }, () => fetchData()).subscribe(),
      supabase.channel('assets-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'assets' }, () => fetchData()).subscribe(),
      supabase.channel('cash_flow-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'cash_flow' }, () => fetchData()).subscribe(),
      supabase.channel('users-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => fetchData()).subscribe(),
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [isConfigured, isConnected]);

  const value: SupabaseContextType = {
    supabase,
    isConnected,
    isConfigured,
    outlets,
    employees,
    products,
    ingredients,
    sales,
    suppliers,
    purchaseOrders,
    distributions,
    dailyChecklists,
    shiftReports,
    candidates,
    promotions,
    assets,
    cashFlow,
    users,
    loading,
    error,
    refreshData: fetchData,
  };

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}

export function useSupabase(): SupabaseContextType {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}
