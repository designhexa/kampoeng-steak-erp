'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wrench, CheckCircle, Clock, AlertTriangle
} from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';

export default function MaintenanceDashboard() {
  const router = useRouter();
  const { dailyChecklists = [] } = useSupabase();

  const completedChecklists = dailyChecklists.filter(c => c.completed);
  const pendingChecklists = dailyChecklists.filter(c => !c.completed);
  const todayChecklists = dailyChecklists.filter(c => {
    const checkDate = new Date(c.created_at).toDateString();
    const today = new Date().toDateString();
    return checkDate === today;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 border-b bg-white px-4 md:px-6 py-4 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">Dashboard Maintenance</h1>
            <p className="text-xs md:text-sm text-gray-600">Daily Checklist & Maintenance Management</p>
          </div>
          <Button onClick={() => router.push('/maintenance')} size="sm">
            Kelola Checklist
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Checklist</CardTitle>
                  <Wrench className="h-4 w-4 text-indigo-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dailyChecklists.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Semua checklist</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Hari Ini</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{todayChecklists.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Checklist hari ini</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Selesai</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{completedChecklists.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{pendingChecklists.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Belum selesai</p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Checklists */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-bold">Checklist Hari Ini</h2>
                <Button onClick={() => router.push('/maintenance')} variant="outline" size="sm">
                  Lihat Semua
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {todayChecklists.slice(0, 6).map((checklist) => (
                  <Card key={checklist.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{checklist.task}</CardTitle>
                          <p className="text-xs text-gray-500 mt-1">Outlet #{checklist.outlet_id}</p>
                        </div>
                        <Badge 
                          variant={checklist.completed ? 'default' : 'secondary'}
                          className={
                            checklist.completed 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }
                        >
                          {checklist.completed ? 'Selesai' : 'Pending'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium">{checklist.completed ? 'Selesai' : 'Pending'}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(checklist.created_at).toLocaleString('id-ID')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pending Tasks Alert */}
            {pendingChecklists.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-yellow-700">
                    <AlertTriangle className="h-5 w-5" />
                    Task Pending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-yellow-600 mb-3">
                    Ada {pendingChecklists.length} checklist yang belum diselesaikan
                  </p>
                  <Button 
                    onClick={() => router.push('/maintenance')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Lihat Task Pending
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
