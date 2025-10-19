import { BinaryWriter } from './common';

export interface DbConnectionBase {
  callReducer(name: string, args: Uint8Array, flags: string): void;
  onReducer(name: string, callback: (args: unknown) => void): void;
  offReducer(name: string, callback: (args: unknown) => void): void;
}

export type DbConnection = DbConnectionBase & {
  tables: Record<string, unknown>;
};

export type DbConnectionImpl = DbConnectionBase & {
  clientCache: ClientCache;
};

export interface DbConnectionBuilder {
  withUri(uri: string): DbConnectionBuilder;
  withModuleName(name: string): DbConnectionBuilder;
  onConnect(handler: () => void): DbConnectionBuilder;
  onDisconnect(handler: () => void): DbConnectionBuilder;
  build(): DbConnection;
}

export interface ClientCache {
  getOrCreateTable<T>(tableName: string): T[];
}

export interface SubscriptionBuilder {
  onTableChange(tableName: string, callback: (data: unknown) => void): SubscriptionBuilder;
  onReducerCall(reducerName: string, callback: (data: unknown) => void): SubscriptionBuilder;
  build(): void;
}

export interface SubscriptionBuilderImpl extends SubscriptionBuilder {
  connection: DbConnectionImpl;
}