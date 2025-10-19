'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Truck, FileText, CheckCircle, Clock
} from 'lucide-react';
import { useSupabase } from '@/contexts/supabase-context';

export default function PembelianDashboard() {
  const router = useRouter();
  const { purchaseOrders = [], suppliers = [] } = useSupabase();

  const pendingPO = purchaseOrders.filter(po => po.status === 'Pending');
  const approvedPO = purchaseOrders.filter(po => po.status === 'Approved');
  const rejectedPO = purchaseOrders.filter(po => po.status === 'Rejected');

  return (
    <div className="flex h-screen overflow-hidden">
      <CollapsibleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 border-b bg-white px-4 md:px-6 py-4 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">Dashboard Pembelian</h1>
            <p className="text-xs md:text-sm text-gray-600">Purchase Orders & Supplier Management</p>
          </div>
          <Button onClick={() => router.push('/pembelian')} size="sm">
            Kelola PO
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total PO</CardTitle>
                  <FileText className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{purchaseOrders.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Purchase orders</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{pendingPO.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Menunggu approval</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{approvedPO.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Disetujui</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Suppliers</CardTitle>
                  <Truck className="h-4 w-4 text-cyan-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{suppliers.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Vendor aktif</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Purchase Orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-bold">Purchase Orders Terbaru</h2>
                <Button onClick={() => router.push('/pembelian')} variant="outline" size="sm">
                  Lihat Semua
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">PO Number</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Supplier</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Outlet</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Status</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {purchaseOrders.slice(0, 10).map((po) => (
                          <tr key={po.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium">PO-{po.id}</td>
                            <td className="px-4 py-3 text-sm">Supplier #{po.supplier_id}</td>
                            <td className="px-4 py-3 text-sm">Outlet #{po.outlet_id}</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge 
                                variant={po.status === 'Approved' ? 'default' : po.status === 'Rejected' ? 'destructive' : 'secondary'}
                                className={
                                  po.status === 'Approved' 
                                    ? 'bg-green-100 text-green-700' 
                                    : po.status === 'Rejected'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }
                              >
                                {po.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-medium">
                              Rp {po.total.toLocaleString('id-ID')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
