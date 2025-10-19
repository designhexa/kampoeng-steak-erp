 'use client';

import React, { useState } from 'react';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';

type DemoUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
};

export default function AccessPage() {
  const [users, setUsers] = useState<DemoUser[]>(() => [
    { id: 1, name: 'Admin Pusat', email: 'admin@kampoengsteak.com', role: 'AdminPusat', created_at: new Date().toISOString() },
    { id: 2, name: 'Kasir Outlet 1', email: 'kasir1@outlet.com', role: 'Kasir', created_at: new Date().toISOString() },
    { id: 3, name: 'Area Manager Jakarta', email: 'am.jakarta@kampoengsteak.com', role: 'AreaManager', created_at: new Date().toISOString() },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newUser: DemoUser = {
        id: Date.now(),
        name: form.name || 'New User',
        email: form.email || 'no-reply@local',
        role: form.role || 'Kasir',
        created_at: new Date().toISOString(),
      };
      setUsers((s) => [newUser, ...s]);
      setForm({ name: '', email: '', role: '' });
      setIsDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[73px] flex items-center justify-between gap-4 border-b bg-white px-4 md:px-6 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-[#163681]">User Access</h1>
            <p className="text-xs md:text-sm text-[#163681]/70">{users.length} user terdaftar</p>
          </div>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#163681] hover:bg-[#163681]/90 text-[#F8F102]"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Tambah User
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100/30">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 gap-4">
              {users.map((user) => (
                <Card key={user.id} className="border-2 border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-all">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[#163681]">{user.name}</CardTitle>
                    <Badge variant="secondary" className="font-medium">
                      {user.role}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#163681]/70">{user.email}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah User Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Masukkan nama user"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@kampoengsteak.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={form.role} onValueChange={(value) => setForm({ ...form, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AdminPusat">Admin Pusat</SelectItem>
                    <SelectItem value="AreaManager">Area Manager</SelectItem>
                    <SelectItem value="OutletManager">Outlet Manager</SelectItem>
                    <SelectItem value="Kasir">Kasir</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Gudang">Gudang</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Tambah User'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
