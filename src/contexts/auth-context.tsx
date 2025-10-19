'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabase } from './supabase-context';
import type { Database } from '@/lib/supabase/types';

type UserRole = 'AdminPusat' | 'AreaManager' | 'OutletManager' | 'Kasir' | 'HR' | 'Gudang' | 'Finance';

interface AuthContextType {
  user: Database['public']['Tables']['users']['Row'] | null;
  role: UserRole | null;
  outletId: number | null;
  isLoading: boolean;
  setDemoUser: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  outletId: null,
  isLoading: true,
  setDemoUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { supabase, isConfigured } = useSupabase();
  const [user, setUser] = useState<Database['public']['Tables']['users']['Row'] | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [outletId, setOutletId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setDemoUser = async (demoRole: UserRole) => {
    try {
      // Fetch or create a demo user
      const { data: demoUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', demoRole)
        .single<Database['public']['Tables']['users']['Row']>();

      if (error) throw error;

      if (demoUser) {
        setUser(demoUser);
        setRole(demoUser.role);
        setOutletId(demoUser.outlet_id);
        console.log('Demo user set:', demoUser);
      }
    } catch (error) {
      console.error('Error setting demo user:', error);
      // Set defaults on error
      setRole('AdminPusat');
      setOutletId(null);
    }
  };

  useEffect(() => {
    if (!isConfigured) {
      setIsLoading(false);
      return;
    }

    const loadInitialUser = async () => {
      try {
        // Try to get admin user first
        const { data: adminUser, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'AdminPusat')
          .single<Database['public']['Tables']['users']['Row']>();

        if (error) throw error;

        if (adminUser) {
          setUser(adminUser);
          setRole(adminUser.role);
          setOutletId(adminUser.outlet_id);
          console.log('Admin user loaded:', adminUser);
        } else {
          console.log('No admin user found, setting defaults');
          setRole('AdminPusat');
          setOutletId(null);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setRole('AdminPusat');
        setOutletId(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialUser();
  }, [isConfigured, supabase]);

  return (
    <AuthContext.Provider value={{ user, role, outletId, isLoading, setDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
