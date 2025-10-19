'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, Clock, CheckCircle, TrendingUp, AlertCircle
} from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';

export default function OperasionalDashboard() {
  const router = useRouter();
  const { shiftReports = [] } = useSupabase();

  const openShifts = shiftReports.filter(s => s.status === 'Open');
  const closedShifts = shiftReports.filter(s => s.status === 'Closed');
  const todayShifts = shiftReports.filter(s => {
    const shiftDate = new Date(s.created_at).toDateString();
    const today = new Date().toDateString();
    return shiftDate === today;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 border-b bg-white px-4 md:px-6 py-4 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">Dashboard Operasional</h1>
            <p className="text-xs md:text-sm text-gray-600">Shift Reports & Operational Management</p>
          </div>
          <Button onClick={() => router.push('/operasional')} size="sm">
            Kelola Operasional
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Shifts</CardTitle>
                  <FileText className="h-4 w-4 text-violet-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{shiftReports.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Semua shift</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Hari Ini</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{todayShifts.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Shift hari ini</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Shift Aktif</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{openShifts.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Sedang berjalan</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Closed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-600">{closedShifts.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Selesai</p>
                </CardContent>
              </Card>
            </div>

            {/* Active Shifts */}
            {openShifts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base md:text-lg font-bold">Shift Aktif</h2>
                  <Button onClick={() => router.push('/operasional')} variant="outline" size="sm">
                    Lihat Semua
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {openShifts.map((shift) => (
                    <Card key={shift.id} className="hover:shadow-md transition-shadow border-green-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base">Shift #{shift.id}</CardTitle>
                            <p className="text-xs text-gray-500 mt-1">Outlet #{shift.outlet_id}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-700">
                            Active
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Manager:</span>
                            <span className="font-medium">{shift.manager_name || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Opening:</span>
                            <span className="font-medium">Rp {shift.opening_balance.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            Mulai: {new Date(shift.created_at).toLocaleString('id-ID')}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Closed Shifts */}
            <div>
              <h2 className="text-base md:text-lg font-bold mb-4">Shift Terbaru (Closed)</h2>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Shift ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Outlet</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Manager</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Opening</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Closing</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {closedShifts.slice(0, 10).map((shift) => (
                          <tr key={shift.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium">#{shift.id}</td>
                            <td className="px-4 py-3 text-sm">Outlet #{shift.outlet_id}</td>
                            <td className="px-4 py-3 text-sm">{shift.manager_name || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm">Rp {shift.opening_balance.toLocaleString('id-ID')}</td>
                            <td className="px-4 py-3 text-sm">
                              {shift.closing_balance ? `Rp ${shift.closing_balance.toLocaleString('id-ID')}` : '-'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                Closed
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alert for Open Shifts */}
            {openShifts.length === 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-blue-700">
                    <AlertCircle className="h-5 w-5" />
                    Tidak Ada Shift Aktif
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-600 mb-3">
                    Saat ini tidak ada shift yang sedang berjalan
                  </p>
                  <Button 
                    onClick={() => router.push('/operasional')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Buka Shift Baru
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
