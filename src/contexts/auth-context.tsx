'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../spacetime_module_bindings';
import { useSpacetimeDB } from '../hooks/use-spacetime';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  outletId: bigint;
  isLoading: boolean;
  setDemoUser: (role: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  outletId: BigInt(1),
  isLoading: true,
  setDemoUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { connected, connection, identity } = useSpacetimeDB();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [outletId, setOutletId] = useState<bigint>(BigInt(1));
  const [isLoading, setIsLoading] = useState(true);

  const setDemoUser = (demoRole: string) => {
    const roleMap: Record<string, UserRole> = {
      Admin: { tag: 'Admin' },
      AreaManager: { tag: 'AreaManager' },
      OutletManager: { tag: 'OutletManager' },
      Cashier: { tag: 'Cashier' },
      HR: { tag: 'HR' },
      Finance: { tag: 'Finance' },
    };

    const selectedRole = roleMap[demoRole] || { tag: 'Admin' };
    setRole(selectedRole);
    setOutletId(demoRole === 'Admin' ? BigInt(0) : BigInt(1));
    console.log('Demo role set to:', demoRole);
  };

  useEffect(() => {
    if (connected && connection && identity) {
      try {
        // Safely check if users table exists and has data
        if (connection.db && connection.db.users && connection.db.users.id) {
          const currentUser = connection.db.users.id().find(identity);
          if (currentUser) {
            setUser(currentUser);
            setRole(currentUser.role);
            setOutletId(currentUser.outletId);
            console.log('User loaded from database:', currentUser);
          } else {
            // No user found, set default admin role
            console.log('No user found, setting default admin role');
            setRole({ tag: 'Admin' });
            setOutletId(BigInt(0));
          }
        } else {
          // Table not ready yet, set default
          console.log('Users table not ready, setting default admin role');
          setRole({ tag: 'Admin' });
          setOutletId(BigInt(0));
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // On error, set default admin role
        setRole({ tag: 'Admin' });
        setOutletId(BigInt(0));
      } finally {
        setIsLoading(false);
      }
    } else if (!connected) {
      // Still connecting
      setIsLoading(true);
    }
  }, [connected, connection, identity]);

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
