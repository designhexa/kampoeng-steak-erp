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
import { Warehouse, TruckIcon, Package, CheckCircle, Plus, ArrowUpDown } from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';
import { supabase } from '@/lib/supabase/typed-client';
import type { Database } from '@/lib/supabase/types';
type Tables = Database['public']['Tables'];

type Distribution = Database['public']['Tables']['distributions']['Row'];
type DistributionInsert = Database['public']['Tables']['distributions']['Insert'];
type DistributionUpdate = Database['public']['Tables']['distributions']['Update'];

export default function DistribusiPage() {
  const { outlets, ingredients, loading, refreshData } = useSupabase();
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedOutlet, setSelectedOutlet] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [addForm, setAddForm] = useState({
    from_outlet_id: '',
    to_outlet_id: '',
    ingredient_id: '',
    quantity: '',
  });

  // Fetch distributions
  React.useEffect(() => {
    fetchDistributions();
  }, []);

  const fetchDistributions = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('distributions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDistributions(data || []);
    } catch (error) {
      console.error('Error fetching distributions:', error);
    }
  };

  const filteredDistributions = useMemo(() => {
    let filtered = distributions;

    // Filter by outlet (from OR to)
    if (selectedOutlet !== 0) {
      filtered = filtered.filter(d => 
        d.from_outlet_id === selectedOutlet || d.to_outlet_id === selectedOutlet
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [distributions, selectedOutlet, statusFilter, sortOrder]);

  const stats = useMemo(() => {
    const filtered = selectedOutlet === 0 
      ? distributions 
      : distributions.filter(d => d.from_outlet_id === selectedOutlet || d.to_outlet_id === selectedOutlet);

    const pending = filtered.filter(d => d.status === 'Pending').length;
    const inTransit = filtered.filter(d => d.status === 'InTransit').length;
    const delivered = filtered.filter(d => d.status === 'Delivered').length;

    return { pending, inTransit, delivered, total: filtered.length };
  }, [distributions, selectedOutlet]);

  const handleCreateDistribution = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data: Database['public']['Tables']['distributions']['Insert'] = {
        from_outlet_id: parseInt(addForm.from_outlet_id),
        to_outlet_id: parseInt(addForm.to_outlet_id),
        ingredient_name: ingredients.find(i => i.id.toString() === addForm.ingredient_id)?.name || '',
        quantity: parseInt(addForm.quantity),
        status: 'Pending' as const
      } satisfies Tables['distributions']['Insert'];

      const { error } = await supabase
        .from('distributions')
        .insert([data]);

      if (error) throw error;

      setAddForm({ from_outlet_id: '', to_outlet_id: '', ingredient_id: '', quantity: '' });
      setIsDialogOpen(false);
      await fetchDistributions();
      await refreshData();
    } catch (error) {
      console.error('Error creating distribution:', error);
      alert('Gagal membuat distribusi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkDelivered = async (distributionId: number): Promise<void> => {
    try {
      const data: DistributionUpdate = { 
        status: 'Delivered' as const 
      };
      const { error } = await supabase
        .from('distributions')
        .update(data as Tables['distributions']['Update'])
        .eq('id', distributionId);

      if (error) throw error;

      await fetchDistributions();
      await refreshData();
    } catch (error) {
      console.error('Error marking delivered:', error);
      alert('Gagal mengupdate status');
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
          <p className="mt-4 text-[#163681]/70">Loading distributions...</p>
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
            <h1 className="text-xl md:text-2xl font-bold text-[#163681]">Distribusi & Logistik</h1>
            <p className="text-xs md:text-sm text-[#163681]/60">{distributions.length} distribusi terdaftar</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#163681] hover:bg-[#163681]/90 text-[#F8F102]">
                  <Plus className="h-4 w-4 mr-2" />
                  Transfer Stok
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-[#163681]">Transfer Stok Antar Outlet</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateDistribution} className="space-y-4">
                  <div>
                    <Label htmlFor="from">Dari Outlet</Label>
                    <Select value={addForm.from_outlet_id} onValueChange={(value) => setAddForm({ ...addForm, from_outlet_id: value })}>
                      <SelectTrigger id="from">
                        <SelectValue placeholder="Pilih outlet asal" />
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
                    <Label htmlFor="to">Ke Outlet</Label>
                    <Select value={addForm.to_outlet_id} onValueChange={(value) => setAddForm({ ...addForm, to_outlet_id: value })}>
                      <SelectTrigger id="to">
                        <SelectValue placeholder="Pilih outlet tujuan" />
                      </SelectTrigger>
                      <SelectContent>
                        {outlets.filter(o => o.id.toString() !== addForm.from_outlet_id).map((outlet) => (
                          <SelectItem key={outlet.id} value={outlet.id.toString()}>
                            {outlet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="ingredient">Bahan</Label>
                    <Select value={addForm.ingredient_id} onValueChange={(value) => setAddForm({ ...addForm, ingredient_id: value })}>
                      <SelectTrigger id="ingredient">
                        <SelectValue placeholder="Pilih bahan" />
                      </SelectTrigger>
                      <SelectContent>
                        {ingredients.map((ing) => (
                          <SelectItem key={ing.id} value={ing.id.toString()}>
                            {ing.name} ({ing.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quantity">Jumlah</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={addForm.quantity}
                      onChange={(e) => setAddForm({ ...addForm, quantity: e.target.value })}
                      placeholder="0"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-[#163681] hover:bg-[#163681]/90 text-[#F8F102]">
                      {isSubmitting ? 'Menyimpan...' : 'Request Transfer'}
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
                <CardTitle className="text-sm font-medium text-[#163681]/70">Total Distribusi</CardTitle>
                  <Warehouse className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.total}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Pending</CardTitle>
                  <Package className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.pending}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">In Transit</CardTitle>
                  <TruckIcon className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.inTransit}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Delivered</CardTitle>
                  <CheckCircle className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.delivered}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#163681]">Tracking Distribusi</CardTitle>
                <div className="mt-4 flex gap-4 flex-wrap">
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
                      <SelectItem value="InTransit">In Transit</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
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
                    <TableHead className="text-[#163681]">ID</TableHead>
                    <TableHead className="text-[#163681]">Dari</TableHead>
                    <TableHead className="text-[#163681]">Ke</TableHead>
                    <TableHead className="text-[#163681]">Bahan</TableHead>
                    <TableHead className="text-[#163681]">Jumlah</TableHead>
                    <TableHead className="text-[#163681]">Status</TableHead>
                    <TableHead className="text-[#163681]">Tanggal</TableHead>
                    <TableHead className="text-[#163681]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDistributions.map((dist) => {
                      const fromOutlet = outlets.find(o => o.id === dist.from_outlet_id);
                      const toOutlet = outlets.find(o => o.id === dist.to_outlet_id);
                    return (
                      <TableRow key={dist.id}>
                        <TableCell className="font-medium text-[#163681]">#{dist.id}</TableCell>
                        <TableCell className="text-[#163681]/70">{fromOutlet?.name || '-'}</TableCell>
                        <TableCell className="text-[#163681]/70">{toOutlet?.name || '-'}</TableCell>
                        <TableCell className="text-[#163681]/70">{dist.ingredient_name}</TableCell>
                        <TableCell className="text-[#163681]/70">{dist.quantity} unit</TableCell>
                          <TableCell>
                            <span
                              className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                dist.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : dist.status === 'InTransit'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {dist.status}
                            </span>
                        </TableCell>
                        <TableCell className="text-[#163681]/70">
                          {new Date(dist.created_at).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell>
                          {dist.status !== 'Delivered' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkDelivered(dist.id)}
                              className="border-[#163681] text-[#163681] hover:bg-[#163681] hover:text-[#F8F102]"
                            >
                              Terima
                            </Button>
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
