'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, UserCheck, UserX, Clock, Briefcase
} from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';

export default function HRDashboard() {
  const router = useRouter();
  const { employees = [] } = useSupabase();

  const activeEmployees = employees.filter(e => e.status === 'Active');
  const inactiveEmployees = employees.filter(e => e.status === 'Inactive');
  const onLeaveEmployees = employees.filter(e => e.status === 'On Leave');

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 border-b bg-white px-4 md:px-6 py-4 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">Dashboard HR & Payroll</h1>
            <p className="text-xs md:text-sm text-gray-600">Manajemen karyawan dan penggajian</p>
          </div>
          <Button onClick={() => router.push('/hr')} size="sm">
            Kelola Karyawan
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Karyawan</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{employees.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Seluruh staff</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Karyawan Aktif</CardTitle>
                  <UserCheck className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{activeEmployees.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Sedang bekerja</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Sedang Cuti</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{onLeaveEmployees.length}</div>
                  <p className="text-xs text-gray-600 mt-1">On leave</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Tidak Aktif</CardTitle>
                  <UserX className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{inactiveEmployees.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Inactive</p>
                </CardContent>
              </Card>
            </div>

            {/* Employee List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-bold">Daftar Karyawan</h2>
                <Button onClick={() => router.push('/hr')} variant="outline" size="sm">
                  Lihat Semua
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeEmployees.slice(0, 6).map((employee) => (
                  <Card key={employee.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{employee.name}</CardTitle>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Briefcase className="h-3 w-3" />
                            {employee.position}
                          </div>
                        </div>
                        <Badge 
                          variant="default"
                          className="bg-green-100 text-green-700"
                        >
                          {employee.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">NIK:</span>
                          <span className="font-medium">{employee.nik}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Outlet:</span>
                          <span className="font-medium">Outlet #{employee.outlet_id}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Bergabung: {new Date(employee.hire_date).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
