'use client';

import React, { useMemo, useState } from 'react';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardList, CheckSquare, XSquare, Plus, FileText } from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';
import { supabase } from '@/lib/supabase/client';

interface DailyChecklist {
  id: number;
  outlet_id: number;
  notes: string;
  completed: boolean;
  created_at: string;
}

interface ShiftReport {
  id: number;
  outlet_id: number;
  opening_cash: number;
  notes: string;
  closed: boolean;
  shift_date: string;
  created_at: string;
}

export default function OperasionalPage() {
  const { outlets, loading } = useSupabase();
  const [checklists, setChecklists] = useState<DailyChecklist[]>([]);
  const [shifts, setShifts] = useState<ShiftReport[]>([]);
  const [isChecklistOpen, setIsChecklistOpen] = useState<boolean>(false);
  const [isShiftOpen, setIsShiftOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [checklistForm, setChecklistForm] = useState({
    outletId: '',
    notes: '',
  });

  const [shiftForm, setShiftForm] = useState({
    outletId: '',
    openingCash: '',
    notes: '',
  });

  React.useEffect(() => {
    fetchChecklists();
    fetchShifts();
  }, []);

  const fetchChecklists = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('daily_checklists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChecklists(data || []);
    } catch (error) {
      console.error('Error fetching checklists:', error);
    }
  };

  const fetchShifts = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('shift_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShifts(data || []);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    }
  };

  const stats = useMemo(() => {
    const completedChecklists = checklists.filter((c) => c.completed).length;
    const openShifts = shifts.filter((s) => !s.closed).length;

    return {
      totalChecklists: checklists.length,
      completedChecklists,
      totalShifts: shifts.length,
      openShifts,
    };
  }, [checklists, shifts]);

  const handleCreateChecklist = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('daily_checklists').insert({
        outlet_id: parseInt(checklistForm.outletId),
        notes: checklistForm.notes,
        completed: false,
      });

      if (error) throw error;

      setChecklistForm({ outletId: '', notes: '' });
      setIsChecklistOpen(false);
      await fetchChecklists();
    } catch (error) {
      console.error('Error creating checklist:', error);
      alert('Gagal membuat checklist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateShift = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('shift_reports').insert({
        outlet_id: parseInt(shiftForm.outletId),
        opening_cash: parseFloat(shiftForm.openingCash),
        notes: shiftForm.notes,
        closed: false,
        shift_date: new Date().toISOString(),
      });

      if (error) throw error;

      setShiftForm({ outletId: '', openingCash: '', notes: '' });
      setIsShiftOpen(false);
      await fetchShifts();
    } catch (error) {
      console.error('Error creating shift:', error);
      alert('Gagal membuka shift');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleChecklistComplete = async (checklistId: number, currentStatus: boolean): Promise<void> => {
    try {
      const { error } = await supabase
        .from('daily_checklists')
        .update({ completed: !currentStatus })
        .eq('id', checklistId);

      if (error) throw error;

      await fetchChecklists();
    } catch (error) {
      console.error('Error updating checklist:', error);
      alert('Gagal mengupdate checklist');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#163681] mx-auto"></div>
          <p className="mt-4 text-[#163681]/70">Loading operational data...</p>
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
            <h1 className="text-xl md:text-2xl font-bold text-[#163681]">Operasional Outlet</h1>
            <p className="text-xs md:text-sm text-[#163681]/60">{checklists.length} checklist & {shifts.length} shift reports</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isChecklistOpen} onOpenChange={setIsChecklistOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#163681] hover:bg-[#163681]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Checklist Baru
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Buat Checklist Harian</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateChecklist} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="outlet">Outlet</Label>
                    <Select value={checklistForm.outletId} onValueChange={(value) => setChecklistForm({ ...checklistForm, outletId: value })}>
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

                  <div className="space-y-2">
                    <Label htmlFor="notes">Catatan</Label>
                    <Textarea
                      id="notes"
                      placeholder="Kebersihan, suhu kulkas, kelengkapan alat, dll"
                      value={checklistForm.notes}
                      onChange={(e) => setChecklistForm({ ...checklistForm, notes: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsChecklistOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-[#163681] hover:bg-[#163681]/90">
                      {isSubmitting ? 'Menyimpan...' : 'Buat Checklist'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isShiftOpen} onOpenChange={setIsShiftOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-blue-200 text-[#163681]">
                  <Plus className="mr-2 h-4 w-4" />
                  Open Shift
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Buka Shift Kasir</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateShift} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shiftOutlet">Outlet</Label>
                    <Select value={shiftForm.outletId} onValueChange={(value) => setShiftForm({ ...shiftForm, outletId: value })}>
                      <SelectTrigger id="shiftOutlet">
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

                  <div className="space-y-2">
                    <Label htmlFor="cash">Kas Awal (Rp)</Label>
                    <Input
                      id="cash"
                      type="number"
                      placeholder="0"
                      value={shiftForm.openingCash}
                      onChange={(e) => setShiftForm({ ...shiftForm, openingCash: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shiftNotes">Catatan Shift</Label>
                    <Textarea
                      id="shiftNotes"
                      placeholder="Kondisi awal shift, catatan khusus"
                      value={shiftForm.notes}
                      onChange={(e) => setShiftForm({ ...shiftForm, notes: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsShiftOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-[#163681] hover:bg-[#163681]/90">
                      {isSubmitting ? 'Menyimpan...' : 'Buka Shift'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-6">
            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Total Checklist</CardTitle>
                <ClipboardList className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.totalChecklists}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Selesai</CardTitle>
                <CheckSquare className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.completedChecklists}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Total Shift</CardTitle>
                <FileText className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.totalShifts}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Shift Buka</CardTitle>
                <XSquare className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.openShifts}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#163681]">
                  <ClipboardList className="h-5 w-5" />
                  Checklist Harian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-blue-200">
                        <TableHead className="text-[#163681]">Outlet</TableHead>
                        <TableHead className="text-[#163681]">Tanggal</TableHead>
                        <TableHead className="text-[#163681]">Status</TableHead>
                        <TableHead className="text-[#163681]">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {checklists.slice(0, 10).map((checklist) => {
                        const outlet = outlets.find((o) => o.id === checklist.outlet_id);
                        return (
                          <TableRow key={checklist.id} className="border-blue-100">
                            <TableCell className="font-medium text-[#163681]">{outlet?.name || '-'}</TableCell>
                            <TableCell className="text-[#163681]/70">{new Date(checklist.created_at).toLocaleDateString('id-ID')}</TableCell>
                            <TableCell>
                              {checklist.completed ? (
                                <CheckSquare className="h-5 w-5 text-green-600" />
                              ) : (
                                <XSquare className="h-5 w-5 text-gray-400" />
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleChecklistComplete(checklist.id, checklist.completed)}
                                className="border-blue-200 text-[#163681]"
                              >
                                {checklist.completed ? 'Batal' : 'Selesai'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#163681]">
                  <FileText className="h-5 w-5" />
                  Laporan Shift
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-blue-200">
                        <TableHead className="text-[#163681]">Outlet</TableHead>
                        <TableHead className="text-[#163681]">Kas Awal</TableHead>
                        <TableHead className="text-[#163681]">Tanggal</TableHead>
                        <TableHead className="text-[#163681]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shifts.slice(0, 10).map((shift) => {
                        const outlet = outlets.find((o) => o.id === shift.outlet_id);
                        return (
                          <TableRow key={shift.id} className="border-blue-100">
                            <TableCell className="font-medium text-[#163681]">{outlet?.name || '-'}</TableCell>
                            <TableCell className="text-[#163681]/70">
                              Rp {(shift.opening_cash ?? 0).toLocaleString('id-ID')}
                            </TableCell>
                            <TableCell className="text-[#163681]/70">
                              {shift.shift_date ? new Date(shift.shift_date).toLocaleDateString('id-ID') : '-'}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                  shift.closed
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-green-100 text-green-700'
                                }`}
                              >
                                {shift.closed ? 'Closed' : 'Open'}
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
          </div>
        </main>
      </div>
    </div>
  );
}
