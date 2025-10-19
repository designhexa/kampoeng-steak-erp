'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulasi login (untuk demo, bisa diganti dengan real authentication)
    setTimeout(() => {
      if (username && password) {
        // Set session di localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', username);
        
        // Redirect ke dashboard
        router.push('/');
      } else {
        setError('Username dan password harus diisi');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
            <Store className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">Kampoeng Steak ERP</CardTitle>
          <CardDescription className="text-base">
            Sistem Manajemen Terpadu - 18 Outlets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 text-center">
                Demo Login:<br />
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                  username: admin | password: admin
                </span>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
