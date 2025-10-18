'use client';

import React, { useMemo } from 'react';
import { useSpacetimeDB } from '../hooks/use-spacetime';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Timestamp } from 'spacetimedb';

export function DebugPanel() {
  const { connection, connected } = useSpacetimeDB();

  const tableStats = useMemo(() => {
    if (!connection?.db) return null;

    return {
      outlets: Array.from(connection.db.outlets.iter()).length,
      employees: Array.from(connection.db.employees.iter()).length,
      products: Array.from(connection.db.products.iter()).length,
      sales: Array.from(connection.db.sales.iter()).length,
      ingredients: Array.from(connection.db.ingredients.iter()).length,
      suppliers: Array.from(connection.db.suppliers.iter()).length,
      purchaseOrders: Array.from(connection.db.purchaseOrders.iter()).length,
      distributions: Array.from(connection.db.distributions.iter()).length,
      dailyChecklists: Array.from(connection.db.dailyChecklists.iter()).length,
      shiftReports: Array.from(connection.db.shiftReports.iter()).length,
      candidates: Array.from(connection.db.candidates.iter()).length,
      promotions: Array.from(connection.db.promotions.iter()).length,
      assets: Array.from(connection.db.assets.iter()).length,
      cashFlow: Array.from(connection.db.cashFlow.iter()).length,
      users: Array.from(connection.db.users.iter()).length,
    };
  }, [connection]);

  const createDummyOutlet = () => {
    if (!connection) return;
    connection.reducers.createOutlet('Test Outlet', 'Test Area', 'Test Address');
  };

  const createDummyProduct = () => {
    if (!connection) return;
    connection.reducers.addProduct('Test Product', 'Makanan', BigInt(50000 * 100), 'Test description');
  };

  const createDummyEmployee = () => {
    if (!connection) return;
    // Create employee for outlet ID 1
    connection.reducers.createEmployee(
      'Test Employee',
      'Kasir',
      BigInt(1),
      BigInt(3500000 * 100),
      { tag: 'Active' },
      Timestamp.now()
    );
  };

  if (!connected) {
    return (
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="text-red-700">Database Not Connected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Waiting for SpacetimeDB connection...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-500">
      <CardHeader>
        <CardTitle className="text-blue-700">Database Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Connection Status:</h3>
          <p className="text-green-600">✓ Connected to SpacetimeDB</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Table Record Counts:</h3>
          {tableStats && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Outlets: <span className="font-bold">{tableStats.outlets}</span></div>
              <div>Employees: <span className="font-bold">{tableStats.employees}</span></div>
              <div>Products: <span className="font-bold">{tableStats.products}</span></div>
              <div>Sales: <span className="font-bold">{tableStats.sales}</span></div>
              <div>Ingredients: <span className="font-bold">{tableStats.ingredients}</span></div>
              <div>Suppliers: <span className="font-bold">{tableStats.suppliers}</span></div>
              <div>Purchase Orders: <span className="font-bold">{tableStats.purchaseOrders}</span></div>
              <div>Distributions: <span className="font-bold">{tableStats.distributions}</span></div>
              <div>Daily Checklists: <span className="font-bold">{tableStats.dailyChecklists}</span></div>
              <div>Shift Reports: <span className="font-bold">{tableStats.shiftReports}</span></div>
              <div>Candidates: <span className="font-bold">{tableStats.candidates}</span></div>
              <div>Promotions: <span className="font-bold">{tableStats.promotions}</span></div>
              <div>Assets: <span className="font-bold">{tableStats.assets}</span></div>
              <div>Cash Flow: <span className="font-bold">{tableStats.cashFlow}</span></div>
              <div>Users: <span className="font-bold">{tableStats.users}</span></div>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Create Test Data:</h3>
          <div className="flex gap-2">
            <Button size="sm" onClick={createDummyOutlet}>
              + Outlet
            </Button>
            <Button size="sm" onClick={createDummyProduct}>
              + Product
            </Button>
            <Button size="sm" onClick={createDummyEmployee}>
              + Employee
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
