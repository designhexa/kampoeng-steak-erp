'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  UserPlus, Users, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';

export default function RekrutmenDashboard() {
  const router = useRouter();
  const { candidates = [] } = useSupabase();

  const appliedCandidates = candidates.filter(c => c.status === 'Applied');
  const interviewCandidates = candidates.filter(c => c.status === 'Interview');
  const hiredCandidates = candidates.filter(c => c.status === 'Hired');
  const rejectedCandidates = candidates.filter(c => c.status === 'Rejected');

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 border-b bg-white px-4 md:px-6 py-4 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">Dashboard Rekrutmen</h1>
            <p className="text-xs md:text-sm text-gray-600">Recruitment & Candidate Management</p>
          </div>
          <Button onClick={() => router.push('/rekrutmen')} size="sm">
            Kelola Kandidat
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Kandidat</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{candidates.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Semua pelamar</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Proses Interview</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{interviewCandidates.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Sedang interview</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Hired</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{hiredCandidates.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Diterima</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
                  <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{rejectedCandidates.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Ditolak</p>
                </CardContent>
              </Card>
            </div>

            {/* Candidate Pipeline */}
            <div>
              <h2 className="text-base md:text-lg font-bold mb-4">Recruitment Pipeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-blue-500" />
                      New Applications ({appliedCandidates.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {appliedCandidates.slice(0, 5).map((candidate) => (
                        <div key={candidate.id} className="p-2 bg-blue-50 rounded">
                          <p className="text-sm font-medium">{candidate.name}</p>
                          <p className="text-xs text-gray-600">{candidate.position_applied}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(candidate.created_at).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      In Interview ({interviewCandidates.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {interviewCandidates.slice(0, 5).map((candidate) => (
                        <div key={candidate.id} className="p-2 bg-yellow-50 rounded">
                          <p className="text-sm font-medium">{candidate.name}</p>
                          <p className="text-xs text-gray-600">{candidate.position_applied}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(candidate.created_at).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Hired ({hiredCandidates.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {hiredCandidates.slice(0, 5).map((candidate) => (
                        <div key={candidate.id} className="p-2 bg-green-50 rounded">
                          <p className="text-sm font-medium">{candidate.name}</p>
                          <p className="text-xs text-gray-600">{candidate.position_applied}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(candidate.created_at).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
