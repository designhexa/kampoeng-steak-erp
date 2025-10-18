'use client';

import { useState, useEffect, useRef } from 'react';
import type { Identity } from 'spacetimedb';
import type { DbConnection } from '../spacetime_module_bindings';
import * as moduleBindings from '../spacetime_module_bindings';

export function useSpacetimeDB() {
  const [connected, setConnected] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [statusMessage, setStatusMessage] = useState('Connecting...');
  const connectionRef = useRef<DbConnection | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (isInitializedRef.current) {
      return;
    }
    isInitializedRef.current = true;

    const dbHost = 'wss://maincloud.spacetimedb.com';
    const dbName = process.env.NEXT_PUBLIC_SPACETIME_MODULE_NAME || 'kampoeng-steak-erp';

    const onConnect = (connection: DbConnection, id: Identity, _token: string) => {
      console.log('Connected to SpacetimeDB!');
      connectionRef.current = connection;
      setIdentity(id);
      setConnected(true);
      setStatusMessage('Connected');
      
      // Subscribe to all tables
      const queries = [
        'SELECT * FROM outlets',
        'SELECT * FROM users',
        'SELECT * FROM employees',
        'SELECT * FROM products',
        'SELECT * FROM sales',
        'SELECT * FROM sale_items',
        'SELECT * FROM suppliers',
        'SELECT * FROM ingredients',
        'SELECT * FROM purchase_orders',
        'SELECT * FROM distributions',
        'SELECT * FROM daily_checklists',
        'SELECT * FROM shift_reports',
        'SELECT * FROM candidates',
        'SELECT * FROM promotions',
        'SELECT * FROM assets',
        'SELECT * FROM cash_flow'
      ];
      
      connection
        .subscriptionBuilder()
        .onApplied(() => {
          console.log('Subscription applied successfully');
        })
        .onError((error: Error) => {
          console.error('Subscription error:', error);
          setStatusMessage(`Subscription error: ${error.message}`);
        })
        .subscribe(queries);
    };

    const onDisconnect = (_ctx: unknown, reason?: Error | null) => {
      const reasonStr = reason ? reason.message : 'No reason given';
      console.log('Disconnected:', reasonStr);
      setStatusMessage(`Disconnected: ${reasonStr}`);
      connectionRef.current = null;
      setIdentity(null);
      setConnected(false);
    };

    try {
      moduleBindings.DbConnection.builder()
        .withUri(dbHost)
        .withModuleName(dbName)
        .onConnect(onConnect)
        .onDisconnect(onDisconnect)
        .build();
    } catch (error) {
      console.error('Failed to initialize SpacetimeDB:', error);
      setStatusMessage('Connection failed');
      setConnected(false);
    }

    // Cleanup function
    return () => {
      if (connectionRef.current) {
        try {
          connectionRef.current.close();
        } catch (error) {
          console.error('Error closing connection:', error);
        }
      }
    };
  }, []);

  return {
    connected,
    identity,
    statusMessage,
    connection: connectionRef.current,
  };
}
