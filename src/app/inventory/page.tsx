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
import { Package, AlertTriangle, TrendingDown, TrendingUp, Plus } from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';
import { supabase } from '@/lib/supabase/typed-client';
import type { Database } from '@/lib/supabase/types';
type Tables = Database['public']['Tables'];

export default function InventoryPage() {
  const { ingredients, outlets, loading, refreshData } = useSupabase();
  const [search, setSearch] = useState<string>('');
  const [selectedOutlet, setSelectedOutlet] = useState<number>(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Add form state
  const [addForm, setAddForm] = useState({
    name: '',
    unit: 'kg',
    min_stock: '',
    stock: '',
    outlet_id: '',
  });

  const filteredIngredients = useMemo(() => {
    let filtered = ingredients;
    
    if (selectedOutlet !== 0) {
      filtered = filtered.filter(ing => ing.outlet_id === selectedOutlet);
    }
    
    if (search) {
      filtered = filtered.filter(ing => 
        ing.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return filtered;
  }, [ingredients, selectedOutlet, search]);

  const stockStats = useMemo(() => {
    const critical = ingredients.filter(ing => ing.status === 'Critical').length;
    const low = ingredients.filter(ing => ing.status === 'Low').length;
    const adequate = ingredients.filter(ing => ing.status === 'Normal').length;

    return { critical, low, adequate };
  }, [ingredients]);

  const handleAddIngredient = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const stock = parseInt(addForm.stock);
      const minStock = parseInt(addForm.min_stock);
      
      let status: Tables['ingredients']['Row']['status'] = 'Normal';
      if (stock < minStock) {
        status = 'Critical';
      } else if (stock < minStock * 2) {
        status = 'Low';
      }

      const data: Tables['ingredients']['Insert'] = {
        name: addForm.name,
        outlet_id: parseInt(addForm.outlet_id),
        stock: stock,
        unit: addForm.unit,
        min_stock: minStock,
        status: status
      };

      const { error } = await supabase
        .from('ingredients')
        .insert(data as Tables['ingredients']['Insert']);

      if (error) throw error;

      setAddForm({ name: '', unit: 'kg', min_stock: '', stock: '', outlet_id: '' });
      setIsAddDialogOpen(false);
      await refreshData();
    } catch (error) {
      console.error('Error adding ingredient:', error);
      alert('Gagal menambah bahan baku');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStock = async (ingredientId: number, newStock: number): Promise<void> => {
    try {
      const ingredient = ingredients.find(i => i.id === ingredientId);
      if (!ingredient) return;

      let newStatus: Tables['ingredients']['Row']['status'] = 'Normal';
      if (newStock < ingredient.min_stock) {
        newStatus = 'Critical';
      } else if (newStock < ingredient.min_stock * 2) {
        newStatus = 'Low';
      }

      const data: Tables['ingredients']['Update'] = {
        stock: newStock,
        status: newStatus
      };

      const { error } = await supabase
        .from('ingredients')
        .update(data)
        .eq('id', ingredientId);

      if (error) throw error;

      await refreshData();
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Gagal mengupdate stok');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#163681] mx-auto"></div>
          <p className="mt-4 text-[#163681]/70">Loading inventory...</p>
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
            <h1 className="text-xl md:text-2xl font-bold text-[#163681]">Inventory & Bahan Baku</h1>
            <p className="text-xs md:text-sm text-[#163681]/60">{ingredients.length} item terdaftar</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#163681] hover:bg-[#163681]/90 text-[#F8F102]">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Bahan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-[#163681]">Tambah Bahan Baku Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddIngredient} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Bahan</Label>
                  <Input
                    id="name"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    placeholder="Daging Sapi, Kentang, dll"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="unit">Satuan</Label>
                  <Select value={addForm.unit} onValueChange={(value) => setAddForm({ ...addForm, unit: value })}>
                    <SelectTrigger id="unit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="g">Gram (g)</SelectItem>
                      <SelectItem value="L">Liter (L)</SelectItem>
                      <SelectItem value="ml">Mililiter (ml)</SelectItem>
                      <SelectItem value="pcs">Pcs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min_stock">Stok Minimum</Label>
                    <Input
                      id="min_stock"
                      type="number"
                      value={addForm.min_stock}
                      onChange={(e) => setAddForm({ ...addForm, min_stock: e.target.value })}
                      placeholder="10"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock">Stok Awal</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={addForm.stock}
                      onChange={(e) => setAddForm({ ...addForm, stock: e.target.value })}
                      placeholder="50"
                      required
                    />
                  </div>
                </div>

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

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-[#163681] hover:bg-[#163681]/90 text-[#F8F102]">
                    {isSubmitting ? 'Menyimpan...' : 'Tambah Bahan'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Stok Kritis</CardTitle>
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stockStats.critical}</div>
                <p className="text-xs text-[#163681]/60">Di bawah minimum</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Stok Rendah</CardTitle>
                <TrendingDown className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stockStats.low}</div>
                <p className="text-xs text-[#163681]/60">Perlu perhatian</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Stok Aman</CardTitle>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stockStats.adequate}</div>
                <p className="text-xs text-[#163681]/60">Stok memadai</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#163681]">
                <Package className="h-5 w-5" />
                Daftar Bahan Baku
              </CardTitle>
              <div className="mt-4 flex gap-4">
                <Input
                  placeholder="Cari bahan..."
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
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#163681]">Nama Bahan</TableHead>
                    <TableHead className="text-[#163681]">Outlet</TableHead>
                    <TableHead className="text-[#163681]">Stok Saat Ini</TableHead>
                    <TableHead className="text-[#163681]">Minimum</TableHead>
                    <TableHead className="text-[#163681]">Satuan</TableHead>
                    <TableHead className="text-[#163681]">Status</TableHead>
                    <TableHead className="text-[#163681]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIngredients.map((ingredient) => {
                    const outlet = outlets.find(o => o.id === ingredient.outlet_id);
                    
                    return (
                      <TableRow key={ingredient.id}>
                        <TableCell className="font-medium text-[#163681]">{ingredient.name}</TableCell>
                        <TableCell className="text-[#163681]/70">{outlet?.name || 'Unknown'}</TableCell>
                        <TableCell className="text-[#163681]/70">{ingredient.stock}</TableCell>
                        <TableCell className="text-[#163681]/70">{ingredient.min_stock}</TableCell>
                        <TableCell className="text-[#163681]/70">{ingredient.unit}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                              ingredient.status === 'Critical'
                                ? 'bg-red-100 text-red-700'
                                : ingredient.status === 'Low'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {ingredient.status === 'Critical' ? 'Kritis' : ingredient.status === 'Low' ? 'Rendah' : 'Aman'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#163681] text-[#163681] hover:bg-[#163681] hover:text-[#F8F102]"
                            onClick={() => {
                              const newQty = prompt('Masukkan jumlah stok baru:', ingredient.stock.toString());
                              if (newQty) {
                                handleUpdateStock(ingredient.id, parseInt(newQty));
                              }
                            }}
                          >
                            Update
                          </Button>
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
