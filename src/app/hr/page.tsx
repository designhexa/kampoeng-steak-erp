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
import { Users, UserCheck, UserX, DollarSign, Plus } from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';
import { supabase } from '@/lib/supabase/client';

export default function HRPage() {
  const { employees, outlets, loading, refreshData } = useSupabase();
  const [search, setSearch] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [addForm, setAddForm] = useState({
    name: '',
    position: '',
    outlet_id: '',
    salary: '',
  });

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.position.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  const stats = useMemo(() => {
    const active = employees.filter(e => e.status === 'Active').length;
    const inactive = employees.filter(e => e.status === 'Inactive').length;
    const totalSalary = employees.reduce((sum, e) => sum + Number(e.salary), 0);

    return { active, inactive, total: employees.length, totalSalary };
  }, [employees]);

  const handleAddEmployee = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('employees').insert({
        name: addForm.name,
        position: addForm.position,
        outlet_id: parseInt(addForm.outlet_id),
        salary: parseInt(addForm.salary),
        status: 'Active',
      });

      if (error) throw error;

      setAddForm({ name: '', position: '', outlet_id: '', salary: '' });
      setIsAddDialogOpen(false);
      await refreshData();
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Gagal menambah karyawan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateEmployeeStatus = async (employeeId: number, newStatus: 'Active' | 'Inactive'): Promise<void> => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({ status: newStatus })
        .eq('id', employeeId);

      if (error) throw error;

      await refreshData();
    } catch (error) {
      console.error('Error updating employee status:', error);
      alert('Gagal mengupdate status karyawan');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#163681] mx-auto"></div>
          <p className="mt-4 text-[#163681]">Loading HR data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-blue-200 bg-white px-4 md:px-6 h-[73px] flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-[#163681]">HR & Payroll</h1>
            <p className="text-xs md:text-sm text-[#163681]/70">{employees.length} karyawan terdaftar</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#163681] hover:bg-[#163681]/90 text-[#F8F102]">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Karyawan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-[#163681]">Tambah Karyawan Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddEmployee} className="space-y-4">
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
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
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

                <div>
                  <Label htmlFor="salary">Gaji (Rp)</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={addForm.salary}
                    onChange={(e) => setAddForm({ ...addForm, salary: e.target.value })}
                    placeholder="5000000"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-[#163681] hover:bg-[#163681]/90 text-[#F8F102]">
                    {isSubmitting ? 'Menyimpan...' : 'Tambah Karyawan'}
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
                <CardTitle className="text-sm font-medium text-[#163681]/70">Total Karyawan</CardTitle>
                <Users className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.total}</div>
                <p className="text-xs text-[#163681]/60">Across all outlets</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Aktif</CardTitle>
                <UserCheck className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.active}</div>
                <p className="text-xs text-[#163681]/60">Status aktif</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Tidak Aktif</CardTitle>
                <UserX className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">{stats.inactive}</div>
                <p className="text-xs text-[#163681]/60">Status tidak aktif</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#163681]/70">Total Gaji</CardTitle>
                <DollarSign className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#163681]">
                  Rp {stats.totalSalary.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-[#163681]/60">Per bulan</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#163681]">Daftar Karyawan</CardTitle>
              <Input
                placeholder="Cari karyawan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-4 max-w-sm border-blue-200 focus:border-[#163681]"
              />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#163681]">Nama</TableHead>
                    <TableHead className="text-[#163681]">Posisi</TableHead>
                    <TableHead className="text-[#163681]">Outlet</TableHead>
                    <TableHead className="text-[#163681]">Gaji</TableHead>
                    <TableHead className="text-[#163681]">Status</TableHead>
                    <TableHead className="text-[#163681]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => {
                    const outlet = outlets.find(o => o.id === employee.outlet_id);
                    
                    return (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium text-[#163681]">{employee.name}</TableCell>
                        <TableCell className="text-[#163681]/70">{employee.position}</TableCell>
                        <TableCell className="text-[#163681]/70">{outlet?.name || 'Unknown'}</TableCell>
                        <TableCell className="text-[#163681]/70">Rp {Number(employee.salary).toLocaleString('id-ID')}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                              employee.status === 'Active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {employee.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#163681] text-[#163681] hover:bg-[#163681] hover:text-[#F8F102]"
                            onClick={() => 
                              updateEmployeeStatus(
                                employee.id, 
                                employee.status === 'Active' ? 'Inactive' : 'Active'
                              )
                            }
                          >
                            {employee.status === 'Active' ? 'Nonaktifkan' : 'Aktifkan'}
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
