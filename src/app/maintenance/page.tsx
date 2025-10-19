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
import { Wrench, Plus, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';
import { supabase } from '@/lib/supabase/client';

import type { Database } from '@/lib/supabase/types';
type Asset = Database['public']['Tables']['assets']['Row'];

export default function MaintenancePage() {
  const { outlets, loading } = useSupabase();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: '',
    outletId: '',
  });

  React.useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const stats = useMemo(() => {
    const inUse = assets.filter((a) => a.status === 'InUse').length;
    const maintenance = assets.filter((a) => a.status === 'Maintenance').length;
    const broken = assets.filter((a) => a.status === 'Broken').length;

    return { total: assets.length, inUse, maintenance, broken };
  }, [assets]);

  const handleCreateAsset = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('assets').insert({
        name: formData.name,
        outlet_id: parseInt(formData.outletId),
        last_maintenance: new Date().toISOString(),
        status: 'InUse',
      });

      if (error) throw error;

      setFormData({ name: '', outletId: '' });
      setIsDialogOpen(false);
      await fetchAssets();
    } catch (error) {
      console.error('Error creating asset:', error);
      alert('Gagal menambah asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAssetStatus = async (assetId: number, newStatus: Asset['status']): Promise<void> => {
    try {
      const { error } = await supabase
        .from('assets')
        .update({ 
          status: newStatus,
          last_maintenance: new Date().toISOString()
        })
        .eq('id', assetId);

      if (error) throw error;

      await fetchAssets();
    } catch (error) {
      console.error('Error updating asset status:', error);
      alert('Gagal mengupdate status asset');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#163681] mx-auto"></div>
          <p className="mt-4 text-[#163681]/70">Loading assets...</p>
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
            <h1 className="text-xl md:text-2xl font-bold text-[#163681]">Maintenance & Asset</h1>
            <p className="text-xs md:text-sm text-[#163681]/60">{assets.length} asset terdaftar</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#163681] hover:bg-[#163681]/90">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Asset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Asset Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateAsset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Asset</Label>
                  <Input
                    id="name"
                    placeholder="Kompor Gas, Kulkas, dll"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outlet">Outlet</Label>
                  <Select value={formData.outletId} onValueChange={(value) => setFormData({ ...formData, outletId: value })}>
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

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-[#163681] hover:bg-[#163681]/90">
                    {isSubmitting ? 'Menyimpan...' : 'Tambah Asset'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-6">
            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Total Asset</CardTitle>
                <Wrench className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.total}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">In Use</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.inUse}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Maintenance</CardTitle>
                <Clock className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.maintenance}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Broken</CardTitle>
                <AlertCircle className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.broken}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#163681]">
                <Wrench className="h-5 w-5" />
                Daftar Aset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-blue-200">
                      <TableHead className="text-[#163681]">Nama Aset</TableHead>
                      <TableHead className="text-[#163681]">Outlet</TableHead>
                      <TableHead className="text-[#163681]">Tanggal Registrasi</TableHead>
                      <TableHead className="text-[#163681]">Maintenance Terakhir</TableHead>
                      <TableHead className="text-[#163681]">Status</TableHead>
                      <TableHead className="text-[#163681]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((asset) => {
                      const outlet = outlets.find((o) => o.id === asset.outlet_id);
                      return (
                        <TableRow key={asset.id} className="border-blue-100">
                          <TableCell className="font-medium text-[#163681]">{asset.name}</TableCell>
                          <TableCell className="text-[#163681]/70">{outlet?.name || 'Unknown'}</TableCell>
                          <TableCell className="text-[#163681]/70">{new Date(asset.created_at).toLocaleDateString('id-ID')}</TableCell>
                          <TableCell className="text-[#163681]/70">{new Date(asset.last_maintenance).toLocaleDateString('id-ID')}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                asset.status === 'InUse'
                                  ? 'bg-green-100 text-green-700'
                                  : asset.status === 'Maintenance'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {asset.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {asset.status !== 'InUse' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateAssetStatus(asset.id, 'InUse')}
                                  className="text-green-600 border-green-200"
                                >
                                  In Use
                                </Button>
                              )}
                              {asset.status !== 'Maintenance' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateAssetStatus(asset.id, 'Maintenance')}
                                  className="text-yellow-600 border-yellow-200"
                                >
                                  Service
                                </Button>
                              )}
                              {asset.status !== 'Broken' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateAssetStatus(asset.id, 'Broken')}
                                  className="text-red-600 border-red-200"
                                >
                                  Rusak
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
