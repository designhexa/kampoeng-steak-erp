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
import { Gift, Plus, Percent, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface Promotion {
  id: number;
  name: string;
  discount_type: string;
  discount_value: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

export default function PromoPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [formData, setFormData] = useState({
    name: '',
    discountType: '',
    discountValue: '',
    startDate: '',
    endDate: '',
  });

  React.useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromotions(data || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const now = new Date();
    const active = promotions.filter((p) => {
      const start = new Date(p.start_date);
      const end = new Date(p.end_date);
      return start <= now && end >= now;
    }).length;
    
    const upcoming = promotions.filter((p) => new Date(p.start_date) > now).length;
    const expired = promotions.filter((p) => new Date(p.end_date) < now).length;

    return { total: promotions.length, active, upcoming, expired };
  }, [promotions]);

  const handleCreatePromo = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!formData.name || !formData.discountType || !formData.discountValue || !formData.startDate || !formData.endDate) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('promotions').insert({
        name: formData.name,
        discount_type: formData.discountType,
        discount_value: parseFloat(formData.discountValue),
        start_date: formData.startDate,
        end_date: formData.endDate,
      });

      if (error) throw error;

      setFormData({
        name: '',
        discountType: '',
        discountValue: '',
        startDate: '',
        endDate: '',
      });
      setIsDialogOpen(false);
      await fetchPromotions();
    } catch (error) {
      console.error('Error creating promotion:', error);
      alert('Gagal membuat promo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#163681] mx-auto"></div>
          <p className="mt-4 text-[#163681]/70">Loading promotions...</p>
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
            <h1 className="text-xl md:text-2xl font-bold text-[#163681]">Promo & Loyalty</h1>
            <p className="text-xs md:text-sm text-[#163681]/60">{promotions.length} program promo</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#163681] hover:bg-[#163681]/90">
                <Plus className="mr-2 h-4 w-4" />
                Buat Promo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buat Program Promo Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreatePromo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Promo</Label>
                  <Input
                    id="name"
                    placeholder="Diskon Akhir Tahun"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountType">Tipe Diskon</Label>
                  <Select value={formData.discountType} onValueChange={(value) => setFormData({ ...formData, discountType: value })}>
                    <SelectTrigger id="discountType">
                      <SelectValue placeholder="Pilih tipe diskon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Persentase (%)</SelectItem>
                      <SelectItem value="fixed">Nominal (Rp)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountValue">
                    Nilai Diskon {formData.discountType === 'percentage' ? '(%)' : '(Rp)'}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    placeholder="0"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Mulai</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Berakhir</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-[#163681] hover:bg-[#163681]/90">
                    {isSubmitting ? 'Menyimpan...' : 'Buat Promo'}
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
                <CardTitle className="text-sm font-medium text-[#163681]/70">Total Promo</CardTitle>
                <Gift className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.total}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Aktif</CardTitle>
                <DollarSign className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.active}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Akan Datang</CardTitle>
                <Percent className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.upcoming}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Expired</CardTitle>
                <Gift className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.expired}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#163681]">
                <Gift className="h-5 w-5" />
                Program Promo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-blue-200">
                      <TableHead className="text-[#163681]">Nama Promo</TableHead>
                      <TableHead className="text-[#163681]">Tipe Diskon</TableHead>
                      <TableHead className="text-[#163681]">Nilai</TableHead>
                      <TableHead className="text-[#163681]">Mulai</TableHead>
                      <TableHead className="text-[#163681]">Berakhir</TableHead>
                      <TableHead className="text-[#163681]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {promotions.map((promo) => {
                      const now = new Date();
                      const startDate = new Date(promo.start_date);
                      const endDate = new Date(promo.end_date);
                      const isActive = startDate <= now && endDate >= now;
                      const isUpcoming = startDate > now;
                      
                      return (
                        <TableRow key={promo.id} className="border-blue-100">
                          <TableCell className="font-medium text-[#163681]">{promo.name}</TableCell>
                          <TableCell className="text-[#163681]/70">{promo.discount_type === 'percentage' ? 'Persentase' : 'Nominal'}</TableCell>
                          <TableCell className="text-[#163681]/70">
                            {promo.discount_type === 'percentage' 
                              ? `${promo.discount_value}%`
                              : `Rp ${promo.discount_value.toLocaleString('id-ID')}`
                            }
                          </TableCell>
                          <TableCell className="text-[#163681]/70">{new Date(promo.start_date).toLocaleDateString('id-ID')}</TableCell>
                          <TableCell className="text-[#163681]/70">{new Date(promo.end_date).toLocaleDateString('id-ID')}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                isActive
                                  ? 'bg-green-100 text-green-700'
                                  : isUpcoming
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {isActive ? 'Aktif' : isUpcoming ? 'Upcoming' : 'Expired'}
                            </span>
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
