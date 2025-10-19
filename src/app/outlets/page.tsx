'use client';

import React, { useState, useMemo } from 'react';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Store, MapPin, Users, ShoppingCart, DollarSign, Plus, Edit, Trash2 } from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';
import { supabase } from '@/lib/supabase/client';

type OutletStatus = 'Open' | 'Closed' | 'Renovation';

export default function OutletsPage() {
  const { outlets, employees, sales, loading, refreshData } = useSupabase();
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [selectedOutlet, setSelectedOutlet] = useState<Database['public']['Tables']['outlets']['Row'] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form states for create
  const [createForm, setCreateForm] = useState({
    name: '',
    area: '',
    address: '',
  });

  // Form states for edit
  const [editForm, setEditForm] = useState({
    name: '',
    area: '',
    address: '',
    status: 'Open' as OutletStatus,
  });

  // Calculate stats per outlet
  const outletStats = useMemo(() => {
    return outlets.map(outlet => {
      const outletEmployees = employees.filter(e => e.outlet_id === outlet.id);
      const outletSales = sales.filter(s => s.outlet_id === outlet.id);
      const totalSales = outletSales.reduce((sum, sale) => sum + Number(sale.total), 0);

      return {
        ...outlet,
        employeeCount: outletEmployees.length,
        salesCount: outletSales.length,
        totalSales,
      };
    });
  }, [outlets, employees, sales]);

  // Handle create outlet
  const handleCreate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('outlets').insert({
        name: createForm.name,
        area: createForm.area,
        address: createForm.address,
        status: 'Open',
      });

      if (error) throw error;

      // Reset form
      setCreateForm({ name: '', area: '', address: '' });
      setIsCreateOpen(false);
      
      // Refresh data
      await refreshData();
    } catch (error) {
      console.error('Error creating outlet:', error);
      alert('Gagal membuat outlet baru');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit outlet
  const handleEdit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!selectedOutlet) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('outlets')
        .update({
          name: editForm.name,
          area: editForm.area,
          address: editForm.address,
          status: editForm.status,
        })
        .eq('id', selectedOutlet.id);

      if (error) throw error;

      setIsEditOpen(false);
      setSelectedOutlet(null);
      
      // Refresh data
      await refreshData();
    } catch (error) {
      console.error('Error updating outlet:', error);
      alert('Gagal mengupdate outlet');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete outlet
  const handleDelete = async (outletId: number): Promise<void> => {
    if (!confirm('Apakah Anda yakin ingin menghapus outlet ini?')) return;

    try {
      const { error } = await supabase.from('outlets').delete().eq('id', outletId);

      if (error) throw error;

      // Refresh data
      await refreshData();
    } catch (error) {
      console.error('Error deleting outlet:', error);
      alert('Gagal menghapus outlet');
    }
  };

  // Open edit dialog
  const openEditDialog = (outlet: Database['public']['Tables']['outlets']['Row']): void => {
    setSelectedOutlet(outlet);
    setEditForm({
      name: outlet.name,
      area: outlet.area,
      address: outlet.address,
      status: outlet.status,
    });
    setIsEditOpen(true);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Closed':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Renovation':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#163681] mx-auto"></div>
          <p className="mt-4 text-[#163681]/70">Loading outlets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[73px] flex items-center justify-between border-b border-blue-200 bg-white/80 backdrop-blur-sm px-4 md:px-6 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-[#163681]">Manajemen Outlet</h1>
            <p className="text-xs md:text-sm text-[#163681]/60">{outlets.length} outlet terdaftar</p>
          </div>

            {/* Create Button */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#163681] hover:bg-[#163681]/90 text-[#F8F102]">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Outlet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Outlet Baru</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama Outlet</Label>
                    <Input
                      id="name"
                      value={createForm.name}
                      onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                      placeholder="Kampoeng Steak Jakarta Utara"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Area/Wilayah</Label>
                    <Input
                      id="area"
                      value={createForm.area}
                      onChange={(e) => setCreateForm({ ...createForm, area: e.target.value })}
                      placeholder="Jakarta"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Alamat Lengkap</Label>
                    <Input
                      id="address"
                      value={createForm.address}
                      onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                      placeholder="Jl. Contoh No. 123"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-[#163681] hover:bg-[#163681]/90 text-[#F8F102]">
                      {isSubmitting ? 'Menyimpan...' : 'Tambah Outlet'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100/30">
            {outletStats.length === 0 ? (
              <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Store className="h-12 w-12 text-[#163681]/40 mb-4" />
                  <p className="text-[#163681]/70 mb-4">Belum ada outlet terdaftar</p>
                  <Button onClick={() => setIsCreateOpen(true)} className="bg-[#163681] hover:bg-[#163681]/90 text-[#F8F102]">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Outlet Pertama
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {outletStats.map((outlet) => (
                  <Card key={outlet.id} className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] hover:shadow-lg transition-all">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Store className="h-5 w-5 text-[#163681]" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-[#163681]">{outlet.name}</CardTitle>
                          <div className="flex items-center gap-1 text-sm text-[#163681]/70 mt-1">
                            <MapPin className="h-3 w-3" />
                            {outlet.area}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(outlet.status)}>{outlet.status}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-[#163681]/70">{outlet.address}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center p-2 bg-blue-50 rounded-lg">
                          <Users className="h-4 w-4 text-[#163681]/70 mb-1" />
                          <div className="text-lg font-bold text-[#163681]">{outlet.employeeCount}</div>
                          <div className="text-xs text-[#163681]/60">Karyawan</div>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-blue-50 rounded-lg">
                          <ShoppingCart className="h-4 w-4 text-[#163681]/70 mb-1" />
                          <div className="text-lg font-bold text-[#163681]">{outlet.salesCount}</div>
                          <div className="text-xs text-[#163681]/60">Transaksi</div>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-blue-50 rounded-lg">
                          <DollarSign className="h-4 w-4 text-[#163681]/70 mb-1" />
                          <div className="text-lg font-bold text-[#163681]">
                            {(outlet.totalSales / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-xs text-[#163681]/60">Penjualan</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-[#163681] text-[#163681] hover:bg-[#163681] hover:text-[#F8F102]"
                          onClick={() => openEditDialog(outlet)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(outlet.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Outlet</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nama Outlet</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-area">Area/Wilayah</Label>
              <Input
                id="edit-area"
                value={editForm.area}
                onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-address">Alamat Lengkap</Label>
              <Input
                id="edit-address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value: OutletStatus) => setEditForm({ ...editForm, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Renovation">Renovation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#163681] hover:bg-[#163681]/90 text-[#F8F102]">
                {isSubmitting ? 'Menyimpan...' : 'Update Outlet'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
