'use client';

import React, { useMemo, useState } from 'react';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TruckIcon, Clock, CheckCircle, XCircle, Plus, ThumbsUp, ThumbsDown, ArrowUpDown } from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';
import { supabase } from '@/lib/supabase/typed-client';
import type { Database } from '@/lib/supabase/types';
type Tables = Database['public']['Tables'];

type PurchaseOrder = Tables['purchase_orders']['Row'];
type PurchaseOrderInsert = Tables['purchase_orders']['Insert'];
type PurchaseOrderUpdate = Tables['purchase_orders']['Update'];

export default function PembelianPage() {
  const { purchaseOrders, suppliers, outlets, loading, refreshData } = useSupabase();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedOutlet, setSelectedOutlet] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [addForm, setAddForm] = useState({
    outlet_id: '',
    supplier_id: '',
    total: '',
  });

  const filteredAndSortedPOs = useMemo(() => {
    let filtered = purchaseOrders;

    // Filter by outlet
    if (selectedOutlet !== 0) {
      filtered = filtered.filter(po => po.outlet_id === selectedOutlet);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(po => po.status === statusFilter);
    }

    // Filter by search
    if (search) {
      filtered = filtered.filter(po => {
        const supplier = suppliers.find(s => s.id === po.supplier_id);
        const outlet = outlets.find(o => o.id === po.outlet_id);
        return (
          supplier?.name.toLowerCase().includes(search.toLowerCase()) ||
          outlet?.name.toLowerCase().includes(search.toLowerCase()) ||
          po.id.toString().includes(search)
        );
      });
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [purchaseOrders, suppliers, outlets, selectedOutlet, statusFilter, search, sortOrder]);

  const stats = useMemo(() => {
    const filtered = selectedOutlet === 0 
      ? purchaseOrders 
      : purchaseOrders.filter(po => po.outlet_id === selectedOutlet);

    const pending = filtered.filter(po => po.status === 'Pending').length;
    const approved = filtered.filter(po => po.status === 'Approved').length;
    const rejected = filtered.filter(po => po.status === 'Rejected').length;

    return { pending, approved, rejected, total: filtered.length };
  }, [purchaseOrders, selectedOutlet]);

  const handleAddPO = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data: PurchaseOrderInsert = {
        outlet_id: parseInt(addForm.outlet_id),
        supplier_id: parseInt(addForm.supplier_id),
        total: parseInt(addForm.total),
        status: 'Pending'
      };

      const result = await supabase
        .from('purchase_orders')
        .insert([data]);

      if (result.error) throw result.error;

      setAddForm({ outlet_id: '', supplier_id: '', total: '' });
      setIsAddDialogOpen(false);
      await refreshData();
    } catch (error) {
      console.error('Error creating PO:', error);
      alert('Gagal membuat purchase order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (poId: number): Promise<void> => {
      try {
      const data: PurchaseOrderUpdate = {
        status: 'Approved'
      };

      const { error } = await supabase
        .from('purchase_orders')
        .update(data as any)
        .eq('id', poId);      if (error) throw error;

      await refreshData();
    } catch (error) {
      console.error('Error approving PO:', error);
      alert('Gagal approve purchase order');
    }
  };

  const handleReject = async (poId: number): Promise<void> => {
      try {
      const data: PurchaseOrderUpdate = {
        status: 'Rejected'
      };

      const { error } = await supabase
        .from('purchase_orders')
        .update(data as any)
        .eq('id', poId);      if (error) throw error;

      await refreshData();
    } catch (error) {
      console.error('Error rejecting PO:', error);
      alert('Gagal reject purchase order');
    }
  };

  const toggleSort = (): void => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#163681] mx-auto"></div>
          <p className="mt-4 text-[#163681]/70">Loading purchase orders...</p>
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
            <h1 className="text-xl md:text-2xl font-bold text-[#163681]">Pembelian & Supplier</h1>
            <p className="text-xs md:text-sm text-[#163681]/60">{purchaseOrders.length} purchase orders</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#163681] hover:bg-[#163681]/90 text-[#F8F102]">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat PO Baru
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-[#163681]">Buat Purchase Order Baru</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddPO} className="space-y-4">
                  <div>
                    <Label htmlFor="outlet">Outlet</Label>
                    <Select value={addForm.outlet_id} onValueChange={(value) => setAddForm({ ...addForm, outlet_id: value })}>
                      <SelectTrigger id="outlet">
                        <SelectValue placeholder="Pilih outlet" />
                      </SelectTrigger>
                      <SelectContent>
                        {outlets.map((outlet) => (
                          <SelectItem key={outlet.id} value={outlet.id.toString()}>
                            {outlet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="supplier">Supplier</Label>
                    <Select value={addForm.supplier_id} onValueChange={(value) => setAddForm({ ...addForm, supplier_id: value })}>
                      <SelectTrigger id="supplier">
                        <SelectValue placeholder="Pilih supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id.toString()}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="total">Total (Rp)</Label>
                    <Input
                      id="total"
                      type="number"
                      value={addForm.total}
                      onChange={(e) => setAddForm({ ...addForm, total: e.target.value })}
                      placeholder="0"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-[#163681] hover:bg-[#163681]/90 text-[#F8F102]">
                      {isSubmitting ? 'Menyimpan...' : 'Buat PO'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-6">
            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Total PO</CardTitle>
                  <TruckIcon className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.total}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Pending</CardTitle>
                  <Clock className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.pending}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Approved</CardTitle>
                  <CheckCircle className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.approved}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Rejected</CardTitle>
                  <XCircle className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.rejected}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#163681]">Purchase Orders</CardTitle>
                <div className="mt-4 flex gap-4 flex-wrap">
                <Input
                  placeholder="Cari PO, outlet, atau supplier..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm border-blue-200 focus:border-[#163681]"
                />
                <Select value={selectedOutlet.toString()} onValueChange={(value) => setSelectedOutlet(parseInt(value))}>
                  <SelectTrigger className="w-[200px] border-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Semua Outlet</SelectItem>
                      {outlets.map((outlet) => (
                        <SelectItem key={outlet.id} value={outlet.id.toString()}>
                          {outlet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] border-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" onClick={toggleSort} className="gap-2 border-[#163681] text-[#163681] hover:bg-[#163681] hover:text-[#F8F102]">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort: Tanggal ({sortOrder === 'asc' ? '↑' : '↓'})
                </Button>
              </div>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                    <TableHead className="text-[#163681]">PO ID</TableHead>
                    <TableHead className="text-[#163681]">Outlet</TableHead>
                    <TableHead className="text-[#163681]">Supplier</TableHead>
                    <TableHead className="text-[#163681]">Total</TableHead>
                    <TableHead className="text-[#163681]">Status</TableHead>
                    <TableHead className="text-[#163681]">Tanggal</TableHead>
                    <TableHead className="text-[#163681]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedPOs.map((po) => {
                      const supplier = suppliers.find(s => s.id === po.supplier_id);
                      const outlet = outlets.find(o => o.id === po.outlet_id);
                      
                    return (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium text-[#163681]">PO-{po.id}</TableCell>
                        <TableCell className="text-[#163681]/70">{outlet?.name || 'Unknown'}</TableCell>
                        <TableCell className="text-[#163681]/70">{supplier?.name || 'Unknown'}</TableCell>
                        <TableCell className="text-[#163681]/70">Rp {Number(po.total).toLocaleString('id-ID')}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                po.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : po.status === 'Approved'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {po.status}
                            </span>
                        </TableCell>
                        <TableCell className="text-[#163681]/70">
                          {new Date(po.created_at).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell>
                          {po.status === 'Pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(po.id)}
                                className="text-green-600 hover:bg-green-50 border-green-600"
                              >
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(po.id)}
                                className="text-red-600 hover:bg-red-50 border-red-600"
                              >
                                <ThumbsDown className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
