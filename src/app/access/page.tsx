 'use client';

import React, { useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';

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
    <div className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-blue-200 bg-white px-4 md:px-6 h-[73px] flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-[#163681]">User Access</h1>
            <p className="text-xs md:text-sm text-[#163681]/70">{users.length} user terdaftar</p>
          </div>
          <div>
            <button
              className="bg-[#163681] hover:bg-[#163681]/90 text-[#F8F102] px-3 py-2 rounded flex items-center gap-2"
              onClick={() => setIsDialogOpen(true)}
            >
              <span className="h-4 w-4">+</span>
              Tambah User
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">

          <section className="grid gap-3">
            {users.map((u) => (
              <div key={u.id} className="p-3 border rounded-lg bg-white/60">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#163681]">{u.name}</div>
                    <div className="text-sm text-gray-600">{u.email}</div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">{u.role}</div>
                </div>
              </div>
            ))}
          </section>

          {isDialogOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40">
              <div className="bg-white p-6 rounded shadow max-w-md w-full">
                <h2 className="text-lg font-semibold mb-2">Tambah User (Demo)</h2>
                <form onSubmit={handleAdd} className="space-y-3">
                  <div>
                    <label className="block text-sm">Nama</label>
                    <input
                      className="w-full border px-2 py-1 rounded"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Email</label>
                    <input
                      className="w-full border px-2 py-1 rounded"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Role</label>
                    <select
                      className="w-full border px-2 py-1 rounded"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="AdminPusat">Admin Pusat</option>
                      <option value="AreaManager">Area Manager</option>
                      <option value="OutletManager">Outlet Manager</option>
                      <option value="Kasir">Kasir</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-3 py-2 rounded border"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Batal
                    </button>
                    <button type="submit" className="px-3 py-2 rounded bg-[#163681] text-white" disabled={isSubmitting}>
                      {isSubmitting ? 'Menyimpan...' : 'Tambah'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
