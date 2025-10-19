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
import { UserPlus, FileText, UserCheck, UserX, Plus, ArrowUpDown } from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type Candidate = Database['public']['Tables']['candidates']['Row'];
type CandidateStatus = Candidate['status'];

export default function RekrutmenPage() {
  const { loading, outlets = [] } = useSupabase();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [addForm, setAddForm] = useState({
    name: '',
    position: '',
    outletId: '1',  // Default to first outlet
  });

  // Fetch candidates
  React.useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = candidates;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (search) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.position.toLowerCase().includes(search.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortOrder === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [candidates, statusFilter, search, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const applied = candidates.filter(c => c.status === 'Applied').length;
    const interview = candidates.filter(c => c.status === 'Interview').length;
    const hired = candidates.filter(c => c.status === 'Hired').length;
    const rejected = candidates.filter(c => c.status === 'Rejected').length;

    return { applied, interview, hired, rejected, total: candidates.length };
  }, [candidates]);

  const handleAddCandidate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('candidates').insert({
        name: addForm.name,
        position: addForm.position,
        outlet_id: parseInt(addForm.outletId),
        status: 'Applied',
      });

      if (error) throw error;

      setAddForm({ name: '', position: '', outletId: '1' });
      setIsDialogOpen(false);
      await fetchCandidates();
    } catch (error) {
      console.error('Error adding candidate:', error);
      alert('Gagal menambah kandidat');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCandidateStatus = async (candidateId: number, newStatus: CandidateStatus): Promise<void> => {
    try {
      const { error } = await supabase
        .from('candidates')
        .update({ status: newStatus })
        .eq('id', candidateId);

      if (error) throw error;

      await fetchCandidates();
    } catch (error) {
      console.error('Error updating candidate status:', error);
      alert('Gagal mengupdate status kandidat');
    }
  };

  const toggleSort = (): void => {
    if (sortBy === 'date') {
      setSortBy('name');
      setSortOrder('asc');
    } else if (sortBy === 'name' && sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortBy('date');
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#163681] mx-auto"></div>
          <p className="mt-4 text-[#163681]/70">Loading candidates...</p>
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
            <h1 className="text-xl md:text-2xl font-bold text-[#163681]">Rekrutmen & Onboarding</h1>
            <p className="text-xs md:text-sm text-[#163681]/60">{candidates.length} kandidat terdaftar</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#163681] hover:bg-[#163681]/90">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kandidat
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Kandidat Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCandidate} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="outletId">Outlet</Label>
                  <Select value={addForm.outletId} onValueChange={(value) => setAddForm({ ...addForm, outletId: value })}>
                    <SelectTrigger id="outletId">
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
                  <Label htmlFor="position">Posisi</Label>
                  <Select value={addForm.position} onValueChange={(value) => setAddForm({ ...addForm, position: value })}>
                    <SelectTrigger id="position">
                      <SelectValue placeholder="Pilih posisi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kasir">Kasir</SelectItem>
                      <SelectItem value="Koki">Koki</SelectItem>
                      <SelectItem value="Waiter">Waiter</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-[#163681] hover:bg-[#163681]/90">
                    {isSubmitting ? 'Menyimpan...' : 'Tambah Kandidat'}
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
                <CardTitle className="text-sm font-medium text-[#163681]/70">Total Kandidat</CardTitle>
                <UserPlus className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.total}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Lamar</CardTitle>
                <FileText className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.applied}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Diterima</CardTitle>
                <UserCheck className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.hired}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:border-[#163681] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Ditolak</CardTitle>
                <UserX className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.rejected}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#163681]">Daftar Kandidat</CardTitle>
              <div className="mt-4 flex gap-4 flex-wrap">
                <Input
                  placeholder="Cari kandidat..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm border-blue-200 focus:ring-[#163681]"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] border-blue-200 focus:ring-[#163681]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Hired">Hired</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={toggleSort} className="gap-2 border-blue-200 text-[#163681]">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort: {sortBy === 'name' ? 'Nama' : 'Tanggal'} ({sortOrder === 'asc' ? '↑' : '↓'})
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-blue-200">
                      <TableHead className="text-[#163681]">Nama</TableHead>
                      <TableHead className="text-[#163681]">Outlet</TableHead>
                      <TableHead className="text-[#163681]">Posisi</TableHead>
                      <TableHead className="text-[#163681]">Status</TableHead>
                      <TableHead className="text-[#163681]">Tanggal Lamar</TableHead>
                      <TableHead className="text-[#163681]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedCandidates.map((candidate) => (
                      <TableRow key={candidate.id} className="border-blue-100">
                        <TableCell className="font-medium text-[#163681]">{candidate.name}</TableCell>
                        <TableCell className="text-[#163681]/70">Outlet #{candidate.outlet_id}</TableCell>
                        <TableCell className="text-[#163681]/70">{candidate.position}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                              candidate.status === 'Hired'
                                ? 'bg-green-100 text-green-700'
                                : candidate.status === 'Rejected'
                                ? 'bg-red-100 text-red-700'
                                : candidate.status === 'Interview'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {candidate.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-[#163681]/70">
                          {new Date(candidate.created_at).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {candidate.status === 'Applied' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCandidateStatus(candidate.id, 'Interview')}
                                  className="border-blue-200 text-[#163681]"
                                >
                                  Interview
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCandidateStatus(candidate.id, 'Rejected')}
                                  className="text-red-600 border-red-200"
                                >
                                  Tolak
                                </Button>
                              </>
                            )}
                            {candidate.status === 'Interview' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCandidateStatus(candidate.id, 'Hired')}
                                  className="text-green-600 border-green-200"
                                >
                                  Terima
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCandidateStatus(candidate.id, 'Rejected')}
                                  className="text-red-600 border-red-200"
                                >
                                  Tolak
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
