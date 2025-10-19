import { BinaryWriter } from './common';

export interface DbConnectionBase {
  callReducer(name: string, args: Uint8Array, flags: string): void;
  onReducer(name: string, callback: Function): void;
  offReducer(name: string, callback: Function): void;
}

export type DbConnection = DbConnectionBase & {
  tables: Record<string, any>;
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
  onTableChange(tableName: string, callback: Function): SubscriptionBuilder;
  onReducerCall(reducerName: string, callback: Function): SubscriptionBuilder;
  build(): void;
}

export interface SubscriptionBuilderImpl extends SubscriptionBuilder {
  connection: DbConnectionImpl;
}